import { getGoogleCalendarCredential } from "@/lib/server/googleCalendar";

const GOOGLE_DRIVE_API = "https://www.googleapis.com/drive/v3";
const GOOGLE_DRIVE_UPLOAD_API =
  "https://www.googleapis.com/upload/drive/v3";

export const MASON_ARC_ROOT_FOLDER = "Mason & Arc Projects";

export const PROJECT_DRIVE_SUBFOLDERS = [
  "01_Admin",
  "02_Contracts",
  "03_Drawings",
  "04_Models",
  "05_Renders",
  "06_Site",
  "07_Reports",
  "08_Deliverables",
] as const;

export type ProjectDriveSubfolder =
  (typeof PROJECT_DRIVE_SUBFOLDERS)[number];

type ProjectFolderInput = {
  id: string;
  code?: string | null;
  name: string;
};

async function getDriveAccessToken() {
  const credential = await getGoogleCalendarCredential();

  if (!credential?.refreshToken) {
    throw new Error("Google Drive is not connected.");
  }

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("Google OAuth is not configured.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: credential.refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });

  const data = (await response.json().catch(() => ({}))) as {
    access_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!response.ok || !data.access_token) {
    console.error("Google Drive token refresh failed", {
      status: response.status,
      error: data.error,
      description: data.error_description,
    });

    throw new Error(
      "Could not authorize Google Drive. Reconnect Google in Settings."
    );
  }

  return data.access_token;
}

function escapeDriveQuery(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

function cleanDriveFileName(value: string) {
  return value
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .trim()
    .slice(0, 240);
}

async function findFolder(
  accessToken: string,
  name: string,
  parentId?: string
) {
  const escapedName = escapeDriveQuery(name);

  const conditions = [
    `name='${escapedName}'`,
    `mimeType='application/vnd.google-apps.folder'`,
    "trashed=false",
  ];

  if (parentId) {
    conditions.push(`'${parentId}' in parents`);
  }

  const params = new URLSearchParams({
    q: conditions.join(" and "),
    fields: "files(id,name,webViewLink)",
    pageSize: "10",
  });

  const response = await fetch(
    `${GOOGLE_DRIVE_API}/files?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    }
  );

  const data = (await response.json().catch(() => ({}))) as {
    files?: Array<{
      id: string;
      name: string;
      webViewLink?: string;
    }>;
    error?: unknown;
  };

  if (!response.ok) {
    throw new Error(
      `Google Drive search failed (${response.status}): ${JSON.stringify(data)}`
    );
  }

  return data.files?.[0] ?? null;
}

async function findProjectFolder(
  accessToken: string,
  rootFolderId: string,
  projectId: string
) {
  const escapedProjectId = escapeDriveQuery(projectId);

  const params = new URLSearchParams({
    q: [
      `'${rootFolderId}' in parents`,
      `mimeType='application/vnd.google-apps.folder'`,
      "trashed=false",
      `name contains '${escapedProjectId}'`,
    ].join(" and "),
    fields: "files(id,name,webViewLink)",
    pageSize: "10",
  });

  const response = await fetch(
    `${GOOGLE_DRIVE_API}/files?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    }
  );

  const data = (await response.json().catch(() => ({}))) as {
    files?: Array<{
      id: string;
      name: string;
      webViewLink?: string;
    }>;
  };

  if (!response.ok) {
    throw new Error(
      `Could not search for project folder (${response.status}).`
    );
  }

  return data.files?.[0] ?? null;
}

async function createFolder(
  accessToken: string,
  name: string,
  parentId?: string
) {
  const response = await fetch(
    `${GOOGLE_DRIVE_API}/files?fields=id,name,webViewLink`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        mimeType: "application/vnd.google-apps.folder",
        ...(parentId ? { parents: [parentId] } : {}),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    }
  );

  const data = (await response.json().catch(() => ({}))) as {
    id?: string;
    name?: string;
    webViewLink?: string;
    error?: unknown;
  };

  if (!response.ok || !data.id) {
    throw new Error(
      `Google Drive folder creation failed (${response.status}): ${JSON.stringify(data)}`
    );
  }

  return {
    id: data.id,
    name: data.name || name,
    webViewLink:
      data.webViewLink ||
      `https://drive.google.com/drive/folders/${data.id}`,
  };
}

async function getOrCreateFolder(
  accessToken: string,
  name: string,
  parentId?: string
) {
  const existing = await findFolder(accessToken, name, parentId);

  if (existing) {
    return {
      id: existing.id,
      name: existing.name,
      webViewLink:
        existing.webViewLink ||
        `https://drive.google.com/drive/folders/${existing.id}`,
    };
  }

  return createFolder(accessToken, name, parentId);
}

async function ensureProjectDriveFolder(
  accessToken: string,
  input: ProjectFolderInput
) {
  const root = await getOrCreateFolder(
    accessToken,
    MASON_ARC_ROOT_FOLDER
  );

  const existingProjectFolder = await findProjectFolder(
    accessToken,
    root.id,
    input.id
  );

  const projectFolderName = [
    input.id,
    input.code,
    input.name,
  ]
    .filter(Boolean)
    .join(" - ");

  const projectFolder =
    existingProjectFolder ||
    (await createFolder(
      accessToken,
      projectFolderName,
      root.id
    ));

  const subfolders = await Promise.all(
    PROJECT_DRIVE_SUBFOLDERS.map((folderName) =>
      getOrCreateFolder(
        accessToken,
        folderName,
        projectFolder.id
      )
    )
  );

  return {
    id: projectFolder.id,
    name: projectFolder.name,
    webViewLink:
      projectFolder.webViewLink ||
      `https://drive.google.com/drive/folders/${projectFolder.id}`,
    subfolders,
  };
}

