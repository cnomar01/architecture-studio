import { unstable_cache } from "next/cache";
import { query } from "@/lib/server/db";

export type WebsiteLocale = "en" | "ar" | "it";
export type LocalizedProjectCopy = { title: string; location: string; category: string; description: string };
export type LocalizedText = Record<WebsiteLocale, string>;
export type WebsiteProjectSectionImage = { id: string; image_url: string; caption: LocalizedText; alt_text: LocalizedText; layout: "auto" | "landscape" | "portrait" | "drawing" | "full_bleed" };
export type WebsiteProjectSection = { id: string; eyebrow: LocalizedText; title: LocalizedText; body: LocalizedText; hero_statement: LocalizedText; layout: "editorial" | "gallery" | "drawings" | "full_bleed"; is_visible: boolean; images: WebsiteProjectSectionImage[] };
export type WebsiteProject = { id: string; slug: string; title: string; location: string; year: string; category: string; description: string; image_url: string; gallery: string[]; translations: Partial<Record<Exclude<WebsiteLocale, "en">, Partial<LocalizedProjectCopy>>>; content_sections: WebsiteProjectSection[]; published: boolean };

const emptyLocalizedText: LocalizedText = { en: "", ar: "", it: "" };
const databaseImageMarker = "__MASON_ARC_DATABASE_IMAGE__";
export const websiteProjectsCacheTag = "website-projects";

