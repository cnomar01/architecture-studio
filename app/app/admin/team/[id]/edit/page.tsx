"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Save, Trash2, UserRound } from "lucide-react";

import {
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
  TeamMember,
} from "@/lib/core/teamStore";

export default function EditTeamMemberPage() {
  const [member, setMember] = useState<TeamMember | null>(null);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] =
    useState<"Active" | "Inactive">("Active");
  const [project, setProject] = useState("");
  const [projectRole, setProjectRole] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const id = window.location.pathname.split("/")[4];
    const found = getTeamMemberById(id);

    if (!found) return;

    setMember(found);
    setName(found.name);
    setCode(found.code);
    setRole(found.role);
    setDepartment(found.department);
    setStatus(found.status);
    setProject(found.project ?? "");
    setProjectRole(found.projectRole ?? "");
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!member) return;

    if (!name.trim()) {
      setError("Employee name is required.");
      return;
    }

    if (!role.trim()) {
      setError("Role is required.");
      return;
    }

    if (!department.trim()) {
      setError("Department is required.");
      return;
    }

    const initials = name
      .trim()
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

    updateTeamMember(member.id, {
      name: name.trim(),
      code: code.trim().toUpperCase(),
      initials,
      role: role.trim(),
      department: department.trim(),
      status,
      project: project.trim() || undefined,
      projectRole: projectRole.trim() || undefined,
    });

    window.location.href =
      `/app/admin/team/${member.id}`;
  }

  function handleDelete() {
    if (!member) return;

    const confirmed = window.confirm(
      `Delete ${member.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    deleteTeamMember(member.id);

    window.location.href = "/app/admin/team";
  }

  if (!member) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <Link
            href="/app/admin/team"
            className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to Team
          </Link>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <h1 className="text-2xl font-medium">
              Team Member Not Found
            </h1>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-4xl px-5 py-8 md:px-8">

        <div className="mb-8 border-b border-white/10 pb-7">

          <Link
            href={`/app/admin/team/${member.id}`}
            className="mb-6 inline-flex items-center gap-2 text-xs text-white/40 hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to Employee
          </Link>

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <UserRound size={19} className="text-white/50" />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                Team Management
              </p>

              <h1 className="mt-1 text-3xl font-medium">
                Edit Employee
              </h1>

              <p className="mt-2 text-xs text-white/30">
                Update employee information and assignment.
              </p>
            </div>

          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

            <SectionTitle
              title="Employee Information"
              description="Basic employee identity and role."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <Field
                label="Full Name"
                value={name}
                onChange={setName}
                placeholder="Employee name"
                required
              />

              <Field
                label="Employee Code"
                value={code}
                onChange={setCode}
                placeholder="EMP-001"
                required
              />

              <Field
                label="Role"
                value={role}
                onChange={setRole}
                placeholder="Architect"
                required
              />

              <Field
                label="Department"
                value={department}
                onChange={setDepartment}
                placeholder="Architecture"
                required
              />

            </div>

          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

            <SectionTitle
              title="Employment Status"
              description="Control availability for project assignments."
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              {(["Active", "Inactive"] as const).map((item) => {

                const selected = status === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setStatus(item)}
                    className={`rounded-xl border p-4 text-left text-sm transition ${
                      selected
                        ? "border-white/20 bg-white text-black"
                        : "border-white/10 bg-black/20 text-white/45 hover:text-white"
                    }`}
                  >
                    <div className="font-medium">
                      {item}
                    </div>

                    <div
                      className={`mt-1 text-xs ${
                        selected
                          ? "text-black/50"
                          : "text-white/25"
                      }`}
                    >
                      {item === "Active"
                        ? "Available for assignments"
                        : "Unavailable for new assignments"}
                    </div>
                  </button>
                );
              })}

            </div>

          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

            <SectionTitle
              title="Project Assignment"
              description="Current project responsibility."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <Field
                label="Project"
                value={project}
                onChange={setProject}
                placeholder="City Edge Mall"
              />

              <Field
                label="Project Role"
                value={projectRole}
                onChange={setProjectRole}
                placeholder="Project Architect"
              />

            </div>

          </section>

          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-3 text-xs text-red-300 hover:bg-red-500/10"
            >
              <Trash2 size={14} />
              Delete Employee
            </button>

            <div className="flex gap-3">

              <Link
                href={`/app/admin/team/${member.id}`}
                className="rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-xs text-white/45 hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-medium text-black hover:bg-white/90"
              >
                <Save size={14} />
                Save Changes
              </button>

            </div>

          </div>

        </form>
      </div>
    </main>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-sm font-medium">
        {title}
      </h2>

      <p className="mt-1 text-xs text-white/25">
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-white/30">
        {label}
      </label>

      <input
        required={required}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
      />
    </div>
  );
}