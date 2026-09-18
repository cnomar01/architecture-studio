"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import {
  addTaskComment,
  addTaskDependency,
  addSubtask,
  canStartTask,
  getTaskById,
  getTaskDependencies,
  getSubtasks,
  getTaskHistory,
  getTasks,
  Task,
  updateTask,
  linkTaskToFile,
  linkTaskToApproval,
  linkTaskToSiteIssue,
  deleteTask,
} from "../taskStore";

import { getUsers } from "@/lib/core/authStore";

export default function TaskDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const taskId = params.id;

  const [task, setTask] = useState<Task | undefined>(undefined);
  const [comment, setComment] = useState("");
  const [dependency, setDependency] = useState("");
  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [fileId, setFileId] = useState("");
  const [approvalId, setApprovalId] = useState("");
  const [siteIssueId, setSiteIssueId] = useState("");
  const [users, setUsers] = useState<any[]>([]);

  function load() {
    setTask(getTaskById(taskId));
    setUsers(getUsers());
  }

  useEffect(() => {
    load();

    const interval = setInterval(load, 1000);

    return () => clearInterval(interval);
  }, [taskId]);

  if (!task) {
    return (
      <main className="min-h-screen bg-[#080808] p-8 text-white">
        <Link
          href="/app/admin/tasks"
          className="text-sm text-white/40 hover:text-white"
        >
          ← Tasks
        </Link>

        <div className="mt-20 text-center">
          <h1 className="text-2xl font-semibold">
            Task Not Found
          </h1>
        </div>
      </main>
    );
  }

  const currentTask: Task = task;

  const subtasks = getSubtasks(currentTask.id);
  const dependencies = getTaskDependencies(currentTask.id);
  const history = getTaskHistory(currentTask.id);
  const canStart = canStartTask(currentTask.id);

  const currentUser =
    users.find(
      (user) => user.role === "Owner" && user.active
    ) ||
    users.find((user) => user.active) || {
      id: "USR-001",
      name: "Mason & Arc Owner",
    };

  function changeStatus(status: Task["status"]) {
    updateTask(currentTask.id, {
      status,
    });

    load();
  }

  function addComment() {
    const body = comment.trim();

    if (!body) return;

    addTaskComment(currentTask.id, {
      authorId: currentUser.id,
      authorName: currentUser.name,
      body,
    });

    setComment("");
    load();
  }

  function createSubtask() {
    const title = subtaskTitle.trim();

    if (!title) return;

    addSubtask(currentTask.id, {
      title,
      project: currentTask.project,
      projectId: currentTask.projectId,
      assignee: currentTask.assignee,
      assigneeId: currentTask.assigneeId,
      department: currentTask.department,
      priority: currentTask.priority,
      deadline: currentTask.deadline,
      status: "Open",
      description: "",
      dependencies: [],
    });

    setSubtaskTitle("");
    load();
  }

  function addDependency() {
    if (!dependency) return;

    addTaskDependency(currentTask.id, dependency);

    setDependency("");
    load();
  }

  function removeTask() {
    const warning = subtasks.length
      ? `Delete “${currentTask.title}” and its ${subtasks.length} subtask(s)? This cannot be undone.`
      : `Delete “${currentTask.title}”? This cannot be undone.`;
    if (!window.confirm(warning)) return;

    deleteTask(currentTask.id);
    router.replace("/app/admin/tasks");
  }

  return (
    <main className="min-h-screen bg-[#080808] p-6 text-white md:p-8">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/app/admin/tasks"
          className="text-sm text-white/40 hover:text-white"
        >
          ← Task Command Center
        </Link>

        <div className="mt-6 flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs text-white/30">
              {currentTask.id}
            </p>

            <h1 className="mt-2 text-3xl font-semibold">
              {currentTask.title}
            </h1>

            <p className="mt-2 text-sm text-white/40">
              {currentTask.project} · {currentTask.assignee}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(
              [
                "Open",
                "In Progress",
                "Completed",
                "Overdue",
              ] as const
            ).map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => changeStatus(status)}
                className={`rounded-xl border px-3 py-2 text-xs ${
                  currentTask.status === status
                    ? "border-white bg-white text-black"
                    : "border-white/10 text-white/50 hover:bg-white/5"
                }`}
              >
                {status}
              </button>
            ))}
            <button
              type="button"
              onClick={removeTask}
              className="rounded-xl border border-red-400/30 px-3 py-2 text-xs text-red-300 transition hover:bg-red-400/10"
            >
              Delete task
            </button>
          </div>
        </div>

        {!canStart && currentTask.status === "Open" && (
          <div className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/5 px-4 py-3 text-sm text-amber-200">
            This task is blocked by incomplete dependencies.
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] lg:col-span-2">
            <div className="border-b border-white/10 px-6 py-5">
              <h2 className="font-semibold">
                Task Overview
              </h2>
            </div>

            <div className="grid gap-5 p-6 sm:grid-cols-2">
              <Info
                label="Assignee"
                value={currentTask.assignee}
              />

              <Info
                label="Department"
                value={currentTask.department}
              />

              <Info
                label="Priority"
                value={currentTask.priority}
              />

              <Info
                label="Deadline"
                value={currentTask.deadline}
              />

              <Info
                label="Status"
                value={currentTask.status}
              />

              <Info
                label="Project"
                value={currentTask.project}
              />
            </div>

            {currentTask.description && (
              <div className="border-t border-white/10 px-6 py-5">
                <p className="text-xs uppercase tracking-wider text-white/30">
                  Description
                </p>

                <p className="mt-3 text-sm leading-6 text-white/60">
                  {currentTask.description}
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-semibold">
              Execution
            </h2>

            <div className="mt-6 space-y-4">
              <Info
                label="Subtasks"
                value={String(subtasks.length)}
              />

              <Info
                label="Dependencies"
                value={String(dependencies.length)}
              />

              <Info
                label="Comments"
                value={String(
                  currentTask.comments?.length || 0
                )}
              />

              <Info
                label="History"
                value={String(history.length)}
              />
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="font-semibold">Project Links</h2>
            <p className="mt-1 text-xs text-white/30">Connect this task to drawings, approvals and site issues.</p>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-3">
            <LinkField
              label="File / Drawing ID"
              value={fileId}
              linked={currentTask.linkedFileIds || []}
              placeholder="e.g. FILE-001"
              onChange={setFileId}
              onAdd={() => {
                if (!fileId.trim()) return;
                linkTaskToFile(currentTask.id, fileId);
                setFileId("");
                load();
              }}
            />
            <LinkField
              label="Approval ID"
              value={approvalId}
              linked={currentTask.linkedApprovalIds || []}
              placeholder="e.g. APR-001"
              onChange={setApprovalId}
              onAdd={() => {
                if (!approvalId.trim()) return;
                linkTaskToApproval(currentTask.id, approvalId);
                setApprovalId("");
                load();
              }}
            />
            <LinkField
              label="Site Issue ID"
              value={siteIssueId}
              linked={currentTask.linkedSiteIssueIds || []}
              placeholder="e.g. ISSUE-001"
              onChange={setSiteIssueId}
              onAdd={() => {
                if (!siteIssueId.trim()) return;
                linkTaskToSiteIssue(currentTask.id, siteIssueId);
                setSiteIssueId("");
                load();
              }}
            />
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="border-b border-white/10 px-6 py-5">
              <h2 className="font-semibold">
                Subtasks
              </h2>
            </div>

            <div className="p-6">
              <div className="flex gap-2">
                <input
                  value={subtaskTitle}
                  onChange={(event) =>
                    setSubtaskTitle(event.target.value)
                  }
                  placeholder="New subtask..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/25"
                />

                <button
                  type="button"
                  onClick={createSubtask}
                  className="rounded-xl bg-white px-4 text-sm font-medium text-black"
                >
                  Add
                </button>
              </div>

              <div className="mt-5 space-y-2">
                {subtasks.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/10 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm">
                        {item.title}
                      </p>

                      <span className="text-xs text-white/40">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}

                {subtasks.length === 0 && (
                  <p className="py-6 text-center text-sm text-white/30">
                    No subtasks.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="border-b border-white/10 px-6 py-5">
              <h2 className="font-semibold">
                Dependencies
              </h2>
            </div>

            <div className="p-6">
              <select
                value={dependency}
                onChange={(event) =>
                  setDependency(event.target.value)
                }
                className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm outline-none"
              >
                <option value="">
                  Select a task dependency...
                </option>

                {getTaskCandidates(currentTask.id).map(
                  (candidate) => (
                    <option
                      key={candidate.id}
                      value={candidate.id}
                    >
                      {candidate.id} — {candidate.title}
                    </option>
                  )
                )}
              </select>

              <button
                type="button"
                onClick={addDependency}
                disabled={!dependency}
                className="mt-3 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black disabled:opacity-30"
              >
                Add Dependency
              </button>

              <div className="mt-5 space-y-2">
                {dependencies.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/10 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm">
                        {item.title}
                      </p>

                      <span className="text-xs text-white/40">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}

                {dependencies.length === 0 && (
                  <p className="py-6 text-center text-sm text-white/30">
                    No dependencies.
                  </p>
                )}
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-6 py-5">
            <h2 className="font-semibold">Project Links</h2>
            <p className="mt-1 text-xs text-white/30">Connect this task to drawings, approvals and site issues.</p>
          </div>

          <div className="grid gap-6 p-6 md:grid-cols-3">
            <LinkField
              label="File / Drawing ID"
              value={fileId}
              linked={currentTask.linkedFileIds || []}
              placeholder="e.g. FILE-001"
              onChange={setFileId}
              onAdd={() => {
                if (!fileId.trim()) return;
                linkTaskToFile(currentTask.id, fileId);
                setFileId("");
                load();
              }}
            />
            <LinkField
              label="Approval ID"
              value={approvalId}
              linked={currentTask.linkedApprovalIds || []}
              placeholder="e.g. APR-001"
              onChange={setApprovalId}
              onAdd={() => {
                if (!approvalId.trim()) return;
                linkTaskToApproval(currentTask.id, approvalId);
                setApprovalId("");
                load();
              }}
            />
            <LinkField
              label="Site Issue ID"
              value={siteIssueId}
              linked={currentTask.linkedSiteIssueIds || []}
              placeholder="e.g. ISSUE-001"
              onChange={setSiteIssueId}
              onAdd={() => {
                if (!siteIssueId.trim()) return;
                linkTaskToSiteIssue(currentTask.id, siteIssueId);
                setSiteIssueId("");
                load();
              }}
            />
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="border-b border-white/10 px-6 py-5">
              <h2 className="font-semibold">
                Comments
              </h2>
            </div>

            <div className="max-h-[450px] space-y-3 overflow-y-auto p-6">
              {(currentTask.comments || []).map(
                (item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-white/10 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">
                        {item.authorName}
                      </p>

                      <p className="text-[10px] text-white/30">
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </p>
                    </div>

                    <p className="mt-2 text-sm leading-6 text-white/55">
                      {item.body}
                    </p>
                  </div>
                )
              )}

              {(currentTask.comments || []).length === 0 && (
                <p className="py-8 text-center text-sm text-white/30">
                  No comments yet.
                </p>
              )}
            </div>

            <div className="border-t border-white/10 p-4">
              <div className="flex gap-2">
                <input
                  value={comment}
                  onChange={(event) =>
                    setComment(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      addComment();
                    }
                  }}
                  placeholder="Write a task comment..."
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none placeholder:text-white/25"
                />

                <button
                  type="button"
                  onClick={addComment}
                  className="rounded-xl bg-white px-4 text-sm font-medium text-black"
                >
                  Send
                </button>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="border-b border-white/10 px-6 py-5">
              <h2 className="font-semibold">
                Assignment History
              </h2>
            </div>

            <div className="max-h-[520px] space-y-3 overflow-y-auto p-6">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-white/10 p-4"
                >
                  <p className="text-sm font-medium">
                    {entry.action}
                  </p>

                  {(entry.from || entry.to) && (
                    <p className="mt-1 text-xs text-white/40">
                      {entry.from || "—"} →{" "}
                      {entry.to || "—"}
                    </p>
                  )}

                  <div className="mt-2 text-[10px] text-white/30">
                    {entry.by} ·{" "}
                    {new Date(
                      entry.createdAt
                    ).toLocaleString()}
                  </div>
                </div>
              ))}

              {history.length === 0 && (
                <p className="py-8 text-center text-sm text-white/30">
                  No history yet.
                </p>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function getTaskCandidates(currentId: string) {
  return getTasks().filter(
    (task) =>
      task.id !== currentId &&
      !task.parentTaskId
  );
}

function LinkField({
  label,
  value,
  linked,
  placeholder,
  onChange,
  onAdd,
}: {
  label: string;
  value: string;
  linked: string[];
  placeholder: string;
  onChange: (value: string) => void;
  onAdd: () => void;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-white/30">{label}</p>
      <div className="mt-3 flex gap-2">
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={(event) => { if (event.key === "Enter") onAdd(); }}
          placeholder={placeholder}
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs outline-none placeholder:text-white/20"
        />
        <button type="button" onClick={onAdd} className="rounded-xl bg-white px-3 text-xs font-medium text-black">Add</button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {linked.map((id) => (
          <span key={id} className="rounded-full border border-white/10 px-2 py-1 text-[10px] text-white/40">{id}</span>
        ))}
        {linked.length === 0 && <span className="text-[10px] text-white/20">None linked</span>}
      </div>
    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-white/30">
        {label}
      </p>

      <p className="mt-2 text-sm text-white/75">
        {value}
      </p>
    </div>
  );
}
