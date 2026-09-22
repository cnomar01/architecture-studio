import { NextResponse } from "next/server";
import { audit, requireServerUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";
import { createProjectDriveUploadSession } from "@/lib/server/googleDrive";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireServerUser([
      "Owner",
      "Manager",
      "Engineer",
    ]);

    const body = (await request.json().catch(() => ({}))) as {
      projectId?: string;
      recordId?: string;
      fileName?: string;
      contentType?: string;
      fileSize?: number;
      category?: string;
      folder?: string;
      revision?: string;
    };

    const projectId = String(body.projectId || "").trim();
    const fileName = String(body.fileName || "").trim();
    const fileSize = Number(body.fileSize);

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required." },
        { status: 400 }
      );
    }

    if (!fileName) {
      return NextResponse.json(
        { error: "fileName is required." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(fileSize) || fileSize < 0) {
      return NextResponse.json(
        { error: "A valid fileSize is required." },
        { status: 400 }
      );
    }

    const projectResult = await query(
      `SELECT id, code, name, project_manager_id
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

    if (user.role === "Engineer") {
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

    const session = await createProjectDriveUploadSession({
      project: {
        id: String(project.id),
        code: project.code ? String(project.code) : null,
        name: String(project.name || project.id),
      },
      recordId: body.recordId ? String(body.recordId) : null,
      fileName,
      contentType: body.contentType
        ? String(body.contentType)
        : "application/octet-stream",
      fileSize,
      category: body.category ? String(body.category) : null,
      folder: body.folder ? String(body.folder) : null,
      revision: body.revision ? String(body.revision) : null,
    });

    await audit(
      "integration.google_drive.upload_session",
      "files",
      body.recordId ? String(body.recordId) : undefined,
      {
        projectId,
        fileName,
        fileSize,
        targetFolderId: session.targetFolder.id,
        targetFolderName: session.targetFolder.name,
      }
    );

    return NextResponse.json({
      ok: true,
      ...session,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not start Google Drive upload.";

    if (message === "UNAUTHENTICATED") {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    if (message === "FORBIDDEN") {
      return NextResponse.json(
        { error: "You do not have permission to upload to this project." },
        { status: 403 }
      );
    }

    console.error("Google Drive upload session failed", error);

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
