ALTER TABLE project_files ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
ALTER TABLE project_files ADD COLUMN IF NOT EXISTS folder TEXT NOT NULL DEFAULT 'General';
ALTER TABLE project_files ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}';

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

INSERT INTO project_files (id,project_id,project_name,name,category,revision,document_number,discipline,issue_date,visibility,status,file_name,file_type,file_size,uploaded_by_id,uploaded_by_name,description,folder,tags,is_current)
VALUES
  ('FIL-001','CEM-001','City Edge Mall','Ground Floor Plan','Architectural Drawing','R03','A-101','Architecture','2026-09-11','Internal','Pending Approval','ground-floor-plan-r03.pdf','application/pdf',2450000,'OM-001','Omar Mohamed','Latest coordinated ground floor architectural plan.','Drawings / Architectural',ARRAY['ground floor','architecture','coordination'],TRUE),
  ('FIL-002','CEM-001','City Edge Mall','Civil Coordination Notes','Civil Drawing','R01','C-201','Civil','2026-09-10','Internal','Approved','civil-coordination-r01.pdf','application/pdf',1180000,'AS-001','Ahmed Shabaan','Civil coordination notes for the current design package.','Drawings / Civil',ARRAY['civil','coordination'],TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO transmittals (id,number,project_id,project_name,subject,recipient,issued_by,issued_date,status,notes)
VALUES ('TR-001','MA-TR-001','CEM-001','City Edge Mall','Architectural coordination package R03','Project Coordination Team','Mason & Arc','2026-09-11','Issued','Issued for design coordination and review.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO transmittal_files (transmittal_id,file_id)
VALUES ('TR-001','FIL-001') ON CONFLICT DO NOTHING;

INSERT INTO leads (id,company,status,contact_name,email,notes)
VALUES
  ('LEAD-001','Residential Client','Proposal','New enquiry','', 'Architecture + Interior · Follow up on proposal'),
  ('LEAD-002','Commercial Prospect','Negotiation','Management team','', 'Design + Execution · Confirm scope and payment milestones')
ON CONFLICT (id) DO NOTHING;

INSERT INTO contracts (id,project_id,title,status,value,currency,start_date,end_date)
VALUES ('CON-001','CEM-001','Design & Construction Services','Active',2400000,'EGP','2026-01-01','2026-12-31')
ON CONFLICT (id) DO NOTHING;

INSERT INTO procurement_items (id,project_id,item,status,priority,supplier,needed_by)
VALUES
  ('PO-001','CEM-001','External façade stone','RFQ','High','Approved supplier','2026-09-20'),
  ('PO-002','CEM-001','Lobby doors hardware','Ordered','Medium','Approved supplier','2026-09-25')
ON CONFLICT (id) DO NOTHING;

INSERT INTO quality_items (id,project_id,title,status,priority,description)
VALUES
  ('QC-001','CEM-001','Waterproofing inspection','Open','Urgent','Inspection · Ahmed Shabaan'),
  ('QC-002','CEM-001','Incorrect finish installation','Corrective Action','High','NCR · Ahmed Shabaan'),
  ('QC-003','CEM-001','Lobby door alignment','Open','Medium','Snag · Omar Mohamed')
ON CONFLICT (id) DO NOTHING;

INSERT INTO safety_items (id,project_id,title,status,severity,description)
VALUES
  ('HSE-001','CEM-001','Housekeeping around work zone','Open','Medium','Observation · Site Team'),
  ('HSE-002','CEM-001','Working at height review','Investigating','High','Risk Assessment · Site Team')
ON CONFLICT (id) DO NOTHING;
