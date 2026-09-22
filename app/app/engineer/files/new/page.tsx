"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Upload } from "lucide-react";
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

type CurrentUser = {
  id: string;
  name: string;
};

const categories = [
  "Architectural Drawing",
  "Civil Drawing",
  "Render",
  "Document",
  "Other",
] as const;

const statuses = [
  "Draft",
  "Pending Approval",
  "Approved",
  "Changes Requested",
] as const;

export default function NewEngineerFilePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [projectId, setProjectId] = useState("");
  const [name, setName] = useState("");
  const [category, setCategory] =
    useState<(typeof categories)[number]>("Architectural Drawing");
  const [revision, setRevision] = useState("R01");
  const [status, setStatus] =
    useState<(typeof statuses)[number]>("Draft");
  const [description, setDescription] = useState("");
  const [folder, setFolder] = useState("General");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    void Promise.all([
      listResource<Project>("projects", undefined, 500),
      fetch("/api/auth/me", {
        cache: "no-store",
        credentials: "include",
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
            : "Could not load file upload data."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim() || !projectId) {
      setError("Choose a project and enter a file title.");
      return;
    }

    if (!file) {
      setError("Choose a file to upload.");
      return;
    }

    setSaving(true);
    setError("");

    const recordId = `FIL-${crypto
      .randomUUID()
      .slice(0, 8)
      .toUpperCase()}`;

    let uploadedStorageKey: string | null = null;

    try {
      const project = projects.find(
        (item) => item.id === projectId
      );

      const uploaded = await uploadProjectFileToDrive(file, {
        projectId,
        recordId,
        fileName: file.name,
        contentType:
          file.type || "application/octet-stream",
        category,
        folder,
        revision,
      });

      uploadedStorageKey = uploaded.storageKey;

      await createResource("files", {
        id: recordId,
        project_id: projectId,
        project_name: project?.name || "",
        name: name.trim(),
        category,
        revision: revision.trim() || "R01",
        document_number: null,
        discipline: null,
        issue_date: new Date().toISOString().slice(0, 10),
        visibility: "Internal",
        status,
        storage_key: uploaded.storageKey,
        file_name: uploaded.name,
        file_type: uploaded.mimeType,
        file_size: uploaded.size,
        uploaded_by_id: user?.id || null,
        uploaded_by_name: user?.name || "Engineer",
        description:
          description.trim() ||
          `${name.trim()} uploaded to Google Drive.`,
        folder: folder.trim() || "General",
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        parent_file_id: null,
        is_current: true,
      });

      window.location.href = "/app/engineer/files";
    } catch (cause) {
      if (uploadedStorageKey) {
        try {
          await deleteProjectDriveFile(
            uploadedStorageKey,
            projectId
          );
        } catch (cleanupError) {
          console.error(
            "Drive rollback cleanup failed",
            cleanupError
          );
        }
      }

      setError(
        cause instanceof Error
          ? cause.message
          : "Could not upload this file."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f6f4] px-4 py-6 text-[#111] md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/app/engineer/files"
          className="inline-flex items-center gap-2 text-sm text-black/55 hover:text-black"
        >
          <ArrowLeft size={16} />
          Back to Files
        </Link>

        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.25em] text-black/45">
            Mason & Arc / Files
          </p>

          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Upload File
          </h1>

          <p className="mt-2 text-sm text-black/55">
            Files are uploaded directly to the selected project folder
            in Google Drive and recorded in the shared database.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <form
          onSubmit={(event) => void handleSubmit(event)}
          className="mt-8 space-y-5"
        >
          <div className="rounded-2xl border border-black/8 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                <FileText size={18} />
              </div>
              <div>
                <h2 className="font-semibold">File Information</h2>
                <p className="text-sm text-black/45">
                  Shared project file metadata and revision details.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label>
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                  Project
                </span>
                <select
                  value={projectId}
                  onChange={(event) =>
                    setProjectId(event.target.value)
                  }
                  disabled={loading}
                  required
                  className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm"
                >
                  <option value="">Choose a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.code} — {project.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                  File Title
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Ground Floor Plan"
                  className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-black/30"
                  required
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                  Category
                </span>
                <select
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target
                        .value as (typeof categories)[number]
                    )
                  }
                  className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm"
                >
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                  Revision
                </span>
                <input
                  value={revision}
                  onChange={(event) =>
                    setRevision(event.target.value)
                  }
                  className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                  Status
                </span>
                <select
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target
                        .value as (typeof statuses)[number]
                    )
                  }
                  className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm"
                >
                  {statuses.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                  Folder
                </span>
                <input
                  value={folder}
                  onChange={(event) =>
                    setFolder(event.target.value)
                  }
                  placeholder="Drawings / Architectural"
                  className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm"
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                  Tags
                </span>
                <input
                  value={tags}
                  onChange={(event) => setTags(event.target.value)}
                  placeholder="architecture, coordination"
                  className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm"
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                  Description
                </span>
                <textarea
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={4}
                  className="w-full resize-none rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-black/30"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-black/8 bg-white p-6">
            <h2 className="font-semibold">Attach File</h2>
            <p className="mt-1 text-sm text-black/45">
              PDF, DWG, RVT, images and other project files are
              uploaded directly to Google Drive.
            </p>

            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-[#fafafa] p-10 text-center hover:border-black/30">
              <Upload size={24} className="text-black/45" />
              <span className="mt-3 text-sm font-medium">
                {file?.name || "Choose a file"}
              </span>
              <span className="mt-1 text-xs text-black/45">
                {file
                  ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                  : "No 4 MB workspace limit"}
              </span>
              <input
                type="file"
                onChange={(event) =>
                  setFile(event.target.files?.[0] || null)
                }
                className="hidden"
              />
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/app/engineer/files"
              className="inline-flex items-center justify-center rounded-full border border-black/10 px-6 py-3 text-sm font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              <Upload size={16} />
              {saving ? "Uploading..." : "Upload File"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
