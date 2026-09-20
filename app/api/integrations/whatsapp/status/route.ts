import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/server/auth";
import { getWhatsAppStatus } from "@/lib/server/whatsapp";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireServerUser(["Owner"]);
    return NextResponse.json(getWhatsAppStatus());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read WhatsApp status.";
    return NextResponse.json({ error: message }, { status: message === "UNAUTHENTICATED" ? 401 : message === "FORBIDDEN" ? 403 : 500 });
  }
}
