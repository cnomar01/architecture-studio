CREATE TABLE IF NOT EXISTS calendar_events (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE SET NULL,
  project_name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'Meeting' CHECK (event_type IN ('Task','Site Visit','Deadline','Meeting','Milestone')),
  event_date DATE NOT NULL,
  end_date DATE,
  event_time TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Planned' CHECK (status IN ('Planned','Completed','Cancelled')),
  description TEXT NOT NULL DEFAULT '',
  google_event_id TEXT,
  created_by_user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS calendar_events_date_idx ON calendar_events(event_date);
CREATE INDEX IF NOT EXISTS calendar_events_project_idx ON calendar_events(project_id);
