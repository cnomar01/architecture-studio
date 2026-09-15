"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Send, FileText, Plus, CheckCircle2 } from "lucide-react";
import { addTransmittal, getTransmittals, getTransmittalFiles, type TransmittalStatus } from "./transmittalStore";

export default function TransmittalsPage() {
  const [items, setItems] = useState(getTransmittals());
  const [showNew, setShowNew] = useState(false);
  const [subject, setSubject] = useState("");
  const [recipient, setRecipient] = useState("");
  const [notes, setNotes] = useState("");

  function refresh() { setItems(getTransmittals()); }
  useEffect(() => { refresh(); }, []);

  function create() {
    if (!subject.trim() || !recipient.trim()) return;
    addTransmittal({ projectId: "CEM-001", project: "City Edge Mall", subject, recipient, issuedBy: "Mason & Arc", status: "Draft", fileIds: ["FIL-001"], notes });
    setSubject(""); setRecipient(""); setNotes(""); setShowNew(false); refresh();
  }

  return <div className="min-h-screen bg-[#f6f6f4] px-4 py-6 text-[#111] md:px-8"><div className="mx-auto max-w-6xl">
    <Link href="/app/admin/files" className="inline-flex items-center gap-2 text-sm text-black/50"><ArrowLeft size={16}/> Files</Link>
    <div className="mt-6 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-xs uppercase tracking-[.25em] text-black/40">Document Control</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Transmittals</h1><p className="mt-2 text-sm text-black/50">Issue controlled drawing and document packages with a traceable delivery record.</p></div><button onClick={()=>setShowNew(!showNew)} className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm text-white"><Plus size={16}/> New Transmittal</button></div>
    {showNew && <div className="mt-6 rounded-2xl border border-black/8 bg-white p-5"><div className="grid gap-4 md:grid-cols-2"><label className="text-sm">Subject<input value={subject} onChange={e=>setSubject(e.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3" placeholder="Drawing package / document issue"/></label><label className="text-sm">Recipient<input value={recipient} onChange={e=>setRecipient(e.target.value)} className="mt-2 w-full rounded-xl border border-black/10 px-4 py-3" placeholder="Client / consultant / contractor"/></label></div><label className="mt-4 block text-sm">Notes<textarea value={notes} onChange={e=>setNotes(e.target.value)} className="mt-2 min-h-24 w-full rounded-xl border border-black/10 px-4 py-3"/></label><button onClick={create} className="mt-4 rounded-full bg-black px-5 py-3 text-sm text-white">Create Draft</button></div>}
    <div className="mt-6 grid gap-3">{items.map(item=>{const files=getTransmittalFiles(item); return <div key={item.id} className="rounded-2xl border border-black/8 bg-white p-5"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><div className="flex items-center gap-2"><span className="text-xs font-semibold uppercase tracking-wider text-black/40">{item.number}</span><span className="rounded-full bg-black/5 px-3 py-1 text-xs">{item.status}</span></div><h2 className="mt-2 font-semibold">{item.subject}</h2><p className="mt-1 text-sm text-black/50">{item.project} · To {item.recipient} · {item.issuedDate}</p></div><div className="flex items-center gap-2 text-sm text-black/55"><Send size={15}/>{files.length} file{files.length===1?"":"s"}</div></div><div className="mt-4 border-t border-black/6 pt-4">{files.map(file=><div key={file.id} className="flex items-center gap-2 text-sm"><FileText size={15}/><span>{file.name}</span><span className="rounded-full bg-black px-2 py-1 text-[10px] text-white">{file.revision}</span>{file.status==="Approved"&&<CheckCircle2 size={14} className="text-emerald-600"/>}</div>)}</div>{item.notes&&<p className="mt-3 text-xs text-black/45">{item.notes}</p>}</div>})}</div>
  </div></div>;
}
