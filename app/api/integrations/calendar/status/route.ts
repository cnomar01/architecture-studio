import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/server/auth";
import { getGoogleCalendarCredential } from "@/lib/server/googleCalendar";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireServerUser(["Owner"]);
    const credential = await getGoogleCalendarCredential();
    return NextResponse.json({ authorized: Boolean(credential), email: credential?.email ?? null }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return NextResponse.json({ error: "Could not check Google Calendar authorization." }, { status: message === "UNAUTHENTICATED" ? 401 : message === "FORBIDDEN" ? 403 : 500 });
  }
}
