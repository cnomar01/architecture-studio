"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Camera, ClipboardCheck, Plus, ShieldAlert, CheckCircle2, ArrowRight } from "lucide-react";
import { getSiteReports, updateSiteIssue, type SiteIssueStatus, type SiteReport } from "./siteStore";

export default function SiteReportsPage() {
  const [reports, setReports] = useState<SiteReport[]>([]);
  const [filter, setFilter] = useState<"All" | "Open" | "In Progress" | "Resolved">("All");

  function refresh() { setReports(getSiteReports()); }
  useEffect(() => { refresh(); const timer = window.setInterval(refresh, 1500); return () => window.clearInterval(timer); }, []);

  const issues = useMemo(() => reports.flatMap((report) => report.issues.map((issue) => ({ ...issue, reportId: report.id, project: report.project, date: report.date }))), [reports]);
  const visibleIssues = filter === "All" ? issues : issues.filter((issue) => issue.status === filter);
  const stats = {
    visits: reports.length,
    photos: reports.reduce((n, r) => n + r.photos.length, 0),
    open: issues.filter((i) => i.status !== "Resolved").length,
    resolved: issues.filter((i) => i.status === "Resolved").length,
  };

  return (
    <main className="min-h-screen bg-[#111] text-white">
      <header className="border-b border-white/10 px-6 py-5 md:px-10"><div className="mx-auto flex max-w-7xl items-center justify-between"><Link href="/app/engineer"><img src="/images/logo-mason-arc.png" alt="Mason & Arc" className="h-8 w-auto" /></Link><Link href="/app/engineer" className="text-[9px] uppercase tracking-[.18em] text-white/30">← Workspace</Link></div></header>
      <section className="mx-auto max-w-7xl px-6 pb-28 pt-12 md:px-10 md:pt-20">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><p className="text-[9px] uppercase tracking-[.25em] text-white/20">Site Intelligence / Field Operations</p><h1 className="mt-4 text-5xl font-light tracking-[-.05em] md:text-7xl">Site Management 2.0</h1><p className="mt-5 max-w-2xl text-sm leading-6 text-white/30">Daily reports, site photos, issue tracking and resolution history for City Edge Mall.</p></div><Link href="/app/engineer/site/new" className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 text-[10px] uppercase tracking-[.16em] text-black"><Plus size={14}/> New Site Visit</Link></div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4"><Stat icon={<ClipboardCheck size={16}/>} label="Site Visits" value={stats.visits}/><Stat icon={<Camera size={16}/>} label="Photos" value={stats.photos}/><Stat icon={<ShieldAlert size={16}/>} label="Open Issues" value={stats.open}/><Stat icon={<CheckCircle2 size={16}/>} label="Resolved" value={stats.resolved}/></div>
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-2xl border border-white/10 p-6 md:p-8"><div className="flex items-end justify-between gap-4"><div><p className="text-[9px] uppercase tracking-[.2em] text-white/20">Issue Control</p><h2 className="mt-3 text-2xl font-light">Live Site Issues</h2></div><div className="flex flex-wrap gap-2">{["All","Open","In Progress","Resolved"].map((item) => <button key={item} onClick={() => setFilter(item as typeof filter)} className={`rounded-full px-3 py-2 text-[8px] uppercase tracking-[.12em] ${filter === item ? "bg-white text-black" : "border border-white/10 text-white/30"}`}>{item}</button>)}</div></div><div className="mt-6 space-y-3">{visibleIssues.length === 0 ? <Empty text="No issues in this view."/> : visibleIssues.map((issue) => <IssueCard key={`${issue.reportId}-${issue.id}`} issue={issue} onChange={(status) => { updateSiteIssue(issue.reportId, issue.id, { status }); refresh(); }}/>)}</div></section>
          <section className="rounded-2xl border border-white/10 p-6 md:p-8"><div className="flex items-end justify-between"><div><p className="text-[9px] uppercase tracking-[.2em] text-white/20">Field Activity</p><h2 className="mt-3 text-2xl font-light">Site History</h2></div><span className="text-[9px] text-white/20">{reports.length} reports</span></div><div className="mt-6 space-y-3">{reports.length === 0 ? <Empty text="No site reports yet."/> : reports.slice(0, 8).map((report) => <div key={report.id} className="rounded-xl border border-white/10 p-5"><div className="flex items-start justify-between gap-4"><div><p className="text-[8px] uppercase tracking-[.14em] text-white/20">{report.id} · {report.visitType}</p><h3 className="mt-2 text-sm text-white/70">{report.date}</h3><p className="mt-2 text-xs text-white/25">{report.engineer}</p></div><span className="text-xs text-white/25">{report.photos.length} photos</span></div>{report.summary && <p className="mt-4 text-xs leading-5 text-white/30">{report.summary}</p>}</div>)}</div><Link href="/app/engineer/site/new" className="mt-5 inline-flex items-center gap-2 text-[9px] uppercase tracking-[.15em] text-white/30">Create another report <ArrowRight size={12}/></Link></section>
        </div>
      </section>
    </main>
  );
}
function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) { return <div className="bg-[#151515] p-6"><div className="flex items-center justify-between text-white/25">{icon}<span className="text-[8px] uppercase tracking-[.16em]">{label}</span></div><p className="mt-4 text-3xl font-light">{value}</p></div>; }
function IssueCard({ issue, onChange }: { issue: { title: string; description: string; location: string; priority: string; assignedTo: string; status: SiteIssueStatus }; onChange: (status: SiteIssueStatus) => void }) { return <div className="rounded-xl border border-white/10 p-5"><div className="flex flex-col justify-between gap-4 md:flex-row"><div><div className="flex flex-wrap items-center gap-3"><h3 className="text-sm text-white/70">{issue.title}</h3><span className="text-[8px] uppercase tracking-[.12em] text-white/25">{issue.priority}</span></div><p className="mt-2 text-xs text-white/25">{issue.location} · {issue.assignedTo || "Unassigned"}</p>{issue.description && <p className="mt-2 max-w-xl text-xs leading-5 text-white/20">{issue.description}</p>}</div><div className="flex shrink-0 gap-2">{issue.status === "Open" && <button onClick={() => onChange("In Progress")} className="rounded-full border border-white/10 px-4 py-2 text-[8px] uppercase tracking-[.12em] text-white/35">Start</button>}{issue.status === "In Progress" && <button onClick={() => onChange("Resolved")} className="rounded-full bg-white px-4 py-2 text-[8px] uppercase tracking-[.12em] text-black">Resolve</button>}{issue.status === "Resolved" && <span className="rounded-full border border-white/10 px-4 py-2 text-[8px] uppercase tracking-[.12em] text-white/25">Resolved</span>}</div></div></div>; }
function Empty({ text }: { text: string }) { return <div className="rounded-xl border border-dashed border-white/10 px-6 py-12 text-center text-xs text-white/20">{text}</div>; }
