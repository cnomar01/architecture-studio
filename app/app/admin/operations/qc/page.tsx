"use client";
import {useState} from "react";
import Link from "next/link";
import {Shell,Grid} from "../shared";
import {getQC,addQC} from "../operationsStore";
export default function Page(){const [items,setItems]=useState(getQC()); function add(){const x=addQC({projectId:"CEM-001",title:"New inspection",discipline:"Architecture",inspector:"",status:"Open",priority:"Medium",dueDate:"",notes:""});setItems([...items,x])} return <Shell title="QA / QC" desc="{desc}"><button onClick={add} className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-black">+ Inspection</button><div className="mt-5 grid gap-3">{items.map(x=><div key={x.id} className="rounded-2xl border border-white/10 p-5"><div className="flex flex-wrap justify-between gap-3"><div><div className="text-xs text-white/30">{x.id} · {x.discipline}</div><div className="mt-2 font-semibold">{x.title}</div></div><div className="text-xs">{x.status} · {x.priority}</div></div><p className="mt-3 text-sm text-white/45">{x.notes}</p><div className="mt-4 text-xs text-white/30">Inspector: {x.inspector||"Unassigned"} · Due: {x.dueDate||"TBD"}</div></div>)}</div></Shell>}
