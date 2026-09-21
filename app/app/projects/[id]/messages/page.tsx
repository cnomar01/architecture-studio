"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MessageComposer from "@/components/messages/MessageComposer";
import MessageThread from "@/components/messages/MessageThread";
import { getStudioMessages, type StudioMessage } from "@/lib/client/studioMessages";

type User={id:string;name:string;role:string};

export default function ClientMessagesPage(){
  const params=useParams<{id:string}>();const projectId=params?.id||"";const [messages,setMessages]=useState<StudioMessage[]>([]);const [projectName,setProjectName]=useState("Project");const [user,setUser]=useState<User|null>(null);const [error,setError]=useState("");
  const load=useCallback(async()=>{setError("");try{const [messageData,projectResponse,userResponse]=await Promise.all([getStudioMessages(projectId),fetch(`/api/data/projects?projectId=${encodeURIComponent(projectId)}`,{cache:"no-store",credentials:"include"}),fetch("/api/auth/me",{cache:"no-store",credentials:"include"})]);const projects=await projectResponse.json().catch(()=>({}));const auth=await userResponse.json().catch(()=>({}));if(!projectResponse.ok)throw new Error(projects.error||"Could not load project.");setMessages(messageData);setProjectName(projects.data?.[0]?.name||"Project");setUser(auth.user||null)}catch(cause){setError(cause instanceof Error?cause.message:"Could not load messages.")}},[projectId]);
  useEffect(()=>{void load();const onFocus=()=>void load();window.addEventListener("focus",onFocus);return()=>window.removeEventListener("focus",onFocus)},[load]);const current=user||{id:"",name:"Client",role:"Client"};
  return <main className="min-h-screen bg-[#111] text-white"><header className="flex items-center justify-between px-6 py-6 md:px-10"><Link href={`/app/projects/${projectId}`} className="text-xs uppercase tracking-[.18em] text-white/50">← Project</Link><img src="/images/logo-mason-arc.png" alt="Mason & Arc" className="h-8 w-auto"/><span className="w-10"/></header><section className="mx-auto max-w-4xl px-6 pb-28 pt-12 md:px-10"><p className="text-[10px] uppercase tracking-[.25em] text-white/30">Communication</p><h1 className="mt-5 text-5xl font-light tracking-[-.05em]">{projectName}</h1><p className="mt-3 text-sm text-white/40">Messages shared directly with the Mason & Arc project team.</p>{error&&<p role="alert" className="mt-6 rounded-xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-200">{error}</p>}<div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/[.02]"><MessageThread messages={messages} currentUserId={current.id}/><MessageComposer scope="Project" projectId={projectId} projectName={projectName} senderId={current.id} senderName={current.name} senderRole={current.role} onSent={load}/></div></section></main>;
}
