"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Clock3, Download, FileText, Folder, GitBranch, Pencil, Plus, Search, Trash2, Upload, X } from "lucide-react";

type Project = { id: string; code: string; name: string };
type ProjectFile = { id: string; project_id: string | null; project_name: string | null; name: string; category: string; revision: string; document_number: string | null; discipline: string | null; issue_date: string | null; visibility: "Internal" | "Client"; status: string; storage_key: string | null; file_name: string | null; file_type: string | null; file_size: number | null; uploaded_by_id: string | null; uploaded_by_name: string | null; description: string; folder: string; tags: string[]; parent_file_id: string | null; is_current: boolean };

const categories = ["Architectural Drawing", "Civil Drawing", "Render", "Document", "Other"];
const statuses = ["Draft", "Pending Approval", "Approved", "Changes Requested"];
const emptyFile = (): ProjectFile => ({ id: "", project_id: "", project_name: "", name: "", category: "Architectural Drawing", revision: "R01", document_number: "", discipline: "", issue_date: new Date().toISOString().slice(0, 10), visibility: "Internal", status: "Draft", storage_key: "", file_name: "", file_type: "", file_size: 0, uploaded_by_id: "", uploaded_by_name: "Mason & Arc", description: "", folder: "General", tags: [], parent_file_id: null, is_current: true });

function driveFileId(storageKey: string | null | undefined) {
  return storageKey?.startsWith("drive:")
    ? storageKey.slice("drive:".length)
    : null;
}

function driveFileUrl(storageKey: string | null | undefined) {
  const id = driveFileId(storageKey);
  return id ? `https://drive.google.com/file/d/${encodeURIComponent(id)}/view` : "";
}

async function deleteDriveAttachment(
  fileId: string,
  projectId: string
) {
  const response = await fetch(
    `/api/integrations/drive/file?fileId=${encodeURIComponent(
      fileId
    )}&projectId=${encodeURIComponent(projectId)}`,
    { method: "DELETE", credentials: "include" }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Could not remove the Google Drive file.");
  }
}

