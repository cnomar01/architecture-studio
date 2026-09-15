"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Upload,
  FileText,
} from "lucide-react";
import {
  addFile,
  type FileCategory,
  type FileStatus,
} from "../../../admin/files/fileStore";

const categories: FileCategory[] = [
  "Architectural Drawing",
  "Civil Drawing",
  "Render",
  "Document",
  "Other",
];

const statuses: FileStatus[] = [
  "Draft",
  "Pending Approval",
  "Approved",
  "Changes Requested",
];

export default function NewEngineerFilePage() {
  const [name, setName] = useState("");
  const [project, setProject] =
    useState("City Edge Mall");
  const [projectId, setProjectId] =
    useState("CEM-001");
  const [category, setCategory] =
    useState<FileCategory>("Architectural Drawing");
  const [revision, setRevision] =
    useState("R01");
  const [status, setStatus] =
    useState<FileStatus>("Draft");
  const [description, setDescription] =
    useState("");
  const [fileName, setFileName] =
    useState("");
  const [folder, setFolder] =
    useState("General");
  const [tags, setTags] =
    useState("");
  const [fileData, setFileData] =
    useState<string | undefined>();
  const [saving, setSaving] =
    useState(false);

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const selected = event.target.files?.[0];

    if (!selected) return;

    setFileName(selected.name);

    const reader = new FileReader();

    reader.onload = () => {
      setFileData(
        typeof reader.result === "string"
          ? reader.result
          : undefined
      );
    };

    reader.readAsDataURL(selected);
  }

  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) {
      alert("Please enter a file name.");
      return;
    }

    setSaving(true);

    addFile({
      project,
      projectId,
      name: name.trim(),
      category,
      revision,
      status,
      uploadedBy: "Omar Mohamed",
      uploadedById: "OM-001",
      description:
        description.trim() ||
        `${name.trim()} uploaded to ${project}.`,
      fileName:
        fileName ||
        `${name
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-")}.pdf`,
      fileType:
        fileData?.split(";")[0]?.replace(
          "data:",
          ""
        ) || "application/pdf",
      fileSize: fileData
        ? Math.round(
            (fileData.length * 3) / 4
          )
        : 0,
      fileData,
      folder:
        folder.trim() || "General",
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    });

    window.location.href =
      "/app/admin/files";
  }

  return (
    <div className="min-h-screen bg-[#f6f6f4] px-4 py-6 text-[#111] md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/app/admin/files"
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
            Add a project file with revision, folder,
            tags and approval status.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >
          <div className="rounded-2xl border border-black/8 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                <FileText size={18} />
              </div>

              <div>
                <h2 className="font-semibold">
                  File Information
                </h2>
                <p className="text-sm text-black/45">
                  Basic information about the uploaded file.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="md:col-span-2">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                  File Name
                </span>

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Ground Floor Plan"
                  className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-black/30"
                  required
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                  Project
                </span>

                <select
                  value={projectId}
                  onChange={(e) => {
                    setProjectId(e.target.value);

                    if (
                      e.target.value ===
                      "CEM-001"
                    ) {
                      setProject(
                        "City Edge Mall"
                      );
                    }
                  }}
                  className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm"
                >
                  <option value="CEM-001">
                    City Edge Mall
                  </option>
                </select>
              </label>

              <label>
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                  Category
                </span>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as FileCategory
                    )
                  }
                  className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm"
                >
                  {categories.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                  Revision
                </span>

                <input
                  value={revision}
                  onChange={(e) =>
                    setRevision(
                      e.target.value
                    )
                  }
                  placeholder="R01"
                  className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                  Status
                </span>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(
                      e.target.value as FileStatus
                    )
                  }
                  className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm"
                >
                  {statuses.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label>
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                  Folder
                </span>

                <input
                  value={folder}
                  onChange={(e) =>
                    setFolder(
                      e.target.value
                    )
                  }
                  placeholder="Drawings / Architectural"
                  className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm"
                />
              </label>

              <label>
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                  Tags
                </span>

                <input
                  value={tags}
                  onChange={(e) =>
                    setTags(e.target.value)
                  }
                  placeholder="architecture, ground floor, coordination"
                  className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm"
                />
              </label>

              <label className="md:col-span-2">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                  Description
                </span>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Describe this file..."
                  className="w-full resize-none rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-black/30"
                />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-black/8 bg-white p-6">
            <h2 className="font-semibold">
              Attach File
            </h2>

            <p className="mt-1 text-sm text-black/45">
              The selected file is stored locally for this prototype.
            </p>

            <label className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-black/15 bg-[#fafafa] p-10 text-center hover:border-black/30">
              <Upload
                size={24}
                className="text-black/45"
              />

              <span className="mt-3 text-sm font-medium">
                {fileName ||
                  "Choose a file"}
              </span>

              <span className="mt-1 text-xs text-black/45">
                PDF, DWG, PNG, JPG or other project files
              </span>

              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Link
              href="/app/admin/files"
              className="inline-flex items-center justify-center rounded-full border border-black/10 px-6 py-3 text-sm font-medium"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-medium text-white disabled:opacity-50"
            >
              <Upload size={16} />

              {saving
                ? "Uploading..."
                : "Upload File"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}