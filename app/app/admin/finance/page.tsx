"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";

type Transaction = { id: string; project_id: string; type: "Income" | "Expense"; category: string; amount: string | number; currency: string; status: string; description: string; transaction_date: string; created_by_name: string | null };
type Project = { id: string; name: string; code: string; budget: string | null; financial_currency: string | null };
type FinanceGroup = { key: string; project?: Project; title: string; items: Transaction[] };

const money = (value: number, currency = "EGP") => new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);

export default function FinancePage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [financeResponse, projectResponse] = await Promise.all([
        fetch("/api/data/finance", { cache: "no-store", credentials: "include" }),
        fetch("/api/data/projects", { cache: "no-store", credentials: "include" }),
      ]);
      const finance = await financeResponse.json().catch(() => ({}));
      const projectData = await projectResponse.json().catch(() => ({}));
      if (!financeResponse.ok) throw new Error(finance.error || "Could not load finance.");
      if (!projectResponse.ok) throw new Error(projectData.error || "Could not load projects.");
      setTransactions(finance.data || []);
      setProjects(projectData.data || []);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not load finance.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const projectFor = useCallback((id: string) => projects.find((project) => project.id === id), [projects]);
  const filtered = useMemo(() => transactions.filter((item) => {
    const project = projectFor(item.project_id);
    const query = `${item.description} ${item.category} ${project?.name || ""} ${project?.code || ""}`.toLowerCase();
    const typeMatches = typeFilter === "All" || typeFilter === item.type || (typeFilter === "Pending" && item.status === "Pending");
    return typeMatches && (projectFilter === "All" || projectFilter === item.project_id) && query.includes(search.toLowerCase());
  }), [transactions, typeFilter, projectFilter, search, projectFor]);

  const groups = useMemo<FinanceGroup[]>(() => {
    const collected = new Map<string, FinanceGroup>();
    filtered.forEach((item) => {
      const project = projectFor(item.project_id);
      const key = project?.id || `missing-${item.project_id || item.id}`;
      const existing = collected.get(key) || { key, project, title: project ? `${project.code} — ${project.name}` : "Project not assigned", items: [] };
      existing.items.push(item);
      collected.set(key, existing);
    });
    return [...collected.values()].sort((left, right) => left.title.localeCompare(right.title));
  }, [filtered, projectFor]);

  const income = transactions.filter((item) => item.type === "Income").reduce((sum, item) => sum + Number(item.amount), 0);
  const expenses = transactions.filter((item) => item.type === "Expense").reduce((sum, item) => sum + Number(item.amount), 0);

  async function remove(item: Transaction) {
    if (!window.confirm(`Delete “${item.description}”? This cannot be undone.`)) return;
    setError("");
    const response = await fetch(`/api/data/finance?id=${encodeURIComponent(item.id)}`, { method: "DELETE", credentials: "include" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.error || "Could not delete transaction."); return; }
    setTransactions((current) => current.filter((row) => row.id !== item.id));
  }

  return <main className="min-h-screen bg-[#080808] text-white">
    <div className="mx-auto max-w-[1400px] px-5 py-7 text-left sm:px-8">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[.2em] text-white/35">Mason & Arc / Finance OS</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Finance</h1>
          <p className="mt-2 text-sm text-white/45">Every project has its own financial section below — payments and costs are no longer mixed together.</p>
        </div>
        <div className="flex gap-2"><button onClick={() => void load()} aria-label="Refresh finance" className="rounded-xl border border-white/15 p-3 transition hover:bg-white/[.05]"><RefreshCw size={16} /></button><Link href="/app/admin/finance/new" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black"><Plus size={16} />Add Transaction</Link></div>
      </header>

      {error && <p role="alert" className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      <section className="mt-6 grid gap-4 sm:grid-cols-3"><Metric label="Studio Revenue" value={money(income)} /><Metric label="Studio Costs" value={money(expenses)} /><Metric label="Studio Net Profit" value={money(income - expenses)} /></section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[.025] p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div><h2 className="font-semibold">Finance by project</h2><p className="mt-1 text-sm text-white/45">Filter or open a project’s dedicated financial page.</p></div>
          <div className="grid gap-2 sm:grid-cols-3">
            <select value={projectFilter} onChange={(event) => setProjectFilter(event.target.value)} className="input"><option value="All">All projects</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.code} — {project.name}</option>)}</select>
            <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)} className="input"><option>All</option><option>Income</option><option>Expense</option><option>Pending</option></select>
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search transactions…" className="input" />
          </div>
        </div>
      </section>

      {loading ? <p className="py-10 text-sm text-white/45">Loading finance…</p> : <div className="mt-5 space-y-5">
        {groups.map((group) => <ProjectFinanceSection key={group.key} group={group} onDelete={remove} />)}
        {!groups.length && <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-white/45">No finance entries match this filter.</div>}
      </div>}
    </div>
    <style jsx global>{`.input{min-width:0;border-radius:10px;border:1px solid rgba(255,255,255,.15);background:#111;padding:9px 12px;font-size:13px;color:white;outline:none}.input option{background:#111}`}</style>
  </main>;
}

