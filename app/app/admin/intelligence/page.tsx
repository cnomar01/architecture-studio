"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  Gauge,
  Users,
} from "lucide-react";

import { getProjects } from "@/lib/core/projectStore";
import { getTasks } from "@/app/app/admin/tasks/taskStore";
import { getApprovals } from "@/app/app/admin/approvals/approvalStore";
import { getFinanceTransactions } from "@/app/app/admin/finance/financeStore";
import { getSiteReports } from "@/app/app/engineer/site/siteStore";
import {
  getTeamIntelligence,
  TeamIntelligence,
} from "@/app/app/admin/team/teamIntelligence";
import { getActivities } from "@/lib/core/activityStore";
import { matchesProject } from "@/lib/core/projectRelation";
import { calculateProjectHealth } from "@/app/app/admin/projects/city-edge-mall/projectHealth";
import { generateProjectAlerts } from "@/app/app/admin/projects/city-edge-mall/projectAlerts";

export default function IntelligencePage() {
  const [, setTick] = useState(0);
  const [team, setTeam] = useState<TeamIntelligence[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadTeamIntelligence() {
      try {
        const data = await getTeamIntelligence();

        if (!cancelled) {
          setTeam(data);
        }
      } catch (error) {
        console.error("Failed to load team intelligence:", error);

        if (!cancelled) {
          setTeam([]);
        }
      }
    }

    loadTeamIntelligence();

    const timer = window.setInterval(() => {
      setTick((v) => v + 1);
      loadTeamIntelligence();
    }, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, []);

  const projects = getProjects();
  const tasks = getTasks();
  const approvals = getApprovals();
  const reports = getSiteReports();
  const transactions = getFinanceTransactions();
  const activities = getActivities().slice(0, 10);

  const projectIntelligence = useMemo(() => {
    return projects.map((project) => {
      const projectTasks = tasks.filter((task) =>
        matchesProject(task, project.id)
      );

      const projectReports = reports.filter((report) =>
        matchesProject(report, project.id)
      );

      const issues = projectReports.flatMap(
        (report) => report.issues || []
      );

      const projectApprovals = approvals.filter((approval) =>
        matchesProject(approval, project.id)
      );

      const projectTransactions = transactions.filter(
        (item) => item.projectId === project.id
      );

      const health = calculateProjectHealth(projectTasks, issues);
      const alerts = generateProjectAlerts(projectTasks, issues);

      const pendingApprovals = projectApprovals.filter(
        (item) => item.status === "Pending"
      ).length;

      const completedTasks = projectTasks.filter(
        (task) => task.status === "Completed"
      ).length;

      const progress = projectTasks.length
        ? Math.round((completedTasks / projectTasks.length) * 100)
        : 0;

      const income = projectTransactions
        .filter((item) => item.type === "Income")
        .reduce((sum, item) => sum + item.amount, 0);

      const expenses = projectTransactions
        .filter((item) => item.type === "Expense")
        .reduce((sum, item) => sum + item.amount, 0);

      return {
        project,
        health,
        alerts,
        pendingApprovals,
        progress,
        income,
        expenses,
        profit: income - expenses,
      };
    });
  }, [projects, tasks, reports, approvals, transactions]);

  const totalOpenTasks = tasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  const pendingApprovals = approvals.filter(
    (item) => item.status === "Pending"
  ).length;

  const openIssues = reports
    .flatMap((report) => report.issues || [])
    .filter((issue) => issue.status !== "Resolved").length;

  const criticalAlerts = projectIntelligence.reduce(
    (sum, item) =>
      sum +
      item.alerts.filter(
        (alert) => alert.type === "Critical"
      ).length,
    0
  );

  const overloaded = team.filter(
    (item) => item.status === "Overloaded"
  ).length;

  const income = transactions
    .filter((item) => item.type === "Income")
    .reduce((sum, item) => sum + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "Expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const profit = income - expenses;

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/30">
              Mason & Arc / Intelligence OS
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              Studio Intelligence
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-white/40">
              One management view connecting project health, delivery, site
              risk, approvals, team capacity and finance.
            </p>
          </div>

          <Link
            href="/app/admin"
            className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
          >
            Command Center
            <ArrowRight size={15} />
          </Link>
        </header>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            icon={Gauge}
            label="Critical Signals"
            value={criticalAlerts}
          />

          <Stat
            icon={ClipboardList}
            label="Open Tasks"
            value={totalOpenTasks}
          />

          <Stat
            icon={AlertTriangle}
            label="Open Site Issues"
            value={openIssues}
          />

          <Stat
            icon={Users}
            label="Overloaded Team"
            value={overloaded}
          />
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                Portfolio Health
              </p>

              <h2 className="mt-2 text-xl font-medium">
                Projects at a glance
              </h2>
            </div>

            <BriefcaseBusiness size={19} className="text-white/30" />
          </div>

          <div className="mt-6 space-y-3">
            {projectIntelligence.map((item) => (
              <Link
                key={item.project.id}
                href={`/app/admin/projects/${item.project.id}`}
                className="block rounded-2xl border border-white/10 p-5 transition hover:bg-white/[0.035]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-medium">
                        {item.project.name}
                      </h3>

                      <span className="text-[10px] uppercase tracking-wider text-white/25">
                        {item.project.code}
                      </span>

                      <span className="rounded-full border border-white/10 px-2 py-1 text-[9px] text-white/40">
                        {item.health.label}
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-white/30">
                      {item.project.phase} · {item.project.status}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:w-[560px]">
                    <Mini
                      label="Health"
                      value={`${item.health.score}/100`}
                    />

                    <Mini
                      label="Progress"
                      value={`${item.progress}%`}
                    />

                    <Mini
                      label="Approvals"
                      value={`${item.pendingApprovals} pending`}
                    />

                    <Mini
                      label="Alerts"
                      value={`${item.alerts.length}`}
                    />
                  </div>
                </div>

                <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full bg-white"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </Link>
            ))}

            {projectIntelligence.length === 0 && (
              <Empty text="No projects available." />
            )}
          </div>
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-3">
          <Panel title="Delivery Signals" icon={CheckCircle2}>
            <Metric
              label="Pending approvals"
              value={pendingApprovals}
            />

            <Metric
              label="Open tasks"
              value={totalOpenTasks}
            />

            <Metric
              label="Open site issues"
              value={openIssues}
            />
          </Panel>

          <Panel title="Financial Signal" icon={DollarSign}>
            <Metric
              label="Income"
              value={`${income.toLocaleString()} EGP`}
            />

            <Metric
              label="Expenses"
              value={`${expenses.toLocaleString()} EGP`}
            />

            <Metric
              label="Net profit"
              value={`${profit.toLocaleString()} EGP`}
            />
          </Panel>

          <Panel title="Team Capacity" icon={Users}>
            {team.map((item) => (
              <div
                key={item.member.id}
                className="flex items-center justify-between border-b border-white/5 py-3 last:border-0"
              >
                <div>
                  <p className="text-sm">{item.member.name}</p>

                  <p className="mt-1 text-[11px] text-white/30">
                    {item.activeTasks} active · {item.overdueTasks} overdue
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm">{item.workload}%</p>

                  <p className="text-[10px] text-white/30">
                    {item.status}
                  </p>
                </div>
              </div>
            ))}

            {team.length === 0 && (
              <Empty text="No active team data." />
            )}
          </Panel>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                Risk Feed
              </p>

              <h2 className="mt-2 text-xl font-medium">
                What needs attention
              </h2>
            </div>

            <Activity size={18} className="text-white/30" />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {projectIntelligence
              .flatMap((item) =>
                item.alerts
                  .slice(0, 4)
                  .map((alert) => ({
                    ...alert,
                    projectName: item.project.name,
                    projectId: item.project.id,
                  }))
              )
              .slice(0, 12)
              .map((alert) => (
                <Link
                  key={`${alert.projectId}-${alert.id}`}
                  href={`/app/admin/projects/${alert.projectId}`}
                  className="rounded-2xl border border-white/10 p-4 hover:bg-white/[0.035]"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={16}
                      className="mt-0.5 shrink-0 text-white/40"
                    />

                    <div>
                      <p className="text-sm">{alert.title}</p>

                      <p className="mt-1 text-xs leading-5 text-white/30">
                        {alert.projectName} · {alert.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}

            {criticalAlerts === 0 && (
              <Empty text="No critical signals detected from current project data." />
            )}
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                Studio Activity
              </p>

              <h2 className="mt-2 text-xl font-medium">
                Recent decisions and events
              </h2>
            </div>

            <Activity size={18} className="text-white/30" />
          </div>

          <div className="mt-5 space-y-3">
            {activities.map((item) => (
              <div
                key={item.id}
                className="border-b border-white/5 pb-3 last:border-0"
              >
                <p className="text-sm text-white/75">
                  {item.title}
                </p>

                <p className="mt-1 text-xs text-white/30">
                  {item.description} ·{" "}
                  {new Date(item.createdAt).toLocaleString()}
                </p>
              </div>
            ))}

            {activities.length === 0 && (
              <Empty text="No studio activity recorded yet." />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gauge;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <Icon size={18} className="text-white/40" />

      <p className="mt-4 text-3xl font-semibold">{value}</p>

      <p className="mt-1 text-xs text-white/35">{label}</p>
    </div>
  );
}

function Mini({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3">
      <p className="text-[9px] uppercase tracking-wider text-white/25">
        {label}
      </p>

      <p className="mt-2 text-sm text-white/75">{value}</p>
    </div>
  );
}

function Panel({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: typeof Gauge;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>

        <Icon size={18} className="text-white/30" />
      </div>

      <div className="mt-4">{children}</div>
    </section>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-3 last:border-0">
      <span className="text-sm text-white/40">{label}</span>

      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="py-8 text-center text-sm text-white/30">
      {text}
    </div>
  );
}