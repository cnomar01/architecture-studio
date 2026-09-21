"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Pencil, Plus, RefreshCw, Search, Trash2, Users } from "lucide-react";

type Client = { id: string; code: string | null; name: string; company: string | null; contact_email: string | null; contact_phone: string | null; active: boolean };

export default function ClientsPage() {
  const [items, setItems] = useState<Client[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/data/clients", { cache: "no-store", credentials: "include" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not load clients.");
      setItems(data.data || []);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load clients."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const visibleClients = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return items;
    return items.filter((client) => `${client.name} ${client.company || ""} ${client.contact_email || ""} ${client.code || ""}`.toLowerCase().includes(keyword));
  }, [items, search]);

  async function remove(client: Client) {
    if (!window.confirm(`Delete “${client.name}”? Linked projects will retain their historical client name.`)) return;
    setError("");
    const response = await fetch(`/api/data/clients?id=${encodeURIComponent(client.id)}`, { method: "DELETE", credentials: "include" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.error || "Could not delete client."); return; }
    setItems((current) => current.filter((item) => item.id !== client.id));
  }

  const active = items.filter((client) => client.active).length;
  return <main className="min-h-screen bg-[#080808] text-white">
    <div className="mx-auto max-w-[1400px] px-5 py-7 text-left sm:px-8">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs uppercase tracking-[.2em] text-white/35">Mason & Arc / Studio CRM</p><h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Clients</h1><p className="mt-2 text-sm text-white/45">Client records, contacts and their linked project workspaces.</p></div>
        <div className="flex gap-2"><button onClick={() => void load()} aria-label="Refresh clients" className="rounded-xl border border-white/15 p-3 transition hover:bg-white/[.05]"><RefreshCw size={16} /></button><Link href="/app/admin/clients/new" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black"><Plus size={16} />Add Client</Link></div>
      </header>

      {error && <p role="alert" className="mt-5 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}

      <section className="mt-6 grid gap-4 sm:grid-cols-3"><ClientMetric label="Total clients" value={items.length} /><ClientMetric label="Active clients" value={active} /><ClientMetric label="Inactive clients" value={items.length - active} /></section>

      <section className="mt-6 rounded-2xl border border-white/10 bg-white/[.025] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-semibold">Client directory</h2><p className="mt-1 text-sm text-white/45">Open a client for their details and project portfolio.</p></div><label className="flex w-full items-center gap-2 rounded-xl border border-white/15 bg-black/20 px-3 py-2.5 text-sm text-white/60 sm:w-80"><Search size={15} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search clients…" className="min-w-0 flex-1 bg-transparent text-white outline-none placeholder:text-white/30" /></label></div>
      </section>

      {loading ? <p className="py-10 text-sm text-white/45">Loading clients…</p> : <section className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visibleClients.map((client) => <article key={client.id} className="rounded-2xl border border-white/10 bg-white/[.025] p-5 transition hover:border-white/20 hover:bg-white/[.04]">
          <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="text-[10px] uppercase tracking-[.16em] text-white/35">{client.code || client.id}</p><h2 className="mt-2 truncate text-lg font-semibold">{client.name}</h2><p className="mt-1 truncate text-sm text-white/50">{client.company || "Individual client"}</p></div><span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] uppercase tracking-[.12em] ${client.active ? "bg-emerald-400/10 text-emerald-200" : "bg-white/10 text-white/45"}`}>{client.active ? "Active" : "Inactive"}</span></div>
          <div className="mt-5 space-y-1.5 border-y border-white/10 py-4 text-sm text-white/55"><p className="truncate">{client.contact_email || "No email recorded"}</p><p>{client.contact_phone || "No phone recorded"}</p></div>
          <div className="mt-5 flex flex-wrap gap-2"><Link href={`/app/admin/clients/${client.id}`} className="inline-flex items-center gap-1 rounded-lg bg-white px-3 py-2 text-xs font-medium text-black">Open client <ArrowUpRight size={13} /></Link><Link href={`/app/admin/clients/${client.id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-xs transition hover:bg-white/[.06]"><Pencil size={13} />Edit</Link><button onClick={() => void remove(client)} className="inline-flex items-center gap-1 rounded-lg border border-red-400/30 px-3 py-2 text-xs text-red-200 transition hover:bg-red-400/10"><Trash2 size={13} />Delete</button></div>
        </article>)}
      </section>}
      {!loading && !visibleClients.length && <div className="mt-5 rounded-2xl border border-dashed border-white/15 p-10 text-center text-sm text-white/45">{items.length ? "No clients match your search." : "No clients yet. Add the first client to link them to a project."}</div>}
    </div>
  </main>;
}

function ClientMetric({ label, value }: { label: string; value: number }) { return <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><div className="flex items-center justify-between text-white/35"><p className="text-xs uppercase tracking-[.16em]">{label}</p><Users size={15} /></div><p className="mt-4 text-2xl font-semibold">{value}</p></div>; }
