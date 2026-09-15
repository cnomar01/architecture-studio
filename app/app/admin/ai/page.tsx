"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Activity, ArrowRight, Brain, Camera, FileSearch, Gauge, ShieldAlert, Sparkles, Users, Workflow, Wand2 } from "lucide-react";
import { getProjects } from "@/lib/core/projectStore";
import { getTasks } from "@/app/app/admin/tasks/taskStore";
import { getApprovals } from "@/app/app/admin/approvals/approvalStore";
import { getFinanceTransactions } from "@/app/app/admin/finance/financeStore";
import { getSiteReports } from "@/app/app/engineer/site/siteStore";
import { getFiles } from "@/app/app/admin/files/fileStore";
import { getUsers } from "@/lib/core/authStore";

const capabilities = [
  { title: "Project Brain", text: "Ask questions across live projects, tasks, approvals, site, files and finance.", icon: Brain, href: "/app/admin/brain" },
  { title: "Vision Inspector", text: "Upload site photos, drawings and project material for evidence-first AI review.", icon: Camera, href: "/app/admin/brain" },
  { title: "Image Studio", text: "Generate architectural concepts or transform a supplied building/site reference image.", icon: Wand2, href: "/app/admin/brain?mode=create" },
  { title: "Document Intelligence", text: "Turn project documents into findings, missing information and action lists.", icon: FileSearch, href: "/app/admin/brain" },
  { title: "Risk Engine", text: "Reason across schedule, approvals, site issues, workload and financial signals.", icon: ShieldAlert, href: "/app/admin/intelligence" },
  { title: "Team Intelligence", text: "Use workload and capacity signals to support smarter assignment decisions.", icon: Users, href: "/app/admin/team" },
  { title: "Command Mode", text: "Start with an owner briefing, tomorrow plan, risk scan or project review.", icon: Workflow, href: "/app/admin/brain" },
];

export default function AIStudioPage() {
  const stats = useMemo(() => {
    const projects = getProjects();
    const tasks = getTasks();
    const approvals = getApprovals();
    const reports = getSiteReports();
    const files = getFiles();
    const finance = getFinanceTransactions();
    const active = getUsers().filter((u) => u.active);
    return {
      projects: projects.length,
      openTasks: tasks.filter((t) => t.status !== "Completed").length,
      overdue: tasks.filter((t) => t.status === "Overdue").length,
      pendingApprovals: approvals.filter((a) => String(a.status).toLowerCase().includes("pending")).length,
      siteIssues: reports.flatMap((r) => r.issues || []).filter((i) => i.status !== "Resolved").length,
      files: files.length,
      finance: finance.length,
      team: active.length,
    };
  }, []);

  const askLinks = [
    ["Owner briefing", "Give me today's owner briefing."],
    ["Risk scan", "Scan the studio and tell me the top risks, evidence and recommended actions."],
    ["Tomorrow mode", "Prepare tomorrow's priorities and explain why they should be in this order."],
    ["Team check", "Analyze the team's workload and tell me who needs attention and why."],
  ];

  return (
    <main className="min-h-screen bg-[#111111] px-5 py-8 text-white md:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/40">
                <Sparkles size={13} /> Mason & Arc Intelligence
              </div>
              <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">AI Studio OS</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/50">
                One intelligence layer for projects, site, documents, risk, team capacity, owner decisions and architectural creation.
              </p>
            </div>
            <Link href="/app/admin/brain" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs hover:bg-white/[0.05]">
              Open AI Engineer <ArrowRight size={14} />
            </Link>
          </div>
        </header>

        <section className="grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {([
            { label: "Projects", value: stats.projects, Icon: Activity },
            { label: "Open tasks", value: stats.openTasks, Icon: Workflow },
            { label: "Overdue", value: stats.overdue, Icon: ShieldAlert },
            { label: "Pending approvals", value: stats.pendingApprovals, Icon: Gauge },
            { label: "Open site issues", value: stats.siteIssues, Icon: Camera },
            { label: "Files", value: stats.files, Icon: FileSearch },
            { label: "Finance records", value: stats.finance, Icon: Gauge },
            { label: "Active team", value: stats.team, Icon: Users },
          ] as Array<{ label: string; value: number; Icon: typeof Activity }>).map(({ label, value, Icon }) => (
            <div key={label} className="bg-[#111111] p-5">
              <div className="flex items-center justify-between text-white/35">
                <span className="text-[10px] uppercase tracking-[0.18em]">{label}</span>
                <Icon size={14} />
              </div>
              <div className="mt-3 text-3xl font-semibold">{value}</div>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold"><Brain size={16} /> Command Center</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {askLinks.map(([title, prompt]) => (
                <Link key={title} href={`/app/admin/brain?prompt=${encodeURIComponent(prompt)}`} className="group rounded-xl border border-white/10 p-4 transition hover:border-white/25 hover:bg-white/[0.03]">
                  <div className="text-sm font-medium">{title}</div>
                  <div className="mt-2 text-xs leading-5 text-white/40">{prompt}</div>
                  <div className="mt-4 flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-white/35 group-hover:text-white/70">Run in AI Engineer <ArrowRight size={12} /></div>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold"><Activity size={16} /> Intelligence Pipeline</div>
            <div className="space-y-4">
              {[
                ["SEE", "Photos, drawings, documents and project signals"],
                ["UNDERSTAND", "Project context, history and relationships"],
                ["DETECT", "Risks, delays, anomalies and missing information"],
                ["DECIDE", "Priorities, recommendations and assignments"],
                ["ACT", "Tasks, issues, reports and notifications with approval gates"],
              ].map(([stage, text], index) => (
                <div key={stage} className="flex gap-4">
                  <div className="grid h-7 w-20 shrink-0 place-items-center rounded-md border border-white/10 text-[9px] font-semibold tracking-[0.18em]">{index + 1} · {stage}</div>
                  <p className="text-xs leading-5 text-white/45">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 text-[10px] uppercase tracking-[0.25em] text-white/30">Capabilities</div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map(({ title, text, icon: Icon, href }) => (
              <Link key={title} href={href} className="rounded-2xl border border-white/10 p-5 transition hover:border-white/25 hover:bg-white/[0.03]">
                <Icon size={17} className="text-white/55" />
                <div className="mt-5 text-sm font-medium">{title}</div>
                <p className="mt-2 text-xs leading-5 text-white/40">{text}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-start gap-4">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-white/10"><Sparkles size={17} /></div>
            <div>
              <div className="text-sm font-semibold">The Mason & Arc advantage</div>
              <p className="mt-2 max-w-3xl text-xs leading-6 text-white/45">
                Every project can become structured knowledge: decisions, revisions, site findings, risks and lessons learned.
                V4 establishes the intelligence layer; production-grade persistent memory and database-backed retrieval should be the next infrastructure step.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
