import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/server/auth";

export const runtime = "nodejs";
export const maxDuration = 240;

type Ref = { name?: string; type?: string; dataUrl?: string } | null;

const DEFAULT_UNET = "z_image_turbo_bf16.safetensors";
const DEFAULT_CLIP = "qwen_3_4b.safetensors";
const DEFAULT_VAE = "ae.safetensors";

function dataUrlToBuffer(dataUrl: string) {
  const match = dataUrl.match(/^data:[^;]+;base64,(.+)$/);
  if (!match) throw new Error("Invalid reference image.");
  return Buffer.from(match[1], "base64");
}

async function comfyJson(baseUrl: string, path: string, init?: RequestInit) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(String(data?.error || data?.message || `ComfyUI returned ${res.status}.`));
  }
  return data;
}

async function uploadReference(baseUrl: string, reference: Ref) {
  if (!reference?.dataUrl) return null;
  const form = new FormData();
  const bytes = dataUrlToBuffer(reference.dataUrl);
  form.append(
    "image",
    new Blob([bytes], { type: reference.type || "image/png" }),
    reference.name || "reference.png",
  );
  form.append("type", "input");
  form.append("overwrite", "true");
  const data = await comfyJson(baseUrl, "/upload/image", { method: "POST", body: form });
  return String(data?.name || reference.name || "reference.png");
}


function workflow({
  prompt,
  negative,
  referenceName,
  width,
  height,
  seed,
  steps,
  denoise,
}: {
  prompt: string;
  negative: string;
  referenceName?: string;
  width: number;
  height: number;
  seed: number;
  steps: number;
  denoise: number;
}) {
  const graph: Record<string, any> = {
    "1": {
      class_type: "UNETLoader",
      inputs: {
        unet_name: DEFAULT_UNET,
        weight_dtype: "fp8_e4m3fn",
      },
    },
    "2": {
      class_type: "CLIPLoader",
      inputs: {
        clip_name: DEFAULT_CLIP,
        type: "lumina2",
        device: "default",
      },
    },
    "3": {
      class_type: "VAELoader",
      inputs: { vae_name: DEFAULT_VAE },
    },
    "4": {
      class_type: "CLIPTextEncode",
      inputs: { text: prompt, clip: ["2", 0] },
    },
    "5": {
      class_type: "CLIPTextEncode",
      inputs: { text: negative, clip: ["2", 0] },
    },
    "6": {
      class_type: "ModelSamplingAuraFlow",
      inputs: { shift: 3, model: ["1", 0] },
    },
    "7": {
      class_type: "KSampler",
      inputs: {
        seed,
        steps,
        cfg: 1,
        sampler_name: "euler",
        scheduler: "simple",
        denoise,
        model: ["6", 0],
        positive: ["4", 0],
        negative: ["5", 0],
        latent_image: referenceName ? ["10", 0] : ["8", 0],
      },
    },
    "9": {
      class_type: "VAEDecode",
      inputs: { samples: ["7", 0], vae: ["3", 0] },
    },
    "11": {
      class_type: "SaveImage",
      inputs: { filename_prefix: "MasonArc", images: ["9", 0] },
    },
  };

  if (referenceName) {
    graph["10"] = {
      class_type: "VAEEncode",
      inputs: {
        pixels: ["12", 0],
        vae: ["3", 0],
      },
    };
    graph["12"] = {
      class_type: "LoadImage",
      inputs: { image: referenceName },
    };
  } else {
    graph["8"] = {
      class_type: "EmptySD3LatentImage",
      inputs: { width, height, batch_size: 1 },
    };
  }

  return graph;
}

