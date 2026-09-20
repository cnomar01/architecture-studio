"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentUser,
  getDatabaseCurrentUser,
  getRolePermissions,
  isDatabaseAuth,
  Permission,
} from "@/lib/core/authStore";
import { addAuditEntry } from "@/lib/core/auditStore";

export default function PermissionGuard({ permission, children, fallback = "/app/admin" }: { permission: Permission; children: React.ReactNode; fallback?: string }) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);
  useEffect(() => {
    let active = true;
    async function checkPermission() {
      const user = isDatabaseAuth
        ? await getDatabaseCurrentUser()
        : getCurrentUser();
      const ok = Boolean(user && getRolePermissions(user.role).includes(permission));
      if (!active) return;
      setAllowed(ok);
      addAuditEntry({ action: "Access", title: ok ? "Permission granted" : "Permission denied", description: `${permission} access check`, entityType: "Permission", entityId: permission });
      if (!ok) router.replace(fallback);
    }
    void checkPermission();
    return () => { active = false; };
  }, [permission, fallback, router]);
  if (allowed !== true) return <main className="min-h-screen bg-[#111111] text-white" />;
  return <>{children}</>;
}
