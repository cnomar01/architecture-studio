"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useCallback, useEffect, useState } from "react";
import { ArrowUpRight, ImagePlus, Loader2, Plus, Save, Trash2 } from "lucide-react";

type WebsiteProject = {
  id: string;
  slug: string;
  title: string;
  location: string;
  year: string;
  category: string;
  description: string;
  image_url: string;
  gallery: string[];
  published: boolean;
};

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
  published: false,
});

function slugFromTitle(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read this image."));
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

export default function WebsiteProjectsPage() {
  const [projects, setProjects] = useState<WebsiteProject[]>([]);
  const [project, setProject] = useState<WebsiteProject>(blankProject);
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
      setProjects(data.projects || []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load website projects.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  function startNew() {
    setMessage("");
    setError("");
    setProject(blankProject());
  }

  function selectProject(next: WebsiteProject) {
    setMessage("");
    setError("");
    setProject({ ...next, gallery: Array.isArray(next.gallery) ? next.gallery : [] });
  }

  function updateField<Key extends keyof WebsiteProject>(key: Key, value: WebsiteProject[Key]) {
    setProject((current) => ({ ...current, [key]: value }));
  }

  async function uploadCover(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return setError("Please choose an image file.");
    if (file.size > 4 * 1024 * 1024) return setError("Each website image must be 4 MB or less.");
    try {
      setError("");
      updateField("image_url", await readImage(file));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not read this image.");
    }
  }

  async function uploadGallery(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;
    if (files.some((file) => !file.type.startsWith("image/"))) return setError("Please choose image files only.");
    if (files.some((file) => file.size > 4 * 1024 * 1024)) return setError("Each website image must be 4 MB or less.");
    if (project.gallery.length + files.length > 12) return setError("A project can have up to 12 gallery images.");
    try {
      setError("");
      const images = await Promise.all(files.map(readImage));
      setProject((current) => ({ ...current, gallery: [...current.gallery, ...images] }));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not read these images.");
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    if (!project.title.trim() || !project.image_url) {
      setError("Project title and cover image are required.");
      return;
    }

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
      setMessage(project.id ? "Project updated on the website." : "Project created. Publish it when it is ready to be public.");
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
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">Owner only · public website</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Website Projects</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">Edit the public Projects Archive without VS Code. Only published projects appear on masonandarc.com.</p>
        </div>
        <Link href="/projects" target="_blank" className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-medium text-white/80 transition hover:bg-white hover:text-black">
          View public projects <ArrowUpRight size={14} />
        </Link>
      </div>

      {(error || message) && (
        <div className={`mb-6 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-500/30 bg-red-500/10 text-red-200" : "border-emerald-400/25 bg-emerald-400/10 text-emerald-100"}`} role="status">
          {error || message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
        <aside className="h-fit rounded-2xl border border-white/10 bg-white/[0.025] p-3 lg:sticky lg:top-6">
          <button type="button" onClick={startNew} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/85">
            <Plus size={16} /> New website project
          </button>
          <div className="mt-3 max-h-[58vh] space-y-2 overflow-y-auto pr-1">
            {loading && <p className="px-3 py-5 text-sm text-white/40">Loading projects…</p>}
            {!loading && !projects.length && <p className="px-3 py-5 text-sm text-white/40">No website projects yet.</p>}
            {projects.map((item) => (
              <button key={item.id} type="button" onClick={() => selectProject(item)} className={`w-full rounded-xl border p-3 text-left transition ${project.id === item.id ? "border-white/40 bg-white/10" : "border-transparent hover:border-white/15 hover:bg-white/[0.04]"}`}>
                <div className="flex items-start justify-between gap-3"><span className="line-clamp-1 text-sm font-medium text-white">{item.title}</span><span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[9px] uppercase tracking-wider ${item.published ? "bg-emerald-400/15 text-emerald-200" : "bg-white/10 text-white/45"}`}>{item.published ? "Live" : "Draft"}</span></div>
                <p className="mt-1 line-clamp-1 text-xs text-white/40">/projects/{item.slug}</p>
              </button>
            ))}
          </div>
        </aside>

        <form onSubmit={save} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:p-6">
          <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold">{project.id ? `Edit ${project.title || "project"}` : "New website project"}</h2>
              <p className="mt-1 text-xs text-white/40">A draft is private. Switch on Publish when it is ready for the public site.</p>
            </div>
            <label className="flex items-center gap-3 self-start rounded-full border border-white/15 px-3 py-2 text-xs sm:self-auto">
              <input type="checkbox" checked={project.published} onChange={(event) => updateField("published", event.target.checked)} className="h-4 w-4 accent-white" />
              Publish on website
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Project title *"><input className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-3 text-sm text-white placeholder:text-white/25" value={project.title} onChange={(event) => { updateField("title", event.target.value); if (!project.slug || project.slug === slugFromTitle(project.title)) updateField("slug", slugFromTitle(event.target.value)); }} required /></Field>
            <Field label="Public URL"><div className="flex overflow-hidden rounded-xl border border-white/15 bg-black/20"><span className="border-r border-white/10 px-3 py-3 text-xs text-white/35">/projects/</span><input className="min-w-0 border-0 bg-transparent" value={project.slug} onChange={(event) => updateField("slug", slugFromTitle(event.target.value))} placeholder="city-edge" /></div></Field>
            <Field label="Location"><input className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-3 text-sm text-white placeholder:text-white/25" value={project.location} onChange={(event) => updateField("location", event.target.value)} placeholder="Fayoum, Egypt" /></Field>
            <Field label="Year / status"><input className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-3 text-sm text-white placeholder:text-white/25" value={project.year} onChange={(event) => updateField("year", event.target.value)} placeholder="2026 · Ongoing" /></Field>
            <Field label="Category"><input className="w-full rounded-xl border border-white/15 bg-black/20 px-3 py-3 text-sm text-white placeholder:text-white/25" value={project.category} onChange={(event) => updateField("category", event.target.value)} placeholder="Architecture" /></Field>
          </div>

          <Field label="Project description" className="mt-4"><textarea className="w-full resize-y rounded-xl border border-white/15 bg-black/20 px-3 py-3 text-sm leading-6 text-white placeholder:text-white/25" rows={5} value={project.description} onChange={(event) => updateField("description", event.target.value)} placeholder="Describe the project for the public page." /></Field>

          <section className="mt-7 border-t border-white/10 pt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Cover image *</h3><p className="mt-1 text-xs text-white/40">This appears in the public project list. Image files up to 4 MB.</p></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs transition hover:bg-white/10"><ImagePlus size={14} /> Upload cover<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={uploadCover} className="hidden" /></label></div>
            {project.image_url ? <img src={project.image_url} alt="Cover preview" className="h-64 w-full rounded-xl border border-white/10 object-cover" /> : <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-white/20 text-sm text-white/35">Upload a cover image to continue</div>}
          </section>

          <section className="mt-7 border-t border-white/10 pt-6">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-sm font-semibold">Gallery</h3><p className="mt-1 text-xs text-white/40">Optional detail photos — up to 12 images.</p></div><label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs transition hover:bg-white/10"><ImagePlus size={14} /> Add photos<input type="file" multiple accept="image/png,image/jpeg,image/webp,image/gif" onChange={uploadGallery} className="hidden" /></label></div>
            {project.gallery.length > 0 ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{project.gallery.map((image, index) => <div key={`${image.slice(0, 32)}-${index}`} className="group relative overflow-hidden rounded-xl border border-white/10"><img src={image} alt={`Gallery image ${index + 1}`} className="aspect-[4/3] h-full w-full object-cover" /><button type="button" onClick={() => updateField("gallery", project.gallery.filter((_, itemIndex) => itemIndex !== index))} className="absolute right-2 top-2 rounded-full bg-black/70 p-2 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100" aria-label={`Remove gallery image ${index + 1}`}><Trash2 size={14} /></button></div>)}</div> : <p className="rounded-xl border border-dashed border-white/15 px-4 py-6 text-sm text-white/35">No gallery photos added.</p>}
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
