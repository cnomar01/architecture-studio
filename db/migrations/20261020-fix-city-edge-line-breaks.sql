-- The initial restoration stored literal backslash-n text in these fields.
-- Replace it with actual line breaks without changing any layout or styling.
UPDATE website_project_sections
SET
  description = jsonb_build_object(
    'en', E'Architecture\nFaçade\nMEP\nHVAC\nVertical Transportation\nInterior Finishing',
    'ar', E'العمارة\nالواجهات\nأعمال MEP\nالتكييف والتهوية\nالنقل الرأسي\nالتشطيبات الداخلية',
    'it', E'Architettura\nFacciata\nMEP\nHVAC\nTrasporto verticale\nFiniture interne'
  ),
  updated_at = NOW()
WHERE id = 'scope' AND project_id = 'WEB-001';

UPDATE website_project_sections
SET
  description = jsonb_build_object(
    'en', E'Ongoing\nStarted 2025',
    'ar', E'قيد التنفيذ\nبدأ في ٢٠٢٥',
    'it', E'In corso\nAvviato nel 2025'
  ),
  updated_at = NOW()
WHERE id = 'status' AND project_id = 'WEB-001';

UPDATE website_project_sections
SET
  hero_statement = jsonb_build_object(
    'en', E'From\nconcept\nto reality.',
    'ar', E'من الفكرة\nإلى الواقع.',
    'it', E'Dal concetto\nalla realtà.'
  ),
  updated_at = NOW()
WHERE id = 'execution' AND project_id = 'WEB-001';
