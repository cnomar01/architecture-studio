import { NextResponse } from "next/server";
import { allowAuthAttempt, resetPassword, validResetPassword } from "@/lib/server/passwordReset";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const token = typeof body?.token === "string" ? body.token : "";
    const password = typeof body?.password === "string" ? body.password : "";
    if (!/^[a-f0-9]{64}$/.test(token)) return NextResponse.json({ error: "This reset link is invalid. Request a new one." }, { status: 400 });
    if (!validResetPassword(password)) return NextResponse.json({ error: "Use at least 12 characters, up to 72 UTF-8 bytes." }, { status: 400 });
    const ip = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (!await allowAuthAttempt(`reset-attempt:${ip}`, 15)) return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
    if (!await resetPassword(token, password)) return NextResponse.json({ error: "This link expired or was already used. Request a new one." }, { status: 400 });
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    console.error("Password reset could not be completed.");
    return NextResponse.json({ error: "Could not reset your password. Please try again." }, { status: 500 });
  }
}
