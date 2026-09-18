import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { audit, requireServerUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";

export const runtime = "nodejs";

type TeamRole = "Owner" | "Manager" | "Engineer" | "Client";

function mapUser(row: any) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as TeamRole,
    employeeId: row.employee_id || "",
    clientId: row.client_id || "",
    department: row.department_name || row.department || "",
    departmentId: row.department_id || "",
    position: row.position_name || "",
    positionId: row.position_id || "",
    avatarUrl: row.avatar_url || "",
    active: Boolean(row.active),
    createdAt: row.created_at,
  };
}

function canManageTarget(actorRole: TeamRole, targetRole: TeamRole) {
  if (actorRole === "Owner") {
    return targetRole === "Owner" || targetRole === "Manager" || targetRole === "Engineer";
  }
  if (actorRole === "Manager") {
    return targetRole === "Engineer";
  }
  return false;
}

function canCreateRole(actorRole: TeamRole, targetRole: TeamRole) {
  if (actorRole === "Owner") return targetRole === "Manager" || targetRole === "Engineer";
  if (actorRole === "Manager") return targetRole === "Engineer";
  return false;
}

function errorResponse(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHENTICATED") {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  if (error instanceof Error && error.message === "FORBIDDEN") {
    return NextResponse.json({ error: "You are not allowed to manage the team." }, { status: 403 });
  }
  console.error("Team API error:", error);
  return NextResponse.json({ error: "Team operation failed." }, { status: 500 });
}

const userSelect = `
  SELECT
    u.id,
    u.name,
    u.email,
    u.role,
    u.employee_id,
    u.client_id,
    u.department,
    u.department_id,
    u.position_id,
    u.avatar_url,
    u.active,
    u.created_at,
    d.name AS department_name,
    p.name AS position_name
  FROM users u
  LEFT JOIN departments d ON d.id = u.department_id
  LEFT JOIN positions p ON p.id = u.position_id
`;

async function resolveOrganization(
  departmentIdInput: unknown,
  positionIdInput: unknown,
  departmentNameInput: unknown
) {
  let departmentId = String(departmentIdInput || "").trim().slice(0, 100);
  const positionId = String(positionIdInput || "").trim().slice(0, 100);
  const legacyDepartment = String(departmentNameInput || "").trim().slice(0, 100);

  if (!departmentId && legacyDepartment) {
    const departmentResult = await query(
      `SELECT id FROM departments WHERE lower(name) = lower($1) LIMIT 1`,
      [legacyDepartment]
    );
    departmentId = departmentResult.rows[0]?.id || "";
  }

  if (!departmentId) {
    return { departmentId: null, positionId: null, departmentName: null };
  }

  const departmentResult = await query(
    `SELECT id, name, active FROM departments WHERE id = $1 LIMIT 1`,
    [departmentId]
  );

  if (!departmentResult.rows[0]) {
    throw new Error("INVALID_DEPARTMENT");
  }

  if (!departmentResult.rows[0].active) {
    throw new Error("INACTIVE_DEPARTMENT");
  }

  if (!positionId) {
    return {
      departmentId,
      positionId: null,
      departmentName: departmentResult.rows[0].name,
    };
  }

  const positionResult = await query(
    `
    SELECT id, name, department_id, active
    FROM positions
    WHERE id = $1
    LIMIT 1
    `,
    [positionId]
  );

  if (!positionResult.rows[0]) throw new Error("INVALID_POSITION");

  if (positionResult.rows[0].department_id !== departmentId) {
    throw new Error("POSITION_DEPARTMENT_MISMATCH");
  }

  if (!positionResult.rows[0].active) {
    throw new Error("INACTIVE_POSITION");
  }

  return {
    departmentId,
    positionId,
    departmentName: departmentResult.rows[0].name,
  };
}

