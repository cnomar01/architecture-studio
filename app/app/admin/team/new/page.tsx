"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";

import {
  addTeamMember,
} from "@/lib/core/teamStore";

export default function NewTeamMemberPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [status, setStatus] =
    useState<"Active" | "Inactive">("Active");

  const [project, setProject] = useState("");
  const [projectRole, setProjectRole] = useState("");

  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Employee name is required.");
      return;
    }

    if (!code.trim()) {
      setError("Employee code is required.");
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

    try {
      const cleanName = name.trim();

      const initials = cleanName
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");

      addTeamMember({
        code: code.trim().toUpperCase(),
        name: cleanName,
        initials,
        role: role.trim(),
        department: department.trim(),
        status,
        project: project.trim() || undefined,
        projectRole: projectRole.trim() || undefined,
      });

      window.location.href = "/app/admin/team";
    } catch {
      setError(
        "Unable to create team member. Please try again."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-[900px] px-5 py-8 md:px-8 lg:px-10">

        {/* HEADER */}
        <div className="mb-8 border-b border-white/10 pb-7">

          <Link
            href="/app/admin/team"
            className="mb-6 inline-flex items-center gap-2 text-xs text-white/40 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to Team
          </Link>

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <UserPlus
                size={19}
                className="text-white/50"
              />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                Studio Management
              </p>

              <h1 className="mt-1 text-3xl font-medium">
                Add Team Member
              </h1>

              <p className="mt-2 text-xs text-white/30">
                Add an employee to the Mason & Arc team.
              </p>
            </div>

          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* PERSONAL */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

            <SectionTitle
              title="Employee Information"
              description="Basic employee identity."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <Field
                label="Full Name"
                value={name}
                onChange={setName}
                placeholder="e.g. Omar Mohamed"
                required
              />

              <Field
                label="Employee Code"
                value={code}
                onChange={setCode}
                placeholder="e.g. OM-002"
                required
              />

              <Field
                label="Role"
                value={role}
                onChange={setRole}
                placeholder="e.g. Architect"
                required
              />

              <Field
                label="Department"
                value={department}
                onChange={setDepartment}
                placeholder="e.g. Architecture"
                required
              />

            </div>

          </section>

          {/* STATUS */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

            <SectionTitle
              title="Employment Status"
              description="Control whether this team member is available for assignments."
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              {(["Active", "Inactive"] as const).map(
                (item) => {
                  const selected = status === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setStatus(item)}
                      className={`rounded-xl border p-4 text-left text-sm transition ${
                        selected
                          ? "border-white/20 bg-white text-black"
                          : "border-white/10 bg-black/20 text-white/45 hover:bg-white/[0.05] hover:text-white"
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
                          ? "Available for project assignments"
                          : "Not available for new assignments"}
                      </div>
                    </button>
                  );
                }
              )}

            </div>

          </section>

          {/* PROJECT */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

            <SectionTitle
              title="Project Assignment"
              description="Optionally assign the employee to a current project."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <Field
                label="Project"
                value={project}
                onChange={setProject}
                placeholder="e.g. City Edge Mall"
              />

              <Field
                label="Project Role"
                value={projectRole}
                onChange={setProjectRole}
                placeholder="e.g. Project Architect"
              />

            </div>

          </section>

          {/* ERROR */}
          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">

            <Link
              href="/app/admin/team"
              className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-xs text-white/45 transition hover:bg-white/[0.06] hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-white px-6 py-3 text-xs font-medium text-black transition hover:bg-white/90"
            >
              Add Team Member
            </button>

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