"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useParams } from "next/navigation";
import { resolveProject } from "@/app/app/core/projectRelation";
import { getHSE } from "@/app/app/admin/operations/operationsStore";

export default function ProjectHSEPage(){
  const params=useParams<{id:string}>(); const id=params?.id??""; const [tick,setTick]=useState(0); useEffect(()=>{const t=window.setInterval(()=>setTick(v=>v+1),1500);return()=>window.clearInterval(t)},[]);
  const project=useMemo(()=>id?resolveProject(id):null,[id,tick]); if(!project)return <NotFound/>;
  const items=getHSE().filter(x=>x.projectId===project.id); const open=items.filter(x=>x.status!=="Closed"); const critical=items.filter(x=>x.severity==="Critical");
  return <main className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-8"><div className="mx-auto max-w-7xl"><Link href={`/app/admin/projects/${project.id}`} className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white"><ArrowLeft size={15}/>Back to Project</Link><header className="mt-8 border-b border-white/10 pb-7"><div className="text-xs uppercase tracking-[.25em] text-white/30">{project.code} · HSE</div><h1 className="mt-2 text-3xl font-semibold">{project.name}</h1><p className="mt-2 text-sm text-white/40">Health, safety and environmental observations linked to this project.</p></header>
  <section className="mt-8 grid gap-4 md:grid-cols-3"><Metric label="Observations" value={String(items.length)}/><Metric label="Open Actions" value={String(open.length)}/><Metric label="Critical" value={String(critical.length)}/></section>
  <section className="mt-6 rounded-3xl border border-white/10 bg-white/[.025] p-6"><div className="flex items-center gap-3"><ShieldCheck size={18}/><h2 className="font-semibold">HSE Observations</h2></div>{items.length===0?<Empty/>:<div className="mt-5 grid gap-3 md:grid-cols-2">{items.map(x=><div key={x.id} className="rounded-2xl border border-white/10 p-5"><div className="flex justify-between gap-3"><div><div className="text-xs text-white/35">{x.id} · {x.area}</div><div className="mt-2 font-semibold">{x.title}</div></div><span className="text-xs text-white/45">{x.severity}</span></div><p className="mt-3 text-sm text-white/45">Action: {x.action}</p><div className="mt-4 text-xs text-white/35">Owner: {x.owner||"Unassigned"} · {x.status} · {x.date}</div></div>)}</div>}</section></div></main>;
}
function Metric({label,value}:{label:string;value:string}){return <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><div className="text-xs uppercase tracking-[.16em] text-white/30">{label}</div><div className="mt-4 text-2xl font-semibold">{value}</div></div>}
function Empty(){return <div className="mt-6 rounded-2xl border border-dashed border-white/10 py-14 text-center text-sm text-white/40">No HSE observations linked to this project.</div>}
function NotFound(){return <main className="min-h-screen bg-[#080808] p-8 text-white"><Link href="/app/admin/projects" className="text-sm text-white/45">← Back to Projects</Link><h1 className="mt-20 text-center text-2xl font-semibold">Project not found</h1></main>}
