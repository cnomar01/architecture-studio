"use client";

export type ProjectStatus = "Active" | "On Hold" | "Completed";

export type ProjectPhase =
  | "Concept Design"
  | "Design Development"
  | "Technical Design"
  | "Tender"
  | "Construction"
  | "Handover";

export type Project = {
  id: string;
  code: string;
  name: string;
  type: string;
  location: string;
  status: ProjectStatus;
  phase: ProjectPhase;
  description: string;

  clientId?: string;
  clientName?: string;

  projectManagerId?: string;
  projectManagerName?: string;

  startDate: string;
  targetDate: string;

  // Public website / CMS presentation fields
  slug?: string;
  featured?: boolean;
  image?: string;
  gallery?: string[];
  year?: string;
  program?: string[];
  scope?: string[];

  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "mason-arc-projects";

const initialProjects: Project[] = [
  {
    id: "CEM-001",
    code: "CEM-001",
    name: "City Edge Mall",
    type: "Commercial / Mixed Use",
    location: "City Edge",
    status: "Active",
    phase: "Design Development",
    description:
      "Central project workspace for architecture, civil coordination, site activity and project decisions.",

    clientId: "",
    clientName: "",

    projectManagerId: "OM-001",
    projectManagerName: "Omar Mohamed",

    startDate: "2026-09-01",
    targetDate: "",

    slug: "city-edge",
    featured: true,
    image: "/images/projects/city-edge/city-edge-exterior-wip.jpeg",
    gallery: ["/images/projects/city-edge/city-edge-exterior-wip.jpeg"],
    year: "2025 — Ongoing",
    program: ["Shopping Mall", "Retail", "Offices", "Medical Clinics", "Residential", "Rooftop Leisure"],
    scope: ["Architecture", "Façade", "MEP", "HVAC", "Vertical Transportation", "Interior Finishing"],

    createdAt: "2026-09-01",
    updatedAt: "2026-09-11",
  },
];

/* -------------------------------- */
/* READ */
/* -------------------------------- */

export function getProjects(): Project[] {
  if (typeof window === "undefined") {
    return initialProjects;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialProjects)
    );

    return initialProjects;
  }

  try {
    return JSON.parse(stored) as Project[];
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialProjects)
    );

    return initialProjects;
  }
}

/* -------------------------------- */
/* SAVE */
/* -------------------------------- */

export function saveProjects(projects: Project[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(projects)
  );
}

/* -------------------------------- */
/* GET ONE */
/* -------------------------------- */

export function getProjectById(
  projectId: string
): Project | null {
  return (
    getProjects().find(
      (project) =>
        project.id === projectId ||
        project.code === projectId
    ) ?? null
  );
}

/* -------------------------------- */
/* ADD */
/* -------------------------------- */

export function addProject(
  project: Omit<Project, "id" | "createdAt" | "updatedAt">
) {
  const projects = getProjects();

  const newProject: Project = {
    ...project,
    id: project.code,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveProjects([
    ...projects,
    newProject,
  ]);

  return newProject;
}

/* -------------------------------- */
/* UPDATE */
/* -------------------------------- */

export function updateProject(
  projectId: string,
  updates: Partial<Project>
) {
  const projects = getProjects();

  const updatedProjects = projects.map(
    (project) =>
      project.id === projectId
        ? {
            ...project,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        : project
  );

  saveProjects(updatedProjects);

  return updatedProjects;
}

/* -------------------------------- */
/* DELETE */
/* -------------------------------- */

export function deleteProject(
  projectId: string
) {
  const projects = getProjects();

  const updatedProjects = projects.filter(
    (project) => project.id !== projectId
  );

  saveProjects(updatedProjects);

  return updatedProjects;
}

/* -------------------------------- */
/* PROJECT STATUS */
/* -------------------------------- */

export function updateProjectStatus(
  projectId: string,
  status: ProjectStatus
) {
  return updateProject(projectId, {
    status,
  });
}

/* -------------------------------- */
/* PROJECT PHASE */
/* -------------------------------- */

export function updateProjectPhase(
  projectId: string,
  phase: ProjectPhase
) {
  return updateProject(projectId, {
    phase,
  });
}

/* -------------------------------- */
/* PROJECT MANAGER */
/* -------------------------------- */

export function assignProjectManager(
  projectId: string,
  managerId: string,
  managerName: string
) {
  return updateProject(projectId, {
    projectManagerId: managerId,
    projectManagerName: managerName,
  });
}

/* -------------------------------- */
/* CLIENT */
/* -------------------------------- */

export function assignProjectClient(
  projectId: string,
  clientId: string,
  clientName: string
) {
  return updateProject(projectId, {
    clientId,
    clientName,
  });
}

export function removeClientFromProject(projectId: string) {
  return updateProject(projectId, {
    clientId: "",
    clientName: "",
  });
}

/* -------------------------------- */
/* PROJECT HELPERS */
/* -------------------------------- */

export function getActiveProjects(): Project[] {
  return getProjects().filter(
    (project) => project.status === "Active"
  );
}

export function getCompletedProjects(): Project[] {
  return getProjects().filter(
    (project) => project.status === "Completed"
  );
}

export function getProjectsByPhase(
  phase: ProjectPhase
): Project[] {
  return getProjects().filter(
    (project) => project.phase === phase
  );
}

export function getProjectsByManager(
  managerId: string
): Project[] {
  return getProjects().filter(
    (project) =>
      project.projectManagerId === managerId
  );
}

export function getProjectsByClient(
  clientId: string
): Project[] {
  return getProjects().filter(
    (project) =>
      project.clientId === clientId
  );
}

/* -------------------------------- */
/* RESET */
/* -------------------------------- */

export function resetProjects() {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(initialProjects)
  );

  return initialProjects;
}