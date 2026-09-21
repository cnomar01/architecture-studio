"use client";

import type { StudioMessage } from "@/lib/client/studioMessages";

export default function MessageThread({messages,currentUserId}:{messages:StudioMessage[];currentUserId:string}){
  if(!messages.length)return <div className="flex min-h-[320px] items-center justify-center text-sm text-white/35">No messages yet.</div>;
  return <div className="max-h-[600px] space-y-4 overflow-y-auto p-5">{[...messages].reverse().map((message)=>{const own=message.senderId===currentUserId;return <div key={message.id} className={`flex ${own?"justify-end":"justify-start"}`}><div className="max-w-[78%]"><div className={`mb-1 flex items-center gap-2 text-[11px] text-white/35 ${own?"justify-end":""}`}><span>{message.senderName}</span><span>·</span><span>{new Date(message.createdAt).toLocaleString()}</span></div><div className={`rounded-2xl px-4 py-3 text-sm ${own?"bg-white text-black":"border border-white/10 bg-white/[0.04] text-white"}`}><p className="whitespace-pre-wrap leading-6">{message.body}</p></div></div></div>})}</div>;
}
