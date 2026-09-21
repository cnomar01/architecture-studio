"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  Gauge,
  RefreshCw,
  Users,
} from "lucide-react";
import { getStudioOverview, type StudioOverview } from "@/lib/client/studioOverview";

const money = (value: number, currency = "EGP") =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);

export default function AdminDashboard() {
  const [overview, setOverview] = useState<StudioOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async (quiet = false) => {
    if (quiet) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      setOverview(await getStudioOverview());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load the studio overview.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const onFocus = () => void load(true);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  const metrics = useMemo(() => {
    const projects = overview?.projects || [];
    const tasks = overview?.tasks || [];
    const approvals = overview?.approvals || [];
    const transactions = overview?.finance || [];
    const income = transactions.filter((item) => item.type === "Income").reduce((sum, item) => sum + item.amount, 0);
    const expenses = transactions.filter((item) => item.type === "Expense").reduce((sum, item) => sum + item.amount, 0);
    return {
      activeProjects: projects.filter((item) => item.status === "Active").length,
      openTasks: tasks.filter((item) => !["Completed", "Closed"].includes(item.status)).length,
      pendingApprovals: approvals.filter((item) => item.status.toLowerCase().includes("pending")).length,
      overloaded: (overview?.team || []).filter((item) => item.status === "Overloaded").length,
      income,
      expenses,
      profit: income - expenses,
    };
  }, [overview]);

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-4 border-b border-white/10 pb-7 md:flex-row md:items-end">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-white/30">Mason & Arc</div>
            <h1 className="mt-2 text-3xl font-semibold">Studio Command Center</h1>
            <p className="mt-2 text-sm text-white/40">Live operational overview from the shared studio database.</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => void load(true)} disabled={refreshing} aria-label="Refresh studio overview" className="rounded-xl border border-white/15 p-2.5 text-white/55 transition hover:bg-white/[.05] hover:text-white disabled:opacity-50">
              <RefreshCw size={15} className={refreshing ? "animate-spin" : ""} />
            </button>
            <Link href="/app/admin/projects" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">All Projects <ArrowRight size={16} /></Link>
          </div>
        </header>

        {error && <p role="alert" className="mt-5 rounded-xl border border-red-400/25 bg-red-400/10 px-4 py-3 text-sm text-red-200">{error}</p>}
        {loading && !overview ? <div className="py-24 text-center text-sm text-white/35">Loading the shared workspace…</div> : <>
          <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={BriefcaseBusiness} label="Active Projects" value={metrics.activeProjects} />
            <Stat icon={ClipboardList} label="Open Tasks" value={metrics.openTasks} />
            <Stat icon={CheckCircle2} label="Pending Approvals" value={metrics.pendingApprovals} />
            <Stat icon={Users} label="Overloaded Team" value={metrics.overloaded} />
          </section>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
              <div className="flex items-center justify-between"><div><h2 className="font-semibold">Studio Pulse</h2><p className="mt-1 text-xs text-white/35">Current database-backed operational signals</p></div><Gauge size={19} className="text-white/35" /></div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Pulse label="Finance Profit" value={money(metrics.profit)} icon={DollarSign} />
                <Pulse label="Transactions" value={String(overview?.finance.length || 0)} icon={Activity} />
                <Pulse label="Unread Alerts" value={String(overview?.unreadNotifications || 0)} icon={AlertTriangle} />
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="font-semibold">Finance Snapshot</h2>
              <div className="mt-5 space-y-4">
                <Metric label="Income" value={money(metrics.income)} />
                <Metric label="Expenses" value={money(metrics.expenses)} />
                <Metric label="Net Profit" value={money(metrics.profit)} />
              </div>
              <Link href="/app/admin/finance" className="mt-5 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">Open Finance <ArrowRight size={15} /></Link>
            </section>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between"><h2 className="font-semibold">Projects</h2><Link href="/app/admin/projects" className="text-xs text-white/40 hover:text-white">View all</Link></div>
              <div className="mt-5 space-y-3">
                {(overview?.projects || []).slice(0, 5).map((project) => <Link key={project.id} href={`/app/admin/projects/${project.id}`} className="flex items-center justify-between rounded-2xl border border-white/10 p-4 hover:bg-white/5"><div><div className="text-sm font-medium">{project.name}</div><div className="mt-1 text-xs text-white/35">{project.code} · {project.phase}</div></div><span className="text-xs text-white/40">{project.status}</span></Link>)}
                {!overview?.projects.length && <Empty text="No projects yet." />}
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
              <div className="flex items-center justify-between"><h2 className="font-semibold">Team Intelligence</h2><Link href="/app/admin/team" className="text-xs text-white/40 hover:text-white">Team</Link></div>
              <div className="mt-5 space-y-3">
                {(overview?.team || []).map((item) => <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 p-4"><div><div className="text-sm font-medium">{item.name}</div><div className="mt-1 text-xs text-white/35">{item.role} · {item.activeTasks} active tasks</div></div><div className="text-right"><div className="text-sm">{item.workload}%</div><div className="text-[11px] text-white/35">{item.status}</div></div></div>)}
                {!overview?.team.length && <Empty text="No active team data." />}
              </div>
            </section>
          </div>

          <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center justify-between"><div><h2 className="font-semibold">Live Activity</h2><p className="mt-1 text-xs text-white/35">Latest shared database events</p></div><Activity size={18} className="text-white/35" /></div>
            <div className="mt-5 space-y-3">
              {(overview?.activity || []).slice(0, 8).map((item) => <div key={item.id} className="flex flex-col gap-1 border-b border-white/5 pb-3 last:border-0"><div className="text-sm text-white/75">{humanize(item.action)}</div><div className="text-xs text-white/35">{item.entity_type}{item.entity_id ? ` · ${item.entity_id}` : ""} · {item.actor_name || "System"} · {new Date(item.created_at).toLocaleString()}</div></div>)}
              {!overview?.activity.length && <Empty text="No activity recorded yet." />}
            </div>
          </section>
        </>}
      </div>
    </main>
  );
}

function humanize(value: string) { return value.replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()); }
function Stat({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: number }) { return <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><Icon size={18} className="text-white/40" /><div className="mt-4 text-3xl font-semibold">{value}</div><div className="mt-1 text-xs text-white/35">{label}</div></div>; }
function Pulse({ icon: Icon, label, value }: { icon: typeof Gauge; label: string; value: string }) { return <div className="rounded-2xl border border-white/10 bg-black/10 p-4"><Icon size={16} className="text-white/35" /><div className="mt-3 text-sm font-medium">{value}</div><div className="mt-1 text-xs text-white/30">{label}</div></div>; }
function Metric({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between border-b border-white/5 pb-3"><span className="text-sm text-white/40">{label}</span><span className="text-sm font-medium">{value}</span></div>; }
function Empty({ text }: { text: string }) { return <div className="py-8 text-center text-sm text-white/30">{text}</div>; }
