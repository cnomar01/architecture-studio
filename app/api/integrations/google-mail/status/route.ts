import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/server/auth";
import { getGoogleMailCredential } from "@/lib/server/googleMail";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireServerUser(["Owner"]);
    const credential = await getGoogleMailCredential();
    // This reports stored authorization, not a live send or token-refresh test.
    return NextResponse.json({ authorized: Boolean(credential), email: credential?.email ?? null }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    const status = message === "UNAUTHENTICATED" ? 401 : message === "FORBIDDEN" ? 403 : 500;
    return NextResponse.json({ error: "Could not check Gmail authorization." }, { status });
  }
}
