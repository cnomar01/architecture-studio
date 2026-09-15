"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck2,
  RotateCcw,
  Send,
} from "lucide-react";

import {
  getApprovals,
  updateApproval,
  Approval,
} from "../approvalStore";

import {
  updateFile,
} from "@/app/app/admin/files/fileStore";

export default function ApprovalDetailsPage() {
  const params = useParams();

  const [approval, setApproval] =
    useState<Approval | null>(null);

  const [comment, setComment] =
    useState("");

  useEffect(() => {
    const approvals = getApprovals();

    const found = approvals.find(
      (item) => item.id === String(params.id)
    );

    setApproval(found ?? null);
  }, [params.id]);

  if (!approval) {
    return (
      <main className="min-h-screen bg-[#111111] text-white">

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
              href="/app/admin/approvals"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/40 transition hover:text-white"
            >
              <ArrowLeft size={13} />
              Approvals
            </Link>

          </div>
        </header>

        <section className="px-6 py-24 text-center">

          <FileCheck2
            size={28}
            className="mx-auto mb-4 text-white/20"
          />

          <h1 className="text-2xl font-light">
            Approval Not Found
          </h1>

          <p className="mt-3 text-sm text-white/30">
            This approval may have been removed or has not
            been created yet.
          </p>

        </section>

      </main>
    );
  }

  function approve() {
    const updated = updateApproval(
      approval!.id,
      {
        status: "Approved",
        reviewer: "Studio Manager",
        reviewComment: comment.trim(),
        reviewedDate:
          new Date().toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          ),
      }
    );

    if (approval!.fileId) {
      updateFile(
        approval!.fileId,
        {
          status: "Approved",
        }
      );
    }

    const found = updated.find(
      (item) => item.id === approval!.id
    );

    setApproval(found ?? null);
    setComment("");
  }

  function requestChanges() {
    if (!comment.trim()) return;

    const updated = updateApproval(
      approval!.id,
      {
        status: "Changes Requested",
        reviewer: "Studio Manager",
        reviewComment: comment.trim(),
        reviewedDate:
          new Date().toLocaleDateString(
            "en-GB",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          ),
      }
    );

    if (approval!.fileId) {
      updateFile(
        approval!.fileId,
        {
          status: "Changes Requested",
        }
      );
    }

    const found = updated.find(
      (item) => item.id === approval!.id
    );

    setApproval(found ?? null);
    setComment("");
  }

  function sendBackToReview() {
    const updated = updateApproval(
      approval!.id,
      {
        status: "Pending",
        reviewer: "",
        reviewComment: "",
        reviewedDate: "",
      }
    );

    if (approval!.fileId) {
      updateFile(
        approval!.fileId,
        {
          status: "Pending Approval",
        }
      );
    }

    const found = updated.find(
      (item) => item.id === approval!.id
    );

    setApproval(found ?? null);
  }

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
            href="/app/admin/approvals"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-white/40 transition hover:text-white"
          >
            <ArrowLeft size={13} />
            Approvals
          </Link>

        </div>

      </header>


      {/* MAIN */}

      <section className="px-6 pb-32 pt-16 md:px-10 md:pt-24">

        <div className="mx-auto max-w-6xl">

          {/* BREADCRUMB */}

          <div className="flex items-center gap-3 text-[9px] uppercase tracking-[0.18em] text-white/25">

            <span>Approvals</span>

            <span>/</span>

            <span>{approval.id}</span>

          </div>


          {/* TITLE */}

          <div className="mt-8 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">

            <div>

              <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
                Project Approval
              </p>

              <h1 className="mt-4 text-4xl font-light tracking-[-0.05em] md:text-6xl">
                {approval.title}
              </h1>

              <p className="mt-4 text-sm text-white/35">
                {approval.project} · {approval.submittedBy}
              </p>

            </div>

            <StatusBadge
              status={approval.status}
            />

          </div>


          {/* DOCUMENT PREVIEW */}

          <div className="mt-14 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">

            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

              <div>

                <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                  {approval.type}
                </p>

                <p className="mt-2 text-sm text-white/70">
                  {approval.title}
                </p>

                {approval.fileName && (
                  <p className="mt-1 text-[10px] text-white/25">
                    {approval.fileName}
                  </p>
                )}

              </div>

              <span className="text-[10px] text-white/30">
                {approval.revision}
              </span>

            </div>


            <div className="flex min-h-[420px] items-center justify-center bg-[#181818] p-8">

              <div className="flex min-h-[350px] w-full max-w-3xl items-center justify-center border border-dashed border-white/10">

                <div className="text-center">

                  <p className="text-4xl font-light text-white/15">
                    {approval.type}
                  </p>

                  <p className="mt-4 text-[9px] uppercase tracking-[0.2em] text-white/20">
                    File Preview
                  </p>

                  <p className="mt-2 text-[10px] text-white/15">
                    Linked file:{" "}
                    {approval.fileName ||
                      "No file linked"}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* INFO */}

          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 md:grid-cols-4">

            <Info
              label="Project"
              value={approval.project}
            />

            <Info
              label="Submitted By"
              value={approval.submittedBy}
            />

            <Info
              label="Revision"
              value={approval.revision}
            />

            <Info
              label="Submitted"
              value={approval.submittedDate}
            />

          </div>


          {/* SUBMISSION DETAILS */}

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">

            <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
              Submission Details
            </p>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/40">
              {approval.description ||
                "No description provided."}
            </p>

          </div>


          {/* REVIEW */}

          <div className="mt-14 grid gap-12 lg:grid-cols-[1fr_380px]">

            <div>

              <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                Review
              </p>

              <h2 className="mt-3 text-2xl font-light">
                {approval.status === "Pending"
                  ? "Review Submission"
                  : "Review Result"}
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-white/35">
                Add a clear review comment so the decision
                becomes part of the project record.
              </p>


              {approval.status === "Pending" ? (

                <>

                  <textarea
                    value={comment}
                    onChange={(event) =>
                      setComment(event.target.value)
                    }
                    placeholder="Write your review or requested changes..."
                    className="mt-7 min-h-40 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/30"
                  />


                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">

                    <button
                      type="button"
                      onClick={approve}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-black transition hover:bg-white/80"
                    >
                      <CheckCircle2 size={14} />
                      Approve Revision
                    </button>


                    <button
                      type="button"
                      onClick={requestChanges}
                      disabled={!comment.trim()}
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 py-3 text-[10px] uppercase tracking-[0.16em] text-white/60 transition hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <RotateCcw size={14} />
                      Request Changes
                    </button>

                  </div>

                </>

              ) : (

                <div className="mt-7 rounded-xl border border-white/10 bg-white/[0.03] p-5">

                  <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                    Review Comment
                  </p>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-white/45">
                    {approval.reviewComment ||
                      "No review comment added."}
                  </p>

                  <p className="mt-5 text-[9px] uppercase tracking-[0.15em] text-white/20">
                    {approval.reviewer ||
                      "Studio Manager"}{" "}
                    ·{" "}
                    {approval.reviewedDate ||
                      "—"}
                  </p>

                </div>

              )}

            </div>


            {/* DECISION */}

            <div className="rounded-2xl border border-white/10 p-7">

              <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                Decision
              </p>

              <h2 className="mt-4 text-2xl font-light">
                {approval.status}
              </h2>

              <p className="mt-4 text-sm leading-6 text-white/35">

                {approval.status === "Pending"
                  ? "This revision is waiting for a studio review decision."
                  : approval.status === "Approved"
                    ? "This revision has been approved and recorded."
                    : "Changes have been requested before this revision can proceed."}

              </p>


              {approval.status !== "Pending" && (

                <div className="mt-8 border-t border-white/10 pt-6">

                  <button
                    type="button"
                    onClick={sendBackToReview}
                    className="flex h-14 w-full items-center justify-center gap-2 rounded-xl border border-white/10 text-[10px] uppercase tracking-[0.18em] text-white/60 transition hover:border-white/25 hover:text-white"
                  >
                    <Send size={14} />
                    Send Back to Review
                  </button>

                </div>

              )}

            </div>

          </div>


          {/* WORKFLOW */}

          <div className="mt-16">

            <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
              Approval Workflow
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-3">

              <WorkflowStep
                number="01"
                title="Submitted"
                active
                detail={`${approval.submittedBy} · ${approval.submittedDate}`}
              />

              <WorkflowStep
                number="02"
                title="Review"
                active={
                  approval.status === "Pending"
                }
                detail={
                  approval.status === "Pending"
                    ? "Waiting for review"
                    : "Review completed"
                }
              />

              <WorkflowStep
                number="03"
                title="Decision"
                active={
                  approval.status !== "Pending"
                }
                detail={
                  approval.status === "Pending"
                    ? "Awaiting decision"
                    : approval.status
                }
              />

            </div>

          </div>


          {/* RECORD */}

          <div className="mt-10">

            <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
              Approval Record
            </p>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">

              <History
                revision={approval.revision}
                date={
                  approval.reviewedDate ||
                  approval.submittedDate
                }
                status={approval.status}
                current
              />

            </div>

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
            Approval Workflow
          </span>

        </div>

      </footer>

    </main>
  );
}


