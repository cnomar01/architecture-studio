"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getTasks, updateTask, Task } from "../../admin/tasks/taskStore";

const ENGINEER_ID = "OM-001";

export default function EngineerTasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    loadTasks();
  }, []);

  function loadTasks() {
    const allTasks = getTasks();

    setTasks(
      allTasks.filter(
        (task) => task.assigneeId === ENGINEER_ID
      )
    );
  }

  function changeStatus(
    taskId: string,
    status: Task["status"]
  ) {
    updateTask(taskId, { status });
    loadTasks();
  }

  const open = tasks.filter(
    (task) => task.status === "Open"
  ).length;

  const inProgress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

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

          <Link
            href="/app/engineer"
            className="text-[9px] uppercase tracking-[0.18em] text-white/25 hover:text-white"
          >
            ← Workspace
          </Link>

        </div>
      </header>

      {/* CONTENT */}
      <section className="px-6 pb-32 pt-12 md:px-10 md:pt-20">
        <div className="mx-auto max-w-7xl">

          {/* TITLE */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/20">
              Omar Mohamed · Architect
            </p>

            <h1 className="mt-4 text-5xl font-light tracking-[-0.05em] md:text-7xl">
              My Tasks
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-6 text-white/30">
              Tasks assigned to you for City Edge Mall.
            </p>
          </div>

          {/* PROJECT */}
          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-7">
            <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">
              Current Project
            </p>

            <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div>
                <h2 className="text-2xl font-light">
                  City Edge Mall
                </h2>

                <p className="mt-2 text-xs text-white/25">
                  Architecture · Current Assignment
                </p>
              </div>

              <span className="w-fit rounded-full border border-white/10 px-4 py-2 text-[9px] uppercase tracking-[0.15em] text-white/35">
                Active
              </span>

            </div>
          </div>

          {/* STATS */}
          <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">

            <Stat
              label="Open"
              value={open}
            />

            <Stat
              label="In Progress"
              value={inProgress}
            />

            <Stat
              label="Completed"
              value={completed}
            />

          </div>

          {/* TASK LIST */}
          <div className="mt-10">

            <div className="flex items-end justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">
                  Work Queue
                </p>

                <h2 className="mt-3 text-2xl font-light">
                  Assigned Work
                </h2>
              </div>

              <span className="text-[10px] text-white/20">
                {tasks.length} total
              </span>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">

              {tasks.length === 0 ? (
                <div className="px-7 py-24 text-center">

                  <p className="text-sm text-white/30">
                    No tasks assigned.
                  </p>

                  <p className="mt-2 text-xs text-white/15">
                    You currently have no work assigned to your account.
                  </p>

                </div>
              ) : (
                tasks.map((task, index) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    index={index}
                    onStatusChange={changeStatus}
                  />
                ))
              )}

            </div>
          </div>

          {/* NAVIGATION */}
          <div className="mt-10 grid gap-4 md:grid-cols-3">

            <NavCard
              href="/app/engineer"
              title="Dashboard"
              description="Back to your workspace."
            />

            <NavCard
              href="/app/engineer/files"
              title="Project Files"
              description="Drawings and documents."
            />

            <NavCard
              href="/app/engineer/site"
              title="Site Reports"
              description="Site visits and issues."
            />

          </div>

        </div>
      </section>
    </main>
  );
}

/* -------------------------------- */
/* TASK ITEM */
/* -------------------------------- */

function TaskItem({
  task,
  index,
  onStatusChange,
}: {
  task: Task;
  index: number;
  onStatusChange: (
    taskId: string,
    status: Task["status"]
  ) => void;
}) {
  const completed = task.status === "Completed";

  return (
    <div className="border-b border-white/10 p-6 last:border-b-0 md:p-7">

      <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">

        <div className="flex gap-5">

          <span className="pt-1 text-[10px] text-white/15">
            {String(index + 1).padStart(2, "0")}
          </span>

          <div>

            <div className="flex flex-wrap items-center gap-3">

              <h3
                className={`text-sm font-light ${
                  completed
                    ? "text-white/30 line-through"
                    : "text-white/80"
                }`}
              >
                {task.title}
              </h3>

              <span className="rounded-full border border-white/10 px-3 py-1 text-[8px] uppercase tracking-[0.12em] text-white/30">
                {task.status}
              </span>

            </div>

            <p className="mt-2 text-xs text-white/25">
              {task.project}
            </p>

            <div className="mt-4 flex flex-wrap gap-5">

              <span className="text-[9px] uppercase tracking-[0.12em] text-white/20">
                Priority · {task.priority}
              </span>

              <span className="text-[9px] uppercase tracking-[0.12em] text-white/20">
                Due · {task.deadline}
              </span>

            </div>

            {task.description && (
              <p className="mt-4 max-w-2xl text-xs leading-5 text-white/25">
                {task.description}
              </p>
            )}

          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-2">

          {task.status === "Open" && (
            <button
              type="button"
              onClick={() =>
                onStatusChange(
                  task.id,
                  "In Progress"
                )
              }
              className="rounded-full border border-white/10 px-5 py-3 text-[9px] uppercase tracking-[0.15em] text-white/40 transition hover:border-white/30 hover:text-white"
            >
              Start Task
            </button>
          )}

          {task.status === "In Progress" && (
            <button
              type="button"
              onClick={() =>
                onStatusChange(
                  task.id,
                  "Completed"
                )
              }
              className="rounded-full bg-white px-5 py-3 text-[9px] uppercase tracking-[0.15em] text-black transition hover:bg-white/80"
            >
              Complete Task
            </button>
          )}

          {completed && (
            <span className="flex items-center px-4 text-[9px] uppercase tracking-[0.15em] text-white/25">
              ✓ Done
            </span>
          )}

        </div>

      </div>

    </div>
  );
}

/* -------------------------------- */
/* STAT */
/* -------------------------------- */

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-[#111111] p-6">

      <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">
        {label}
      </p>

      <p className="mt-4 text-3xl font-light">
        {String(value).padStart(2, "0")}
      </p>

    </div>
  );
}

/* -------------------------------- */
/* NAV CARD */
/* -------------------------------- */

function NavCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-white/10 p-6 transition hover:bg-white/[0.035]"
    >
      <div className="flex items-start justify-between">

        <h3 className="text-sm font-light text-white/60">
          {title}
        </h3>

        <span className="text-white/20 transition group-hover:translate-x-1 group-hover:text-white">
          →
        </span>

      </div>

      <p className="mt-3 text-xs text-white/20">
        {description}
      </p>
    </Link>
  );
}