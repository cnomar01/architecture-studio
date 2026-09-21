"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, AlertTriangle, ArrowRight, Bot, CheckCircle2, CircleDollarSign, HardHat, RefreshCw, ShieldAlert } from "lucide-react";
import { getStudioOverview, type StudioOverview } from "@/lib/client/studioOverview";

type Card = { label: string; value: string | number; status: string; icon: React.ComponentType<{ size?: number }> };

export default function CommandCenterPage() {
  const [data, setData] = useState<StudioOverview | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const load = useCallback(async () => { setError(""); try { setData(await getStudioOverview()); } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load command center."); } finally { setLoading(false); } }, []);
  useEffect(() => { void load(); const onFocus = () => void load(); window.addEventListener("focus", onFocus); return () => window.removeEventListener("focus", onFocus); }, [load]);

  const view = useMemo(() => {
    const operations = data?.operations;
    const construction = operations?.construction || [];
    const quality = operations?.quality || [];
    const safety = operations?.safety || [];
    const procurement = operations?.procurement || [];
    const contracts = operations?.contracts || [];
    const leads = operations?.leads || [];
    const urgent = [...construction, ...quality].filter((item) => item.priority === "Urgent" && item.status !== "Closed");
    const openProc = procurement.filter((item) => !["Closed", "Delivered"].includes(String(item.status)));
    const openSafety = safety.filter((item) => item.status !== "Closed");
    const activeContracts = contracts.filter((item) => item.status === "Active");
    const weightedRisk = Math.min(100, urgent.length * 18 + openSafety.filter((item) => ["High", "Critical"].includes(String(item.severity))).length * 15 + openProc.length * 5);
    const health = 100 - weightedRisk;
    const signal = health >= 80 ? "Stable" : health >= 60 ? "Watch" : health >= 40 ? "High Risk" : "Critical";
    return { urgent, openProc, openSafety, activeContracts, leads, health, signal };
  }, [data]);

  const cards: Card[] = [
    { label: "Project Health", value: `${view.health}%`, status: view.signal, icon: Activity },
    { label: "Urgent Controls", value: view.urgent.length, status: "Needs attention", icon: AlertTriangle },
    { label: "Procurement", value: view.openProc.length, status: "Open items", icon: HardHat },
    { label: "Safety / HSE", value: view.openSafety.length, status: "Open controls", icon: ShieldAlert },
    { label: "Active Contracts", value: view.activeContracts.length, status: "Commercial", icon: CircleDollarSign },
    { label: "AI Actions", value: "Ready", status: "Owner-gated", icon: Bot },
  ];

  return <main className="min-h-screen bg-white px-6 py-10 text-black lg:px-12"><div className="mx-auto max-w-7xl">
    <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">Mason & Arc / Command Center</p>
    <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"><div><h1 className="text-4xl font-medium tracking-tight">Studio Command Center</h1><p className="mt-2 text-sm text-black/50">Shared controls from projects, delivery, procurement and HSE.</p></div><div className="flex items-center gap-2"><button onClick={() => void load()} aria-label="Refresh command center" className="rounded-full border border-black/10 p-2.5"><RefreshCw size={14}/></button><span className="rounded-full border border-black/10 px-4 py-2 text-xs">{view.signal}</span></div></div>
    {error && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
    {loading && !data ? <p className="py-24 text-center text-sm text-black/45">Loading shared controls…</p> : <>
      <section className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-6">{cards.map((card) => { const Icon = card.icon; return <div key={card.label} className="rounded-xl border border-black/10 p-5"><Icon size={17}/><p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-black/40">{card.label}</p><p className="mt-2 text-2xl font-medium">{card.value}</p><p className="mt-1 text-[10px] text-black/40">{card.status}</p></div>; })}</section>
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-black/10 p-6"><div className="flex items-center justify-between"><h2 className="font-medium">Critical signals</h2><Bot size={17}/></div><div className="mt-5 space-y-3">{view.urgent.slice(0,5).map((item) => <div key={item.id} className="flex items-center justify-between border-b border-black/[.06] pb-3"><div><p className="text-sm">{String(item.title || "Untitled control")}</p><p className="text-[10px] text-black/40">{item.id} · {projectName(data, item.project_id)}</p></div><ArrowRight size={14}/></div>)}{!view.urgent.length && <p className="text-sm text-black/45">No urgent controls detected.</p>}</div></div>
        <div className="rounded-xl border border-black/10 p-6"><h2 className="font-medium">Next decisions</h2><div className="mt-5 space-y-3 text-sm">{view.openProc.slice(0,3).map((item) => <Link href="/app/admin/operations-hub" key={item.id} className="flex gap-3 border-b border-black/[.06] pb-3"><CircleDollarSign size={15}/><span>Review procurement: <strong>{String(item.item)}</strong></span></Link>)}{view.leads.filter((item) => ["Proposal","Negotiation"].includes(String(item.status))).slice(0,2).map((item) => <Link href="/app/admin/operations-hub" key={item.id} className="flex gap-3 border-b border-black/[.06] pb-3"><Activity size={15}/><span>Commercial follow-up: <strong>{String(item.company)}</strong></span></Link>)}{view.activeContracts.map((item) => <Link href="/app/admin/operations-hub" key={item.id} className="flex gap-3"><CheckCircle2 size={15}/><span>Contract active: <strong>{String(item.title)}</strong></span></Link>)}</div></div>
      </section>
      <div className="mt-6 rounded-xl bg-black p-6 text-white"><p className="text-[10px] uppercase tracking-[0.25em] text-white/45">Connected Operating Loop</p><p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">This view now reads the same shared records used by Projects, Operations Hub and Finance. Changes no longer depend on one browser&apos;s local storage.</p></div>
    </>}
  </div></main>;
}

function projectName(data: StudioOverview | null, projectId: unknown) {
  return data?.projects.find((project) => project.id === projectId)?.name || "Studio";
}
