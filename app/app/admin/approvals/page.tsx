"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Plus, RefreshCw } from "lucide-react";
import { listResource } from "@/lib/client/dataApi";

type Approval = { id:string; project_id:string|null; project_name:string|null; title:string; type:string; revision:string|null; status:string; submitted_by_name:string|null; reviewed_by_name:string|null };

export default function ApprovalsPage(){
  const [items,setItems]=useState<Approval[]>([]); const [loading,setLoading]=useState(true); const [error,setError]=useState("");
  const load=useCallback(async()=>{setError("");try{setItems((await listResource<Approval>("approvals",undefined,500)).data)}catch(cause){setError(cause instanceof Error?cause.message:"Could not load approvals.")}finally{setLoading(false)}},[]);
  useEffect(()=>{void load()},[load]);
  return <main className="mx-auto max-w-6xl p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><h1 className="text-2xl font-semibold">Approvals</h1><p className="mt-1 text-sm opacity-70">Shared project submissions and review decisions.</p></div><div className="flex gap-2"><button onClick={()=>void load()} aria-label="Refresh approvals" className="rounded-xl border px-3 py-2.5"><RefreshCw size={15}/></button><Link href="/app/admin/approvals/new" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm text-black"><Plus size={15}/>New approval</Link></div></div>{error&&<p role="alert" className="mt-5 rounded-xl border border-red-400/30 p-4 text-sm text-red-300">{error}</p>}<div className="mt-6 overflow-hidden rounded-2xl border border-white/10"><table className="w-full text-sm"><thead><tr className="border-b border-white/10 text-left"><th className="p-3">Title</th><th className="p-3">Project</th><th className="p-3">Revision</th><th className="p-3">Status</th></tr></thead><tbody>{items.map(item=><tr key={item.id} className="border-b border-white/10 last:border-0"><td className="p-3"><Link href={`/app/admin/approvals/${item.id}`} className="font-medium hover:underline">{item.title}</Link><p className="mt-1 text-xs opacity-45">{item.type} · {item.submitted_by_name||"Studio"}</p></td><td className="p-3">{item.project_name||"Unassigned"}</td><td className="p-3">{item.revision||"—"}</td><td className="p-3">{item.status}</td></tr>)}</tbody></table>{loading&&<div className="p-8 text-center opacity-60">Loading approvals…</div>}{!loading&&!items.length&&<div className="p-8 text-center opacity-60">No approvals yet.</div>}</div></main>;
}
