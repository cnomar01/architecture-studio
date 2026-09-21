"use client";

import { useCallback, useEffect, useState } from "react";
import MessageComposer from "@/components/messages/MessageComposer";
import MessageThread from "@/components/messages/MessageThread";
import { getStudioMessages, type StudioMessage } from "@/lib/client/studioMessages";

type User={id:string;name:string;role:string};

export default function MessagesPage(){
  const [messages,setMessages]=useState<StudioMessage[]>([]); const [user,setUser]=useState<User|null>(null); const [error,setError]=useState("");
  const load=useCallback(async()=>{setError("");try{const [all,response]=await Promise.all([getStudioMessages(),fetch("/api/auth/me",{cache:"no-store",credentials:"include"})]);const auth=await response.json().catch(()=>({}));if(!response.ok)throw new Error("Could not load the signed-in user.");setMessages(all.filter((item)=>!item.projectId));setUser(auth.user||null)}catch(cause){setError(cause instanceof Error?cause.message:"Could not load messages.")}},[]);
  useEffect(()=>{void load();const onFocus=()=>void load();window.addEventListener("focus",onFocus);return()=>window.removeEventListener("focus",onFocus)},[load]);
  const current=user||{id:"",name:"Studio User",role:"User"};
  return <main className="min-h-screen bg-[#080808] p-6 text-white md:p-8"><div className="mx-auto max-w-6xl"><div className="mb-8"><p className="text-xs uppercase tracking-[.25em] text-white/30">Communication</p><h1 className="mt-2 text-3xl font-semibold">Messages</h1><p className="mt-2 text-sm text-white/40">Shared internal communication stored in the studio database.</p></div>{error&&<p role="alert" className="mb-5 rounded-xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>}<div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[.03]"><MessageThread messages={messages} currentUserId={current.id}/><MessageComposer scope="Internal" senderId={current.id} senderName={current.name} senderRole={current.role} onSent={load}/></div></div></main>;
}
