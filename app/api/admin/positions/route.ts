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
  console.error("Positions API error:", error);
  return NextResponse.json({ error: "Position operation failed." }, { status: 500 });
}

export async function GET(request: Request) {
  try {
    await requireServerUser(["Owner", "Manager"]);

    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get("departmentId")?.trim();

    const result = departmentId
      ? await query(
          `
          SELECT
            p.id,
            p.department_id,
            p.code,
            p.name,
            p.active,
            p.created_at,
            p.updated_at,
            d.name AS department_name
          FROM positions p
          JOIN departments d ON d.id = p.department_id
          WHERE p.department_id = $1
          ORDER BY p.name ASC
          `,
          [departmentId]
        )
      : await query(`
          SELECT
            p.id,
            p.department_id,
            p.code,
            p.name,
            p.active,
            p.created_at,
            p.updated_at,
            d.name AS department_name
          FROM positions p
          JOIN departments d ON d.id = p.department_id
          ORDER BY d.name ASC, p.name ASC
        `);

    return NextResponse.json(
      { positions: result.rows },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    await requireServerUser(["Owner"]);

    const body = await request.json();
    const departmentId = String(body?.departmentId || "").trim().slice(0, 100);
    const name = String(body?.name || "").trim().slice(0, 100);
    const code = String(body?.code || "")
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9_-]/g, "")
      .slice(0, 30);

    if (!departmentId || !name || !code) {
      return NextResponse.json(
        { error: "Department, position name and code are required." },
        { status: 400 }
      );
    }

    const department = await query(
      `SELECT id FROM departments WHERE id = $1 AND active = true LIMIT 1`,
      [departmentId]
    );

    if (!department.rows[0]) {
      return NextResponse.json({ error: "Active department not found." }, { status: 404 });
    }

    const id = `POS-${Date.now().toString(36).toUpperCase()}`;

    const result = await query(
      `
      INSERT INTO positions (id, department_id, code, name, active)
      VALUES ($1, $2, $3, $4, true)
      RETURNING id, department_id, code, name, active, created_at, updated_at
      `,
      [id, departmentId, code, name]
    );

    await audit("position.created", "Position", id);

    return NextResponse.json({ position: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "A position with this name or code already exists in this department." },
        { status: 409 }
      );
    }
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    await requireServerUser(["Owner"]);

    const body = await request.json();
    const id = String(body?.id || "").trim().slice(0, 100);

    if (!id) {
      return NextResponse.json({ error: "Position ID is required." }, { status: 400 });
    }

    const existing = await query(
      `SELECT id, department_id, code, name, active FROM positions WHERE id = $1 LIMIT 1`,
      [id]
    );

    if (!existing.rows[0]) {
      return NextResponse.json({ error: "Position not found." }, { status: 404 });
    }

    const departmentId =
      body?.departmentId !== undefined
        ? String(body.departmentId).trim().slice(0, 100)
        : existing.rows[0].department_id;

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

    const department = await query(
      `SELECT id FROM departments WHERE id = $1 LIMIT 1`,
      [departmentId]
    );

    if (!department.rows[0]) {
      return NextResponse.json({ error: "Department not found." }, { status: 404 });
    }

    if (!name || !code) {
      return NextResponse.json({ error: "Position name and code are required." }, { status: 400 });
    }

    const result = await query(
      `
      UPDATE positions
      SET department_id = $1, name = $2, code = $3, active = $4, updated_at = NOW()
      WHERE id = $5
      RETURNING id, department_id, code, name, active, created_at, updated_at
      `,
      [departmentId, name, code, active, id]
    );

    await audit("position.updated", "Position", id);

    return NextResponse.json({ position: result.rows[0] });
  } catch (error: any) {
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "A position with this name or code already exists in this department." },
        { status: 409 }
      );
    }
    return errorResponse(error);
  }
}
