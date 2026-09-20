import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { audit } from "@/lib/server/auth";

export const runtime = "nodejs";

function validSignature(raw: string, signature: string | null) {
  const secret = process.env.META_APP_SECRET;
  if (!secret || !signature?.startsWith("sha256=")) return false;
  const expected = `sha256=${createHmac("sha256", secret).update(raw).digest("hex")}`;
  const received = signature;
  return expected.length === received.length && timingSafeEqual(Buffer.from(expected), Buffer.from(received));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && challenge && token && token === process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200, headers: { "Content-Type": "text/plain" } });
  }
  return new Response("Forbidden", { status: 403 });
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (!validSignature(raw, request.headers.get("x-hub-signature-256"))) return new Response("Invalid signature", { status: 401 });
  try {
    const payload = JSON.parse(raw) as { entry?: unknown[] };
    await audit("integration.whatsapp.webhook", "WhatsAppWebhook", undefined, { entryCount: Array.isArray(payload.entry) ? payload.entry.length : 0 });
  } catch {
    return new Response("Invalid payload", { status: 400 });
  }
  return NextResponse.json({ ok: true });
}
