import { NextResponse } from "next/server";
import {
  audit,
  requireServerUser,
  type ServerUser,
} from "@/lib/server/auth";
import { query } from "@/lib/server/db";
import { createProjectDriveFolder } from "@/lib/server/googleDrive";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Role = ServerUser["role"];

type Resource = {
  table: string;
  idColumn: string;
  allowed: Role[];
  columns: string[];
  readColumns?: string[];
  projectScoped?: boolean;
  clientWrite?: boolean;
  hasUpdatedAt?: boolean;
};

const INTERNAL: Role[] = ["Owner", "Manager", "Engineer"];

const CLIENT_READ: Role[] = [
  "Owner",
  "Manager",
  "Engineer",
  "Client",
];

const RESOURCES: Record<string, Resource> = {
  clients: {
    table: "clients",
    idColumn: "id",
    allowed: ["Owner", "Manager"],
    hasUpdatedAt: true,
    columns: [
      "id",
      "code",
      "name",
      "company",
      "contact_name",
      "contact_email",
      "contact_phone",
      "address",
      "notes",
      "active",
    ],
  },

  projects: {
    table: "projects",
    idColumn: "id",
    allowed: CLIENT_READ,
    hasUpdatedAt: true,
    columns: [
      "id",
      "code",
      "name",
      "type",
      "location",
      "status",
      "phase",
      "description",
      "client_id",
      "client_name",
      "project_manager_id",
      "project_manager_name",
      "start_date",
      "target_date",
      "contract_value",
      "budget",
      "financial_currency",
    ],
  },

  project_updates: {
    table: "project_updates",
    idColumn: "id",
    allowed: CLIENT_READ,
    projectScoped: true,
    hasUpdatedAt: true,
    columns: [
      "id",
      "project_id",
      "title",
      "summary",
      "progress_percent",
      "status",
      "published_at",
      "created_by_id",
    ],
  },

  tasks: {
    table: "tasks",
    idColumn: "id",
    allowed: INTERNAL,
    projectScoped: true,
    hasUpdatedAt: true,
    columns: [
      "id",
      "project_id",
      "project_name",
      "title",
      "description",
      "assignee_id",
      "assignee_name",
      "department",
      "priority",
      "status",
      "deadline",
      "parent_task_id",
    ],
  },

  files: {
    table: "project_files",
    idColumn: "id",
    allowed: CLIENT_READ,
    projectScoped: true,
    hasUpdatedAt: true,
    columns: [
      "id",
      "project_id",
      "project_name",
      "name",
      "category",
      "revision",
      "document_number",
      "discipline",
      "issue_date",
      "visibility",
      "status",
      "storage_key",
      "file_name",
      "file_type",
      "file_size",
      "uploaded_by_id",
      "uploaded_by_name",
      "description",
      "folder",
      "tags",
      "parent_file_id",
      "is_current",
    ],
  },

  approvals: {
    table: "approvals",
    idColumn: "id",
    allowed: CLIENT_READ,
    projectScoped: true,
    hasUpdatedAt: true,
    columns: [
      "id",
      "project_id",
      "project_name",
      "title",
      "type",
      "revision",
      "status",
      "submitted_by_id",
      "submitted_by_name",
      "reviewed_by_id",
      "reviewed_by_name",
      "description",
      "file_id",
      "review_comment",
      "reviewed_at",
    ],
  },

  messages: {
    table: "messages",
    idColumn: "id",
    allowed: CLIENT_READ,
    projectScoped: true,
    clientWrite: true,
    columns: [
      "id",
      "project_id",
      "sender_id",
      "sender_name",
      "body",
    ],
    readColumns: ["created_at"],
  },

  finance: {
    table: "finance_transactions",
    idColumn: "id",
    allowed: ["Owner", "Manager"],
    projectScoped: true,
    columns: [
      "id",
      "project_id",
      "type",
      "category",
      "amount",
      "currency",
      "status",
      "description",
      "transaction_date",
      "created_by_name",
    ],
  },

  site_reports: {
    table: "site_reports",
    idColumn: "id",
    allowed: INTERNAL,
    projectScoped: true,
    columns: [
      "id",
      "project_id",
      "project_name",
      "report_date",
      "visit_type",
      "weather",
      "engineer_name",
      "summary",
      "created_by_id",
    ],
    readColumns: ["created_at"],
  },

  site_issues: {
    table: "site_issues",
    idColumn: "id",
    allowed: INTERNAL,
    projectScoped: true,
    columns: [
      "id",
      "project_id",
      "report_id",
      "title",
      "description",
      "location",
      "priority",
      "status",
      "assigned_to_id",
      "assigned_to_name",
      "task_id",
    ],
    readColumns: ["created_at", "resolved_at"],
  },

  leads: {
    table: "leads",
    idColumn: "id",
    allowed: ["Owner", "Manager"],
    columns: [
      "id",
      "company",
      "status",
      "contact_name",
      "email",
      "notes",
    ],
  },

  contracts: {
    table: "contracts",
    idColumn: "id",
    allowed: ["Owner", "Manager"],
    projectScoped: true,
    columns: [
      "id",
      "project_id",
      "title",
      "status",
      "value",
      "currency",
      "start_date",
      "end_date",
    ],
  },

  procurement: {
    table: "procurement_items",
    idColumn: "id",
    allowed: INTERNAL,
    projectScoped: true,
    columns: [
      "id",
      "project_id",
      "item",
      "status",
      "priority",
      "supplier",
      "needed_by",
    ],
  },

  quality: {
    table: "quality_items",
    idColumn: "id",
    allowed: INTERNAL,
    projectScoped: true,
    columns: [
      "id",
      "project_id",
      "title",
      "status",
      "priority",
      "description",
    ],
  },

  safety: {
    table: "safety_items",
    idColumn: "id",
    allowed: INTERNAL,
    projectScoped: true,
    columns: [
      "id",
      "project_id",
      "title",
      "status",
      "severity",
      "description",
    ],
  },

  timesheets: {
    table: "timesheets",
    idColumn: "id",
    allowed: INTERNAL,
    projectScoped: true,
    columns: [
      "id",
      "user_id",
      "project_id",
      "work_date",
      "hours",
      "description",
    ],
  },

  construction: {
    table: "construction_items",
    idColumn: "id",
    allowed: INTERNAL,
    projectScoped: true,
    columns: [
      "id",
      "project_id",
      "type",
      "title",
      "status",
      "priority",
      "description",
    ],
  },
};

