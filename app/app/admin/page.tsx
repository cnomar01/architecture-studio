 "use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowRight, BriefcaseBusiness, CheckCircle2, ClipboardList, DollarSign, Gauge, Users } from "lucide-react";
import { getProjects } from "@/lib/core/projectStore";
import { getTasks } from "@/app/app/admin/tasks/taskStore";
import { getApprovals } from "@/app/app/admin/approvals/approvalStore";
import { getFinanceTransactions, getStudioIncome, getStudioExpenses, getStudioProfit } from "@/app/app/admin/finance/financeStore";
import { getTeamIntelligence } from "@/app/app/admin/team/teamIntelligence";
import { getActivities } from "@/lib/core/activityStore";
import { getNotifications, getUnreadNotificationCount } from "@/lib/core/notificationStore";

export default function AdminDashboard() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTick((v) => v + 1), 2000);
    return () => clearInterval(timer);
  }, []);

  const projects = getProjects();
  const tasks = getTasks();
  const approvals = getApprovals();
  const transactions = getFinanceTransactions();
  const team = getTeamIntelligence();
  const activities = getActivities().slice(0, 8);
  const unread = getUnreadNotificationCount();

  const activeProjects = projects.filter((p) => p.status === "Active").length;
  const openTasks = tasks.filter((t) => t.status !== "Completed").length;
  const pendingApprovals = approvals.filter((a) => a.status === "Pending").length;
  const overloaded = team.filter((x) => x.status === "Overloaded").length;

  const income = getStudioIncome();
  const expenses = getStudioExpenses();
  const profit = getStudioProfit();

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-7 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-white/30">Mason & Arc</div>
            <h1 className="mt-2 text-3xl font-semibold">Studio Command Center</h1>
            <p className="mt-2 text-sm text-white/40">Live operational overview across projects, people, work and finance.</p>
          </div>
          <Link href="/app/admin/projects" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
            All Projects <ArrowRight size={16} />
          </Link>
        </header>

        <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon={BriefcaseBusiness} label="Active Projects" value={activeProjects} />
          <Stat icon={ClipboardList} label="Open Tasks" value={openTasks} />
          <Stat icon={CheckCircle2} label="Pending Approvals" value={pendingApprovals} />
          <Stat icon={Users} label="Overloaded Team" value={overloaded} />
        </section>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">Studio Pulse</h2>
                <p className="mt-1 text-xs text-white/35">Current operational signals</p>
              </div>
              <Gauge size={19} className="text-white/35" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Pulse label="Finance Profit" value={`${profit.toLocaleString()} EGP`} icon={DollarSign} />
              <Pulse label="Transactions" value={`${transactions.length}`} icon={Activity} />
              <Pulse label="Unread Alerts" value={`${unread}`} icon={AlertTriangle} />
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-semibold">Finance Snapshot</h2>
            <div className="mt-5 space-y-4">
              <Metric label="Income" value={`${income.toLocaleString()} EGP`} />
              <Metric label="Expenses" value={`${expenses.toLocaleString()} EGP`} />
              <Metric label="Net Profit" value={`${profit.toLocaleString()} EGP`} />
            </div>
            <Link href="/app/admin/finance" className="mt-5 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
              Open Finance <ArrowRight size={15} />
            </Link>
          </section>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Projects</h2>
              <Link href="/app/admin/projects" className="text-xs text-white/40 hover:text-white">View all</Link>
            </div>
            <div className="mt-5 space-y-3">
              {projects.slice(0, 5).map((project) => (
                <Link key={project.id} href={`/app/admin/projects/${project.id}`} className="flex items-center justify-between rounded-2xl border border-white/10 p-4 hover:bg-white/5">
                  <div>
                    <div className="text-sm font-medium">{project.name}</div>
                    <div className="mt-1 text-xs text-white/35">{project.code} · {project.phase}</div>
                  </div>
                  <span className="text-xs text-white/40">{project.status}</span>
                </Link>
              ))}
              {projects.length === 0 && <Empty text="No projects yet." />}
            </div>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">Team Intelligence</h2>
              <Link href="/app/admin/team" className="text-xs text-white/40 hover:text-white">Team</Link>
            </div>
            <div className="mt-5 space-y-3">
              {team.map((item) => (
                <div key={item.member.id} className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
                  <div>
                    <div className="text-sm font-medium">{item.member.name}</div>
                    <div className="mt-1 text-xs text-white/35">{item.member.role} · {item.activeTasks} active tasks</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{item.workload}%</div>
                    <div className="text-[11px] text-white/35">{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Live Activity</h2>
              <p className="mt-1 text-xs text-white/35">Latest studio events</p>
            </div>
            <Activity size={18} className="text-white/35" />
          </div>
          <div className="mt-5 space-y-3">
            {activities.map((item) => (
              <div key={item.id} className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0">
                <div className="text-sm text-white/75">{item.title}</div>
                <div className="text-xs text-white/35">{item.description} · {new Date(item.createdAt).toLocaleString()}</div>
              </div>
            ))}
            {activities.length === 0 && <Empty text="No activity recorded yet." />}
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <Icon size={18} className="text-white/40" />
      <div className="mt-4 text-3xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-white/35">{label}</div>
    </div>
  );
}

function Pulse({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
      <Icon size={16} className="text-white/35" />
      <div className="mt-3 text-sm font-medium">{value}</div>
      <div className="mt-1 text-xs text-white/30">{label}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-3">
      <span className="text-sm text-white/40">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return <div className="py-8 text-center text-sm text-white/30">{text}</div>;
}
