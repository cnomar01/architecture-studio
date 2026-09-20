import pg from "pg";
const {Pool}=pg; const pool=new Pool({connectionString:process.env.DATABASE_URL,ssl:{rejectUnauthorized:false}});
const sql=`
CREATE TABLE IF NOT EXISTS departments (id text primary key,name text unique not null,active boolean not null default true,created_at timestamptz not null default now());
CREATE TABLE IF NOT EXISTS positions (id text primary key,department_id text references departments(id) on delete set null,name text not null,active boolean not null default true,created_at timestamptz not null default now(),unique(department_id,name));
ALTER TABLE users ADD COLUMN IF NOT EXISTS department_id text REFERENCES departments(id) ON DELETE SET NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS position_id text REFERENCES positions(id) ON DELETE SET NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url text;
CREATE TABLE IF NOT EXISTS office_notifications (id uuid primary key default gen_random_uuid(),user_id text references users(id) on delete cascade,title text not null,message text not null,type text not null,read boolean not null default false,href text,created_at timestamptz not null default now());
CREATE TABLE IF NOT EXISTS procurement_items (id uuid primary key default gen_random_uuid(),project_id text,project_name text not null,item text not null,category text, vendor_name text,quantity numeric not null default 1,unit text not null default 'unit',unit_cost numeric not null default 0,status text not null default 'Requested',requested_by text,required_date date,notes text,created_at timestamptz not null default now(),updated_at timestamptz not null default now());
CREATE TABLE IF NOT EXISTS office_documents (id uuid primary key default gen_random_uuid(),project_id text,name text not null,category text,revision text,status text not null default 'Draft',owner_name text,file_url text,tags text[] default '{}',created_at timestamptz not null default now(),updated_at timestamptz not null default now());`;
await pool.query(sql); console.log("Mason & Arc final batch DB migration complete."); await pool.end();
