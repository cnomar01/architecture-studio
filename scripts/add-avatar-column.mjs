import { Client } from "pg";

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

await client.connect();

await client.query(`
  ALTER TABLE users
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;
`);

await client.end();

console.log("avatar_url column is ready.");