ALTER TABLE approvals ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
ALTER TABLE approvals ADD COLUMN IF NOT EXISTS file_id TEXT REFERENCES project_files(id) ON DELETE SET NULL;
ALTER TABLE approvals ADD COLUMN IF NOT EXISTS review_comment TEXT NOT NULL DEFAULT '';
ALTER TABLE approvals ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ;

ALTER TABLE site_reports ADD COLUMN IF NOT EXISTS project_name TEXT;
ALTER TABLE site_reports ADD COLUMN IF NOT EXISTS visit_type TEXT NOT NULL DEFAULT 'Site Visit';
ALTER TABLE site_reports ADD COLUMN IF NOT EXISTS engineer_name TEXT;
ALTER TABLE site_issues ADD COLUMN IF NOT EXISTS report_id TEXT REFERENCES site_reports(id) ON DELETE CASCADE;
ALTER TABLE site_issues ADD COLUMN IF NOT EXISTS location TEXT NOT NULL DEFAULT '';
ALTER TABLE site_issues ADD COLUMN IF NOT EXISTS assigned_to_name TEXT;

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
