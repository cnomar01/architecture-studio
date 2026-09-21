import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { requireServerUser } from "@/lib/server/auth";
import { GOOGLE_CALENDAR_SCOPES } from "@/lib/server/googleCalendarOAuth";

export const runtime = "nodejs";

function callbackUri(request: Request) {
  return process.env.GOOGLE_CALENDAR_OAUTH_REDIRECT_URI || `${new URL(request.url).origin}/api/integrations/calendar/callback`;
}

export async function GET(request: Request) {
  try {
    await requireServerUser(["Owner"]);
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const redirectUri = callbackUri(request);
    if (!clientId || !clientSecret) return NextResponse.json({ error: "Google Calendar OAuth is not configured." }, { status: 503 });
    if (new URL(request.url).origin !== new URL(redirectUri).origin) return NextResponse.redirect(new URL("/app/admin/settings", redirectUri));
    const state = randomUUID();
    const jar = await cookies();
    jar.set("mason_arc_google_calendar_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 600 });
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    url.search = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: "code", access_type: "offline", prompt: "consent", scope: GOOGLE_CALENDAR_SCOPES, state }).toString();
    return NextResponse.redirect(url);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not connect Google Calendar.";
    return NextResponse.json({ error: message }, { status: message === "UNAUTHENTICATED" ? 401 : message === "FORBIDDEN" ? 403 : 500 });
  }
}
