import { GOOGLE_CALENDAR_EVENTS_SCOPE, type GoogleCalendarCredential } from "@/lib/server/googleCalendar";

export const GOOGLE_CALENDAR_SCOPES = `openid email ${GOOGLE_CALENDAR_EVENTS_SCOPE}`;

export class GoogleCalendarOAuthError extends Error {}

type OAuthConfig = { clientId: string; clientSecret: string; redirectUri: string };

export async function exchangeGoogleCalendarCode(code: string, config: OAuthConfig, fetcher: typeof fetch = fetch): Promise<GoogleCalendarCredential> {
  const tokenResponse = await fetcher("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ code, client_id: config.clientId, client_secret: config.clientSecret, redirect_uri: config.redirectUri, grant_type: "authorization_code" }),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const token = await tokenResponse.json().catch(() => ({})) as { access_token?: string; refresh_token?: string; scope?: string };
  if (!tokenResponse.ok || !token.access_token) throw new GoogleCalendarOAuthError("Google Calendar authorization could not be completed. Start again from Connect Calendar.");
  if (!token.scope?.split(/\s+/).includes(GOOGLE_CALENDAR_EVENTS_SCOPE)) throw new GoogleCalendarOAuthError("Calendar event permission was not granted. Reconnect and allow calendar access.");
  if (!token.refresh_token) throw new GoogleCalendarOAuthError("Google did not grant offline access. Start again from Connect Calendar.");
  const profileResponse = await fetcher("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${token.access_token}` }, cache: "no-store", signal: AbortSignal.timeout(15000) });
  const profile = await profileResponse.json().catch(() => ({})) as { email?: string; email_verified?: boolean; sub?: string };
  if (!profileResponse.ok || !profile.email || profile.email_verified !== true || !profile.sub) throw new GoogleCalendarOAuthError("Google could not verify the calendar account email.");
  return { refreshToken: token.refresh_token, email: profile.email };
}
