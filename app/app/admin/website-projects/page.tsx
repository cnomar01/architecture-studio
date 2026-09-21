"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpRight, ImagePlus, Languages, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { prepareWebsiteImage } from "@/lib/client/websiteImage";

type EditorLanguage = "en" | "ar" | "it";
type ProjectCopy = { title: string; location: string; category: string; description: string };
type LocalizedText = Record<EditorLanguage, string>;
type ContentSection = { id: string; title: LocalizedText; body: LocalizedText; images: string[] };
type WebsiteProject = ProjectCopy & {
  id: string;
  slug: string;
  year: string;
  image_url: string;
  gallery: string[];
  translations: { ar: ProjectCopy; it: ProjectCopy };
  content_sections: ContentSection[];
  published: boolean;
};

const emptyCopy = (): ProjectCopy => ({ title: "", location: "", category: "", description: "" });
const emptyLocalizedText = (): LocalizedText => ({ en: "", ar: "", it: "" });
const inputClass = "w-full rounded-xl border border-white/15 bg-black/20 px-3 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/40";
const languages: { code: EditorLanguage; label: string; hint: string }[] = [
  { code: "en", label: "English", hint: "Primary" },
  { code: "ar", label: "العربية", hint: "RTL" },
  { code: "it", label: "Italiano", hint: "Translation" },
];

const blankProject = (): WebsiteProject => ({
  id: "",
  slug: "",
  title: "",
  location: "",
  year: new Date().getFullYear().toString(),
  category: "Architecture",
  description: "",
  image_url: "",
  gallery: [],
  translations: { ar: emptyCopy(), it: emptyCopy() },
  content_sections: [],
  published: false,
});

