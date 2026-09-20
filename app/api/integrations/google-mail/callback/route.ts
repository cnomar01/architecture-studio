import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { audit, requireServerUser } from "@/lib/server/auth";
import { saveGoogleMailCredential } from "@/lib/server/googleMail";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const user = await requireServerUser(["Owner"]);
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const jar = await cookies();
    const expectedState = jar.get("mason_arc_google_mail_state")?.value;
    jar.set("mason_arc_google_mail_state", "", { httpOnly: true, path: "/", maxAge: 0 });
    if (!code || !state || !expectedState || state !== expectedState) return NextResponse.json({ error: "Invalid Google Mail connection request." }, { status: 400 });
    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
    if (!clientId || !clientSecret || !redirectUri) return NextResponse.json({ error: "Google Mail OAuth is not configured." }, { status: 503 });
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, grant_type: "authorization_code" }) });
    const token = await tokenResponse.json() as { refresh_token?: string; access_token?: string };
    if (!tokenResponse.ok || !token.refresh_token || !token.access_token) throw new Error("Google did not return a refresh token.");
    const profileResponse = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", { headers: { Authorization: `Bearer ${token.access_token}` } });
    const profile = await profileResponse.json() as { emailAddress?: string };
    if (!profileResponse.ok || !profile.emailAddress) throw new Error("Could not verify the connected Google Mail account.");
    await saveGoogleMailCredential({ refreshToken: token.refresh_token, email: profile.emailAddress });
    await audit("integration.google_mail.connect", "Integration", "google-mail", { account: profile.emailAddress, actor: user.id });
    return NextResponse.redirect(new URL("/app/admin/settings?google_mail=connected", request.url));
  } catch (error) {
    console.error("Google Mail connection failed", error);
    return NextResponse.json({ error: "Google Mail connection failed. Please try again." }, { status: 500 });
  }
}
