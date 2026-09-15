"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  getTasks,
  getSubtasks,
  getTaskDependencies,
  Task,
  TaskStatus,
} from "./taskStore";

const columns: TaskStatus[] = [
  "Open",
  "In Progress",
  "Completed",
  "Overdue",
];

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] = useState("All");
  const [assigneeFilter, setAssigneeFilter] = useState("All");

  function load() {
    setTasks(getTasks());
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 1000);
    return () => clearInterval(interval);
  }, []);

  const projects = useMemo(
    () => Array.from(new Set(tasks.map((task) => task.project))),
    [tasks]
  );

  const assignees = useMemo(
    () => Array.from(new Set(tasks.map((task) => task.assignee))),
    [tasks]
  );

  const filtered = useMemo(() => {
    const query = search.toLowerCase().trim();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.project.toLowerCase().includes(query) ||
        task.assignee.toLowerCase().includes(query);

      const matchesProject =
        projectFilter === "All" ||
        task.project === projectFilter;

      const matchesAssignee =
        assigneeFilter === "All" ||
        task.assignee === assigneeFilter;

      return (
        matchesSearch &&
        matchesProject &&
        matchesAssignee &&
        !task.parentTaskId
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
                  {column.map((task) => {
                    const subtasks = getSubtasks(task.id);
                    const dependencies = getTaskDependencies(task.id);

                    return (
                      <Link
                        key={task.id}
                        href={`/app/admin/tasks/${task.id}`}
                        className="block rounded-xl border border-white/10 bg-black/20 p-4 transition hover:border-white/20 hover:bg-white/[0.04]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="text-sm font-medium">
                            {task.title}
                          </h3>

                          <PriorityBadge priority={task.priority} />
                        </div>

                        <p className="mt-2 text-xs text-white/40">
                          {task.project}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2 text-[10px] text-white/35">
                          <span>{task.assignee}</span>
                          <span>·</span>
                          <span>{task.deadline}</span>
                        </div>

                        <div className="mt-4 flex gap-2">
                          {subtasks.length > 0 && (
                            <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-white/40">
                              {subtasks.length} subtasks
                            </span>
                          )}

                          {dependencies.length > 0 && (
                            <span className="rounded-md bg-white/5 px-2 py-1 text-[10px] text-white/40">
                              {dependencies.length} dependencies
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}

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
      className={`rounded-full px-2 py-1 text-[10px] ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}
