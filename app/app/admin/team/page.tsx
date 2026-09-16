"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Users,
  AlertTriangle,
  Gauge,
  UserRoundCheck,
} from "lucide-react";

import { getTasks, Task } from "../tasks/taskStore";
import {
  calculateTeamIntelligence,
  getTeamAlerts,
  TeamIntelligence,
  getSmartAssignee,
} from "./teamIntelligence";

export default function TeamPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<TeamIntelligence[]>([]);
  const [alerts, setAlerts] = useState<
    Awaited<ReturnType<typeof getTeamAlerts>>
  >([]);
  const [recommended, setRecommended] =
    useState<TeamIntelligence | null>(null);

  async function refresh() {
    const currentTasks = getTasks();

    try {
      const currentTeam = await calculateTeamIntelligence(
        currentTasks
      );

      const currentAlerts = await getTeamAlerts(currentTeam);

      const currentRecommended = await getSmartAssignee(
        currentTasks,
        currentTeam.map((item) => item.member)
      );

      setTasks(currentTasks);
      setTeam(currentTeam);
      setAlerts(currentAlerts);
      setRecommended(currentRecommended);
    } catch (error) {
      console.error("Failed to refresh team intelligence:", error);

      setTasks(currentTasks);
      setTeam([]);
      setAlerts([]);
      setRecommended(null);
    }
  }

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (cancelled) return;
      await refresh();
    }

    load();

    const interval = window.setInterval(() => {
      if (!cancelled) {
        load();
      }
    }, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const stats = useMemo(() => {
    const totalMembers = team.length;

    const activeTasks = team.reduce(
      (sum, member) => sum + member.activeTasks,
      0
    );

    const completedTasks = team.reduce(
      (sum, member) => sum + member.completedTasks,
      0
    );

    const overdueTasks = team.reduce(
      (sum, member) => sum + member.overdueTasks,
      0
    );

    const overloaded = team.filter(
      (member) => member.status === "Overloaded"
    ).length;

    const busy = team.filter(
      (member) => member.status === "Busy"
    ).length;

    const available = team.filter(
      (member) => member.status === "Available"
    ).length;

    const averageWorkload =
      totalMembers > 0
        ? Math.round(
            team.reduce(
              (sum, member) => sum + member.workload,
              0
            ) / totalMembers
          )
        : 0;

    return {
      totalMembers,
      activeTasks,
      completedTasks,
      overdueTasks,
      overloaded,
      busy,
      available,
      averageWorkload,
    };
  }, [team]);

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-7 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="border-b border-white/10 pb-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                  <Users
                    size={20}
                    className="text-white/60"
                  />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.28em] text-white/25">
                    Mason & Arc OS
                  </p>

                  <h1 className="mt-1 text-3xl font-light tracking-[-0.04em] sm:text-4xl">
                    Team Intelligence
                  </h1>
                </div>
              </div>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-white/35">
                Live workload, capacity, performance and smart
                allocation for the studio team.
              </p>
            </div>

            <Link
              href="/app/admin/tasks/new"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-black transition hover:bg-white/85"
            >
              Assign New Task
              <ArrowRight size={14} />
            </Link>
          </div>
        </header>

        <section className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <KPI
            label="Team Members"
            value={stats.totalMembers}
            icon={<Users size={16} />}
          />

          <KPI
            label="Active Tasks"
            value={stats.activeTasks}
            icon={<Activity size={16} />}
          />

          <KPI
            label="Completed"
            value={stats.completedTasks}
            icon={<CheckCircle2 size={16} />}
          />

          <KPI
            label="Average Workload"
            value={`${stats.averageWorkload}%`}
            icon={<BriefcaseBusiness size={16} />}
          />
        </section>

        <section className="mt-3 grid gap-3 sm:grid-cols-3">
          <StatusCard
            label="Available"
            value={stats.available}
            description="Members with available capacity"
          />

          <StatusCard
            label="Busy"
            value={stats.busy}
            description="Members carrying active workload"
          />

          <StatusCard
            label="Overloaded"
            value={stats.overloaded}
            description="Requires workload attention"
            danger={stats.overloaded > 0}
          />
        </section>

        {alerts.length > 0 && (
          <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/20">
                  Signals
                </p>

                <h2 className="mt-1 text-lg font-medium">
                  Workload Alerts
                </h2>
              </div>

              <span className="text-[9px] text-white/20">
                {alerts.length} active
              </span>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {alerts.map((alert, index) => (
                <div
                  key={`${alert.memberId}-${alert.title}-${index}`}
                  className="rounded-xl border border-white/10 bg-black/20 p-4"
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={15}
                      className={
                        alert.severity === "Critical"
                          ? "text-red-300"
                          : alert.severity === "Warning"
                          ? "text-amber-300"
                          : "text-white/35"
                      }
                    />

                    <div>
                      <p className="text-xs text-white/70">
                        {alert.title}
                      </p>

                      <p className="mt-1 text-[10px] leading-5 text-white/30">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {recommended && (
          <section className="mt-5 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                  <UserRoundCheck
                    size={16}
                    className="text-white/50"
                  />
                </div>

                <div>
                  <p className="text-[9px] uppercase tracking-[0.22em] text-white/20">
                    Smart Assignment
                  </p>

                  <h2 className="mt-1 text-base font-medium">
                    Best available capacity
                  </h2>

                  <p className="mt-1 text-xs text-white/30">
                    {recommended.member.name} ·{" "}
                    {recommended.capacity}% capacity available ·{" "}
                    {recommended.completionRate}% completion rate
                  </p>
                </div>
              </div>

              <Link
                href="/app/admin/tasks/new"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-[9px] uppercase tracking-[0.14em] text-white/40 hover:border-white/25 hover:text-white"
              >
                Create Task
                <ArrowRight size={13} />
              </Link>
            </div>
          </section>
        )}

        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/20">
                Live Team
              </p>

              <h2 className="mt-1 text-lg font-medium">
                Capacity & Performance
              </h2>
            </div>

            <span className="text-[9px] text-white/20">
              Updates automatically
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {team.map((member) => (
              <TeamCard
                key={member.member.id}
                member={member}
              />
            ))}

            {team.length === 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/30">
                No active team data.
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[9px] uppercase tracking-[0.22em] text-white/20">
                Operations
              </p>

              <h2 className="mt-1 text-lg font-medium">
                Task Distribution
              </h2>
            </div>

            <Link
              href="/app/admin/tasks"
              className="inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-white/35 hover:text-white"
            >
              View All Tasks
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <MiniMetric
              label="Open / In Progress"
              value={
                tasks.filter(
                  (task) =>
                    task.status === "Open" ||
                    task.status === "In Progress"
                ).length
              }
            />

            <MiniMetric
              label="Completed"
              value={
                tasks.filter(
                  (task) => task.status === "Completed"
                ).length
              }
            />

            <MiniMetric
              label="Overdue"
              value={
                tasks.filter(
                  (task) => task.status === "Overdue"
                ).length
              }
            />
          </div>
        </section>
      </div>
    </main>
  );
}

function TeamCard({
  member,
}: {
  member: TeamIntelligence;
}) {
  const person = member.member;

  return (
    <Link
      href={`/app/admin/team/${person.id}`}
      className="block rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition hover:border-white/20 hover:bg-white/[0.04]"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-sm font-medium text-black">
          {person.initials ||
            person.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .slice(0, 2)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-medium">
              {person.name}
            </h3>

            <StatusBadge status={member.status} />
          </div>

          <p className="mt-1 text-[10px] text-white/30">
            {person.role} · {person.department}
          </p>

          {person.project && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/8 bg-black/20 px-3 py-2">
              <BriefcaseBusiness
                size={12}
                className="text-white/25"
              />

              <span className="text-[9px] text-white/40">
                {person.project}
              </span>
            </div>
          )}
        </div>

        <div className="text-right">
          <p className="text-2xl font-light">
            {member.workload}%
          </p>

          <p className="text-[8px] uppercase tracking-wider text-white/20">
            Workload
          </p>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[8px] uppercase tracking-[0.16em] text-white/20">
            Capacity
          </span>

          <span className="text-[9px] text-white/35">
            {member.capacity}% free
          </span>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-white transition-all"
            style={{
              width: `${Math.min(
                100,
                member.workload
              )}%`,
            }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <Metric label="Total" value={member.totalTasks} />
        <Metric label="Active" value={member.activeTasks} />
        <Metric label="Done" value={member.completedTasks} />
        <Metric label="Overdue" value={member.overdueTasks} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Metric
          label="Completion"
          value={`${member.completionRate}%`}
        />

        <Metric
          label="Projects"
          value={member.projectCount}
        />
      </div>

      {member.projects.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {member.projects.map((project) => (
            <span
              key={project}
              className="rounded-full border border-white/8 px-3 py-1.5 text-[8px] uppercase tracking-[0.12em] text-white/25"
            >
              {project}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

function KPI({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[0.16em] text-white/20">
          {label}
        </span>

        <span className="text-white/25">
          {icon}
        </span>
      </div>

      <p className="mt-4 text-2xl font-light">
        {value}
      </p>
    </div>
  );
}

function StatusCard({
  label,
  value,
  description,
  danger = false,
}: {
  label: string;
  value: string | number;
  description: string;
  danger?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        danger
          ? "border-red-300/10 bg-red-300/[0.03]"
          : "border-white/10 bg-white/[0.02]"
      }`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[9px] uppercase tracking-[0.16em] text-white/20">
          {label}
        </span>

        <Gauge
          size={14}
          className="text-white/20"
        />
      </div>

      <p className="mt-3 text-xl font-light">
        {value}
      </p>

      <p className="mt-1 text-[9px] text-white/20">
        {description}
      </p>
    </div>
  );
}

function MiniMetric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-4">
      <p className="text-[8px] uppercase tracking-[0.15em] text-white/20">
        {label}
      </p>

      <p className="mt-2 text-lg font-light text-white/70">
        {value}
      </p>
    </div>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-3">
      <p className="text-[8px] uppercase tracking-[0.12em] text-white/20">
        {label}
      </p>

      <p className="mt-1 text-sm text-white/60">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: TeamIntelligence["status"];
}) {
  const label =
    status === "Overloaded"
      ? "Overloaded"
      : status === "Busy"
      ? "Busy"
      : status === "Balanced"
      ? "Balanced"
      : "Available";

  return (
    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[8px] uppercase tracking-[0.12em] text-white/35">
      {label}
    </span>
  );
}