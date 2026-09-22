"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  File,
  FileCheck2,
  FileText,
  FolderOpen,
  Plus,
  RefreshCw,
  Search,
} from "lucide-react";
import { listResource } from "@/lib/client/dataApi";
import { driveFileUrl } from "@/lib/client/driveUpload";

type ProjectFile = {
  id: string;
  project_id: string | null;
  project_name: string | null;
  name: string;
  category: string;
  revision: string;
  status: string;
  storage_key: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  uploaded_by_name: string | null;
  folder: string;
  is_current: boolean;
};

export default function EngineerFilesPage() {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setError("");
    setLoading(true);

    try {
      const response = await listResource<ProjectFile>(
        "files",
        undefined,
        500
      );
      setFiles(response.data);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load project files."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const onFocus = () => void load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          files
            .map((file) => file.category)
            .filter(Boolean)
        )
      ).sort(),
    ],
    [files]
  );

  const filteredFiles = useMemo(() => {
    const needle = search.trim().toLowerCase();

    return files.filter((file) => {
      const haystack = [
        file.name,
        file.file_name || "",
        file.project_name || "",
        file.category,
        file.revision,
        file.folder || "",
      ]
        .join(" ")
        .toLowerCase();

      return (
        (category === "All" || file.category === category) &&
        haystack.includes(needle)
      );
    });
  }, [files, search, category]);

  const drawings = files.filter(
    (file) =>
      file.category === "Architectural Drawing" ||
      file.category === "Civil Drawing"
  ).length;

  const renders = files.filter(
    (file) => file.category === "Render"
  ).length;

  const pending = files.filter(
    (file) => file.status === "Pending Approval"
  ).length;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-[1400px] px-6 py-7 lg:px-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-white/30">
                Mason & Arc / Project Files
              </p>
              <h1 className="text-3xl font-light tracking-tight">
                Files & Drawings
              </h1>
              <p className="mt-2 text-sm text-white/35">
                Shared project files from the studio database and Google
                Drive.
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => void load()}
                aria-label="Refresh files"
                className="rounded-full border border-white/10 p-3 text-white/40"
              >
                <RefreshCw size={14} />
              </button>

              <Link
                href="/app/engineer/files/new"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-2.5 text-[11px] font-medium text-black hover:bg-white/90"
              >
                <Plus size={14} />
                Upload File
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1400px] px-6 py-8 lg:px-10">
        {error && (
          <p
            role="alert"
            className="mb-6 rounded-xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-200"
          >
            {error}
          </p>
        )}

        <div className="grid gap-3 md:grid-cols-4">
          <Stat
            label="Total Files"
            value={files.length}
            icon={<FolderOpen size={14} />}
          />
          <Stat
            label="Drawings"
            value={drawings}
            icon={<FileText size={14} />}
          />
          <Stat
            label="Renders"
            value={renders}
            icon={<File size={14} />}
          />
          <Stat
            label="Pending Approval"
            value={pending}
            icon={<FileCheck2 size={14} />}
          />
        </div>

        <div className="mt-8 flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search files, projects, revisions..."
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-3 pl-10 pr-4 text-xs text-white outline-none placeholder:text-white/20 focus:border-white/20"
            />
          </div>

          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-xl border border-white/10 bg-[#0b0b0b] px-4 py-3 text-xs text-white/60 outline-none"
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          {loading ? (
            <div className="px-6 py-20 text-center text-sm text-white/30">
              Loading shared files...
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <FolderOpen
                size={28}
                className="mx-auto mb-4 text-white/20"
              />
              <p className="text-sm text-white/50">
                {files.length === 0
                  ? "No project files yet"
                  : "No files match your search"}
              </p>
              {files.length === 0 && (
                <Link
                  href="/app/engineer/files/new"
                  className="mt-5 inline-flex items-center gap-2 text-[11px] text-white/50 hover:text-white"
                >
                  <Plus size={13} />
                  Upload first file
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredFiles.map((file) => (
                <FileRow key={file.id} file={file} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function FileRow({ file }: { file: ProjectFile }) {
  const openUrl = driveFileUrl(file.storage_key);

  return (
    <div className="group flex flex-col gap-4 px-5 py-5 transition hover:bg-white/[0.03] md:flex-row md:items-center">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
        <FileText size={16} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm text-white/70">
            {file.name}
          </p>
          <span className="rounded-full border border-white/10 px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-white/30">
            {file.revision}
          </span>
          {file.is_current && (
            <span className="rounded-full border border-white/10 px-2 py-1 text-[8px] uppercase tracking-[0.12em] text-white/40">
              Current
            </span>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-white/25">
          <span>{file.project_name || "Project"}</span>
          <span>{file.category}</span>
          <span>{file.file_name || "No attachment"}</span>
          <span>{formatSize(file.file_size || 0)}</span>
          <span>
            Uploaded by {file.uploaded_by_name || "Studio"}
          </span>
        </div>
      </div>

      <Status status={file.status} />

      {openUrl ? (
        <a
          href={openUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[10px] text-white/30 hover:text-white"
        >
          Open Drive
          <ArrowUpRight size={12} />
        </a>
      ) : null}
    </div>
  );
}

function Stat({
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
      <p className="mt-4 text-3xl font-light">{value}</p>
    </div>
  );
}

function Status({ status }: { status: string }) {
  const styles =
    status === "Approved"
      ? "border-white/15 bg-white/[0.05] text-white/60"
      : status === "Changes Requested"
        ? "border-yellow-400/20 bg-yellow-400/[0.04] text-yellow-200/60"
        : status === "Pending Approval"
          ? "border-white/10 bg-white/[0.03] text-white/40"
          : "border-white/5 text-white/25";

  return (
    <span
      className={`shrink-0 rounded-full border px-3 py-1.5 text-[8px] uppercase tracking-[0.15em] ${styles}`}
    >
      {status}
    </span>
  );
}

function formatSize(bytes: number) {
  if (!bytes) return "—";
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
