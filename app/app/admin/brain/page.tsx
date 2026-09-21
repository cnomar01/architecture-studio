"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AlertTriangle, Brain, Camera, CheckCircle2, CircleAlert, Download, FileText, ImagePlus, Paperclip, RefreshCw, Send, Sparkles, Wand2, X } from "lucide-react";
import { getStudioContext, type StudioContext } from "@/lib/client/studioContext";

type Message = { role: "user" | "assistant"; content: string; attachment?: { name: string; type: string } };
type Attachment = { file: File; dataUrl: string };

const starters = [
  "Give me today's owner briefing.",
  "What is the biggest risk right now?",
  "What should I focus on tomorrow?",
  "Review the City Edge Mall project status.",
  "Analyze my team's workload and tell me who needs attention.",
  "Act as my senior architect and tell me what I should check on site.",
];

function RenderAnswer({ content }: { content: string }) {
  const lines = content.split(/\r?\n/);
  return (
    <div className="space-y-2 text-[13px] leading-6">
      {lines.map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={index} className="h-1" />;
        if (/^#{1,4}\s/.test(trimmed)) return <h3 key={index} className="pt-2 text-sm font-semibold tracking-tight">{trimmed.replace(/^#{1,4}\s+/, "")}</h3>;
        if (/^[-*]\s+/.test(trimmed)) return <div key={index} className="flex gap-2"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-black/50" /><span>{formatInline(trimmed.replace(/^[-*]\s+/, ""))}</span></div>;
        if (/^\d+[.)]\s+/.test(trimmed)) return <div key={index} className="flex gap-2"><span className="font-semibold text-black/45">{trimmed.match(/^\d+[.)]/)?.[0]}</span><span>{formatInline(trimmed.replace(/^\d+[.)]\s+/, ""))}</span></div>;
        return <p key={index}>{formatInline(trimmed)}</p>;
      })}
    </div>
  );
}

function formatInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => part.startsWith("**") && part.endsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part);
}

