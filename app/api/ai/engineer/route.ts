import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/server/auth";

import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

export const runtime = "nodejs";
export const maxDuration = 180;

const execFileAsync = promisify(execFile);

const SYSTEM_PROMPT = `You are Mason & Arc AI Engineer, the intelligence layer of a premium architecture, construction and project-management studio. You are a senior architect/project engineer, owner-side advisor and project intelligence orchestrator.

RULES:

1. Treat supplied Studio Context as the source of truth for Mason & Arc project facts.

2. Never invent project facts, people, dates, budgets, approvals, files or progress.

3. Distinguish PROJECT FACTS, VISUAL EVIDENCE, ENGINEERING ASSESSMENT and RECOMMENDED ACTIONS when useful.

4. For structural, MEP, code and life-safety matters, flag licensed-professional/local-code verification.

5. If a photo/video is supplied, analyze only visible evidence. Never claim hidden conditions or exact dimensions.

6. If project identification is uncertain, give candidate projects and confidence rather than pretending certainty.

7. Owner briefings use: Executive Summary, Critical Risks, What Needs My Decision, Recommended Actions, Missing Information.

8. Keep answers practical and concise unless detail is requested.

9. Never claim an action was created, assigned, approved or changed unless the application actually performed it.`;

function decodeTextDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);

  if (!match) return "";

  try {
    return Buffer.from(match[2], "base64").toString("utf8");
  } catch {
    return "";
  }
}

function dataUrlBuffer(dataUrl: string) {
  const match = dataUrl.match(/^data:[^;]+;base64,(.+)$/);

  if (!match) {
    throw new Error("Invalid attachment data.");
  }

  return Buffer.from(match[1], "base64");
}

async function findFfmpeg() {
  const candidates: string[] = [];

  if (process.env.MASONARC_FFMPEG_PATH) {
    candidates.push(process.env.MASONARC_FFMPEG_PATH);
  }

  if (process.platform === "win32") {
    const localAppData = process.env.LOCALAPPDATA;

    if (localAppData) {
      candidates.push(
        path.join(
          localAppData,
          "Microsoft",
          "WinGet",
          "Packages",
          "Gyan.FFmpeg.Shared_Microsoft.Winget.Source_8wekyb3d8bbwe",
          "ffmpeg-9.0.1-full_build-shared",
          "bin",
          "ffmpeg.exe",
        ),
      );
    }

    candidates.push(
      "C:\\ffmpeg\\bin\\ffmpeg.exe",
      "C:\\Program Files\\ffmpeg\\bin\\ffmpeg.exe",
      "C:\\Program Files\\FFmpeg\\bin\\ffmpeg.exe",
    );
  } else {
    candidates.push("/usr/local/bin/ffmpeg", "/usr/bin/ffmpeg");
  }

  for (const candidate of candidates) {
    try {
      await fs.access(candidate);
      return candidate;
    } catch {
      // Try next candidate.
    }
  }

  return process.platform === "win32" ? "ffmpeg.exe" : "ffmpeg";
}

async function extractVideoFrames(dataUrl: string, type: string) {
  const buffer = dataUrlBuffer(dataUrl);

  const temp = await fs.mkdtemp(
    path.join(os.tmpdir(), "masonarc-video-"),
  );

  const input = path.join(temp, "input-video");
  const pattern = path.join(temp, "frame-%03d.jpg");

  try {
    await fs.writeFile(input, buffer);

    const ffmpeg = await findFfmpeg();

    // Keep the visual payload compact enough for the local vision model.
    // 4 frames sampled every 10 seconds is a safer default for a 4K/large upload.
    await execFileAsync(
      ffmpeg,
      [
        "-y",
        "-i",
        input,
        "-vf",
        "fps=1/10,scale=768:-2",
        "-frames:v",
        "4",
        pattern,
      ],
      {
        windowsHide: true,
        timeout: 120000,
      },
    );

    const files = (await fs.readdir(temp))
      .filter(
        (name) =>
          name.startsWith("frame-") &&
          name.endsWith(".jpg"),
      )
      .sort();

    const frames: string[] = [];

    for (const file of files) {
      const frame = await fs.readFile(
        path.join(temp, file),
      );

      frames.push(frame.toString("base64"));
    }

    if (!frames.length) {
      throw new Error(
        `Could not extract frames from ${type || "video"}.`,
      );
    }

    return frames;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : String(error);

    if (
      message.includes("ENOENT") ||
      message.toLowerCase().includes("not found") ||
      message.toLowerCase().includes("cannot find")
    ) {
      throw new Error(
        "Mason & Arc could not find FFmpeg. FFmpeg is installed, but the AI server cannot locate it. Set MASONARC_FFMPEG_PATH to the ffmpeg.exe path and restart the dev server.",
      );
    }

    throw new Error(
      `Video analysis failed while processing the video: ${message}`,
    );
  } finally {
    await fs.rm(temp, {
      recursive: true,
      force: true,
    }).catch(() => {});
  }
}

