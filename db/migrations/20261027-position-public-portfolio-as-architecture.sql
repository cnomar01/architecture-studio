-- Align the existing public City Edge entry with the architecture-only website position.
-- This preserves the project name and assets while removing delivery, status, and
-- broad multidisciplinary claims from public CMS content.

UPDATE website_projects
SET
  year = 'Design concept',
  category = 'Architecture',
  description = 'City Edge is the name developed by Mason & Arc for this architectural design concept in Fayoum, Egypt. The proposal explores a clear mixed-use composition, a grounded base, and a layered façade identity.',
  translations = jsonb_set(
    jsonb_set(
      COALESCE(translations, '{}'::jsonb),
      '{ar}',
      '{"title":"سيتي إيدج","location":"الفيوم، مصر","category":"عمارة","description":"سيتي إيدج هو الاسم الذي طوّرته Mason & Arc لهذا المفهوم المعماري في الفيوم، مصر. يستكشف المقترح تكوينًا واضحًا متعدد الاستخدامات، وقاعدة راسخة، وهوية متدرجة للواجهة."}'::jsonb,
      true
    ),
    '{it}',
    '{"title":"City Edge","location":"Fayoum, Egitto","category":"Architettura","description":"City Edge è il nome sviluppato da Mason & Arc per questo concept architettonico a Fayoum, in Egitto. La proposta esplora una composizione polifunzionale chiara, un basamento definito e un’identità di facciata stratificata."}'::jsonb,
    true
  ),
  updated_at = NOW()
WHERE slug = 'city-edge';

UPDATE website_project_sections
SET
  description = '{"en":"The City Edge concept organizes the architectural program as a legible vertical composition. Its massing and façade language are developed as one identity, responding to the site through proportion, rhythm, and layered depth.","ar":"ينظم مفهوم سيتي إيدج البرنامج المعماري في تكوين رأسي واضح. وتتطور الكتل ولغة الواجهات ضمن هوية واحدة تستجيب للموقع من خلال النِسب والإيقاع والعمق المتدرج.","it":"Il concept City Edge organizza il programma architettonico in una composizione verticale leggibile. Volumi e linguaggio di facciata sono sviluppati come un’unica identità, in risposta al sito attraverso proporzione, ritmo e profondità."}'::jsonb
WHERE project_id = (SELECT id FROM website_projects WHERE slug = 'city-edge' LIMIT 1)
  AND id = 'concept';

UPDATE website_project_sections
SET
  title = '{"en":"Design Scope","ar":"نطاق التصميم","it":"Ambito progettuale"}'::jsonb,
  description = '{"en":"Architectural Concept\nDesign Development\nFaçade Studies\nArchitectural Visualization","ar":"الفكرة المعمارية\nتطوير التصميم\nدراسات الواجهات\nالإظهار المعماري","it":"Concept architettonico\nSviluppo del progetto\nStudi di facciata\nVisualizzazione architettonica"}'::jsonb,
  is_visible = TRUE
WHERE project_id = (SELECT id FROM website_projects WHERE slug = 'city-edge' LIMIT 1)
  AND id = 'scope';

UPDATE website_project_sections
SET is_visible = FALSE
WHERE project_id = (SELECT id FROM website_projects WHERE slug = 'city-edge' LIMIT 1)
  AND id IN ('program', 'status', 'execution');

UPDATE website_project_sections
SET
  eyebrow = '{"en":"Design Documentation","ar":"توثيق التصميم","it":"Documentazione di progetto"}'::jsonb,
  title = '{"en":"The Design.","ar":"التصميم.","it":"Il progetto."}'::jsonb
WHERE project_id = (SELECT id FROM website_projects WHERE slug = 'city-edge' LIMIT 1)
  AND id = 'documentation';
