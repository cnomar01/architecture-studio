"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, FileText, MessageSquare } from "lucide-react";
import { getProjectById, type Project } from "@/lib/core/projectStore";
import { getProjectFiles } from "@/app/app/admin/files/fileStore";
import { getProjectMessages } from "@/lib/core/messageStore";
import { getApprovals } from "@/app/app/admin/approvals/approvalStore";

export default function ClientActivityPage() {
  const [project, setProject] = useState<Project>();
  const [events, setEvents] = useState<{ label: string; detail: string; date: string; icon: React.ReactNode }[]>([]);

  useEffect(() => {
    const id = window.location.pathname.split("/").filter(Boolean).at(-2);
    if (!id) return;
    const current = getProjectById(id);
    setProject(current ?? undefined);
    if (!current) return;
    const files = getProjectFiles(current.id).map((f) => ({ label: "File updated", detail: `${f.name} · ${f.revision}`, date: f.uploadedDate, icon: <FileText size={15} /> }));
    const approvals = getApprovals().filter((a) => a.projectId === current.id || a.project === current.name).map((a) => ({ label: `Approval ${a.status}`, detail: a.title, date: a.submittedDate, icon: <CheckCircle2 size={15} /> }));
    const messages = getProjectMessages(current.id).map((m) => ({ label: "Project message", detail: `${m.senderName}: ${m.body}`, date: m.createdAt, icon: <MessageSquare size={15} /> }));
    setEvents([...files, ...approvals, ...messages].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 20));
  }, []);

  if (!project) return <main className="min-h-screen bg-[#111] p-8 text-white"><Link href="/app" className="text-sm text-white/40">← Client Portal</Link><p className="mt-10">Project not found.</p></main>;
  return <main className="min-h-screen bg-[#111] text-white"><div className="mx-auto max-w-5xl px-6 py-10 md:px-10"><Link href={`/app/projects/${project.id}`} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/35"><ArrowLeft size={15} /> Project</Link><p className="mt-14 text-[9px] uppercase tracking-[0.25em] text-white/25">Client Activity</p><h1 className="mt-4 text-5xl font-light tracking-[-0.05em]">Project timeline</h1><p className="mt-4 text-sm text-white/35">A simple client-facing history of the latest project activity.</p><div className="mt-12 space-y-3">{events.length ? events.map((event, i) => <div key={`${event.label}-${event.date}-${i}`} className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5"><div className="mt-1 text-white/35">{event.icon}</div><div className="min-w-0 flex-1"><div className="flex flex-col justify-between gap-2 sm:flex-row"><p className="text-sm text-white/70">{event.label}</p><p className="text-[9px] uppercase tracking-[0.15em] text-white/20">{new Date(event.date).toLocaleString()}</p></div><p className="mt-2 text-xs leading-6 text-white/35">{event.detail}</p></div></div>) : <div className="rounded-2xl border border-white/10 p-7 text-sm text-white/35">No activity recorded yet.</div>}</div></div></main>;
}
