"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Camera,
  ClipboardCheck,
  ExternalLink,
  MapPin,
  RefreshCw,
} from "lucide-react";
import { listResource } from "@/lib/client/dataApi";
import { driveFileUrl } from "@/lib/client/driveUpload";

type Project = {
  id: string;
  code: string;
  name: string;
};

type Report = {
  id: string;
  project_id: string;
  project_name: string | null;
  report_date: string;
  visit_type: string;
  weather: string | null;
  engineer_name: string | null;
  summary: string;
};

type Issue = {
  id: string;
  project_id: string;
  report_id: string | null;
  title: string;
  description: string;
  location: string;
  priority: string;
  status: string;
  assigned_to_name: string | null;
};

type ProjectFile = {
  id: string;
  project_id: string | null;
  name: string;
  folder: string;
  category: string;
  storage_key: string | null;
  file_name: string | null;
  issue_date: string | null;
  tags: string[];
};

export default function ProjectSitePage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const [project, setProject] = useState<Project | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [photos, setPhotos] = useState<ProjectFile[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!id) return;

    setError("");
    setLoading(true);

    try {
      const [projectData, reportData, issueData, fileData] =
        await Promise.all([
          listResource<Project>("projects", id, 1),
          listResource<Report>("site_reports", id, 500),
          listResource<Issue>("site_issues", id, 500),
          listResource<ProjectFile>("files", id, 500),
        ]);

      setProject(projectData.data[0] || null);
      setReports(reportData.data);
      setIssues(issueData.data);
      setPhotos(
        fileData.data.filter((file) => {
          const tags = Array.isArray(file.tags) ? file.tags : [];
          return (
            (file.folder || "").toLowerCase() === "site" ||
            (file.category || "").toLowerCase() === "site photo" ||
            tags.some(
              (tag) =>
                String(tag).toLowerCase() === "site" ||
                String(tag).toLowerCase() === "photo"
            )
          );
        })
      );
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load project site records."
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  const open = useMemo(
    () => issues.filter((issue) => issue.status !== "Resolved"),
    [issues]
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080808] p-8 text-white">
        <p className="text-sm text-white/40">
          Loading project site records...
        </p>
      </main>
    );
  }

  if (!project) return <NotFound />;

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-4">
          <Link
            href={`/app/admin/projects/${project.id}`}
            className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white"
          >
            <ArrowLeft size={15} />
            Back to Project
          </Link>

          <button
            onClick={() => void load()}
            className="rounded-full border border-white/10 p-3 text-white/40"
            aria-label="Refresh site records"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        <header className="mt-8 border-b border-white/10 pb-7">
          <div className="text-xs uppercase tracking-[.25em] text-white/30">
            {project.code} · Site
          </div>
          <h1 className="mt-2 text-3xl font-semibold">
            {project.name}
          </h1>
          <p className="mt-2 text-sm text-white/40">
            Shared site reports, Google Drive photos and open site issues.
          </p>
        </header>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-200"
          >
            {error}
          </p>
        )}

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Metric
            icon={ClipboardCheck}
            label="Site Reports"
            value={String(reports.length)}
          />
          <Metric
            icon={MapPin}
            label="Open Issues"
            value={String(open.length)}
          />
          <Metric
            icon={Camera}
            label="Site Photos"
            value={String(photos.length)}
          />
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[.025] p-6">
          <h2 className="font-semibold">Site Reports</h2>

          {reports.length === 0 ? (
            <Empty text="No site reports linked to this project yet." />
          ) : (
            <div className="mt-5 space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="rounded-2xl border border-white/10 p-5"
                >
                  <div className="flex flex-col justify-between gap-2 md:flex-row">
                    <div>
                      <div className="text-xs text-white/35">
                        {report.id} ·{" "}
                        {report.report_date?.slice(0, 10)} ·{" "}
                        {report.visit_type}
                      </div>
                      <div className="mt-2 font-semibold">
                        {report.summary || "Site visit"}
                      </div>
                    </div>
                    <div className="text-sm text-white/45">
                      {report.engineer_name || "Studio team"}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-white/45 md:grid-cols-3">
                    <span>
                      Weather: {report.weather || "—"}
                    </span>
                    <span>
                      Issues:{" "}
                      {
                        issues.filter(
                          (issue) => issue.report_id === report.id
                        ).length
                      }
                    </span>
                    <span>
                      Photos:{" "}
                      {
                        photos.filter((photo) =>
                          (photo.tags || []).includes(report.id)
                        ).length
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[.025] p-6">
          <h2 className="font-semibold">Site Photos</h2>

          {photos.length === 0 ? (
            <Empty text="No Google Drive site photos yet." />
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => {
                const url = driveFileUrl(photo.storage_key);

                return (
                  <div
                    key={photo.id}
                    className="rounded-2xl border border-white/10 p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {photo.name}
                        </p>
                        <p className="mt-2 truncate text-xs text-white/35">
                          {photo.file_name || "Drive file"}
                        </p>
                        <p className="mt-1 text-[10px] text-white/25">
                          {photo.issue_date?.slice(0, 10) || "No date"}
                        </p>
                      </div>

                      {url && (
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-white/10 p-2 text-white/40 hover:text-white"
                          aria-label={`Open ${photo.name} in Google Drive`}
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[.025] p-6">
          <h2 className="font-semibold">Open Site Issues</h2>

          {open.length === 0 ? (
            <Empty text="No open site issues." />
          ) : (
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {open.map((issue) => (
                <div
                  key={issue.id}
                  className="rounded-2xl border border-white/10 p-5"
                >
                  <div className="flex justify-between gap-3">
                    <div>
                      <div className="text-xs text-white/35">
                        {issue.id} · {issue.location || "No location"}
                      </div>
                      <div className="mt-2 font-medium">
                        {issue.title}
                      </div>
                    </div>
                    <span className="text-xs text-white/45">
                      {issue.priority}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-white/45">
                    {issue.description}
                  </p>

                  <div className="mt-4 text-xs text-white/35">
                    Assigned:{" "}
                    {issue.assigned_to_name || "Unassigned"} ·{" "}
                    {issue.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Camera;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[.03] p-5">
      <Icon size={18} className="text-white/45" />
      <div className="mt-4 text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-white/35">{label}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="mt-6 rounded-2xl border border-dashed border-white/10 py-14 text-center text-sm text-white/40">
      {text}
    </div>
  );
}

function NotFound() {
  return (
    <main className="min-h-screen bg-[#080808] p-8 text-white">
      <Link
        href="/app/admin/projects"
        className="text-sm text-white/45"
      >
        ← Back to Projects
      </Link>
      <h1 className="mt-20 text-center text-2xl font-semibold">
        Project not found
      </h1>
    </main>
  );
}
