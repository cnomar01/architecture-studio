"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Bell, CheckCircle2, Clock3, FileText, FolderOpen, MessageSquare } from "lucide-react";
import type { Project } from "@/lib/core/projectStore";
import { listResource } from "@/lib/client/dataApi";
import AuthGuard from "@/lib/core/AuthGuard";

export default function AppHome() {
  return <AuthGuard allowedRoles={["Client"]}><ClientPortal /></AuthGuard>;
}

function ClientPortal() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [metrics, setMetrics] = useState({ files: 0, approvals: 0, messages: 0, tasks: 0 });

  useEffect(() => {
    let active = true;
    void Promise.all([
      listResource<any>("projects"),
      listResource<any>("files"),
      listResource<any>("approvals"),
      listResource<any>("messages"),
    ]).then(([projectsResponse, files, approvals, messages]) => {
        if (!active) return;
        setProjects(projectsResponse.data.map((project) => ({
          id: project.id, code: project.code, name: project.name, type: project.type,
          location: project.location, status: project.status, phase: project.phase,
          description: project.description, clientId: project.client_id, clientName: project.client_name,
          projectManagerId: project.project_manager_id, projectManagerName: project.project_manager_name,
          startDate: project.start_date || "", targetDate: project.target_date || "",
          createdAt: "", updatedAt: "",
        })));
        setMetrics({ files: files.data.length, approvals: approvals.data.filter((item) => item.status === "Pending").length, messages: messages.data.length, tasks: 0 });
      })
      .catch(() => { if (active) setProjects([]); });
    return () => { active = false; };
  }, []);

  const displayProjects = projects.length ? projects : [];

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <header className="border-b border-white/10 px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/app" className="block">
            <img src="/images/logo-mason-arc.png" alt="Mason & Arc" className="h-8 w-auto object-contain" />
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/app/login" className="rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.15em] text-white/45 hover:text-white">Account</Link>
          </div>
        </div>
      </header>

      <section className="px-6 pb-32 pt-16 md:px-10 md:pt-24">
        <div className="mx-auto max-w-7xl">
          <p className="text-[10px] uppercase tracking-[0.28em] text-white/30">Client Portal · Mason & Arc</p>
          <div className="mt-5 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div>
              <h1 className="max-w-4xl text-5xl font-light leading-[0.95] tracking-[-0.055em] md:text-7xl">Your projects,<br />in one place.</h1>
              <p className="mt-7 max-w-2xl text-sm leading-7 text-white/40">Review progress, latest files, approvals and communication without losing the project context.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-xs text-white/45">
              <span className="text-white/20">Portal status</span><br />Connected to studio workspace
            </div>
          </div>

          <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            <Metric icon={<FolderOpen size={16} />} label="Project Files" value={metrics.files} />
            <Metric icon={<CheckCircle2 size={16} />} label="Pending Approvals" value={metrics.approvals} />
            <Metric icon={<MessageSquare size={16} />} label="Messages" value={metrics.messages} />
            <Metric icon={<Clock3 size={16} />} label="Active Tasks" value={metrics.tasks} />
          </div>

          <section className="mt-16">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/25">Workspace</p>
                <h2 className="mt-3 text-3xl font-light">Your Projects</h2>
              </div>
              <Bell size={17} className="text-white/25" />
            </div>

            {displayProjects.length === 0 ? (
              <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-sm text-white/40">No projects are currently linked to this client portal.</div>
            ) : (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {displayProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
              </div>
            )}
          </section>

          <section className="mt-12 grid gap-4 md:grid-cols-3">
            <QuickLink href={displayProjects[0] ? `/app/projects/${displayProjects[0].id}/drawings` : "/app"} icon={<FileText size={18} />} title="Latest Documents" text="Drawings, revisions and project files." />
            <QuickLink href={displayProjects[0] ? `/app/projects/${displayProjects[0].id}/approvals` : "/app"} icon={<CheckCircle2 size={18} />} title="Approvals" text="See decisions waiting for your review." />
            <QuickLink href={displayProjects[0] ? `/app/projects/${displayProjects[0].id}/messages` : "/app"} icon={<MessageSquare size={18} />} title="Messages" text="Keep communication tied to the project." />
          </section>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between text-[9px] uppercase tracking-[0.2em] text-white/20"><span>Mason & Arc</span><span>Architecture from concept to reality.</span></div>
      </footer>
    </main>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return <div className="bg-[#111111] p-5"><div className="flex items-center gap-2 text-white/25">{icon}<span className="text-[9px] uppercase tracking-[0.18em]">{label}</span></div><p className="mt-4 text-2xl font-light">{value}</p></div>;
}

function ProjectCard({ project }: { project: Project }) {
  const files = "View";
  const approvals = "View";
  return <article className="group rounded-3xl border border-white/10 bg-white/[0.035] p-7 transition hover:border-white/25 hover:bg-white/[0.055]">
    <div className="flex items-start justify-between gap-5"><div><p className="text-[9px] uppercase tracking-[0.2em] text-white/25">{project.code} · {project.type}</p><h3 className="mt-3 text-3xl font-light tracking-[-0.035em]">{project.name}</h3><p className="mt-3 text-xs text-white/35">{project.location}</p></div><span className="rounded-full border border-white/10 px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] text-white/40">{project.status}</span></div>
    <div className="mt-12 grid grid-cols-3 gap-3 text-xs"><Stat label="Phase" value={project.phase} /><Stat label="Files" value={files} /><Stat label="Approvals" value={approvals} /></div>
    <Link href={`/app/projects/${project.id}`} className="mt-8 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-white/50 hover:text-white">Open project <ArrowUpRight size={14} /></Link>
  </article>;
}

function Stat({ label, value }: { label: string; value: React.ReactNode }) { return <div className="rounded-xl border border-white/8 bg-black/10 p-3"><p className="text-[8px] uppercase tracking-[0.15em] text-white/20">{label}</p><p className="mt-2 truncate text-white/60">{value}</p></div>; }
function QuickLink({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) { return <Link href={href} className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/25"><div className="text-white/45">{icon}</div><h3 className="mt-7 text-sm font-medium">{title}</h3><p className="mt-2 text-xs leading-6 text-white/35">{text}</p></Link>; }
