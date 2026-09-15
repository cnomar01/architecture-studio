"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTasks, Task } from "../admin/tasks/taskStore";

const engineer = {
  id: "OM-001",
  name: "Omar Mohamed",
  role: "Architect",
  department: "Architecture",
  project: "City Edge Mall",
};

export default function EngineerDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const allTasks = getTasks();

    setTasks(
      allTasks.filter(
        (task) => task.assigneeId === engineer.id
      )
    );
  }, []);

  const activeTasks = tasks.filter(
    (task) =>
      task.status === "Open" ||
      task.status === "In Progress"
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  );

  return (
    <main className="min-h-screen bg-[#111111] text-white">

      {/* HEADER */}
      <header className="border-b border-white/10 px-6 py-5 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <Link href="/app/engineer">
            <img
              src="/images/logo-mason-arc.png"
              alt="Mason & Arc"
              className="h-8 w-auto object-contain"
            />
          </Link>

          <div className="flex items-center gap-5">

            <div className="hidden text-right sm:block">
              <p className="text-xs text-white/60">
                {engineer.name}
              </p>

              <p className="mt-1 text-[9px] uppercase tracking-[0.15em] text-white/20">
                {engineer.role}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[10px] text-white/50">
              OM
            </div>

          </div>

        </div>
      </header>

      {/* CONTENT */}
      <section className="px-6 pb-32 pt-12 md:px-10 md:pt-20">
        <div className="mx-auto max-w-7xl">

          {/* WELCOME */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/20">
              Engineer Workspace
            </p>

            <h1 className="mt-4 text-4xl font-light tracking-[-0.05em] md:text-6xl">
              Welcome, {engineer.name.split(" ")[0]}.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-6 text-white/30">
              Your current work, tasks and project information in one place.
            </p>
          </div>

          {/* PROJECT */}
          <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.02] p-7 md:p-9">

            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">
                  Current Project
                </p>

                <h2 className="mt-4 text-3xl font-light">
                  {engineer.project}
                </h2>

                <p className="mt-2 text-xs text-white/30">
                  {engineer.role} · {engineer.department}
                </p>
              </div>

              {/* FIXED PROJECT LINK */}
              <Link
                href="/app/admin/projects/city-edge-mall"
                className="w-fit rounded-full border border-white/10 px-5 py-3 text-[9px] uppercase tracking-[0.15em] text-white/35 transition hover:border-white/25 hover:text-white"
              >
                View Project
              </Link>

            </div>

            <div className="mt-8 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 md:grid-cols-3">

              <MiniStat
                label="Active Tasks"
                value={activeTasks.length}
              />

              <MiniStat
                label="Completed"
                value={completedTasks.length}
              />

              <MiniStat
                label="Project"
                value="City Edge"
              />

            </div>

          </div>

          {/* WORKSPACE GRID */}
          <div className="mt-10 grid gap-6 lg:grid-cols-3">

            <WorkspaceCard
              href="/app/engineer/tasks"
              number="01"
              title="My Tasks"
              description="View assigned tasks, deadlines and completion status."
              value={`${activeTasks.length} active`}
            />

            <WorkspaceCard
              href="/app/engineer/files"
              number="02"
              title="My Files"
              description="Access drawings, documents and project files."
              value="Project files"
            />

            <WorkspaceCard
              href="/app/engineer/site"
              number="03"
              title="Site Reports"
              description="Create and review site visits, issues and updates."
              value="Site activity"
            />

          </div>

          {/* TASKS */}
          <div className="mt-14">

            <div className="flex items-end justify-between">

              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">
                  Today
                </p>

                <h2 className="mt-3 text-2xl font-light">
                  My Tasks
                </h2>
              </div>

              <Link
                href="/app/engineer/tasks"
                className="text-[9px] uppercase tracking-[0.15em] text-white/25 transition hover:text-white"
              >
                View All →
              </Link>

            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">

              {activeTasks.length === 0 ? (
                <div className="px-7 py-20 text-center">

                  <p className="text-sm text-white/30">
                    No active tasks.
                  </p>

                  <p className="mt-2 text-xs text-white/15">
                    You currently have no open tasks.
                  </p>

                </div>
              ) : (
                activeTasks.map((task, index) => (
                  <div
                    key={task.id}
                    className="border-b border-white/10 p-6 last:border-b-0 md:p-7"
                  >

                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                      <div className="flex gap-5">

                        <span className="pt-1 text-[10px] text-white/15">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div>

                          <h3 className="text-sm text-white/75">
                            {task.title}
                          </h3>

                          <p className="mt-2 text-xs text-white/25">
                            {task.project}
                          </p>

                        </div>

                      </div>

                      <div className="flex flex-wrap items-center gap-5">

                        <span className="text-[9px] uppercase tracking-[0.12em] text-white/30">
                          {task.priority}
                        </span>

                        <span className="text-xs text-white/30">
                          {task.deadline}
                        </span>

                        <span className="rounded-full border border-white/10 px-3 py-1 text-[9px] uppercase tracking-[0.12em] text-white/35">
                          {task.status}
                        </span>

                      </div>

                    </div>

                  </div>
                ))
              )}

            </div>

          </div>

          {/* QUICK ACTIONS */}
          <div className="mt-14">

            <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">
              Quick Access
            </p>

            <div className="mt-6 flex flex-wrap gap-3">

              <QuickLink href="/app/engineer/tasks">
                Tasks
              </QuickLink>

              <QuickLink href="/app/engineer/files">
                Files
              </QuickLink>

              <QuickLink href="/app/engineer/site">
                Site Reports
              </QuickLink>

              {/* FIXED */}
              <QuickLink href="/app/projects/1">
                Client Project
              </QuickLink>

            </div>

          </div>

          {/* FOOTER */}
          <div className="mt-20 border-t border-white/10 pt-7">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-[9px] uppercase tracking-[0.18em] text-white/15">
                Mason & Arc · Engineer Workspace
              </p>

              <Link
                href="/app/login"
                className="text-[9px] uppercase tracking-[0.18em] text-white/20 hover:text-white"
              >
                Sign Out
              </Link>

            </div>

          </div>

        </div>
      </section>
    </main>
  );
}

