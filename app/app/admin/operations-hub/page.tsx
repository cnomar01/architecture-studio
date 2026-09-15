"use client";
import { useState } from "react";
import { getLeads,getContracts,getProcurement,getQuality,getSafety,updateLead,updateContract,updateProcurement,updateQuality,updateSafety } from "../complete/operationsStore";

export default function OperationsHub(){
 const [tab,setTab]=useState("CRM"); const [tick,setTick]=useState(0);
 const tabs=["CRM","Contracts","Procurement","QA/QC","HSE"];
 const data=tab==="CRM"?getLeads():tab==="Contracts"?getContracts():tab==="Procurement"?getProcurement():tab==="QA/QC"?getQuality():getSafety();
 const refresh=()=>setTick(t=>t+1);
 return <main className="min-h-screen bg-white px-6 py-10 text-black lg:px-12"><div className="mx-auto max-w-7xl">
  <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">Mason & Arc / Operations</p><h1 className="mt-3 text-4xl font-medium">Commercial & Delivery Hub</h1>
  <p className="mt-2 text-sm text-black/50">CRM · Contracts · Procurement · QA/QC · HSE</p>
  <div className="mt-8 flex flex-wrap gap-2">{tabs.map(x=><button key={x} onClick={()=>setTab(x)} className={`rounded-lg border px-4 py-2 text-xs ${tab===x?"bg-black text-white":"border-black/10"}`}>{x}</button>)}</div>
  <div className="mt-6 overflow-hidden rounded-xl border border-black/10">{data.map((x:any)=><div key={x.id} className="flex flex-col gap-3 border-b border-black/[.06] p-5 last:border-0 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-medium">{x.title||x.item||x.company}</p><p className="mt-1 text-xs text-black/45">{x.id} · {x.projectName||x.service||x.supplier||x.assignee}</p></div><div className="flex items-center gap-4"><span className="text-xs">{x.status}</span><button onClick={()=>{if(tab==="CRM")updateLead(x.id,{status:x.status==="Proposal"?"Negotiation":x.status==="Negotiation"?"Won":x.status});if(tab==="Contracts")updateContract(x.id,{status:x.status==="Active"?"Variation":x.status});if(tab==="Procurement")updateProcurement(x.id,{status:x.status==="RFQ"?"Quotations":x.status==="Quotations"?"Approved":x.status==="Approved"?"Ordered":x.status==="Ordered"?"Delivered":x.status});if(tab==="QA/QC")updateQuality(x.id,{status:x.status==="Open"?"Under Review":x.status==="Under Review"?"Corrective Action":"Closed"});if(tab==="HSE")updateSafety(x.id,{status:x.status==="Open"?"Investigating":x.status==="Investigating"?"Corrective Action":"Closed"});refresh()}} className="rounded-md bg-black px-3 py-2 text-[10px] text-white">Advance</button></div></div>)}</div>
 </div></main>
}