export async function POST(request: Request) {
  try {
    await requireServerUser(["Owner", "Manager", "Engineer"]);
    const body = await request.json();
    const prompt = String(body?.prompt || "").trim();
    const reference = body?.reference && typeof body.reference === "object" ? body.reference : null;

    if (!prompt) {
      return NextResponse.json({ error: "Describe what you want to create." }, { status: 400 });
    }

    const baseUrl = (process.env.COMFYUI_URL || "http://127.0.0.1:8188").replace(/\/$/, "");
    await comfyJson(baseUrl, "/system_stats");

    // Do not use the combined object_info endpoint here. ComfyUI 0.35 can return
    // an empty object for comma-separated node requests even when every model is loaded.
    // The workflow below uses the exact Z-Image-Turbo model filenames directly;
    // ComfyUI itself remains the source of truth for validation.
    const referenceName = await uploadReference(baseUrl, reference);
    const enhancedPrompt = [
      prompt,
      "premium architectural visualization",
      "physically plausible architecture and materials",
      "accurate proportions and clean geometry",
      "professional architectural photography",
      "realistic daylight and controlled shadows",
      "high detail, refined composition",
    ].join(", ");
    const negative = "low quality, blurry, distorted architecture, warped geometry, duplicate windows, floating objects, broken perspective, text, watermark, oversaturated, cartoon";

    const width = Math.min(1024, Math.max(512, Number(body?.width) || 768));
    const height = Math.min(1024, Math.max(512, Number(body?.height) || 768));
    const steps = Math.min(9, Math.max(8, Number(body?.steps) || 8));
    const denoise = referenceName ? 0.62 : 1;
    const seed = Math.floor(Math.random() * 2 ** 31);

    const graph = workflow({
      prompt: enhancedPrompt,
      negative,
      referenceName: referenceName || undefined,
      width,
      height,
      seed,
      steps,
      denoise,
    });

    const queued = await comfyJson(baseUrl, "/prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: graph, client_id: "mason-arc-studio" }),
    });

    const promptId = String(queued?.prompt_id || "");
    if (!promptId) throw new Error("ComfyUI did not return a prompt id.");

    const deadline = Date.now() + 220000;
    while (Date.now() < deadline) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      const history = await comfyJson(baseUrl, `/history/${promptId}`);
      const item = history?.[promptId];
      if (!item) continue;
      if (item?.status?.status_str === "error" || item?.status?.completed === false && item?.status?.messages?.some((m: any[]) => String(m?.[0]) === "execution_error")) {
        const detail = Array.isArray(item?.status?.messages)
          ? item.status.messages
              .map((m: any[]) => Array.isArray(m) ? m.map((v) => typeof v === "string" ? v : JSON.stringify(v)).join(" ") : String(m))
              .filter(Boolean)
              .slice(-3)
              .join(" | ")
          : "";
        throw new Error(detail || "ComfyUI failed to execute the Z-Image workflow. Check the ComfyUI console for the exact node error.");
      }
      if (!item.outputs) continue;

      for (const output of Object.values(item.outputs) as any[]) {
        const images = Array.isArray(output?.images) ? output.images : [];
        const image = images[0];
        if (!image?.filename) continue;
        const qs = new URLSearchParams({
          filename: image.filename,
          subfolder: image.subfolder || "",
          type: image.type || "output",
        });
        const imageRes = await fetch(`${baseUrl}/view?${qs.toString()}`, { cache: "no-store" });
        if (!imageRes.ok) continue;
        const bytes = Buffer.from(await imageRes.arrayBuffer());
        const mime = image.filename.toLowerCase().endsWith(".jpg") || image.filename.toLowerCase().endsWith(".jpeg") ? "image/jpeg" : "image/png";
        return NextResponse.json({
          image: `data:${mime};base64,${bytes.toString("base64")}`,
          provider: "local",
          engine: "ComfyUI",
          model: DEFAULT_UNET,
          mode: referenceName ? "image-to-image" : "text-to-image",
          seed,
          width,
          height,
          steps,
        });
      }
    }

    throw new Error("Image generation timed out. Check ComfyUI for the execution status.");
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected local image generation error." },
      { status: 500 },
    );
  }
}
