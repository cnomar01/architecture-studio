import { NextResponse } from "next/server";
import { allowAuthAttempt, recoverOwnerAccount } from "@/lib/server/passwordReset";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const token = typeof body?.token === "string" ? body.token.trim().slice(0, 128) : "";
    const password = typeof body?.password === "string" ? body.password.slice(0, 72) : "";
    const ip = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (!await allowAuthAttempt(`owner-recovery:${ip}`, 5)) {
      return NextResponse.json({ error: "Too many recovery attempts." }, { status: 429 });
    }
    if (!await recoverOwnerAccount(token, password)) {
      return NextResponse.json({ error: "Recovery token is invalid, expired, or already used." }, { status: 401 });
    }
    return NextResponse.json({ recovered: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Owner recovery failed", error);
    return NextResponse.json({ error: "Owner recovery is temporarily unavailable." }, { status: 500 });
  }
}
