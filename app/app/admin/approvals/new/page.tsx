"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileCheck2,
  Send,
} from "lucide-react";

import { addApproval } from "../approvalStore";
import {
  getFiles,
  ProjectFile,
} from "@/app/app/admin/files/fileStore";

export default function NewApprovalPage() {
  const router = useRouter();

  const [files, setFiles] = useState<ProjectFile[]>([]);

  const [form, setForm] = useState({
    fileId: "",
    description: "",
  });

  useEffect(() => {
    setFiles(getFiles());
  }, []);

  const selectedFile = files.find(
    (file) => file.id === form.fileId
  );

  function update(
    field: string,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    if (!selectedFile) return;

    const approval = addApproval({
      project: selectedFile.project,
      title: selectedFile.name,
      type:
        selectedFile.category ===
        "Architectural Drawing" ||
        selectedFile.category === "Civil Drawing"
          ? "Drawing"
          : selectedFile.category === "Render"
            ? "Render"
            : selectedFile.category === "Document"
              ? "Document"
              : "Document",
      revision: selectedFile.revision,
      submittedBy: selectedFile.uploadedBy,
      submittedById: selectedFile.uploadedById,
      submittedDate:
        new Date().toLocaleDateString(
          "en-GB",
          {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }
        ),
      description:
        form.description.trim() ||
        selectedFile.description,
      fileId: selectedFile.id,
      fileName: selectedFile.fileName,
    });

    // Update the original file so it knows
    // which approval belongs to it.
    localStorage.setItem(
      "mason-arc-project-files",
      JSON.stringify(
        getFiles().map((file) =>
          file.id === selectedFile.id
            ? {
                ...file,
                status: "Pending Approval",
                approvalId: approval.id,
              }
            : file
        )
      )
    );

    router.push(
      `/app/admin/approvals/${approval.id}`
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      <div className="mx-auto max-w-3xl px-6 py-8 lg:px-10">

        <Link
          href="/app/admin/approvals"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white"
        >
          <ArrowLeft size={13} />
          Approvals
        </Link>

        <div className="mt-8">

          <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
            City Edge Mall
          </p>

          <h1 className="mt-2 text-3xl font-light">
            Submit Approval
          </h1>

          <p className="mt-2 text-sm text-white/35">
            Select an existing project file and submit its
            current revision for review.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          {/* FILE */}

          <div>

            <label className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-white/30">
              Project File
            </label>

            <select
              value={form.fileId}
              onChange={(event) =>
                update(
                  "fileId",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-xs text-white outline-none focus:border-white/20"
            >

              <option value="">
                Select a file...
              </option>

              {files.map((file) => (

                <option
                  key={file.id}
                  value={file.id}
                >
                  {file.name} · {file.revision}
                </option>

              ))}

            </select>

          </div>


          {/* SELECTED FILE */}

          {selectedFile && (

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-white/70">
                    {selectedFile.name}
                  </p>

                  <p className="mt-2 text-[10px] text-white/30">
                    {selectedFile.fileName}
                  </p>

                </div>

                <span className="rounded-full border border-white/10 px-3 py-1.5 text-[8px] uppercase tracking-[0.15em] text-white/35">
                  {selectedFile.revision}
                </span>

              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-[9px] text-white/25">

                <span>
                  {selectedFile.category}
                </span>

                <span>
                  Uploaded by {selectedFile.uploadedBy}
                </span>

                <span>
                  {selectedFile.uploadedDate}
                </span>

              </div>

            </div>

          )}


          {/* DESCRIPTION */}

          <div>

            <label className="mb-2 block text-[9px] uppercase tracking-[0.2em] text-white/30">
              Submission Note
            </label>

            <textarea
              value={form.description}
              onChange={(event) =>
                update(
                  "description",
                  event.target.value
                )
              }
              rows={5}
              placeholder="Add a note for the reviewer..."
              className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white outline-none placeholder:text-white/20 focus:border-white/20"
            />

          </div>


          <button
            type="submit"
            disabled={!selectedFile}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-[11px] font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-30"
          >
            <Send size={14} />
            Submit Revision for Approval
          </button>

        </form>

      </div>

    </div>
  );
}