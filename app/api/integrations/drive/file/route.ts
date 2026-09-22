import { NextResponse } from "next/server";
import { audit, requireServerUser } from "@/lib/server/auth";
import { deleteDriveFile } from "@/lib/server/googleDrive";

export const runtime = "nodejs";

export async function DELETE(request: Request) {
  try {
    const user = await requireServerUser([
      "Owner",
      "Manager",
      "Engineer",
    ]);

    const url = new URL(request.url);
    const fileId = url.searchParams.get("fileId")?.trim();
    const projectId = url.searchParams.get("projectId")?.trim();

    if (!fileId || !projectId) {
      return NextResponse.json(
        { error: "fileId and projectId are required." },
        { status: 400 }
      );
    }

    const result = await deleteDriveFile(fileId, projectId);

    await audit(
      "integration.google_drive.file_delete",
      "files",
      fileId,
      { userId: user.id }
    );

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not delete Google Drive file.";

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
