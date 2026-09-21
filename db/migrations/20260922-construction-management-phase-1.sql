-- Phase 1: normalized WBS, activities and schedule dependencies.
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
  budget NUMERIC(18,2),
  notes TEXT NOT NULL DEFAULT '',
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, code)
);
CREATE INDEX IF NOT EXISTS project_wbs_nodes_project_parent_order_idx ON project_wbs_nodes(project_id, parent_id, display_order);

CREATE TABLE IF NOT EXISTS project_schedule_activities (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  wbs_id TEXT REFERENCES project_wbs_nodes(id) ON DELETE SET NULL,
  activity_code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  discipline TEXT NOT NULL DEFAULT '',
  responsible_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  responsible_name TEXT NOT NULL DEFAULT '',
  planned_duration_days INTEGER NOT NULL DEFAULT 0 CHECK (planned_duration_days >= 0),
  planned_start DATE,
  planned_finish DATE,
  actual_start DATE,
  actual_finish DATE,
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
  status TEXT NOT NULL DEFAULT 'Not Started' CHECK (status IN ('Not Started','In Progress','Completed','On Hold')),
  priority TEXT NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low','Medium','High','Critical')),
  is_milestone BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (project_id, activity_code)
);
CREATE INDEX IF NOT EXISTS project_schedule_activities_project_wbs_order_idx ON project_schedule_activities(project_id, wbs_id, display_order);

CREATE TABLE IF NOT EXISTS project_activity_dependencies (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  predecessor_activity_id TEXT NOT NULL REFERENCES project_schedule_activities(id) ON DELETE CASCADE,
  successor_activity_id TEXT NOT NULL REFERENCES project_schedule_activities(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL DEFAULT 'FS' CHECK (relationship_type IN ('FS','SS','FF','SF')),
  lag_days INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (predecessor_activity_id <> successor_activity_id),
  UNIQUE (predecessor_activity_id, successor_activity_id, relationship_type)
);
CREATE INDEX IF NOT EXISTS project_activity_dependencies_project_idx ON project_activity_dependencies(project_id);
