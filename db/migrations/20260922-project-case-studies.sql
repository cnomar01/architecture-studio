-- Additive case-study records. website_projects.content_sections remains populated
-- by the application for backwards compatibility with existing deployments.
CREATE TABLE IF NOT EXISTS website_project_sections (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES website_projects(id) ON DELETE CASCADE,
  eyebrow JSONB NOT NULL DEFAULT '{}'::jsonb,
  title JSONB NOT NULL DEFAULT '{}'::jsonb,
  description JSONB NOT NULL DEFAULT '{}'::jsonb,
  hero_statement JSONB NOT NULL DEFAULT '{}'::jsonb,
  layout TEXT NOT NULL DEFAULT 'editorial' CHECK (layout IN ('editorial', 'gallery', 'drawings', 'full_bleed')),
  display_order INTEGER NOT NULL DEFAULT 0,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS website_project_sections_project_order_idx
  ON website_project_sections(project_id, display_order);

CREATE TABLE IF NOT EXISTS website_project_section_images (
  id TEXT PRIMARY KEY,
  section_id TEXT NOT NULL REFERENCES website_project_sections(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption JSONB NOT NULL DEFAULT '{}'::jsonb,
  alt_text JSONB NOT NULL DEFAULT '{}'::jsonb,
  layout TEXT NOT NULL DEFAULT 'auto' CHECK (layout IN ('auto', 'landscape', 'portrait', 'drawing', 'full_bleed')),
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS website_project_section_images_section_order_idx
  ON website_project_section_images(section_id, display_order);

-- Safely seed relational rows from legacy JSON only where a project has not
-- already been migrated. Captions and alt text intentionally start empty.
INSERT INTO website_project_sections (id, project_id, eyebrow, title, description, hero_statement, layout, is_visible, display_order)
SELECT 'CS-' || project.id || '-' || ordinal::text,
       project.id,
       COALESCE(section->'eyebrow', '{}'::jsonb),
       COALESCE(section->'title', '{}'::jsonb),
       COALESCE(section->'body', '{}'::jsonb),
       COALESCE(section->'hero_statement', '{}'::jsonb),
       'editorial', TRUE, ordinal - 1
FROM website_projects project
CROSS JOIN LATERAL jsonb_array_elements(COALESCE(project.content_sections, '[]'::jsonb)) WITH ORDINALITY AS legacy(section, ordinal)
WHERE NOT EXISTS (SELECT 1 FROM website_project_sections current WHERE current.project_id = project.id);

INSERT INTO website_project_section_images (id, section_id, image_url, display_order)
SELECT 'CSI-' || project.id || '-' || section_ordinal::text || '-' || image_ordinal::text,
       'CS-' || project.id || '-' || section_ordinal::text, image.image_url, image_ordinal - 1
FROM website_projects project
CROSS JOIN LATERAL jsonb_array_elements(COALESCE(project.content_sections, '[]'::jsonb)) WITH ORDINALITY AS legacy(section, section_ordinal)
CROSS JOIN LATERAL jsonb_array_elements_text(COALESCE(legacy.section->'images', '[]'::jsonb)) WITH ORDINALITY AS image(image_url, image_ordinal)
WHERE NOT EXISTS (SELECT 1 FROM website_project_section_images current WHERE current.section_id = 'CS-' || project.id || '-' || section_ordinal::text);
