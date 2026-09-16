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
    department: row.department || "",
    active: Boolean(row.active),
    createdAt: row.created_at,
  };
}

function canManageTarget(
  actorRole: TeamRole,
  targetRole: TeamRole
) {
  if (actorRole === "Owner") {
    return (
      targetRole === "Owner" ||
      targetRole === "Manager" ||
      targetRole === "Engineer"
    );
  }

  if (actorRole === "Manager") {
    return targetRole === "Engineer";
  }

  return false;
}

function canCreateRole(
  actorRole: TeamRole,
  targetRole: TeamRole
) {
  if (actorRole === "Owner") {
    return (
      targetRole === "Manager" ||
      targetRole === "Engineer"
    );
  }

  if (actorRole === "Manager") {
    return targetRole === "Engineer";
  }

  return false;
}

function errorResponse(error: unknown) {
  if (
    error instanceof Error &&
    error.message === "UNAUTHENTICATED"
  ) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  if (
    error instanceof Error &&
    error.message === "FORBIDDEN"
  ) {
    return NextResponse.json(
      { error: "You are not allowed to manage the team." },
      { status: 403 }
    );
  }

  console.error("Team API error:", error);

  return NextResponse.json(
    { error: "Team operation failed." },
    { status: 500 }
  );
}

/* -------------------------------------------------------------------------- */
/* GET TEAM                                                                   */
/* -------------------------------------------------------------------------- */

