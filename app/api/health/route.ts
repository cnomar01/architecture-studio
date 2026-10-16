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
  if (/quota|allowance|usage limit/.test(message)) return "QUOTA_EXHAUSTED";
  if (/disk full|no space|storage (?:is )?full|storage limit/.test(message)) return "STORAGE_FULL";
  if (/out of memory|memory limit/.test(message)) return "MEMORY_LIMIT";
  if (/compute|resource limit|insufficient resources/.test(message)) return "RESOURCE_LIMIT";
  return "UNKNOWN";
}

function databaseProvider() {
  try {
    const hostname = new URL(process.env.DATABASE_URL || "").hostname.toLowerCase();
    if (hostname.includes("supabase")) return "SUPABASE";
    if (hostname.includes("neon.tech")) return "NEON";
    if (hostname.includes("railway.app")) return "RAILWAY";
    if (hostname.includes("render.com")) return "RENDER";
    if (hostname.includes("aivencloud.com")) return "AIVEN";
    if (hostname.includes("vercel-storage.com")) return "VERCEL_POSTGRES";
    return "OTHER";
  } catch {
    return "UNKNOWN";
  }
}

export async function GET() {
  const result: Record<string, unknown> = { ok: true, app: "Mason & Arc Studio OS", timestamp: new Date().toISOString(), database: "not_configured" };
  if (process.env.DATABASE_URL) { try { await query("SELECT 1"); result.database = "connected"; } catch (error) { console.error("[health] Database connectivity check failed.", error); result.ok = false; result.database = "error"; result.databaseCode = databaseErrorCode(error); result.databaseReason = databaseErrorReason(error); result.databaseProvider = databaseProvider(); } }
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
