const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");

const read = (file) => readFileSync(path.join(__dirname, "..", file), "utf8");

test("public services present Mason & Arc through four connected practices", () => {
  const services = read("components/services/ServicesHero.tsx");

  for (const discipline of [
    "Architecture & Interiors",
    "Branding & Creative Direction",
    "Visualization & Communication",
    "Digital Experiences",
  ]) {
    assert.match(services, new RegExp(discipline.replaceAll("&", "\\&")));
  }
  assert.match(services, /one working process/i);
  assert.match(services, /Design Systems for Developers/);
  assert.match(services, /Signature Design Language/);
  assert.match(services, /Motion & Architectural Storytelling/);
  assert.match(services, /Brand Experience Design/);
  assert.doesNotMatch(services, /Design & Delivery Advisory/);
  assert.doesNotMatch(services, /Design\.\s*Build\.\s*Experience\./);
  assert.doesNotMatch(services, /Architecture,\s*interior,\s*design and execution\./);
});

test("City Edge records execution supervision as a client-requested exception", () => {
  const project = read("lib/data/projects.ts");

  assert.match(project, /Execution Supervision — at the client’s request/);
  assert.match(project, /provided execution supervision for City Edge/);
  assert.match(project, /الإشراف على التنفيذ — بناءً على طلب العميل/);
  assert.doesNotMatch(project, /landmark 12-storey/);
  assert.doesNotMatch(project, /first project in the country/);
});

test("locked brand lines and languages remain present", () => {
  const locale = read("components/i18n/LocaleProvider.tsx");

  assert.match(locale, /Designed as one\./);
  assert.match(locale, /Built as intended\./);
  assert.match(locale, /const supportedLocales: WebsiteLocale\[\] = \["en", "ar", "it"\]/);
});

test("public calls to action remain design-first", () => {
  const about = read("app/about/page.tsx");
  const loader = read("components/ui/Loader.tsx");

  assert.match(about, /design\./i);
  assert.doesNotMatch(about, /Let(?:&apos;|’)s\s*[\s\S]{0,40}build\./i);
  assert.match(loader, /FROM CONCEPT TO DETAIL/);
  assert.doesNotMatch(loader, /FROM DRAWING TO REALITY/);
});

test("About presents Italy as institutional experience and Egypt as a new independent chapter", () => {
  const about = read("app/about/page.tsx");

  assert.match(about, /professional experience developed in Italy since 2015/);
  assert.match(about, /new and independent chapter/);
  assert.match(about, /multidisciplinary design studio based in Egypt/);
  assert.match(about, /projects in Egypt and internationally/);
  assert.doesNotMatch(about, /Founded in Italy|first branch in Egypt|350\+|founder|مؤسس|المؤسس|fondatore/i);
});

test("locked About history, duration, and locations remain verbatim", () => {
  const about = read("app/about/page.tsx");

  assert.match(about, /Mason & Arc is informed by professional experience developed in Italy since 2015, including contributions to and supervision of major projects across different scales and contexts\./);
  assert.match(about, /This experience shaped a rigorous understanding of architecture, detailed coordination, material quality, and the relationship between design intent and the completed space\./);
  assert.match(about, /country: "Italy"/);
  assert.match(about, /since: "From 2015"/);
  assert.match(about, /Years of professional practice in Italy, including the supervision of major projects, inform the precision and attention to detail behind the studio today\./);
});

test("About and contact content remain complete in English, Arabic, and Italian", () => {
  const about = read("app/about/page.tsx");
  const contact = read("app/contact/ContactForm.tsx");

  assert.match(about, /خبرة مهنية في إيطاليا/);
  assert.match(about, /Esperienza professionale in Italia/);
  assert.match(contact, /كيف يمكننا مساعدتك/);
  assert.match(contact, /Come possiamo aiutarti/);
  assert.match(contact, /\/privacy/);
});

