import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import pg from 'pg';
import bcrypt from 'bcryptjs';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required.');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: process.env.DATABASE_SSL === 'false' ? false : process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false });
try {
  const schema = await fs.readFile(path.join(process.cwd(), 'db/schema.sql'), 'utf8');
  await pool.query(schema);
  const users = [
    ['USR-001','Mason & Arc Owner','owner@masonandarc.com','Owner',process.env.OWNER_PASSWORD],
    ['USR-002','Omar Mohamed','omar@masonandarc.com','Engineer',process.env.OMAR_PASSWORD],
    ['USR-003','Ahmed Shabaan','ahmed@masonandarc.com','Engineer',process.env.AHMED_PASSWORD],
  ];
  for (const [id,name,email,role,password] of users) {
    if (!password) continue;
    const hash = await bcrypt.hash(password, 12);
    await pool.query(`INSERT INTO users(id,name,email,password_hash,role) VALUES($1,$2,$3,$4,$5) ON CONFLICT(email) DO UPDATE SET name=EXCLUDED.name, role=EXCLUDED.role, password_hash=EXCLUDED.password_hash, active=true, updated_at=NOW()`, [id,name,email,hash,role]);
  }
  await pool.query(`INSERT INTO projects(id,code,name,type,location,status,phase,description,project_manager_id,project_manager_name,start_date) VALUES('CEM-001','CEM-001','City Edge Mall','Commercial / Mixed Use','City Edge','Active','Design Development','Central project workspace for architecture, civil coordination, site activity and project decisions.','OM-001','Omar Mohamed','2026-09-01') ON CONFLICT(id) DO NOTHING`);
  console.log('Mason & Arc database is ready.');
} finally { await pool.end(); }
