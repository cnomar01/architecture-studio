"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Receipt, Wallet } from "lucide-react";
import { useParams } from "next/navigation";
import { resolveProject } from "@/app/app/core/projectRelation";
import { getProjectFinance, getProjectIncome, getProjectExpenses, getProjectProfit, getProjectProfitMargin, getBudgetVsActual, getProjectBudget, getProjectInvoices, formatAmount } from "@/app/app/admin/finance/financeStore";

export default function ProjectFinancePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [tick, setTick] = useState(0);
  useEffect(() => { const t = window.setInterval(() => setTick((v) => v + 1), 1500); return () => window.clearInterval(t); }, []);
  const project = useMemo(() => (id ? resolveProject(id) : null), [id, tick]);
  if (!project) return <NotFound />;

  const income = getProjectIncome(project.id), expenses = getProjectExpenses(project.id), profit = getProjectProfit(project.id);
  const margin = getProjectProfitMargin(project.id), budget = getBudgetVsActual(project.id), projectBudget = getProjectBudget(project.id);
  const transactions = getProjectFinance(project.id), invoices = getProjectInvoices(project.id);

  return <main className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-8"><div className="mx-auto max-w-7xl">
    <Link href={`/app/admin/projects/${project.id}`} className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white"><ArrowLeft size={15}/>Back to Project</Link>
    <header className="mt-8 flex flex-col justify-between gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end"><div><div className="text-xs uppercase tracking-[0.25em] text-white/30">{project.code} · Project Finance</div><h1 className="mt-2 text-3xl font-semibold">{project.name}</h1><p className="mt-2 text-sm text-white/40">Revenue, costs, budget, invoices and project profitability.</p></div><Link href={`/app/admin/finance/new?project=${project.id}`} className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black">Add Transaction</Link></header>
    <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5"><Metric label="Revenue" value={formatAmount(income,"EGP")}/><Metric label="Actual Cost" value={formatAmount(expenses,"EGP")}/><Metric label="Net Profit" value={formatAmount(profit,"EGP")}/><Metric label="Margin" value={`${margin}%`}/><Metric label="Budget Used" value={`${budget.utilization}%`}/></section>
    <section className="mt-6 grid gap-6 lg:grid-cols-2"><div className="rounded-3xl border border-white/10 bg-white/[.025] p-6"><div className="flex items-center gap-3"><Wallet size={18}/><h2 className="font-semibold">Budget vs Actual</h2></div><div className="mt-6 grid grid-cols-2 gap-4"><Metric label="Budget" value={projectBudget ? formatAmount(projectBudget.budget,projectBudget.currency) : "Not set"}/><Metric label="Actual Cost" value={formatAmount(budget.actualCost,"EGP")}/></div><div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-white" style={{width:`${Math.min(100,Math.max(0,budget.utilization))}%`}}/></div><div className="mt-3 flex justify-between text-xs text-white/35"><span>Variance</span><span>{projectBudget ? formatAmount(budget.variance,projectBudget.currency) : "—"}</span></div></div>
    <div className="rounded-3xl border border-white/10 bg-white/[.025] p-6"><div className="flex items-center gap-3"><Receipt size={18}/><h2 className="font-semibold">Invoices</h2></div>{invoices.length===0?<p className="mt-8 text-sm text-white/40">No invoices linked to this project.</p>:<div className="mt-5 space-y-3">{invoices.map((x)=><div key={x.id} className="rounded-2xl border border-white/10 p-4"><div className="flex justify-between gap-4"><span className="font-medium">{x.id}</span><span className="text-xs text-white/45">{x.status}</span></div><div className="mt-2 text-sm text-white/45">{x.description}</div><div className="mt-3 text-sm">{formatAmount(x.amount,x.currency)}</div></div>)}</div>}</div></section>
    <section className="mt-6 rounded-3xl border border-white/10 bg-white/[.025] p-6"><h2 className="font-semibold">Transactions</h2>{transactions.length===0?<p className="mt-6 text-sm text-white/40">No transactions recorded for this project.</p>:<div className="mt-5 space-y-3">{transactions.map((x)=><div key={x.id} className="grid gap-2 rounded-2xl border border-white/10 p-4 md:grid-cols-[120px_1fr_130px_100px]"><span className="text-xs text-white/35">{x.date}</span><div><div className="font-medium">{x.description}</div><div className="mt-1 text-xs text-white/35">{x.category} · {x.createdBy}</div></div><span>{formatAmount(x.amount,x.currency)}</span><span className="text-xs text-white/45">{x.status}</span></div>)}</div>}</section>
  </div></main>;
}
function Metric({label,value}:{label:string;value:string}){return <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><div className="text-xs uppercase tracking-[.16em] text-white/30">{label}</div><div className="mt-4 text-xl font-semibold">{value}</div></div>}
function NotFound(){return <main className="min-h-screen bg-[#080808] p-8 text-white"><Link href="/app/admin/projects" className="text-sm text-white/45">← Back to Projects</Link><h1 className="mt-20 text-center text-2xl font-semibold">Project not found</h1></main>}
