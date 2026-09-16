import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import pg from "pg";
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required.");
}

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.DATABASE_SSL === "false"
      ? false
      : process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
});

try {
  // 1. Apply database schema
  const schema = await fs.readFile(
    path.join(process.cwd(), "db/schema.sql"),
    "utf8"
  );

  await pool.query(schema);

  // 2. Seed only the Office Owner
  // Team members will be created from inside the app.
  const users = [
    [
      "USR-001",
      "Mason & Arc Owner",
      "owner@masonandarc.com",
      "Owner",
      process.env.OWNER_PASSWORD,
    ],
  ];

  for (const [id, name, email, role, password] of users) {
    if (!password) continue;

    const hash = await bcrypt.hash(password, 12);

    await pool.query(
      `
      INSERT INTO users (
        id,
        name,
        email,
        password_hash,
        role,
        active
      )
      VALUES ($1,$2,$3,$4,$5,true)
      ON CONFLICT(email)
      DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        password_hash = EXCLUDED.password_hash,
        active = true,
        updated_at = NOW()
      `,
      [id, name, email, hash, role]
    );
  }

  console.log("Mason & Arc database is ready.");
  console.log("Only the Owner account is seeded.");
  console.log("Team members must be created from the app.");
} finally {
  await pool.end();
}