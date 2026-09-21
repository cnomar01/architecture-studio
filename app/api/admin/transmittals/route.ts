import { NextResponse } from "next/server";
import { audit, requireServerUser } from "@/lib/server/auth";
import { withTransaction } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const statuses = new Set(["Draft", "Issued", "Acknowledged"]);
const text = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";
const ids = (value: unknown) => Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === "string" && /^[A-Za-z0-9-]{1,100}$/.test(item)).slice(0, 30))] : [];
const select = `SELECT t.id,t.number,t.project_id,t.project_name,t.subject,t.recipient,t.issued_by,t.issued_date,t.status,t.notes,t.created_at,t.updated_at,
  COALESCE(json_agg(json_build_object('id',f.id,'name',f.name,'revision',f.revision,'status',f.status) ORDER BY f.name) FILTER (WHERE f.id IS NOT NULL),'[]'::json) AS files
  FROM transmittals t LEFT JOIN transmittal_files tf ON tf.transmittal_id=t.id LEFT JOIN project_files f ON f.id=tf.file_id`;

function payload(body: Record<string, unknown>) {
  const status = text(body.status, 40) || "Draft";
  return {
    projectId: text(body.project_id, 100) || null,
    projectName: text(body.project_name, 180),
    subject: text(body.subject, 240),
    recipient: text(body.recipient, 180),
    issuedBy: text(body.issued_by, 180) || "Mason & Arc",
    issuedDate: text(body.issued_date, 10) || new Date().toISOString().slice(0, 10),
    status: statuses.has(status) ? status : "Draft",
    notes: text(body.notes, 8000),
    fileIds: ids(body.file_ids),
  };
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message === "UNAUTHENTICATED") return NextResponse.json({ error: "Sign in to manage transmittals." }, { status: 401 });
  if (message === "FORBIDDEN") return NextResponse.json({ error: "You do not have permission to manage transmittals." }, { status: 403 });
  console.error("Transmittal API error", error);
  return NextResponse.json({ error: "Could not complete the transmittal request." }, { status: 500 });
}

async function readOne(id: string) {
  return withTransaction(async (client) => {
    const result = await client.query(`${select} WHERE t.id=$1 GROUP BY t.id`, [id]);
    return result.rows[0] || null;
  });
}

export async function GET() {
  try {
    await requireServerUser(["Owner", "Manager"]);
    const result = await withTransaction((client) => client.query(`${select} GROUP BY t.id ORDER BY t.issued_date DESC,t.created_at DESC`));
    return NextResponse.json({ transmittals: result.rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return errorResponse(error); }
}

export async function POST(request: Request) {
  try {
    const user = await requireServerUser(["Owner", "Manager"]);
    const value = payload(await request.json());
    if (!value.subject || !value.recipient) return NextResponse.json({ error: "Subject and recipient are required." }, { status: 400 });
    const id = `TR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const item = await withTransaction(async (client) => {
      await client.query(`INSERT INTO transmittals(id,number,project_id,project_name,subject,recipient,issued_by,issued_date,status,notes) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`, [id, `MA-${id}`, value.projectId, value.projectName, value.subject, value.recipient, value.issuedBy, value.issuedDate, value.status, value.notes]);
      if (value.fileIds.length) await client.query("INSERT INTO transmittal_files(transmittal_id,file_id) SELECT $1,unnest($2::text[])", [id, value.fileIds]);
      const result = await client.query(`${select} WHERE t.id=$1 GROUP BY t.id`, [id]);
      return result.rows[0];
    });
    await audit("transmittal.created", "Transmittal", id, { actor: user.id });
    return NextResponse.json({ transmittal: item }, { status: 201 });
  } catch (error) { return errorResponse(error); }
}

export async function PATCH(request: Request) {
  try {
    const user = await requireServerUser(["Owner", "Manager"]);
    const raw = await request.json() as Record<string, unknown>;
    const id = text(raw.id, 100);
    const value = payload(raw);
    if (!id || !value.subject || !value.recipient) return NextResponse.json({ error: "ID, subject and recipient are required." }, { status: 400 });
    const item = await withTransaction(async (client) => {
      const updated = await client.query(`UPDATE transmittals SET project_id=$1,project_name=$2,subject=$3,recipient=$4,issued_by=$5,issued_date=$6,status=$7,notes=$8,updated_at=NOW() WHERE id=$9 RETURNING id`, [value.projectId, value.projectName, value.subject, value.recipient, value.issuedBy, value.issuedDate, value.status, value.notes, id]);
      if (!updated.rows[0]) return null;
      await client.query("DELETE FROM transmittal_files WHERE transmittal_id=$1", [id]);
      if (value.fileIds.length) await client.query("INSERT INTO transmittal_files(transmittal_id,file_id) SELECT $1,unnest($2::text[])", [id, value.fileIds]);
      const result = await client.query(`${select} WHERE t.id=$1 GROUP BY t.id`, [id]);
      return result.rows[0];
    });
    if (!item) return NextResponse.json({ error: "Transmittal not found." }, { status: 404 });
    await audit("transmittal.updated", "Transmittal", id, { actor: user.id });
    return NextResponse.json({ transmittal: item });
  } catch (error) { return errorResponse(error); }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireServerUser(["Owner", "Manager"]);
    const id = new URL(request.url).searchParams.get("id") || "";
    if (!id) return NextResponse.json({ error: "ID is required." }, { status: 400 });
    const removed = await withTransaction((client) => client.query("DELETE FROM transmittals WHERE id=$1 RETURNING id", [id]));
    if (!removed.rows[0]) return NextResponse.json({ error: "Transmittal not found." }, { status: 404 });
    await audit("transmittal.deleted", "Transmittal", id, { actor: user.id });
    return NextResponse.json({ ok: true, id });
  } catch (error) { return errorResponse(error); }
}