export default function AdminFilesPage() {
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [status, setStatus] = useState("All");
  const [folder, setFolder] = useState("All");
  const [editing, setEditing] = useState<ProjectFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [filesResponse, projectsResponse] = await Promise.all([fetch("/api/data/files", { cache: "no-store", credentials: "include" }), fetch("/api/data/projects", { cache: "no-store", credentials: "include" })]);
      const fileData = await filesResponse.json().catch(() => ({})); const projectData = await projectsResponse.json().catch(() => ({}));
      if (!filesResponse.ok) throw new Error(fileData.error || "Could not load files.");
      if (!projectsResponse.ok) throw new Error(projectData.error || "Could not load projects.");
      setFiles((fileData.data || []).map((item: ProjectFile) => ({ ...item, tags: Array.isArray(item.tags) ? item.tags : [] })));
      setProjects(projectData.data || []);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Could not load files."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const folders = useMemo(() => ["All", ...Array.from(new Set(files.map((file) => file.folder || "General"))).sort()], [files]);
  const visibleFiles = useMemo(() => files.filter((file) => {
    const words = `${file.name} ${file.file_name || ""} ${file.project_name || ""} ${file.category} ${file.revision} ${file.folder} ${(file.tags || []).join(" ")}`.toLowerCase();
    return (category === "All" || file.category === category) && (status === "All" || file.status === status) && (folder === "All" || (file.folder || "General") === folder) && words.includes(query.trim().toLowerCase());
  }), [files, query, category, status, folder]);

  function beginNew() { const next = emptyFile(); if (projects[0]) { next.project_id = projects[0].id; next.project_name = projects[0].name; } setPendingFile(null); setMessage(""); setError(""); setEditing(next); }
  function beginEdit(file: ProjectFile) { setPendingFile(null); setMessage(""); setError(""); setEditing({ ...file, tags: [...(file.tags || [])] }); }
  function beginRevision(file: ProjectFile) { const next = { ...file, id: "", revision: nextRevision(file.revision), parent_file_id: file.parent_file_id || file.id, is_current: true, issue_date: new Date().toISOString().slice(0, 10) }; setPendingFile(null); setMessage(""); setError(""); setEditing(next); }
  function update<Key extends keyof ProjectFile>(key: Key, value: ProjectFile[Key]) { setEditing((current) => current ? { ...current, [key]: value } : current); }

  async function attach(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    event.target.value = "";

    if (!selected) return;

    setPendingFile(selected);
    setError("");
    setEditing((current) =>
      current
        ? {
            ...current,
            file_name: selected.name,
            file_type: selected.type || "application/octet-stream",
            file_size: selected.size,
          }
        : current
    );
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;

    setError("");
    setMessage("");

    if (!editing.name.trim() || !editing.project_id) {
      setError("Choose a project and enter a file name.");
      return;
    }

    setSaving(true);

    let uploadedDriveId: string | null = null;

    try {
      const project = projects.find((item) => item.id === editing.project_id);
      const payload = {
        ...editing,
        id:
          editing.id ||
          `FIL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
        project_name:
          project?.name || editing.project_name || "",
        tags: editing.tags
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      const previousDriveId = driveFileId(editing.storage_key);

      if (pendingFile) {
        const sessionResponse = await fetch(
          "/api/integrations/drive/upload-session",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({
              projectId: payload.project_id,
              recordId: payload.id,
              fileName: pendingFile.name,
              contentType:
                pendingFile.type || "application/octet-stream",
              fileSize: pendingFile.size,
              category: payload.category,
              folder: payload.folder,
              revision: payload.revision,
            }),
          }
        );

        const session = await sessionResponse
          .json()
          .catch(() => ({}));

        if (!sessionResponse.ok || !session.uploadUrl) {
          throw new Error(
            session.error || "Could not start the Google Drive upload."
          );
        }

        const uploadResponse = await fetch(session.uploadUrl, {
          method: "PUT",
          headers: {
            "Content-Type":
              pendingFile.type || "application/octet-stream",
          },
          body: pendingFile,
        });

        const uploaded = (await uploadResponse
          .json()
          .catch(() => ({}))) as {
          id?: string;
          name?: string;
          mimeType?: string;
          size?: string;
        };

        if (!uploadResponse.ok || !uploaded.id) {
          throw new Error(
            `Google Drive upload failed (${uploadResponse.status}).`
          );
        }

        uploadedDriveId = uploaded.id;
        payload.storage_key = `drive:${uploaded.id}`;
        payload.file_name = uploaded.name || pendingFile.name;
        payload.file_type =
          uploaded.mimeType ||
          pendingFile.type ||
          "application/octet-stream";
        payload.file_size = Number(uploaded.size || pendingFile.size);
      }

      const response = await fetch("/api/data/files", {
        method: editing.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || "Could not save this file.");
      }

      if (!editing.id && editing.parent_file_id) {
        const revisionResponse = await fetch("/api/data/files", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            id: editing.parent_file_id,
            is_current: false,
          }),
        });

        if (!revisionResponse.ok) {
          console.error(
            "New revision saved, but the previous revision could not be marked non-current."
          );
        }
      }

      if (
        editing.id &&
        pendingFile &&
        previousDriveId &&
        previousDriveId !== uploadedDriveId
      ) {
        try {
          await deleteDriveAttachment(
            previousDriveId,
            String(editing.project_id)
          );
        } catch (cleanupError) {
          console.error(
            "Old Google Drive attachment cleanup failed",
            cleanupError
          );
        }
      }

      setPendingFile(null);
      setEditing(null);
      setMessage(
        editing.id
          ? "File updated."
          : editing.parent_file_id
            ? "New revision uploaded to Google Drive."
            : pendingFile
              ? "File uploaded to Google Drive."
              : "File record created."
      );
      await load();
    } catch (cause) {
      if (uploadedDriveId) {
        try {
          await deleteDriveAttachment(
            uploadedDriveId,
            String(editing.project_id)
          );
        } catch (cleanupError) {
          console.error(
            "Google Drive rollback cleanup failed",
            cleanupError
          );
        }
      }

      setError(
        cause instanceof Error
          ? cause.message
          : "Could not save this file."
      );
    } finally {
      setSaving(false);
    }
  }

  async function remove(file: ProjectFile) {
    if (
      !window.confirm(
        `Delete “${file.name}” (${file.revision})? This cannot be undone.`
      )
    ) {
      return;
    }

    setError("");

    const response = await fetch(
      `/api/data/files?id=${encodeURIComponent(file.id)}`,
      { method: "DELETE", credentials: "include" }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      setError(data.error || "Could not delete this file.");
      return;
    }

    const fileId = driveFileId(file.storage_key);

    if (fileId) {
      try {
        await deleteDriveAttachment(
          fileId,
          String(file.project_id || "")
        );
      } catch (cleanupError) {
        console.error(
          "Database record deleted, but Drive cleanup failed",
          cleanupError
        );
        setMessage(
          "File record deleted. Google Drive cleanup needs attention."
        );
        setFiles((current) =>
          current.filter((item) => item.id !== file.id)
        );
        return;
      }
    }

    setFiles((current) =>
      current.filter((item) => item.id !== file.id)
    );
    setMessage("File deleted.");
  }

  const stats = { total: files.length, approved: files.filter((file) => file.status === "Approved").length, pending: files.filter((file) => file.status === "Pending Approval").length, revisions: files.filter((file) => Boolean(file.parent_file_id)).length };
  return <main className="min-h-screen bg-[#f6f6f4] px-4 py-6 text-[#111] md:px-8"><div className="mx-auto max-w-7xl">
    <header className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs uppercase tracking-[0.25em] text-black/45">Mason & Arc / Workspace</p><h1 className="mt-2 text-4xl font-semibold tracking-tight">Files</h1><p className="mt-2 max-w-2xl text-sm text-black/55">Shared project files, revisions and document control.</p></div><div className="flex flex-wrap gap-3"><Link href="/app/admin/files/transmittals" className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-medium">Transmittals</Link><button onClick={beginNew} className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white"><Upload size={16} />Upload File</button></div></header>
    {(error || message) && <p role="status" className={`mt-5 rounded-xl border px-4 py-3 text-sm ${error ? "border-red-300 bg-red-50 text-red-700" : "border-emerald-300 bg-emerald-50 text-emerald-800"}`}>{error || message}</p>}
    <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><Stat label="Total files" value={stats.total} Icon={FileText} /><Stat label="Approved" value={stats.approved} Icon={CheckCircle2} /><Stat label="Pending" value={stats.pending} Icon={Clock3} /><Stat label="Revisions" value={stats.revisions} Icon={GitBranch} /></section>
    <section className="mt-6 rounded-2xl border border-black/8 bg-white p-4"><div className="flex flex-col gap-3 lg:flex-row"><label className="relative flex-1"><Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/35" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search files, projects, revisions, tags…" className="w-full rounded-xl border border-black/10 bg-[#fafafa] py-3 pl-11 pr-4 text-sm outline-none focus:border-black/30" /></label><Select value={category} onChange={setCategory} options={["All", ...categories]} /><Select value={status} onChange={setStatus} options={["All", ...statuses]} /><Select value={folder} onChange={setFolder} options={folders} /></div></section>
    {editing && <FileEditor file={editing} projects={projects} saving={saving} onCancel={() => setEditing(null)} onSave={save} onUpdate={update} onAttach={attach} />}
    <section className="mt-6 grid gap-3">{loading ? <p className="py-10 text-sm text-black/50">Loading files…</p> : visibleFiles.map((file) => <article key={file.id} className="rounded-2xl border border-black/8 bg-white p-5"><div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div className="flex min-w-0 items-start gap-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black text-white"><FileText size={20} /></div><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><h2 className="font-semibold">{file.name}</h2><span className="rounded-full bg-black px-2.5 py-1 text-[10px] font-semibold text-white">{file.revision}</span>{file.is_current && <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">Current</span>}</div><p className="mt-1 text-sm text-black/50">{file.project_name || "No project"} · {file.category}</p><p className="mt-2 text-xs text-black/45">{file.folder || "General"} · {file.file_name || "No attachment"} · {file.issue_date?.slice(0, 10) || "No date"} · Uploaded by {file.uploaded_by_name || "Studio"}</p></div></div><div className="flex flex-wrap items-center gap-2"><span className={`rounded-full px-3 py-1.5 text-xs font-medium ${badge(file.status)}`}>{file.status}</span>{file.storage_key?.startsWith("data:") && <a href={file.storage_key} download={file.file_name || file.name} className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-2 text-xs"><Download size={13} />Open</a>}{file.storage_key?.startsWith("drive:") && <a href={driveFileUrl(file.storage_key)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-2 text-xs"><Download size={13} />Open Drive</a>}<button onClick={() => beginRevision(file)} className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-2 text-xs"><GitBranch size={13} />Revision</button><button onClick={() => beginEdit(file)} className="inline-flex items-center gap-1 rounded-full border border-black/10 px-3 py-2 text-xs"><Pencil size={13} />Edit</button><button onClick={() => void remove(file)} className="inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-2 text-xs text-red-700"><Trash2 size={13} />Delete</button></div></div>{file.description && <p className="mt-4 border-t border-black/6 pt-4 text-sm leading-6 text-black/55">{file.description}</p>}</article>)}{!loading && !visibleFiles.length && <div className="rounded-2xl border border-dashed border-black/15 bg-white p-12 text-center text-sm text-black/55">No files match your filters.</div>}</section>
    <section className="mt-6 rounded-2xl border border-black/8 bg-white p-5"><div className="flex items-center gap-3"><Folder size={18} /><div><p className="font-medium">Folder structure</p><p className="text-sm text-black/45">{folders.length - 1} folders currently in the shared workspace.</p></div></div></section>
  </div></main>;
}

function FileEditor({ file, projects, saving, onCancel, onSave, onUpdate, onAttach }: { file: ProjectFile; projects: Project[]; saving: boolean; onCancel: () => void; onSave: (event: FormEvent<HTMLFormElement>) => Promise<void>; onUpdate: <Key extends keyof ProjectFile>(key: Key, value: ProjectFile[Key]) => void; onAttach: (event: ChangeEvent<HTMLInputElement>) => Promise<void> }) { return <form onSubmit={(event) => void onSave(event)} className="file-editor mt-6 rounded-2xl border border-black/10 bg-white p-5"><div className="flex items-center justify-between gap-4"><div><h2 className="font-semibold">{file.id ? "Edit file" : file.parent_file_id ? "New revision" : "Upload file"}</h2><p className="mt-1 text-sm text-black/50">Attachments are uploaded directly to the project folder in Google Drive.</p></div><button type="button" onClick={onCancel} className="rounded-full p-2 text-black/45"><X size={18} /></button></div><div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Project"><select value={file.project_id || ""} onChange={(event) => onUpdate("project_id", event.target.value)} required><option value="">Choose a project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.code} — {project.name}</option>)}</select></Field><Field label="File title"><input value={file.name} onChange={(event) => onUpdate("name", event.target.value)} required /></Field><Field label="Category"><select value={file.category} onChange={(event) => onUpdate("category", event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Revision"><input value={file.revision} onChange={(event) => onUpdate("revision", event.target.value)} required /></Field><Field label="Folder"><input value={file.folder} onChange={(event) => onUpdate("folder", event.target.value)} /></Field><Field label="Status"><select value={file.status} onChange={(event) => onUpdate("status", event.target.value)}>{statuses.map((item) => <option key={item}>{item}</option>)}</select></Field><Field label="Visibility"><select value={file.visibility} onChange={(event) => onUpdate("visibility", event.target.value as ProjectFile["visibility"])}><option value="Internal">Internal</option><option value="Client">Client</option></select></Field><Field label="Issue date"><input type="date" value={file.issue_date?.slice(0, 10) || ""} onChange={(event) => onUpdate("issue_date", event.target.value)} /></Field><Field label="Tags"><input value={file.tags.join(", ")} onChange={(event) => onUpdate("tags", event.target.value.split(","))} placeholder="architecture, coordination" /></Field><Field label="Attach file"><input type="file" onChange={(event) => void onAttach(event)} /><p className="mt-1 text-xs text-black/45">{file.file_name || "No file selected"}</p></Field><label className="md:col-span-2"><span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">Description</span><textarea value={file.description} onChange={(event) => onUpdate("description", event.target.value)} rows={3} className="w-full resize-y rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-black/30" /></label></div><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={onCancel} className="rounded-full border border-black/10 px-4 py-2.5 text-sm">Cancel</button><button disabled={saving} className="inline-flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm text-white disabled:opacity-50"><Upload size={15} />{saving ? "Saving…" : "Save file"}</button></div></form>; }
function Field({ label, children }: { label: string; children: React.ReactNode }) { return <label className="block text-sm"><span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">{label}</span>{children}</label>; }
function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) { return <select value={value} onChange={(event) => onChange(event.target.value)} className="rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm">{options.map((item) => <option key={item}>{item}</option>)}</select>; }
function Stat({ label, value, Icon }: { label: string; value: number; Icon: typeof FileText }) { return <div className="rounded-2xl border border-black/8 bg-white p-5"><div className="flex items-center justify-between"><span className="text-xs uppercase tracking-wider text-black/45">{label}</span><Icon size={17} className="text-black/45" /></div><div className="mt-3 text-3xl font-semibold">{value}</div></div>; }
function badge(status: string) { return status === "Approved" ? "bg-emerald-50 text-emerald-700" : status === "Changes Requested" ? "bg-red-50 text-red-700" : status === "Pending Approval" ? "bg-amber-50 text-amber-700" : "bg-black/5 text-black/55"; }
function nextRevision(value: string) { const match = value.match(/(\d+)(?!.*\d)/); return match ? value.slice(0, match.index) + String(Number(match[0]) + 1).padStart(match[0].length, "0") : `${value}-R01`; }
