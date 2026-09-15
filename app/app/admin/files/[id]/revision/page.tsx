"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  GitBranch,
  FileText,
  Plus,
  CheckCircle2,
} from "lucide-react";
import {
  addRevision,
  getFileById,
  getFileRevisions,
  type ProjectFile,
} from "../../fileStore";

export default function FileRevisionPage() {
  const [file, setFile] = useState<ProjectFile | undefined>();
  const [revisions, setRevisions] = useState<ProjectFile[]>([]);
  const [showNew, setShowNew] = useState(false);
  const [revision, setRevision] = useState("R04");
  const [status, setStatus] =
    useState<ProjectFile["status"]>("Draft");

  const id =
    typeof window !== "undefined"
      ? window.location.pathname
          .split("/")
          .filter(Boolean)
          .at(-2)
      : undefined;

  function refresh() {
    if (!id) return;

    const current = getFileById(id);

    setFile(current ?? undefined);

    if (current) {
      setRevisions(getFileRevisions(current.id));
    }
  }

  useEffect(() => {
    refresh();
  }, [id]);

  if (!file) {
    return (
      <div className="min-h-screen bg-[#f6f6f4] p-8">
        <Link
          href="/app/admin/files"
          className="text-sm underline"
        >
          Back to files
        </Link>

        <p className="mt-8">File not found.</p>
      </div>
    );
  }

  const currentFile: ProjectFile = file;

  function createRevision() {
    addRevision(currentFile.id, {
      project: currentFile.project,
      projectId: currentFile.projectId,
      name: currentFile.name,
      category: currentFile.category,
      revision,
      status,
      uploadedBy: "Mason & Arc",
      uploadedById: "USR-001",
      description: `Revision ${revision} for ${currentFile.name}.`,
      fileName: currentFile.fileName.replace(
        /\.[^.]+$/,
        `-${revision.toLowerCase()}$&`
      ),
      fileType: currentFile.fileType,
      fileSize: currentFile.fileSize,
      folder: currentFile.folder,
      tags: currentFile.tags,
    });

    setShowNew(false);
    refresh();
  }

  return (
    <div className="min-h-screen bg-[#f6f6f4] px-4 py-6 text-[#111] md:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/app/admin/files"
          className="inline-flex items-center gap-2 text-sm text-black/55"
        >
          <ArrowLeft size={16} />
          Files
        </Link>

        <div className="mt-7 rounded-3xl border border-black/8 bg-white p-6 md:p-8">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                File
              </p>

              <h1 className="mt-2 text-3xl font-semibold">
                {currentFile.name}
              </h1>

              <p className="mt-2 text-sm text-black/50">
                {currentFile.project} · {currentFile.category} ·{" "}
                {currentFile.revision}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowNew((value) => !value)}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm text-white"
            >
              <Plus size={16} />
              New Revision
            </button>
          </div>

          {showNew && (
            <div className="mt-6 rounded-2xl bg-[#f7f7f5] p-5">
              <div className="grid gap-3 md:grid-cols-2">
                <label className="text-sm">
                  Revision

                  <input
                    value={revision}
                    onChange={(event) =>
                      setRevision(event.target.value)
                    }
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3"
                  />
                </label>

                <label className="text-sm">
                  Status

                  <select
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target.value as ProjectFile["status"]
                      )
                    }
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3"
                  >
                    <option>Draft</option>
                    <option>Pending Approval</option>
                    <option>Approved</option>
                    <option>Changes Requested</option>
                  </select>
                </label>
              </div>

              <button
                type="button"
                onClick={createRevision}
                className="mt-4 rounded-full bg-black px-5 py-3 text-sm text-white"
              >
                Create Revision
              </button>
            </div>
          )}

          <div className="mt-8">
            <div className="flex items-center gap-2">
              <GitBranch size={18} />
              <h2 className="font-semibold">
                Revision History
              </h2>
            </div>

            <div className="mt-4 grid gap-3">
              {revisions.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-2xl border border-black/8 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                      <FileText size={17} />
                    </div>

                    <div>
                      <p className="font-medium">
                        {item.revision}
                        {item.parentFileId
                          ? " · Revision"
                          : " · Original"}
                      </p>

                      <p className="text-xs text-black/45">
                        {item.uploadedDate} · {item.uploadedBy}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-black/5 px-3 py-1.5 text-xs">
                      {item.status}
                    </span>

                    {item.status === "Approved" && (
                      <CheckCircle2
                        size={16}
                        className="text-emerald-600"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}