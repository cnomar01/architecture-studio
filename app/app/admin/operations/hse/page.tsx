"use client";
import {useState} from "react";
import Link from "next/link";
import {Shell,Grid} from "../shared";
import {getHSE,addHSE} from "../operationsStore";
export default function Page(){const [items,setItems]=useState(getHSE()); function add(){const x=addHSE({projectId:"CEM-001",title:"New safety observation",area:"Site",severity:"Medium",owner:"",status:"Open",date:new Date().toISOString().slice(0,10),action:"Define corrective action"});setItems([...items,x])} return <Shell title="HSE" desc="{desc}"><button onClick={add} className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black">+ Observation</button><div className="mt-5 grid gap-3">{items.map(x=><div key={x.id} className="rounded-2xl border border-white/10 p-5"><div className="flex justify-between gap-3"><div><div className="text-xs text-white/30">{x.id} · {x.area}</div><div className="mt-2 font-semibold">{x.title}</div></div><span className="text-xs">{x.severity}</span></div><p className="mt-3 text-sm text-white/45">Action: {x.action}</p><div className="mt-4 text-xs text-white/30">Owner: {x.owner||"Unassigned"} · {x.status} · {x.date}</div></div>)}</div></Shell>}