export default function BrainPage() {
  const [mode, setMode] = useState<"engineer" | "create">("engineer");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [projectId, setProjectId] = useState("");
  const [createPrompt, setCreatePrompt] = useState("");
  const [reference, setReference] = useState<Attachment | null>(null);
  const [generated, setGenerated] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generationError, setGenerationError] = useState("");
  const [aiStatus, setAiStatus] = useState<{ ollama: boolean; comfyui: boolean; model: string } | null>(null);
  const [studio, setStudio] = useState<StudioContext | null>(null);
  const [studioError, setStudioError] = useState("");
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const referenceRef = useRef<HTMLInputElement>(null);
  const projects = studio?.projects || [];

  async function refreshStudioContext() {
    try { const value = await getStudioContext(); setStudio(value); setStudioError(""); return value; }
    catch (error) { const message = error instanceof Error ? error.message : "Could not load live studio context."; setStudioError(message); throw new Error(message); }
  }

  async function refreshAIStatus() {
    try {
      const res = await fetch("/api/ai/status", { cache: "no-store" });
      const data = await res.json();
      setAiStatus({ ollama: Boolean(data.ollama?.connected), comfyui: Boolean(data.comfyui?.zImageReady || data.comfyui?.connected), model: String(data.ollama?.model || "AI model") });
    } catch {
      setAiStatus({ ollama: false, comfyui: false, model: "AI unavailable" });
    }
  }

  useEffect(() => {
    void refreshAIStatus();
    void refreshStudioContext().catch(() => {});
    const retry = window.setInterval(() => { void refreshAIStatus(); }, 5000);
    return () => window.clearInterval(retry);
  }, []);

  useEffect(() => {
    const prompt = searchParams.get("prompt");
    const requestedMode = searchParams.get("mode");
    if (requestedMode === "create") setMode("create");
    if (prompt && !question && messages.length === 0) setQuestion(prompt);
  }, [searchParams, question, messages.length]);

  function readFile(file: File, setter: (value: Attachment) => void) {
    const maxSize = file.type.startsWith("video/")
      ? 500 * 1024 * 1024
      : file.type.startsWith("image/")
        ? 10 * 1024 * 1024
        : 50 * 1024 * 1024;

    if (file.size > maxSize) {
      const limitLabel = file.type.startsWith("video/")
        ? "500 MB"
        : file.type.startsWith("image/")
          ? "10 MB"
          : "50 MB";

      alert(`Please keep this file under ${limitLabel}.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setter({ file, dataUrl: String(reader.result) });
    reader.onerror = () => alert("Could not read this file.");
    reader.readAsDataURL(file);
  }

  async function ask(q = question) {
    const clean = q.trim();
    if ((!clean && !attachment) || loading) return;
    const attachmentForRequest = attachment;
    setQuestion("");
    setMessages((m) => [...m, { role: "user", content: clean || "Analyze this upload.", attachment: attachmentForRequest ? { name: attachmentForRequest.file.name, type: attachmentForRequest.file.type } : undefined }]);
    setLoading(true);
    try {
      const liveStudio = await refreshStudioContext();
      const res = await fetch("/api/ai/engineer", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: clean || "Analyze the uploaded project material and identify important observations, risks, missing information and recommended actions.", context: liveStudio.context, mode: "owner", projectId, attachment: attachmentForRequest ? { name: attachmentForRequest.file.name, type: attachmentForRequest.file.type, dataUrl: attachmentForRequest.dataUrl } : null }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI request failed.");
      setMessages((m) => [...m, { role: "assistant", content: data.answer }]);
    } catch (error) { setMessages((m) => [...m, { role: "assistant", content: error instanceof Error ? error.message : "The AI Engineer could not complete the request." }]); }
    finally { setLoading(false); setAttachment(null); }
  }

  async function generateImage() {
    if (!createPrompt.trim() || generating) return;
    setGenerating(true); setGenerated(null); setGenerationError("");
    try {
      const res = await fetch("/api/ai/generate-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt: createPrompt, reference: reference ? { name: reference.file.name, type: reference.file.type, dataUrl: reference.dataUrl } : null, size: "1536x1024", quality: "high" }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image generation failed.");
      setGenerated(data.image);
    } catch (error) { setGenerationError(error instanceof Error ? error.message : "Image generation failed."); }
    finally { setGenerating(false); }
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <header className="mb-6 flex flex-col gap-5 border-b border-black/10 pb-7 md:flex-row md:items-end md:justify-between">
          <div><div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-black/50"><Sparkles size={14} /> Mason & Arc AI</div><h1 className="text-3xl font-semibold tracking-tight md:text-5xl">AI Engineer</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-black/60">Your senior project engineer, vision analyst and architectural creation engine.</p></div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-medium"><span className={`h-2 w-2 rounded-full ${aiStatus?.ollama ? "bg-emerald-500" : "bg-amber-500"}`} /> {aiStatus?.ollama ? `Office AI · ${aiStatus.model}` : "Office AI bridge needed"}</div>
            <button onClick={refreshAIStatus} className="grid h-9 w-9 place-items-center rounded-full border border-black/10" title="Refresh AI status"><RefreshCw size={13} /></button>
          </div>
        </header>

        <div className="mb-6 flex rounded-xl border border-black/10 bg-[#fafafa] p-1">
          <button onClick={() => setMode("engineer")} className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${mode === "engineer" ? "bg-black text-white" : "text-black/55"}`}><Brain size={16} /> Engineer & Analyze</button>
          <button onClick={() => setMode("create")} className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${mode === "create" ? "bg-black text-white" : "text-black/55"}`}><Wand2 size={16} /> Create Images</button>
        </div>

        {mode === "engineer" ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <main className="rounded-2xl border border-black/10 bg-[#fafafa] p-4 md:p-6">
              <div className="mb-5 flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-xl bg-black text-white"><Brain size={20} /></div><div className="min-w-0 flex-1"><div className="font-semibold">Owner Mode</div><div className="text-xs text-black/50">Private local intelligence · no OpenAI API credits required.</div></div><div className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] sm:flex ${aiStatus?.ollama ? "border-black/10 text-black/55" : "border-amber-200 text-amber-800"}`}><span className={`h-1.5 w-1.5 rounded-full ${aiStatus?.ollama ? "bg-emerald-500" : "bg-amber-500"}`} /> {aiStatus?.ollama ? "Connected" : "Office bridge needed"}</div></div>
              <div className="mb-5 space-y-3">
                {messages.length === 0 ? <div className="rounded-xl border border-dashed border-black/15 bg-white p-6"><div className="mb-4 text-sm font-medium">Try asking:</div><div className="grid gap-2 md:grid-cols-2">{starters.map((s) => <button key={s} onClick={() => ask(s)} className="rounded-lg border border-black/10 bg-white p-3 text-left text-sm transition hover:border-black/30">{s}</button>)}</div></div> : messages.map((m, i) => <div key={i} className={`rounded-xl p-4 ${m.role === "user" ? "ml-8 bg-black text-white" : "mr-8 border border-black/10 bg-white"}`}>{m.attachment && <div className="mb-2 flex items-center gap-2 text-xs opacity-70"><Paperclip size={13} /> {m.attachment.name}</div>}{m.role === "assistant" ? <RenderAnswer content={m.content} /> : <div className="text-sm leading-6">{m.content}</div>}</div>)}
                {loading && <div className="mr-8 flex items-center gap-2 rounded-xl border border-black/10 bg-white p-4 text-sm text-black/50"><span className="h-2 w-2 animate-pulse rounded-full bg-black" /> AI Engineer is analyzing…</div>}
              </div>
              {attachment && <div className="mb-2 flex items-center justify-between rounded-xl border border-black/10 bg-white px-3 py-2 text-xs"><div className="flex min-w-0 items-center gap-2"><Paperclip size={14} /><span className="truncate">{attachment.file.name}</span></div><button onClick={() => setAttachment(null)} aria-label="Remove upload"><X size={15} /></button></div>}
              <div className="mb-2 flex items-center gap-2"><select value={projectId} onChange={(e) => setProjectId(e.target.value)} className="rounded-lg border border-black/10 bg-white px-3 py-2 text-xs outline-none"><option value="">Project: Auto / Studio</option>{projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select><input ref={inputRef} type="file" accept="image/*,video/*,.pdf,.txt,.csv,.json" className="hidden" onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0], setAttachment)} /><button onClick={() => inputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-medium hover:border-black/30"><ImagePlus size={14} /> Upload photo / video / file</button></div>
              <div className="flex gap-2 rounded-xl border border-black/15 bg-white p-2"><input value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => e.key === "Enter" && ask()} placeholder="Ask your AI Engineer anything…" className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" /><button onClick={() => ask()} disabled={loading || (!question.trim() && !attachment)} className="grid h-9 w-9 place-items-center rounded-lg bg-black text-white disabled:opacity-30"><Send size={15} /></button></div>
            </main>
            <aside className="space-y-3"><div className="rounded-2xl border border-black/10 p-5"><div className="mb-4 flex items-center justify-between gap-2"><div className="flex items-center gap-2 text-sm font-semibold"><FileText size={15} /> Live Studio context</div><span className="text-[10px] uppercase tracking-[0.15em] text-black/30">Database</span></div>{studioError ? <p className="text-xs leading-5 text-red-700">{studioError}</p> : <div className="space-y-2 text-xs text-black/55"><div>Projects — {studio?.stats.projects ?? "…"}</div><div>Open tasks — {studio?.stats.openTasks ?? "…"}</div><div>Approvals — {studio?.stats.pendingApprovals ?? "…"} pending</div><div>Open site issues — {studio?.stats.siteIssues ?? "…"}</div><div>Files — {studio?.stats.files ?? "…"}</div><div>Team — {studio?.stats.team ?? "…"} active users</div></div>}</div><div className="rounded-2xl border border-black/10 bg-black p-5 text-white"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-sm font-semibold"><Wand2 size={15} /> Local Creation Engine</div><span className={`rounded-full px-2 py-1 text-[9px] uppercase tracking-[0.12em] ${aiStatus?.comfyui ? "bg-white/10 text-white/70" : "bg-amber-400/15 text-amber-100"}`}>{aiStatus?.comfyui ? "Ready" : "Office bridge needed"}</span></div><p className="mt-2 text-xs leading-5 text-white/55">The office engine is available locally. The hosted workspace needs a secure bridge before it can reach ComfyUI from another device.</p><button onClick={() => setMode("create")} className="mt-4 rounded-lg bg-white px-3 py-2 text-xs font-medium text-black">Open Image Studio</button></div><div className="rounded-2xl border border-black/10 p-5"><div className="flex items-center gap-2 text-sm font-semibold"><AlertTriangle size={15} /> Engineering note</div><p className="mt-2 text-xs leading-5 text-black/50">AI supports decisions. Structural, MEP, code and life-safety decisions require review by the responsible licensed professional.</p></div></aside>
          </div>
        ) : (
          <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-2xl border border-black/10 bg-[#fafafa] p-5 md:p-6">
              <div className="mb-5"><div className="flex items-center gap-2 text-sm font-semibold"><Wand2 size={17} /> Mason & Arc Image Studio</div><p className="mt-2 text-xs leading-5 text-black/50">Generate architectural concepts from a brief, or upload a reference photo and let the local Z-Image-Turbo engine transform it.</p></div>
              <textarea value={createPrompt} onChange={(e) => setCreatePrompt(e.target.value)} placeholder="Example: Create a premium modern facade for this building, warm stone, bronze metal, deep window reveals, landscape lighting, realistic architectural photography, dusk." className="min-h-40 w-full resize-y rounded-xl border border-black/10 bg-white p-4 text-sm leading-6 outline-none focus:border-black/30" />
              <div className="mt-3 flex flex-wrap gap-2"><button onClick={() => setCreatePrompt("Create 3 premium modern facade directions for this building. Keep the existing massing, improve material hierarchy, entrance presence and night lighting. Photorealistic architectural visualization.")} className="rounded-lg border border-black/10 px-3 py-2 text-xs hover:border-black/30">Modern facade</button><button onClick={() => setCreatePrompt("Create a luxury contemporary interior concept with refined stone, timber, indirect lighting and calm neutral materials. Photorealistic architectural visualization.")} className="rounded-lg border border-black/10 px-3 py-2 text-xs hover:border-black/30">Luxury interior</button><button onClick={() => setCreatePrompt("Create a high-end landscape concept with architectural planting, clean hardscape, integrated lighting and a premium hospitality feel.")} className="rounded-lg border border-black/10 px-3 py-2 text-xs hover:border-black/30">Landscape</button></div>
              <input ref={referenceRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && readFile(e.target.files[0], setReference)} />
              <div className="mt-5 rounded-xl border border-dashed border-black/15 bg-white p-4"><div className="flex items-center justify-between gap-3"><div><div className="text-sm font-medium">Reference image</div><div className="mt-1 text-xs text-black/45">Upload a building/site photo to transform it.</div></div><button onClick={() => referenceRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-black/10 px-3 py-2 text-xs font-medium"><Camera size={14} /> {reference ? "Replace" : "Upload"}</button></div>{reference && <div className="mt-3 flex items-center gap-2 text-xs"><span className="truncate">{reference.file.name}</span><button onClick={() => setReference(null)}><X size={14} /></button></div>}</div>
              <button onClick={generateImage} disabled={generating || !createPrompt.trim()} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-30">{generating ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Creating…</> : <><Sparkles size={16} /> Generate concept</>}</button>
              {generationError && <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-800">{generationError}</p>}
            </div>
            <div className="min-h-[520px] rounded-2xl border border-black/10 bg-[#fafafa] p-4 md:p-6">{generated ? <div><div className="mb-4 flex items-center justify-between"><div><div className="text-sm font-semibold">Generated concept</div><div className="text-xs text-black/45">Mason & Arc architectural visualization</div></div><a href={generated} download="mason-arc-concept.png" className="inline-flex items-center gap-2 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-medium"><Download size={14} /> Save</a></div><img src={generated} alt="Generated architectural concept" className="w-full rounded-xl border border-black/10 object-cover" /></div> : <div className="grid h-full min-h-[480px] place-items-center rounded-xl border border-dashed border-black/15 bg-white p-8 text-center"><div><div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-black text-white"><Wand2 size={22} /></div><div className="mt-5 text-sm font-semibold">Your concept appears here</div><p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-black/45">Describe the architecture, materials, mood, camera angle and lighting. Add a reference image when you want the AI to transform an existing building.</p></div></div>}</div>
          </section>
        )}
      </div>
    </div>
  );
}
