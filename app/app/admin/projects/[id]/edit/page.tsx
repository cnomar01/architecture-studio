"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  ArrowLeft,
  Save,
  Trash2,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import {
  getProjectById,
  updateProject,
  deleteProject,
  Project,
  ProjectPhase,
  ProjectStatus,
} from "@/lib/core/projectStore";

import {
  getClients,
  Client,
} from "@/lib/core/clientStore";

import {
  getTeam,
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

const statuses: ProjectStatus[] = [
  "Active",
  "On Hold",
  "Completed",
];

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();

  const projectId = String(params.id);

  const [project, setProject] =
    useState<Project | null>(null);

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState("");
  const [location, setLocation] =
    useState("");
  const [description, setDescription] =
    useState("");

  const [phase, setPhase] =
    useState<ProjectPhase>(
      "Concept Design"
    );

  const [status, setStatus] =
    useState<ProjectStatus>("Active");

  const [clientId, setClientId] =
    useState("");

  const [clientName, setClientName] =
    useState("");

  const [clients, setClients] =
    useState<Client[]>([]);

  const [team, setTeam] =
    useState<TeamMember[]>([]);

  const [teamMemberIds, setTeamMemberIds] =
    useState<string[]>([]);

  const [projectManagerName, setProjectManagerName] =
    useState("");

  const [startDate, setStartDate] =
    useState("");

  const [targetDate, setTargetDate] =
    useState("");

  const [error, setError] =
    useState("");

  const [showDelete, setShowDelete] =
    useState(false);

  /* -------------------------------- */
  /* LOAD PROJECT */
  /* -------------------------------- */

  useEffect(() => {
    setClients(getClients());

    getTeam().then(setTeam).catch(() => setTeam([]));

    const found =
      getProjectById(projectId);

    if (!found) {
      return;
    }

    setProject(found);

    setName(found.name);
    setCode(found.code);
    setType(found.type);
    setLocation(found.location);
    setDescription(found.description);

    setPhase(found.phase);
    setStatus(found.status);

    setClientId(found.clientId ?? "");

    setClientName(
      found.clientName ?? ""
    );

    setProjectManagerName(
      found.projectManagerName ?? ""
    );

    setTeamMemberIds(
      found.teamMemberIds ?? []
    );

    setStartDate(found.startDate);
    setTargetDate(found.targetDate);
  }, [projectId]);

  /* -------------------------------- */
  /* SAVE */
  /* -------------------------------- */

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!name.trim()) {
      setError(
        "Project name is required."
      );
      return;
    }

    if (!code.trim()) {
      setError(
        "Project code is required."
      );
      return;
    }

    if (!type.trim()) {
      setError(
        "Project type is required."
      );
      return;
    }

    if (!location.trim()) {
      setError(
        "Project location is required."
      );
      return;
    }

    updateProject(projectId, {
      name: name.trim(),
      code: code.trim(),
      type: type.trim(),
      location: location.trim(),
      description: description.trim(),

      phase,
      status,

      clientId: clientId || "",
      clientName: clientName.trim(),

      projectManagerName:
        projectManagerName.trim(),

      teamMemberIds,

      startDate,
      targetDate,
    });

    router.push(
      `/app/admin/projects/${projectId}`
    );
  }

  /* -------------------------------- */
  /* DELETE */
  /* -------------------------------- */

  function handleDelete() {
    deleteProject(projectId);

    router.push(
      "/app/admin/projects"
    );
  }

  /* -------------------------------- */
  /* NOT FOUND */
  /* -------------------------------- */

  if (!project) {
    return (
      <main className="min-h-screen bg-[#080808] text-white">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center">

          <p className="text-sm text-white/40">
            Project not found.
          </p>

          <Link
            href="/app/admin/projects"
            className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
          >
            Back to Projects
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      <div className="mx-auto max-w-[1100px] px-6 py-8 lg:px-10">

        {/* HEADER */}

        <div className="mb-10">

          <Link
            href={`/app/admin/projects/${projectId}`}
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Project
          </Link>

          <p className="mb-2 text-xs uppercase tracking-[0.28em] text-white/30">
            Project Management
          </p>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <h1 className="text-4xl font-semibold tracking-tight">
                Edit Project
              </h1>

              <p className="mt-3 text-sm text-white/40">
                Update project information,
                phase, status and management data.
              </p>

            </div>

            <span className="rounded-full border border-white/10 px-4 py-2 text-xs text-white/45">
              {project.code}
            </span>

          </div>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.025]"
        >

          {/* BASIC INFORMATION */}

          <section className="border-b border-white/10 p-6 md:p-8">

            <SectionTitle
              eyebrow="01"
              title="Project Information"
              description="Core project identity and location."
            />

            <div className="mt-7 grid gap-6 md:grid-cols-2">

              <Field
                label="Project Name"
                required
              >
                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="input"
                />
              </Field>

              <Field
                label="Project Code"
                required
              >
                <input
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value)
                  }
                  className="input"
                />
              </Field>

              <Field
                label="Project Type"
                required
              >
                <input
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value)
                  }
                  className="input"
                />
              </Field>

              <Field
                label="Location"
                required
              >
                <input
                  value={location}
                  onChange={(e) =>
                    setLocation(e.target.value)
                  }
                  className="input"
                />
              </Field>

              <div className="md:col-span-2">

                <Field label="Description">

                  <textarea
                    value={description}
                    onChange={(e) =>
                      setDescription(
                        e.target.value
                      )
                    }
                    rows={5}
                    className="input resize-none"
                  />

                </Field>

              </div>

            </div>

          </section>

          {/* PROJECT STATUS */}

          <section className="border-b border-white/10 p-6 md:p-8">

            <SectionTitle
              eyebrow="02"
              title="Project Status"
              description="Control the current project phase and operational status."
            />

            <div className="mt-7 grid gap-6 md:grid-cols-2">

              <Field
                label="Current Phase"
                required
              >

                <select
                  value={phase}
                  onChange={(e) =>
                    setPhase(
                      e.target
                        .value as ProjectPhase
                    )
                  }
                  className="input"
                >

                  {phases.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}

                </select>

              </Field>

              <Field
                label="Project Status"
                required
              >

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target
                        .value as ProjectStatus
                    )
                  }
                  className="input"
                >

                  {statuses.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}

                </select>

              </Field>

            </div>

          </section>

          {/* MANAGEMENT */}

          <section className="border-b border-white/10 p-6 md:p-8">

            <SectionTitle
              eyebrow="03"
              title="Management"
              description="Client and project leadership information."
            />

            <div className="mt-7 grid gap-6 md:grid-cols-2">

              <Field label="Client">

                <select
                  value={clientId}
                  onChange={(e) => {
                    const selected = clients.find(
                      (client) => client.id === e.target.value
                    );

                    setClientId(selected?.id ?? "");
                    setClientName(selected?.name ?? "");
                  }}
                  className="input"
                >
                  <option value="">
                    No Client Assigned
                  </option>

                  {clients.map((client) => (
                    <option
                      key={client.id}
                      value={client.id}
                    >
                      {client.name}
                      {client.company
                        ? ` — ${client.company}`
                        : ""}
                    </option>
                  ))}
                </select>

                {clientId && (
                  <p className="mt-2 text-xs text-white/25">
                    Linked client: {clientName}
                  </p>
                )}

                {!clients.length && (
                  <p className="mt-2 text-xs text-white/25">
                    No clients found. Add a client first.
                  </p>
                )}

              </Field>

              <Field label="Project Manager">

                <input
                  value={projectManagerName}
                  onChange={(e) =>
                    setProjectManagerName(
                      e.target.value
                    )
                  }
                  placeholder="Project manager"
                  className="input"
                />

              </Field>

            </div>

          </section>

          {/* PROJECT TEAM */}

          <section className="border-b border-white/10 p-6 md:p-8">
            <SectionTitle
              eyebrow="04"
              title="Project Team"
              description="Assign Mason & Arc team members to this project workspace."
            />

            <div className="mt-7">
              {team.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-white/35">
                  No active team members are available yet.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {team.map((member) => {
                    const selected = teamMemberIds.includes(member.id);

                    return (
                      <label
                        key={member.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                          selected
                            ? "border-white/25 bg-white/[0.07]"
                            : "border-white/10 bg-white/[0.02] hover:border-white/20"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={(event) => {
                            setTeamMemberIds((current) =>
                              event.target.checked
                                ? [...current, member.id]
                                : current.filter((id) => id !== member.id)
                            );
                          }}
                          className="h-4 w-4"
                        />

                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt=""
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-xs text-white/55">
                            {member.initials}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white/80">
                            {member.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-white/35">
                            {member.position || member.role}
                          </p>
                          {member.department && (
                            <p className="mt-0.5 truncate text-[10px] uppercase tracking-wider text-white/20">
                              {member.department}
                            </p>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* DATES */}

          <section className="border-b border-white/10 p-6 md:p-8">

            <SectionTitle
              eyebrow="04"
              title="Timeline"
              description="Project start and target completion dates."
            />

            <div className="mt-7 grid gap-6 md:grid-cols-2">

              <Field label="Start Date">

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(
                      e.target.value
                    )
                  }
                  className="input"
                />

              </Field>

              <Field label="Target Date">

                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) =>
                    setTargetDate(
                      e.target.value
                    )
                  }
                  className="input"
                />

              </Field>

            </div>

          </section>

          {/* ERROR */}

          {error && (
            <div className="border-b border-white/10 p-6 md:p-8">

              <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
                {error}
              </div>

            </div>
          )}

          {/* ACTIONS */}

          <div className="flex flex-col-reverse gap-3 p-6 md:flex-row md:items-center md:justify-between md:p-8">

            <button
              type="button"
              onClick={() =>
                setShowDelete(true)
              }
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm text-white/45 transition hover:border-white/20 hover:text-white"
            >
              <Trash2 size={16} />
              Delete Project
            </button>

            <div className="flex flex-col gap-3 md:flex-row">

              <Link
                href={`/app/admin/projects/${projectId}`}
                className="inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm text-white/50 transition hover:bg-white/[0.04] hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
              >
                <Save size={16} />
                Save Changes
              </button>

            </div>

          </div>

        </form>

      </div>

      {/* DELETE CONFIRMATION */}

      {showDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm">

          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#111] p-7 shadow-2xl">

            <p className="text-xs uppercase tracking-[0.2em] text-white/30">
              Danger Zone
            </p>

            <h2 className="mt-3 text-2xl font-semibold">
              Delete this project?
            </h2>

            <p className="mt-3 text-sm leading-6 text-white/40">
              This will remove the project from the
              current local project store. This action
              cannot be undone from the interface.
            </p>

            <div className="mt-7 flex flex-col gap-3 md:flex-row md:justify-end">

              <button
                type="button"
                onClick={() =>
                  setShowDelete(false)
                }
                className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/60"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
              >
                Delete Project
              </button>

            </div>

          </div>

        </div>
      )}

      <style jsx>{`
        .input {
          width: 100%;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.10);
          background: rgba(255,255,255,0.035);
          padding: 12px 14px;
          color: white;
          outline: none;
          font-size: 14px;
        }

        .input:focus {
          border-color: rgba(255,255,255,0.30);
          background: rgba(255,255,255,0.05);
        }

        .input::placeholder {
          color: rgba(255,255,255,0.25);
        }

        select.input option {
          background: #111111;
          color: white;
        }
      `}</style>

    </main>
  );
}

/* -------------------------------- */
/* COMPONENTS */
/* -------------------------------- */

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">

        <span className="text-xs text-white/20">
          {eyebrow}
        </span>

        <h2 className="text-lg font-medium">
          {title}
        </h2>

      </div>

      <p className="mt-2 text-sm text-white/35">
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs uppercase tracking-[0.16em] text-white/35">
        {label}

        {required && (
          <span className="ml-1 text-white/50">
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}