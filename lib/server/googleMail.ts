import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import { query } from "@/lib/server/db";

type GoogleMailCredential = { refreshToken: string; email: string };

function encryptionKey() {
  const source = process.env.INTEGRATION_ENCRYPTION_KEY || process.env.DATABASE_URL;
  if (!source) throw new Error("Integration encryption is not configured.");
  return createHash("sha256").update(source).digest();
}

function encrypt(value: GoogleMailCredential) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return [iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), ciphertext.toString("base64url")].join(".");
}

function decrypt(value: string): GoogleMailCredential {
  const [ivText, tagText, ciphertextText] = value.split(".");
  if (!ivText || !tagText || !ciphertextText) throw new Error("Stored integration credential is invalid.");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivText, "base64url"));
  decipher.setAuthTag(Buffer.from(tagText, "base64url"));
  const plaintext = Buffer.concat([decipher.update(Buffer.from(ciphertextText, "base64url")), decipher.final()]);
  return JSON.parse(plaintext.toString("utf8")) as GoogleMailCredential;
}

export async function saveGoogleMailCredential(credential: GoogleMailCredential) {
  await query(
    "INSERT INTO integration_credentials (key,encrypted_value) VALUES ('google-mail',$1) ON CONFLICT (key) DO UPDATE SET encrypted_value=EXCLUDED.encrypted_value,updated_at=NOW()",
    [encrypt(credential)],
  );
}

export async function getGoogleMailCredential() {
  const result = await query<{ encrypted_value: string }>("SELECT encrypted_value FROM integration_credentials WHERE key='google-mail' LIMIT 1");
  return result.rows[0] ? decrypt(result.rows[0].encrypted_value) : null;
}

export async function sendGoogleMail({ to, subject, text }: { to: string; subject: string; text: string }) {
  const credential = await getGoogleMailCredential();
  if (!credential) throw new Error("Google Mail is not connected.");
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Google Mail OAuth is not configured.");
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ client_id: clientId, client_secret: clientSecret, refresh_token: credential.refreshToken, grant_type: "refresh_token" }) });
  const token = await tokenResponse.json() as { access_token?: string };
  if (!tokenResponse.ok || !token.access_token) throw new Error("Could not refresh Google Mail access.");
  const from = process.env.EMAIL_FROM || credential.email;
  const raw = Buffer.from([`From: ${from}`, `To: ${to}`, `Subject: ${subject}`, "MIME-Version: 1.0", "Content-Type: text/plain; charset=UTF-8", "", text].join("\r\n")).toString("base64url");
  const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", { method: "POST", headers: { Authorization: `Bearer ${token.access_token}`, "Content-Type": "application/json" }, body: JSON.stringify({ raw }) });
  if (!response.ok) throw new Error("Google Mail could not send the message.");
}
