"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  addTask,
  TaskPriority,
  TaskStatus,
} from "../taskStore";

import { getProjects, Project } from "@/lib/core/projectStore";
import { getUsers } from "@/lib/core/authStore";
import { getSmartAssignmentRecommendations } from "../smartAssign";

export default function NewTaskPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  const [form, setForm] = useState({
    title: "",
    project: "City Edge Mall",
    projectId: "CEM-001",
    assignee: "Omar Mohamed",
    assigneeId: "OM-001",
    department: "Architecture",
    priority: "Medium" as TaskPriority,
    deadline: "Today",
    status: "Open" as TaskStatus,
    description: "",
    dependencies: [] as string[],
  });

  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    setProjects(getProjects());
    setUsers(getUsers());
  }, []);

  useEffect(() => {
    try {
      const results = getSmartAssignmentRecommendations({
        tasks: [],
        department: form.department,
        project: form.project,
      });

      setRecommendations(results || []);
    } catch {
      setRecommendations([]);
    }
  }, [form.department, form.project]);

  function submit() {
    if (!form.title.trim()) return;

    addTask({
      ...form,
      title: form.title.trim(),
    });

    window.location.href = "/app/admin/tasks";
  }

  function selectAssignee(
    id: string,
    name: string,
    department: string
  ) {
    setForm((current) => ({
      ...current,
      assigneeId: id,
      assignee: name,
      department,
    }));
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white p-6 md:p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/app/admin/tasks"
          className="text-sm text-white/40 hover:text-white"
        >
          ← Tasks
        </Link>

        <div className="mt-6">
          <p className="text-xs uppercase tracking-[0.25em] text-white/30">
            Operations
          </p>

          <h1 className="mt-2 text-3xl font-semibold">
            Create Task
          </h1>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Task Title"
                value={form.title}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    title: value,
                  }))
                }
                placeholder="e.g. Coordinate structural openings"
              />

              <Select
                label="Project"
                value={form.projectId}
                onChange={(value) => {
                  const project = projects.find(
                    (item) => item.id === value
                  );

                  setForm((current) => ({
                    ...current,
                    projectId: value,
                    project: project?.name || current.project,
                  }));
                }}
                options={projects.map((project) => ({
                  value: project.id,
                  label: project.name,
                }))}
              />

              <Select
                label="Assignee"
                value={form.assigneeId}
                onChange={(value) => {
                  const user = users.find(
                    (item) => item.employeeId === value
                  );

                  if (user) {
                    selectAssignee(
                      user.employeeId,
                      user.name,
                      user.role === "Civil Engineer"
                        ? "Civil"
                        : "Architecture"
                    );
                  }
                }}
                options={users
                  .filter((user) => user.employeeId)
                  .map((user) => ({
                    value: user.employeeId,
                    label: user.name,
                  }))}
              />

              <Select
                label="Priority"
                value={form.priority}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    priority: value as TaskPriority,
                  }))
                }
                options={[
                  "Low",
                  "Medium",
                  "High",
                  "Urgent",
                ].map((value) => ({
                  value,
                  label: value,
                }))}
              />

              <Field
                label="Department"
                value={form.department}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    department: value,
                  }))
                }
                placeholder="Architecture"
              />

              <Field
                label="Deadline"
                value={form.deadline}
                onChange={(value) =>
                  setForm((current) => ({
                    ...current,
                    deadline: value,
                  }))
                }
                placeholder="18 Sep 2026"
              />
            </div>

            <div className="mt-5">
              <label className="text-xs uppercase tracking-wider text-white/30">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                rows={6}
                placeholder="Describe the expected outcome..."
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/25"
              />
            </div>

            <button
              onClick={submit}
              disabled={!form.title.trim()}
              className="mt-6 rounded-xl bg-white px-6 py-3 text-sm font-medium text-black disabled:opacity-30"
            >
              Create Task
            </button>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-xs uppercase tracking-wider text-white/30">
              Smart Assignment
            </p>

            <h2 className="mt-2 text-xl font-semibold">
              Recommended Team Members
            </h2>

            <p className="mt-2 text-sm text-white/40">
              Ranked using the existing assignment engine.
            </p>

            <div className="mt-6 space-y-3">
              {recommendations.map((candidate: any) => {
                const member = candidate.member;

                if (!member) return null;

                return (
                  <button
                    key={member.id}
                    onClick={() =>
                      selectAssignee(
                        member.id,
                        member.name,
                        member.department
                      )
                    }
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      form.assigneeId === member.id
                        ? "border-white bg-white/5"
                        : "border-white/10 hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">
                          {member.name}
                        </p>
                        <p className="mt-1 text-xs text-white/40">
                          {member.role}
                        </p>
                      </div>

                      <span className="text-sm font-semibold">
                        {candidate.score ?? 0}
                      </span>
                    </div>

                    <div className="mt-3 text-[10px] text-white/35">
                      {(candidate.reasons || []).join(" · ")}
                    </div>

                    <div className="mt-2 text-[10px] text-white/30">
                      Workload: {candidate.workload ?? 0}%
                    </div>
                  </button>
                );
              })}

              {recommendations.length === 0 && (
                <div className="rounded-xl border border-white/10 p-4 text-sm text-white/35">
                  No recommendations available.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label>
      <span className="text-xs uppercase tracking-wider text-white/30">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/25"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label>
      <span className="text-xs uppercase tracking-wider text-white/30">
        {label}
      </span>

      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
