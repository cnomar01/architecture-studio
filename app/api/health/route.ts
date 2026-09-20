import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";
export const runtime = "nodejs";
export async function GET() {
  const result: Record<string, unknown> = { ok: false, app: "Mason & Arc Studio OS", timestamp: new Date().toISOString(), database: "not_configured" };
  if (process.env.DATABASE_URL) { try { await query("SELECT 1"); result.ok = true; result.database = "connected"; } catch { result.database = "error"; } }
  return NextResponse.json(result, { status: result.ok ? 200 : 503 });
}
