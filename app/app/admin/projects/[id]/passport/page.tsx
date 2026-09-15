 "use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FileText,
  Gauge,
  MapPin,
  Users,
} from "lucide-react";
import { resolveProject, matchesProject } from "@/lib/core/projectRelation";
import { getTasks } from "@/app/app/admin/tasks/taskStore";
import { getSiteReports } from "@/app/app/engineer/site/siteStore";
import { getFiles } from "@/app/app/admin/files/fileStore";
import { getApprovals } from "@/app/app/admin/approvals/approvalStore";
import {
  getProjectActivities,
  getProjectActivitiesByName,
} from "@/lib/core/activityStore";
import { calculateProjectHealth } from "@/app/app/admin/projects/city-edge-mall/projectHealth";

export default function ProjectPassportPage({
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

  const data = useMemo(() => {
    if (!project) return null;

    const tasks = getTasks().filter((x) => matchesProject(x, project.id));
    const reports = getSiteReports().filter(
      (x) => x.project === project.name || x.project === project.id
    );
    const files = getFiles().filter(
      (x) => x.project === project.name || x.project === project.id
    );
    const approvals = getApprovals().filter(
      (x) => x.project === project.name || x.project === project.id
    );

    const byId = getProjectActivities(project.id);
    const activities =
      byId.length > 0
        ? byId
        : getProjectActivitiesByName(project.name);

    const issues = reports.flatMap((report) => report.issues || []);

    return {
      tasks,
      reports,
      files,
      approvals,
      activities,
      health: calculateProjectHealth(tasks, issues),
    };
  }, [project, refresh]);

  if (!project || !data) {
    return (
      <main className="min-h-screen bg-[#090909] p-8 text-white">
        <Link href="/app/admin/projects" className="text-sm text-white/50 hover:text-white">
          ← Back to Projects
        </Link>
        <div className="mt-20 text-center">
          <h1 className="text-2xl font-semibold">Project not found</h1>
        </div>
      </main>
    );
  }

  const completedTasks = data.tasks.filter((x) => x.status === "Completed").length;
  const openIssues = data.reports
    .flatMap((x) => x.issues || [])
    .filter((x) => x.status !== "Resolved").length;
  const pendingApprovals = data.approvals.filter(
    (x) => x.status === "Pending"
  ).length;

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href={`/app/admin/projects/${project.id}`}
          className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Project
        </Link>

        <header className="mt-8 flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-white/35">
              {project.code}
            </div>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              {project.name}
            </h1>
            <p className="mt-2 text-sm text-white/45">
              Project Passport · {project.type} · {project.phase}
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href={`/app/admin/projects/${project.id}/timeline`}
              className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 hover:bg-white/5"
            >
              Timeline
            </Link>
            <Link
              href={`/app/admin/projects/${project.id}/edit`}
              className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black"
            >
              Edit Project
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-4">
          <Stat label="Health" value={`${data.health.score}`} icon={Gauge} />
          <Stat
            label="Tasks"
            value={`${completedTasks}/${data.tasks.length}`}
            icon={ClipboardList}
          />
          <Stat label="Open Issues" value={`${openIssues}`} icon={MapPin} />
          <Stat
            label="Pending Approvals"
            value={`${pendingApprovals}`}
            icon={CheckCircle2}
          />
        </section>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 lg:col-span-2">
            <div className="flex items-center gap-3">
              <BriefcaseBusiness size={20} className="text-white/50" />
              <h2 className="text-lg font-semibold">Project Identity</h2>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <Info label="Project Code" value={project.code} />
              <Info label="Status" value={project.status} />
              <Info label="Phase" value={project.phase} />
              <Info label="Location" value={project.location || "—"} />
              <Info label="Client" value={project.clientName || "Not linked"} />
              <Info
                label="Project Manager"
                value={project.projectManagerName || "Not assigned"}
              />
              <Info label="Start Date" value={project.startDate || "—"} />
              <Info label="Target Date" value={project.targetDate || "—"} />
            </div>

            <p className="mt-7 border-t border-white/10 pt-6 text-sm leading-7 text-white/50">
              {project.description || "No project description has been added yet."}
            </p>
          </section>

          <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-center gap-3">
              <Users size={20} className="text-white/50" />
              <h2 className="text-lg font-semibold">Project Intelligence</h2>
            </div>

            <div className="mt-6 space-y-4">
              <Metric
                label="Health"
                value={`${data.health.score}/100 · ${data.health.label}`}
              />
              <Metric
                label="Active Tasks"
                value={`${data.tasks.filter((x) => x.status !== "Completed").length}`}
              />
              <Metric label="Site Reports" value={`${data.reports.length}`} />
              <Metric label="Files" value={`${data.files.length}`} />
              <Metric
                label="Activity Events"
                value={`${data.activities.length}`}
              />
            </div>
          </section>
        </div>

        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center gap-3">
            <FileText size={20} className="text-white/50" />
            <h2 className="text-lg font-semibold">Workstreams</h2>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Workstream label="Tasks" value={data.tasks.length} href={`/app/admin/tasks?project=${project.id}`} />
            <Workstream label="Files" value={data.files.length} href={`/app/admin/files?project=${project.id}`} />
            <Workstream label="Approvals" value={data.approvals.length} href={`/app/admin/approvals?project=${project.id}`} />
            <Workstream label="Site Reports" value={data.reports.length} href={`/app/engineer/site?project=${project.id}`} />
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <Icon size={18} className="text-white/40" />
      <div className="mt-4 text-3xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-white/35">{label}</div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-[0.16em] text-white/30">{label}</div>
      <div className="mt-2 text-sm text-white/75">{value}</div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/10 p-4">
      <div className="text-xs text-white/35">{label}</div>
      <div className="mt-2 text-sm font-medium text-white/75">{value}</div>
    </div>
  );
}

function Workstream({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-white/10 p-4 transition hover:bg-white/5"
    >
      <div className="text-sm text-white/50">{label}</div>
      <div className="mt-2 text-xl font-semibold">{value}</div>
    </Link>
  );
}
