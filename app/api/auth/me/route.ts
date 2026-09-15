import { NextResponse } from "next/server";
import { getServerUser } from "@/lib/server/auth";
export const runtime = "nodejs";
export async function GET() { try { const user = await getServerUser(); return NextResponse.json({ user }); } catch { return NextResponse.json({ user: null }); } }
