import { NextResponse } from "next/server";
import { audit, requireServerUser } from "@/lib/server/auth";
import { withTransaction } from "@/lib/server/db";
import type { PoolClient } from "pg";

export const runtime = "nodejs";

type LegacyRecord = Record<string, unknown>;
type LegacyPayload = Record<string, LegacyRecord[]>;

const array = (value: unknown): LegacyRecord[] =>
  Array.isArray(value) ? value.filter((item): item is LegacyRecord => Boolean(item) && typeof item === "object") : [];
const text = (value: unknown) => typeof value === "string" ? value.trim() : "";
const date = (value: unknown) => text(value).slice(0, 10) || null;

async function insert(client: PoolClient, sql: string, values: unknown[]) {
  await client.query(sql, values);
}

export async function POST(request: Request) {
  try {
    const user = await requireServerUser(["Owner", "Manager"]);
    const payload = await request.json() as LegacyPayload;
    const counts = { clients: 0, projects: 0, messages: 0, notifications: 0, documents: 0, procurement: 0 };

    await withTransaction(async (client) => {
      for (const item of array(payload.clients)) {
        const id = text(item.id) || text(item.code);
        const name = text(item.name);
        if (!id || !name) continue;
        await insert(client,
          "INSERT INTO clients (id,name,contact_name,contact_email,contact_phone,active) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (id) DO NOTHING",
          [id, name, text(item.contactName) || name, text(item.email) || null, text(item.phone) || null, item.status !== "Inactive"],
        );
        counts.clients++;
      }

      for (const item of array(payload.projects)) {
        const id = text(item.id) || text(item.code);
        const code = text(item.code) || id;
        const name = text(item.name);
        if (!id || !code || !name) continue;
        await insert(client,
          "INSERT INTO projects (id,code,name,type,location,status,phase,description,client_id,client_name,project_manager_id,project_manager_name,start_date,target_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) ON CONFLICT (id) DO NOTHING",
          [id, code, name, text(item.type) || "Unclassified", text(item.location) || "Unspecified", text(item.status) || "Active", text(item.phase) || "Concept Design", text(item.description), text(item.clientId) || null, text(item.clientName) || null, text(item.projectManagerId) || null, text(item.projectManagerName) || null, date(item.startDate), date(item.targetDate)],
        );
        counts.projects++;
      }

      for (const item of array(payload.messages)) {
        const id = text(item.id);
        const body = text(item.body);
        if (!id || !body) continue;
        await insert(client,
          "INSERT INTO messages (id,project_id,sender_id,sender_name,body,created_at) VALUES ($1,$2,$3,$4,$5,COALESCE($6::timestamptz,NOW())) ON CONFLICT (id) DO NOTHING",
          [id, text(item.projectId) || null, text(item.senderId) || null, text(item.senderName) || "Legacy user", body, text(item.createdAt) || null],
        );
        counts.messages++;
      }

      for (const item of array(payload.notifications)) {
        const id = text(item.id);
        const title = text(item.title);
        if (!id || !title) continue;
        await insert(client,
          "INSERT INTO notifications (id,user_id,type,priority,title,body,read_at,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,COALESCE($8::timestamptz,NOW())) ON CONFLICT (id) DO NOTHING",
          [id, user.id, text(item.type) || "system", text(item.priority) || "Medium", title, text(item.message), item.read ? new Date() : null, text(item.createdAt) || null],
        );
        counts.notifications++;
      }

      for (const item of array(payload.documents)) {
        const legacyId = text(item.id);
        const name = text(item.name);
        if (!legacyId || !name) continue;
        const tags = Array.isArray(item.tags) ? item.tags.filter((tag): tag is string => typeof tag === "string") : [];
        await insert(client,
          "INSERT INTO office_documents (legacy_id,project_id,name,category,revision,status,owner_name,file_url,tags,created_at,updated_at) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,COALESCE($10::timestamptz,NOW()),COALESCE($11::timestamptz,NOW())) ON CONFLICT (legacy_id) DO NOTHING",
          [legacyId, text(item.projectId) || null, name, text(item.category) || null, text(item.revision) || null, text(item.status) || "Draft", text(item.owner) || null, text(item.fileUrl) || null, tags, text(item.createdAt) || null, text(item.updatedAt) || null],
        );
        counts.documents++;
      }

      for (const item of array(payload.procurement)) {
        const id = text(item.id);
        const projectId = text(item.projectId);
        const name = text(item.item);
        if (!id || !name) continue;
        await insert(client,
          "INSERT INTO procurement_items (id,project_id,item,status,priority,supplier,needed_by,created_at) VALUES ($1,$2,$3,$4,$5,$6,$7,COALESCE($8::timestamptz,NOW())) ON CONFLICT (id) DO NOTHING",
          [id, projectId || null, name, text(item.status) || "Requested", "Medium", text(item.vendor) || null, date(item.requiredDate), text(item.createdAt) || null],
        );
        counts.procurement++;
      }
    });

    await audit("migration.local_storage", "workspace", user.id, counts);
    return NextResponse.json({ ok: true, counts });
  } catch (error) {
    console.error("Local-storage migration failed", error);
    const message = error instanceof Error ? error.message : "Migration failed.";
    const status = message === "UNAUTHENTICATED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: status === 500 ? "Migration failed." : message }, { status });
  }
}
