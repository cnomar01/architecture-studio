import pg from 'pg';
if (!process.env.DATABASE_URL) { console.error('DATABASE_URL is missing'); process.exit(1); }
const pool = new pg.Pool({connectionString:process.env.DATABASE_URL,ssl:process.env.DATABASE_SSL==='false'?false:process.env.NODE_ENV==='production'?{rejectUnauthorized:false}:false});
try { const r=await pool.query('SELECT current_database() db, NOW() now'); console.log(`DB OK: ${r.rows[0].db} @ ${r.rows[0].now}`); } finally { await pool.end(); }
