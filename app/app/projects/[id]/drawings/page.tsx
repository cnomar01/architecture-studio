"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { listResource } from "@/lib/client/dataApi";

type FileRow = { id: string; name: string; document_number?: string; discipline?: string; revision: string; issue_date?: string; category: string };

export default function DrawingsPage() {
  const [files, setFiles] = useState<FileRow[]>([]);
  const id = typeof window === "undefined" ? "" : window.location.pathname.split("/").filter(Boolean).at(-2) || "";
  useEffect(() => { if (!id) return; void listResource<FileRow>("files", id).then(({ data }) => setFiles(data)).catch(() => setFiles([])); }, [id]);
  return <main className="min-h-screen bg-[#111111] text-white"><header className="flex items-center justify-between px-6 py-6 md:px-10"><Link href={`/app/projects/${id}`} className="text-xs uppercase tracking-[.18em] text-white/50">← Project</Link><Link href="/app"><img src="/images/logo-mason-arc.png" alt="Mason & Arc" className="h-8 w-auto" /></Link><span className="w-10" /></header><section className="px-6 pb-32 pt-16 md:px-10 md:pt-24"><div className="mx-auto max-w-6xl"><p className="text-[10px] uppercase tracking-[.25em] text-white/30">Project Resources</p><h1 className="mt-5 text-5xl font-light tracking-[-.05em] md:text-7xl">Drawings & files</h1><p className="mt-5 max-w-xl text-sm leading-6 text-white/40">Only documents issued by the studio for client viewing appear here.</p><div className="mt-16 overflow-hidden rounded-2xl border border-white/10">{files.length ? files.map((file, index) => <div key={file.id} className="border-b border-white/10 p-6 last:border-0 md:p-8"><div className="grid gap-4 md:grid-cols-[50px_1fr_150px_100px]"><span className="text-xs text-white/25">{String(index + 1).padStart(2, "0")}</span><div><p className="text-[10px] uppercase tracking-[.18em] text-white/30">{file.document_number || file.category} · {file.discipline || "Studio"}</p><h2 className="mt-2 text-lg font-light">{file.name}</h2></div><span className="text-xs text-white/40">{file.issue_date || "—"}</span><span className="text-xs uppercase tracking-[.15em] text-white/40">Rev. {file.revision}</span></div></div>) : <div className="p-8 text-sm text-white/35">No client-facing documents have been issued yet.</div>}</div></div></section></main>;
}
