import { cookies, headers } from "next/headers";
import bcrypt from "bcryptjs";
import { query } from "./db";

const SESSION_COOKIE = "mason_arc_session";
const SESSION_DAYS = Number(process.env.SESSION_DAYS || 14);

export type ServerUser = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Manager" | "Engineer" | "Client";
  employeeId?: string;
  clientId?: string;
  active: boolean;
};

function mapUser(row: any): ServerUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role,
    employeeId: row.employee_id || undefined,
    clientId: row.client_id || undefined,
    active: Boolean(row.active),
  };
}

export async function verifyPassword(email: string, password: string) {
  const result = await query(
    "SELECT * FROM users WHERE lower(email)=lower($1) AND active=true LIMIT 1",
    [email.trim()]
  );

  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return null;
  }

  return mapUser(user);
}

export async function createSession(userId: string) {
  const expires = new Date(Date.now() + SESSION_DAYS * 86400000);

  const result = await query<{ id: string }>(
    `
    INSERT INTO sessions(id, user_id, expires_at)
    VALUES (gen_random_uuid(), $1, $2)
    RETURNING id::text
    `,
    [userId, expires]
  );

  const sessionId = result.rows[0]?.id;

  if (!sessionId) {
    throw new Error("Could not create session.");
  }

  const jar = await cookies();

  jar.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires,
  });

  return expires;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (token) {
    await query("DELETE FROM sessions WHERE id=$1", [token]).catch(() => {});
  }

  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getServerUser(): Promise<ServerUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const sessionId = token;

  const result = await query(
    `
    SELECT u.*
    FROM sessions s
    JOIN users u ON u.id=s.user_id
    WHERE s.id=$1
      AND s.expires_at>NOW()
      AND u.active=true
    LIMIT 1
    `,
    [sessionId]
  );

  if (!result.rows[0]) {
    return null;
  }

  await query(
    "UPDATE sessions SET last_seen_at=NOW() WHERE id=$1",
    [sessionId]
  ).catch(() => {});

  return mapUser(result.rows[0]);
}

export async function requireServerUser(
  roles?: ServerUser["role"][]
) {
  const user = await getServerUser();

  if (!user) {
    throw new Error("UNAUTHENTICATED");
  }

  if (roles && !roles.includes(user.role)) {
    throw new Error("FORBIDDEN");
  }

  return user;
}

export async function audit(
  action: string,
  entityType: string,
  entityId?: string,
  metadata: Record<string, unknown> = {}
) {
  const user = await getServerUser().catch(() => null);
  const h = await headers();

  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || null;

  const ua = h.get("user-agent") || null;

  await query(
    `
    INSERT INTO audit_logs(
      actor_user_id,
      actor_name,
      action,
      entity_type,
      entity_id,
      metadata,
      ip_address,
      user_agent
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `,
    [
      user?.id || null,
      user?.name || "System",
      action,
      entityType,
      entityId || null,
      JSON.stringify(metadata),
      ip,
      ua,
    ]
  );
}