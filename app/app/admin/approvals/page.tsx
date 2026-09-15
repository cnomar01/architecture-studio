"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Plus,
  RotateCcw,
} from "lucide-react";

import {
  getApprovals,
  Approval,
} from "./approvalStore";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [filter, setFilter] = useState<
    "All" | "Pending" | "Approved" | "Changes Requested"
  >("All");

  useEffect(() => {
    setApprovals(getApprovals());
  }, []);

  const filteredApprovals = useMemo(() => {
    if (filter === "All") return approvals;

    return approvals.filter(
      (approval) => approval.status === filter
    );
  }, [approvals, filter]);

  const pending = approvals.filter(
    (approval) => approval.status === "Pending"
  ).length;

  const approved = approvals.filter(
    (approval) => approval.status === "Approved"
  ).length;

  const changesRequested = approvals.filter(
    (approval) =>
      approval.status === "Changes Requested"
  ).length;

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* HEADER */}

      <div className="border-b border-white/10 bg-black/30">

        <div className="mx-auto max-w-[1400px] px-6 py-7 lg:px-10">

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/30">
                Mason & Arc / Studio OS
              </p>

              <h1 className="text-3xl font-light tracking-tight">
                Approvals
              </h1>

              <p className="mt-2 text-sm text-white/35">
                Review project drawings, materials, renders and
                documents.
              </p>

            </div>

            <Link
              href="/app/admin/approvals/new"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-[11px] font-medium text-black hover:bg-white/90"
            >
              <Plus size={14} />
              Submit Approval
            </Link>

          </div>

        </div>

      </div>


      <main className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">

        {/* STATS */}

        <div className="grid gap-3 md:grid-cols-3">

          <StatCard
            label="Pending Review"
            value={pending}
            icon={<Clock3 size={15} />}
          />

          <StatCard
            label="Approved"
            value={approved}
            icon={<CheckCircle2 size={15} />}
          />

          <StatCard
            label="Changes Requested"
            value={changesRequested}
            icon={<RotateCcw size={15} />}
          />

        </div>


        {/* FILTERS */}

        <div className="mt-8 flex flex-wrap gap-2">

          {[
            "All",
            "Pending",
            "Approved",
            "Changes Requested",
          ].map((item) => (

            <button
              key={item}
              onClick={() =>
                setFilter(
                  item as
                    | "All"
                    | "Pending"
                    | "Approved"
                    | "Changes Requested"
                )
              }
              className={`rounded-full border px-4 py-2 text-[10px] transition ${
                filter === item
                  ? "border-white/20 bg-white text-black"
                  : "border-white/10 bg-white/[0.03] text-white/40 hover:text-white"
              }`}
            >
              {item}
            </button>

          ))}

        </div>


        {/* LIST */}

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">

          {filteredApprovals.length === 0 ? (

            <div className="px-6 py-20 text-center">

              <FileCheck2
                size={28}
                className="mx-auto mb-4 text-white/20"
              />

              <p className="text-sm text-white/50">
                No approvals found
              </p>

              <p className="mt-2 text-[11px] text-white/25">
                Submit a drawing, material, render or document
                for review.
              </p>

              <Link
                href="/app/admin/approvals/new"
                className="mt-5 inline-flex items-center gap-2 text-[11px] text-white/50 hover:text-white"
              >
                <Plus size={13} />
                Submit first approval
              </Link>

            </div>

          ) : (

            <div className="divide-y divide-white/5">

              {filteredApprovals.map((approval) => (

                <Link
                  key={approval.id}
                  href={`/app/admin/approvals/${approval.id}`}
                  className="group block px-5 py-5 transition hover:bg-white/[0.03]"
                >

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                      <FileCheck2 size={16} />
                    </div>


                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <p className="text-sm text-white/75">
                          {approval.title}
                        </p>

                        <span className="text-[9px] uppercase tracking-[0.15em] text-white/20">
                          {approval.revision}
                        </span>

                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-white/30">

                        <span>
                          {approval.project}
                        </span>

                        <span>
                          {approval.type}
                        </span>

                        <span>
                          Submitted by {approval.submittedBy}
                        </span>

                        <span>
                          {approval.submittedDate}
                        </span>

                      </div>

                    </div>


                    <StatusBadge
                      status={approval.status}
                    />


                    <ArrowUpRight
                      size={15}
                      className="text-white/20 transition group-hover:text-white/60"
                    />

                  </div>

                </Link>

              ))}

            </div>

          )}

        </div>

      </main>

    </div>
  );
}


function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

      <div className="flex items-center gap-2 text-white/30">
        {icon}

        <span className="text-[9px] uppercase tracking-[0.2em]">
          {label}
        </span>
      </div>

      <p className="mt-4 text-3xl font-light">
        {value}
      </p>

    </div>
  );
}


function StatusBadge({
  status,
}: {
  status: Approval["status"];
}) {
  const styles =
    status === "Approved"
      ? "border-white/15 bg-white/[0.06] text-white/60"
      : status === "Changes Requested"
      ? "border-yellow-400/20 bg-yellow-400/[0.04] text-yellow-200/70"
      : "border-white/10 bg-white/[0.03] text-white/40";

  return (
    <span
      className={`shrink-0 rounded-full border px-3 py-1.5 text-[9px] uppercase tracking-[0.15em] ${styles}`}
    >
      {status}
    </span>
  );
}