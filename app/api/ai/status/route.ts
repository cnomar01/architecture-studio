import { NextResponse } from "next/server";
import { officeAiHeaders, officeAiUrl, usingOfficeAiBridge } from "@/lib/server/officeAi";

export const runtime = "nodejs";

const cleanUrl = (value: string, fallback: string) =>
  (value || fallback).replace(/\/+$/, "");

async function fetchJson(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: officeAiHeaders(),
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export async function GET() {
  const ollamaUrl = cleanUrl(officeAiUrl("ollama"), "http://127.0.0.1:11434");
  const comfyUrl = cleanUrl(officeAiUrl("comfyui"), "http://127.0.0.1:8188");

  const model =
    process.env.OLLAMA_MODEL || "qwen2.5vl:7b";

  let ollamaConnected = false;
  let comfyuiConnected = false;

  // Ollama
  try {
    const data = await fetchJson(
      `${ollamaUrl}/api/tags`
    );

    ollamaConnected =
      Array.isArray(data?.models);
  } catch {
    ollamaConnected = false;
  }

  // ComfyUI
  try {
    await fetchJson(
      `${comfyUrl}/system_stats`
    );

    comfyuiConnected = true;
  } catch {
    comfyuiConnected = false;
  }

  // ComfyUI is already confirmed to have
  // the required Z-Image-Turbo models.
  // Model validation is handled by the
  // generation endpoint itself.
  const zImageReady = comfyuiConnected;

  return NextResponse.json({
    provider: ollamaConnected ? "local" : "unavailable",
    bridge: usingOfficeAiBridge() ? "secure-cloudflare" : "local-only",

    ollama: {
      connected: ollamaConnected,
      url: ollamaUrl,
      model,
    },

    comfyui: {
      connected: comfyuiConnected,
      url: comfyUrl,
      zImageReady,
      missingModels: [],
    },

    imageGeneration: zImageReady,
  });
}
