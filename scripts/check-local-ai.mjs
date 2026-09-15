const ollama = process.env.OLLAMA_URL || "http://127.0.0.1:11434";
const comfy = process.env.COMFYUI_URL || "http://127.0.0.1:8188";
const check = async (url) => { try { const r = await fetch(url); return r.ok; } catch { return false; } };
const [o, c] = await Promise.all([check(`${ollama}/api/tags`), check(`${comfy}/system_stats`)]);
console.log(`Ollama: ${o ? "READY" : "OFFLINE"}`);
console.log(`ComfyUI: ${c ? "READY" : "OFFLINE"}`);
process.exit(o && c ? 0 : 1);
