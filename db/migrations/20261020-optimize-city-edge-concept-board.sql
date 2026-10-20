-- Serve the supplied concept board as a high-quality web JPEG.
UPDATE website_project_section_images
SET image_url = '/images/projects/city-edge/city-edge-concept-board.jpg'
WHERE id = 'city-edge-concept-board'
  AND section_id = 'concept';
