export type DriveUploadMetadata = {
  projectId: string;
  recordId: string;
  fileName: string;
  contentType?: string;
  category?: string;
  folder?: string;
  revision?: string;
};

export type DriveUploadedFile = {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  storageKey: string;
  webViewUrl: string;
};

export function driveFileId(storageKey?: string | null) {
  return storageKey?.startsWith("drive:")
    ? storageKey.slice("drive:".length)
    : null;
}

export function driveFileUrl(storageKey?: string | null) {
  const id = driveFileId(storageKey);
  return id
    ? `https://drive.google.com/file/d/${encodeURIComponent(id)}/view`
    : "";
}

export async function uploadProjectFileToDrive(
  file: File,
  metadata: DriveUploadMetadata
): Promise<DriveUploadedFile> {
  const sessionResponse = await fetch(
    "/api/integrations/drive/upload-session",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        projectId: metadata.projectId,
        recordId: metadata.recordId,
        fileName: metadata.fileName,
        contentType:
          metadata.contentType ||
          file.type ||
          "application/octet-stream",
        fileSize: file.size,
        category: metadata.category || "",
        folder: metadata.folder || "",
        revision: metadata.revision || "",
      }),
    }
  );

  const session = await sessionResponse.json().catch(() => ({}));

  if (!sessionResponse.ok || !session.uploadUrl) {
    throw new Error(
      session.error || "Could not start the Google Drive upload."
    );
  }

  const uploadResponse = await fetch(session.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type":
        metadata.contentType ||
        file.type ||
        "application/octet-stream",
    },
    body: file,
  });

  const uploaded = (await uploadResponse
    .json()
    .catch(() => ({}))) as {
    id?: string;
    name?: string;
    mimeType?: string;
    size?: string;
  };

  if (!uploadResponse.ok || !uploaded.id) {
    throw new Error(
      `Google Drive upload failed (${uploadResponse.status}).`
    );
  }

  return {
    id: uploaded.id,
    name: uploaded.name || metadata.fileName,
    mimeType:
      uploaded.mimeType ||
      metadata.contentType ||
      file.type ||
      "application/octet-stream",
    size: Number(uploaded.size || file.size),
    storageKey: `drive:${uploaded.id}`,
    webViewUrl: `https://drive.google.com/file/d/${encodeURIComponent(
      uploaded.id
    )}/view`,
  };
}

export async function deleteProjectDriveFile(
  storageKey: string | null | undefined,
  projectId: string
) {
  const fileId = driveFileId(storageKey);
  if (!fileId) return;

  const response = await fetch(
    `/api/integrations/drive/file?fileId=${encodeURIComponent(
      fileId
    )}&projectId=${encodeURIComponent(projectId)}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(
      data.error || "Could not remove the Google Drive file."
    );
  }
}
