"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";

type Client = { id:string; code:string|null; name:string; company:string|null; contact_email:string|null; contact_phone:string|null; active:boolean };

export default function ClientsPage() {
  const [items, setItems] = useState<Client[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/data/clients", { cache:"no-store", credentials:"include" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Could not load clients.");
      setItems(data.data || []);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load clients."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  async function remove(client: Client) {
    if (!window.confirm(`Delete ${client.name}? Linked projects will keep their historical client name.`)) return;
    setError("");
    const response = await fetch(`/api/data/clients?id=${encodeURIComponent(client.id)}`, { method:"DELETE", credentials:"include" });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.error || "Could not delete client."); return; }
    setItems((current) => current.filter((item) => item.id !== client.id));
  }

  return <main className="mx-auto min-h-screen max-w-6xl p-5 text-black sm:p-6">
    <header className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs uppercase tracking-[.2em] text-black/45">Studio CRM</p><h1 className="mt-2 text-3xl font-semibold">Clients</h1><p className="mt-2 text-sm text-black/55">Shared client records for the whole studio.</p></div><div className="flex gap-2"><button onClick={() => void load()} aria-label="Refresh clients" className="rounded-xl border border-black/10 px-3 py-3"><RefreshCw size={16}/></button><Link href="/app/admin/clients/new" className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-3 text-sm font-medium text-white"><Plus size={16}/>Add Client</Link></div></header>
    {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
    {loading ? <p className="mt-8 text-sm text-black/50">Loading clients…</p> : <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{items.map((client) => <article key={client.id} className="rounded-2xl border border-black/10 bg-white p-5"><div className="flex justify-between gap-3"><div className="min-w-0"><p className="text-xs text-black/45">{client.code || client.id}</p><h2 className="mt-1 truncate font-semibold">{client.name}</h2><p className="mt-1 truncate text-sm text-black/60">{client.company || "Individual Client"}</p></div><span className={`h-fit rounded-full px-2 py-1 text-[10px] ${client.active ? "bg-emerald-50 text-emerald-700" : "bg-black/5 text-black/50"}`}>{client.active ? "Active" : "Inactive"}</span></div><div className="mt-5 space-y-1 text-sm text-black/65"><p className="truncate">{client.contact_email || "—"}</p><p>{client.contact_phone || "—"}</p></div><div className="mt-5 flex gap-2"><Link href={`/app/admin/clients/${client.id}`} className="rounded-lg border border-black/10 px-3 py-2 text-xs">Open</Link><Link href={`/app/admin/clients/${client.id}/edit`} className="inline-flex items-center gap-1 rounded-lg border border-black/10 px-3 py-2 text-xs"><Pencil size={13}/>Edit</Link><button onClick={() => void remove(client)} className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs text-red-700"><Trash2 size={13}/>Delete</button></div></article>)}</div>}
    {!loading && !items.length && <div className="mt-8 rounded-2xl border border-dashed border-black/15 p-10 text-center text-sm text-black/55">No clients yet. Add the first client to link them to a project.</div>}
  </main>;
}
