const trimUrl = (value: string) => value.replace(/\/+$/, "");

export function officeAiUrl(kind: "ollama" | "comfyui") {
  const bridge = process.env.OFFICE_AI_BRIDGE_URL?.trim();

  if (bridge) {
    return `${trimUrl(bridge)}/${kind}`;
  }

  return trimUrl(
    kind === "ollama"
      ? process.env.OLLAMA_URL || "http://127.0.0.1:11434"
      : process.env.COMFYUI_URL || "http://127.0.0.1:8188",
  );
}

export function officeAiHeaders(extra: HeadersInit = {}) {
  const headers = new Headers(extra);
  const token = process.env.OFFICE_AI_BRIDGE_TOKEN?.trim();

  if (token && process.env.OFFICE_AI_BRIDGE_URL?.trim()) {
    headers.set("x-masonarc-office-key", token);
  }

  return headers;
}

export function usingOfficeAiBridge() {
  return Boolean(
    process.env.OFFICE_AI_BRIDGE_URL?.trim() &&
      process.env.OFFICE_AI_BRIDGE_TOKEN?.trim(),
  );
}
