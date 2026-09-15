"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  getClients,
  Client,
} from "@/lib/core/clientStore";

import {
  getProjectsByClient,
} from "@/lib/core/projectStore";

export default function ClientsPage() {
  const [clients, setClients] =
    useState<Client[]>([]);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<"All" | "Active" | "Inactive">(
      "All"
    );

  /* -------------------------------- */
  /* LOAD CLIENTS */
  /* -------------------------------- */

  useEffect(() => {
    setClients(getClients());
  }, []);

  /* -------------------------------- */
  /* CLIENT DATA */
  /* -------------------------------- */

  const clientRows = useMemo(() => {
    return clients.map((client) => {
      const projects =
        getProjectsByClient(client.id);

      return {
        client,
        projects: projects.length,
        active: projects.filter(
          (project) =>
            project.status === "Active"
        ).length,
      };
    });
  }, [clients]);

  /* -------------------------------- */
  /* FILTER */
  /* -------------------------------- */

  const filteredClients = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return clientRows.filter(
      ({ client }) => {
        const matchesSearch =
          !query ||
          client.name
            .toLowerCase()
            .includes(query) ||
          client.email
            .toLowerCase()
            .includes(query) ||
          client.code
            .toLowerCase()
            .includes(query) ||
          (client.company ?? "")
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          statusFilter === "All" ||
          client.status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    clientRows,
    search,
    statusFilter,
  ]);

  /* -------------------------------- */
  /* STATS */
  /* -------------------------------- */

  const totalClients =
    clients.length;

  const activeClients =
    clients.filter(
      (client) =>
        client.status === "Active"
    ).length;

  const totalProjects =
    clientRows.reduce(
      (total, item) =>
        total + item.projects,
      0
    );

  return (
    <main className="min-h-screen bg-[#111111] text-white">

      {/* HEADER */}

      <header className="border-b border-white/10 px-6 py-6 md:px-10">

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <Link href="/app/admin">

            <img
              src="/images/logo-mason-arc.png"
              alt="Mason & Arc"
              className="h-8 w-auto object-contain"
            />

          </Link>

          <Link
            href="/app/admin"
            className="text-xs uppercase tracking-[0.18em] text-white/40 transition hover:text-white"
          >
            ← Dashboard
          </Link>

        </div>

      </header>

      {/* MAIN */}

      <section className="px-6 pb-32 pt-16 md:px-10 md:pt-24">

        <div className="mx-auto max-w-7xl">

          {/* TITLE */}

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
                Administration
              </p>

              <h1 className="mt-5 text-5xl font-light tracking-[-0.055em] md:text-7xl">
                Clients
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-6 text-white/40">
                Manage your clients and their
                project relationships from one place.
              </p>

            </div>

            {/* ADD CLIENT */}

            <Link
              href="/app/admin/clients/new"
              className="group inline-flex w-fit items-center gap-3 rounded-full bg-white px-6 py-3 text-[10px] uppercase tracking-[0.18em] text-black transition duration-300 hover:bg-white/80"
            >

              <span className="text-base leading-none">
                +
              </span>

              <span>
                Add Client
              </span>

            </Link>

          </div>

          {/* SEARCH / FILTER */}

          <div className="mt-16 flex flex-col gap-4 md:flex-row">

            <div className="flex h-14 flex-1 items-center rounded-xl border border-white/10 bg-white/[0.03] px-5">

              <span className="mr-3 text-white/25">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search clients..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/20"
              />

            </div>

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    | "All"
                    | "Active"
                    | "Inactive"
                )
              }
              className="h-14 rounded-xl border border-white/10 bg-[#111111] px-6 text-[10px] uppercase tracking-[0.18em] text-white/50 outline-none transition hover:border-white/25 hover:text-white"
            >

              <option value="All">
                All Clients
              </option>

              <option value="Active">
                Active Clients
              </option>

              <option value="Inactive">
                Inactive Clients
              </option>

            </select>

          </div>

          {/* RESULTS */}

          <div className="mt-5 flex items-center justify-between">

            <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
              {filteredClients.length}{" "}
              {filteredClients.length === 1
                ? "Client"
                : "Clients"}
            </p>

            {search && (
              <button
                type="button"
                onClick={() =>
                  setSearch("")
                }
                className="text-[10px] uppercase tracking-[0.15em] text-white/30 transition hover:text-white"
              >
                Clear Search
              </button>
            )}

          </div>

          {/* CLIENTS TABLE */}

          <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">

            {/* DESKTOP HEADER */}

            <div className="hidden border-b border-white/10 px-7 py-4 md:grid md:grid-cols-[70px_1.5fr_1.4fr_100px_100px_120px_30px]">

              <TableLabel>
                No.
              </TableLabel>

              <TableLabel>
                Client
              </TableLabel>

              <TableLabel>
                Email
              </TableLabel>

              <TableLabel>
                Projects
              </TableLabel>

              <TableLabel>
                Active
              </TableLabel>

              <TableLabel>
                Status
              </TableLabel>

              <span />

            </div>

            {/* EMPTY */}

            {filteredClients.length === 0 ? (

              <div className="px-6 py-20 text-center">

                <p className="text-lg font-light">
                  No clients found
                </p>

                <p className="mt-3 text-sm text-white/30">
                  {clients.length === 0
                    ? "Add your first client to start building your client database."
                    : "Try another search or filter."}
                </p>

                {clients.length === 0 && (
                  <Link
                    href="/app/admin/clients/new"
                    className="mt-7 inline-flex rounded-full bg-white px-5 py-3 text-xs font-medium text-black"
                  >
                    Add Client
                  </Link>
                )}

              </div>

            ) : (

              /* CLIENT ROWS */

              filteredClients.map(
                ({
                  client,
                  projects,
                  active,
                }) => (

                  <Link
                    href={`/app/admin/clients/${client.id}`}
                    key={client.id}
                    className="group block border-b border-white/10 p-6 transition last:border-b-0 hover:bg-white/[0.035] md:px-7 md:py-7"
                  >

                    {/* DESKTOP */}

                    <div className="hidden md:grid md:grid-cols-[70px_1.5fr_1.4fr_100px_100px_120px_30px] md:items-center">

                      <span className="text-[10px] text-white/20">
                        {client.code}
                      </span>

                      <div>

                        <p className="text-sm font-light text-white/90">
                          {client.name}
                        </p>

                        {client.company && (
                          <p className="mt-1 text-[10px] text-white/25">
                            {client.company}
                          </p>
                        )}

                      </div>

                      <span className="text-xs text-white/40">
                        {client.email || "—"}
                      </span>

                      <span className="text-xs text-white/50">
                        {projects}
                      </span>

                      <span className="text-xs text-white/50">
                        {active}
                      </span>

                      <span className="w-fit rounded-full border border-white/10 px-3 py-1 text-[9px] uppercase tracking-[0.12em] text-white/40">
                        {client.status}
                      </span>

                      <span className="text-white/25 transition group-hover:translate-x-1 group-hover:text-white">
                        →
                      </span>

                    </div>

                    {/* MOBILE */}

                    <div className="md:hidden">

                      <div className="flex items-start justify-between">

                        <div>

                          <span className="text-[10px] text-white/20">
                            {client.code}
                          </span>

                          <h2 className="mt-3 text-xl font-light">
                            {client.name}
                          </h2>

                          {client.company && (
                            <p className="mt-1 text-xs text-white/25">
                              {client.company}
                            </p>
                          )}

                        </div>

                        <span className="text-white/25">
                          →
                        </span>

                      </div>

                      <p className="mt-3 text-xs text-white/35">
                        {client.email || "No email"}
                      </p>

                      <div className="mt-6 flex items-center gap-6">

                        <MobileStat
                          label="Projects"
                          value={projects}
                        />

                        <MobileStat
                          label="Active"
                          value={active}
                        />

                        <div>

                          <p className="text-[9px] uppercase tracking-[0.15em] text-white/25">
                            Status
                          </p>

                          <p className="mt-2 text-sm text-white/70">
                            {client.status}
                          </p>

                        </div>

                      </div>

                    </div>

                  </Link>

                )
              )

            )}

          </div>

          {/* BOTTOM STATS */}

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-3">

            <StatCard
              label="Total Clients"
              value={totalClients}
            />

            <StatCard
              label="Active Clients"
              value={activeClients}
            />

            <StatCard
              label="Total Projects"
              value={totalProjects}
            />

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer className="border-t border-white/10 px-6 py-8 md:px-10">

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <span className="text-[9px] uppercase tracking-[0.25em] text-white/20">
            Mason & Arc
          </span>

          <span className="text-[9px] uppercase tracking-[0.25em] text-white/20">
            Client Management
          </span>

        </div>

      </footer>

    </main>
  );
}

/* -------------------------------- */
/* TABLE LABEL */
/* -------------------------------- */

function TableLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <span className="text-[9px] uppercase tracking-[0.18em] text-white/25">
      {children}
    </span>
  );
}

/* -------------------------------- */
/* MOBILE STAT */
/* -------------------------------- */

function MobileStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div>

      <p className="text-[9px] uppercase tracking-[0.15em] text-white/25">
        {label}
      </p>

      <p className="mt-2 text-sm text-white/70">
        {value}
      </p>

    </div>
  );
}

/* -------------------------------- */
/* BOTTOM STAT */
/* -------------------------------- */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="bg-[#111111] p-6">

      <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
        {label}
      </p>

      <p className="mt-4 text-3xl font-light">
        {value}
      </p>

    </div>
  );
}