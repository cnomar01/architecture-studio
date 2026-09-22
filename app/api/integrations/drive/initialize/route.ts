import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/server/auth";
import { initializeDriveStorage } from "@/lib/server/googleDrive";

export const runtime = "nodejs";

export async function POST() {
  try {
    await requireServerUser(["Owner"]);

    const folder = await initializeDriveStorage();

    return NextResponse.json({
      ok: true,
      storage: "google-drive",
      folder,
    });
  } catch (error) {
    console.error("Google Drive initialization failed", error);

    const message =
      error instanceof Error
        ? error.message
        : "Google Drive initialization failed.";

    return NextResponse.json(
      { error: message },
      {
        status:
          message === "UNAUTHENTICATED"
            ? 401
            : message === "FORBIDDEN"
              ? 403
              : 500,
      }
    );
  }
}