function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-[#111111] p-6">

      <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
        {label}
      </p>

      <p className="mt-3 truncate text-sm text-white/65">
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
      className={`w-fit rounded-full border px-4 py-2 text-[9px] uppercase tracking-[0.15em] ${styles}`}
    >
      {status}
    </span>
  );
}


function WorkflowStep({
  number,
  title,
  detail,
  active,
}: {
  number: string;
  title: string;
  detail: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        active
          ? "border-white/15 bg-white/[0.04]"
          : "border-white/5 bg-white/[0.015]"
      }`}
    >

      <p className="text-[9px] uppercase tracking-[0.2em] text-white/20">
        {number}
      </p>

      <p className="mt-3 text-xs text-white/60">
        {title}
      </p>

      <p className="mt-1 text-[10px] text-white/30">
        {detail}
      </p>

    </div>
  );
}


function History({
  revision,
  date,
  status,
  current = false,
}: {
  revision: string;
  date: string;
  status: string;
  current?: boolean;
}) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 p-6 last:border-b-0">

      <div className="flex items-center gap-5">

        <span
          className={`h-2 w-2 rounded-full ${
            current
              ? "bg-white"
              : "bg-white/20"
          }`}
        />

        <div>

          <p className="text-sm text-white/70">
            {revision}
          </p>

          <p className="mt-1 text-[10px] text-white/25">
            {date}
          </p>

        </div>

      </div>

      <span className="text-[9px] uppercase tracking-[0.15em] text-white/30">
        {status}
      </span>

    </div>
  );
}
