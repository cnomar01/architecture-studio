"use client";

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

  // Approval connection
  approvalId?: string;

  // Revision connection
  parentFileId?: string;
};

const STORAGE_KEY = "mason-arc-project-files";

const initialFiles: ProjectFile[] = [];

export function getFiles(): ProjectFile[] {
  if (typeof window === "undefined") {
    return initialFiles;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialFiles)
    );

    return initialFiles;
  }

  try {
    return JSON.parse(stored) as ProjectFile[];
  } catch {
    return initialFiles;
  }
}

export function saveFiles(files: ProjectFile[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(files)
  );
}

export function addFile(
  file: Omit<ProjectFile, "id">
) {
  const files = getFiles();

  const newFile: ProjectFile = {
    ...file,
    id: `FILE-${String(files.length + 1).padStart(3, "0")}`,
  };

  saveFiles([
    ...files,
    newFile,
  ]);

  return newFile;
}

export function updateFile(
  fileId: string,
  updates: Partial<ProjectFile>
) {
  const files = getFiles();

  const updated = files.map((file) =>
    file.id === fileId
      ? {
          ...file,
          ...updates,
        }
      : file
  );

  saveFiles(updated);

  return updated;
}

export function deleteFile(fileId: string) {
  const files = getFiles();

  const updated = files.filter(
    (file) => file.id !== fileId
  );

  saveFiles(updated);

  return updated;
}

export function getProjectFiles(
  project: string
) {
  return getFiles().filter(
    (file) => file.project === project
  );
}

export function getFileById(
  fileId: string
) {
  return (
    getFiles().find(
      (file) => file.id === fileId
    ) ?? null
  );
}

export function getFileRevisions(
  fileId: string
) {
  const files = getFiles();

  const source = files.find(
    (file) => file.id === fileId
  );

  if (!source) return [];

  const rootId =
    source.parentFileId ?? source.id;

  return files
    .filter(
      (file) =>
        file.id === rootId ||
        file.parentFileId === rootId
    )
    .sort((a, b) => {
      const aNumber = Number(
        a.revision.match(/\d+/)?.[0] ?? 1
      );

      const bNumber = Number(
        b.revision.match(/\d+/)?.[0] ?? 1
      );

      return aNumber - bNumber;
    });
}