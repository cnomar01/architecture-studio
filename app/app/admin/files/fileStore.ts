"use client";

import { addActivity } from "@/lib/core/activityStore";

export type FileCategory =
  | "Architectural Drawing"
  | "Civil Drawing"
  | "Render"
  | "Document"
  | "Other";

export type FileStatus =
  | "Draft"
  | "Pending Approval"
  | "Approved"
  | "Changes Requested";

export type ProjectFile = {
  id: string;
  project: string;
  projectId?: string;
  name: string;
  category: FileCategory;
  revision: string;
  status: FileStatus;
  uploadedBy: string;
  uploadedById: string;
  uploadedDate: string;
  description: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  fileData?: string;
  approvalId?: string;
  parentFileId?: string;
  folder?: string;
  tags?: string[];
  uploadedByRole?: string;
  reviewedBy?: string;
  reviewedById?: string;
  reviewedDate?: string;
  approvedBy?: string;
  approvedById?: string;
  approvedDate?: string;
  supersedesFileId?: string;
  isCurrent?: boolean;
};

const STORAGE_KEY = "mason-arc-project-files";

const initialFiles: ProjectFile[] = [
  {
    id: "FIL-001",
    project: "City Edge Mall",
    projectId: "CEM-001",
    name: "Ground Floor Plan",
    category: "Architectural Drawing",
    revision: "R03",
    status: "Pending Approval",
    uploadedBy: "Omar Mohamed",
    uploadedById: "OM-001",
    uploadedDate: "2026-09-11",
    description:
      "Latest coordinated ground floor architectural plan.",
    fileName: "ground-floor-plan-r03.pdf",
    fileType: "application/pdf",
    fileSize: 2450000,
    folder: "Drawings / Architectural",
    tags: [
      "ground floor",
      "architecture",
      "coordination",
    ],
  },
  {
    id: "FIL-002",
    project: "City Edge Mall",
    projectId: "CEM-001",
    name: "Civil Coordination Notes",
    category: "Civil Drawing",
    revision: "R01",
    status: "Approved",
    uploadedBy: "Ahmed Shabaan",
    uploadedById: "AS-001",
    uploadedDate: "2026-09-10",
    description:
      "Civil coordination notes for the current design package.",
    fileName: "civil-coordination-r01.pdf",
    fileType: "application/pdf",
    fileSize: 1180000,
    folder: "Drawings / Civil",
    tags: ["civil", "coordination"],
  },
];

function load(): ProjectFile[] {
  if (typeof window === "undefined") {
    return initialFiles;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(initialFiles)
      );

      return initialFiles;
    }

    const parsed = JSON.parse(raw) as ProjectFile[];

    return parsed.map((file) => ({
      ...file,
      tags: file.tags || [],
      folder: file.folder || "General",
      isCurrent: file.isCurrent ?? !file.parentFileId,
    }));
  } catch {
    return initialFiles;
  }
}

function save(files: ProjectFile[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(files)
    );
  }
}

function nextId(files: ProjectFile[]) {
  const max = files.reduce((value, file) => {
    const number = Number(
      file.id.replace(/\D/g, "")
    );

    return Number.isFinite(number)
      ? Math.max(value, number)
      : value;
  }, 0);

  return `FIL-${String(max + 1).padStart(3, "0")}`;
}

export function getFiles() {
  return load();
}

export function getFileById(id: string) {
  return getFiles().find(
    (file) => file.id === id
  );
}

export function getProjectFiles(
  projectIdOrName: string
) {
  return getFiles().filter(
    (file) =>
      file.projectId === projectIdOrName ||
      file.project === projectIdOrName
  );
}

export function getFileRevisions(
  fileId: string
) {
  const file = getFileById(fileId);

  if (!file) {
    return [];
  }

  const rootId =
    file.parentFileId || file.id;

  return getFiles()
    .filter(
      (item) =>
        item.id === rootId ||
        item.parentFileId === rootId
    )
    .sort((a, b) =>
      b.uploadedDate.localeCompare(
        a.uploadedDate
      )
    );
}

export function getFolders(
  projectIdOrName?: string
) {
  const files = projectIdOrName
    ? getProjectFiles(projectIdOrName)
    : getFiles();

  return Array.from(
    new Set(
      files.map(
        (file) => file.folder || "General"
      )
    )
  ).sort();
}

