"use client";

import { useState } from "react";
import { CalendarDays, CheckSquare, FileText, Menu, MessageSquare, X } from "lucide-react";

const actions = [
  { label: "Tasks", href: "/app/admin/tasks", icon: <CheckSquare size={20} /> },
  { label: "Calendar", href: "/app/admin/calendar", icon: <CalendarDays size={20} /> },
  { label: "Files", href: "/app/admin/files", icon: <FileText size={20} /> },
  { label: "Messages", href: "/app/admin/messages", icon: <MessageSquare size={20} /> },
];

export default function MobileStudio() {
  const [open, setOpen] = useState(false);

  return (
    <main style={{ minHeight: "100vh", padding: 18, maxWidth: 680, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 26 }}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.55, letterSpacing: 1 }}>MASON & ARC</div>
          <h1 style={{ margin: "4px 0 0", fontSize: 25 }}>Studio Mobile</h1>
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-label="Open mobile navigation"
          style={{ border: "1px solid rgba(128,128,128,.25)", borderRadius: 10, padding: 10, background: "transparent" }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {open && (
        <nav style={{ display: "grid", gap: 8, marginBottom: 18 }}>
          {actions.map((item) => (
            <a key={item.href} href={item.href} style={{ display: "flex", gap: 10, alignItems: "center", padding: 14, border: "1px solid rgba(128,128,128,.2)", borderRadius: 10, textDecoration: "none", color: "inherit" }}>
              {item.icon}{item.label}
            </a>
          ))}
        </nav>
      )}

      <section style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 10 }}>
        {actions.map((item) => (
          <a key={item.href} href={item.href} style={{ display: "flex", flexDirection: "column", gap: 12, padding: 18, minHeight: 120, justifyContent: "space-between", border: "1px solid rgba(128,128,128,.2)", borderRadius: 14, textDecoration: "none", color: "inherit" }}>
            {item.icon}
            <span style={{ fontWeight: 650 }}>{item.label}</span>
          </a>
        ))}
      </section>

      <p style={{ marginTop: 24, fontSize: 13, opacity: 0.55 }}>
        Mobile workspace for the Studio OS. The public Mason & Arc website remains unchanged.
      </p>
    </main>
  );
}
