"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Save, Trash2 } from "lucide-react";

type Language = "en" | "ar" | "it";
type Localized = Record<Language, string>;
type Article = { id: string; slug: string; category: string; title: Localized; excerpt: Localized; body: Localized; cover_image_url: string; seo_title: Localized; seo_description: Localized; published: boolean; published_at: string | null };

const emptyLocalized = (): Localized => ({ en: "", ar: "", it: "" });
const blank = (): Article => ({ id: "", slug: "", category: "Journal", title: emptyLocalized(), excerpt: emptyLocalized(), body: emptyLocalized(), cover_image_url: "", seo_title: emptyLocalized(), seo_description: emptyLocalized(), published: false, published_at: null });
const inputClass = "w-full rounded-xl border border-white/15 bg-black/20 px-3 py-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/40";
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export default function JournalAdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [article, setArticle] = useState<Article>(blank);
  const [language, setLanguage] = useState<Language>("en");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try { const response = await fetch("/api/admin/journal", { cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setArticles(data.articles || []); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load the journal."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  function updateLocalized(field: "title" | "excerpt" | "body" | "seo_title" | "seo_description", value: string) {
    setArticle((current) => { const next = { ...current, [field]: { ...current[field], [language]: value } }; if (field === "title" && language === "en" && (!current.slug || current.slug === slugify(current.title.en))) next.slug = slugify(value); return next; });
  }

  async function save(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage(""); setError("");
    try { const response = await fetch("/api/admin/journal", { method: article.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(article) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setArticle(data.article); setMessage(article.published ? "Article published." : "Draft saved."); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save the article."); }
    finally { setSaving(false); }
  }

  async function remove() {
    if (!article.id || !window.confirm("Delete this journal article?")) return;
    setSaving(true); setMessage(""); setError("");
    try { const response = await fetch(`/api/admin/journal?id=${encodeURIComponent(article.id)}`, { method: "DELETE" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setArticle(blank()); setMessage("Article deleted."); await load(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Could not delete the article."); }
    finally { setSaving(false); }
  }

  return <main className="min-h-screen bg-[#111] px-5 py-8 text-white md:px-8 lg:px-10">
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between"><div><p className="text-[9px] uppercase tracking-[.25em] text-white/30">Website Content</p><h1 className="mt-3 text-4xl font-light tracking-[-.04em]">Journal</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-white/40">Write in English, Arabic and Italian. Drafts remain private until you publish them.</p></div><button type="button" onClick={() => { setArticle(blank()); setLanguage("en"); setMessage(""); setError(""); }} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs"><Plus size={14} /> New article</button></div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-2">{loading ? <Loader2 className="animate-spin text-white/40" size={18} /> : articles.length ? articles.map((item) => <button key={item.id} type="button" onClick={() => { setArticle(item); setLanguage("en"); setMessage(""); setError(""); }} className={`w-full rounded-xl border p-4 text-left ${item.id === article.id ? "border-white/35 bg-white/[.06]" : "border-white/10 bg-white/[.02]"}`}><p className="truncate text-sm">{item.title.en || "Untitled"}</p><p className="mt-2 text-[9px] uppercase tracking-[.18em] text-white/30">{item.published ? "Published" : "Draft"} · {item.category}</p></button>) : <p className="text-sm text-white/35">No articles yet.</p>}</aside>
        <form onSubmit={save} className="rounded-2xl border border-white/10 bg-white/[.025] p-5 md:p-7">
          <div className="flex flex-wrap items-center gap-2">{(["en", "ar", "it"] as Language[]).map((code) => <button key={code} type="button" onClick={() => setLanguage(code)} className={`rounded-full border px-4 py-2 text-[10px] uppercase ${language === code ? "border-white bg-white text-black" : "border-white/15 text-white/45"}`}>{code === "ar" ? "العربية" : code}</button>)}</div>
          <div className="mt-7 grid gap-5 md:grid-cols-2"><Field label="Public URL" value={article.slug} onChange={(value) => setArticle((current) => ({ ...current, slug: slugify(value) }))} /><Field label="Category" value={article.category} onChange={(value) => setArticle((current) => ({ ...current, category: value }))} /><div className="md:col-span-2"><Field label={`Title · ${language.toUpperCase()}`} value={article.title[language]} onChange={(value) => updateLocalized("title", value)} /></div><div className="md:col-span-2"><Area label={`Excerpt · ${language.toUpperCase()}`} rows={3} value={article.excerpt[language]} onChange={(value) => updateLocalized("excerpt", value)} /></div><div className="md:col-span-2"><Area label={`Article body · ${language.toUpperCase()}`} rows={14} value={article.body[language]} onChange={(value) => updateLocalized("body", value)} /></div><div className="md:col-span-2"><Field label="Cover image URL" value={article.cover_image_url} onChange={(value) => setArticle((current) => ({ ...current, cover_image_url: value }))} /></div><Field label={`SEO title · ${language.toUpperCase()}`} value={article.seo_title[language]} onChange={(value) => updateLocalized("seo_title", value)} /><Field label={`SEO description · ${language.toUpperCase()}`} value={article.seo_description[language]} onChange={(value) => updateLocalized("seo_description", value)} /></div>
          <label className="mt-6 flex items-center gap-3 rounded-xl border border-white/10 p-4 text-sm text-white/65"><input type="checkbox" checked={article.published} onChange={(event) => setArticle((current) => ({ ...current, published: event.target.checked }))} /> Publish this article</label>
          {(message || error) && <p className={`mt-5 text-sm ${error ? "text-red-300" : "text-emerald-300"}`}>{error || message}</p>}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4"><button type="button" onClick={remove} disabled={!article.id || saving} className="inline-flex items-center gap-2 text-xs text-white/35 disabled:opacity-25"><Trash2 size={14} /> Delete</button><button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs text-black disabled:opacity-50">{saving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />} Save article</button></div>
        </form>
      </div>
    </div>
  </main>;
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <label className="block"><span className="mb-2 block text-[9px] uppercase tracking-[.2em] text-white/35">{label}</span><input className={inputClass} value={value} onChange={(event) => onChange(event.target.value)} /></label>; }
function Area({ label, value, rows, onChange }: { label: string; value: string; rows: number; onChange: (value: string) => void }) { return <label className="block"><span className="mb-2 block text-[9px] uppercase tracking-[.2em] text-white/35">{label}</span><textarea rows={rows} className={`${inputClass} resize-y leading-6`} value={value} onChange={(event) => onChange(event.target.value)} /></label>; }
