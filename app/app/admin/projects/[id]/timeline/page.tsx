 "use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileText,
  UserRound,
} from "lucide-react";
import { resolveProject } from "@/lib/core/projectRelation";
import {
  getProjectActivities,
  getProjectActivitiesByName,
} from "@/lib/core/activityStore";

export default function ProjectTimelinePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState("");
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let mounted = true;
    params.then((value) => {
      if (mounted) setId(value.id);
    });
    const timer = setInterval(() => setRefresh((v) => v + 1), 2000);
    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [params]);

  const project = useMemo(
    () => (id ? resolveProject(id) : null),
    [id, refresh]
  );

  const activities = useMemo(() => {
    if (!project) return [];
    const byId = getProjectActivities(project.id);
    return byId.length > 0
      ? byId
      : getProjectActivitiesByName(project.name);
  }, [project, refresh]);

  if (!project) {
    return (
      <main className="min-h-screen bg-[#090909] p-8 text-white">
        <Link
          href="/app/admin/projects"
          className="text-sm text-white/50 hover:text-white"
        >
          ← Back to Projects
        </Link>
        <div className="mt-20 text-center">
          <h1 className="text-2xl font-semibold">Project not found</h1>
          <p className="mt-2 text-white/45">
            The requested project could not be resolved.
          </p>
        </div>
      </main>
    );
  }

  const sorted = [...activities].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() -
      new Date(a.createdAt).getTime()
  );

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/app/admin/projects/${project.id}`}
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Project
        </Link>

        <header className="mt-8 flex flex-col justify-between gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end">
          <div>
            <div className="mb-2 text-xs uppercase tracking-[0.25em] text-white/35">
              {project.code} · Project Timeline
            </div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {project.name}
            </h1>
            <p className="mt-2 text-sm text-white/45">
              {project.phase} · {project.status}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/app/admin/projects/${project.id}/passport`}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
            >
              Passport
            </Link>
            <Link
              href={`/app/admin/projects/${project.id}/edit`}
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black hover:bg-white/90"
            >
              Edit Project
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <InfoCard
            icon={CalendarDays}
            value={project.startDate
              ? new Date(project.startDate).toLocaleDateString()
              : "—"}
            label="Project Start"
          />
          <InfoCard
            icon={Clock3}
            value={project.phase}
            label="Current Phase"
          />
          <InfoCard
            icon={CheckCircle2}
            value={String(sorted.length)}
            label="Recorded Events"
          />
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/[0.02] p-5 sm:p-7">
          <div className="mb-8">
            <h2 className="text-lg font-semibold">Project Activity</h2>
            <p className="mt-1 text-sm text-white/40">
              Tasks, files, approvals, finance, site activity and project events.
            </p>
          </div>

          {sorted.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
              <FileText className="mx-auto text-white/20" size={30} />
              <p className="mt-4 text-sm text-white/45">
                No project activity recorded yet.
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute bottom-0 left-[15px] top-0 w-px bg-white/10" />
              <div className="space-y-7">
                {sorted.map((item) => (
                  <article key={item.id} className="relative pl-10">
                    <div className="absolute left-[9px] top-2 h-3 w-3 rounded-full border-2 border-[#090909] bg-white/70" />
                    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                        <div>
                          <div className="text-xs uppercase tracking-[0.18em] text-white/30">
                            {item.type}
                          </div>
                          <h3 className="mt-1 font-medium">{item.title}</h3>
                        </div>
                        <div className="shrink-0 text-xs text-white/35">
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-white/55">
                        {item.description}
                      </p>

                      {item.userName && (
                        <div className="mt-4 flex items-center gap-2 text-xs text-white/35">
                          <UserRound size={14} />
                          {item.userName}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof CalendarDays;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <Icon size={18} className="text-white/45" />
      <div className="mt-4 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-white/35">{label}</div>
    </div>
  );
}
