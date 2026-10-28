const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const path = require("node:path");

const read = (file) => readFileSync(path.join(__dirname, "..", file), "utf8");

test("public services present Mason & Arc as design-first with optional delivery support", () => {
  const services = read("components/services/ServicesHero.tsx");

  assert.match(services, /Design & Delivery Advisory/);
  assert.match(services, /Where required, we advise on the selection and coordination of specialist delivery partners/);
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

test("About presents Italy as the founder's experience and Egypt as a new independent chapter", () => {
  const about = read("app/about/page.tsx");

  assert.match(about, /Beginning in 2015/);
  assert.match(about, /new and independent chapter/);
  assert.match(about, /Execution supervision is available selectively when requested by the client/);
  assert.doesNotMatch(about, /Founded in Italy|first branch in Egypt|350\+/i);
});
