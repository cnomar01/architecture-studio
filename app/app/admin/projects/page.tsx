"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  FolderKanban,
  Plus,
  Search,
} from "lucide-react";

import {
  getProjects,
  Project,
} from "@/lib/core/projectStore";

import { getTasks } from "@/app/app/admin/tasks/taskStore";
import { getSiteReports } from "@/app/app/engineer/site/siteStore";
import { calculateProjectHealth } from "./city-edge-mall/projectHealth";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | Project["status"]
  >("All");

  const [tasks, setTasks] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    setProjects(getProjects());
    setTasks(getTasks());
    setReports(getSiteReports());
  }, []);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !query ||
        project.name.toLowerCase().includes(query) ||
        project.code.toLowerCase().includes(query) ||
        project.location.toLowerCase().includes(query) ||
        project.type.toLowerCase().includes(query) ||
        (project.clientName ?? "").toLowerCase().includes(query) ||
        (project.projectManagerName ?? "")
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: projects.length,

      active: projects.filter(
        (project) => project.status === "Active"
      ).length,

      onHold: projects.filter(
        (project) => project.status === "On Hold"
      ).length,

      completed: projects.filter(
        (project) => project.status === "Completed"
      ).length,
    };
  }, [projects]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      <main className="mx-auto max-w-[1500px] px-5 py-7 md:px-8 lg:px-10">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
              Studio Management
            </p>

            <h1 className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">
              Projects
            </h1>

            <p className="mt-2 max-w-xl text-sm text-white/30">
              Central project registry for Mason & Arc.
            </p>

          </div>

          <Link
            href="/app/admin/projects/new"
            className="flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-medium text-black transition hover:bg-white/90"
          >
            <Plus size={15} />
            New Project
          </Link>

        </div>

        {/* STATS */}

        <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            label="Total Projects"
            value={stats.total}
            icon={<FolderKanban size={16} />}
          />

          <StatCard
            label="Active"
            value={stats.active}
            icon={<CheckCircle2 size={16} />}
          />

          <StatCard
            label="On Hold"
            value={stats.onHold}
            icon={<Clock3 size={16} />}
          />

          <StatCard
            label="Completed"
            value={stats.completed}
            icon={<Building2 size={16} />}
          />

        </section>

        {/* SEARCH / FILTER */}

        <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.025] p-4">

          <div className="flex flex-col gap-3 md:flex-row">

            <div className="relative flex-1">

              <Search
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
              />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search projects, clients, managers..."
                className="w-full rounded-xl border border-white/10 bg-black/20 py-3 pl-11 pr-4 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
              />

            </div>

            <div className="flex flex-wrap gap-2">

              {(
                [
                  "All",
                  "Active",
                  "On Hold",
                  "Completed",
                ] as const
              ).map((status) => (

                <button
                  key={status}
                  type="button"
                  onClick={() =>
                    setStatusFilter(status)
                  }
                  className={`rounded-xl border px-4 py-3 text-xs transition ${
                    statusFilter === status
                      ? "border-white/20 bg-white text-black"
                      : "border-white/10 bg-white/[0.03] text-white/40 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  {status}
                </button>

              ))}

            </div>

          </div>

        </section>

        {/* PROJECT LIST */}

        {filteredProjects.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">

            <FolderKanban
              size={24}
              className="mx-auto text-white/20"
            />

            <h2 className="mt-4 text-sm font-medium">
              No projects found
            </h2>

            <p className="mt-2 text-xs text-white/25">
              Try another search or create a new project.
            </p>

          </div>

        ) : (

          <div className="grid gap-4 lg:grid-cols-2">

            {filteredProjects.map((project) => (

              <ProjectCard
                key={project.id}
                project={project}
                tasks={tasks}
                reports={reports}
              />

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

/* -------------------------------- */
/* PROJECT CARD */
/* -------------------------------- */

function ProjectCard({
  project,
  tasks,
  reports,
}: {
  project: Project;
  tasks: any[];
  reports: any[];
}) {
  const projectTasks = tasks.filter(
    (task) => task.project === project.name
  );

  const projectReports = reports.filter(
    (report) => report.project === project.name
  );

  const issues = projectReports.flatMap(
    (report) => report.issues || []
  );

  const health = calculateProjectHealth(
    projectTasks,
    issues
  );

  const href =
    project.id === "CEM-001"
      ? "/app/admin/projects/city-edge-mall"
      : `/app/admin/projects/${project.id}`;

  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:border-white/20 hover:bg-white/[0.045]"
    >

      {/* TOP */}

      <div className="flex items-start justify-between gap-4">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">

            <Building2
              size={18}
              className="text-white/45"
            />

          </div>

          <div>

            <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
              {project.code}
            </p>

            <h2 className="mt-1 text-lg font-medium">
              {project.name}
            </h2>

          </div>

        </div>

        <ArrowUpRight
          size={16}
          className="text-white/20 transition group-hover:text-white"
        />

      </div>

      {/* PROJECT INFO */}

      <div className="mt-5 grid grid-cols-2 gap-3">

        <Info
          label="Type"
          value={project.type}
        />

        <Info
          label="Location"
          value={project.location}
        />

        <Info
          label="Phase"
          value={project.phase}
        />

        <Info
          label="Manager"
          value={
            project.projectManagerName ||
            "Not assigned"
          }
        />

        <Info
          label="Client"
          value={
            project.clientName ||
            "Not assigned"
          }
        />

        <Info
          label="Target Date"
          value={
            project.targetDate ||
            "Not set"
          }
        />

      </div>

      {/* STATUS / METADATA */}

      <div className="mt-5 flex flex-wrap items-center gap-2">

        <StatusBadge
          status={project.status}
        />

        {project.id === "CEM-001" && (
          <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[9px] uppercase tracking-wider text-white/35">
            Health {health.score}
          </span>
        )}

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[9px] uppercase tracking-wider text-white/35">
          {projectTasks.length} tasks
        </span>

        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[9px] uppercase tracking-wider text-white/35">
          {projectReports.length} site reports
        </span>

        <span
          className={`rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-wider ${
            project.clientId
              ? "border-white/10 bg-white/[0.03] text-white/45"
              : "border-white/10 bg-white/[0.02] text-white/20"
          }`}
        >
          {project.clientId
            ? "Client Linked"
            : "No Client"}
        </span>

      </div>

    </Link>
  );
}

/* -------------------------------- */
/* STAT CARD */
/* -------------------------------- */

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

      <div className="flex items-center gap-2 text-white/30">

        {icon}

        <span className="text-[9px] uppercase tracking-[0.18em]">
          {label}
        </span>

      </div>

      <p className="mt-4 text-3xl font-light">
        {value}
      </p>

    </div>
  );
}

/* -------------------------------- */
/* INFO */
/* -------------------------------- */

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-3">

      <p className="text-[8px] uppercase tracking-wider text-white/20">
        {label}
      </p>

      <p className="mt-1 truncate text-xs text-white/60">
        {value}
      </p>

    </div>
  );
}

/* -------------------------------- */
/* STATUS */
/* -------------------------------- */

function StatusBadge({
  status,
}: {
  status: Project["status"];
}) {
  const className =
    status === "Active"
      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
      : status === "On Hold"
      ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
      : "border-white/10 bg-white/[0.03] text-white/40";

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-wider ${className}`}
    >
      {status}
    </span>
  );
}