// Keep the public portfolio available when the CMS database is temporarily
// unreachable. This mirrors the initial checked-in CMS migration; admin
// routes still fail normally so an outage is visible to the studio team.
const fallbackProjects: WebsiteProject[] = [{
  id: "WEB-001",
  slug: "city-edge",
  title: "City Edge",
  location: "Fayoum, Egypt",
  year: "Design concept",
  category: "Architecture",
  description: "City Edge is the name developed by Mason & Arc for this architectural design concept in Fayoum, Egypt. The proposal explores a clear mixed-use composition, a grounded base, and a layered façade identity.",
  image_url: "/images/projects/city-edge/city-edge-exterior-wip.jpeg",
  gallery: ["/images/projects/city-edge/city-edge-exterior-wip.jpeg"],
  translations: {
    ar: {
      title: "سيتي إيدج",
      location: "الفيوم، مصر",
      category: "عمارة",
      description: "سيتي إيدج هو الاسم الذي طوّرته Mason & Arc لهذا المفهوم المعماري في الفيوم، مصر. يستكشف المقترح تكوينًا واضحًا متعدد الاستخدامات، وقاعدة راسخة، وهوية متدرجة للواجهة.",
    },
    it: {
      title: "City Edge",
      location: "Fayoum, Egitto",
      category: "Architettura",
      description: "City Edge è il nome sviluppato da Mason & Arc per questo concept architettonico a Fayoum, in Egitto. La proposta esplora una composizione polifunzionale chiara, un basamento definito e un’identità di facciata stratificata.",
    },
  },
  content_sections: [
    {
      id: "concept",
      eyebrow: emptyLocalizedText,
      title: { en: "Concept", ar: "الفكرة التصميمية", it: "Concept" },
      body: {
        en: "Conceived as a vertical mixed-use destination, City Edge brings public, professional, clinical and residential life together within one clear architectural identity. The composition balances a grounded commercial base with lighter residential levels above.",
        ar: "صُمم سيتي إيدج كوجهة رأسية متعددة الاستخدامات تجمع الحياة العامة والعمل والخدمات الطبية والسكن داخل هوية معمارية واحدة وواضحة. يوازن التكوين بين قاعدة تجارية راسخة وطوابق سكنية أكثر خفة في الأعلى.",
        it: "City Edge è concepito come una destinazione verticale polifunzionale, capace di riunire vita pubblica, lavoro, servizi clinici e residenza in un’identità architettonica chiara. La composizione equilibra un basamento commerciale solido con livelli residenziali più leggeri.",
      },
      hero_statement: emptyLocalizedText,
      layout: "editorial",
      is_visible: true,
      images: [{
        id: "city-edge-concept-board",
        image_url: "/images/projects/city-edge/city-edge-concept-board.jpg",
        caption: { en: "City Edge — site geometry, yacht inspiration, and façade translation.", ar: "سيتي إيدج — هندسة الموقع، وإلهام اليخوت، وترجمة الواجهة.", it: "City Edge — geometria del sito, ispirazione nautica e traduzione della facciata." },
        alt_text: { en: "City Edge concept board", ar: "لوحة الفكرة التصميمية لسيتي إيدج", it: "Tavola concettuale di City Edge" },
        layout: "drawing",
      }],
    },
    {
      id: "program",
      eyebrow: emptyLocalizedText,
      title: { en: "Program", ar: "البرنامج", it: "Programma" },
      body: {
        en: "Retail activates the lower levels, followed by offices and medical clinics, while the upper floors provide residential units. A rooftop pool and barbecue area complete the building as a shared destination rather than a collection of isolated uses.",
        ar: "تنشّط المحلات التجارية الطوابق السفلية، تليها المكاتب والعيادات الطبية، بينما تضم الطوابق العليا الوحدات السكنية. ويكمل حمام السباحة ومنطقة الشواء على السطح المبنى كوجهة مشتركة بدلًا من أن يكون مجموعة استخدامات منفصلة.",
        it: "Gli spazi commerciali animano i livelli inferiori, seguiti da uffici e cliniche mediche, mentre i piani superiori ospitano le residenze. La piscina e l’area barbecue in copertura completano l’edificio come destinazione condivisa, non come semplice somma di funzioni separate.",
      },
      hero_statement: emptyLocalizedText,
      layout: "editorial",
      is_visible: true,
      images: [],
    },
    {
      id: "scope",
      eyebrow: emptyLocalizedText,
      title: { en: "Scope", ar: "نطاق العمل", it: "Ambito" },
      body: {
        en: "Architecture\nFaçade\nMEP\nHVAC\nVertical Transportation\nInterior Finishing",
        ar: "العمارة\nالواجهات\nأعمال MEP\nالتكييف والتهوية\nالنقل الرأسي\nالتشطيبات الداخلية",
        it: "Architettura\nFacciata\nMEP\nHVAC\nTrasporto verticale\nFiniture interne",
      },
      hero_statement: emptyLocalizedText,
      layout: "editorial",
      is_visible: true,
      images: [],
    },
    {
      id: "status",
      eyebrow: emptyLocalizedText,
      title: { en: "Status", ar: "الحالة", it: "Stato" },
      body: { en: "Ongoing\nStarted 2025", ar: "قيد التنفيذ\nبدأ في ٢٠٢٥", it: "In corso\nAvviato nel 2025" },
      hero_statement: emptyLocalizedText,
      layout: "editorial",
      is_visible: true,
      images: [],
    },
    {
      id: "execution",
      eyebrow: emptyLocalizedText,
      title: { en: "Design Development", ar: "تطوير التصميم", it: "Sviluppo del progetto" },
      body: {
        en: "The architectural concept is developed through coordinated plans, elevations, sections, façade studies, and visualizations that communicate one clear design direction.",
        ar: "تتطور الفكرة المعمارية من خلال مخططات وواجهات وقطاعات ودراسات للواجهة وإظهارات منسقة تنقل اتجاهًا تصميميًا واحدًا وواضحًا.",
        it: "Il concept architettonico viene sviluppato attraverso piante, prospetti, sezioni, studi di facciata e visualizzazioni coordinate che comunicano una direzione progettuale chiara.",
      },
      hero_statement: { en: "From\nconcept\nto reality.", ar: "من الفكرة\nإلى الواقع.", it: "Dal concetto\nalla realtà." },
      layout: "editorial",
      is_visible: true,
      images: [],
    },
    {
      id: "documentation",
      eyebrow: { en: "Project Documentation", ar: "توثيق المشروع", it: "Documentazione di progetto" },
      title: { en: "The Work.", ar: "العمل.", it: "Il lavoro." },
      body: emptyLocalizedText,
      hero_statement: emptyLocalizedText,
      layout: "full_bleed",
      is_visible: true,
      images: [{
        id: "city-edge-the-work",
        image_url: "/images/projects/city-edge/city-edge-exterior-wip.jpeg",
        caption: emptyLocalizedText,
        alt_text: { en: "City Edge exterior", ar: "واجهة سيتي إيدج", it: "Esterno di City Edge" },
        layout: "full_bleed",
      }],
    },
  ],
  published: true,
}];

