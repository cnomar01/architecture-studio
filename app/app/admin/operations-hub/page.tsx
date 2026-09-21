"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";

type Tab = "CRM" | "Contracts" | "Procurement" | "QA/QC" | "HSE";
type Project = { id: string; code: string; name: string };
type RecordItem = Record<string, string | number | null | undefined> & { id: string };

const settings: Record<Tab, { resource: string; label: string; newLabel: string; prefix: string; statuses: string[] }> = {
  CRM: { resource: "leads", label: "CRM / Leads", newLabel: "New lead", prefix: "LEAD", statuses: ["New", "Qualified", "Proposal", "Negotiation", "Won", "Lost"] },
  Contracts: { resource: "contracts", label: "Contracts", newLabel: "New contract", prefix: "CON", statuses: ["Draft", "Active", "Variation", "Completed", "Expired"] },
  Procurement: { resource: "procurement", label: "Procurement", newLabel: "New procurement item", prefix: "PO", statuses: ["Draft", "RFQ", "Quotations", "Approved", "Ordered", "Delivered", "Closed"] },
  "QA/QC": { resource: "quality", label: "QA / QC", newLabel: "New quality item", prefix: "QC", statuses: ["Open", "Under Review", "Corrective Action", "Closed"] },
  HSE: { resource: "safety", label: "HSE", newLabel: "New safety item", prefix: "HSE", statuses: ["Open", "Investigating", "Corrective Action", "Closed"] },
};
const tabs = Object.keys(settings) as Tab[];

function blank(tab: Tab, project?: Project): RecordItem {
  const base = { id: "" };
  if (tab === "CRM") return { ...base, company: "", contact_name: "", email: "", status: "New", notes: "" };
  if (tab === "Contracts") return { ...base, project_id: project?.id || "", title: "", status: "Draft", value: "", currency: "EGP", start_date: "", end_date: "" };
  if (tab === "Procurement") return { ...base, project_id: project?.id || "", item: "", status: "Draft", priority: "Medium", supplier: "", needed_by: "" };
  if (tab === "QA/QC") return { ...base, project_id: project?.id || "", title: "", status: "Open", priority: "Medium", description: "" };
  return { ...base, project_id: project?.id || "", title: "", status: "Open", severity: "Medium", description: "" };
}