/* -------------------------------- */
/* MINI STAT */
/* -------------------------------- */

function MiniStat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="bg-[#111111] p-5">
      <p className="text-[9px] uppercase tracking-[0.15em] text-white/20">
        {label}
      </p>

      <p className="mt-3 text-xl font-light text-white/70">
        {value}
      </p>
    </div>
  );
}

/* -------------------------------- */
/* WORKSPACE CARD */
/* -------------------------------- */

function WorkspaceCard({
  href,
  number,
  title,
  description,
  value,
}: {
  href: string;
  number: string;
  title: string;
  description: string;
  value: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 p-7 transition hover:bg-white/[0.035]"
    >
      <div className="flex items-start justify-between">

        <span className="text-[9px] text-white/15">
          {number}
        </span>

        <span className="text-white/20 transition group-hover:translate-x-1 group-hover:text-white">
          →
        </span>

      </div>

      <h3 className="mt-12 text-xl font-light text-white/75">
        {title}
      </h3>

      <p className="mt-3 text-xs leading-5 text-white/25">
        {description}
      </p>

      <p className="mt-7 text-[9px] uppercase tracking-[0.15em] text-white/20">
        {value}
      </p>
    </Link>
  );
}

/* -------------------------------- */
/* QUICK LINK */
/* -------------------------------- */

function QuickLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="rounded-full border border-white/10 px-5 py-3 text-[9px] uppercase tracking-[0.15em] text-white/30 transition hover:border-white/25 hover:text-white"
    >
      {children}
    </Link>
  );
}