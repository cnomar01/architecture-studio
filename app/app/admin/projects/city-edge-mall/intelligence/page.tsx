"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileCheck2,
  HardHat,
  WalletCards,
  ArrowUpRight,
} from "lucide-react";

import { getTasks } from "@/app/app/admin/tasks/taskStore";
import { getSiteReports } from "@/app/app/engineer/site/siteStore";
import { getApprovals } from "@/app/app/admin/approvals/approvalStore";
import {
  getProjectFinance,
  getProjectBudget,
} from "@/app/app/admin/finance/financeStore";
import { getProjectFiles } from "@/app/app/admin/files/fileStore";

const PROJECT_ID = "CEM-001";
const PROJECT_NAME = "City Edge Mall";

type Signal = {
  label: string;
  score: number;
  description: string;
  icon: React.ReactNode;
};

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function scoreLabel(score: number) {
  if (score >= 85) return "Healthy";
  if (score >= 70) return "Good";
  if (score >= 50) return "Needs Attention";
  return "Critical";
}

export default function ProjectIntelligencePage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [finance, setFinance] = useState<any[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const [budget, setBudget] = useState<any>(null);

  useEffect(() => {
    const refresh = () => {
      setTasks(getTasks().filter((x) => x.projectId === PROJECT_ID || x.project === PROJECT_NAME));
      setReports(getSiteReports().filter((x) => x.projectId === PROJECT_ID || x.project === PROJECT_NAME));
      setApprovals(getApprovals().filter((x) => x.projectId === PROJECT_ID || x.project === PROJECT_NAME));
      setFinance(getProjectFinance(PROJECT_ID));
      setFiles(getProjectFiles(PROJECT_ID));
      setBudget(getProjectBudget(PROJECT_ID));
    };

    refresh();
    const timer = window.setInterval(refresh, 2000);
    return () => window.clearInterval(timer);
  }, []);

  const metrics = useMemo(() => {
    const completed = tasks.filter((x) => x.status === "Completed").length;
    const overdue = tasks.filter((x) => x.status === "Overdue").length;
    const openTasks = tasks.filter((x) => x.status !== "Completed").length;

    const allIssues = reports.flatMap((x) => x.issues || []);
    const openIssues = allIssues.filter((x: any) => x.status !== "Resolved");
    const urgentIssues = openIssues.filter((x: any) => x.priority === "Urgent");

    const pendingApprovals = approvals.filter((x) => x.status === "Pending").length;
    const changesRequested = approvals.filter((x) => x.status === "Changes Requested").length;

    const expenses = finance
      .filter((x) => x.type === "Expense")
      .reduce((sum, x) => sum + Number(x.amount || 0), 0);

    const income = finance
      .filter((x) => x.type === "Income")
      .reduce((sum, x) => sum + Number(x.amount || 0), 0);

    const plannedBudget = Number(budget?.budget || 0);
    const budgetUtilization = plannedBudget ? (expenses / plannedBudget) * 100 : 0;

    const taskScore = tasks.length ? clamp((completed / tasks.length) * 100 - overdue * 10) : 100;
    const scheduleScore = clamp(100 - overdue * 20);
    const approvalScore = approvals.length
      ? clamp(100 - pendingApprovals * 15 - changesRequested * 10)
      : 100;
    const siteScore = clamp(100 - openIssues.length * 12 - urgentIssues.length * 20);
    const financeScore = plannedBudget
      ? clamp(budgetUtilization <= 80 ? 100 : budgetUtilization <= 95 ? 80 : 55)
      : 100;

    const overall = clamp(
      taskScore * 0.25 +
        scheduleScore * 0.2 +
        approvalScore * 0.2 +
        siteScore * 0.2 +
        financeScore * 0.15
    );

    return {
      completed,
      overdue,
      openTasks,
      openIssues: openIssues.length,
      urgentIssues: urgentIssues.length,
      pendingApprovals,
      changesRequested,
      expenses,
      income,
      plannedBudget,
      budgetUtilization,
      taskScore,
      scheduleScore,
      approvalScore,
      siteScore,
      financeScore,
      overall,
    };
  }, [tasks, reports, approvals, finance, budget]);

  const signals: Signal[] = [
    {
      label: "Task Health",
      score: metrics.taskScore,
      description: `${metrics.completed} completed · ${metrics.openTasks} open`,
      icon: <CheckCircle2 size={17} />,
    },
    {
      label: "Schedule Health",
      score: metrics.scheduleScore,
      description: `${metrics.overdue} overdue task${metrics.overdue === 1 ? "" : "s"}`,
      icon: <Clock3 size={17} />,
    },
    {
      label: "Approval Health",
      score: metrics.approvalScore,
      description: `${metrics.pendingApprovals} pending · ${metrics.changesRequested} changes requested`,
      icon: <FileCheck2 size={17} />,
    },
    {
      label: "Site Health",
      score: metrics.siteScore,
      description: `${metrics.openIssues} open · ${metrics.urgentIssues} urgent`,
      icon: <HardHat size={17} />,
    },
    {
      label: "Financial Health",
      score: metrics.financeScore,
      description: metrics.plannedBudget
        ? `${Math.round(metrics.budgetUtilization)}% budget utilized`
        : "No project budget configured",
      icon: <WalletCards size={17} />,
    },
  ];

  const risks = [
    metrics.overdue > 0
      ? `Resolve ${metrics.overdue} overdue task${metrics.overdue === 1 ? "" : "s"}.`
      : null,
    metrics.urgentIssues > 0
      ? `${metrics.urgentIssues} urgent site issue${metrics.urgentIssues === 1 ? "" : "s"} require attention.`
      : null,
    metrics.pendingApprovals > 0
      ? `${metrics.pendingApprovals} approval${metrics.pendingApprovals === 1 ? "" : "s"} are waiting for review.`
      : null,
    metrics.changesRequested > 0
      ? `${metrics.changesRequested} approval${metrics.changesRequested === 1 ? "" : "s"} require changes.`
      : null,
    metrics.plannedBudget && metrics.budgetUtilization > 95
      ? "Actual expenses are above 95% of the project budget."
      : null,
  ].filter(Boolean) as string[];

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-[1500px] px-5 py-7 md:px-8 lg:px-10">
        <div className="flex flex-col gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <Link
              href="/app/admin/projects/city-edge-mall"
              className="mb-5 inline-flex items-center gap-2 text-xs text-white/40 hover:text-white"
            >
              <ArrowLeft size={14} />
              Project Command Center
            </Link>
            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
              Project Intelligence
            </p>
            <h1 className="mt-2 text-4xl font-light tracking-tight md:text-5xl">
              {PROJECT_NAME}
            </h1>
            <p className="mt-3 text-xs text-white/30">
              Live management view across tasks, schedule, approvals, site and finance.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/app/admin/projects/city-edge-mall/timeline"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs hover:bg-white/[0.08]"
            >
              Timeline
              <ArrowUpRight size={14} />
            </Link>
            <Link
              href="/app/admin/projects/city-edge-mall/dna"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs hover:bg-white/[0.08]"
            >
              Project DNA
            </Link>
          </div>
        </div>

        <section className="mt-7 grid gap-5 lg:grid-cols-[1.05fr_1.95fr]">
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">
            <p className="text-[9px] uppercase tracking-[0.22em] text-white/30">
              Overall Project Health
            </p>

            <div className="mt-7 flex items-center gap-6">
              <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.02]">
                <div className="text-center">
                  <p className="text-5xl font-light">{metrics.overall}</p>
                  <p className="mt-1 text-[8px] uppercase tracking-[0.2em] text-white/25">
                    / 100
                  </p>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 text-white/50">
                  <Activity size={15} />
                  <span className="text-xs">{scoreLabel(metrics.overall)}</span>
                </div>
                <p className="mt-3 text-xs leading-6 text-white/30">
                  A management signal calculated from live project activity.
                  It is not a replacement for professional project assessment.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-2">
              <Mini label="Open Tasks" value={metrics.openTasks} />
              <Mini label="Open Issues" value={metrics.openIssues} />
              <Mini label="Pending Approvals" value={metrics.pendingApprovals} />
              <Mini label="Files" value={files.length} />
            </div>
          </div>

          <div className="grid gap-3">
            {signals.map((signal) => (
              <SignalCard key={signal.label} signal={signal} />
            ))}
          </div>
        </section>

        <section className="mt-7 grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/30">
                  Risk Register
                </p>
                <h2 className="mt-2 text-xl font-light">What needs attention</h2>
              </div>
              <AlertTriangle size={18} className="text-white/35" />
            </div>

            <div className="mt-6 space-y-3">
              {risks.length === 0 ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-xs text-white/35">
                  No active intelligence risks detected.
                </div>
              ) : (
                risks.map((risk) => (
                  <div
                    key={risk}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-white/60" />
                    <p className="text-xs leading-5 text-white/55">{risk}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.025] p-7">
            <p className="text-[9px] uppercase tracking-[0.22em] text-white/30">
              Financial Snapshot
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Metric label="Revenue" value={formatNumber(metrics.income)} />
              <Metric label="Actual Cost" value={formatNumber(metrics.expenses)} />
              <Metric
                label="Budget"
                value={metrics.plannedBudget ? formatNumber(metrics.plannedBudget) : "Not set"}
              />
              <Metric
                label="Utilization"
                value={metrics.plannedBudget ? `${Math.round(metrics.budgetUtilization)}%` : "—"}
              />
            </div>

            <Link
              href={`/app/admin/projects/${PROJECT_ID}/finance`}
              className="mt-5 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-white/35 hover:text-white"
            >
              Open project finance
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function SignalCard({ signal }: { signal: Signal }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-white/40">{signal.icon}</span>
          <div>
            <p className="text-xs text-white/65">{signal.label}</p>
            <p className="mt-1 text-[10px] text-white/25">{signal.description}</p>
          </div>
        </div>
        <span className="text-lg font-light">{signal.score}</span>
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white"
          style={{ width: `${signal.score}%` }}
        />
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <p className="text-[8px] uppercase tracking-[0.15em] text-white/25">{label}</p>
      <p className="mt-2 text-lg font-light text-white/75">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <p className="text-[9px] uppercase tracking-[0.15em] text-white/25">{label}</p>
      <p className="mt-3 text-xl font-light text-white/75">{value}</p>
    </div>
  );
}

function formatNumber(value: number) {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}
