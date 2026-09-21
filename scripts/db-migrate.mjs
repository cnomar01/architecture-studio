import { readFile } from "node:fs/promises";
import { Pool } from "pg";

// Run only an explicitly selected additive migration. Never seed or reset users.
const name = process.argv[2];
if (!name || !/^\d{8}-[a-z0-9-]+\.sql$/.test(name)) {
  throw new Error("Usage: node --env-file=.env.local scripts/db-migrate.mjs YYYYMMDD-name.sql");
}
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
const sql = await readFile(new URL(`../db/migrations/${name}`, import.meta.url), "utf8");
const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
const client = await pool.connect();
try {
  await client.query("BEGIN");
  await client.query("SET LOCAL lock_timeout = '5s'");
  await client.query(sql);
  await client.query("COMMIT");
  console.log(`Applied ${name}; existing accounts and passwords preserved.`);
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
