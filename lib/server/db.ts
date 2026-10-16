import { Pool, type PoolClient, type QueryResultRow } from "pg";

const globalForDb = globalThis as unknown as { masonArcPool?: Pool };

function connectionString() {
  const value = process.env.DATABASE_URL;
  if (!value) throw new Error("DATABASE_URL is not configured.");

  const url = new URL(value);
  if (process.env.DATABASE_SSL === "false") {
    // This explicit opt-out is for a local, trusted development database only.
    url.searchParams.delete("sslmode");
  } else if (url.searchParams.has("sslmode")) {
    // Keep TLS verification strict and avoid relying on the pg driver's legacy
    // interpretation of sslmode=require.
    url.searchParams.set("sslmode", "verify-full");
  }
  return url.toString();
}

export function getDb(): Pool {
  if (!globalForDb.masonArcPool) {
    globalForDb.masonArcPool = new Pool({
      connectionString: connectionString(),
      // A serverless deployment can run many Node instances concurrently.
      // Keeping ten connections per instance exhausts small managed Postgres
      // plans quickly and takes both the CMS and workspace offline.
      max: Number(process.env.DB_POOL_MAX || 2),
      connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT_MS || 5_000),
      idleTimeoutMillis: Number(process.env.DB_IDLE_TIMEOUT_MS || 10_000),
      maxLifetimeSeconds: Number(process.env.DB_MAX_LIFETIME_SECONDS || 300),
    });
  }
  return globalForDb.masonArcPool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(text: string, values: unknown[] = []) {
  return getDb().query<T>(text, values);
}

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>) {
  const client = await getDb().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