export async function GET() {
  try {
    await requireServerUser(["Owner", "Manager"]);

    const result = await query(`
      SELECT
        id,
        name,
        email,
        role,
        employee_id,
        department,
        active,
        created_at
      FROM users
      ORDER BY created_at ASC
    `);

    return NextResponse.json(
      {
        users: result.rows.map(mapUser),
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

/* -------------------------------------------------------------------------- */
/* CREATE TEAM MEMBER                                                         */
/* -------------------------------------------------------------------------- */

export async function POST(request: Request) {
  try {
    const actor = await requireServerUser([
      "Owner",
      "Manager",
    ]);

    const body = await request.json();

    const name = String(body?.name || "")
      .trim()
      .slice(0, 120);

    const email = String(body?.email || "")
      .trim()
      .toLowerCase()
      .slice(0, 254);

    const password = String(body?.password || "")
      .slice(0, 256);

    const role = String(body?.role || "")
      .trim() as TeamRole;

    const employeeId = String(body?.employeeId || "")
      .trim()
      .slice(0, 50);

    const department = String(body?.department || "")
      .trim()
      .slice(0, 100);

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        {
          error:
            "Name, email, password and role are required.",
        },
        { status: 400 }
      );
    }

    if (
      !["Manager", "Engineer"].includes(role)
    ) {
      return NextResponse.json(
        { error: "Invalid team role." },
        { status: 400 }
      );
    }

    if (!canCreateRole(actor.role, role)) {
      return NextResponse.json(
        {
          error:
            "You are not allowed to create this role.",
        },
        { status: 403 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    const existing = await query(
      `
      SELECT id
      FROM users
      WHERE lower(email) = lower($1)
      LIMIT 1
      `,
      [email]
    );

    if (existing.rows.length > 0) {
      return NextResponse.json(
        {
          error:
            "A user with this email already exists.",
        },
        { status: 409 }
      );
    }

    const id =
      employeeId ||
      `USR-${Date.now().toString(36).toUpperCase()}`;

    const passwordHash = await bcrypt.hash(
      password,
      12
    );

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
        active
      )
      VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        true
      )
      RETURNING
        id,
        name,
        email,
        role,
        employee_id,
        department,
        active,
        created_at
      `,
      [
        id,
        name,
        email,
        passwordHash,
        role,
        employeeId || null,
        department || null,
      ]
    );

    const user = mapUser(result.rows[0]);

    await audit(
      "user.created",
      "User",
      user.id
    );

    return NextResponse.json(
      { user },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

/* -------------------------------------------------------------------------- */
/* UPDATE TEAM MEMBER                                                         */
/* -------------------------------------------------------------------------- */

export async function PATCH(request: Request) {
  try {
    const actor = await requireServerUser([
      "Owner",
      "Manager",
    ]);

    const body = await request.json();

    const id = String(body?.id || "")
      .trim()
      .slice(0, 100);

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    const existingResult = await query(
      `
      SELECT
        id,
        name,
        email,
        role,
        employee_id,
        department,
        active
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    );

    const existing = existingResult.rows[0];

    if (!existing) {
      return NextResponse.json(
        { error: "Team member not found." },
        { status: 404 }
      );
    }

    const targetRole =
      String(body?.role || existing.role)
        .trim() as TeamRole;

    if (
      !canManageTarget(
        actor.role,
        existing.role
      )
    ) {
      return NextResponse.json(
        {
          error:
            "You are not allowed to manage this user.",
        },
        { status: 403 }
      );
    }

    if (
      targetRole !== existing.role &&
      !canCreateRole(actor.role, targetRole)
    ) {
      return NextResponse.json(
        {
          error:
            "You are not allowed to assign this role.",
        },
        { status: 403 }
      );
    }

    const name =
      body?.name !== undefined
        ? String(body.name)
            .trim()
            .slice(0, 120)
        : existing.name;

    const email =
      body?.email !== undefined
        ? String(body.email)
            .trim()
            .toLowerCase()
            .slice(0, 254)
        : existing.email;

    const employeeId =
      body?.employeeId !== undefined
        ? String(body.employeeId)
            .trim()
            .slice(0, 50)
        : existing.employee_id || "";

    const department =
      body?.department !== undefined
        ? String(body.department)
            .trim()
            .slice(0, 100)
        : existing.department || "";

    const active =
      body?.active !== undefined
        ? Boolean(body.active)
        : Boolean(existing.active);

    const password =
      body?.password !== undefined
        ? String(body.password).slice(0, 256)
        : "";

    if (!name || !email) {
      return NextResponse.json(
        {
          error:
            "Name and email are required.",
        },
        { status: 400 }
      );
    }

    const duplicate = await query(
      `
      SELECT id
      FROM users
      WHERE lower(email) = lower($1)
        AND id <> $2
      LIMIT 1
      `,
      [email, id]
    );

    if (duplicate.rows.length > 0) {
      return NextResponse.json(
        {
          error:
            "A user with this email already exists.",
        },
        { status: 409 }
      );
    }

    let result;

    if (password) {
      if (password.length < 8) {
        return NextResponse.json(
          {
            error:
              "Password must be at least 8 characters.",
          },
          { status: 400 }
        );
      }

      const passwordHash =
        await bcrypt.hash(password, 12);

      result = await query(
        `
        UPDATE users
        SET
          name = $1,
          email = $2,
          role = $3,
          employee_id = $4,
          department = $5,
          active = $6,
          password_hash = $7,
          updated_at = NOW()
        WHERE id = $8
        RETURNING
          id,
          name,
          email,
          role,
          employee_id,
          department,
          active,
          created_at
        `,
        [
          name,
          email,
          targetRole,
          employeeId || null,
          department || null,
          active,
          passwordHash,
          id,
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
          active = $6,
          updated_at = NOW()
        WHERE id = $7
        RETURNING
          id,
          name,
          email,
          role,
          employee_id,
          department,
          active,
          created_at
        `,
        [
          name,
          email,
          targetRole,
          employeeId || null,
          department || null,
          active,
          id,
        ]
      );
    }

    const user = mapUser(result.rows[0]);

    await audit(
      "user.updated",
      "User",
      user.id
    );

    return NextResponse.json({ user });
  } catch (error) {
    return errorResponse(error);
  }
}

/* -------------------------------------------------------------------------- */
/* DELETE TEAM MEMBER                                                         */
/* -------------------------------------------------------------------------- */

export async function DELETE(request: Request) {
  try {
    const actor = await requireServerUser([
      "Owner",
      "Manager",
    ]);

    const body = await request.json();

    const id = String(body?.id || "")
      .trim()
      .slice(0, 100);

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    if (id === actor.id) {
      return NextResponse.json(
        {
          error:
            "You cannot delete your own account.",
        },
        { status: 400 }
      );
    }

    const existingResult = await query(
      `
      SELECT id, role
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [id]
    );

    const existing = existingResult.rows[0];

    if (!existing) {
      return NextResponse.json(
        { error: "Team member not found." },
        { status: 404 }
      );
    }

    if (
      !canManageTarget(
        actor.role,
        existing.role
      )
    ) {
      return NextResponse.json(
        {
          error:
            "You are not allowed to delete this user.",
        },
        { status: 403 }
      );
    }

    await query(
      `DELETE FROM users WHERE id = $1`,
      [id]
    );

    await audit(
      "user.deleted",
      "User",
      id
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    return errorResponse(error);
  }
}