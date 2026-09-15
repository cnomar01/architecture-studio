import process from 'node:process';
import pg from 'pg';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === 'false' ? false : process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false });
try {
  const result = await pool.query(`SELECT current_database() AS database, current_user AS user, (SELECT COUNT(*) FROM users) AS users, (SELECT COUNT(*) FROM projects) AS projects`);
  console.log(JSON.stringify({ ok: true, ...result.rows[0] }, null, 2));
} finally { await pool.end(); }
