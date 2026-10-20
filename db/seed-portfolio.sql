-- Initial public portfolio content for a fresh Mason & Arc database.
-- Every insert is non-destructive so rerunning setup never overwrites CMS edits.

INSERT INTO website_projects (
  id, slug, title, location, year, category, description,
  image_url, gallery, translations, content_sections, published
)
VALUES (
  'WEB-001',
  'city-edge',
  'City Edge',
  'Fayoum, Egypt',
  '2025 — Ongoing',
  'Architecture',
  'City Edge is a 12-storey mixed-use building in Fayoum, Egypt, marking Mason & Arc’s first project in Egypt. The building combines retail, offices, medical clinics, residential units, and a rooftop pool and barbecue area within one mixed-use development.',
  '/images/projects/city-edge/city-edge-exterior-wip.jpeg',
  '["/images/projects/city-edge/city-edge-exterior-wip.jpeg"]'::jsonb,
  '{
    "ar": {
      "title": "سيتي إيدج",
      "location": "الفيوم، مصر",
      "category": "عمارة",
      "description": "سيتي إيدج مبنى متعدد الاستخدامات من 12 طابقًا في الفيوم، وهو أول مشروعات Mason & Arc في مصر. يجمع المشروع بين المحلات التجارية والمكاتب والعيادات الطبية والوحدات السكنية، مع حمام سباحة ومنطقة للشواء على السطح."
    },
    "it": {
      "title": "City Edge",
      "location": "Fayoum, Egitto",
      "category": "Architettura",
      "description": "City Edge è un edificio polifunzionale di 12 piani a Fayoum, il primo progetto di Mason & Arc in Egitto. Il complesso riunisce spazi commerciali, uffici, cliniche mediche, residenze e una terrazza con piscina e area barbecue."
    }
  }'::jsonb,
  '[
    {
      "id": "concept",
      "eyebrow": {"en": "", "ar": "", "it": ""},
      "title": {"en": "Concept", "ar": "الفكرة التصميمية", "it": "Concept"},
      "body": {
        "en": "Conceived as a vertical mixed-use destination, City Edge brings public, professional, clinical and residential life together within one clear architectural identity. The composition balances a grounded commercial base with lighter residential levels above.",
        "ar": "صُمم سيتي إيدج كوجهة رأسية متعددة الاستخدامات تجمع الحياة العامة والعمل والخدمات الطبية والسكن داخل هوية معمارية واحدة وواضحة. يوازن التكوين بين قاعدة تجارية راسخة وطوابق سكنية أكثر خفة في الأعلى.",
        "it": "City Edge è concepito come una destinazione verticale polifunzionale, capace di riunire vita pubblica, lavoro, servizi clinici e residenza in un’identità architettonica chiara. La composizione equilibra un basamento commerciale solido con livelli residenziali più leggeri."
      },
      "hero_statement": {"en": "", "ar": "", "it": ""},
      "layout": "editorial",
      "is_visible": true,
      "images": []
    },
    {
      "id": "program",
      "eyebrow": {"en": "", "ar": "", "it": ""},
      "title": {"en": "Program", "ar": "البرنامج", "it": "Programma"},
      "body": {
        "en": "Retail activates the lower levels, followed by offices and medical clinics, while the upper floors provide residential units. A rooftop pool and barbecue area complete the building as a shared destination rather than a collection of isolated uses.",
        "ar": "تنشّط المحلات التجارية الطوابق السفلية، تليها المكاتب والعيادات الطبية، بينما تضم الطوابق العليا الوحدات السكنية. ويكمل حمام السباحة ومنطقة الشواء على السطح المبنى كوجهة مشتركة بدلًا من أن يكون مجموعة استخدامات منفصلة.",
        "it": "Gli spazi commerciali animano i livelli inferiori, seguiti da uffici e cliniche mediche, mentre i piani superiori ospitano le residenze. La piscina e l’area barbecue in copertura completano l’edificio come destinazione condivisa, non come semplice somma di funzioni separate."
      },
      "hero_statement": {"en": "", "ar": "", "it": ""},
      "layout": "editorial",
      "is_visible": true,
      "images": []
    }
  ]'::jsonb,
  TRUE
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO website_settings (key, value)
VALUES ('home_hero', '{"image_url":"/images/hero-florence-sunset.png"}'::jsonb)
ON CONFLICT (key) DO NOTHING;

