"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Camera, ClipboardCheck, MapPin } from "lucide-react";
import { useParams } from "next/navigation";
import { resolveProject } from "@/app/app/core/projectRelation";
import { getProjectSiteReports } from "@/app/app/engineer/site/siteStore";

export default function ProjectSitePage() {
  const params = useParams<{ id: string }>(); const id = params?.id ?? ""; const [tick,setTick]=useState(0);
  useEffect(()=>{const t=window.setInterval(()=>setTick(v=>v+1),1500);return()=>window.clearInterval(t)},[]);
  const project=useMemo(()=>id?resolveProject(id):null,[id,tick]);
  if(!project)return <NotFound/>;
  const reports=getProjectSiteReports(project.id); const issues=reports.flatMap(r=>r.issues); const open=issues.filter(i=>i.status!=="Resolved"); const photos=reports.reduce((n,r)=>n+r.photos.length,0);
  return <main className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-8"><div className="mx-auto max-w-7xl"><Link href={`/app/admin/projects/${project.id}`} className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white"><ArrowLeft size={15}/>Back to Project</Link><header className="mt-8 border-b border-white/10 pb-7"><div className="text-xs uppercase tracking-[.25em] text-white/30">{project.code} · Site</div><h1 className="mt-2 text-3xl font-semibold">{project.name}</h1><p className="mt-2 text-sm text-white/40">Site reports, photos and open site issues linked to this project.</p></header>
  <section className="mt-8 grid gap-4 md:grid-cols-3"><Metric icon={ClipboardCheck} label="Site Reports" value={String(reports.length)}/><Metric icon={MapPin} label="Open Issues" value={String(open.length)}/><Metric icon={Camera} label="Site Photos" value={String(photos)}/></section>
  <section className="mt-6 rounded-3xl border border-white/10 bg-white/[.025] p-6"><h2 className="font-semibold">Site Reports</h2>{reports.length===0?<Empty text="No site reports linked to this project yet."/>:<div className="mt-5 space-y-3">{reports.map(r=><div key={r.id} className="rounded-2xl border border-white/10 p-5"><div className="flex flex-col justify-between gap-2 md:flex-row"><div><div className="text-xs text-white/35">{r.id} · {r.date} · {r.visitType}</div><div className="mt-2 font-semibold">{r.summary}</div></div><div className="text-sm text-white/45">{r.engineer}</div></div><div className="mt-4 grid gap-2 text-sm text-white/45 md:grid-cols-3"><span>Weather: {r.weather||"—"}</span><span>Issues: {r.issues.length}</span><span>Photos: {r.photos.length}</span></div></div>)}</div>}</section>
  <section className="mt-6 rounded-3xl border border-white/10 bg-white/[.025] p-6"><h2 className="font-semibold">Open Site Issues</h2>{open.length===0?<Empty text="No open site issues."/>:<div className="mt-5 grid gap-3 md:grid-cols-2">{open.map((i)=><div key={i.id} className="rounded-2xl border border-white/10 p-5"><div className="flex justify-between gap-3"><div><div className="text-xs text-white/35">{i.id} · {i.location}</div><div className="mt-2 font-medium">{i.title}</div></div><span className="text-xs text-white/45">{i.priority}</span></div><p className="mt-3 text-sm text-white/45">{i.description}</p><div className="mt-4 text-xs text-white/35">Assigned: {i.assignedTo||"Unassigned"} · {i.status}</div></div>)}</div>}</section></div></main>;
}
function Metric({icon:Icon,label,value}:{icon:typeof Camera;label:string;value:string}){return <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5"><Icon size={18} className="text-white/45"/><div className="mt-4 text-2xl font-semibold">{value}</div><div className="mt-1 text-xs text-white/35">{label}</div></div>}
function Empty({text}:{text:string}){return <div className="mt-6 rounded-2xl border border-dashed border-white/10 py-14 text-center text-sm text-white/40">{text}</div>}
function NotFound(){return <main className="min-h-screen bg-[#080808] p-8 text-white"><Link href="/app/admin/projects" className="text-sm text-white/45">← Back to Projects</Link><h1 className="mt-20 text-center text-2xl font-semibold">Project not found</h1></main>}
