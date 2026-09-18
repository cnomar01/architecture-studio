import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";

const exec = promisify(execFile);
const [file, confirmation] = process.argv.slice(2);

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");
if (!file || confirmation !== "--confirm") {
  throw new Error("Usage: node scripts/db-restore.mjs <backup.dump> --confirm");
}

const backup = path.resolve(file);
await fs.access(backup);

// Restore is intentionally explicit and non-interactive. It must only be run
// against a verified target database after a fresh backup has been taken.
await exec("pg_restore", ["--clean", "--if-exists", "--no-owner", "--dbname", process.env.DATABASE_URL, backup], { windowsHide: true });
console.log(`Database restored from: ${backup}`);
