"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Activity, AlertTriangle, ArrowLeft, ArrowRight, Brain, CalendarClock, CheckCircle2, CircleDollarSign, Gauge, RefreshCw, ShieldAlert } from "lucide-react";
import { getPortfolioForecast, ProjectForecast } from "./forecastStore";

export default function PredictiveIntelligencePage() {
  const [items, setItems] = useState<ProjectForecast[]>([]);
  const [updated, setUpdated] = useState(new Date());
  const refresh = () => { setItems(getPortfolioForecast()); setUpdated(new Date()); };
  useEffect(() => { refresh(); const timer = window.setInterval(refresh, 5000); return () => window.clearInterval(timer); }, []);

  const critical = items.filter((item) => item.level === "Critical").length;
  const high = items.filter((item) => item.level === "High Risk").length;
  const average = items.length ? Math.round(items.reduce((sum, item) => sum + item.health, 0) / items.length) : 0;
  const schedule = items.reduce((sum, item) => sum + item.overdueTasks, 0);

  return <main className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-8">
    <div className="mx-auto max-w-7xl">
      <header className="flex flex-col gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between">
        <div>
          <Link href="/app/admin/intelligence" className="inline-flex items-center gap-2 text-xs text-white/35 hover:text-white"><ArrowLeft size={13}/> Intelligence OS</Link>
          <p className="mt-5 text-xs uppercase tracking-[0.28em] text-white/30">Mason & Arc / Predictive Intelligence</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Project Intelligence 2.0</h1>
          <p className="mt-2 max-w-3xl text-sm text-white/40">A forward-looking management layer that converts current project signals into schedule, cost, delivery and quality risk forecasts.</p>
        </div>
        <button onClick={refresh} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-xs text-white/60 hover:bg-white/[0.05]"><RefreshCw size={14}/> Refresh forecast</button>
      </header>

      <section className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Gauge} label="Portfolio Health" value={`${average}/100`} />
        <Stat icon={ShieldAlert} label="Critical Projects" value={critical} />
        <Stat icon={AlertTriangle} label="High Risk Projects" value={high} />
        <Stat icon={CalendarClock} label="Overdue Tasks" value={schedule} />
      </section>

      <section className="mt-7 grid gap-5 lg:grid-cols-2">
        {items.map((item) => <ProjectCard key={item.project.id} item={item} />)}
        {!items.length && <Empty text="No projects available for forecasting."/>}
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <Panel title="Forecast logic" icon={Brain}>
          <p className="text-sm leading-6 text-white/45">The forecast is calculated from the Studio OS data currently available: tasks and dependencies, approvals, site issues, finance transactions, project progress and target dates.</p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"><Mini label="Schedule" value="35%"/><Mini label="Delivery" value="25%"/><Mini label="Cost" value="20%"/><Mini label="Quality" value="20%"/></div>
          <p className="mt-4 text-[11px] text-white/25">This is an operational forecast, not a guaranteed completion or cost prediction. Engineering and contractual decisions still require professional review.</p>
        </Panel>
        <Panel title="Management reading" icon={Activity}>
          <Metric label="Projects monitored" value={items.length}/>
          <Metric label="Average health" value={`${average}/100`}/>
          <Metric label="Critical + high risk" value={critical + high}/>
          <Metric label="Last refresh" value={updated.toLocaleTimeString()}/>
        </Panel>
      </section>
    </div>
  </main>;
}

function ProjectCard({ item }: { item: ProjectForecast }) {
  return <article className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div><p className="text-[10px] uppercase tracking-[0.2em] text-white/25">{item.project.code}</p><h2 className="mt-2 text-xl font-semibold">{item.project.name}</h2><p className="mt-1 text-xs text-white/30">{item.project.phase} · {item.project.status}</p></div>
      <span className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-wider text-white/55">{item.level}</span>
    </div>
    <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4"><Mini label="Health" value={`${item.health}/100`}/><Mini label="Progress" value={`${item.progress}%`}/><Mini label="Schedule risk" value={`${item.scheduleRisk}%`}/><Mini label="Cost risk" value={`${item.costRisk}%`}/></div>
    <div className="mt-4 grid grid-cols-2 gap-3"><Mini label="Delivery risk" value={`${item.deliveryRisk}%`}/><Mini label="Quality risk" value={`${item.qualityRisk}%`}/><Mini label="Approvals" value={`${item.pendingApprovals}`}/><Mini label="Open issues" value={`${item.openIssues}`}/></div>
    <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-white" style={{width:`${item.health}%`}}/></div>
    <div className="mt-5 space-y-2">{item.reasons.map((reason) => <div key={reason} className="flex gap-2 text-xs leading-5 text-white/45"><AlertTriangle size={14} className="mt-0.5 shrink-0 text-white/30"/>{reason}</div>)}</div>
    {item.criticalTasks.length > 0 && <div className="mt-5 border-t border-white/10 pt-5"><p className="text-[10px] uppercase tracking-[0.2em] text-white/25">Critical work</p><div className="mt-3 space-y-2">{item.criticalTasks.map((task) => <div key={task.id} className="flex items-center justify-between rounded-xl border border-white/8 px-3 py-2"><span className="truncate text-xs text-white/65">{task.title}</span><span className="ml-3 text-[10px] text-white/30">{task.status}</span></div>)}</div></div>}
    <Link href={`/app/admin/projects/${item.project.id}`} className="mt-5 inline-flex items-center gap-2 text-xs text-white/50 hover:text-white">Open project <ArrowRight size={14}/></Link>
  </article>;
}
function Stat({icon:Icon,label,value}:{icon:typeof Gauge;label:string;value:string|number}){return <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><Icon size={18} className="text-white/40"/><p className="mt-4 text-3xl font-semibold">{value}</p><p className="mt-1 text-xs text-white/35">{label}</p></div>}
function Panel({title,icon:Icon,children}:{title:string;icon:typeof Gauge;children:React.ReactNode}){return <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"><div className="flex items-center justify-between"><h2 className="font-semibold">{title}</h2><Icon size={18} className="text-white/30"/></div><div className="mt-4">{children}</div></section>}
function Mini({label,value}:{label:string;value:string}){return <div className="rounded-xl border border-white/8 bg-white/[0.02] p-3"><p className="text-[9px] uppercase tracking-wider text-white/25">{label}</p><p className="mt-2 text-sm text-white/75">{value}</p></div>}
function Metric({label,value}:{label:string;value:string|number}){return <div className="flex items-center justify-between border-b border-white/5 py-3 last:border-0"><span className="text-sm text-white/40">{label}</span><span className="text-sm font-medium">{value}</span></div>}
function Empty({text}:{text:string}){return <div className="rounded-3xl border border-white/10 p-10 text-center text-sm text-white/30">{text}</div>}
