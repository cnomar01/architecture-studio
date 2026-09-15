"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  FileText,
  FolderOpen,
  MessageSquare,
} from "lucide-react";
import {
  getProjectById,
  type Project,
} from "@/lib/core/projectStore";
import { getProjectFiles } from "@/app/app/admin/files/fileStore";
import { getApprovals } from "@/app/app/admin/approvals/approvalStore";

export default function ClientProjectPage() {
  const [project, setProject] = useState<Project>();
  const [filesCount, setFilesCount] = useState(0);
  const [approvalsCount, setApprovalsCount] = useState(0);

  useEffect(() => {
    const id = window.location.pathname.split("/").filter(Boolean).at(-1);
    if (!id) return;

    const current = getProjectById(id);
    setProject(current ?? undefined);

    if (current) {
      setFilesCount(getProjectFiles(current.id).length);
      setApprovalsCount(
        getApprovals().filter(
          (approval) =>
            approval.projectId === current.id ||
            approval.project === current.name
        ).length
      );
    }
  }, []);

  if (!project) {
    return (
      <main className="min-h-screen bg-[#080808] p-8 text-white">
        <Link href="/app" className="text-sm text-white/50 underline">
          Back to portal
        </Link>
        <p className="mt-10">Project not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="mx-auto max-w-6xl px-5 py-8 md:px-8">
        <Link
          href="/app"
          className="inline-flex items-center gap-2 text-sm text-white/45"
        >
          <ArrowLeft size={16} />
          Client Portal
        </Link>

        <section className="pt-16">
          <p className="text-xs uppercase tracking-[0.25em] text-white/35">
            {project.code}
          </p>
          <div className="mt-3 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-4xl font-light md:text-6xl">
                {project.name}
              </h1>
              <p className="mt-4 text-sm text-white/45">
                {project.location} · {project.type}
              </p>
            </div>

            <div className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/55">
              {project.phase}
            </div>
          </div>
        </section>

        <section className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Status", project.status],
            ["Phase", project.phase],
            ["Files", filesCount],
            ["Approvals", approvalsCount],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <p className="text-xs uppercase tracking-wider text-white/30">
                {label}
              </p>
              <p className="mt-3 text-xl">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <PortalLink
            href={`/app/projects/${project.id}/drawings`}
            icon={<FolderOpen size={19} />}
            title="Drawings & Files"
            text="Review project files and latest revisions."
          />
          <PortalLink
            href={`/app/projects/${project.id}/approvals`}
            icon={<CheckCircle2 size={19} />}
            title="Approvals"
            text="Review and follow approval activity."
          />
          <PortalLink
            href={`/app/projects/${project.id}/messages`}
            icon={<MessageSquare size={19} />}
            title="Messages"
            text="Communicate with Mason & Arc."
          />
        </section>

        <section className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
          <p className="text-xs uppercase tracking-[0.2em] text-white/30">
            Project Description
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-white/50">
            {project.description}
          </p>
        </section>

        <footer className="mt-16 border-t border-white/10 py-8 text-xs text-white/25">
          Mason & Arc · Architecture from concept to reality.
        </footer>
      </div>
    </main>
  );
}

function PortalLink({
  href,
  icon,
  title,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-white/25"
    >
      <div className="flex items-center justify-between">
        <div className="text-white/60">{icon}</div>
        <ArrowUpRight
          size={17}
          className="text-white/25 transition group-hover:text-white"
        />
      </div>
      <h2 className="mt-8 font-medium">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-white/40">{text}</p>
    </Link>
  );
}
