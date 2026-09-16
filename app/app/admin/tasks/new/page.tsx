"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { addTask, TaskPriority, TaskStatus } from "../taskStore";
import { getSmartAssignmentRecommendations } from "../smartAssign";
import { getProjects, Project } from "@/lib/core/projectStore";
import { getUsers } from "@/lib/core/authStore";

type Recommendation = {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  status: string;
};

export default function NewTaskPage() {
  const router = useRouter();

  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<
    Recommendation[]
  >([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    project: "",
    department: "",
    priority: "Medium" as TaskPriority,
    status: "Open" as TaskStatus,
    dueDate: "",
    assigneeId: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] =
    useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setProjects(getProjects());
      } catch (error) {
        console.error("Failed to load projects:", error);
        setProjects([]);
      }

      try {
        setUsers(getUsers());
      } catch (error) {
        console.error("Failed to load users:", error);
        setUsers([]);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    async function loadRecommendations() {
      setLoadingRecommendations(true);

      try {
        const results =
          await getSmartAssignmentRecommendations({
            tasks: [],
            department: form.department,
            project: form.project,
          });

        setRecommendations(results || []);
      } catch (error) {
        console.error(
          "Failed to load assignment recommendations:",
          error
        );
        setRecommendations([]);
      } finally {
        setLoadingRecommendations(false);
      }
    }

    loadRecommendations();
  }, [form.department, form.project]);

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!form.title.trim()) {
      setError("Task title is required.");
      return;
    }

    setLoading(true);

    try {
      const selectedUser = users.find(
        (user) => user.id === form.assigneeId
      );

      const selectedRecommendation = recommendations.find(
        (member) => member.id === form.assigneeId
      );

      const assigneeName =
        selectedUser?.name ||
        selectedRecommendation?.name ||
        "";

      addTask({
        title: form.title.trim(),
        description: form.description.trim(),
        project: form.project,
        department: form.department,
        priority: form.priority,
        status: form.status,
        assigneeId: form.assigneeId,
        assignee: assigneeName,
        deadline: form.dueDate,
      });

      router.push("/app/admin/tasks");
      router.refresh();
    } catch (error) {
      console.error("Failed to create task:", error);
      setError("Failed to create task. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back
        </button>

        <h1 className="text-2xl font-semibold text-gray-900">
          Create Task
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Create a task and assign it to a team member.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">
            Task Details
          </h2>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Task Title
              </label>

              <input
                value={form.title}
                onChange={(event) =>
                  updateField("title", event.target.value)
                }
                maxLength={160}
                placeholder="e.g. Review structural drawings"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Description
              </label>

              <textarea
                value={form.description}
                onChange={(event) =>
                  updateField(
                    "description",
                    event.target.value
                  )
                }
                rows={5}
                maxLength={2000}
                placeholder="Describe the task..."
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Project
              </label>

              <select
                value={form.project}
                onChange={(event) =>
                  updateField("project", event.target.value)
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
              >
                <option value="">Select project</option>

                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.name}
                  >
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Department
              </label>

              <input
                value={form.department}
                onChange={(event) =>
                  updateField(
                    "department",
                    event.target.value
                  )
                }
                maxLength={100}
                placeholder="e.g. Architecture"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Priority
              </label>

              <select
                value={form.priority}
                onChange={(event) =>
                  updateField(
                    "priority",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Status
              </label>

              <select
                value={form.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
              >
                <option value="Open">Open</option>
                <option value="In Progress">
                  In Progress
                </option>
                <option value="Completed">
                  Completed
                </option>
                <option value="Overdue">
                  Overdue
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Deadline
              </label>

              <input
                type="date"
                value={form.dueDate}
                onChange={(event) =>
                  updateField(
                    "dueDate",
                    event.target.value
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Assignment
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose a team member or use the smart recommendations.
            </p>
          </div>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Assign To
            </label>

            <select
              value={form.assigneeId}
              onChange={(event) =>
                updateField(
                  "assigneeId",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
            >
              <option value="">Unassigned</option>

              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Smart Recommendations
              </h3>

              {loadingRecommendations && (
                <span className="text-xs text-gray-500">
                  Loading...
                </span>
              )}
            </div>

            {!loadingRecommendations &&
              recommendations.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500">
                  No active team members available.
                </div>
              )}

            <div className="grid gap-3 md:grid-cols-2">
              {recommendations.map((member) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() =>
                    updateField(
                      "assigneeId",
                      member.id
                    )
                  }
                  className={`rounded-xl border p-4 text-left transition ${
                    form.assigneeId === member.id
                      ? "border-gray-900 bg-gray-50"
                      : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-700">
                      {member.initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {member.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {member.role}
                        {member.department
                          ? ` · ${member.department}`
                          : ""}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={loading}
            className="rounded-xl border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>
      </form>
    </main>
  );
}