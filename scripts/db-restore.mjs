import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const exec = promisify(execFile);
const [file, confirmation] = process.argv.slice(2);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required so the production source can be protected.");
}

if (!process.env.RESTORE_DATABASE_URL) {
  throw new Error(
    "RESTORE_DATABASE_URL is required. Point it to a disposable restore-test database, never the production database."
  );
}

if (!file || confirmation !== "--confirm") {
  throw new Error(
    "Usage: npm run db:restore -- <backup.dump> --confirm"
  );
}

if (
  process.env.RESTORE_DATABASE_URL.trim() ===
  process.env.DATABASE_URL.trim()
) {
  throw new Error(
    "Restore blocked: RESTORE_DATABASE_URL must not be the same as DATABASE_URL."
  );
}

const backup = path.resolve(file);
await fs.access(backup);

// Verify the backup archive before any destructive restore command.
await exec("pg_restore", ["--list", backup], {
  windowsHide: true,
  maxBuffer: 20 * 1024 * 1024,
});

await exec(
  "pg_restore",
  [
    "--clean",
    "--if-exists",
    "--no-owner",
    "--no-acl",
    "--dbname",
    process.env.RESTORE_DATABASE_URL,
    backup,
  ],
  {
    windowsHide: true,
    maxBuffer: 50 * 1024 * 1024,
  }
);

const pool = new pg.Pool({
  connectionString: process.env.RESTORE_DATABASE_URL,
  ssl:
    process.env.DATABASE_SSL === "false"
      ? false
      : { rejectUnauthorized: false },
});

try {
  const result = await pool.query(
    `SELECT
       current_database() AS database,
       (SELECT COUNT(*) FROM users) AS users,
       (SELECT COUNT(*) FROM projects) AS projects,
       (SELECT COUNT(*) FROM project_files) AS files`
  );

  console.log(
    JSON.stringify(
      {
        ok: true,
        restoredFrom: backup,
        target: result.rows[0]?.database || "restore target",
        counts: {
          users: Number(result.rows[0]?.users || 0),
          projects: Number(result.rows[0]?.projects || 0),
          files: Number(result.rows[0]?.files || 0),
        },
      },
      null,
      2
    )
  );
} finally {
  await pool.end();
}
