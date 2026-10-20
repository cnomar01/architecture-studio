-- Let the public case-study renderer number these sequential sections from
-- their display order, rather than preserving an old hard-coded number.
UPDATE website_project_sections
SET eyebrow = '{"en":"","ar":"","it":""}'::jsonb,
    updated_at = NOW()
WHERE project_id = 'WEB-001'
  AND id IN ('scope', 'status', 'execution');