function organizationError(error: unknown) {
  const messages: Record<string, string> = {
    INVALID_DEPARTMENT: "Department not found.",
    INACTIVE_DEPARTMENT: "This department is inactive.",
    INVALID_POSITION: "Position not found.",
    INACTIVE_POSITION: "This position is inactive.",
    POSITION_DEPARTMENT_MISMATCH: "The selected position does not belong to the selected department.",
  };

  if (error instanceof Error && messages[error.message]) {
    return NextResponse.json({ error: messages[error.message] }, { status: 400 });
  }

  return null;
}

export async function GET() {
  try {
    await requireServerUser(["Owner", "Manager"]);

    const result = await query(`${userSelect} ORDER BY u.created_at ASC`);

    return NextResponse.json(
      { users: result.rows.map(mapUser) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireServerUser(["Owner", "Manager"]);
    const body = await request.json();

    const name = String(body?.name || "").trim().slice(0, 120);
    const email = String(body?.email || "").trim().toLowerCase().slice(0, 254);
    const password = String(body?.password || "").slice(0, 256);
    const role = String(body?.role || "").trim() as TeamRole;
    const employeeId = String(body?.employeeId || "").trim().slice(0, 50);
    const avatarUrl = String(body?.avatarUrl || "").trim().slice(0, 2_000_000);

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password and role are required." },
        { status: 400 }
      );
    }

    if (!["Manager", "Engineer"].includes(role)) {
      return NextResponse.json({ error: "Invalid team role." }, { status: 400 });
    }

    if (!canCreateRole(actor.role, role)) {
      return NextResponse.json({ error: "You are not allowed to create this role." }, { status: 403 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    const existing = await query(
      `SELECT id FROM users WHERE lower(email) = lower($1) LIMIT 1`,
      [email]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }

    let organization;
    try {
      organization = await resolveOrganization(
        body?.departmentId,
        body?.positionId,
        body?.department
      );
    } catch (error) {
      const response = organizationError(error);
      if (response) return response;
      throw error;
    }

    const id = employeeId || `USR-${Date.now().toString(36).toUpperCase()}`;
    const passwordHash = await bcrypt.hash(password, 12);

    const result = await query(
      `
      INSERT INTO users (
        id,
        name,
        email,
        password_hash,
        role,
        employee_id,
        department,
        department_id,
        position_id,
        avatar_url,
        active
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true)
      RETURNING id, name, email, role, employee_id, client_id,
        department, department_id, position_id, avatar_url, active, created_at
      `,
      [
        id,
        name,
        email,
        passwordHash,
        role,
        employeeId || null,
        organization.departmentName,
        organization.departmentId,
        organization.positionId,
        avatarUrl || null,
      ]
    );

    const user = mapUser(result.rows[0]);
    await audit("user.created", "User", user.id);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error: any) {
    const organizationResponse = organizationError(error);
    if (organizationResponse) return organizationResponse;

    if (error?.code === "23505") {
      return NextResponse.json({ error: "A user with this email or employee ID already exists." }, { status: 409 });
    }

    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const actor = await requireServerUser(["Owner", "Manager"]);
    const body = await request.json();
    const id = String(body?.id || "").trim().slice(0, 100);

    if (!id) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const existingResult = await query(
      `${userSelect} WHERE u.id = $1 LIMIT 1`,
      [id]
    );

    const existing = existingResult.rows[0];

    if (!existing) {
      return NextResponse.json({ error: "Team member not found." }, { status: 404 });
    }

    if (!canManageTarget(actor.role, existing.role)) {
      return NextResponse.json({ error: "You are not allowed to manage this user." }, { status: 403 });
    }

    const targetRole = String(
      body?.role !== undefined ? body.role : existing.role
    ).trim() as TeamRole;

    if (!["Owner", "Manager", "Engineer", "Client"].includes(targetRole)) {
      return NextResponse.json({ error: "Invalid team role." }, { status: 400 });
    }

    if (targetRole !== existing.role && !canCreateRole(actor.role, targetRole)) {
      return NextResponse.json({ error: "You are not allowed to assign this role." }, { status: 403 });
    }

    if (id === actor.id && targetRole !== actor.role) {
      return NextResponse.json({ error: "You cannot change your own system role." }, { status: 400 });
    }

    const name = body?.name !== undefined ? String(body.name).trim().slice(0, 120) : existing.name;
    const email = body?.email !== undefined ? String(body.email).trim().toLowerCase().slice(0, 254) : existing.email;
    const employeeId = body?.employeeId !== undefined ? String(body.employeeId).trim().slice(0, 50) : existing.employee_id || "";
    const avatarUrl = body?.avatarUrl !== undefined ? String(body.avatarUrl).trim().slice(0, 2_000_000) : existing.avatar_url || "";
    const active = body?.active !== undefined ? Boolean(body.active) : Boolean(existing.active);
    const password = body?.password !== undefined ? String(body.password).slice(0, 256) : "";

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
    }

    if (id === actor.id && !active) {
      return NextResponse.json({ error: "You cannot deactivate your own account." }, { status: 400 });
    }

    const duplicate = await query(
      `SELECT id FROM users WHERE lower(email) = lower($1) AND id <> $2 LIMIT 1`,
      [email, id]
    );

    if (duplicate.rows.length > 0) {
      return NextResponse.json({ error: "A user with this email already exists." }, { status: 409 });
    }

    let organization;
    try {
      organization = await resolveOrganization(
        body?.departmentId !== undefined ? body.departmentId : existing.department_id,
        body?.positionId !== undefined ? body.positionId : existing.position_id,
        body?.department !== undefined ? body.department : existing.department
      );
    } catch (error) {
      const response = organizationError(error);
      if (response) return response;
      throw error;
    }

    let result;

    if (password) {
      if (password.length < 8) {
        return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      }

      const passwordHash = await bcrypt.hash(password, 12);

      result = await query(
        `
        UPDATE users
        SET
          name = $1,
          email = $2,
          role = $3,
          employee_id = $4,
          department = $5,
          department_id = $6,
          position_id = $7,
          avatar_url = $8,
          active = $9,
          password_hash = $10,
          updated_at = NOW()
        WHERE id = $11
        RETURNING id, name, email, role, employee_id, client_id,
          department, department_id, position_id, avatar_url, active, created_at
        `,
        [
          name, email, targetRole, employeeId || null,
          organization.departmentName, organization.departmentId,
          organization.positionId, avatarUrl || null, active,
          passwordHash, id
        ]
      );
    } else {
      result = await query(
        `
        UPDATE users
        SET
          name = $1,
          email = $2,
          role = $3,
          employee_id = $4,
          department = $5,
          department_id = $6,
          position_id = $7,
          avatar_url = $8,
          active = $9,
          updated_at = NOW()
        WHERE id = $10
        RETURNING id, name, email, role, employee_id, client_id,
          department, department_id, position_id, avatar_url, active, created_at
        `,
        [
          name, email, targetRole, employeeId || null,
          organization.departmentName, organization.departmentId,
          organization.positionId, avatarUrl || null, active, id
        ]
      );
    }

    const user = mapUser(result.rows[0]);
    await audit("user.updated", "User", user.id);

    return NextResponse.json({ user });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const actor = await requireServerUser(["Owner", "Manager"]);
    const body = await request.json();
    const id = String(body?.id || "").trim().slice(0, 100);

    if (!id) return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    if (id === actor.id) return NextResponse.json({ error: "You cannot delete your own account." }, { status: 400 });

    const existingResult = await query(`SELECT id, role FROM users WHERE id = $1 LIMIT 1`, [id]);
    const existing = existingResult.rows[0];

    if (!existing) return NextResponse.json({ error: "Team member not found." }, { status: 404 });

    if (!canManageTarget(actor.role, existing.role)) {
      return NextResponse.json({ error: "You are not allowed to delete this user." }, { status: 403 });
    }

    await query(`DELETE FROM users WHERE id = $1`, [id]);
    await audit("user.deleted", "User", id);

    return NextResponse.json({ success: true });
  } catch (error) {
    return errorResponse(error);
  }
}
