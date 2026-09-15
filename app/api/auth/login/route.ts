import { NextResponse } from "next/server";
import { createSession, verifyPassword, audit } from "@/lib/server/auth";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().slice(0, 254);
    const password = String(body?.password || "").slice(0, 256);
    if (!email || !password) return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
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
