export const GOOGLE_MAIL_SEND_SCOPE = "https://www.googleapis.com/auth/gmail.send";
export const GOOGLE_MAIL_SCOPES = `openid email ${GOOGLE_MAIL_SEND_SCOPE}`;

export class GoogleMailOAuthError extends Error {}

type OAuthConfig = { clientId: string; clientSecret: string; redirectUri: string };

// Read the verified address through OpenID Connect. Gmail's getProfile endpoint
// requires mailbox access, which a send-only integration does not request.
export async function exchangeGoogleMailCode(
  code: string,
  config: OAuthConfig,
  fetcher: typeof fetch = fetch,
) {
  const tokenResponse = await fetcher("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: config.clientId,
      client_secret: config.clientSecret,
      redirect_uri: config.redirectUri,
      grant_type: "authorization_code",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const token = await tokenResponse.json().catch(() => ({})) as {
    access_token?: string; refresh_token?: string; scope?: string;
  };
  if (!tokenResponse.ok || !token.access_token) {
    throw new GoogleMailOAuthError("Google authorization could not be completed. Start again from Connect Gmail.");
  }
  if (!token.scope?.split(/\s+/).includes(GOOGLE_MAIL_SEND_SCOPE)) {
    throw new GoogleMailOAuthError("Gmail sending permission was not granted. Reconnect and allow sending email.");
  }
  if (!token.refresh_token) {
    throw new GoogleMailOAuthError("Google did not grant offline access. Start again from Connect Gmail.");
  }
  const profileResponse = await fetcher("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
  });
  const profile = await profileResponse.json().catch(() => ({})) as {
    email?: string; email_verified?: boolean; sub?: string;
  };
  if (!profileResponse.ok || typeof profile.email !== "string" ||
      !profile.email || profile.email_verified !== true || !profile.sub) {
    throw new GoogleMailOAuthError("Google could not verify the account email. Reconnect and allow access to your email address.");
  }
  return { refreshToken: token.refresh_token, email: profile.email };
}