function reportPublicDatabaseFallback(operation: string, error: unknown) {
  console.error(`[public-portfolio] ${operation} failed; serving checked-in fallback content.`, error);
}

const fields = "id,slug,title,location,year,category,description,image_url,gallery,translations,content_sections,published,updated_at";
// Public pages only need to know whether an image lives in Postgres. Returning
// multi-megabyte data URLs here made every page view consume Neon transfer.
const publicFields = `id,slug,title,location,year,category,description,
  CASE WHEN image_url LIKE 'data:image/%' THEN '${databaseImageMarker}' ELSE image_url END AS image_url,
  COALESCE((
    SELECT jsonb_agg(
      CASE WHEN item.value LIKE 'data:image/%' THEN '${databaseImageMarker}' ELSE item.value END
      ORDER BY item.ordinality
    )
    FROM jsonb_array_elements_text(COALESCE(gallery, '[]'::jsonb)) WITH ORDINALITY AS item(value, ordinality)
  ), '[]'::jsonb) AS gallery,
  translations,NULL::jsonb AS content_sections,published,updated_at`;
const strings = (value: unknown) => Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && Boolean(item.trim())) : [];
function localized(value: unknown): LocalizedText { const item = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : {}; return { en: typeof item.en === "string" ? item.en : "", ar: typeof item.ar === "string" ? item.ar : "", it: typeof item.it === "string" ? item.it : "" }; }
function publicImage(projectId: string, source: string, updatedAt: unknown, params: string) { if (source !== databaseImageMarker && !source.startsWith("data:image/")) return source; const version = new Date(updatedAt as string | number | Date).getTime() || 0; return `/api/public/website-projects/${encodeURIComponent(projectId)}/image?${params}&v=${version}`; }

export function applyPublicEditorialGuardrails(project: WebsiteProject): WebsiteProject {
  if (project.slug !== "city-edge") return project;

  const allImages = project.content_sections.flatMap((section) => section.images);
  const conceptImage = allImages.find((image) => image.id === "city-edge-concept-board");
  const exteriorImage = allImages.find((image) => image.id === "city-edge-the-work");
  const cleanDescription = {
    en: "City Edge is the name developed by Mason & Arc for this architectural design concept in Fayoum, Egypt. The proposal explores a clear mixed-use composition, a grounded base, and a layered façade identity.",
    ar: "سيتي إيدج هو الاسم الذي طوّرته Mason & Arc لهذا المفهوم المعماري في الفيوم، مصر. يستكشف المقترح تكوينًا واضحًا متعدد الاستخدامات، وقاعدة راسخة، وهوية متدرجة للواجهة.",
    it: "City Edge è il nome sviluppato da Mason & Arc per questo concept architettonico a Fayoum, in Egitto. La proposta esplora una composizione polifunzionale chiara, un basamento definito e un’identità di facciata stratificata.",
  };
  const sections: WebsiteProjectSection[] = [
    {
      id: "concept",
      eyebrow: emptyLocalizedText,
      title: { en: "Concept", ar: "الفكرة التصميمية", it: "Concept" },
      body: {
        en: "The City Edge concept organizes the architectural program as a legible vertical composition. Its massing and façade language are developed as one identity, responding to the site through proportion, rhythm, and layered depth.",
        ar: "ينظم مفهوم سيتي إيدج البرنامج المعماري في تكوين رأسي واضح. وتتطور الكتل ولغة الواجهات ضمن هوية واحدة تستجيب للموقع من خلال النِسب والإيقاع والعمق المتدرج.",
        it: "Il concept City Edge organizza il programma architettonico in una composizione verticale leggibile. Volumi e linguaggio di facciata sono sviluppati come un’unica identità, in risposta al sito attraverso proporzione, ritmo e profondità.",
      },
      hero_statement: emptyLocalizedText,
      layout: "editorial",
      is_visible: true,
      images: conceptImage ? [{
        ...conceptImage,
        caption: { en: "City Edge architectural concept study.", ar: "دراسة الفكرة المعمارية لسيتي إيدج.", it: "Studio del concept architettonico City Edge." },
        alt_text: { en: "City Edge architectural concept board", ar: "لوحة الفكرة المعمارية لسيتي إيدج", it: "Tavola del concept architettonico City Edge" },
      }] : [],
    },
    {
      id: "scope",
      eyebrow: emptyLocalizedText,
      title: { en: "Design Scope", ar: "نطاق التصميم", it: "Ambito progettuale" },
      body: {
        en: "Architectural Concept\nDesign Development\nFaçade Studies\nArchitectural Visualization",
        ar: "الفكرة المعمارية\nتطوير التصميم\nدراسات الواجهات\nالإظهار المعماري",
        it: "Concept architettonico\nSviluppo del progetto\nStudi di facciata\nVisualizzazione architettonica",
      },
      hero_statement: emptyLocalizedText,
      layout: "editorial",
      is_visible: true,
      images: [],
    },
    {
      id: "documentation",
      eyebrow: { en: "Design Documentation", ar: "توثيق التصميم", it: "Documentazione di progetto" },
      title: { en: "The Design.", ar: "التصميم.", it: "Il progetto." },
      body: emptyLocalizedText,
      hero_statement: emptyLocalizedText,
      layout: "full_bleed",
      is_visible: true,
      images: exteriorImage ? [exteriorImage] : [],
    },
  ];

  return {
    ...project,
    title: "City Edge",
    year: "Design concept",
    category: "Architecture",
    description: cleanDescription.en,
    translations: {
      ...project.translations,
      ar: { title: "سيتي إيدج", location: "الفيوم، مصر", category: "عمارة", description: cleanDescription.ar },
      it: { title: "City Edge", location: "Fayoum, Egitto", category: "Architettura", description: cleanDescription.it },
    },
    content_sections: sections,
  };
}