export function searchFiles(
  query = "",
  filters: {
    projectId?: string;
    category?: FileCategory | "All";
    status?: FileStatus | "All";
    folder?: string;
  } = {}
) {
  const normalized =
    query.trim().toLowerCase();

  return getFiles().filter((file) => {
    if (
      filters.projectId &&
      file.projectId !== filters.projectId &&
      file.project !== filters.projectId
    ) {
      return false;
    }

    if (
      filters.category &&
      filters.category !== "All" &&
      file.category !== filters.category
    ) {
      return false;
    }

    if (
      filters.status &&
      filters.status !== "All" &&
      file.status !== filters.status
    ) {
      return false;
    }

    if (
      filters.folder &&
      filters.folder !== "All" &&
      (file.folder || "General") !==
        filters.folder
    ) {
      return false;
    }

    if (!normalized) {
      return true;
    }

    const haystack = [
      file.name,
      file.fileName,
      file.project,
      file.category,
      file.status,
      file.revision,
      file.folder || "",
      ...(file.tags || []),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}

export function addFile(
  input: Omit<ProjectFile, "id" | "uploadedDate">
) {
  const files = getFiles();

  const file: ProjectFile = {
    ...input,
    id: nextId(files),
    uploadedDate:
      new Date().toISOString().slice(0, 10),
    folder: input.folder || "General",
    tags: input.tags || [],
  };

  files.push(file);

  save(files);

  addActivity({
    type: "File Uploaded" as never,
    title: file.name,
    description:
      `${file.name} was uploaded to ${file.project}.`,
    projectId: file.projectId,
    projectName: file.project,
    userName: file.uploadedBy,
    metadata: {
      fileId: file.id,
    },
  });

  return file;
}

export function addRevision(
  parentFileId: string,
  input: Omit<
    ProjectFile,
    "id" | "uploadedDate" | "parentFileId"
  >
) {
  const files = getFiles();

  const parent = getFileById(parentFileId);

  if (!parent) {
    return undefined;
  }

  // Mark the previous current revision as superseded.
  const rootId = parent.parentFileId || parent.id;
  for (const item of files) {
    if (item.id === rootId || item.parentFileId === rootId) {
      item.isCurrent = false;
    }
  }

  const revision: ProjectFile = {
    ...input,
    id: nextId(files),
    parentFileId:
      parent.parentFileId || parent.id,
    uploadedDate:
      new Date().toISOString().slice(0, 10),
    folder:
      input.folder ||
      parent.folder ||
      "General",
    tags:
      input.tags ||
      parent.tags ||
      [],
    supersedesFileId: parent.id,
    isCurrent: true,
  };

  files.push(revision);

  save(files);

  addActivity({
    type: "File Uploaded" as never,
    title:
      `${revision.name} ${revision.revision}`,
    description:
      `New revision uploaded for ${parent.name}.`,
    projectId: revision.projectId,
    projectName: revision.project,
    userName: revision.uploadedBy,
    metadata: {
      fileId: revision.id,
      parentFileId:
        revision.parentFileId ||
        parentFileId,
      revision: revision.revision,
    },
  });

  return revision;
}

export function updateFileReview(
  id: string,
  reviewer: { name: string; id: string },
  status: FileStatus
) {
  return updateFile(id, {
    status,
    reviewedBy: reviewer.name,
    reviewedById: reviewer.id,
    reviewedDate: new Date().toISOString().slice(0, 10),
    ...(status === "Approved"
      ? {
          approvedBy: reviewer.name,
          approvedById: reviewer.id,
          approvedDate: new Date().toISOString().slice(0, 10),
        }
      : {}),
  });
}

export function getCurrentRevision(fileId: string) {
  const revisions = getFileRevisions(fileId);
  return revisions.find((item) => item.isCurrent) || revisions[revisions.length - 1];
}

export function getFilesByTag(tag: string) {
  const normalized = tag.trim().toLowerCase();
  return getFiles().filter((file) =>
    (file.tags || []).some((item) => item.toLowerCase() === normalized)
  );
}

export function updateFile(
  id: string,
  updates: Partial<
    Omit<ProjectFile, "id">
  >
) {
  const files = getFiles();

  const index = files.findIndex(
    (file) => file.id === id
  );

  if (index === -1) {
    return undefined;
  }

  files[index] = {
    ...files[index],
    ...updates,
  };

  save(files);

  return files[index];
}

export function deleteFile(id: string) {
  const files = getFiles();

  const target = files.find(
    (file) => file.id === id
  );

  if (!target) {
    return false;
  }

  save(
    files.filter(
      (file) =>
        file.id !== id &&
        file.parentFileId !== id
    )
  );

  return true;
}

export function resetFiles() {
  save(initialFiles);
}

export const getFileByID = getFileById;
export const getProjectFile = getFileById;