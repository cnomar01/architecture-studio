import { NextResponse } from "next/server";
import { audit, requireServerUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";
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

    if (user.role === "Engineer") {
      const projectResult = await query(
        `SELECT project_manager_id
         FROM projects
         WHERE id=$1
         LIMIT 1`,
        [projectId]
      );

      const project = projectResult.rows[0];

      if (!project) {
        return NextResponse.json(
          { error: "Project not found." },
          { status: 404 }
        );
      }

      const isManager =
        String(project.project_manager_id || "") === user.id;

      const membership = isManager
        ? true
        : Boolean(
            (
              await query(
                `SELECT 1
                 FROM project_memberships
                 WHERE project_id=$1
                   AND user_id=$2
                   AND active=true
                 LIMIT 1`,
                [projectId, user.id]
              )
            ).rows[0]
          );

      if (!membership) {
        throw new Error("FORBIDDEN");
      }
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
