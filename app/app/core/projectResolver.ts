"use client";

import {
  getProjectById,
  getProjects,
  Project,
} from "@/app/app/core/projectStore";

export function resolveProject(
  identifier: string
): Project | null {
  if (!identifier) return null;

  // Direct project ID
  const directProject =
    getProjectById(identifier);

  if (directProject) {
    return directProject;
  }

  // Special legacy route
  if (
    identifier === "city-edge-mall" ||
    identifier === "city_edge_mall"
  ) {
    return (
      getProjects().find(
        (project) =>
          project.code === "CEM-001" ||
          project.name === "City Edge Mall"
      ) ?? null
    );
  }

  // Slug fallback
  const normalized =
    identifier
      .toLowerCase()
      .replace(/[-_]/g, " ")
      .trim();

  return (
    getProjects().find(
      (project) =>
        project.name
          .toLowerCase()
          .trim() === normalized
    ) ?? null
  );
}