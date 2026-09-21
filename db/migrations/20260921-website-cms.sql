CREATE TABLE IF NOT EXISTS website_projects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Architecture',
  description TEXT NOT NULL DEFAULT '',
  image_url TEXT NOT NULL DEFAULT '',
  gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS website_projects_published_idx ON website_projects(published, updated_at DESC);

INSERT INTO website_projects (id,slug,title,location,year,category,description,image_url,gallery,published)
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
  TRUE
)
ON CONFLICT (slug) DO NOTHING;
