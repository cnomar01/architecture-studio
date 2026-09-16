"use client";

export type UserRole =
  | "Owner"
  | "Manager"
  | "Engineer"
  | "Client";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  employeeId?: string;
  clientId?: string;
  active: boolean;
};

/*
 * Database authentication is mandatory.
 * Prototype/localStorage authentication is intentionally disabled.
 */
export const isDatabaseAuth = true;

export async function databaseLogin(
  email: string,
  password: string
): Promise<AuthUser | null> {
  const cleanEmail = email.trim();

  if (!cleanEmail || !password) {
    return null;
  }

  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      email: cleanEmail,
      password,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      String(data?.error || "Invalid email or password.")
    );
  }

  return (data?.user as AuthUser) || null;
}

export async function databaseLogout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function getDatabaseCurrentUser(): Promise<AuthUser | null> {
  const response = await fetch("/api/auth/me", {
    method: "GET",
    cache: "no-store",
    credentials: "include",
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  return (data?.user as AuthUser) || null;
}

/*
 * Legacy client-side auth functions are intentionally disabled.
 * Authentication must happen through the secure server session.
 */
export function getUsers(): AuthUser[] {
  return [];
}

export function getUserByEmail(): AuthUser | null {
  return null;
}

export function login(): AuthUser | null {
  return null;
}

export function logout(): void {
  // Use databaseLogout() instead.
}

export function getCurrentUser(): AuthUser | null {
  // Client-side localStorage authentication is disabled.
  return null;
}

export function hasRole(
  role: UserRole | UserRole[]
): boolean {
  // Authorization should be performed from the server session.
  return false;
}

export function getRolePermissions(
  role: UserRole
): Permission[] {
  return [...permissions[role]];
}

export function getAllRolePermissions(): Record<
  UserRole,
  Permission[]
> {
  return {
    Owner: getRolePermissions("Owner"),
    Manager: getRolePermissions("Manager"),
    Engineer: getRolePermissions("Engineer"),
    Client: getRolePermissions("Client"),
  };
}

export function canAccess(
  permission: Permission
): boolean {
  // Server-side authorization is authoritative.
  return false;
}

export const ALL_PERMISSIONS: Permission[] = [
  "projects.view",
  "projects.manage",
  "team.view",
  "team.manage",
  "tasks.view",
  "tasks.manage",
  "files.view",
  "files.manage",
  "approvals.view",
  "approvals.manage",
  "finance.view",
  "finance.manage",
  "site.view",
  "site.manage",
  "clients.view",
  "clients.manage",
];

export type Permission =
  | "projects.view"
  | "projects.manage"
  | "team.view"
  | "team.manage"
  | "tasks.view"
  | "tasks.manage"
  | "files.view"
  | "files.manage"
  | "approvals.view"
  | "approvals.manage"
  | "finance.view"
  | "finance.manage"
  | "site.view"
  | "site.manage"
  | "clients.view"
  | "clients.manage";

const permissions: Record<UserRole, Permission[]> = {
  Owner: [
    "projects.view",
    "projects.manage",
    "team.view",
    "team.manage",
    "tasks.view",
    "tasks.manage",
    "files.view",
    "files.manage",
    "approvals.view",
    "approvals.manage",
    "finance.view",
    "finance.manage",
    "site.view",
    "site.manage",
    "clients.view",
    "clients.manage",
  ],

  Manager: [
    "projects.view",
    "projects.manage",
    "team.view",
    "team.manage",
    "tasks.view",
    "tasks.manage",
    "files.view",
    "files.manage",
    "approvals.view",
    "approvals.manage",
    "finance.view",
    "site.view",
    "site.manage",
    "clients.view",
    "clients.manage",
  ],

  Engineer: [
    "projects.view",
    "tasks.view",
    "tasks.manage",
    "files.view",
    "files.manage",
    "site.view",
    "site.manage",
  ],

  Client: [
    "projects.view",
    "files.view",
    "approvals.view",
  ],
};