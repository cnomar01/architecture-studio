-- Restore the City Edge case-study blocks that were part of the original
-- public page. Existing CMS edits remain untouched.
INSERT INTO website_project_sections (
  id, project_id, eyebrow, title, description, hero_statement,
  layout, display_order, is_visible
)
VALUES
  (
    'scope', 'WEB-001',
    '{"en":"03","ar":"٠٣","it":"03"}'::jsonb,
    '{"en":"Scope","ar":"نطاق العمل","it":"Ambito"}'::jsonb,
    '{"en":"Architecture\\nFaçade\\nMEP\\nHVAC\\nVertical Transportation\\nInterior Finishing","ar":"العمارة\\nالواجهات\\nأعمال MEP\\nالتكييف والتهوية\\nالنقل الرأسي\\nالتشطيبات الداخلية","it":"Architettura\\nFacciata\\nMEP\\nHVAC\\nTrasporto verticale\\nFiniture interne"}'::jsonb,
    '{"en":"","ar":"","it":""}'::jsonb,
    'editorial', 2, TRUE
  ),
  (
    'status', 'WEB-001',
    '{"en":"04","ar":"٠٤","it":"04"}'::jsonb,
    '{"en":"Status","ar":"الحالة","it":"Stato"}'::jsonb,
    '{"en":"Ongoing\\nStarted 2025","ar":"قيد التنفيذ\\nبدأ في ٢٠٢٥","it":"In corso\\nAvviato nel 2025"}'::jsonb,
    '{"en":"","ar":"","it":""}'::jsonb,
    'editorial', 3, TRUE
  ),
  (
    'execution', 'WEB-001',
    '{"en":"05","ar":"٠٥","it":"05"}'::jsonb,
    '{"en":"Execution","ar":"التنفيذ","it":"Esecuzione"}'::jsonb,
    '{"en":"City Edge is being delivered as a fully coordinated mixed-use development, bringing architectural design, building systems, façade construction, vertical transportation, mechanical and electrical works, and interior finishing together as one integrated process.","ar":"يُنفَّذ سيتي إيدج كمشروع متعدد الاستخدامات متكامل التنسيق، يجمع التصميم المعماري وأنظمة المبنى وتنفيذ الواجهات والنقل الرأسي والأعمال الميكانيكية والكهربائية والتشطيبات الداخلية ضمن عملية واحدة متكاملة.","it":"City Edge viene realizzato come sviluppo polifunzionale pienamente coordinato, riunendo progettazione architettonica, sistemi dell’edificio, facciate, trasporto verticale, impianti meccanici ed elettrici e finiture interne in un unico processo integrato."}'::jsonb,
    '{"en":"From\\nconcept\\nto reality.","ar":"من الفكرة\\nإلى الواقع.","it":"Dal concetto\\nalla realtà."}'::jsonb,
    'editorial', 4, TRUE
  ),
  (
    'documentation', 'WEB-001',
    '{"en":"Project Documentation","ar":"توثيق المشروع","it":"Documentazione di progetto"}'::jsonb,
    '{"en":"The Work.","ar":"العمل.","it":"Il lavoro."}'::jsonb,
    '{"en":"","ar":"","it":""}'::jsonb,
    '{"en":"","ar":"","it":""}'::jsonb,
    'full_bleed', 5, TRUE
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO website_project_section_images (id, section_id, image_url, caption, alt_text, layout, display_order)
VALUES (
  'city-edge-the-work', 'documentation',
  '/images/projects/city-edge/city-edge-exterior-wip.jpeg',
  '{"en":"","ar":"","it":""}'::jsonb,
  '{"en":"City Edge exterior","ar":"واجهة سيتي إيدج","it":"Esterno di City Edge"}'::jsonb,
  'full_bleed', 0
)
ON CONFLICT (id) DO NOTHING;
