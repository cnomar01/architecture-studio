"use client";

import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, LockKeyhole, History, UsersRound, CheckCircle2 } from "lucide-react";
import { getAllRolePermissions, Permission, UserRole } from "@/lib/core/authStore";
import { getRecentAuditEntries } from "@/lib/core/auditStore";
import PermissionGuard from "@/lib/core/PermissionGuard";

const roles: UserRole[] = ["Owner", "Manager", "Engineer", "Client"];

export default function SecurityPage() {
  return <PermissionGuard permission="team.manage"><SecurityContent /></PermissionGuard>;
}

function SecurityContent() {
  const [refresh, setRefresh] = useState(0);
  const permissions = useMemo(() => getAllRolePermissions(), [refresh]);
  const [audit, setAudit] = useState(getRecentAuditEntries(80));

  useEffect(() => {
    setAudit(getRecentAuditEntries(80));
  }, [refresh]);

  const permissionNames: Permission[] = [
    "projects.view", "projects.manage", "team.view", "team.manage",
    "tasks.view", "tasks.manage", "files.view", "files.manage",
    "approvals.view", "approvals.manage", "finance.view", "finance.manage",
    "site.view", "site.manage", "clients.view", "clients.manage",
  ];

  return (
    <main className="min-h-screen bg-[#111111] px-6 py-10 text-white lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">Security & Governance</p>
            <h1 className="mt-3 text-3xl font-light tracking-tight">Permissions & Security</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/40">Role permissions, access governance and an auditable activity trail for the studio workspace.</p>
          </div>
          <button onClick={() => setRefresh((v) => v + 1)} className="rounded-lg border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-white/50 hover:bg-white/[0.05] hover:text-white">Refresh</button>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <Metric icon={<ShieldCheck size={16} />} label="Roles" value="4" detail="Owner · Manager · Engineer · Client" />
          <Metric icon={<LockKeyhole size={16} />} label="Permission Rules" value={String(permissionNames.length)} detail="Defined studio capabilities" />
          <Metric icon={<History size={16} />} label="Audit Events" value={String(audit.length)} detail="Latest recorded events" />
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/10 p-6">
            <div className="flex items-center gap-3"><UsersRound size={17} className="text-white/40" /><h2 className="text-sm font-medium">Role Matrix</h2></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead><tr className="border-b border-white/10 text-[9px] uppercase tracking-[0.16em] text-white/25"><th className="px-6 py-4">Permission</th>{roles.map(r => <th key={r} className="px-4 py-4">{r}</th>)}</tr></thead>
              <tbody>{permissionNames.map(permission => <tr key={permission} className="border-b border-white/5 last:border-0"><td className="px-6 py-4 text-xs text-white/60">{permission}</td>{roles.map(role => { const enabled = permissions[role].includes(permission); return <td key={role} className="px-4 py-4">{enabled ? <span className="inline-flex items-center gap-2 text-[10px] text-white/65"><CheckCircle2 size={13} />Allowed</span> : <span className="text-[10px] text-white/15">—</span>}</td>; })}</tr>)}</tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02]">
          <div className="border-b border-white/10 p-6"><div className="flex items-center gap-3"><History size={17} className="text-white/40" /><h2 className="text-sm font-medium">Audit Log</h2></div></div>
          {audit.length === 0 ? <div className="p-10 text-center text-xs text-white/25">No audit events recorded yet.</div> : <div className="divide-y divide-white/5">{audit.slice(0, 20).map(item => <div key={item.id} className="flex flex-col gap-2 px-6 py-4 md:flex-row md:items-center md:justify-between"><div><p className="text-xs text-white/65">{item.title}</p><p className="mt-1 text-[10px] text-white/30">{item.description}</p></div><div className="text-right text-[9px] uppercase tracking-[0.12em] text-white/25"><p>{item.userName || "System"} · {item.action}</p><p className="mt-1 normal-case tracking-normal">{new Date(item.createdAt).toLocaleString()}</p></div></div>)}</div>}
        </section>
      </div>
    </main>
  );
}

function Metric({ icon, label, value, detail }: { icon: React.ReactNode; label: string; value: string; detail: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"><div className="flex items-center gap-2 text-white/35">{icon}<span className="text-[9px] uppercase tracking-[0.18em]">{label}</span></div><p className="mt-4 text-2xl font-light">{value}</p><p className="mt-1 text-[10px] text-white/25">{detail}</p></div>;
}
