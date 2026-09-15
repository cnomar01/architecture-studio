"use client";

import { getProjectById, getProjects, Project } from "@/app/app/core/projectStore";

export function resolveProject(identifier?: string | null): Project | null {
  if (!identifier) return null;
  const direct = getProjectById(identifier);
  if (direct) return direct;
  const normalized = identifier.toLowerCase().replace(/[-_]/g, " ").trim();
  return getProjects().find((project) =>
    project.name.toLowerCase().trim() === normalized ||
    project.code.toLowerCase().trim() === normalized
  ) ?? null;
}

export function resolveProjectId(identifier?: string | null): string | undefined {
  return resolveProject(identifier)?.id;
}

export function matchesProject(
  record: { projectId?: string; project?: string; projectName?: string },
  identifier?: string | null
): boolean {
  if (!identifier) return false;
  const project = resolveProject(identifier);
  if (!project) return false;
  return (
    record.projectId === project.id ||
    record.project === project.name ||
    record.projectName === project.name ||
    record.project === project.id ||
    record.projectName === project.id
  );
}
