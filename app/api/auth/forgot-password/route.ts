import { NextResponse } from "next/server";
import { allowAuthAttempt, requestPasswordReset } from "@/lib/server/passwordReset";

export const runtime = "nodejs";
export const maxDuration = 60;
const message = "If an active account matches this email, a reset link will be sent. Check your inbox and spam folder.";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
    }
    const ip = request.headers.get("x-vercel-forwarded-for") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
    if (await allowAuthAttempt(`reset-request-ip:${ip}`, 10) && await allowAuthAttempt(`reset-request-email:${email}`, 3)) {
      try {
        await requestPasswordReset(email);
      } catch {
        // Do not disclose account existence, tokens, or mail-provider secrets.
        console.error("Password reset delivery failed; check the Gmail connection in Settings.");
      }
    }
    return NextResponse.json({ message }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return NextResponse.json({ error: "Password reset is temporarily unavailable. Please try again later." }, { status: 503 });
  }
}