export function resolveProjectDriveSubfolder(input: {
  category?: string | null;
  folder?: string | null;
}): ProjectDriveSubfolder {
  const haystack = `${input.folder || ""} ${input.category || ""}`
    .toLowerCase()
    .replace(/[_-]+/g, " ");

  if (haystack.includes("contract")) return "02_Contracts";
  if (haystack.includes("drawing")) return "03_Drawings";
  if (haystack.includes("model") || haystack.includes("revit")) {
    return "04_Models";
  }
  if (
    haystack.includes("render") ||
    haystack.includes("visualization") ||
    haystack.includes("visualisation")
  ) {
    return "05_Renders";
  }
  if (
    haystack.includes("site") ||
    haystack.includes("photo") ||
    haystack.includes("inspection")
  ) {
    return "06_Site";
  }
  if (haystack.includes("report")) return "07_Reports";
  if (
    haystack.includes("deliver") ||
    haystack.includes("issue package")
  ) {
    return "08_Deliverables";
  }

  return "01_Admin";
}

export async function initializeDriveStorage() {
  const accessToken = await getDriveAccessToken();

  const root = await getOrCreateFolder(
    accessToken,
    MASON_ARC_ROOT_FOLDER
  );

  return {
    id: root.id,
    name: root.name,
    webViewLink: root.webViewLink,
  };
}

export async function createProjectDriveFolder(
  input: ProjectFolderInput
) {
  const accessToken = await getDriveAccessToken();
  return ensureProjectDriveFolder(accessToken, input);
}

export async function createProjectDriveUploadSession(input: {
  project: ProjectFolderInput;
  recordId?: string | null;
  fileName: string;
  contentType?: string | null;
  fileSize: number;
  category?: string | null;
  folder?: string | null;
  revision?: string | null;
}) {
  const accessToken = await getDriveAccessToken();

  const projectFolder = await ensureProjectDriveFolder(
    accessToken,
    input.project
  );

  const targetFolderName = resolveProjectDriveSubfolder({
    category: input.category,
    folder: input.folder,
  });

  const targetFolder = projectFolder.subfolders.find(
    (item) => item.name === targetFolderName
  );

  if (!targetFolder) {
    throw new Error(
      `Google Drive target folder ${targetFolderName} is unavailable.`
    );
  }

  const fileName = cleanDriveFileName(input.fileName);

  if (!fileName) {
    throw new Error("A valid file name is required.");
  }

  const contentType =
    input.contentType?.trim() || "application/octet-stream";

  const appProperties: Record<string, string> = {
    masonArcProjectId: input.project.id,
  };

  if (input.recordId) {
    appProperties.masonArcFileRecordId = input.recordId;
  }

  if (input.revision) {
    appProperties.masonArcRevision = input.revision;
  }

  const params = new URLSearchParams({
    uploadType: "resumable",
    fields: "id,name,mimeType,size,webViewLink,webContentLink",
  });

  const response = await fetch(
    `${GOOGLE_DRIVE_UPLOAD_API}/files?${params.toString()}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "X-Upload-Content-Type": contentType,
        "X-Upload-Content-Length": String(input.fileSize),
      },
      body: JSON.stringify({
        name: fileName,
        parents: [targetFolder.id],
        appProperties,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    }
  );

  if (!response.ok) {
    const detail = await response.text().catch(() => "");

    throw new Error(
      `Could not start Google Drive upload (${response.status}): ${detail}`
    );
  }

  const uploadUrl = response.headers.get("location");

  if (!uploadUrl) {
    throw new Error(
      "Google Drive did not return a resumable upload URL."
    );
  }

  return {
    uploadUrl,
    targetFolder: {
      id: targetFolder.id,
      name: targetFolder.name,
      webViewLink: targetFolder.webViewLink,
    },
    projectFolder: {
      id: projectFolder.id,
      name: projectFolder.name,
      webViewLink: projectFolder.webViewLink,
    },
  };
}

export async function deleteDriveFile(
  fileId: string,
  expectedProjectId: string
) {
  const accessToken = await getDriveAccessToken();

  const metadataResponse = await fetch(
    `${GOOGLE_DRIVE_API}/files/${encodeURIComponent(
      fileId
    )}?fields=id,appProperties,trashed`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    }
  );

  if (metadataResponse.status === 404) {
    return { ok: true, alreadyMissing: true };
  }

  const metadata = (await metadataResponse
    .json()
    .catch(() => ({}))) as {
    appProperties?: Record<string, string>;
    trashed?: boolean;
  };

  if (!metadataResponse.ok) {
    throw new Error(
      `Could not verify Google Drive file (${metadataResponse.status}).`
    );
  }

  if (
    metadata.appProperties?.masonArcProjectId !== expectedProjectId
  ) {
    throw new Error("FORBIDDEN");
  }

  const response = await fetch(
    `${GOOGLE_DRIVE_API}/files/${encodeURIComponent(fileId)}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    }
  );

  if (response.status === 404) {
    return { ok: true, alreadyMissing: true };
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => "");

    throw new Error(
      `Could not delete Google Drive file (${response.status}): ${detail}`
    );
  }

  return { ok: true, alreadyMissing: false };
}