export async function POST(request: Request) {
  try {
    await requireServerUser(["Owner", "Manager", "Engineer"]);
    const body = await request.json();

    const question = String(body?.question || "").trim();
    const context = String(body?.context || "").trim();

    const attachment =
      body?.attachment &&
      typeof body.attachment === "object"
        ? body.attachment
        : null;

    if (!question && !attachment?.dataUrl) {
      return NextResponse.json(
        { error: "Please enter a question." },
        { status: 400 },
      );
    }

    const baseUrl = (
      process.env.OLLAMA_URL ||
      "http://127.0.0.1:11434"
    ).replace(/\/$/, "");

    const model =
      process.env.OLLAMA_MODEL || "qwen2.5vl:7b";

    const contentParts = [
      `STUDIO CONTEXT:\n${
        context || "No Studio context was supplied."
      }`,
      `OWNER QUESTION:\n${
        question || "Review the supplied project material."
      }`,
    ];

    let images: string[] = [];

    if (
      attachment?.dataUrl &&
      String(attachment.type || "").startsWith("image/")
    ) {
      const match = String(attachment.dataUrl).match(
        /^data:[^;]+;base64,(.+)$/,
      );

      if (match) {
        images = [match[1]];
      }

      contentParts.push(
        `IMAGE ATTACHMENT: ${String(
          attachment.name || "site-photo",
        )}. Identify visible architecture/site evidence, possible project match and confidence, progress indicators, issues, safety observations and recommended actions.`,
      );
    } else if (
      attachment?.dataUrl &&
      String(attachment.type || "").startsWith("video/")
    ) {
      images = await extractVideoFrames(
        String(attachment.dataUrl),
        String(attachment.type || "video"),
      );

      contentParts.push(
        `VIDEO ATTACHMENT: ${String(
          attachment.name || "site-video",
        )}. This video was sampled into ${
          images.length
        } frames. Analyze the sequence as a site walkthrough: identify likely project, zones, visible progress, issues, changes between frames, safety observations and recommended actions. Do not invent anything not visible.`,
      );
    } else if (
      attachment?.dataUrl &&
      (
        /^(text\/|application\/json|text\/csv)/i.test(
          String(attachment.type || ""),
        ) ||
        /\.(txt|csv|json)$/i.test(
          String(attachment.name || ""),
        )
      )
    ) {
      const text = decodeTextDataUrl(
        String(attachment.dataUrl),
      );

      contentParts.push(
        `ATTACHED DOCUMENT CONTENT:\n${text.slice(
          0,
          50000,
        )}`,
      );
    } else if (attachment?.name) {
      contentParts.push(
        `ATTACHMENT: ${String(
          attachment.name,
        )} was supplied, but this local adapter supports image/video vision and text/CSV/JSON directly. For PDF review, provide screenshots or extracted text.`,
      );
    }

    // This is the Ollama request:
    // Frontend -> Mason & Arc API -> Ollama /api/chat
    const response = await fetch(
      `${baseUrl}/api/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          stream: false,
          messages: [
            {
              role: "system",
              content: SYSTEM_PROMPT,
            },
            {
              role: "user",
              content: contentParts.join("\n\n"),
              ...(images.length ? { images } : {}),
            },
          ],
          options: {
            temperature: 0.2,
            // Increase the local Ollama context from the default 4096.
            num_ctx: 16384,
          },
        }),
      },
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `${String(
            data?.error ||
              `Could not connect to local Ollama at ${baseUrl}.`,
          )} Make sure model '${model}' is installed.`,
        },
        { status: 502 },
      );
    }

    const answer = String(
      data?.message?.content || "",
    ).trim();

    if (!answer) {
      return NextResponse.json(
        {
          error: "The local AI returned no text.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      answer,
      model,
      provider: "local",
      baseUrl,
      analyzedFrames:
        images.length || undefined,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return NextResponse.json(
      {
        error: /fetch failed|ECONNREFUSED|network/i.test(message)
          ? "The office AI is running locally, but this hosted workspace needs a secure office-AI bridge before it can reach it."
          : message || "Unexpected local AI Engineer error.",
      },
      { status: 500 },
    );
  }
}