function resourceFor(key: string) {
  const value = RESOURCES[key];

  if (!value) {
    throw new Error("RESOURCE_NOT_FOUND");
  }

  return value;
}

function cleanBody(
  body: Record<string, unknown>,
  resource: Resource
) {
  const out: Record<string, unknown> = {};

  for (const column of resource.columns) {
    if (Object.prototype.hasOwnProperty.call(body, column)) {
      out[column] = body[column];
    }
  }

  return out;
}

function errorResponse(error: unknown) {
  const message =
    error instanceof Error ? error.message : "";

  if (message === "UNAUTHENTICATED") {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  if (message === "FORBIDDEN") {
    return NextResponse.json(
      {
        error:
          "You do not have permission to perform this action.",
      },
      { status: 403 }
    );
  }

  if (message === "RESOURCE_NOT_FOUND") {
    return NextResponse.json(
      { error: "Resource not found." },
      { status: 404 }
    );
  }

  console.error("Data API request failed", error);

  return NextResponse.json(
    { error: "Request failed." },
    { status: 500 }
  );
}

async function mayAccessProject(
  user: ServerUser,
  projectId: string
) {
  if (
    user.role === "Owner" ||
    user.role === "Manager"
  ) {
    return true;
  }

  if (user.role === "Client") {
    return Boolean(
      user.clientId &&
        (
          await query(
            "SELECT 1 FROM projects WHERE id=$1 AND client_id=$2 LIMIT 1",
            [projectId, user.clientId]
          )
        ).rows[0]
    );
  }

  return Boolean(
    (
      await query(
        "SELECT 1 FROM project_memberships WHERE project_id=$1 AND user_id=$2 AND active=true LIMIT 1",
        [projectId, user.id]
      )
    ).rows[0]
  );
}

function scope(
  key: string,
  resource: Resource,
  user: ServerUser,
  projectId?: string
) {
  const values: unknown[] = [];
  const where: string[] = [];

  const bind = (
    clause: string,
    value?: unknown
  ) => {
    where.push(clause);

    if (value !== undefined) {
      values.push(value);
    }
  };

  if (projectId) {
    bind(
      `${
        resource.projectScoped
          ? "r.project_id"
          : "r.id"
      }=$${values.length + 1}`,
      projectId
    );
  }

  if (user.role === "Client") {
    if (!user.clientId) {
      bind("1=0");
    } else if (key === "projects") {
      bind(
        `r.client_id=$${values.length + 1}`,
        user.clientId
      );
    } else {
      bind(
        `EXISTS (
          SELECT 1
          FROM projects p
          WHERE p.id=r.project_id
          AND p.client_id=$${values.length + 1}
        )`,
        user.clientId
      );

      if (key === "files") {
        bind("r.visibility='Client'");
      }

      if (key === "project_updates") {
        bind("r.status='Published'");
      }
    }
  }

  if (user.role === "Engineer") {
    if (key === "projects") {
      bind(
        `(r.project_manager_id=$${
          values.length + 1
        } OR EXISTS (
          SELECT 1
          FROM project_memberships pm
          WHERE pm.project_id=r.id
          AND pm.user_id=$${values.length + 1}
          AND pm.active=true
        ))`,
        user.id
      );
    } else if (key === "tasks") {
      bind(
        `(r.assignee_id=$${
          values.length + 1
        } OR EXISTS (
          SELECT 1
          FROM project_memberships pm
          WHERE pm.project_id=r.project_id
          AND pm.user_id=$${values.length + 1}
          AND pm.active=true
        ))`,
        user.id
      );
    } else if (resource.projectScoped) {
      bind(
        `EXISTS (
          SELECT 1
          FROM project_memberships pm
          WHERE pm.project_id=r.project_id
          AND pm.user_id=$${values.length + 1}
          AND pm.active=true
        )`,
        user.id
      );
    }
  }

  return {
    where,
    values,
  };
}

export async function GET(
  request: Request,
  context: {
    params: Promise<{ resource: string }>;
  }
) {
  try {
    const { resource: key } =
      await context.params;

    const resource = resourceFor(key);

    const user =
      await requireServerUser(resource.allowed);

    const url = new URL(request.url);

    const projectId =
      url.searchParams.get("projectId") ||
      undefined;

    const id =
      url.searchParams.get("id") ||
      undefined;

    const limit = Math.min(
      Math.max(
        Number(
          url.searchParams.get("limit") || 100
        ),
        1
      ),
      500
    );

    const { where, values } = scope(
      key,
      resource,
      user,
      projectId
    );

    if (id) {
      values.push(id);

      where.push(
        `r.${resource.idColumn}=$${values.length}`
      );
    }

    const selected = [
      ...resource.columns,
      ...(resource.readColumns || []),
    ];

    const result = await query(
      `SELECT ${selected
        .map((c) => `r.${c}`)
        .join(",")}
       FROM ${resource.table} r
       ${
         where.length
           ? `WHERE ${where.join(" AND ")}`
           : ""
       }
       ORDER BY r.created_at DESC
       LIMIT ${limit}`,
      values
    );

    return NextResponse.json(
      {
        data: result.rows,
        count:
          result.rowCount ??
          result.rows.length,
        actor: user.id,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(
  request: Request,
  context: {
    params: Promise<{ resource: string }>;
  }
) {
  try {
    const { resource: key } =
      await context.params;

    const resource = resourceFor(key);

    const user =
      await requireServerUser(resource.allowed);

    const body = cleanBody(
      await request.json(),
      resource
    );

    if (
      user.role === "Client" &&
      !resource.clientWrite
    ) {
      throw new Error("FORBIDDEN");
    }

    if (
      (user.role === "Client" ||
        user.role === "Engineer") &&
      resource.projectScoped &&
      (!body.project_id ||
        !(await mayAccessProject(
          user,
          String(body.project_id)
        )))
    ) {
      throw new Error("FORBIDDEN");
    }

    if (!body.id) {
      body.id = `${key
        .slice(0, 3)
        .toUpperCase()}-${crypto
        .randomUUID()
        .slice(0, 8)}`;
    }

    if (key === "messages") {
      body.sender_id = user.id;
      body.sender_name = user.name;
    }

    if (key === "approvals") {
      body.submitted_by_id = user.id;
      body.submitted_by_name = user.name;
    }

    if (key === "site_reports") {
      body.created_by_id = user.id;
      body.engineer_name = user.name;
    }

    if (
      key === "timesheets" &&
      user.role === "Engineer"
    ) {
      body.user_id = user.id;
    }

    const columns = Object.keys(
      body
    ).filter((column) =>
      resource.columns.includes(column)
    );

    if (!columns.length) {
      return NextResponse.json(
        {
          error:
            "No writable fields supplied.",
        },
        { status: 400 }
      );
    }

    const result = await query(
      `INSERT INTO ${resource.table}
      (${columns.join(",")})
      VALUES
      (${columns
        .map((_, i) => `$${i + 1}`)
        .join(",")})
      RETURNING *`,
      columns.map(
        (column) => body[column]
      )
    );

    const created = result.rows[0];

    await audit(
      "data.create",
      key,
      String(created.id),
      {
        resource: key,
        projectId:
          created.project_id || null,
      }
    );

    let drive:
      | Awaited<
          ReturnType<
            typeof createProjectDriveFolder
          >
        >
      | null = null;

    if (key === "projects") {
      try {
        drive =
          await createProjectDriveFolder({
            id: String(created.id),
            code: created.code
              ? String(created.code)
              : null,
            name: String(
              created.name ||
                created.id
            ),
          });

        await audit(
          "integration.google_drive.project_folder",
          "projects",
          String(created.id),
          {
            folderId: drive.id,
            folderUrl:
              drive.webViewLink,
          }
        );
      } catch (driveError) {
        console.error(
          "Project created successfully, but Google Drive provisioning failed.",
          driveError
        );
      }
    }

    return NextResponse.json(
      {
        data: created,
        drive,
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ resource: string }>;
  }
) {
  try {
    const { resource: key } =
      await context.params;

    const resource = resourceFor(key);

    const user =
      await requireServerUser(resource.allowed);

    if (user.role === "Client") {
      throw new Error("FORBIDDEN");
    }

    const body =
      await request.json();

    const id = String(
      body?.id || ""
    );

    if (!id) {
      return NextResponse.json(
        { error: "id is required." },
        { status: 400 }
      );
    }

    const existing = await query(
      `SELECT ${
        resource.projectScoped
          ? "project_id"
          : "id"
      }
       FROM ${resource.table}
       WHERE ${resource.idColumn}=$1
       LIMIT 1`,
      [id]
    );

    if (!existing.rows[0]) {
      return NextResponse.json(
        { error: "Not found." },
        { status: 404 }
      );
    }

    if (
      user.role === "Engineer" &&
      resource.projectScoped &&
      !(await mayAccessProject(
        user,
        String(
          existing.rows[0].project_id
        )
      ))
    ) {
      throw new Error("FORBIDDEN");
    }

    const clean = cleanBody(
      body,
      resource
    );

    delete clean.id;

    if (
      key === "approvals" &&
      clean.status !== undefined
    ) {
      const pending = String(
        clean.status
      )
        .toLowerCase()
        .includes("pending");

      clean.reviewed_by_id = pending
        ? null
        : user.id;

      clean.reviewed_by_name = pending
        ? null
        : user.name;

      clean.reviewed_at = pending
        ? null
        : new Date().toISOString();
    }

    const columns =
      Object.keys(clean);

    if (!columns.length) {
      return NextResponse.json(
        {
          error:
            "No writable fields supplied.",
        },
        { status: 400 }
      );
    }

    const assignments =
      columns.map(
        (column, i) =>
          `${column}=$${i + 1}`
      );

    if (resource.hasUpdatedAt) {
      assignments.push(
        "updated_at=NOW()"
      );
    }

    const result = await query(
      `UPDATE ${resource.table}
       SET ${assignments.join(",")}
       WHERE ${
         resource.idColumn
       }=$${columns.length + 1}
       RETURNING *`,
      [
        ...columns.map(
          (column) => clean[column]
        ),
        id,
      ]
    );

    await audit(
      "data.update",
      key,
      id,
      {
        resource: key,
        projectId:
          result.rows[0]
            .project_id ||
          (resource.projectScoped
            ? existing.rows[0]
                .project_id
            : null),
      }
    );

    return NextResponse.json({
      data: result.rows[0],
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ resource: string }>;
  }
) {
  try {
    const { resource: key } =
      await context.params;

    const resource = resourceFor(key);

    const user =
      await requireServerUser(resource.allowed);

    if (
      user.role === "Client" ||
      user.role === "Engineer"
    ) {
      throw new Error("FORBIDDEN");
    }

    const id = new URL(
      request.url
    ).searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "id is required." },
        { status: 400 }
      );
    }

    const result = await query(
      `DELETE FROM ${resource.table}
       WHERE ${resource.idColumn}=$1
       RETURNING ${resource.idColumn}`,
      [id]
    );

    if (!result.rows[0]) {
      return NextResponse.json(
        { error: "Not found." },
        { status: 404 }
      );
    }

    await audit(
      "data.delete",
      key,
      id,
      {
        resource: key,
      }
    );

    return NextResponse.json({
      ok: true,
      id,
    });
  } catch (error) {
    return errorResponse(error);
  }
}