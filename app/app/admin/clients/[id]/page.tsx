"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Mail,
  MapPin,
  Phone,
  Pencil,
  Plus,
} from "lucide-react";

import {
  getClientById,
  Client,
} from "@/lib/core/clientStore";

import {
  getProjectsByClient,
  Project,
} from "@/lib/core/projectStore";

export default function ClientDetailsPage() {
  const params = useParams();
  const clientId = String(params.id);

  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const foundClient = getClientById(clientId);

    setClient(foundClient);

    if (foundClient) {
      setProjects(getProjectsByClient(foundClient.id));
    } else {
      setProjects([]);
    }
  }, [clientId]);

  const activeProjects = useMemo(
    () =>
      projects.filter(
        (project) => project.status === "Active"
      ),
    [projects]
  );

  const completedProjects = useMemo(
    () =>
      projects.filter(
        (project) => project.status === "Completed"
      ),
    [projects]
  );

  if (!client) {
    return (
      <main className="min-h-screen bg-[#111111] text-white">
        <div className="mx-auto max-w-5xl px-6 py-24 text-center">

          <p className="text-xs uppercase tracking-[0.25em] text-white/25">
            Client Management
          </p>

          <h1 className="mt-5 text-4xl font-light">
            Client not found
          </h1>

          <Link
            href="/app/admin/clients"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-black"
          >
            <ArrowLeft size={16} />
            Back to Clients
          </Link>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white">

      <section className="px-6 pb-32 pt-10 md:px-10 md:pt-16">

        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>

              <Link
                href="/app/admin/clients"
                className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/35 transition hover:text-white"
              >
                <ArrowLeft size={15} />
                Clients
              </Link>

              <p className="text-[10px] uppercase tracking-[0.25em] text-white/25">
                Client Profile
              </p>

              <h1 className="mt-4 text-5xl font-light tracking-[-0.05em] md:text-7xl">
                {client.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-white/40">

                <span>
                  {client.code}
                </span>

                <span className="text-white/15">
                  •
                </span>

                <span>
                  {client.status}
                </span>

                {client.company && (
                  <>
                    <span className="text-white/15">
                      •
                    </span>

                    <span>
                      {client.company}
                    </span>
                  </>
                )}

              </div>

            </div>

            <Link
              href={`/app/admin/clients/${client.id}/edit`}
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-xs uppercase tracking-[0.15em] text-white/55 transition hover:border-white/25 hover:text-white"
            >
              <Pencil size={14} />
              Edit Client
            </Link>

          </div>

          {/* CLIENT INFORMATION */}

          <div className="mt-14 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <InfoCard
              icon={<Mail size={17} />}
              label="Email"
              value={client.email || "—"}
            />

            <InfoCard
              icon={<Phone size={17} />}
              label="Phone"
              value={client.phone || "—"}
            />

            <InfoCard
              icon={<MapPin size={17} />}
              label="Address"
              value={client.address || "—"}
            />

            <InfoCard
              icon={<BriefcaseBusiness size={17} />}
              label="Projects"
              value={String(projects.length)}
            />

          </div>

          {/* PROJECT SUMMARY */}

          <div className="mt-14 grid gap-4 md:grid-cols-3">

            <Metric
              label="Total Projects"
              value={projects.length}
            />

            <Metric
              label="Active Projects"
              value={activeProjects.length}
            />

            <Metric
              label="Completed Projects"
              value={completedProjects.length}
            />

          </div>

          {/* PROJECTS */}

          <section className="mt-16">

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

              <div>

                <p className="text-[10px] uppercase tracking-[0.25em] text-white/25">
                  Client Portfolio
                </p>

                <h2 className="mt-3 text-3xl font-light">
                  Projects
                </h2>

                <p className="mt-2 text-sm text-white/35">
                  Every project linked to this client appears here automatically.
                </p>

              </div>

              <Link
                href="/app/admin/projects/new"
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-medium text-black transition hover:bg-white/90"
              >
                <Plus size={15} />
                New Project
              </Link>

            </div>

            {projects.length === 0 ? (

              <div className="mt-8 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">

                <BriefcaseBusiness
                  size={22}
                  className="mx-auto text-white/20"
                />

                <h3 className="mt-5 text-lg font-medium">
                  No projects linked
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/35">
                  Assign this client from a project&apos;s Edit page to build the relationship.
                </p>

                <Link
                  href="/app/admin/projects"
                  className="mt-7 inline-flex rounded-full border border-white/10 px-5 py-3 text-xs text-white/55 transition hover:border-white/25 hover:text-white"
                >
                  View Projects
                </Link>

              </div>

            ) : (

              <div className="mt-8 overflow-hidden rounded-3xl border border-white/10">

                {/* TABLE HEADER */}

                <div className="hidden grid-cols-[1.6fr_1fr_1fr_120px_40px] border-b border-white/10 px-7 py-4 md:grid">

                  <span className="table-label">
                    Project
                  </span>

                  <span className="table-label">
                    Type
                  </span>

                  <span className="table-label">
                    Phase
                  </span>

                  <span className="table-label">
                    Status
                  </span>

                  <span />

                </div>

                {/* PROJECT ROWS */}

                {projects.map((project) => (

                  <Link
                    key={project.id}
                    href={`/app/admin/projects/${project.id}`}
                    className="group grid gap-4 border-b border-white/10 px-6 py-6 transition last:border-b-0 hover:bg-white/[0.035] md:grid-cols-[1.6fr_1fr_1fr_120px_40px] md:items-center md:px-7"
                  >

                    {/* PROJECT */}

                    <div>

                      <div className="flex items-center gap-3">

                        <span className="text-[10px] text-white/20">
                          {project.code}
                        </span>

                        <h3 className="text-base font-medium">
                          {project.name}
                        </h3>

                      </div>

                      <p className="mt-2 text-xs text-white/30">
                        {project.location}
                      </p>

                    </div>

                    {/* TYPE */}

                    <div>

                      <p className="text-[10px] uppercase tracking-[0.15em] text-white/25 md:hidden">
                        Type
                      </p>

                      <p className="mt-1 text-sm text-white/55 md:mt-0">
                        {project.type}
                      </p>

                    </div>

                    {/* PHASE */}

                    <div>

                      <p className="text-[10px] uppercase tracking-[0.15em] text-white/25 md:hidden">
                        Phase
                      </p>

                      <p className="mt-1 text-sm text-white/55 md:mt-0">
                        {project.phase}
                      </p>

                    </div>

                    {/* STATUS */}

                    <div>

                      <p className="text-[10px] uppercase tracking-[0.15em] text-white/25 md:hidden">
                        Status
                      </p>

                      <span className="mt-1 inline-flex rounded-full border border-white/10 px-3 py-1.5 text-[9px] uppercase tracking-[0.12em] text-white/50 md:mt-0">
                        {project.status}
                      </span>

                    </div>

                    {/* ARROW */}

                    <span className="text-lg text-white/20 transition group-hover:translate-x-1 group-hover:text-white">
                      →
                    </span>

                  </Link>

                ))}

              </div>

            )}

          </section>

          {/* NOTES */}

          {client.notes && (

            <section className="mt-14 rounded-3xl border border-white/10 bg-white/[0.02] p-7 md:p-8">

              <p className="text-[10px] uppercase tracking-[0.22em] text-white/25">
                Client Notes
              </p>

              <p className="mt-4 max-w-4xl text-sm leading-7 text-white/50">
                {client.notes}
              </p>

            </section>

          )}

        </div>

      </section>

      <style jsx>{`
        .table-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: rgba(255,255,255,0.25);
        }
      `}</style>

    </main>
  );
}

/* -------------------------------- */
/* INFO CARD */
/* -------------------------------- */

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

      <div className="flex items-center gap-3 text-white/30">

        {icon}

        <span className="text-[9px] uppercase tracking-[0.18em]">
          {label}
        </span>

      </div>

      <p className="mt-5 truncate text-sm text-white/65">
        {value}
      </p>

    </div>
  );
}

/* -------------------------------- */
/* METRIC */
/* -------------------------------- */

function Metric({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

      <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
        {label}
      </p>

      <p className="mt-4 text-3xl font-light">
        {value}
      </p>

    </div>
  );
}