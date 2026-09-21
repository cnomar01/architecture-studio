"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowRight, BriefcaseBusiness, CheckCircle2, ClipboardList, DollarSign, Gauge, RefreshCw, Users } from "lucide-react";
import { getStudioOverview, type StudioOverview } from "@/lib/client/studioOverview";

export default function IntelligencePage() {
  const [data, setData] = useState<StudioOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const load = useCallback(async () => { setError(""); try { setData(await getStudioOverview()); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load intelligence."); } finally { setLoading(false); } }, []);
  useEffect(() => { void load(); const onFocus = () => void load(); window.addEventListener("focus", onFocus); return () => window.removeEventListener("focus", onFocus); }, [load]);

  const projects = useMemo(() => (data?.projects || []).map((project) => {
    const tasks = (data?.tasks || []).filter((item) => item.project_id === project.id);
    const issues = (data?.siteIssues || []).filter((item) => item.project_id === project.id && item.status !== "Resolved");
    const approvals = (data?.approvals || []).filter((item) => item.project_id === project.id && item.status.toLowerCase().includes("pending"));
    const finance = (data?.finance || []).filter((item) => item.project_id === project.id);
    const completed = tasks.filter((item) => item.status === "Completed").length;
    const overdue = tasks.filter((item) => item.status === "Overdue" || Boolean(item.deadline && item.deadline.slice(0,10) < new Date().toISOString().slice(0,10) && item.status !== "Completed")).length;
    const highIssues = issues.filter((item) => ["High","Urgent","Critical"].includes(item.priority)).length;
    const health = Math.max(0, 100 - overdue * 15 - highIssues * 20 - approvals.length * 5);
    const income = finance.filter((item) => item.type === "Income").reduce((sum,item) => sum + item.amount, 0);
    const expenses = finance.filter((item) => item.type === "Expense").reduce((sum,item) => sum + item.amount, 0);
    return { project, tasks, issues, approvals, progress: tasks.length ? Math.round(completed / tasks.length * 100) : 0, health, alerts: overdue + highIssues + approvals.length, income, expenses };
  }), [data]);

  const openTasks = (data?.tasks || []).filter((item) => item.status !== "Completed").length;
  const openIssues = (data?.siteIssues || []).filter((item) => item.status !== "Resolved").length;
  const pendingApprovals = (data?.approvals || []).filter((item) => item.status.toLowerCase().includes("pending")).length;
  const critical = projects.filter((item) => item.health < 60).length;
  const income = (data?.finance || []).filter((item) => item.type === "Income").reduce((sum,item) => sum + item.amount,0);
  const expenses = (data?.finance || []).filter((item) => item.type === "Expense").reduce((sum,item) => sum + item.amount,0);

  return <main className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-8"><div className="mx-auto max-w-7xl">
    <header className="flex flex-col justify-between gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end"><div><p className="text-xs uppercase tracking-[0.28em] text-white/30">Mason & Arc / Intelligence OS</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Studio Intelligence</h1><p className="mt-2 max-w-2xl text-sm text-white/40">One database-backed view connecting delivery, site risk, approvals, team capacity and finance.</p></div><div className="flex items-center gap-3"><button onClick={() => void load()} aria-label="Refresh intelligence" className="rounded-xl border border-white/10 p-2.5 text-white/50"><RefreshCw size={15}/></button><Link href="/app/admin" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white">Command Center <ArrowRight size={15}/></Link></div></header>
    {error && <p role="alert" className="mt-5 rounded-xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>}
    {loading && !data ? <p className="py-24 text-center text-sm text-white/35">Loading shared intelligence…</p> : <>
      <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><Stat icon={Gauge} label="Critical Projects" value={critical}/><Stat icon={ClipboardList} label="Open Tasks" value={openTasks}/><Stat icon={AlertTriangle} label="Open Site Issues" value={openIssues}/><Stat icon={Users} label="Overloaded Team" value={(data?.team || []).filter((item) => item.status === "Overloaded").length}/></section>
      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-white/30">Portfolio Health</p><h2 className="mt-2 text-xl font-medium">Projects at a glance</h2></div><BriefcaseBusiness size={19} className="text-white/30"/></div><div className="mt-6 space-y-3">{projects.map((item) => <Link key={item.project.id} href={`/app/admin/projects/${item.project.id}`} className="block rounded-2xl border border-white/10 p-5 transition hover:bg-white/[0.035]"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div><div className="flex flex-wrap items-center gap-3"><h3 className="font-medium">{item.project.name}</h3><span className="text-[10px] uppercase tracking-wider text-white/25">{item.project.code}</span><span className="rounded-full border border-white/10 px-2 py-1 text-[9px] text-white/40">{healthLabel(item.health)}</span></div><p className="mt-2 text-xs text-white/30">{item.project.phase} · {item.project.status}</p></div><div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:w-[560px]"><Mini label="Health" value={`${item.health}/100`}/><Mini label="Progress" value={`${item.progress}%`}/><Mini label="Approvals" value={`${item.approvals.length} pending`}/><Mini label="Alerts" value={String(item.alerts)}/></div></div><div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-white" style={{width:`${item.progress}%`}}/></div></Link>)}{!projects.length && <Empty text="No projects available."/>}</div></section>
      <section className="mt-6 grid gap-5 lg:grid-cols-3"><Panel title="Delivery Signals" icon={CheckCircle2}><Metric label="Pending approvals" value={pendingApprovals}/><Metric label="Open tasks" value={openTasks}/><Metric label="Open site issues" value={openIssues}/></Panel><Panel title="Financial Signal" icon={DollarSign}><Metric label="Income" value={money(income)}/><Metric label="Expenses" value={money(expenses)}/><Metric label="Net profit" value={money(income-expenses)}/></Panel><Panel title="Team Capacity" icon={Users}>{(data?.team || []).map((item) => <div key={item.id} className="flex items-center justify-between border-b border-white/5 py-3 last:border-0"><div><p className="text-sm">{item.name}</p><p className="mt-1 text-[11px] text-white/30">{item.activeTasks} active · {item.overdueTasks} overdue</p></div><div className="text-right"><p className="text-sm">{item.workload}%</p><p className="text-[10px] text-white/30">{item.status}</p></div></div>)}{!data?.team.length && <Empty text="No active team data."/>}</Panel></section>
      <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6"><div className="flex items-center justify-between"><div><p className="text-xs uppercase tracking-[0.2em] text-white/30">Studio Activity</p><h2 className="mt-2 text-xl font-medium">Recent decisions and events</h2></div><Activity size={18} className="text-white/30"/></div><div className="mt-5 space-y-3">{(data?.activity || []).slice(0,10).map((item) => <div key={item.id} className="border-b border-white/5 pb-3 last:border-0"><p className="text-sm text-white/75">{humanize(item.action)}</p><p className="mt-1 text-xs text-white/30">{item.entity_type}{item.entity_id?` · ${item.entity_id}`:""} · {item.actor_name || "System"} · {new Date(item.created_at).toLocaleString()}</p></div>)}{!data?.activity.length && <Empty text="No studio activity recorded yet."/>}</div></section>
    </>}
  </div></main>;
}

const money = (value:number) => new Intl.NumberFormat("en-US",{style:"currency",currency:"EGP",maximumFractionDigits:2}).format(value);
const humanize = (value:string) => value.replace(/[._-]+/g," ").replace(/\b\w/g,(letter)=>letter.toUpperCase());
const healthLabel = (score:number) => score >= 85 ? "Healthy" : score >= 70 ? "Watch" : score >= 50 ? "At Risk" : "Critical";
function Stat({icon:Icon,label,value}:{icon:typeof Gauge;label:string;value:number}){return <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><Icon size={18} className="text-white/40"/><p className="mt-4 text-3xl font-semibold">{value}</p><p className="mt-1 text-xs text-white/35">{label}</p></div>}
function Mini({label,value}:{label:string;value:string}){return <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3"><p className="text-[9px] uppercase tracking-wider text-white/25">{label}</p><p className="mt-2 text-sm text-white/75">{value}</p></div>}
function Panel({title,icon:Icon,children}:{title:string;icon:typeof Gauge;children:React.ReactNode}){return <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><div className="flex items-center justify-between"><h2 className="font-semibold">{title}</h2><Icon size={18} className="text-white/30"/></div><div className="mt-4">{children}</div></section>}
function Metric({label,value}:{label:string;value:string|number}){return <div className="flex items-center justify-between border-b border-white/5 py-3 last:border-0"><span className="text-sm text-white/40">{label}</span><span className="text-sm font-medium">{value}</span></div>}
function Empty({text}:{text:string}){return <div className="py-8 text-center text-sm text-white/30">{text}</div>}
