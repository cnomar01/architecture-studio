"use client";

import { useMemo, useState } from "react";
import { Activity, Filter, ShieldCheck, UserRound } from "lucide-react";

type AuditEntry = {
  id: string;
  action: string;
  actor: string;
  area: string;
  target: string;
  time: string;
  severity: "Info" | "Warning" | "Critical";
};

const entries: AuditEntry[] = [
  { id: "AUD-001", action: "Build completed", actor: "Mason & Arc", area: "System", target: "Studio OS", time: "Today", severity: "Info" },
  { id: "AUD-002", action: "Security settings reviewed", actor: "Owner", area: "Security", target: "Permissions", time: "Today", severity: "Info" },
  { id: "AUD-003", action: "Report generated", actor: "Owner", area: "Reports", target: "Management Report", time: "Today", severity: "Info" },
  { id: "AUD-004", action: "Approval workflow updated", actor: "Owner", area: "Approvals", target: "Project approvals", time: "Today", severity: "Warning" },
];

export default function AuditPage() {
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return entries.filter((entry) => {
      const matchesArea = area === "All" || entry.area === area;
      const matchesQuery =
        !q ||
        `${entry.action} ${entry.actor} ${entry.area} ${entry.target}`
          .toLowerCase()
          .includes(q);
      return matchesArea && matchesQuery;
    });
  }, [query, area]);

  return (
    <main style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <Activity size={24} />
        <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0 }}>Audit & Activity</h1>
      </div>
      <p style={{ opacity: 0.65, marginBottom: 26 }}>
        Review important studio actions, actors, areas and security-sensitive events.
      </p>

      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: "1 1 320px" }}>
          <Activity size={17} style={{ position: "absolute", left: 14, top: 14, opacity: 0.5 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search audit activity..."
            style={{
              width: "100%",
              height: 46,
              padding: "0 14px 0 40px",
              border: "1px solid rgba(128,128,128,.25)",
              borderRadius: 10,
              background: "transparent",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Filter size={17} />
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            style={{ height: 46, borderRadius: 10, padding: "0 12px", background: "transparent" }}
          >
            <option>All</option>
            <option>System</option>
            <option>Security</option>
            <option>Reports</option>
            <option>Approvals</option>
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        {filtered.map((entry) => (
          <div
            key={entry.id}
            style={{
              display: "flex",
              gap: 14,
              alignItems: "center",
              padding: 16,
              border: "1px solid rgba(128,128,128,.2)",
              borderRadius: 12,
            }}
          >
            <ShieldCheck size={19} style={{ opacity: 0.65 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 650 }}>{entry.action}</div>
              <div style={{ fontSize: 13, opacity: 0.62, marginTop: 3 }}>
                {entry.area} · {entry.target} · {entry.time}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 13, opacity: 0.7 }}>
              <UserRound size={15} />
              {entry.actor}
            </div>
          </div>
        ))}

        {!filtered.length && (
          <div style={{ padding: 40, textAlign: "center", opacity: 0.55 }}>
            No audit activity found.
          </div>
        )}
      </div>
    </main>
  );
}
