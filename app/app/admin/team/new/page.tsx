"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { prepareAvatar } from "@/lib/core/avatar";

type Department = {
  id: string;
  code: string;
  name: string;
  active: boolean;
};

type Position = {
  id: string;
  department_id: string;
  code: string;
  name: string;
  active: boolean;
};

const roles = ["Manager", "Engineer"];

export default function NewTeamMemberPage() {
  const router = useRouter();

  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Engineer",
    employeeId: "",
    departmentId: "",
    positionId: "",
  });

  const [avatarUrl, setAvatarUrl] = useState("");

  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDepartments() {
      try {
        const response = await fetch("/api/admin/departments", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) throw new Error(data?.error || "Failed to load departments.");

        setDepartments((data.departments || []).filter((item: Department) => item.active));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load departments.");
      } finally {
        setLoadingDepartments(false);
      }
    }

    void loadDepartments();
  }, []);

  useEffect(() => {
    if (!form.departmentId) {
      setPositions([]);
      setForm((current) => ({ ...current, positionId: "" }));
      return;
    }

    async function loadPositions() {
      try {
        setLoadingPositions(true);
        setError("");

        const response = await fetch(
          `/api/admin/positions?departmentId=${encodeURIComponent(form.departmentId)}`,
          { cache: "no-store" }
        );
        const data = await response.json();

        if (!response.ok) throw new Error(data?.error || "Failed to load positions.");

        const activePositions = (data.positions || []).filter((item: Position) => item.active);
        setPositions(activePositions);

        setForm((current) => {
          const stillValid = activePositions.some(
            (position: Position) => position.id === current.positionId
          );

          return {
            ...current,
            positionId: stillValid ? current.positionId : "",
          };
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load positions.");
      } finally {
        setLoadingPositions(false);
      }
    }

    void loadPositions();
  }, [form.departmentId]);

  function updateField(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleAvatarChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setError("");

      const avatar = await prepareAvatar(file);

      if (avatar.length > 2_000_000) {
        throw new Error("Processed image is too large.");
      }

      setAvatarUrl(avatar);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to process image."
      );
    } finally {
      event.target.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          role: form.role,
          employeeId: form.employeeId.trim() || undefined,
          departmentId: form.departmentId || undefined,
          positionId: form.positionId || undefined,
          avatarUrl: avatarUrl || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data?.error || "Failed to create team member.");

      router.push("/app/admin/team");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create team member.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-10">
        <div className="mb-10 border-b border-white/10 pb-8">
          <Link href="/app/admin/team" className="mb-6 inline-flex items-center text-[10px] uppercase tracking-[0.18em] text-white/35 transition hover:text-white">
            ← Back to Team
          </Link>

          <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-white/30">
            Mason & Arc OS
          </p>

          <h1 className="text-4xl font-light tracking-tight">New Team Member</h1>

          <p className="mt-3 text-sm text-white/45">
            Create a team account and assign their department, position and system permissions.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:p-8">
            <div className="mb-7">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">Personal Information</p>
              <h2 className="mt-1 text-lg font-medium">Member Details</h2>
            </div>

            <div className="mb-8">
              <label className="mb-3 block text-[10px] uppercase tracking-[0.18em] text-white/40">
                Profile Picture
              </label>

              <div className="flex items-center gap-5">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/[0.05]">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Profile preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-xl text-white/30">
                      {form.name
                        .split(" ")
                        .filter(Boolean)
                        .map((part) => part[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase() || "TM"}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap gap-2">
                    <label className="inline-flex h-10 cursor-pointer items-center rounded-full border border-white/10 px-4 text-[10px] uppercase tracking-[0.16em] text-white/60 transition hover:border-white/25 hover:text-white">
                      Upload Photo
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>

                    {avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setAvatarUrl("")}
                        className="h-10 rounded-full border border-red-400/10 px-4 text-[10px] uppercase tracking-[0.16em] text-red-300/60 transition hover:border-red-400/20 hover:text-red-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <p className="mt-2 text-[10px] text-white/25">
                    JPG, PNG or WebP · Max 5MB. The image is resized before upload.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field label="Full Name" required value={form.name} onChange={(value) => updateField("name", value)} placeholder="e.g. Ahmed Mohamed" />
              <Field label="Email" type="email" required value={form.email} onChange={(value) => updateField("email", value)} placeholder="name@masonandarc.com" />
              <Field label="Employee ID" value={form.employeeId} onChange={(value) => updateField("employeeId", value)} placeholder="e.g. MA-002" />

              <SelectField
                label="Department"
                required
                value={form.departmentId}
                disabled={loadingDepartments}
                onChange={(value) => {
                  setForm((current) => ({ ...current, departmentId: value, positionId: "" }));
                }}
                options={departments.map((department) => ({ value: department.id, label: department.name }))}
                placeholder={loadingDepartments ? "Loading departments..." : "Select department"}
              />

              <SelectField
                label="Position"
                required
                value={form.positionId}
                disabled={!form.departmentId || loadingPositions}
                onChange={(value) => updateField("positionId", value)}
                options={positions.map((position) => ({ value: position.id, label: position.name }))}
                placeholder={
                  !form.departmentId
                    ? "Select department first"
                    : loadingPositions
                      ? "Loading positions..."
                      : "Select position"
                }
              />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 lg:p-8">
            <div className="mb-7">
              <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">Access</p>
              <h2 className="mt-1 text-lg font-medium">Account & Permissions</h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <SelectField
                label="System Role"
                required
                value={form.role}
                onChange={(value) => updateField("role", value)}
                options={roles.map((role) => ({ value: role, label: role }))}
              />

              <Field label="Temporary Password" type="password" required value={form.password} onChange={(value) => updateField("password", value)} placeholder="Minimum 8 characters" />
            </div>

            <p className="mt-5 text-xs leading-5 text-white/30">
              System Role controls permissions inside Mason & Arc OS. Position is the person's actual office job.
            </p>
          </section>

          {error && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link href="/app/admin/team" className="inline-flex h-12 items-center justify-center rounded-full border border-white/10 px-6 text-[10px] uppercase tracking-[0.18em] text-white/50 transition hover:border-white/25 hover:text-white">
              Cancel
            </Link>

            <button type="submit" disabled={saving || loadingDepartments || !form.departmentId || !form.positionId} className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-[10px] font-medium uppercase tracking-[0.18em] text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50">
              {saving ? "Creating..." : "Create Team Member"}
              {!saving && <span className="ml-3 text-base">→</span>}
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
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-white/40">
        {label}{required && <span className="ml-1 text-white/60">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 w-full rounded-xl border border-white/10 bg-black px-4 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-white/30"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-white/40">
        {label}{required && <span className="ml-1 text-white/60">*</span>}
      </label>
      <select
        required={required}
        disabled={disabled}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-xl border border-white/10 bg-black px-4 text-sm text-white outline-none transition focus:border-white/30 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );
}