INSERT INTO website_project_sections (
  id, project_id, eyebrow, title, description, hero_statement,
  layout, display_order, is_visible
)
VALUES
  (
    'concept', 'WEB-001',
    '{"en":"","ar":"","it":""}'::jsonb,
    '{"en":"Concept","ar":"الفكرة التصميمية","it":"Concept"}'::jsonb,
    '{
      "en": "Conceived as a vertical mixed-use destination, City Edge brings public, professional, clinical and residential life together within one clear architectural identity. The composition balances a grounded commercial base with lighter residential levels above.",
      "ar": "صُمم سيتي إيدج كوجهة رأسية متعددة الاستخدامات تجمع الحياة العامة والعمل والخدمات الطبية والسكن داخل هوية معمارية واحدة وواضحة. يوازن التكوين بين قاعدة تجارية راسخة وطوابق سكنية أكثر خفة في الأعلى.",
      "it": "City Edge è concepito come una destinazione verticale polifunzionale, capace di riunire vita pubblica, lavoro, servizi clinici e residenza in un’identità architettonica chiara. La composizione equilibra un basamento commerciale solido con livelli residenziali più leggeri."
    }'::jsonb,
    '{"en":"","ar":"","it":""}'::jsonb,
    'editorial', 0, TRUE
  ),
  (
    'program', 'WEB-001',
    '{"en":"","ar":"","it":""}'::jsonb,
    '{"en":"Program","ar":"البرنامج","it":"Programma"}'::jsonb,
    '{
      "en": "Retail activates the lower levels, followed by offices and medical clinics, while the upper floors provide residential units. A rooftop pool and barbecue area complete the building as a shared destination rather than a collection of isolated uses.",
      "ar": "تنشّط المحلات التجارية الطوابق السفلية، تليها المكاتب والعيادات الطبية، بينما تضم الطوابق العليا الوحدات السكنية. ويكمل حمام السباحة ومنطقة الشواء على السطح المبنى كوجهة مشتركة بدلًا من أن يكون مجموعة استخدامات منفصلة.",
      "it": "Gli spazi commerciali animano i livelli inferiori, seguiti da uffici e cliniche mediche, mentre i piani superiori ospitano le residenze. La piscina e l’area barbecue in copertura completano l’edificio come destinazione condivisa, non come semplice somma di funzioni separate."
    }'::jsonb,
    '{"en":"","ar":"","it":""}'::jsonb,
    'editorial', 1, TRUE
  ),
  (
    'scope', 'WEB-001',
    '{"en":"","ar":"","it":""}'::jsonb,
    '{"en":"Scope","ar":"نطاق العمل","it":"Ambito"}'::jsonb,
    '{"en":"Architecture\\nFaçade\\nMEP\\nHVAC\\nVertical Transportation\\nInterior Finishing","ar":"العمارة\\nالواجهات\\nأعمال MEP\\nالتكييف والتهوية\\nالنقل الرأسي\\nالتشطيبات الداخلية","it":"Architettura\\nFacciata\\nMEP\\nHVAC\\nTrasporto verticale\\nFiniture interne"}'::jsonb,
    '{"en":"","ar":"","it":""}'::jsonb,
    'editorial', 2, TRUE
  ),
  (
    'status', 'WEB-001',
    '{"en":"","ar":"","it":""}'::jsonb,
    '{"en":"Status","ar":"الحالة","it":"Stato"}'::jsonb,
    '{"en":"Ongoing\\nStarted 2025","ar":"قيد التنفيذ\\nبدأ في ٢٠٢٥","it":"In corso\\nAvviato nel 2025"}'::jsonb,
    '{"en":"","ar":"","it":""}'::jsonb,
    'editorial', 3, TRUE
  ),
  (
    'execution', 'WEB-001',
    '{"en":"","ar":"","it":""}'::jsonb,
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
