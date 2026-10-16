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

export async function GET() {
  const result: Record<string, unknown> = { ok: true, app: "Mason & Arc Studio OS", timestamp: new Date().toISOString(), database: "not_configured" };
  if (process.env.DATABASE_URL) { try { await query("SELECT 1"); result.database = "connected"; } catch (error) { console.error("[health] Database connectivity check failed.", error); result.ok = false; result.database = "error"; result.databaseCode = databaseErrorCode(error); } }
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