export default function OperationsHub() {
  const [tab, setTab] = useState<Tab>("CRM");
  const [items, setItems] = useState<RecordItem[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<RecordItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const config = settings[tab];

  const load = useCallback(async (selected: Tab) => {
    setLoading(true); setError("");
    try {
      const [itemsResponse, projectsResponse] = await Promise.all([fetch(`/api/data/${settings[selected].resource}`, { cache: "no-store", credentials: "include" }), fetch("/api/data/projects", { cache: "no-store", credentials: "include" })]);
      const itemData = await itemsResponse.json().catch(() => ({})); const projectData = await projectsResponse.json().catch(() => ({}));
      if (!itemsResponse.ok) throw new Error(itemData.error || `Could not load ${settings[selected].label}.`);
      if (!projectsResponse.ok) throw new Error(projectData.error || "Could not load projects.");
      setItems(itemData.data || []); setProjects(projectData.data || []);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load operations."); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(tab); }, [tab, load]);

  const projectName = useMemo(() => new Map(projects.map((project) => [project.id, `${project.code} — ${project.name}`])), [projects]);
  function select(next: Tab) { setTab(next); setEditing(null); setMessage(""); }
  function update(key: string, value: string) { setEditing((current) => current ? { ...current, [key]: value } : current); }
  function startNew() { setError(""); setMessage(""); setEditing(blank(tab, projects[0])); }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!editing) return; setError(""); setMessage("");
    const required = tab === "CRM" ? String(editing.company || "").trim() : String(tab === "Procurement" ? editing.item || "" : editing.title || "").trim();
    if (!required) { setError(tab === "CRM" ? "Company is required." : "Title is required."); return; }
    setSaving(true);
    try {
      const payload = { ...editing, id: editing.id || `${config.prefix}-${crypto.randomUUID().slice(0, 8).toUpperCase()}` };
      const response = await fetch(`/api/data/${config.resource}`, { method: editing.id ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) });
      const data = await response.json().catch(() => ({})); if (!response.ok) throw new Error(data.error || "Could not save this item.");
      setEditing(null); setMessage(editing.id ? "Item updated." : "Item created."); await load(tab);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not save this item."); }
    finally { setSaving(false); }
  }

  async function remove(item: RecordItem) { if (!window.confirm(`Delete this ${config.label.slice(0, -1).toLowerCase()}? This cannot be undone.`)) return; const response = await fetch(`/api/data/${config.resource}?id=${encodeURIComponent(item.id)}`, { method: "DELETE", credentials: "include" }); const data = await response.json().catch(() => ({})); if (!response.ok) { setError(data.error || "Could not delete this item."); return; } setItems((current) => current.filter((entry) => entry.id !== item.id)); setMessage("Item deleted."); }

  return <main className="min-h-screen bg-[#f6f6f4] px-6 py-10 text-black lg:px-12"><div className="mx-auto max-w-7xl"><p className="text-[10px] uppercase tracking-[0.3em] text-black/40">Mason & Arc / Operations</p><h1 className="mt-3 text-4xl font-medium">Commercial & Delivery Hub</h1><p className="mt-2 text-sm text-black/50">Create, edit and delete CRM, contracts, procurement, QA/QC and HSE records.</p>
    <div className="mt-8 flex flex-wrap gap-2">{tabs.map((item) => <button key={item} onClick={() => select(item)} className={`rounded-lg border px-4 py-2 text-xs ${tab === item ? "border-black bg-black text-white" : "border-black/10 bg-white hover:border-black/25"}`}>{item}</button>)}</div>
    {(error || message) && <p role="status" className={`mt-5 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-300 bg-red-50 text-red-700" : "border-emerald-300 bg-emerald-50 text-emerald-800"}`}>{error || message}</p>}
    <div className="mt-6 flex items-center justify-between rounded-xl border border-black/10 bg-white p-4"><div><p className="font-medium">{config.label}</p><p className="mt-1 text-sm text-black/50">{items.length} shared record{items.length === 1 ? "" : "s"}</p></div><button onClick={startNew} className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs text-white"><Plus size={14} />{config.newLabel}</button></div>
    {editing && <Editor tab={tab} item={editing} projects={projects} saving={saving} onCancel={() => setEditing(null)} onSave={save} onUpdate={update} />}
    <section className="mt-5 overflow-hidden rounded-xl border border-black/10 bg-white">{loading ? <p className="p-8 text-sm text-black/50">Loading {config.label.toLowerCase()}…</p> : items.map((item) => <article key={item.id} className="flex flex-col gap-3 border-b border-black/[.06] p-5 last:border-0 md:flex-row md:items-center md:justify-between"><div><p className="text-sm font-medium">{title(tab, item)}</p><p className="mt-1 text-xs text-black/45">{item.id} · {detail(tab, item, projectName)}</p></div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-black/5 px-3 py-1.5 text-xs">{String(item.status || "Draft")}</span><button onClick={() => setEditing({ ...item })} className="inline-flex items-center gap-1 rounded-md border border-black/10 px-3 py-2 text-[11px]"><Pencil size={12} />Edit</button><button onClick={() => void remove(item)} className="inline-flex items-center gap-1 rounded-md border border-red-200 px-3 py-2 text-[11px] text-red-700"><Trash2 size={12} />Delete</button></div></article>)}{!loading && !items.length && <p className="p-10 text-center text-sm text-black/50">No records yet. Create the first one.</p>}</section>
  </div></main>;
}

function Editor({ tab, item, projects, saving, onCancel, onSave, onUpdate }: { tab: Tab; item: RecordItem; projects: Project[]; saving: boolean; onCancel: () => void; onSave: (event: FormEvent<HTMLFormElement>) => Promise<void>; onUpdate: (key: string, value: string) => void }) { const config = settings[tab]; return <form onSubmit={(event) => void onSave(event)} className="operations-editor mt-5 rounded-xl border border-black/10 bg-white p-5"><div className="flex items-center justify-between"><div><h2 className="font-medium">{item.id ? `Edit ${config.label}` : config.newLabel}</h2><p className="mt-1 text-sm text-black/50">This is saved in the shared studio database.</p></div><button type="button" onClick={onCancel} className="rounded-full p-2 text-black/45"><X size={18} /></button></div><div className="mt-5 grid gap-4 md:grid-cols-2">{tab === "CRM" ? <><Field label="Company"><input value={String(item.company || "")} onChange={(event) => onUpdate("company", event.target.value)} required /></Field><Field label="Status"><Status tab={tab} value={String(item.status || "New")} onChange={onUpdate} /></Field><Field label="Contact name"><input value={String(item.contact_name || "")} onChange={(event) => onUpdate("contact_name", event.target.value)} /></Field><Field label="Email"><input type="email" value={String(item.email || "")} onChange={(event) => onUpdate("email", event.target.value)} /></Field><Field label="Notes" wide><textarea value={String(item.notes || "")} onChange={(event) => onUpdate("notes", event.target.value)} rows={3} /></Field></> : <><Field label="Project"><select value={String(item.project_id || "")} onChange={(event) => onUpdate("project_id", event.target.value)}><option value="">No project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.code} — {project.name}</option>)}</select></Field><Field label="Status"><Status tab={tab} value={String(item.status || "Draft")} onChange={onUpdate} /></Field>{tab === "Procurement" ? <Field label="Item"><input value={String(item.item || "")} onChange={(event) => onUpdate("item", event.target.value)} required /></Field> : <Field label="Title"><input value={String(item.title || "")} onChange={(event) => onUpdate("title", event.target.value)} required /></Field>}{tab === "Contracts" ? <><Field label="Value"><input type="number" min="0" value={String(item.value || "")} onChange={(event) => onUpdate("value", event.target.value)} /></Field><Field label="Currency"><input value={String(item.currency || "EGP")} onChange={(event) => onUpdate("currency", event.target.value)} /></Field><Field label="Start date"><input type="date" value={String(item.start_date || "").slice(0, 10)} onChange={(event) => onUpdate("start_date", event.target.value)} /></Field><Field label="End date"><input type="date" value={String(item.end_date || "").slice(0, 10)} onChange={(event) => onUpdate("end_date", event.target.value)} /></Field></> : tab === "Procurement" ? <><Field label="Priority"><select value={String(item.priority || "Medium")} onChange={(event) => onUpdate("priority", event.target.value)}><option>Low</option><option>Medium</option><option>High</option><option>Urgent</option></select></Field><Field label="Supplier"><input value={String(item.supplier || "")} onChange={(event) => onUpdate("supplier", event.target.value)} /></Field><Field label="Needed by"><input type="date" value={String(item.needed_by || "").slice(0, 10)} onChange={(event) => onUpdate("needed_by", event.target.value)} /></Field></> : <><Field label={tab === "HSE" ? "Severity" : "Priority"}><select value={String(tab === "HSE" ? item.severity || "Medium" : item.priority || "Medium")} onChange={(event) => onUpdate(tab === "HSE" ? "severity" : "priority", event.target.value)}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></Field><Field label="Description" wide><textarea value={String(item.description || "")} onChange={(event) => onUpdate("description", event.target.value)} rows={3} /></Field></>}</>}</div><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onCancel} className="rounded-lg border border-black/10 px-4 py-2.5 text-sm">Cancel</button><button disabled={saving} className="rounded-lg bg-black px-4 py-2.5 text-sm text-white disabled:opacity-50">{saving ? "Saving…" : "Save"}</button></div></form>; }
function Status({ tab, value, onChange }: { tab: Tab; value: string; onChange: (key: string, value: string) => void }) { return <select value={value} onChange={(event) => onChange("status", event.target.value)}>{settings[tab].statuses.map((status) => <option key={status}>{status}</option>)}</select>; }
function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) { return <label className={`block text-sm ${wide ? "md:col-span-2" : ""}`}><span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">{label}</span>{children}</label>; }
function title(tab: Tab, item: RecordItem) { return String(tab === "CRM" ? item.company : tab === "Procurement" ? item.item : item.title || "Untitled"); }
function detail(tab: Tab, item: RecordItem, projectName: Map<string, string>) { if (tab === "CRM") return `${item.contact_name || "No contact"}${item.email ? ` · ${item.email}` : ""}`; const project = item.project_id ? projectName.get(String(item.project_id)) || "Unknown project" : "No project"; if (tab === "Contracts") return `${project} · ${item.currency || "EGP"} ${item.value || "0"}`; if (tab === "Procurement") return `${project} · ${item.supplier || "Supplier TBD"}${item.needed_by ? ` · Needed ${String(item.needed_by).slice(0, 10)}` : ""}`; return `${project} · ${item.description || "No description"}`; }
