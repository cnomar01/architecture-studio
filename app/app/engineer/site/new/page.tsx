"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Camera, Trash2, Upload } from "lucide-react";
import { addSiteReport, type SitePhoto } from "../siteStore";

type IssueForm = { title: string; description: string; location: string; priority: "Low" | "Medium" | "High" | "Urgent"; assignedTo: string };
type PhotoDraft = Omit<SitePhoto, "id" | "uploadedAt">;

export default function NewSiteReportPage() {
  const router = useRouter();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [visitType, setVisitType] = useState("Routine Inspection");
  const [weather, setWeather] = useState("Clear");
  const [summary, setSummary] = useState("");
  const [issues, setIssues] = useState<IssueForm[]>([]);
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);

  function addIssue() { setIssues((current) => [...current, { title: "", description: "", location: "", priority: "Medium", assignedTo: "Omar Mohamed" }]); }
  function updateIssue(index: number, field: keyof IssueForm, value: string) { setIssues((current) => current.map((issue, i) => i === index ? { ...issue, [field]: value } : issue)); }
  function removeIssue(index: number) { setIssues((current) => current.filter((_, i) => i !== index)); }
  function handlePhotos(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    selected.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => setPhotos((current) => [...current, { name: file.name, dataUrl: String(reader.result || ""), caption: "", location: "" }]);
      reader.readAsDataURL(file);
    });
    event.target.value = "";
  }
  function submit(event: React.FormEvent) {
    event.preventDefault();
    const formattedIssues = issues.filter((issue) => issue.title.trim()).map((issue, index) => ({ id: `ISS-${Date.now()}-${index}`, ...issue, status: "Open" as const }));
    addSiteReport({ project: "City Edge Mall", projectId: "CEM-001", date, engineer: "Omar Mohamed", visitType, weather, summary, photos: photos.map((photo) => ({ ...photo, id: `PHOTO-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, uploadedAt: new Date().toISOString() })), issues: formattedIssues });
    router.push("/app/engineer/site");
  }

  return <main className="min-h-screen bg-[#111] px-6 py-12 text-white md:px-10 md:py-20"><div className="mx-auto max-w-5xl"><Link href="/app/engineer/site" className="text-[9px] uppercase tracking-[.18em] text-white/30">← Site Management</Link><div className="mt-12"><p className="text-[9px] uppercase tracking-[.25em] text-white/20">City Edge Mall / Field Operations</p><h1 className="mt-4 text-5xl font-light tracking-[-.05em]">New Site Visit</h1><p className="mt-4 text-sm text-white/30">Capture the visit, field photos and issues in one report.</p></div>
    <form onSubmit={submit} className="mt-14 space-y-8">
      <section className="rounded-2xl border border-white/10 p-7 md:p-8"><p className="text-[9px] uppercase tracking-[.2em] text-white/20">Visit Details</p><div className="mt-7 grid gap-6 md:grid-cols-3"><Field label="Date"><input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input"/></Field><Field label="Visit Type"><select value={visitType} onChange={(e) => setVisitType(e.target.value)} className="input"><option>Routine Inspection</option><option>Progress Inspection</option><option>Quality Control</option><option>Coordination Visit</option><option>Client Visit</option></select></Field><Field label="Weather"><select value={weather} onChange={(e) => setWeather(e.target.value)} className="input"><option>Clear</option><option>Cloudy</option><option>Hot</option><option>Dusty</option><option>Rain</option></select></Field></div><div className="mt-6"><Field label="Visit Summary"><textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={5} className="input h-auto resize-none py-4" placeholder="Overall site condition, progress and observations..."/></Field></div></section>
      <section className="rounded-2xl border border-white/10 p-7 md:p-8"><div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[.2em] text-white/20">Site Photos</p><h2 className="mt-3 text-2xl font-light">Field Evidence</h2></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-[9px] uppercase tracking-[.15em] text-white/40"><Camera size={14}/> Add Photos<input type="file" accept="image/*" multiple onChange={handlePhotos} className="hidden"/></label></div>{photos.length === 0 ? <div className="mt-7 rounded-xl border border-dashed border-white/10 px-6 py-14 text-center text-xs text-white/20">Upload site photos to keep visual evidence with the report.</div> : <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{photos.map((photo, index) => <div key={`${photo.name}-${index}`} className="overflow-hidden rounded-xl border border-white/10"><img src={photo.dataUrl} alt={photo.name} className="h-44 w-full object-cover"/><div className="p-4"><p className="truncate text-xs text-white/60">{photo.name}</p><input value={photo.caption || ""} onChange={(e) => setPhotos((current) => current.map((p, i) => i === index ? { ...p, caption: e.target.value } : p))} placeholder="Caption" className="mt-3 w-full border-b border-white/10 bg-transparent py-2 text-xs text-white/50 outline-none"/><input value={photo.location || ""} onChange={(e) => setPhotos((current) => current.map((p, i) => i === index ? { ...p, location: e.target.value } : p))} placeholder="Location" className="mt-2 w-full border-b border-white/10 bg-transparent py-2 text-xs text-white/50 outline-none"/><button type="button" onClick={() => setPhotos((current) => current.filter((_, i) => i !== index))} className="mt-4 inline-flex items-center gap-2 text-[8px] uppercase tracking-[.12em] text-white/25"><Trash2 size={12}/> Remove</button></div></div>)}</div>}</section>
      <section className="rounded-2xl border border-white/10 p-7 md:p-8"><div className="flex items-center justify-between"><div><p className="text-[9px] uppercase tracking-[.2em] text-white/20">Site Issues</p><h2 className="mt-3 text-2xl font-light">Observations & Issues</h2></div><button type="button" onClick={addIssue} className="rounded-full border border-white/10 px-5 py-3 text-[9px] uppercase tracking-[.15em] text-white/35">+ Add Issue</button></div><div className="mt-7 space-y-5">{issues.map((issue, index) => <div key={index} className="rounded-xl border border-white/10 p-6"><div className="flex justify-between"><p className="text-[9px] uppercase tracking-[.15em] text-white/20">Issue {String(index + 1).padStart(2, "0")}</p><button type="button" onClick={() => removeIssue(index)} className="text-[9px] uppercase tracking-[.12em] text-white/20">Remove</button></div><div className="mt-5 grid gap-5 md:grid-cols-2"><Field label="Title"><input value={issue.title} onChange={(e) => updateIssue(index, "title", e.target.value)} className="input" placeholder="e.g. Reinforcement issue"/></Field><Field label="Location"><input value={issue.location} onChange={(e) => updateIssue(index, "location", e.target.value)} className="input" placeholder="e.g. Ground Floor"/></Field><Field label="Priority"><select value={issue.priority} onChange={(e) => updateIssue(index, "priority", e.target.value)} className="input"><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></Field><Field label="Assigned To"><select value={issue.assignedTo} onChange={(e) => updateIssue(index, "assignedTo", e.target.value)} className="input"><option>Omar Mohamed</option><option>Ahmed Shabaan</option></select></Field><div className="md:col-span-2"><Field label="Description"><textarea value={issue.description} onChange={(e) => updateIssue(index, "description", e.target.value)} rows={4} className="input h-auto resize-none py-4"/></Field></div></div></div>)}{issues.length === 0 && <div className="rounded-xl border border-dashed border-white/10 px-6 py-12 text-center text-xs text-white/20">No issues added. You can submit a clean visit report.</div>}</div></section>
      <div className="flex justify-end gap-3"><Link href="/app/engineer/site" className="rounded-full border border-white/10 px-6 py-3 text-[9px] uppercase tracking-[.15em] text-white/35">Cancel</Link><button type="submit" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[9px] uppercase tracking-[.15em] text-black"><Upload size={13}/> Save Site Report</button></div>
    </form></div></main>;
}
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-[9px] uppercase tracking-[.15em] text-white/20">{label}</span>{children}</label>; }
