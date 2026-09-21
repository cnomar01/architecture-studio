import { NextResponse } from "next/server";
import { createSession, verifyPassword, audit } from "@/lib/server/auth";
import { allowAuthAttempt } from "@/lib/server/passwordReset";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().slice(0, 254);
    const password = String(body?.password || "").slice(0, 256);
    if (!email || !password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    const ip = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (!await allowAuthAttempt(`login:${ip}:${email.toLowerCase()}`, 20)) {
      return NextResponse.json({ error: "Too many sign-in attempts. Please try again in 15 minutes." }, { status: 429 });
    }
    const user = await verifyPassword(email, password);
    if (!user) return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    await createSession(user.id);
    await audit("auth.login", "User", user.id);
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json({ error: "Login failed. Please try again." }, { status: 500 });
  }
}