test("service categories expose the same four practices throughout", () => {
  const themes = read("components/sections/Themes.tsx");
  for (const discipline of ["Architecture & Interiors", "Branding & Creative Direction", "Visualization & Communication", "Digital Experiences"]) {
    assert.match(themes, new RegExp(discipline.replaceAll("&", "\\&")));
  }
  assert.doesNotMatch(themes, /Design Development|Delivery Advisory/);
  assert.doesNotMatch(themes, /\"Research\"|\"Collaboration\"|\"البحث\"|\"التعاون\"/);
});

test("services page stays focused and avoids repeating the About timeline", () => {
  const servicesPage = read("app/services/page.tsx");
  const servicesHero = read("components/services/ServicesHero.tsx");

  assert.doesNotMatch(servicesPage, /<Timeline|<Themes/);
  assert.match(servicesHero, /Think\./);
  assert.match(servicesHero, /Connect\./);
  assert.match(servicesHero, /Make\./);
});

test("public menu prioritizes project enquiries over workspace login", () => {
  const navbar = read("components/layout/Navbar.tsx");
  const hero = read("components/home/Hero.tsx");

  assert.doesNotMatch(navbar, /href="\/app\/login"/);
  assert.match(navbar, /copy\.startProject/);
  assert.match(navbar, /copy\.getInTouch/);
  assert.match(hero, /copy\.heroStudioLabel/);
  assert.doesNotMatch(hero, /copy\.heroIntro/);
});

test("public metadata relies on the root Mason & Arc title template without duplication", () => {
  for (const path of ["app/about/layout.tsx", "app/services/page.tsx", "app/projects/page.tsx", "app/contact/page.tsx"]) {
    const source = read(path);
    assert.doesNotMatch(source, /title:\s*\"[^\"]*\| Mason & Arc\"/);
  }
});

test("website inquiries trigger both an internal and asynchronous email alert", () => {
  const leads = read("app/api/leads/route.ts");
  assert.match(leads, /INSERT INTO notifications/);
  assert.match(leads, /after\(async \(\) =>/);
  assert.match(leads, /sendGoogleMail/);
  assert.match(leads, /LEADS_NOTIFICATION_EMAIL/);
  assert.match(leads, /Service:/);
});

test("homepage tells the multidisciplinary story without changing the locked hero", () => {
  const home = read("app/page.tsx");
  const disciplines = read("components/home/Disciplines.tsx");
  const perspective = read("components/home/StudioPerspective.tsx");
  assert.match(home, /<Hero imageUrl=\{approvedHeroImage\}/);
  assert.match(home, /<Disciplines/);
  assert.match(home, /<Projects projects=\{projects\}/);
  assert.match(home, /<StudioPerspective articles=\{journal\}/);
  assert.match(disciplines, /Four practices/);
  assert.match(perspective, /Integrated Design Approach/);
  assert.match(perspective, /Tell us what you’re working on/);
});

test("journal content stays draft-first and only published articles reach the public site", () => {
  const migration = read("db/migrations/20261030-website-journal.sql");
  const journal = read("lib/server/websiteJournal.ts");
  const api = read("app/api/admin/journal/route.ts");
  const home = read("components/home/StudioPerspective.tsx");
  assert.match(migration, /published BOOLEAN NOT NULL DEFAULT FALSE/);
  assert.match(journal, /published=true AND published_at IS NOT NULL AND published_at<=NOW\(\)/);
  assert.match(api, /requireServerUser\(\["Owner"\]\)/);
  assert.match(api, /website_journal\.created/);
  assert.match(home, /articles\.length > 0/);
});

test("new website projects start with a multilingual architecture case-study template", () => {
  const editor = read("app/app/admin/website-projects/page.tsx");
  for (const section of ["Project Overview", "Concept", "Site & Context", "Plans & Sections", "Façade Development", "Spatial Experience", "Materials & Details", "Visualization"]) {
    assert.match(editor, new RegExp(section.replace(/[&]/g, "\\&")));
  }
  assert.match(editor, /Project publishing kit/);
  assert.match(editor, /Nothing is public until Publish is selected/);
});
