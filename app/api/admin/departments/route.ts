import { NextResponse } from "next/server";
import { audit, requireServerUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";

export const runtime = "nodejs";

function errorResponse(error: unknown) {
  if (error instanceof Error && error.message === "UNAUTHENTICATED") {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  if (error instanceof Error && error.message === "FORBIDDEN") {
    return NextResponse.json({ error: "You are not allowed to manage organization data." }, { status: 403 });
  }
  console.error("Departments API error:", error);
  return NextResponse.json({ error: "Department operation failed." }, { status: 500 });
}

export async function GET() {
  try {
    await requireServerUser(["Owner", "Manager"]);

    const result = await query(`
      SELECT id, code, name, active, created_at, updated_at
      FROM departments
      ORDER BY name ASC
    `);

    return NextResponse.json(
      { departments: result.rows },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const actor = await requireServerUser(["Owner"]);

    const body = await request.json();
    const name = String(body?.name || "").trim().slice(0, 100);
    const code = String(body?.code || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9_-]/g, "")
      .slice(0, 30);

    if (!name || !code) {
      return NextResponse.json(
        { error: "Department name and code are required." },
        { status: 400 }
      );
    }

    const id = `DEP-${Date.now().toString(36).toUpperCase()}`;

    const result = await query(
      `
      INSERT INTO departments (id, code, name, active)
      VALUES ($1, $2, $3, true)
      RETURNING id, code, name, active, created_at, updated_at
      `,
      [id, code, name]
    );

    await audit("department.created", "Department", id);

    return NextResponse.json(
      { department: result.rows[0] },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "A department with this name or code already exists." },
        { status: 409 }
      );
    }
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    const actor = await requireServerUser(["Owner"]);

    const body = await request.json();
    const id = String(body?.id || "").trim().slice(0, 100);

    if (!id) {
      return NextResponse.json({ error: "Department ID is required." }, { status: 400 });
    }

    const existing = await query(
      `SELECT id, code, name, active FROM departments WHERE id = $1 LIMIT 1`,
      [id]
    );

    if (!existing.rows[0]) {
      return NextResponse.json({ error: "Department not found." }, { status: 404 });
    }

    const name =
      body?.name !== undefined
        ? String(body.name).trim().slice(0, 100)
        : existing.rows[0].name;

    const code =
      body?.code !== undefined
        ? String(body.code).trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 30)
        : existing.rows[0].code;

    const active =
      body?.active !== undefined
        ? Boolean(body.active)
        : Boolean(existing.rows[0].active);

    if (!name || !code) {
      return NextResponse.json({ error: "Department name and code are required." }, { status: 400 });
    }

    const result = await query(
      `
      UPDATE departments
      SET name = $1, code = $2, active = $3, updated_at = NOW()
      WHERE id = $4
      RETURNING id, code, name, active, created_at, updated_at
      `,
      [name, code, active, id]
    );

    await audit("department.updated", "Department", id);

    return NextResponse.json({ department: result.rows[0] });
  } catch (error: any) {
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "A department with this name or code already exists." },
        { status: 409 }
      );
    }
    return errorResponse(error);
  }
}
