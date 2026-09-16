"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import {
  getTeamMemberById,
  TeamMember,
} from "@/lib/core/teamStore";

import {
  getProjectsByManager,
  Project,
} from "@/lib/core/projectStore";

import {
  getTasks,
  Task,
} from "../../tasks/taskStore";

type LocalIntelligence = {
  workload: number;
  status: "Balanced" | "Busy" | "Overloaded" | "Available";
};

export default function TeamMemberProfile() {
  const params = useParams<{ id: string }>();
  const memberId = params.id;

  const [member, setMember] = useState<TeamMember | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [intelligence, setIntelligence] =
    useState<LocalIntelligence | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const person = await getTeamMemberById(memberId);

        if (cancelled) return;

        if (!person) {
          setMember(null);
          setTasks([]);
          setProjects([]);
          setIntelligence(null);
          return;
        }

        const currentTasks = getTasks();

        const memberTasks = currentTasks.filter(
          (task) => task.assigneeId === person.id
        );

        const memberProjects =
          getProjectsByManager(person.id);

        const activeTasks = memberTasks.filter(
          (task) =>
            task.status === "Open" ||
            task.status === "In Progress" ||
            task.status === "Overdue"
        );

        const highPriorityTasks = activeTasks.filter(
          (task) =>
            task.priority === "High" ||
            task.priority === "Urgent"
        );

        const overdueTasks = memberTasks.filter(
          (task) => task.status === "Overdue"
        );

        const workload = Math.min(
          100,
          activeTasks.length * 20 +
            highPriorityTasks.length * 10 +
            overdueTasks.length * 15
        );

        let status: LocalIntelligence["status"] =
          "Available";

        if (workload >= 80) {
          status = "Overloaded";
        } else if (workload >= 55) {
          status = "Busy";
        } else if (workload >= 25) {
          status = "Balanced";
        }

        setMember(person);
        setTasks(memberTasks);
        setProjects(memberProjects);
        setIntelligence({
          workload,
          status,
        });
      } catch (error) {
        console.error(
          "Failed to load team member:",
          error
        );

        if (!cancelled) {
          setMember(null);
          setTasks([]);
          setProjects([]);
          setIntelligence(null);
        }
      }
    }

    load();

    const interval = setInterval(load, 2000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [memberId]);

  if (!member) {
    return (
      <main className="min-h-screen bg-[#080808] p-8 text-white">
        <Link
          href="/app/admin/team"
          className="text-sm text-white/50 hover:text-white"
        >
          ← Back to Team
        </Link>

        <div className="mt-20 text-center">
          <h1 className="text-3xl font-semibold">
            Team Member Not Found
          </h1>
        </div>
      </main>
    );
  }

  const activeTasks = tasks.filter(
    (task) => task.status !== "Completed"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  );

  const overdueTasks = tasks.filter(
    (task) => task.status === "Overdue"
  );

  const highPriorityTasks = tasks.filter(
    (task) =>
      task.priority === "High" ||
      task.priority === "Urgent"
  );

  const workload = intelligence?.workload ?? 0;

  const workloadStatus =
    intelligence?.status ?? "Available";

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href="/app/admin/team"
              className="text-sm text-white/40 transition hover:text-white"
            >
              ← Team Intelligence
            </Link>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-xl font-bold text-black">
                {member.initials}
              </div>

              <div>
                <h1 className="text-3xl font-semibold tracking-tight">
                  {member.name}
                </h1>

                <p className="mt-1 text-sm text-white/50">
                  {member.role}
                  {member.department
                    ? ` · ${member.department}`
                    : ""}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/app/admin/tasks/new"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition hover:bg-white/10"
            >
              + Assign Task
            </Link>

            <Link
              href={`/app/admin/team/${member.id}/edit`}
              className="rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Edit Member
            </Link>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              member.status === "Active"
                ? "bg-emerald-400/10 text-emerald-300"
                : "bg-white/10 text-white/50"
            }`}
          >
            {member.status}
          </span>

          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">
            {member.code}
          </span>

          <span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/50">
            {workloadStatus}
          </span>
        </div>

        {/* KPI Grid */}
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <KpiCard
            label="Workload"
            value={`${workload}%`}
            subtitle={workloadStatus}
          />

          <KpiCard
            label="Active Tasks"
            value={activeTasks.length}
            subtitle="Currently assigned"
          />

          <KpiCard
            label="Completed"
            value={completedTasks.length}
            subtitle="Finished tasks"
          />

          <KpiCard
            label="High Priority"
            value={highPriorityTasks.length}
            subtitle="High / Urgent"
          />

          <KpiCard
            label="Overdue"
            value={overdueTasks.length}
            subtitle="Needs attention"
          />
        </section>

        {/* Main */}
        <div className="mt-8 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          {/* Tasks */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
              <div>
                <h2 className="font-semibold">
                  Assigned Tasks
                </h2>

                <p className="mt-1 text-xs text-white/40">
                  Current workload and task history
                </p>
              </div>

              <Link
                href="/app/admin/tasks"
                className="text-xs text-white/50 hover:text-white"
              >
                View all →
              </Link>
            </div>

            <div className="divide-y divide-white/10">
              {tasks.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-white/40">
                  No tasks assigned.
                </div>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="px-6 py-5 transition hover:bg-white/[0.02]"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-medium">
                            {task.title}
                          </h3>

                          <StatusBadge status={task.status} />

                          <PriorityBadge
                            priority={task.priority}
                          />
                        </div>

                        <p className="mt-2 text-sm text-white/40">
                          {task.project}
                        </p>

                        {task.description && (
                          <p className="mt-2 max-w-2xl text-sm text-white/50">
                            {task.description}
                          </p>
                        )}
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-xs text-white/30">
                          Deadline
                        </p>

                        <p className="mt-1 text-sm text-white/70">
                          {task.deadline}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Intelligence */}
          <section className="space-y-6">
            {/* Employee Overview */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="font-semibold">
                Employee Intelligence
              </h2>

              <div className="mt-6 space-y-5">
                <Metric
                  label="Total Tasks"
                  value={tasks.length}
                />

                <Metric
                  label="Active Tasks"
                  value={activeTasks.length}
                />

                <Metric
                  label="Completed Tasks"
                  value={completedTasks.length}
                />

                <Metric
                  label="High Priority"
                  value={highPriorityTasks.length}
                />

                <Metric
                  label="Overdue"
                  value={overdueTasks.length}
                  danger={overdueTasks.length > 0}
                />
              </div>
            </div>

            {/* Current Assignment */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="font-semibold">
                Current Assignment
              </h2>

              <div className="mt-5 rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-wider text-white/30">
                  Project
                </p>

                <p className="mt-2 text-lg font-medium">
                  {member.project ||
                    "No project assigned"}
                </p>

                <p className="mt-1 text-sm text-white/40">
                  {member.projectRole ||
                    "No project role specified"}
                </p>
              </div>
            </div>

            {/* Managed Projects */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <h2 className="font-semibold">
                Project Involvement
              </h2>

              <div className="mt-5 space-y-3">
                {projects.length === 0 ? (
                  <p className="text-sm text-white/40">
                    No projects managed by this member.
                  </p>
                ) : (
                  projects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/app/admin/projects/${project.id}`}
                      className="block rounded-xl border border-white/10 p-4 transition hover:bg-white/5"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {project.name}
                          </p>

                          <p className="mt-1 text-xs text-white/40">
                            {project.phase}
                          </p>
                        </div>

                        <span className="text-white/30">
                          →
                        </span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function KpiCard({
  label,
  value,
  subtitle,
}: {
  label: string;
  value: string | number;
  subtitle: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-wider text-white/35">
        {label}
      </p>

      <p className="mt-3 text-3xl font-semibold">
        {value}
      </p>

      <p className="mt-1 text-xs text-white/35">
        {subtitle}
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
  danger = false,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/50">
        {label}
      </span>

      <span
        className={`text-sm font-semibold ${
          danger ? "text-red-300" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: Task["status"];
}) {
  const styles: Record<Task["status"], string> = {
    Open: "bg-blue-400/10 text-blue-300",
    "In Progress": "bg-amber-400/10 text-amber-300",
    Completed: "bg-emerald-400/10 text-emerald-300",
    Overdue: "bg-red-400/10 text-red-300",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: Task["priority"];
}) {
  const styles: Record<Task["priority"], string> = {
    Low: "bg-white/5 text-white/40",
    Medium: "bg-white/10 text-white/50",
    High: "bg-orange-400/10 text-orange-300",
    Urgent: "bg-red-400/10 text-red-300",
  };

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-[10px] font-medium ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}