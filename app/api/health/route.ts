import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";
export const runtime = "nodejs";

function databaseErrorCode(error: unknown) {
  if (!error || typeof error !== "object") return "UNKNOWN";
  const candidate = error as { code?: unknown; cause?: { code?: unknown } };
  if (typeof candidate.code === "string") return candidate.code;
  if (typeof candidate.cause?.code === "string") return candidate.cause.code;
  return "UNKNOWN";
}

function databaseErrorReason(error: unknown) {
  if (!(error instanceof Error)) return "UNKNOWN";
  const message = error.message.toLowerCase();
  if (/too many connections|max(?:imum)? clients|connection slots|session mode/.test(message)) return "CONNECTION_LIMIT";
  if (/disk full|storage|quota/.test(message)) return "STORAGE_OR_QUOTA";
  if (/out of memory|memory limit/.test(message)) return "MEMORY_LIMIT";
  if (/compute|resource limit|insufficient resources/.test(message)) return "RESOURCE_LIMIT";
  return "UNKNOWN";
}

export async function GET() {
  const result: Record<string, unknown> = { ok: true, app: "Mason & Arc Studio OS", timestamp: new Date().toISOString(), database: "not_configured" };
  if (process.env.DATABASE_URL) { try { await query("SELECT 1"); result.database = "connected"; } catch (error) { console.error("[health] Database connectivity check failed.", error); result.ok = false; result.database = "error"; result.databaseCode = databaseErrorCode(error); result.databaseReason = databaseErrorReason(error); } }
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
