import { NextResponse } from "next/server";
import { destroySession, audit } from "@/lib/server/auth";
export const runtime = "nodejs";
export async function POST() { try { await audit("auth.logout", "Session"); await destroySession(); return NextResponse.json({ ok: true }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Logout failed." }, { status: 500 }); } }
