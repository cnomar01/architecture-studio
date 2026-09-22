import { getGoogleCalendarCredential } from "@/lib/server/googleCalendar";

const GOOGLE_DRIVE_API = "https://www.googleapis.com/drive/v3";

export const MASON_ARC_ROOT_FOLDER = "Mason & Arc Projects";

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

async function findFolder(
  accessToken: string,
  name: string,
  parentId?: string
) {
  const escapedName = name.replace(/'/g, "\\'");

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
    error?: {
      code?: number;
      message?: string;
      status?: string;
      errors?: Array<{
        message?: string;
        domain?: string;
        reason?: string;
      }>;
    };
  };

  if (!response.ok) {
    const googleError = JSON.stringify(data);

    console.error("Google Drive search failed", {
      status: response.status,
      statusText: response.statusText,
      googleError,
    });

    throw new Error(
      `Google Drive search failed (${response.status}): ${googleError}`
    );
  }

  return data.files?.[0] ?? null;
}

async function createFolder(
  accessToken: string,
  name: string,
  parentId?: string
) {
  const response = await fetch(`${GOOGLE_DRIVE_API}/files`, {
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
  });

  const data = (await response.json().catch(() => ({}))) as {
    id?: string;
    name?: string;
    error?: {
      code?: number;
      message?: string;
      status?: string;
    };
  };

  if (!response.ok || !data.id) {
    const googleError = JSON.stringify(data);

    console.error("Google Drive folder creation failed", {
      status: response.status,
      statusText: response.statusText,
      googleError,
    });

    throw new Error(
      `Google Drive folder creation failed (${response.status}): ${googleError}`
    );
  }

  return {
    id: data.id,
    name: data.name || name,
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
    };
  }

  return createFolder(accessToken, name, parentId);
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
    webViewLink: `https://drive.google.com/drive/folders/${root.id}`,
  };
}