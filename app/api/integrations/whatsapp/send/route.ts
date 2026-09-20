import { NextResponse } from "next/server";
import { audit, requireServerUser } from "@/lib/server/auth";
import { sendWhatsAppText } from "@/lib/server/whatsapp";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const user = await requireServerUser(["Owner"]);
    const body = await request.json();
    const to = typeof body?.to === "string" ? body.to : "";
    const text = typeof body?.text === "string" ? body.text : "";
    const result = await sendWhatsAppText({ to, text });
    await audit("integration.whatsapp.send", "WhatsAppMessage", result.messageId, { actor: user.id, recipient: to.replace(/[^0-9]/g, "") });
    return NextResponse.json({ ok: true, messageId: result.messageId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "WhatsApp message could not be sent.";
    return NextResponse.json({ error: message }, { status: message === "UNAUTHENTICATED" ? 401 : message === "FORBIDDEN" ? 403 : 502 });
  }
}
