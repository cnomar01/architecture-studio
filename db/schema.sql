CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS departments (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS positions (
  id TEXT PRIMARY KEY,
  department_id TEXT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (department_id, name),
  UNIQUE (department_id, code)
);

-- A client is a company/account. A Client user is the single authorised
-- contact for that account, and may only see projects linked to this record.
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE,
  name TEXT NOT NULL,
  company TEXT,
  contact_name TEXT NOT NULL DEFAULT '',
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  notes TEXT NOT NULL DEFAULT '',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE clients ADD COLUMN IF NOT EXISTS code TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS company TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT '';
UPDATE clients SET code = id WHERE code IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS clients_code_idx ON clients(code) WHERE code IS NOT NULL;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Owner','Manager','Engineer','Client')),
  employee_id TEXT,
  client_id TEXT,
  department TEXT,
  department_id TEXT REFERENCES departments(id) ON DELETE SET NULL,
  position_id TEXT REFERENCES positions(id) ON DELETE SET NULL,
  avatar_url TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Keep existing databases in sync with the current schema.
ALTER TABLE users ADD COLUMN IF NOT EXISTS department TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS department_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS position_id TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS one_client_contact_per_client_idx
  ON users(client_id)
  WHERE role = 'Client' AND client_id IS NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'users_department_id_fkey'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_department_id_fkey
      FOREIGN KEY (department_id) REFERENCES departments(id)
      ON DELETE SET NULL;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'users_position_id_fkey'
  ) THEN
    ALTER TABLE users
      ADD CONSTRAINT users_position_id_fkey
      FOREIGN KEY (position_id) REFERENCES positions(id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS users_department_idx ON users(department_id);
CREATE INDEX IF NOT EXISTS users_position_idx ON users(position_id);

-- A stable legacy sign-in may point to the same account as its current email.
-- This avoids locking an owner out when the delivery email changes.
CREATE TABLE IF NOT EXISTS user_login_aliases (
  email TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS user_login_aliases_user_idx ON user_login_aliases(user_id);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions(expires_at);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS password_reset_user_idx ON password_reset_tokens(user_id);
CREATE TABLE IF NOT EXISTS auth_rate_limits (
  key_hash TEXT PRIMARY KEY,
  attempts INTEGER NOT NULL DEFAULT 1,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT NOT NULL,
  phase TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  client_id TEXT,
  department TEXT,
  client_name TEXT,
  project_manager_id TEXT,
  project_manager_name TEXT,
  start_date DATE,
  target_date DATE,
  contract_value NUMERIC(18,2),
  budget NUMERIC(18,2),
  financial_currency TEXT NOT NULL DEFAULT 'EGP',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE projects ADD COLUMN IF NOT EXISTS contract_value NUMERIC(18,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS budget NUMERIC(18,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS financial_currency TEXT NOT NULL DEFAULT 'EGP';

-- Membership is the authoritative assignment of engineers to projects.
-- Owner and Manager have studio-wide access and do not need membership rows.
CREATE TABLE IF NOT EXISTS project_memberships (
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role_on_project TEXT NOT NULL DEFAULT 'Team Member',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

CREATE INDEX IF NOT EXISTS project_memberships_user_idx
  ON project_memberships(user_id) WHERE active = TRUE;

CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  project_name TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  assignee_id TEXT,
  assignee_name TEXT,
  department TEXT,
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  deadline DATE,
  parent_task_id TEXT REFERENCES tasks(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS tasks_project_idx ON tasks(project_id);
CREATE INDEX IF NOT EXISTS tasks_assignee_idx ON tasks(assignee_id);

CREATE TABLE IF NOT EXISTS project_files (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  project_name TEXT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  revision TEXT NOT NULL,
  document_number TEXT,
  discipline TEXT,
  issue_date DATE,
  visibility TEXT NOT NULL DEFAULT 'Internal' CHECK (visibility IN ('Internal', 'Client')),
  status TEXT NOT NULL,
  storage_key TEXT,
  file_name TEXT,
  file_type TEXT,
  file_size BIGINT,
  uploaded_by_id TEXT,
  uploaded_by_name TEXT,
  parent_file_id TEXT REFERENCES project_files(id) ON DELETE SET NULL,
  is_current BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE project_files ADD COLUMN IF NOT EXISTS document_number TEXT;
ALTER TABLE project_files ADD COLUMN IF NOT EXISTS discipline TEXT;
ALTER TABLE project_files ADD COLUMN IF NOT EXISTS issue_date DATE;
ALTER TABLE project_files ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'Internal';
ALTER TABLE project_files ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
ALTER TABLE project_files ADD COLUMN IF NOT EXISTS folder TEXT NOT NULL DEFAULT 'General';
ALTER TABLE project_files ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';
CREATE UNIQUE INDEX IF NOT EXISTS project_files_document_revision_idx
  ON project_files(project_id, document_number, revision)
  WHERE document_number IS NOT NULL;

CREATE TABLE IF NOT EXISTS transmittals (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL UNIQUE,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  project_name TEXT,
  subject TEXT NOT NULL,
  recipient TEXT NOT NULL,
  issued_by TEXT NOT NULL,
  issued_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'Draft' CHECK (status IN ('Draft', 'Issued', 'Acknowledged')),
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transmittal_files (
  transmittal_id TEXT NOT NULL REFERENCES transmittals(id) ON DELETE CASCADE,
  file_id TEXT NOT NULL REFERENCES project_files(id) ON DELETE CASCADE,
  PRIMARY KEY (transmittal_id, file_id)
);

CREATE INDEX IF NOT EXISTS transmittals_project_idx ON transmittals(project_id, issued_date DESC);

-- Progress updates are the deliberately curated client-facing status feed.
-- They are separate from internal tasks, cost, QA and site information.
CREATE TABLE IF NOT EXISTS project_updates (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  progress_percent INTEGER CHECK (progress_percent BETWEEN 0 AND 100),
  status TEXT NOT NULL DEFAULT 'Published' CHECK (status IN ('Draft', 'Published')),
  published_at TIMESTAMPTZ,
  created_by_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS approvals (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  project_name TEXT,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  revision TEXT,
  status TEXT NOT NULL,
  submitted_by_id TEXT,
  submitted_by_name TEXT,
  reviewed_by_id TEXT,
  reviewed_by_name TEXT,
  description TEXT NOT NULL DEFAULT '',
  file_id TEXT REFERENCES project_files(id) ON DELETE SET NULL,
  review_comment TEXT NOT NULL DEFAULT '',
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE approvals ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
ALTER TABLE approvals ADD COLUMN IF NOT EXISTS file_id TEXT REFERENCES project_files(id) ON DELETE SET NULL;
ALTER TABLE approvals ADD COLUMN IF NOT EXISTS review_comment TEXT NOT NULL DEFAULT '';
ALTER TABLE approvals ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  sender_id TEXT,
  sender_name TEXT,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS finance_transactions (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC(18,2) NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_by_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE finance_transactions ADD COLUMN IF NOT EXISTS transaction_date DATE NOT NULL DEFAULT CURRENT_DATE;
ALTER TABLE finance_transactions ADD COLUMN IF NOT EXISTS created_by_name TEXT;

CREATE TABLE IF NOT EXISTS site_reports (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  report_date DATE NOT NULL,
  weather TEXT,
  project_name TEXT,
  visit_type TEXT NOT NULL DEFAULT 'Site Visit',
  engineer_name TEXT,
  summary TEXT NOT NULL DEFAULT '',
  created_by_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE site_reports ADD COLUMN IF NOT EXISTS project_name TEXT;
ALTER TABLE site_reports ADD COLUMN IF NOT EXISTS visit_type TEXT NOT NULL DEFAULT 'Site Visit';
ALTER TABLE site_reports ADD COLUMN IF NOT EXISTS engineer_name TEXT;

CREATE TABLE IF NOT EXISTS site_issues (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  priority TEXT NOT NULL,
  status TEXT NOT NULL,
  assigned_to_id TEXT,
  assigned_to_name TEXT,
  report_id TEXT REFERENCES site_reports(id) ON DELETE CASCADE,
  location TEXT NOT NULL DEFAULT '',
  task_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

ALTER TABLE site_issues ADD COLUMN IF NOT EXISTS assigned_to_name TEXT;
ALTER TABLE site_issues ADD COLUMN IF NOT EXISTS report_id TEXT REFERENCES site_reports(id) ON DELETE CASCADE;
ALTER TABLE site_issues ADD COLUMN IF NOT EXISTS location TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_user_id TEXT,
  actor_name TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS audit_logs_created_idx ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS audit_logs_entity_idx ON audit_logs(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  priority TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS integration_credentials (
  key TEXT PRIMARY KEY,
  encrypted_value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Public portfolio content is managed by the Owner from the website CMS.
CREATE TABLE IF NOT EXISTS website_projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Architecture',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  content_sections JSONB NOT NULL DEFAULT '[]'::jsonb,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS website_projects_published_idx ON website_projects(published, updated_at DESC);

-- Global public website content managed by the Owner.
CREATE TABLE IF NOT EXISTS website_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS website_project_sections (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES website_projects(id) ON DELETE CASCADE,
  eyebrow JSONB NOT NULL DEFAULT '{}'::jsonb,
  title JSONB NOT NULL DEFAULT '{}'::jsonb,
  description JSONB NOT NULL DEFAULT '{}'::jsonb,
  hero_statement JSONB NOT NULL DEFAULT '{}'::jsonb,
  layout TEXT NOT NULL DEFAULT 'editorial' CHECK (layout IN ('editorial', 'gallery', 'drawings', 'full_bleed')),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS website_project_sections_project_order_idx ON website_project_sections(project_id, display_order);

CREATE TABLE IF NOT EXISTS website_project_section_images (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL REFERENCES website_project_sections(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption JSONB NOT NULL DEFAULT '{}'::jsonb,
  alt_text JSONB NOT NULL DEFAULT '{}'::jsonb,
  layout TEXT NOT NULL DEFAULT 'auto' CHECK (layout IN ('auto', 'landscape', 'portrait', 'drawing', 'full_bleed')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS website_project_section_images_section_order_idx ON website_project_section_images(section_id, display_order);

-- AI outputs stay review-only until a human explicitly creates the linked item.
CREATE TABLE IF NOT EXISTS ai_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  requested_by_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  agent_key TEXT NOT NULL,
  input_summary TEXT NOT NULL DEFAULT '',
  output TEXT NOT NULL,
  model TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_action_proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  review_id UUID REFERENCES ai_reviews(id) ON DELETE CASCADE,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Proposed' CHECK (status IN ('Proposed', 'Approved', 'Dismissed')),
  approved_by_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  company TEXT NOT NULL,
  status TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contracts (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  value NUMERIC(18,2),
  currency TEXT,
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS procurement_items (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  item TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  supplier TEXT,
  needed_by DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS office_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_id TEXT UNIQUE,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  category TEXT,
  revision TEXT,
  status TEXT NOT NULL DEFAULT 'Draft',
  owner_name TEXT,
  file_url TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE office_documents ADD COLUMN IF NOT EXISTS legacy_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS office_documents_legacy_id_idx
  ON office_documents(legacy_id) WHERE legacy_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS quality_items (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS safety_items (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  severity TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS timesheets (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  work_date DATE NOT NULL,
  hours NUMERIC(6,2) NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS construction_items (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_wbs_nodes (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  parent_id TEXT REFERENCES project_wbs_nodes(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  discipline TEXT NOT NULL DEFAULT '',
  planned_start DATE,
  planned_finish DATE,
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  budget NUMERIC(18,2), notes TEXT NOT NULL DEFAULT '', display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, code)
);
CREATE INDEX IF NOT EXISTS project_wbs_nodes_project_parent_order_idx ON project_wbs_nodes(project_id, parent_id, display_order);

CREATE TABLE IF NOT EXISTS project_schedule_activities (
  id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  wbs_id TEXT REFERENCES project_wbs_nodes(id) ON DELETE SET NULL, activity_code TEXT NOT NULL, name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '', discipline TEXT NOT NULL DEFAULT '', responsible_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  responsible_name TEXT NOT NULL DEFAULT '', planned_duration_days INTEGER NOT NULL DEFAULT 0 CHECK (planned_duration_days >= 0),
  planned_start DATE, planned_finish DATE, actual_start DATE, actual_finish DATE,
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started','In Progress','Completed','On Hold')),
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High','Critical')),
  is_milestone BOOLEAN NOT NULL DEFAULT FALSE, display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE (project_id, activity_code)
);
CREATE INDEX IF NOT EXISTS project_schedule_activities_project_wbs_order_idx ON project_schedule_activities(project_id, wbs_id, display_order);

CREATE TABLE IF NOT EXISTS project_activity_dependencies (
  id TEXT PRIMARY KEY, project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  predecessor_activity_id TEXT NOT NULL REFERENCES project_schedule_activities(id) ON DELETE CASCADE,
  successor_activity_id TEXT NOT NULL REFERENCES project_schedule_activities(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'FS' CHECK (relationship_type IN ('FS','SS','FF','SF')),
  lag_days INTEGER NOT NULL DEFAULT 0, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (predecessor_activity_id <> successor_activity_id), UNIQUE (predecessor_activity_id, successor_activity_id, relationship_type)
);
CREATE INDEX IF NOT EXISTS project_activity_dependencies_project_idx ON project_activity_dependencies(project_id);

CREATE OR REPLACE FUNCTION notify_studio_event() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('studio_events', json_build_object(
    'table', TG_TABLE_NAME,
    'operation', TG_OP,
    'id', COALESCE(NEW.id, OLD.id),
    'at', NOW()
  )::text);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_event ON projects;
CREATE TRIGGER projects_event AFTER INSERT OR UPDATE OR DELETE ON projects
FOR EACH ROW EXECUTE FUNCTION notify_studio_event();

DROP TRIGGER IF EXISTS tasks_event ON tasks;
CREATE TRIGGER tasks_event AFTER INSERT OR UPDATE OR DELETE ON tasks
FOR EACH ROW EXECUTE FUNCTION notify_studio_event();

DROP TRIGGER IF EXISTS files_event ON project_files;
CREATE TRIGGER files_event AFTER INSERT OR UPDATE OR DELETE ON project_files
FOR EACH ROW EXECUTE FUNCTION notify_studio_event();

DROP TRIGGER IF EXISTS approvals_event ON approvals;
CREATE TRIGGER approvals_event AFTER INSERT OR UPDATE OR DELETE ON approvals
FOR EACH ROW EXECUTE FUNCTION notify_studio_event();

DROP TRIGGER IF EXISTS messages_event ON messages;
CREATE TRIGGER messages_event AFTER INSERT OR UPDATE OR DELETE ON messages
FOR EACH ROW EXECUTE FUNCTION notify_studio_event();

DROP TRIGGER IF EXISTS notifications_event ON notifications;
CREATE TRIGGER notifications_event AFTER INSERT OR UPDATE OR DELETE ON notifications
FOR EACH ROW EXECUTE FUNCTION notify_studio_event();

DROP TRIGGER IF EXISTS finance_event ON finance_transactions;
CREATE TRIGGER finance_event AFTER INSERT OR UPDATE OR DELETE ON finance_transactions
FOR EACH ROW EXECUTE FUNCTION notify_studio_event();

DROP TRIGGER IF EXISTS site_issues_event ON site_issues;
CREATE TRIGGER site_issues_event AFTER INSERT OR UPDATE OR DELETE ON site_issues
FOR EACH ROW EXECUTE FUNCTION notify_studio_event();

DROP TRIGGER IF EXISTS operations_procurement_event ON procurement_items;
CREATE TRIGGER operations_procurement_event AFTER INSERT OR UPDATE OR DELETE ON procurement_items
FOR EACH ROW EXECUTE FUNCTION notify_studio_event();

DROP TRIGGER IF EXISTS operations_quality_event ON quality_items;
CREATE TRIGGER operations_quality_event AFTER INSERT OR UPDATE OR DELETE ON quality_items
FOR EACH ROW EXECUTE FUNCTION notify_studio_event();

DROP TRIGGER IF EXISTS operations_safety_event ON safety_items;
CREATE TRIGGER operations_safety_event AFTER INSERT OR UPDATE OR DELETE ON safety_items
FOR EACH ROW EXECUTE FUNCTION notify_studio_event();

DROP TRIGGER IF EXISTS operations_construction_event ON construction_items;
CREATE TRIGGER operations_construction_event AFTER INSERT OR UPDATE OR DELETE ON construction_items
FOR EACH ROW EXECUTE FUNCTION notify_studio_event();