function legacySections(row: Record<string, unknown>): WebsiteProjectSection[] {
  const id = String(row.id || ""); const updatedAt = row.updated_at;
  return (Array.isArray(row.content_sections) ? row.content_sections : []).flatMap((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) return [];
    const raw = item as Record<string, unknown>; const sectionId = typeof raw.id === "string" && raw.id ? raw.id : `section-${index + 1}`;
    return [{ id: sectionId, eyebrow: localized(raw.eyebrow), title: localized(raw.title), body: localized(raw.body), hero_statement: localized(raw.hero_statement), layout: "editorial" as const, is_visible: raw.is_visible !== false, images: strings(raw.images).map((image, imageIndex) => ({ id: `${sectionId}-${imageIndex}`, image_url: publicImage(id, image, updatedAt, `kind=section&section=${encodeURIComponent(sectionId)}&index=${imageIndex}`), caption: localized({}), alt_text: localized({}), layout: "auto" as const })) }];
  });
}

export function mapWebsiteProject(row: Record<string, unknown>, relationSections?: Record<string, unknown>[]): WebsiteProject {
  const id = String(row.id || ""); const updatedAt = row.updated_at;
  const sections = relationSections?.length ? relationSections.map((raw) => ({ id: String(raw.id), eyebrow: localized(raw.eyebrow), title: localized(raw.title), body: localized(raw.description), hero_statement: localized(raw.hero_statement), layout: ["gallery", "drawings", "full_bleed"].includes(String(raw.layout)) ? String(raw.layout) as WebsiteProjectSection["layout"] : "editorial", is_visible: raw.is_visible !== false, images: Array.isArray(raw.images) ? (raw.images as Record<string, unknown>[]).map((image) => ({ id: String(image.id), image_url: publicImage(id, String(image.image_url || ""), updatedAt, `kind=section-image&id=${encodeURIComponent(String(image.id))}`), caption: localized(image.caption), alt_text: localized(image.alt_text), layout: ["landscape", "portrait", "drawing", "full_bleed"].includes(String(image.layout)) ? String(image.layout) as WebsiteProjectSectionImage["layout"] : "auto" })) : [] })) : legacySections(row);
  const translations = row.translations && typeof row.translations === "object" && !Array.isArray(row.translations) ? row.translations as WebsiteProject["translations"] : {};
  let cover = typeof row.image_url === "string" ? row.image_url : "";
  // Recover the City Edge cover from the checked-in public asset if an older
  // admin save replaced its original payload with its own public proxy URL.
  if (String(row.slug || "") === "city-edge" && cover.startsWith("/api/public/website-projects/")) {
    cover = "/images/projects/city-edge/city-edge-exterior-wip.jpeg";
  }
  return { id, slug: String(row.slug || ""), title: String(row.title || ""), location: String(row.location || ""), year: String(row.year || ""), category: String(row.category || ""), description: String(row.description || ""), image_url: publicImage(id, cover, updatedAt, "kind=cover"), gallery: strings(row.gallery).map((image, index) => publicImage(id, image, updatedAt, `kind=gallery&index=${index}`)), translations, content_sections: sections, published: Boolean(row.published) };
}

