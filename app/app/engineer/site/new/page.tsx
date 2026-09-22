"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { createResource, listResource } from "@/lib/client/dataApi";
import {
  deleteProjectDriveFile,
  uploadProjectFileToDrive,
} from "@/lib/client/driveUpload";

type Project = {
  id: string;
  code: string;
  name: string;
};

type Issue = {
  title: string;
  description: string;
  location: string;
  priority: string;
};

type CurrentUser = {
  id: string;
  name: string;
};

export default function NewSiteReportPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [projectId, setProjectId] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [visitType, setVisitType] =
    useState("Routine Inspection");
  const [weather, setWeather] = useState("Clear");
  const [summary, setSummary] = useState("");
  const [issues, setIssues] = useState<Issue[]>([]);
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void Promise.all([
      listResource<Project>("projects", undefined, 500),
      fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      }).then((response) => response.json()),
    ])
      .then(([projectData, authData]) => {
        setProjects(projectData.data);
        setProjectId(projectData.data[0]?.id || "");
        setUser(authData?.user || null);
      })
      .catch((cause) =>
        setError(
          cause instanceof Error
            ? cause.message
            : "Could not load projects."
        )
      );
  }, []);

  function update(
    index: number,
    key: keyof Issue,
    value: string
  ) {
    setIssues((current) =>
      current.map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      )
    );
  }

  function addPhotos(files: FileList | null) {
    if (!files?.length) return;

    setPhotos((current) => {
      const existing = new Set(
        current.map((file) => `${file.name}:${file.size}`)
      );

      return [
        ...current,
        ...Array.from(files).filter(
          (file) => !existing.has(`${file.name}:${file.size}`)
        ),
      ].slice(0, 20);
    });
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/site/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          project_id: projectId,
          report_date: date,
          visit_type: visitType,
          weather,
          summary,
          issues,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.id) {
        throw new Error(
          data.error || "Could not save site report."
        );
      }

      const reportId = String(data.id);
      const project = projects.find(
        (item) => item.id === projectId
      );

      for (const photo of photos) {
        const recordId = `FIL-${crypto
          .randomUUID()
          .slice(0, 8)
          .toUpperCase()}`;

        let storageKey: string | null = null;

        try {
          const uploaded = await uploadProjectFileToDrive(photo, {
            projectId,
            recordId,
            fileName: photo.name,
            contentType:
              photo.type || "application/octet-stream",
            category: "Other",
            folder: "Site",
            revision: "R01",
          });

          storageKey = uploaded.storageKey;

          await createResource("files", {
            id: recordId,
            project_id: projectId,
            project_name: project?.name || "",
            name: photo.name,
            category: "Other",
            revision: "R01",
            document_number: null,
            discipline: null,
            issue_date: date,
            visibility: "Internal",
            status: "Draft",
            storage_key: uploaded.storageKey,
            file_name: uploaded.name,
            file_type: uploaded.mimeType,
            file_size: uploaded.size,
            uploaded_by_id: user?.id || null,
            uploaded_by_name:
              user?.name || "Site Engineer",
            description: `Site photo from report ${reportId}.`,
            folder: "Site",
            tags: ["site", "photo", reportId],
            parent_file_id: null,
            is_current: true,
          });
        } catch (photoError) {
          if (storageKey) {
            try {
              await deleteProjectDriveFile(
                storageKey,
                projectId
              );
            } catch (cleanupError) {
              console.error(
                "Site photo rollback cleanup failed",
                cleanupError
              );
            }
          }

          throw new Error(
            `Site report ${reportId} was saved, but photo "${photo.name}" could not be uploaded. ${photoError instanceof Error ? photoError.message : ""}`
          );
        }
      }

      router.push("/app/engineer/site");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not save site report."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#111] px-6 py-12 text-white md:px-10 md:py-20">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/app/engineer/site"
          className="text-[9px] uppercase tracking-[.18em] text-white/30"
        >
          ← Site Management
        </Link>

        <div className="mt-12">
          <p className="text-[9px] uppercase tracking-[.25em] text-white/20">
            Field Operations
          </p>
          <h1 className="mt-4 text-5xl font-light tracking-[-.05em]">
            New Site Visit
          </h1>
          <p className="mt-4 text-sm text-white/30">
            The report and issues are saved in the shared database.
            Site photos are uploaded directly to the project&apos;s
            Google Drive Site folder.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-400/25 bg-red-400/10 p-4 text-sm text-red-200"
          >
            {error}
          </p>
        )}

        <form
          onSubmit={(event) => void submit(event)}
          className="mt-12 space-y-8"
        >
          <section className="rounded-2xl border border-white/10 p-7">
            <p className="text-[9px] uppercase tracking-[.2em] text-white/20">
              Visit Details
            </p>

            <div className="mt-7 grid gap-6 md:grid-cols-2">
              <Field label="Project">
                <select
                  required
                  value={projectId}
                  onChange={(event) =>
                    setProjectId(event.target.value)
                  }
                  className="input"
                >
                  <option value="">Choose project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.code} — {project.name}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Date">
                <input
                  required
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="input"
                />
              </Field>

              <Field label="Visit Type">
                <select
                  value={visitType}
                  onChange={(event) =>
                    setVisitType(event.target.value)
                  }
                  className="input"
                >
                  <option>Routine Inspection</option>
                  <option>Progress Inspection</option>
                  <option>Quality Control</option>
                  <option>Coordination Visit</option>
                  <option>Client Visit</option>
                </select>
              </Field>

              <Field label="Weather">
                <select
                  value={weather}
                  onChange={(event) =>
                    setWeather(event.target.value)
                  }
                  className="input"
                >
                  <option>Clear</option>
                  <option>Cloudy</option>
                  <option>Hot</option>
                  <option>Dusty</option>
                  <option>Rain</option>
                </select>
              </Field>
            </div>

            <div className="mt-6">
              <Field label="Visit Summary">
                <textarea
                  value={summary}
                  onChange={(event) =>
                    setSummary(event.target.value)
                  }
                  rows={5}
                  className="input h-auto resize-none py-4"
                />
              </Field>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[9px] uppercase tracking-[.2em] text-white/20">
                  Site Photos
                </p>
                <h2 className="mt-3 text-2xl font-light">
                  Photo Record
                </h2>
              </div>
              <Camera size={20} className="text-white/30" />
            </div>

            <label className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-6 py-10 text-center hover:border-white/20">
              <Upload size={20} className="text-white/30" />
              <span className="mt-3 text-xs text-white/45">
                Choose site photos
              </span>
              <span className="mt-1 text-[10px] text-white/20">
                Up to 20 files per report. Uploaded to Google Drive.
              </span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(event) => {
                  addPhotos(event.target.files);
                  event.target.value = "";
                }}
              />
            </label>

            {photos.length > 0 && (
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {photos.map((photo, index) => (
                  <div
                    key={`${photo.name}-${photo.size}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/10 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs text-white/60">
                        {photo.name}
                      </p>
                      <p className="mt-1 text-[9px] text-white/20">
                        {(photo.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setPhotos((current) =>
                          current.filter((_, i) => i !== index)
                        )
                      }
                      className="rounded-full p-2 text-white/25 hover:text-white"
                      aria-label={`Remove ${photo.name}`}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[.2em] text-white/20">
                  Site Issues
                </p>
                <h2 className="mt-3 text-2xl font-light">
                  Observations & Issues
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setIssues((current) => [
                    ...current,
                    {
                      title: "",
                      description: "",
                      location: "",
                      priority: "Medium",
                    },
                  ])
                }
                className="rounded-full border border-white/10 px-5 py-3 text-[9px] uppercase tracking-[.15em] text-white/35"
              >
                + Add Issue
              </button>
            </div>

            <div className="mt-7 space-y-5">
              {issues.map((issue, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-white/10 p-6"
                >
                  <div className="flex justify-between">
                    <p className="text-[9px] uppercase tracking-[.15em] text-white/20">
                      Issue {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        setIssues((current) =>
                          current.filter((_, i) => i !== index)
                        )
                      }
                      className="text-[9px] text-white/25"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <Field label="Title">
                      <input
                        required
                        value={issue.title}
                        onChange={(event) =>
                          update(index, "title", event.target.value)
                        }
                        className="input"
                      />
                    </Field>

                    <Field label="Location">
                      <input
                        value={issue.location}
                        onChange={(event) =>
                          update(
                            index,
                            "location",
                            event.target.value
                          )
                        }
                        className="input"
                      />
                    </Field>

                    <Field label="Priority">
                      <select
                        value={issue.priority}
                        onChange={(event) =>
                          update(
                            index,
                            "priority",
                            event.target.value
                          )
                        }
                        className="input"
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                        <option>Urgent</option>
                      </select>
                    </Field>

                    <div className="md:col-span-2">
                      <Field label="Description">
                        <textarea
                          value={issue.description}
                          onChange={(event) =>
                            update(
                              index,
                              "description",
                              event.target.value
                            )
                          }
                          rows={4}
                          className="input h-auto resize-none py-4"
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              ))}

              {!issues.length && (
                <div className="rounded-xl border border-dashed border-white/10 px-6 py-12 text-center text-xs text-white/20">
                  No issues added. You can submit a clean report.
                </div>
              )}
            </div>
          </section>

          <div className="flex justify-end gap-3">
            <Link
              href="/app/engineer/site"
              className="rounded-full border border-white/10 px-6 py-3 text-[9px] uppercase tracking-[.15em] text-white/35"
            >
              Cancel
            </Link>
            <button
              disabled={saving || !projectId}
              className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-[9px] uppercase tracking-[.15em] text-black disabled:opacity-40"
            >
              <Upload size={13} />
              {saving
                ? photos.length
                  ? "Saving & Uploading…"
                  : "Saving…"
                : "Save Site Report"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[9px] uppercase tracking-[.15em] text-white/20">
        {label}
      </span>
      {children}
    </label>
  );
}
