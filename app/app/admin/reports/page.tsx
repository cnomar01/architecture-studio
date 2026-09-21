"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { getStudioOverview, type StudioOverview } from "@/lib/client/studioOverview";

export default function ReportsPage() {
  const [data, setData] = useState<StudioOverview | null>(null);
  const [error, setError] = useState("");
  const load = useCallback(async () => { setError(""); try { setData(await getStudioOverview()); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load reports."); } }, []);
  useEffect(() => { void load(); }, [load]);
  const totals = useMemo(() => {
    const tasks = data?.tasks || [];
    const finance = data?.finance || [];
    const income = finance.filter((item) => item.type === "Income").reduce((sum,item)=>sum+item.amount,0);
    const expenses = finance.filter((item) => item.type === "Expense").reduce((sum,item)=>sum+item.amount,0);
    return { active:(data?.projects||[]).filter((item)=>item.status==="Active").length, completed:tasks.filter((item)=>item.status==="Completed").length, income, expenses };
  }, [data]);
  return <main className="mx-auto max-w-6xl p-6"><div className="flex items-end justify-between"><div><h1 className="text-2xl font-semibold">Reports</h1><p className="mt-1 text-sm opacity-60">Current figures from the shared studio database.</p></div><button onClick={() => void load()} aria-label="Refresh reports" className="rounded-xl border p-2.5"><RefreshCw size={15}/></button></div>{error&&<p role="alert" className="mt-5 rounded-xl border border-red-400/30 p-4 text-sm text-red-300">{error}</p>}<div className="mt-6 grid gap-4 md:grid-cols-4"><Metric label="Projects" value={data?.projects.length||0}/><Metric label="Active Projects" value={totals.active}/><Metric label="Tasks" value={data?.tasks.length||0}/><Metric label="Completed Tasks" value={totals.completed}/></div><div className="mt-6 grid gap-4 md:grid-cols-3"><Metric label="Income" value={money(totals.income)}/><Metric label="Expenses" value={money(totals.expenses)}/><Metric label="Net Profit" value={money(totals.income-totals.expenses)}/></div><div className="mt-6 rounded-2xl border p-6"><h2 className="font-semibold">Project overview</h2><div className="mt-4 space-y-3">{(data?.projects||[]).map((project)=><div key={project.id} className="flex flex-col justify-between gap-2 border-b pb-3 text-sm sm:flex-row"><span>{project.name}</span><span className="opacity-60">{project.status} · {project.phase} · {(data?.tasks||[]).filter((item)=>item.project_id===project.id).length} tasks</span></div>)}{data&&!data.projects.length&&<p className="py-8 text-center text-sm opacity-50">No projects yet.</p>}</div></div></main>;
}

const money=(value:number)=>new Intl.NumberFormat("en-US",{style:"currency",currency:"EGP",maximumFractionDigits:2}).format(value);
function Metric({label,value}:{label:string;value:string|number}){return <div className="rounded-2xl border p-5"><div className="text-xs opacity-60">{label}</div><div className="mt-2 text-2xl font-semibold">{value}</div></div>}
