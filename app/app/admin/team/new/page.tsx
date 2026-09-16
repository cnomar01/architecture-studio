"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function NewTeamMemberPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [role, setRole] = useState<"Manager" | "Engineer">("Engineer");
  const [department, setDepartment] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/team", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          employeeId,
          role,
          department,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to create account.");
      }

      window.location.href = "/app/admin/team";
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-[900px] px-5 py-8 md:px-8">
        <div className="mb-8 border-b border-white/10 pb-7">
          <Link
            href="/app/admin/team"
            className="mb-6 inline-flex items-center gap-2 text-xs text-white/40 hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to Team
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <UserPlus size={19} className="text-white/50" />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                Studio Management
              </p>

              <h1 className="mt-1 text-3xl font-medium">
                Add Team Member
              </h1>

              <p className="mt-2 text-xs text-white/30">
                Create a secure Mason & Arc employee account.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">
            <h2 className="text-sm font-medium">
              Account Information
            </h2>

            <p className="mt-1 text-xs text-white/25">
              This account will be stored in the Mason & Arc database.
            </p>

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
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="employee@masonandarc.com"
                required
              />

              <Field
                label="Employee ID"
                value={employeeId}
                onChange={setEmployeeId}
                placeholder="e.g. ENG-001"
              />

              <Field
                label="Department"
                value={department}
                onChange={setDepartment}
                placeholder="Architecture / Civil / Interior"
              />

              <div>
                <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-white/30">
                  Role
                </label>

                <select
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value as "Manager" | "Engineer")
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none focus:border-white/25"
                >
                  <option value="Engineer">Engineer</option>
                  <option value="Manager">Manager</option>
                </select>
              </div>

              <Field
                label="Temporary Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Minimum 8 characters"
                required
              />
            </div>
          </section>

          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs text-red-300">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/app/admin/team"
              className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-xs text-white/45 hover:bg-white/[0.06] hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-white px-6 py-3 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </main>
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
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-white/30">
        {label}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        maxLength={type === "email" ? 254 : 120}
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
      />
    </div>
  );
}