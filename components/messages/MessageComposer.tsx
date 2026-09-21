"use client";

import { useState } from "react";
import { createStudioMessage } from "@/lib/client/studioMessages";

type Props={projectId?:string;senderId:string;senderName:string;senderRole:string;scope?:"Internal"|"Project";projectName?:string;onSent?:()=>void|Promise<void>};

export default function MessageComposer({projectId,onSent}:Props){
  const [body,setBody]=useState(""); const [sending,setSending]=useState(false); const [error,setError]=useState("");
  async function send(){const clean=body.trim();if(!clean||sending)return;setSending(true);setError("");try{await createStudioMessage({projectId,body:clean});setBody("");await onSent?.()}catch(cause){setError(cause instanceof Error?cause.message:"Could not send message.")}finally{setSending(false)}}
  return <div className="border-t border-white/10 bg-black/20 p-4">{error&&<p role="alert" className="mb-3 text-xs text-red-300">{error}</p>}<div className="flex items-end gap-2"><textarea value={body} onChange={(event)=>setBody(event.target.value)} onKeyDown={(event)=>{if(event.key==="Enter"&&!event.shiftKey){event.preventDefault();void send()}}} rows={1} placeholder="Write a message…" className="min-h-11 flex-1 resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/25 focus:border-white/25"/><button type="button" onClick={()=>void send()} disabled={!body.trim()||sending} className="h-11 rounded-xl bg-white px-5 text-sm font-medium text-black disabled:opacity-40">{sending?"Sending…":"Send"}</button></div><p className="mt-2 text-[10px] text-white/25">Enter to send · Shift+Enter for a new line</p></div>;
}
