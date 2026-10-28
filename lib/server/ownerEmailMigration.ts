import { createHash, timingSafeEqual } from "node:crypto";
import { withTransaction } from "./db";

export const OWNER_LOGIN_EMAIL = "Masonandarc@gmail.com";

export function matchesOwnerEmailMigrationToken(candidate: string) {
  const expected = process.env.OWNER_EMAIL_MIGRATION_TOKEN || "";
  if (!candidate || !expected) return false;
  const candidateHash = createHash("sha256").update(candidate).digest();
  const expectedHash = createHash("sha256").update(expected).digest();
  return timingSafeEqual(candidateHash, expectedHash);
}

export async function migrateOwnerLoginEmail() {
  return withTransaction(async (client) => {
    const owners = await client.query<{ id: string; email: string }>(
      `SELECT id,email FROM users
       WHERE role='Owner' AND active=true
       ORDER BY created_at ASC
       FOR UPDATE`,
    );
    if (owners.rows.length !== 1) {
      throw new Error("OWNER_ACCOUNT_STATE_INVALID");
    }

    const owner = owners.rows[0];
    const duplicate = await client.query<{ id: string }>(
      "SELECT id FROM users WHERE lower(email)=lower($1) AND id<>$2 LIMIT 1",
      [OWNER_LOGIN_EMAIL, owner.id],
    );
    if (duplicate.rows[0]) throw new Error("OWNER_EMAIL_ALREADY_IN_USE");

    await client.query(
      "UPDATE users SET email=$1,updated_at=NOW() WHERE id=$2",
      [OWNER_LOGIN_EMAIL, owner.id],
    );
    await client.query(
      "DELETE FROM user_login_aliases WHERE user_id=$1 OR lower(email)=lower('owner@masonandarc.com')",
      [owner.id],
    );
    await client.query(
      `INSERT INTO audit_logs (actor_user_id,actor_name,action,entity_type,entity_id,metadata)
       VALUES ($1,'System','auth.owner_email_migrated','User',$1,$2)`,
      [owner.id, JSON.stringify({ from: owner.email, to: OWNER_LOGIN_EMAIL })],
    );
    return { id: owner.id, previousEmail: owner.email, email: OWNER_LOGIN_EMAIL };
  });
}
