"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  UserRound,
} from "lucide-react";

import {
  addProject,
  ProjectPhase,
} from "@/lib/core/projectStore";

import {
  getClients,
  Client,
} from "@/lib/core/clientStore";

import {
  getActiveTeam,
  TeamMember,
} from "@/lib/core/teamStore";

const phases: ProjectPhase[] = [
  "Concept Design",
  "Design Development",
  "Technical Design",
  "Tender",
  "Construction",
  "Handover",
];

export default function NewProjectPage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");

  const [phase, setPhase] =
    useState<ProjectPhase>("Concept Design");

  const [description, setDescription] = useState("");

  // CLIENT
  const [clients, setClients] = useState<Client[]>([]);
  const [clientId, setClientId] = useState("");

  // PROJECT MANAGER
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [managerId, setManagerId] = useState("");

  const [startDate, setStartDate] = useState("");
  const [targetDate, setTargetDate] = useState("");

  const [error, setError] = useState("");

  useEffect(() => {
    setClients(getClients());
    setTeam(getActiveTeam());
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Project name is required.");
      return;
    }

    if (!code.trim()) {
      setError("Project code is required.");
      return;
    }

    if (!type.trim()) {
      setError("Project type is required.");
      return;
    }

    if (!location.trim()) {
      setError("Project location is required.");
      return;
    }

    const selectedClient = clients.find(
      (client) => client.id === clientId
    );

    const selectedManager = team.find(
      (member) => member.id === managerId
    );

    try {
      addProject({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        type: type.trim(),
        location: location.trim(),
        status: "Active",
        phase,
        description: description.trim(),

        clientId: selectedClient?.id ?? "",
        clientName: selectedClient?.name ?? "",

        projectManagerId: selectedManager?.id ?? "",
        projectManagerName: selectedManager?.name ?? "",

        startDate,
        targetDate,
      });

      window.location.href = "/app/admin/projects";
    } catch {
      setError(
        "Unable to create project. Please try again."
      );
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <main className="mx-auto max-w-[1000px] px-5 py-7 md:px-8 lg:px-10">

        {/* HEADER */}
        <div className="mb-8 border-b border-white/10 pb-7">

          <Link
            href="/app/admin/projects"
            className="mb-6 inline-flex items-center gap-2 text-xs text-white/40 transition hover:text-white"
          >
            <ArrowLeft size={14} />
            Back to Projects
          </Link>

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
              <Building2
                size={19}
                className="text-white/50"
              />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                Studio Management
              </p>

              <h1 className="mt-1 text-3xl font-medium tracking-tight">
                New Project
              </h1>

              <p className="mt-2 text-xs text-white/30">
                Create a project and register it in the Mason & Arc OS.
              </p>
            </div>

          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* BASIC INFORMATION */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">

            <SectionTitle
              title="Project Information"
              description="Basic identity and classification."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <Field
                label="Project Name"
                value={name}
                onChange={setName}
                placeholder="e.g. City Edge Mall"
                required
              />

              <Field
                label="Project Code"
                value={code}
                onChange={setCode}
                placeholder="e.g. CEM-002"
                required
              />

              <Field
                label="Project Type"
                value={type}
                onChange={setType}
                placeholder="e.g. Residential / Commercial"
                required
              />

              <Field
                label="Location"
                value={location}
                onChange={setLocation}
                placeholder="e.g. New Cairo"
                required
              />

            </div>

            <div className="mt-4">

              <label className="mb-2 block text-[9px] uppercase tracking-[0.18em] text-white/30">
                Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Short project description..."
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/20"
              />

            </div>

          </section>

          {/* PROJECT PHASE */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">

            <SectionTitle
              title="Project Phase"
              description="Set the current stage of the project."
            />

            <div className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">

              {phases.map((item) => {

                const selected = phase === item;

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPhase(item)}
                    className={`rounded-xl border p-4 text-left text-xs transition ${
                      selected
                        ? "border-white/20 bg-white text-black"
                        : "border-white/10 bg-black/20 text-white/45 hover:bg-white/[0.05] hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                );
              })}

            </div>

          </section>

          {/* PEOPLE */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">

            <SectionTitle
              title="Project People"
              description="Link the project to a client and assign a project manager."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              {/* CLIENT */}
              <div>

                <label className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/30">
                  <UserRound size={14} />
                  Client
                </label>

                <select
                  value={clientId}
                  onChange={(event) =>
                    setClientId(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
                >
                  <option
                    value=""
                    className="bg-[#111]"
                  >
                    No Client Assigned
                  </option>

                  {clients.map((client) => (
                    <option
                      key={client.id}
                      value={client.id}
                      className="bg-[#111]"
                    >
                      {client.name}
                      {client.company
                        ? ` — ${client.company}`
                        : ""}
                    </option>
                  ))}
                </select>

                {clients.length === 0 && (
                  <p className="mt-2 text-[10px] text-white/25">
                    No clients available. Create a client first.
                  </p>
                )}

              </div>

              {/* PROJECT MANAGER */}
              <div>

                <label className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/30">
                  <UserRound size={14} />
                  Project Manager
                </label>

                <select
                  value={managerId}
                  onChange={(event) =>
                    setManagerId(event.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
                >
                  <option
                    value=""
                    className="bg-[#111]"
                  >
                    No Manager Assigned
                  </option>

                  {team.map((member) => (
                    <option
                      key={member.id}
                      value={member.id}
                      className="bg-[#111]"
                    >
                      {member.name} — {member.role}
                    </option>
                  ))}
                </select>

                {team.length === 0 && (
                  <p className="mt-2 text-[10px] text-white/25">
                    No active team members available.
                  </p>
                )}

              </div>

            </div>

          </section>

          {/* DATES */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">

            <SectionTitle
              title="Project Timeline"
              description="Set the planned project dates."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2">

              <DateField
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
              />

              <DateField
                label="Target Completion"
                value={targetDate}
                onChange={setTargetDate}
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
              href="/app/admin/projects"
              className="flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-5 py-3 text-xs text-white/45 transition hover:bg-white/[0.06] hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="rounded-xl bg-white px-6 py-3 text-xs font-medium text-black transition hover:bg-white/90"
            >
              Create Project
            </button>

          </div>

        </form>

      </main>
    </div>
  );
}

/* -------------------------------- */
/* SECTION TITLE */
/* -------------------------------- */

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

/* -------------------------------- */
/* FIELD */
/* -------------------------------- */

function Field({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  icon,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div>

      <label className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/30">
        {icon}
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

/* -------------------------------- */
/* DATE FIELD */
/* -------------------------------- */

function DateField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>

      <label className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/30">
        <CalendarDays size={14} />
        {label}
      </label>

      <input
        type="date"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none focus:border-white/20"
      />

    </div>
  );
}