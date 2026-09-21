"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getStudioTasks, type StudioTask } from "@/lib/client/studioTasks";

const columns: StudioTask["status"][] = [
  "Open",
  "In Progress",
  "Completed",
  "Overdue",
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<StudioTask[]>([]);
  const [loadError, setLoadError] = useState("");
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");

  async function load() {
    try { setTasks(await getStudioTasks()); setLoadError(""); }
    catch (cause) { setLoadError(cause instanceof Error ? cause.message : "Could not load shared tasks."); }
  }

  useEffect(() => {
    load();
    const interval = setInterval(() => { void load(); }, 30000);
    return () => clearInterval(interval);
  }, []);

  const projects = useMemo(
    () => Array.from(new Set(tasks.map((task) => task.projectName))),
    [tasks]
  );

  const assignees = useMemo(
    () => Array.from(new Set(tasks.map((task) => task.assigneeName))),
    [tasks]
  );

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.projectName.toLowerCase().includes(query) ||
        task.assigneeName.toLowerCase().includes(query);

      const matchesProject =
        projectFilter === "All" ||
        task.projectName === projectFilter;

      const matchesAssignee =
        assigneeFilter === "All" ||
        task.assigneeName === assigneeFilter;

      return (
        matchesSearch &&
        matchesProject &&
        matchesAssignee &&
        true
      );
    });
  }, [tasks, search, projectFilter, assigneeFilter]);

  return (
    <main className="min-h-screen bg-[#080808] text-white p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-white/30">
              Operations
            </p>
            <h1 className="mt-2 text-3xl font-semibold">
              Task Command Center
            </h1>
            <p className="mt-2 text-sm text-white/40">
              Tasks, dependencies, subtasks and execution status.
            </p>
          </div>

          <Link
            href="/app/admin/tasks/new"
            className="rounded-xl bg-white px-5 py-3 text-sm font-medium text-black"
          >
            + New Task
          </Link>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-4">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search tasks..."
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/25"
          />

          <select
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
            className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm outline-none"
          >
            <option value="All">All Projects</option>
            {projects.map((project) => (
              <option key={project}>{project}</option>
            ))}
          </select>

          <select
            value={assigneeFilter}
            onChange={(event) => setAssigneeFilter(event.target.value)}
            className="rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm outline-none"
          >
            <option value="All">All Assignees</option>
            {assignees.map((assignee) => (
              <option key={assignee}>{assignee}</option>
            ))}
          </select>

          <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/50">
            {filtered.length} active task records
          </div>
        </div>
        {loadError && <p role="alert" className="mb-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-200">{loadError}</p>}

        <div className="grid gap-4 xl:grid-cols-4">
          {columns.map((status) => {
            const column = filtered.filter(
              (task) => task.status === status
            );

            return (
              <section
                key={status}
                className="min-h-[420px] rounded-2xl border border-white/10 bg-white/[0.02]"
              >
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                  <h2 className="text-sm font-medium">
                    {status}
                  </h2>

                  <span className="rounded-full bg-white/5 px-2 py-1 text-xs text-white/40">
                    {column.length}
                  </span>
                </div>

                <div className="space-y-3 p-3">
                  {column.map((task) => (
                      <div
                        key={task.id}
                        className="block rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20 hover:bg-white/[0.04]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-medium">
                            {task.title}
                          </h3>

                          <PriorityBadge priority={task.priority} />
                        </div>

                        <p className="mt-2 text-xs text-white/40">
                          {task.projectName}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-white/35">
                          <span>{task.assigneeName}</span>
                          <span>·</span>
                          <span>{task.deadline}</span>
                        </div>

                        {task.description && <p className="mt-3 text-xs leading-5 text-white/35">{task.description}</p>}
                      </div>
                  ))}

                  {column.length === 0 && (
                    <div className="py-10 text-center text-xs text-white/25">
                      No tasks
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: StudioTask["priority"];
}) {
  const styles: Record<StudioTask["priority"], string> = {
    Low: "bg-white/5 text-white/40",
    Medium: "bg-white/10 text-white/50",
    High: "bg-orange-400/10 text-orange-300",
    Urgent: "bg-red-400/10 text-red-300",
  };

  return (
    <span
      className={`rounded-full px-2 py-1 text-[10px] ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}
