const { test } = require("node:test");
const assert = require("node:assert/strict");
const { loadTs } = require("./load-ts.cjs");

const { applyPublicEditorialGuardrails } = loadTs("lib/server/websiteProjects.ts", {
  "next/cache": { unstable_cache: (fn) => fn },
  "@/lib/server/db": { query: async () => ({ rows: [] }) },
});

const localized = { en: "", ar: "", it: "" };

test("City Edge public copy is limited to the naming and architectural design concept", () => {
  const project = applyPublicEditorialGuardrails({
    id: "WEB-001",
    slug: "city-edge",
    title: "Old title",
    location: "Fayoum, Egypt",
    year: "2025 — Ongoing",
    category: "Old category",
    description: "Unsupported delivery claim",
    image_url: "/cover.jpg",
    gallery: [],
    translations: {},
    content_sections: [
      { id: "execution", eyebrow: localized, title: localized, body: localized, hero_statement: localized, layout: "editorial", is_visible: true, images: [] },
    ],
    published: true,
  });

  assert.equal(project.title, "City Edge");
  assert.equal(project.year, "Design concept");
  assert.match(project.description, /name developed by Mason & Arc/);
  assert.deepEqual(project.content_sections.map((section) => section.id), ["concept", "scope", "documentation"]);
  assert.doesNotMatch(JSON.stringify(project), /first project|being delivered|execution|ongoing/i);
  assert.match(project.translations.ar.description, /الاسم الذي طوّرته/);
  assert.match(project.translations.it.description, /nome sviluppato/);
});

test("editorial guardrails do not change other projects", () => {
  const project = { id: "2", slug: "another-project", title: "Another", location: "", year: "", category: "Architecture", description: "Original", image_url: "", gallery: [], translations: {}, content_sections: [], published: true };
  assert.equal(applyPublicEditorialGuardrails(project), project);
});
