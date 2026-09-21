ALTER TABLE website_projects
  ADD COLUMN IF NOT EXISTS translations JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS content_sections JSONB NOT NULL DEFAULT '[]'::jsonb;

UPDATE website_projects
SET
  translations = jsonb_build_object(
    'ar', jsonb_build_object(
      'title', 'سيتي إيدج',
      'location', 'الفيوم، مصر',
      'category', 'عمارة',
      'description', 'سيتي إيدج مبنى متعدد الاستخدامات من 12 طابقًا في الفيوم، وهو أول مشروعات Mason & Arc في مصر. يجمع المشروع بين المحلات التجارية والمكاتب والعيادات الطبية والوحدات السكنية، مع حمام سباحة ومنطقة للشواء على السطح.'
    ),
    'it', jsonb_build_object(
      'title', 'City Edge',
      'location', 'Fayoum, Egitto',
      'category', 'Architettura',
      'description', 'City Edge è un edificio polifunzionale di 12 piani a Fayoum, il primo progetto di Mason & Arc in Egitto. Il complesso riunisce spazi commerciali, uffici, cliniche mediche, residenze e una terrazza con piscina e area barbecue.'
    )
  ),
  content_sections = jsonb_build_array(
    jsonb_build_object(
      'id', 'concept',
      'title', jsonb_build_object('en', 'Concept', 'ar', 'الفكرة التصميمية', 'it', 'Concept'),
      'body', jsonb_build_object(
        'en', 'Conceived as a vertical mixed-use destination, City Edge brings public, professional, clinical and residential life together within one clear architectural identity. The composition balances a grounded commercial base with lighter residential levels above.',
        'ar', 'صُمم سيتي إيدج كوجهة رأسية متعددة الاستخدامات تجمع الحياة العامة والعمل والخدمات الطبية والسكن داخل هوية معمارية واحدة وواضحة. يوازن التكوين بين قاعدة تجارية راسخة وطوابق سكنية أكثر خفة في الأعلى.',
        'it', 'City Edge è concepito come una destinazione verticale polifunzionale, capace di riunire vita pubblica, lavoro, servizi clinici e residenza in un’identità architettonica chiara. La composizione equilibra un basamento commerciale solido con livelli residenziali più leggeri.'
      ),
      'images', '[]'::jsonb
    ),
    jsonb_build_object(
      'id', 'program',
      'title', jsonb_build_object('en', 'Program', 'ar', 'البرنامج', 'it', 'Programma'),
      'body', jsonb_build_object(
        'en', 'Retail activates the lower levels, followed by offices and medical clinics, while the upper floors provide residential units. A rooftop pool and barbecue area complete the building as a shared destination rather than a collection of isolated uses.',
        'ar', 'تنشّط المحلات التجارية الطوابق السفلية، تليها المكاتب والعيادات الطبية، بينما تضم الطوابق العليا الوحدات السكنية. ويكمل حمام السباحة ومنطقة الشواء على السطح المبنى كوجهة مشتركة بدلًا من أن يكون مجموعة استخدامات منفصلة.',
        'it', 'Gli spazi commerciali animano i livelli inferiori, seguiti da uffici e cliniche mediche, mentre i piani superiori ospitano le residenze. La piscina e l’area barbecue in copertura completano l’edificio come destinazione condivisa, non come semplice somma di funzioni separate.'
      ),
      'images', '[]'::jsonb
    )
  ),
  updated_at = NOW()
WHERE slug = 'city-edge'
  AND (translations = '{}'::jsonb OR content_sections = '[]'::jsonb);
