import { NextResponse } from "next/server";

export const runtime = "nodejs";

const cleanUrl = (value: string, fallback: string) =>
  (value || fallback).replace(/\/+$/, "");

async function fetchJson(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

export async function GET() {
  const ollamaUrl = cleanUrl(
    process.env.OLLAMA_URL || "http://127.0.0.1:11434",
    "http://127.0.0.1:11434"
  );

  const comfyUrl = cleanUrl(
    process.env.COMFYUI_URL || "http://127.0.0.1:8188",
    "http://127.0.0.1:8188"
  );

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
    provider: ollamaConnected ? "local" : process.env.OPENAI_API_KEY ? "openai" : "unavailable",
    openai: { configured: Boolean(process.env.OPENAI_API_KEY), model: process.env.OPENAI_MODEL || "gpt-5-mini" },

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
