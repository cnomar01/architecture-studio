import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { audit, requireServerUser } from "@/lib/server/auth";
import { saveGoogleCalendarCredential } from "@/lib/server/googleCalendar";
import { exchangeGoogleCalendarCode, GoogleCalendarOAuthError } from "@/lib/server/googleCalendarOAuth";

export const runtime = "nodejs";

function callbackUri(request: Request) {
  return process.env.GOOGLE_CALENDAR_OAUTH_REDIRECT_URI || `${new URL(request.url).origin}/api/integrations/calendar/callback`;
}

export async function GET(request: Request) {
  try {
    const user = await requireServerUser(["Owner"]);
    const url = new URL(request.url);
    const state = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const jar = await cookies();
    const expectedState = jar.get("mason_arc_google_calendar_state")?.value;
    jar.set("mason_arc_google_calendar_state", "", { httpOnly: true, path: "/", maxAge: 0 });
    if (!state || !expectedState || state !== expectedState) return NextResponse.json({ error: "This Calendar connection request expired. Start again from Connect Calendar." }, { status: 400 });
    if (url.searchParams.has("error") || !code) return NextResponse.json({ error: "Google Calendar authorization was not granted. Start again when ready." }, { status: 400 });
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    if (!clientId || !clientSecret) return NextResponse.json({ error: "Google Calendar OAuth is not configured." }, { status: 503 });
    const credential = await exchangeGoogleCalendarCode(code, { clientId, clientSecret, redirectUri: callbackUri(request) });
    await saveGoogleCalendarCredential(credential);
    await audit("integration.google_calendar.connect", "Integration", "google-calendar", { account: credential.email, actor: user.id });
    return NextResponse.redirect(new URL("/app/admin/settings?google_calendar=connected", request.url));
  } catch (error) {
    if (error instanceof GoogleCalendarOAuthError) return NextResponse.json({ error: error.message }, { status: 400 });
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHENTICATED" || message === "FORBIDDEN") return NextResponse.json({ error: "Sign in as the studio Owner and start again from Connect Calendar." }, { status: message === "FORBIDDEN" ? 403 : 401 });
    console.error("Google Calendar connection failed", error);
    return NextResponse.json({ error: "Google Calendar connection failed. Please try again." }, { status: 500 });
  }
}
