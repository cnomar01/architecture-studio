import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { query } from "@/lib/server/db";

export const GOOGLE_CALENDAR_EVENTS_SCOPE = "https://www.googleapis.com/auth/calendar.events";

export type GoogleCalendarCredential = { refreshToken: string; email: string };

function encryptionKey() {
  const source = process.env.INTEGRATION_ENCRYPTION_KEY || process.env.DATABASE_URL;
  if (!source) throw new Error("Integration encryption is not configured.");
  return createHash("sha256").update(source).digest();
}

function encrypt(value: GoogleCalendarCredential) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), ciphertext.toString("base64url")].join(".");
}

function decrypt(value: string): GoogleCalendarCredential {
  const [ivText, tagText, ciphertextText] = value.split(".");
  if (!ivText || !tagText || !ciphertextText) throw new Error("Stored calendar credential is invalid.");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivText, "base64url"));
  decipher.setAuthTag(Buffer.from(tagText, "base64url"));
  const plaintext = Buffer.concat([decipher.update(Buffer.from(ciphertextText, "base64url")), decipher.final()]);
  return JSON.parse(plaintext.toString("utf8")) as GoogleCalendarCredential;
}

export async function saveGoogleCalendarCredential(credential: GoogleCalendarCredential) {
  await query(
    "INSERT INTO integration_credentials (key,encrypted_value) VALUES ('google-calendar',$1) ON CONFLICT (key) DO UPDATE SET encrypted_value=EXCLUDED.encrypted_value,updated_at=NOW()",
    [encrypt(credential)],
  );
}

export async function getGoogleCalendarCredential() {
  const result = await query<{ encrypted_value: string }>("SELECT encrypted_value FROM integration_credentials WHERE key='google-calendar' LIMIT 1");
  return result.rows[0] ? decrypt(result.rows[0].encrypted_value) : null;
}

export async function createGoogleCalendarEvent(input: { title: string; date: string; endDate?: string | null; time?: string; description?: string }) {
  const credential = await getGoogleCalendarCredential();
  if (!credential) return null;
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Google Calendar OAuth is not configured.");
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: credential.refreshToken, grant_type: "refresh_token" }), cache: "no-store", signal: AbortSignal.timeout(15000) });
  const token = await tokenResponse.json().catch(() => ({})) as { access_token?: string };
  if (!tokenResponse.ok || !token.access_token) throw new Error("Could not refresh Google Calendar access.");
  const date = input.date.slice(0, 10);
  const endDate = (input.endDate || date).slice(0, 10);
  const event = input.time ? { summary: input.title, description: input.description || "", start: { dateTime: `${date}T${input.time}:00`, timeZone: "Africa/Cairo" }, end: { dateTime: `${endDate}T${input.time}:00`, timeZone: "Africa/Cairo" } } : { summary: input.title, description: input.description || "", start: { date }, end: { date: new Date(new Date(endDate).getTime() + 86400000).toISOString().slice(0, 10) } };
  const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", { method: "POST", headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" }, body: JSON.stringify(event), cache: "no-store", signal: AbortSignal.timeout(15000) });
  const created = await response.json().catch(() => ({})) as { id?: string };
  if (!response.ok || !created.id) throw new Error("Google Calendar could not create the event.");
  return created.id;
}
