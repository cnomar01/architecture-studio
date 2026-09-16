"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Save, Trash2, UserRound } from "lucide-react";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Manager" | "Engineer" | "Client";
  employeeId: string;
  department: string;
  active: boolean;
  createdAt?: string;
};

export default function EditTeamMemberPage() {
  const [member, setMember] = useState<TeamMember | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState<
    "Owner" | "Manager" | "Engineer" | "Client"
  >("Engineer");
  const [department, setDepartment] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">(
    "Active"
  );
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadMember() {
      try {
        setLoading(true);

        const id =
          window.location.pathname.split("/")[4];

        const response = await fetch("/api/admin/team", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load team.");
        }

        const data = await response.json();

        const found = (data.users || []).find(
          (user: TeamMember) =>
            user.id === id ||
            user.employeeId === id
        );

        if (!found) {
          setMember(null);
          return;
        }

        setMember(found);
        setName(found.name);
        setEmail(found.email);
        setCode(found.employeeId || "");
        setRole(found.role);
        setDepartment(found.department || "");
        setStatus(found.active ? "Active" : "Inactive");
      } catch (err) {
        console.error(err);
        setError("Failed to load employee.");
      } finally {
        setLoading(false);
      }
    }

    loadMember();
  }, []);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!member) return;

    if (!name.trim()) {
      setError("Employee name is required.");
      return;
    }

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    if (!department.trim()) {
      setError("Department is required.");
      return;
    }

    if (!role) {
      setError("Role is required.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/admin/team", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: member.id,
          name: name.trim(),
          email: email.trim(),
          employeeId: code.trim().toUpperCase(),
          role,
          department: department.trim(),
          active: status === "Active",
          ...(password
            ? { password }
            : {}),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to update employee."
        );
      }

      window.location.href =
        `/app/admin/team/${member.id}`;
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update employee."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!member) return;

    const confirmed = window.confirm(
      `Delete ${member.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        "/api/admin/team",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: member.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Failed to delete employee."
        );
      }

      window.location.href =
        "/app/admin/team";
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete employee."
      );
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <p className="text-sm text-white/40">
              Loading employee...
            </p>
          </div>
        </div>
      </main>
    );
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
              <UserRound
                size={19}
                className="text-white/50"
              />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                Team Management
              </p>

              <h1 className="mt-1 text-3xl font-medium">
                Edit Employee
              </h1>

              <p className="mt-2 text-xs text-white/30">
                Update employee information and access.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

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
                label="Email"
                value={email}
                onChange={setEmail}
                placeholder="employee@masonandarc.com"
                type="email"
                required
              />

              <Field
                label="Employee Code"
                value={code}
                onChange={setCode}
                placeholder="EMP-001"
              />

              <div>
                <label className="mb-2 block text-xs text-white/50">
                  Role
                </label>

                <select
                  value={role}
                  onChange={(event) =>
                    setRole(
                      event.target.value as TeamMember["role"]
                    )
                  }
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none focus:border-white/30"
                >
                  <option value="Engineer">
                    Engineer
                  </option>

                  <option value="Manager">
                    Manager
                  </option>

                  <option value="Owner">
                    Owner
                  </option>

                  <option value="Client">
                    Client
                  </option>
                </select>
              </div>

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
              {(["Active", "Inactive"] as const).map(
                (item) => {
                  const selected = status === item;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setStatus(item)
                      }
                      className={`rounded-xl border px-4 py-4 text-left transition ${
                        selected
                          ? "border-white/30 bg-white/[0.08]"
                          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                      }`}
                    >
                      <p className="text-sm font-medium">
                        {item}
                      </p>

                      <p className="mt-1 text-xs text-white/30">
                        {item === "Active"
                          ? "Available for assignments"
                          : "Not available for assignments"}
                      </p>
                    </button>
                  );
                }
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <SectionTitle
              title="Password"
              description="Leave empty to keep the current password."
            />

            <div className="mt-6">
              <Field
                label="New Password"
                value={password}
                onChange={setPassword}
                placeholder="Minimum 8 characters"
                type="password"
              />
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting || saving}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-5 text-sm text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Trash2 size={15} />

              {deleting
                ? "Deleting..."
                : "Delete Employee"}
            </button>

            <button
              type="submit"
              disabled={saving || deleting}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-6 text-sm font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={15} />

              {saving
                ? "Saving..."
                : "Save Changes"}
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

      <p className="mt-1 text-xs text-white/30">
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
  type = "text",
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs text-white/50">
        {label}
        {required && (
          <span className="ml-1 text-white/30">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        required={required}
        maxLength={
          type === "password" ? 256 : 254
        }
        className="h-11 w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-white/30"
      />
    </div>
  );
}