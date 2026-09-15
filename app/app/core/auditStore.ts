"use client";

import { getCurrentUser } from "@/app/app/core/authStore";

export type AuditAction = "Login" | "Logout" | "Create" | "Update" | "Delete" | "Approve" | "Access" | "System";

export type AuditEntry = {
  id: string;
  action: AuditAction;
  title: string;
  description: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  entityType?: string;
  entityId?: string;
  projectId?: string;
  createdAt: string;
};

const STORAGE_KEY = "mason-arc-audit-log";

export function getAuditEntries(): AuditEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as AuditEntry[];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function addAuditEntry(entry: Omit<AuditEntry, "id" | "createdAt" | "userId" | "userName" | "userRole">) {
  if (typeof window === "undefined") return null;
  const user = getCurrentUser();
  const next: AuditEntry = {
    ...entry,
    id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    userId: user?.id,
    userName: user?.name,
    userRole: user?.role,
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([next, ...getAuditEntries()]));
  return next;
}

export function getRecentAuditEntries(limit = 100) {
  return getAuditEntries().slice(0, limit);
}

export function clearAuditLog() {
  if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
}
