import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";

const exec = promisify(execFile);

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required.");
}

const dir =
  process.env.BACKUP_DIR || path.join(process.cwd(), "backups");

await fs.mkdir(dir, { recursive: true });

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const file = path.join(dir, `mason-arc-${stamp}.dump`);

await exec(
  "pg_dump",
  [
    "--format=custom",
    "--no-owner",
    "--no-acl",
    "--file",
    file,
    process.env.DATABASE_URL,
  ],
  { windowsHide: true }
);

// Validate that PostgreSQL can read the archive before calling the backup done.
const { stdout: archiveList } = await exec(
  "pg_restore",
  ["--list", file],
  {
    windowsHide: true,
    maxBuffer: 20 * 1024 * 1024,
  }
);

if (!archiveList.trim()) {
  throw new Error(
    "Backup file was created, but pg_restore could not read its archive manifest."
  );
}

const stat = await fs.stat(file);

console.log(
  JSON.stringify(
    {
      ok: true,
      backup: file,
      bytes: stat.size,
      verified: true,
      createdAt: new Date().toISOString(),
    },
    null,
    2
  )
);
