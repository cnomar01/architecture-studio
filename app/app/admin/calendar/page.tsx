"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Plus, Clock, MapPin, ListTodo } from "lucide-react";
import { getCalendarEvents, type CalendarEvent } from "./calendarStore";

function monthDays(year:number,month:number){const first=new Date(year,month,1).getDay();const count=new Date(year,month+1,0).getDate();return {first,count};}
export default function CalendarPage(){
 const now=new Date(); const [cursor,setCursor]=useState(new Date(now.getFullYear(),now.getMonth(),1)); const events=useMemo(()=>getCalendarEvents(),[]);
 const {first,count}=monthDays(cursor.getFullYear(),cursor.getMonth()); const cells=Array.from({length:first+count},(_,i)=>i<first?null:i-first+1);
 const month=cursor.toLocaleString("en-US",{month:"long",year:"numeric"});
 const dayEvents=(day:number)=>events.filter(e=>e.date===new Date(cursor.getFullYear(),cursor.getMonth(),day).toISOString().slice(0,10));
 return <main className="min-h-screen bg-[#111] px-6 py-10 text-white lg:px-10"><div className="mx-auto max-w-7xl">
  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><div className="flex items-center gap-3 text-white/35"><CalendarDays size={18}/><span className="text-[10px] uppercase tracking-[.25em]">Schedule Control</span></div><h1 className="mt-3 text-4xl font-semibold tracking-tight">Calendar</h1><p className="mt-2 text-sm text-white/35">Tasks, deadlines, site visits and project milestones in one schedule.</p></div><Link href="/app/admin/calendar/new" className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-medium text-black"><Plus size={15}/> Add Event</Link></div>
  <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
   <section className="rounded-3xl border border-white/10 bg-white/[.03] p-5"><div className="flex items-center justify-between border-b border-white/10 pb-5"><button onClick={()=>setCursor(new Date(cursor.getFullYear(),cursor.getMonth()-1,1))} className="rounded-lg border border-white/10 p-2"><ChevronLeft size={16}/></button><h2 className="font-medium">{month}</h2><button onClick={()=>setCursor(new Date(cursor.getFullYear(),cursor.getMonth()+1,1))} className="rounded-lg border border-white/10 p-2"><ChevronRight size={16}/></button></div><div className="mt-5 grid grid-cols-7 text-center text-[10px] uppercase tracking-widest text-white/25">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d=><div key={d} className="pb-3">{d}</div>)}</div><div className="grid grid-cols-7 gap-1">{cells.map((day,i)=>day===null?<div key={i} className="min-h-24"/>:<div key={day} className="min-h-24 rounded-xl border border-white/5 bg-black/10 p-2"><div className="text-xs text-white/45">{day}</div><div className="mt-2 space-y-1">{dayEvents(day).slice(0,3).map(e=><div key={e.id} className="truncate rounded-md border border-white/10 px-2 py-1 text-[10px] text-white/70" title={e.title}>{e.title}</div>)}</div></div>)}</div></section>
   <aside className="rounded-3xl border border-white/10 bg-white/[.03] p-5"><div className="flex items-center gap-2"><Clock size={16} className="text-white/35"/><h2 className="font-medium">Upcoming</h2></div><div className="mt-5 space-y-3">{events.sort((a,b)=>a.date.localeCompare(b.date)).slice(0,8).map(e=><div key={e.id} className="rounded-2xl border border-white/10 p-4"><div className="text-sm font-medium">{e.title}</div><div className="mt-2 text-xs text-white/35">{e.date}{e.time?` · ${e.time}`:""}</div><div className="mt-2 flex items-center gap-2 text-[10px] text-white/25"><span>{e.type}</span><span>·</span><span>{e.project}</span></div></div>)}</div>{events.length===0&&<p className="py-8 text-center text-sm text-white/25">No scheduled events.</p>}</aside>
  </div>
 </div></main>
}