function ProjectFinanceSection({ group, onDelete }: { group: FinanceGroup; onDelete: (item: Transaction) => Promise<void> }) {
  const income = group.items.filter((item) => item.type === "Income").reduce((sum, item) => sum + Number(item.amount), 0);
  const expenses = group.items.filter((item) => item.type === "Expense").reduce((sum, item) => sum + Number(item.amount), 0);
  const currency = group.items[0]?.currency || group.project?.financial_currency || "EGP";
  return <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.025]">
    <header className="flex flex-col gap-4 border-b border-white/10 bg-white/[.025] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div><p className="text-[10px] uppercase tracking-[.18em] text-white/35">Project finance</p><h2 className="mt-1 text-lg font-semibold">{group.title}</h2><p className="mt-1 text-xs text-white/45">{group.items.length} transaction{group.items.length === 1 ? "" : "s"} · revenue {money(income, currency)} · costs {money(expenses, currency)}</p></div>
      {group.project ? <div className="flex flex-wrap gap-2"><Link href={`/app/admin/projects/${group.project.id}/finance`} className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-xs transition hover:bg-white/[.06]">Open project finance <ArrowUpRight size={13} /></Link><Link href={`/app/admin/finance/new?project=${group.project.id}`} className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-medium text-black"><Plus size={13} />Add</Link></div> : null}
    </header>
    <div className="divide-y divide-white/10">
      {group.items.map((item) => <article key={item.id} className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-2 py-1 text-[9px] font-medium uppercase tracking-[.12em] ${item.type === "Income" ? "bg-emerald-400/10 text-emerald-200" : "bg-red-400/10 text-red-200"}`}>{item.type}</span><p className="font-medium">{item.description}</p></div><p className="mt-2 text-xs text-white/45">{item.category} · {item.transaction_date?.slice(0, 10) || "No date"} · {item.status} · {item.created_by_name || "Studio"}</p></div>
        <div className="flex flex-wrap items-center gap-2"><p className={`mr-2 text-sm font-medium ${item.type === "Income" ? "text-emerald-300" : "text-red-300"}`}>{item.type === "Income" ? "+" : "-"}{money(Number(item.amount), item.currency)}</p><Link href={`/app/admin/finance/${item.id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-xs transition hover:bg-white/[.06]"><Pencil size={13} />Edit</Link><button onClick={() => void onDelete(item)} className="inline-flex items-center gap-1 rounded-lg border border-red-400/30 px-3 py-2 text-xs text-red-200 transition hover:bg-red-400/10"><Trash2 size={13} />Delete</button></div>
      </article>)}
    </div>
  </section>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><p className="text-xs uppercase tracking-[.16em] text-white/35">{label}</p><p className="mt-4 text-2xl font-semibold">{value}</p></div>; }
