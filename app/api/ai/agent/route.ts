import { NextResponse } from "next/server";
import { audit, requireServerUser } from "@/lib/server/auth";

export const runtime = "nodejs";

type AgentKey = "site" | "design" | "document" | "project" | "finance" | "procurement" | "quality";

const agents: Record<AgentKey, { name: string; role: string; system: string }> = {
  site: { name: "Site Agent", role: "Construction site intelligence", system: "You are the Mason & Arc Site Agent. Review site evidence and project context. Identify visible or reported progress, defects, safety observations, open issues, missing evidence and recommended actions. Never invent site facts." },
  design: { name: "Design Review Agent", role: "Architecture & coordination review", system: "You are the Mason & Arc Design Review Agent. Review supplied design/project information for architectural quality, coordination gaps, constructability, missing decisions and design risks. Separate observed facts from professional recommendations. Never invent drawings or dimensions." },
  document: { name: "Document Control Agent", role: "Drawings, revisions & approvals", system: "You are the Mason & Arc Document Control Agent. Review the supplied document register and project context for revision risks, missing approvals, superseded/current conflicts, overdue reviews and transmittal gaps. Never invent document metadata." },
  project: { name: "Project Manager Agent", role: "Schedule, priorities & delivery", system: "You are the Mason & Arc Project Manager Agent. Turn project context into an owner-level delivery briefing: critical priorities, blockers, dependencies, schedule threats, decisions required and next actions. Never invent dates or project facts." },
  finance: { name: "Finance Agent", role: "Cost & profitability intelligence", system: "You are the Mason & Arc Finance Agent. Analyze supplied financial/project data for cash, pending items, budget pressure, profitability signals and commercial risks. Do not invent prices, budgets or transactions. Clearly flag missing financial inputs." },
  procurement: { name: "Procurement Agent", role: "Materials, suppliers & purchasing", system: "You are the Mason & Arc Procurement Agent. Review procurement context for long-lead items, missing quotations, supplier gaps, needed-by risks and purchase priorities. Never invent supplier pricing or delivery commitments." },
  quality: { name: "QA/QC Agent", role: "Inspection, NCR & quality control", system: "You are the Mason & Arc QA/QC Agent. Review quality-control context for inspection priorities, incomplete evidence, defects, NCR-like risks and closeout actions. Never claim an inspection passed unless the supplied data says so." },
};

export async function POST(request: Request) {
  try {
    const user = await requireServerUser(["Owner", "Manager", "Engineer"]);
    const body = await request.json();
    const key = String(body?.agent || "project") as AgentKey;
    const agent = agents[key] || agents.project;
    const context = String(body?.context || "").trim();
    const instruction = String(body?.instruction || "Run your agent review and give me the highest-value actions.").trim();
    if (!context) return NextResponse.json({ error: "Studio context is required." }, { status: 400 });

    const baseUrl = (process.env.OLLAMA_URL || "http://127.0.0.1:11434").replace(/\/$/, "");
    const model = process.env.OLLAMA_MODEL || "qwen2.5vl:7b";
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        stream: false,
        messages: [
          { role: "system", content: `${agent.system}\n\nLANGUAGE:\n- Detect the language of the user's instruction. Reply in that language.\n- If Arabic is used, write clear professional Arabic and keep project names, IDs, technical codes and common engineering acronyms in their original form.\n- If the user mixes Arabic and English, use the dominant language naturally.\n\nOUTPUT FORMAT (MANDATORY):\n## Signal\nOne short line only. Start with 🟢 Stable, 🟡 Watch, 🟠 High Risk, or 🔴 Critical.\n## Issue\nMaximum 2 short bullets.\n## Evidence\nMaximum 3 bullets with concrete IDs/statuses/dates from the supplied context.\n## Impact\nMaximum 2 short bullets.\n## Action\nMaximum 3 numbered actions.\n## Decision\nOne short owner decision, or write “None required.”\n## Confidence\nHigh, Medium, or Low — with one short reason.\n\nSTYLE:\n- No Executive Summary. No long introduction. No repeated facts.\n- Keep the complete answer scannable and normally under 180 words.\n- Prefer short bullets and one-sentence statements.\n- Never use a wall of text.` },
          { role: "user", content: `STUDIO CONTEXT:\n${context}\n\nAGENT INSTRUCTION:\n${instruction}` },
        ],
        options: { temperature: 0.15 },
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) return NextResponse.json({ error: String(data?.error || `Could not connect to Ollama at ${baseUrl}.`) }, { status: 502 });
    const answer = String(data?.message?.content || "").trim();
    if (!answer) return NextResponse.json({ error: "The local agent returned no result." }, { status: 502 });
    await audit("ai.agent.completed", "AiUsage", undefined, { actor: user.id, agent: key, model, contextLength: context.length });
    return NextResponse.json({ agent: { key, name: agent.name, role: agent.role }, answer, model, provider: "local" });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unexpected AI Agent error." }, { status: 500 });
  }
}
