"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  position?: string;
  employeeId?: string;
  avatarUrl?: string;
  active: boolean;
};

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTeam() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/team", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to load team.");
      }

      setMembers(data.users || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load team."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadTeam();
  }, []);

  async function toggleMember(member: TeamMember) {
    try {
      const response = await fetch("/api/admin/team", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: member.id,
          active: !member.active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to update member.");
      }

      await loadTeam();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to update member."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="mx-auto max-w-[1200px] px-6 py-10 lg:px-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.28em] text-white/35">
              Mason & Arc OS
            </p>

            <h1 className="text-4xl font-light tracking-tight">
              Team
            </h1>

            <p className="mt-3 max-w-xl text-sm text-white/45">
              Manage your studio team, roles, departments and access.
            </p>
          </div>

          <Link
            href="/app/admin/team/new"
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-[11px] font-medium uppercase tracking-[0.18em] text-black transition hover:bg-white/90"
          >
            New Team Member
            <span className="ml-3 text-base">→</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Stat
            label="Total Members"
            value={members.length}
          />

          <Stat
            label="Active"
            value={members.filter((member) => member.active).length}
          />

          <Stat
            label="Inactive"
            value={members.filter((member) => !member.active).length}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Team list */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/10 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
                  People
                </p>

                <h2 className="mt-1 text-lg font-medium">
                  Studio Team
                </h2>
              </div>

              <button
                onClick={() => void loadTeam()}
                className="rounded-full border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-white/55 transition hover:border-white/25 hover:text-white"
              >
                Refresh
              </button>
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-16 text-center text-sm text-white/35">
              Loading team...
            </div>
          ) : members.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm text-white/45">
                No team members yet.
              </p>

              <Link
                href="/app/admin/team/new"
                className="mt-5 inline-flex rounded-full border border-white/15 px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-white/70 hover:border-white/30 hover:text-white"
              >
                Add First Member
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {members.map((member) => {
                const initials =
                  member.name
                    .split(" ")
                    .filter(Boolean)
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase() || "TM";

                return (
                  <div
                    key={member.id}
                    className="flex flex-col gap-5 px-6 py-6 transition hover:bg-white/[0.025] lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {/* Profile Picture */}
                      {member.avatarUrl ? (
                        <img
                          src={member.avatarUrl}
                          alt={member.name}
                          className="h-12 w-12 shrink-0 rounded-full object-cover ring-1 ring-white/10"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-sm font-medium text-black">
                          {initials}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="font-medium">
                            {member.name}
                          </h3>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[9px] uppercase tracking-[0.15em] ${
                              member.active
                                ? "border-emerald-400/20 text-emerald-300"
                                : "border-white/10 text-white/35"
                            }`}
                          >
                            {member.active ? "Active" : "Inactive"}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-white/40">
                          {member.email}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {/* System Permission Role */}
                          {member.role && (
                            <Tag>{member.role}</Tag>
                          )}

                          {/* Department */}
                          {member.department && (
                            <Tag>{member.department}</Tag>
                          )}

                          {/* Position */}
                          {member.position && (
                            <Tag>{member.position}</Tag>
                          )}

                          {/* Employee ID */}
                          {member.employeeId && (
                            <Tag>{member.employeeId}</Tag>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 lg:justify-end">
                      <Link
                        href={`/app/admin/team/${member.id}`}
                        className="rounded-full border border-white/10 px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-white/55 transition hover:border-white/25 hover:text-white"
                      >
                        View
                      </Link>

                      <Link
                        href={`/app/admin/team/${member.id}/edit`}
                        className="rounded-full border border-white/10 px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-white/55 transition hover:border-white/25 hover:text-white"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => void toggleMember(member)}
                        className="rounded-full border border-white/10 px-4 py-2.5 text-[10px] uppercase tracking-[0.16em] text-white/45 transition hover:border-white/25 hover:text-white"
                      >
                        {member.active
                          ? "Deactivate"
                          : "Activate"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">
        {label}
      </p>

      <p className="mt-4 text-3xl font-light">
        {value}
      </p>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-white/10 px-2.5 py-1 text-[9px] uppercase tracking-[0.14em] text-white/40">
      {children}
    </span>
  );
}