function slugFromTitle(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function normalizedProject(value: WebsiteProject): WebsiteProject {
  const translations = value.translations || { ar: emptyCopy(), it: emptyCopy() };
  return {
    ...value,
    gallery: Array.isArray(value.gallery) ? value.gallery : [],
    translations: {
      ar: { ...emptyCopy(), ...(translations.ar || {}) },
      it: { ...emptyCopy(), ...(translations.it || {}) },
    },
    content_sections: Array.isArray(value.content_sections) ? value.content_sections.map((section, index) => ({
      id: section.id || `section-${index + 1}`,
      title: { ...emptyLocalizedText(), ...(section.title || {}) },
      body: { ...emptyLocalizedText(), ...(section.body || {}) },
      images: Array.isArray(section.images) ? section.images : [],
    })) : [],
  };
}

export default function WebsiteProjectsPage() {
  const [projects, setProjects] = useState<WebsiteProject[]>([]);
  const [project, setProject] = useState<WebsiteProject>(blankProject);
  const [language, setLanguage] = useState<EditorLanguage>("en");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/website-projects", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load website projects.");
      setProjects((data.projects || []).map(normalizedProject));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load website projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadProjects(); }, [loadProjects]);

  function startNew() {
    setMessage("");
    setError("");
    setLanguage("en");
    setProject(blankProject());
  }

  function selectProject(next: WebsiteProject) {
    setMessage("");
    setError("");
    setLanguage("en");
    setProject(normalizedProject(next));
  }

  function updateField<Key extends keyof WebsiteProject>(key: Key, value: WebsiteProject[Key]) {
    setProject((current) => ({ ...current, [key]: value }));
  }

  function localizedProjectValue(key: keyof ProjectCopy) {
    return language === "en" ? project[key] : project.translations[language][key];
  }

  function updateLocalizedProject(key: keyof ProjectCopy, value: string) {
    setProject((current) => {
      if (language === "en") {
        const next = { ...current, [key]: value };
        if (key === "title" && (!current.slug || current.slug === slugFromTitle(current.title))) next.slug = slugFromTitle(value);
        return next;
      }
      return { ...current, translations: { ...current.translations, [language]: { ...current.translations[language], [key]: value } } };
    });
  }

  async function optimizeFiles(files: File[], maxWidth: number, quality: number) {
    if (files.some((file) => !file.type.startsWith("image/"))) throw new Error("Please choose image files only.");
    if (files.some((file) => file.size > 8 * 1024 * 1024)) throw new Error("Each website image must be 8 MB or less.");
    return Promise.all(files.map((file) => prepareWebsiteImage(file, maxWidth, quality)));
  }

  async function uploadCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      setError("");
      updateField("image_url", (await optimizeFiles([file], 2400, 0.84))[0]);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not read this image.");
    }
  }

  async function uploadGallery(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    if (project.gallery.length + files.length > 12) return setError("A project can have up to 12 gallery images.");
    try {
      setError("");
      const images = await optimizeFiles(files, 2000, 0.82);
      setProject((current) => ({ ...current, gallery: [...current.gallery, ...images] }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not read these images.");
    }
  }

  function addSection() {
    if (project.content_sections.length >= 8) return setError("A project can have up to 8 story sections.");
    const id = `section-${Date.now().toString(36)}`;
    setProject((current) => ({ ...current, content_sections: [...current.content_sections, { id, title: emptyLocalizedText(), body: emptyLocalizedText(), images: [] }] }));
  }

  function updateSection(id: string, updater: (section: ContentSection) => ContentSection) {
    setProject((current) => ({ ...current, content_sections: current.content_sections.map((section) => section.id === id ? updater(section) : section) }));
  }

  function moveSection(index: number, direction: -1 | 1) {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= project.content_sections.length) return;
    setProject((current) => {
      const sections = [...current.content_sections];
      [sections[index], sections[nextIndex]] = [sections[nextIndex], sections[index]];
      return { ...current, content_sections: sections };
    });
  }

  async function uploadSectionImages(sectionId: string, event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    const section = project.content_sections.find((item) => item.id === sectionId);
    if (!section || !files.length) return;
    if (section.images.length + files.length > 6) return setError("Each content section can have up to 6 images.");
    try {
      setError("");
      const images = await optimizeFiles(files, 2000, 0.82);
      updateSection(sectionId, (current) => ({ ...current, images: [...current.images, ...images] }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not read these images.");
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!project.title.trim() || !project.image_url) return setError("English project title and cover image are required.");
    setSaving(true);
    try {
      const response = await fetch("/api/admin/website-projects", {
        method: project.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...project, slug: project.slug || slugFromTitle(project.title) }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save this project.");
      selectProject(data.project);
      setMessage(project.id ? "Project and all translations updated on the website." : "Project created. Publish it when it is ready to be public.");
      await loadProjects();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save this project.");
    } finally {
      setSaving(false);
    }
  }

  async function removeProject() {
    if (!project.id || !window.confirm(`Delete “${project.title}” from the website? This cannot be undone.`)) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/website-projects?id=${encodeURIComponent(project.id)}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not delete this project.");
      startNew();
      setMessage("Project deleted from the website.");
      await loadProjects();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Could not delete this project.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-10 lg:py-12">
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div><p className="text-[10px] uppercase tracking-[0.25em] text-white/35">Owner only · public website</p><h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Website Projects</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">Manage live project pages, three languages, story sections and optimized imagery from one connected record.</p></div>
        <Link href="/projects" target="_blank" className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-medium text-white/80 transition hover:bg-white hover:text-black">View public projects <ArrowUpRight size={14} /></Link>
      </div>

      {(error || message) && <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-500/30 bg-red-500/10 text-red-200" : "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"}`} role="status">{error || message}</div>}

      <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.025] p-3 lg:sticky lg:top-6">
          <button type="button" onClick={startNew} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/85"><Plus size={16} /> New website project</button>
          <div className="mt-3 max-h-[58vh] space-y-2 overflow-y-auto pr-1">
            {loading && <p className="px-3 py-5 text-sm text-white/40">Loading projects…</p>}
            {!loading && !projects.length && <p className="px-3 py-5 text-sm text-white/40">No website projects yet.</p>}
            {projects.map((item) => <button key={item.id} type="button" onClick={() => selectProject(item)} className={`w-full rounded-xl border p-3 text-left transition ${project.id === item.id ? "border-white/40 bg-white/10" : "border-transparent hover:border-white/15 hover:bg-white/[0.04]"}`}><div className="flex items-start justify-between gap-3"><span className="line-clamp-1 text-sm font-medium text-white">{item.title}</span><span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider ${item.published ? "bg-emerald-400/15 text-emerald-200" : "bg-white/10 text-white/45"}`}>{item.published ? "Live" : "Draft"}</span></div><p className="mt-1 line-clamp-1 text-xs text-white/40">/projects/{item.slug}</p></button>)}
          </div>
        </aside>

        <form onSubmit={save} className="min-w-0 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div><h2 className="text-lg font-semibold">{project.id ? `Edit ${project.title || "project"}` : "New website project"}</h2><p className="mt-1 text-xs text-white/40">English is the fallback whenever a translation is left empty.</p></div>
            <label className="flex items-center gap-3 self-start rounded-full border border-white/15 px-3 py-2 text-xs sm:self-auto"><input type="checkbox" checked={project.published} onChange={(event) => updateField("published", event.target.checked)} className="h-4 w-4 accent-white" /> Publish on website</label>
          </div>

          <div className="mb-6 flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-black/20 p-2" dir="ltr">
            {languages.map((item) => <button key={item.code} type="button" onClick={() => setLanguage(item.code)} className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 text-sm transition ${language === item.code ? "bg-white text-black" : "text-white/55 hover:bg-white/5 hover:text-white"}`}><Languages size={14} /><span>{item.label}</span><span className={`hidden text-[9px] uppercase tracking-wider sm:inline ${language === item.code ? "text-black/45" : "text-white/25"}`}>{item.hint}</span></button>)}
          </div>

          <div dir={language === "ar" ? "rtl" : "ltr"} className={language === "ar" ? "font-[var(--font-arabic)]" : ""}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`Project title · ${language.toUpperCase()} ${language === "en" ? "*" : ""}`}><input className={inputClass} value={localizedProjectValue("title")} onChange={(event) => updateLocalizedProject("title", event.target.value)} required={language === "en"} /></Field>
              <Field label={`Location · ${language.toUpperCase()}`}><input className={inputClass} value={localizedProjectValue("location")} onChange={(event) => updateLocalizedProject("location", event.target.value)} placeholder={language === "ar" ? "الفيوم، مصر" : language === "it" ? "Fayoum, Egitto" : "Fayoum, Egypt"} /></Field>
              <Field label={`Category · ${language.toUpperCase()}`}><input className={inputClass} value={localizedProjectValue("category")} onChange={(event) => updateLocalizedProject("category", event.target.value)} placeholder={language === "ar" ? "عمارة" : language === "it" ? "Architettura" : "Architecture"} /></Field>
            </div>
            <Field label={`Project description · ${language.toUpperCase()}`} className="mt-4"><textarea className={`${inputClass} resize-y leading-6`} rows={5} value={localizedProjectValue("description")} onChange={(event) => updateLocalizedProject("description", event.target.value)} placeholder="Describe the project for this language." /></Field>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Public URL"><div className="flex overflow-hidden rounded-xl border border-white/15 bg-black/20"><span className="border-r border-white/10 px-3 py-3 text-xs text-white/35">/projects/</span><input className="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-white outline-none" value={project.slug} onChange={(event) => updateField("slug", slugFromTitle(event.target.value))} placeholder="city-edge" /></div></Field>
            <Field label="Year / status"><input className={inputClass} value={project.year} onChange={(event) => updateField("year", event.target.value)} placeholder="2026 — Ongoing" /></Field>
          </div>

          <section className="mt-7 border-t border-white/10 pt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Cover image *</h3><p className="mt-1 text-xs text-white/40">Used on every public card and project hero. Uploads are optimized before saving.</p></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs transition hover:bg-white/10"><ImagePlus size={14} /> Upload cover<input type="file" accept="image/png,image/jpeg,image/webp" onChange={uploadCover} className="hidden" /></label></div>
            {project.image_url ? <img src={project.image_url} alt="Cover preview" className="h-64 w-full rounded-xl border border-white/10 object-cover" /> : <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-white/20 text-sm text-white/35">Upload a cover image to continue</div>}
          </section>

          <section className="mt-7 border-t border-white/10 pt-6">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Project story sections</h3><p className="mt-1 text-xs text-white/40">Add Concept, Program, Materials, Process or any custom section. The language tabs above also edit each section.</p></div><button type="button" onClick={addSection} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs transition hover:bg-white/10"><Plus size={14} /> Add section</button></div>
            <div className="space-y-4">
              {project.content_sections.map((section, sectionIndex) => <article key={section.id} className="rounded-2xl border border-white/10 bg-black/15 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3"><p className="text-[10px] uppercase tracking-[.2em] text-white/35">Section {String(sectionIndex + 1).padStart(2, "0")}</p><div className="flex items-center gap-1"><button type="button" onClick={() => moveSection(sectionIndex, -1)} disabled={sectionIndex === 0} className="rounded-lg border border-white/10 p-2 text-white/55 disabled:opacity-20" aria-label="Move section up"><ArrowUp size={14} /></button><button type="button" onClick={() => moveSection(sectionIndex, 1)} disabled={sectionIndex === project.content_sections.length - 1} className="rounded-lg border border-white/10 p-2 text-white/55 disabled:opacity-20" aria-label="Move section down"><ArrowDown size={14} /></button><button type="button" onClick={() => updateField("content_sections", project.content_sections.filter((item) => item.id !== section.id))} className="rounded-lg border border-red-400/20 p-2 text-red-200" aria-label="Delete section"><Trash2 size={14} /></button></div></div>
                <div dir={language === "ar" ? "rtl" : "ltr"} className={language === "ar" ? "font-[var(--font-arabic)]" : ""}><Field label={`Section title · ${language.toUpperCase()}`}><input className={inputClass} value={section.title[language]} onChange={(event) => updateSection(section.id, (current) => ({ ...current, title: { ...current.title, [language]: event.target.value } }))} placeholder={language === "en" ? "Concept" : language === "ar" ? "الفكرة التصميمية" : "Concept"} /></Field><Field label={`Section text · ${language.toUpperCase()}`} className="mt-3"><textarea className={`${inputClass} resize-y leading-6`} rows={4} value={section.body[language]} onChange={(event) => updateSection(section.id, (current) => ({ ...current, body: { ...current.body, [language]: event.target.value } }))} placeholder="Write the story for this section and language." /></Field></div>
                <div className="mt-4"><div className="mb-3 flex items-center justify-between gap-3"><p className="text-xs text-white/40">Section photos · {section.images.length}/6</p><label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs"><ImagePlus size={13} /> Add photos<input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={(event) => void uploadSectionImages(section.id, event)} className="hidden" /></label></div>{section.images.length > 0 ? <ImageGrid images={section.images} onRemove={(imageIndex) => updateSection(section.id, (current) => ({ ...current, images: current.images.filter((_, index) => index !== imageIndex) }))} /> : <p className="rounded-xl border border-dashed border-white/10 px-4 py-4 text-xs text-white/30">No dedicated photos. The first public section will use the cover as a visual fallback.</p>}</div>
              </article>)}
              {!project.content_sections.length && <p className="rounded-xl border border-dashed border-white/15 px-4 py-8 text-center text-sm text-white/35">No story sections yet. Add Concept first, then Program, Materials or Process.</p>}
            </div>
          </section>

          <section className="mt-7 border-t border-white/10 pt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Documentation gallery</h3><p className="mt-1 text-xs text-white/40">Final image sequence at the end of the project page — up to 12 photos.</p></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs transition hover:bg-white/10"><ImagePlus size={14} /> Add photos<input type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={uploadGallery} className="hidden" /></label></div>
            {project.gallery.length > 0 ? <ImageGrid images={project.gallery} onRemove={(index) => updateField("gallery", project.gallery.filter((_, itemIndex) => itemIndex !== index))} /> : <p className="rounded-xl border border-dashed border-white/15 px-4 py-6 text-sm text-white/35">No gallery photos added.</p>}
          </section>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
            {project.id ? <button type="button" disabled={saving} onClick={removeProject} className="inline-flex items-center gap-2 rounded-full border border-red-400/30 px-4 py-2.5 text-sm text-red-200 transition hover:bg-red-500/10 disabled:opacity-50"><Trash2 size={15} /> Delete project</button> : <span className="text-xs text-white/35">The project will start as a {project.published ? "published" : "draft"} record.</span>}
            <div className="flex items-center gap-3"><Link href={project.slug ? `/projects/${project.slug}` : "/projects"} target="_blank" className="text-xs text-white/55 hover:text-white">Preview ↗</Link><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/85 disabled:opacity-55">{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}{saving ? "Saving…" : "Save project"}</button></div>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return <label className={`block ${className}`}><span className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-white/40">{label}</span>{children}</label>;
}

function ImageGrid({ images, onRemove }: { images: string[]; onRemove: (index: number) => void }) {
  return <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{images.map((image, index) => <div key={`${image.slice(0, 32)}-${index}`} className="group relative overflow-hidden rounded-xl border border-white/10"><img src={image} alt={`Project image ${index + 1}`} className="aspect-[4/3] h-full w-full object-cover" /><button type="button" onClick={() => onRemove(index)} className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100" aria-label={`Remove image ${index + 1}`}><Trash2 size={14} /></button></div>)}</div>;
}
