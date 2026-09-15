"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Folder,
  Search,
  Upload,
  Eye,
  GitBranch,
  CheckCircle2,
  Clock3,
  AlertCircle,
} from "lucide-react";
import {
  getFolders,
  searchFiles,
  type FileCategory,
  type FileStatus,
  type ProjectFile,
} from "./fileStore";

const categories: Array<FileCategory | "All"> = [
  "All",
  "Architectural Drawing",
  "Civil Drawing",
  "Render",
  "Document",
  "Other",
];

const statuses: Array<FileStatus | "All"> = [
  "All",
  "Draft",
  "Pending Approval",
  "Approved",
  "Changes Requested",
];

type StatItem = {
  label: string;
  value: number;
  IconComponent: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
};

export default function AdminFilesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<FileCategory | "All">("All");
  const [status, setStatus] =
    useState<FileStatus | "All">("All");
  const [folder, setFolder] = useState("All");
  const [files, setFiles] = useState<ProjectFile[]>([]);

  function refresh() {
    setFiles(
      searchFiles(query, {
        category,
        status,
        folder,
      })
    );
  }

  useEffect(() => {
    refresh();

    const timer = window.setInterval(refresh, 1500);
    return () => window.clearInterval(timer);
  }, [query, category, status, folder]);

  const folders = useMemo(
    () => ["All", ...getFolders()],
    [files]
  );

  const stats = {
    total: files.length,
    approved: files.filter(
      (f) => f.status === "Approved"
    ).length,
    pending: files.filter(
      (f) => f.status === "Pending Approval"
    ).length,
    revisions: files.filter(
      (f) => Boolean(f.parentFileId)
    ).length,
  };

  const statItems: StatItem[] = [
    {
      label: "Total Files",
      value: stats.total,
      IconComponent: FileText,
    },
    {
      label: "Approved",
      value: stats.approved,
      IconComponent: CheckCircle2,
    },
    {
      label: "Pending",
      value: stats.pending,
      IconComponent: Clock3,
    },
    {
      label: "Revisions",
      value: stats.revisions,
      IconComponent: GitBranch,
    },
  ];

  return (
    <div className="min-h-screen bg-[#f6f6f4] px-4 py-6 text-[#111] md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-black/45">
              Mason & Arc / Workspace
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              Files 2.0
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-black/55">
              Central project files, folders, revisions, approvals and previews.
            </p>
          </div>

          <Link
            href="/app/admin/files/transmittals"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium"
          >
            Transmittals
          </Link>

          <Link
            href="/app/engineer/files/new"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white"
          >
            <Upload size={16} />
            Upload File
          </Link>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {statItems.map(
            ({ label, value, IconComponent }) => (
              <div
                key={label}
                className="rounded-2xl border border-black/8 bg-white p-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-black/45">
                    {label}
                  </span>

                  <IconComponent
                    size={17}
                    className="text-black/45"
                  />
                </div>

                <div className="mt-3 text-3xl font-semibold">
                  {value}
                </div>
              </div>
            )
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-black/8 bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35"
              />

              <input
                value={query}
                onChange={(e) =>
                  setQuery(e.target.value)
                }
                placeholder="Search files, projects, revisions, tags..."
                className="w-full rounded-xl border border-black/10 bg-[#fafafa] py-3 pl-11 pr-4 text-sm outline-none focus:border-black/30"
              />
            </div>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value as FileCategory | "All"
                )
              }
              className="rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm"
            >
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as FileStatus | "All"
                )
              }
              className="rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm"
            >
              {statuses.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <select
              value={folder}
              onChange={(e) =>
                setFolder(e.target.value)
              }
              className="rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm"
            >
              {folders.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-3">
          {files.map((file) => (
            <div
              key={file.id}
              className="rounded-2xl border border-black/8 bg-white p-5 transition hover:border-black/20"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-white">
                    <FileText size={20} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-semibold">
                        {file.name}
                      </h2>

                      <span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-semibold text-white">
                        {file.revision}
                      </span>
                      {file.isCurrent && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">Current</span>}
                    </div>

                    <p className="mt-1 text-sm text-black/50">
                      {file.project} · {file.category}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-black/45">
                      <span>
                        {file.folder || "General"}
                      </span>

                      <span>•</span>

                      <span>{file.fileName}</span>

                      <span>•</span>

                      <span>{file.uploadedDate}</span>
                      <span>•</span>
                      <span>Uploaded by {file.uploadedBy}</span>
                      {file.reviewedBy && <><span>•</span><span>Reviewed by {file.reviewedBy}</span></>}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                      file.status === "Approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : file.status ===
                          "Changes Requested"
                        ? "bg-red-50 text-red-700"
                        : file.status ===
                          "Pending Approval"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-black/5 text-black/55"
                    }`}
                  >
                    {file.status}
                  </span>

                  <Link
                    href={`/app/admin/files/${file.id}/revision`}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 px-4 py-2 text-xs font-medium"
                  >
                    <GitBranch size={14} />
                    Revisions
                  </Link>

                  <Link
                    href={`/app/admin/files/${file.id}/revision`}
                    className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-medium text-white"
                  >
                    <Eye size={14} />
                    Open
                  </Link>
                </div>
              </div>

              {file.description && (
                <p className="mt-4 border-t border-black/6 pt-4 text-sm leading-6 text-black/55">
                  {file.description}
                </p>
              )}
            </div>
          ))}

          {files.length === 0 && (
            <div className="rounded-2xl border border-dashed border-black/15 bg-white p-12 text-center">
              <AlertCircle
                className="mx-auto text-black/35"
                size={24}
              />

              <p className="mt-3 text-sm text-black/55">
                No files match your filters.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-2xl border border-black/8 bg-white p-5">
          <div className="flex items-center gap-3">
            <Folder size={18} />

            <div>
              <p className="font-medium">
                Folder structure
              </p>

              <p className="text-sm text-black/45">
                {
                  folders.filter(
                    (item) => item !== "All"
                  ).length
                }{" "}
                folders currently in the workspace.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}