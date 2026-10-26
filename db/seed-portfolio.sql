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
  'Design concept',
  'Architecture',
  'City Edge is the name developed by Mason & Arc for this architectural design concept in Fayoum, Egypt. The proposal explores a clear mixed-use composition, a grounded base, and a layered façade identity.',
  '/images/projects/city-edge/city-edge-exterior-wip.jpeg',
  '["/images/projects/city-edge/city-edge-exterior-wip.jpeg"]'::jsonb,
  '{
    "ar": {
      "title": "سيتي إيدج",
      "location": "الفيوم، مصر",
      "category": "عمارة",
      "description": "سيتي إيدج هو الاسم الذي طوّرته Mason & Arc لهذا المفهوم المعماري في الفيوم، مصر. يستكشف المقترح تكوينًا واضحًا متعدد الاستخدامات، وقاعدة راسخة، وهوية متدرجة للواجهة."
    },
    "it": {
      "title": "City Edge",
      "location": "Fayoum, Egitto",
      "category": "Architettura",
      "description": "City Edge è il nome sviluppato da Mason & Arc per questo concept architettonico a Fayoum, in Egitto. La proposta esplora una composizione polifunzionale chiara, un basamento definito e un’identità di facciata stratificata."
    }
  }'::jsonb,
  '[
    {
      "id": "concept",
      "eyebrow": {"en": "", "ar": "", "it": ""},
      "title": {"en": "Concept", "ar": "الفكرة التصميمية", "it": "Concept"},
      "body": {
        "en": "The City Edge concept organizes the architectural program as a legible vertical composition. Its massing and façade language are developed as one identity, responding to the site through proportion, rhythm, and layered depth.",
        "ar": "ينظم مفهوم سيتي إيدج البرنامج المعماري في تكوين رأسي واضح. وتتطور الكتل ولغة الواجهات ضمن هوية واحدة تستجيب للموقع من خلال النِسب والإيقاع والعمق المتدرج.",
        "it": "Il concept City Edge organizza il programma architettonico in una composizione verticale leggibile. Volumi e linguaggio di facciata sono sviluppati come un’unica identità, in risposta al sito attraverso proporzione, ritmo e profondità."
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
      "is_visible": false,
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
      "en": "The City Edge concept organizes the architectural program as a legible vertical composition. Its massing and façade language are developed as one identity, responding to the site through proportion, rhythm, and layered depth.",
      "ar": "ينظم مفهوم سيتي إيدج البرنامج المعماري في تكوين رأسي واضح. وتتطور الكتل ولغة الواجهات ضمن هوية واحدة تستجيب للموقع من خلال النِسب والإيقاع والعمق المتدرج.",
      "it": "Il concept City Edge organizza il programma architettonico in una composizione verticale leggibile. Volumi e linguaggio di facciata sono sviluppati come un’unica identità, in risposta al sito attraverso proporzione, ritmo e profondità."
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
    'editorial', 1, FALSE
  ),
  (
    'scope', 'WEB-001',
    '{"en":"","ar":"","it":""}'::jsonb,
    '{"en":"Design Scope","ar":"نطاق التصميم","it":"Ambito progettuale"}'::jsonb,
    '{"en":"Architectural Concept\nDesign Development\nFaçade Studies\nArchitectural Visualization","ar":"الفكرة المعمارية\nتطوير التصميم\nدراسات الواجهات\nالإظهار المعماري","it":"Concept architettonico\nSviluppo del progetto\nStudi di facciata\nVisualizzazione architettonica"}'::jsonb,
    '{"en":"","ar":"","it":""}'::jsonb,
    'editorial', 2, TRUE
  ),
  (
    'status', 'WEB-001',
    '{"en":"","ar":"","it":""}'::jsonb,
    '{"en":"Status","ar":"الحالة","it":"Stato"}'::jsonb,
    '{"en":"Ongoing\nStarted 2025","ar":"قيد التنفيذ\nبدأ في ٢٠٢٥","it":"In corso\nAvviato nel 2025"}'::jsonb,
    '{"en":"","ar":"","it":""}'::jsonb,
    'editorial', 3, FALSE
  ),
  (
    'execution', 'WEB-001',
    '{"en":"","ar":"","it":""}'::jsonb,
    '{"en":"Execution","ar":"التنفيذ","it":"Esecuzione"}'::jsonb,
    '{"en":"City Edge is being delivered as a fully coordinated mixed-use development, bringing architectural design, building systems, façade construction, vertical transportation, mechanical and electrical works, and interior finishing together as one integrated process.","ar":"يُنفَّذ سيتي إيدج كمشروع متعدد الاستخدامات متكامل التنسيق، يجمع التصميم المعماري وأنظمة المبنى وتنفيذ الواجهات والنقل الرأسي والأعمال الميكانيكية والكهربائية والتشطيبات الداخلية ضمن عملية واحدة متكاملة.","it":"City Edge viene realizzato come sviluppo polifunzionale pienamente coordinato, riunendo progettazione architettonica, sistemi dell’edificio, facciate, trasporto verticale, impianti meccanici ed elettrici e finiture interne in un unico processo integrato."}'::jsonb,
    '{"en":"From\nconcept\nto reality.","ar":"من الفكرة\nإلى الواقع.","it":"Dal concetto\nalla realtà."}'::jsonb,
    'editorial', 4, FALSE
  ),
  (
    'documentation', 'WEB-001',
    '{"en":"Design Documentation","ar":"توثيق التصميم","it":"Documentazione di progetto"}'::jsonb,
    '{"en":"The Design.","ar":"التصميم.","it":"Il progetto."}'::jsonb,
    '{"en":"","ar":"","it":""}'::jsonb,
    '{"en":"","ar":"","it":""}'::jsonb,
    'full_bleed', 5, TRUE
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO website_project_section_images (id, section_id, image_url, caption, alt_text, layout, display_order)
VALUES
  (
    'city-edge-concept-board', 'concept',
    '/images/projects/city-edge/city-edge-concept-board.jpg',
    '{"en":"City Edge — site geometry, yacht inspiration, and façade translation.","ar":"سيتي إيدج — هندسة الموقع، وإلهام اليخوت، وترجمة الواجهة.","it":"City Edge — geometria del sito, ispirazione nautica e traduzione della facciata."}'::jsonb,
    '{"en":"City Edge concept board","ar":"لوحة الفكرة التصميمية لسيتي إيدج","it":"Tavola concettuale di City Edge"}'::jsonb,
    'drawing', 0
  ),
  (
    'city-edge-the-work', 'documentation',
    '/images/projects/city-edge/city-edge-exterior-wip.jpeg',
    '{"en":"","ar":"","it":""}'::jsonb,
    '{"en":"City Edge exterior","ar":"واجهة سيتي إيدج","it":"Esterno di City Edge"}'::jsonb,
    'full_bleed', 0
  )
ON CONFLICT (id) DO NOTHING;
