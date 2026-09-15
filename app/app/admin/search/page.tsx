"use client";

import { useMemo, useState } from "react";
import { Search, FileText, ClipboardList, FolderKanban, MessageSquare, CheckCircle2 } from "lucide-react";

type Result = {
  type: string;
  title: string;
  detail: string;
  href: string;
};

const results: Result[] = [
  { type: "Project", title: "City Edge Mall", detail: "CEM-001 · Active · Design Development", href: "/app/admin/projects/city-edge-mall" },
  { type: "Task", title: "Revise Ground Floor Plan", detail: "TSK-001 · Omar Mohamed · In Progress", href: "/app/admin/tasks" },
  { type: "File", title: "Project drawings & documents", detail: "Drawing and document control", href: "/app/admin/files" },
  { type: "Approval", title: "Project approvals", detail: "Review and approval workflow", href: "/app/admin/approvals" },
  { type: "Message", title: "Project messages", detail: "Studio communication", href: "/app/admin/messages" },
  { type: "Report", title: "Management Reports", detail: "Portfolio and project performance", href: "/app/admin/reports" },
];

const icons: Record<string, React.ReactNode> = {
  Project: <FolderKanban size={18} />,
  Task: <ClipboardList size={18} />,
  File: <FileText size={18} />,
  Approval: <CheckCircle2 size={18} />,
  Message: <MessageSquare size={18} />,
  Report: <FileText size={18} />,
};

export default function GlobalSearchPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return results;
    return results.filter((r) =>
      `${r.type} ${r.title} ${r.detail}`.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <main style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <Search size={24} />
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Global Search</h1>
        </div>
        <p style={{ opacity: 0.65, margin: 0 }}>
          Search across projects, tasks, files, approvals, messages and reports.
        </p>
      </div>

      <div style={{ position: "relative", marginBottom: 24 }}>
        <Search size={19} style={{ position: "absolute", left: 16, top: 16, opacity: 0.5 }} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Mason & Arc..."
          style={{
            width: "100%",
            height: 52,
            padding: "0 18px 0 48px",
            border: "1px solid rgba(128,128,128,.25)",
            borderRadius: 12,
            background: "transparent",
            outline: "none",
            fontSize: 16,
          }}
        />
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {filtered.map((r) => (
          <a
            key={`${r.type}-${r.title}`}
            href={r.href}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: 16,
              border: "1px solid rgba(128,128,128,.2)",
              borderRadius: 12,
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div style={{ opacity: 0.7 }}>{icons[r.type]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 650 }}>{r.title}</div>
              <div style={{ fontSize: 13, opacity: 0.6, marginTop: 3 }}>{r.type} · {r.detail}</div>
            </div>
          </a>
        ))}

        {filtered.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", opacity: 0.55 }}>
            No results found.
          </div>
        )}
      </div>
    </main>
  );
}
