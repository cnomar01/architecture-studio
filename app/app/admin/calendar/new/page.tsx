"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CalendarEventType } from "../calendarStore";

export default function NewCalendarEvent() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [type, setType] = useState<CalendarEventType>("Deadline");
  const [project, setProject] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true); setError("");
    try {
      const response = await fetch("/api/calendar-events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, date, type, project }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not create event.");
      router.push("/app/admin/calendar");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not create event."); setSaving(false); }
  }

  return <main className="min-h-screen bg-[#111] px-6 py-10 text-white"><div className="mx-auto max-w-xl"><h1 className="text-3xl font-semibold">Add Calendar Event</h1><p className="mt-2 text-sm text-white/35">Create a database-backed event. It syncs to Google Calendar once connected.</p><form onSubmit={submit} className="mt-8 space-y-5 rounded-3xl border border-white/10 bg-white/[.03] p-6"><label className="block text-xs text-white/45">Title<input required value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none"/></label><label className="block text-xs text-white/45">Date<input required type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none"/></label><label className="block text-xs text-white/45">Type<select value={type} onChange={(event) => setType(event.target.value as CalendarEventType)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none">{["Task","Site Visit","Deadline","Meeting","Milestone"].map((item) => <option key={item}>{item}</option>)}</select></label><label className="block text-xs text-white/45">Project<input value={project} onChange={(event) => setProject(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-sm outline-none"/></label>{error&&<p className="text-sm text-red-300">{error}</p>}<button disabled={saving} className="w-full rounded-xl bg-white p-3 text-xs font-medium text-black disabled:opacity-50">{saving ? "Creating..." : "Create Event"}</button></form></div></main>;
}