async function sectionRows(projectIds: string[]) {
  if (!projectIds.length) return new Map<string, Record<string, unknown>[]>();
  const result = await query<Record<string, unknown>>(`SELECT section.*, COALESCE(jsonb_agg(jsonb_build_object('id', image.id, 'image_url', CASE WHEN image.image_url LIKE 'data:image/%' THEN '${databaseImageMarker}' ELSE image.image_url END, 'caption', image.caption, 'alt_text', image.alt_text, 'layout', image.layout) ORDER BY image.display_order) FILTER (WHERE image.id IS NOT NULL), '[]'::jsonb) AS images FROM website_project_sections section LEFT JOIN website_project_section_images image ON image.section_id=section.id WHERE section.project_id = ANY($1::text[]) GROUP BY section.id ORDER BY section.display_order`, [projectIds]);
  const grouped = new Map<string, Record<string, unknown>[]>(); for (const row of result.rows) { const key = String(row.project_id); grouped.set(key, [...(grouped.get(key) || []), row]); } return grouped;
}
async function hydrate(rows: Record<string, unknown>[]) { const grouped = await sectionRows(rows.map((row) => String(row.id))); return rows.map((row) => applyPublicEditorialGuardrails(mapWebsiteProject(row, grouped.get(String(row.id))))); }

const loadPublishedWebsiteProjects = unstable_cache(async () => {
  const result = await query<Record<string, unknown>>(`SELECT ${publicFields} FROM website_projects WHERE published=true ORDER BY updated_at DESC`);
  return hydrate(result.rows);
}, ["published-website-projects-v6"], { tags: [websiteProjectsCacheTag], revalidate: 3600 });

export async function listPublishedWebsiteProjects() {
  try {
    const projects = await loadPublishedWebsiteProjects();
    // A freshly provisioned database is valid but empty. Keep the checked-in
    // portfolio visible until the studio republishes its CMS projects.
    return projects.length ? projects : fallbackProjects.map(applyPublicEditorialGuardrails);
  } catch (error) {
    reportPublicDatabaseFallback("listPublishedWebsiteProjects", error);
    return fallbackProjects.map(applyPublicEditorialGuardrails);
  }
}
export async function getPublishedWebsiteProject(slug: string) {
  try {
    const projects = await loadPublishedWebsiteProjects();
    return projects.find((project) => project.slug === slug)
      || (projects.length ? null : fallbackProjects.map(applyPublicEditorialGuardrails).find((project) => project.slug === slug) || null);
  } catch (error) {
    reportPublicDatabaseFallback("getPublishedWebsiteProject", error);
    return fallbackProjects.map(applyPublicEditorialGuardrails).find((project) => project.slug === slug) || null;
  }
}
export async function listAdminWebsiteProjects() { const result = await query<Record<string, unknown>>(`SELECT ${fields} FROM website_projects ORDER BY updated_at DESC`); return hydrate(result.rows); }
export async function getAdminWebsiteProject(id: string) { const result = await query<Record<string, unknown>>(`SELECT ${fields} FROM website_projects WHERE id=$1 LIMIT 1`, [id]); const projects = await hydrate(result.rows); return projects[0] || null; }
