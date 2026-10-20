-- Add the supplied City Edge concept board to the existing Concept section.
INSERT INTO website_project_section_images (id, section_id, image_url, caption, alt_text, layout, display_order)
VALUES (
  'city-edge-concept-board', 'concept',
  '/images/projects/city-edge/city-edge-concept-board.jpg',
  '{"en":"City Edge — site geometry, yacht inspiration, and façade translation.","ar":"سيتي إيدج — هندسة الموقع، وإلهام اليخوت، وترجمة الواجهة.","it":"City Edge — geometria del sito, ispirazione nautica e traduzione della facciata."}'::jsonb,
  '{"en":"City Edge concept board","ar":"لوحة الفكرة التصميمية لسيتي إيدج","it":"Tavola concettuale di City Edge"}'::jsonb,
  'drawing', 0
)
ON CONFLICT (id) DO NOTHING;
