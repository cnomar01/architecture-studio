import { NextResponse } from "next/server";
import { audit, requireServerUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Resource = {
  table: string;
  idColumn: string;
  allowed: Array<"Owner" | "Manager" | "Engineer">;
  columns: string[];
};

const RESOURCES: Record<string, Resource> = {
  projects: { table: "projects", idColumn: "id", allowed: ["Owner", "Manager", "Engineer"], columns: ["id","code","name","type","location","status","phase","description","client_id","client_name","project_manager_id","project_manager_name","start_date","target_date"] },
  tasks: { table: "tasks", idColumn: "id", allowed: ["Owner", "Manager", "Engineer"], columns: ["id","project_id","project_name","title","description","assignee_id","assignee_name","department","priority","status","deadline","parent_task_id"] },
  files: { table: "project_files", idColumn: "id", allowed: ["Owner","Manager","Engineer"], columns: ["id","project_id","project_name","name","category","revision","status","storage_key","file_name","file_type","file_size","uploaded_by_id","uploaded_by_name","parent_file_id","is_current"] },
  approvals: { table: "approvals", idColumn: "id", allowed: ["Owner","Manager","Engineer"], columns: ["id","project_id","project_name","title","type","revision","status","submitted_by_id","submitted_by_name","reviewed_by_id","reviewed_by_name"] },
  messages: { table: "messages", idColumn: "id", allowed: ["Owner","Manager","Engineer"], columns: ["id","project_id","sender_id","sender_name","body"] },
  finance: { table: "finance_transactions", idColumn: "id", allowed: ["Owner","Manager"], columns: ["id","project_id","type","category","amount","currency","status","description"] },
  site_reports: { table: "site_reports", idColumn: "id", allowed: ["Owner","Manager","Engineer"], columns: ["id","project_id","report_date","weather","summary","created_by_id"] },
  site_issues: { table: "site_issues", idColumn: "id", allowed: ["Owner","Manager","Engineer"], columns: ["id","project_id","title","description","priority","status","assigned_to_id","task_id"] },
  leads: { table: "leads", idColumn: "id", allowed: ["Owner","Manager"], columns: ["id","company","status","contact_name","email","notes"] },
  contracts: { table: "contracts", idColumn: "id", allowed: ["Owner","Manager"], columns: ["id","project_id","title","status","value","currency","start_date","end_date"] },
  procurement: { table: "procurement_items", idColumn: "id", allowed: ["Owner","Manager","Engineer"], columns: ["id","project_id","item","status","priority","supplier","needed_by"] },
  quality: { table: "quality_items", idColumn: "id", allowed: ["Owner","Manager","Engineer"], columns: ["id","project_id","title","status","priority","description"] },
  safety: { table: "safety_items", idColumn: "id", allowed: ["Owner","Manager","Engineer"], columns: ["id","project_id","title","status","severity","description"] },
  timesheets: { table: "timesheets", idColumn: "id", allowed: ["Owner","Manager","Engineer"], columns: ["id","user_id","project_id","work_date","hours","description"] },
  construction: { table: "construction_items", idColumn: "id", allowed: ["Owner","Manager","Engineer"], columns: ["id","project_id","type","title","status","priority","description"] },
};

function resourceFor(value: string) {
  const resource = RESOURCES[value];
  if (!resource) throw new Error("RESOURCE_NOT_FOUND");
  return resource;
}

function cleanBody(body: Record<string, unknown>, resource: Resource) {
  const out: Record<string, unknown> = {};
  for (const column of resource.columns) if (Object.prototype.hasOwnProperty.call(body, column)) out[column] = body[column];
  return out;
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message === "UNAUTHENTICATED") return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  if (message === "FORBIDDEN") return NextResponse.json({ error: "You do not have permission to perform this action." }, { status: 403 });
  if (message === "RESOURCE_NOT_FOUND") return NextResponse.json({ error: "Resource not found." }, { status: 404 });
  console.error("Data API request failed", error);
  return NextResponse.json({ error: "Request failed." }, { status: 500 });
}

export async function GET(request: Request, context: { params: Promise<{ resource: string }> }) {
  try {
    const { resource: key } = await context.params;
    const resource = resourceFor(key);
    const user = await requireServerUser(resource.allowed);
    const url = new URL(request.url);
    const projectId = url.searchParams.get("projectId");
    const limit = Math.min(Math.max(Number(url.searchParams.get("limit") || 100), 1), 500);
    const values: unknown[] = [];
    const where = projectId ? ` WHERE project_id=$1` : "";
    if (projectId) values.push(projectId);
    const result = await query(`SELECT ${resource.columns.join(",")} FROM ${resource.table}${where} ORDER BY created_at DESC LIMIT ${limit}`, values);
    return NextResponse.json({ data: result.rows, count: result.rowCount ?? result.rows.length, actor: user.id });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: Request, context: { params: Promise<{ resource: string }> }) {
  try {
    const { resource: key } = await context.params;
    const resource = resourceFor(key);
    const user = await requireServerUser(resource.allowed);
    const body = cleanBody(await request.json(), resource);
    if (!body.id) body.id = `${key.slice(0, 3).toUpperCase()}-${crypto.randomUUID().slice(0, 8)}`;
    if (key === "messages" && !body.sender_id) { body.sender_id = user.id; body.sender_name = user.name; }
    const columns = Object.keys(body).filter((column) => resource.columns.includes(column));
    if (!columns.length) return NextResponse.json({ error: "No writable fields supplied." }, { status: 400 });
    const placeholders = columns.map((_, index) => `$${index + 1}`);
    const values = columns.map((column) => body[column]);
    const result = await query(`INSERT INTO ${resource.table} (${columns.join(",")}) VALUES (${placeholders.join(",")}) RETURNING *`, values);
    const row = result.rows[0];
    await audit("data.create", key, String(row.id), { resource: key });
    return NextResponse.json({ data: row }, { status: 201 });
  } catch (error) { return errorResponse(error); }
}

export async function PATCH(request: Request, context: { params: Promise<{ resource: string }> }) {
  try {
    const { resource: key } = await context.params;
    const resource = resourceFor(key);
    await requireServerUser(resource.allowed);
    const body = await request.json();
    const id = String(body?.id || "");
    if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });
    const clean = cleanBody(body, resource);
    delete clean.id;
    const columns = Object.keys(clean);
    if (!columns.length) return NextResponse.json({ error: "No writable fields supplied." }, { status: 400 });
    const values = columns.map((column) => clean[column]);
    values.push(id);
    const assignments = columns.map((column, index) => `${column}=$${index + 1}`);
    const result = await query(`UPDATE ${resource.table} SET ${assignments.join(",")}, updated_at=NOW() WHERE ${resource.idColumn}=$${values.length} RETURNING *`, values);
    if (!result.rows[0]) return NextResponse.json({ error: "Not found." }, { status: 404 });
    await audit("data.update", key, id, { resource: key });
    return NextResponse.json({ data: result.rows[0] });
  } catch (error) { return errorResponse(error); }
}

export async function DELETE(request: Request, context: { params: Promise<{ resource: string }> }) {
  try {
    const { resource: key } = await context.params;
    const resource = resourceFor(key);
    await requireServerUser(resource.allowed);
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required." }, { status: 400 });
    const result = await query(`DELETE FROM ${resource.table} WHERE ${resource.idColumn}=$1 RETURNING ${resource.idColumn}`, [id]);
    if (!result.rows[0]) return NextResponse.json({ error: "Not found." }, { status: 404 });
    await audit("data.delete", key, id, { resource: key });
    return NextResponse.json({ ok: true, id });
  } catch (error) { return errorResponse(error); }
}
