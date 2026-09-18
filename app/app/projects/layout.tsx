"use client";

import AuthGuard from "@/lib/core/AuthGuard";

/** Client-facing routes are protected as a group. Record-level isolation is
 * enforced again by /api/data on every request. */
export default function ClientProjectsLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={["Client"]}>{children}</AuthGuard>;
}
