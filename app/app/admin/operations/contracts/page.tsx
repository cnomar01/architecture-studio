"use client";
import {useState} from "react";
import Link from "next/link";
import {Shell,Grid} from "../shared";
import {getContracts,addContract} from "../operationsStore";
export default function Page(){const [items,setItems]=useState(getContracts()); function add(){const x=addContract({projectId:"CEM-001",client:"New Client",scope:"Architecture & construction services",value:0,startDate:new Date().toISOString().slice(0,10),endDate:"",status:"Draft",paymentMilestones:4});setItems([...items,x])} return <Shell title="Contracts" desc="{desc}"><button onClick={add} className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black">+ New contract</button><Grid>{items.map(x=><div key={x.id} className="rounded-2xl border border-white/10 p-5"><div className="text-xs text-white/35">{x.id} · {x.projectId}</div><div className="mt-3 text-lg font-semibold">{x.client}</div><p className="mt-2 text-sm text-white/45">{x.scope}</p><div className="mt-5 grid grid-cols-2 gap-3 text-xs"><span>Value: {x.value||"TBD"}</span><span>Status: {x.status}</span><span>Start: {x.startDate}</span><span>Milestones: {x.paymentMilestones}</span></div></div>)}</Grid></Shell>}
