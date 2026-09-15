export type ProjectDecision = {
  id: string;
  title: string;
  description: string;
  category:
    | "Design"
    | "Site"
    | "Client"
    | "Technical"
    | "Management";
  decision: string;
  responsible: string;
  date: string;
  status: "Open" | "Decided";
};

export type ProjectDNA = {
  projectId: string;
  projectName: string;
  projectType: string;
  location: string;
  currentPhase: string;
  projectStatus: "Active" | "On Hold" | "Completed";
  description: string;
  priorities: string[];
  risks: string[];
  notes: string;
};

const DNA_KEY = "mason-arc-project-dna-city-edge";
const DECISIONS_KEY = "mason-arc-project-decisions-city-edge";

const initialDNA: ProjectDNA = {
  projectId: "CEM-001",
  projectName: "City Edge Mall",
  projectType: "Commercial / Mixed Use",
  location: "City Edge",
  currentPhase: "Design & Coordination",
  projectStatus: "Active",
  description:
    "Central project workspace for architecture, civil coordination, site activity and project decisions.",
  priorities: [
    "Architectural coordination",
    "Civil coordination",
    "Site follow-up",
    "Task completion",
  ],
  risks: [],
  notes: "",
};

const initialDecisions: ProjectDecision[] = [];

export function getProjectDNA(): ProjectDNA {
  if (typeof window === "undefined") {
    return initialDNA;
  }

  const stored = localStorage.getItem(DNA_KEY);

  if (!stored) {
    localStorage.setItem(DNA_KEY, JSON.stringify(initialDNA));
    return initialDNA;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return initialDNA;
  }
}

export function saveProjectDNA(dna: ProjectDNA) {
  if (typeof window === "undefined") return;

  localStorage.setItem(DNA_KEY, JSON.stringify(dna));
}

export function getProjectDecisions(): ProjectDecision[] {
  if (typeof window === "undefined") {
    return initialDecisions;
  }

  const stored = localStorage.getItem(DECISIONS_KEY);

  if (!stored) {
    localStorage.setItem(
      DECISIONS_KEY,
      JSON.stringify(initialDecisions)
    );

    return initialDecisions;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return initialDecisions;
  }
}

export function saveProjectDecisions(
  decisions: ProjectDecision[]
) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    DECISIONS_KEY,
    JSON.stringify(decisions)
  );
}

export function addProjectDecision(
  decision: Omit<ProjectDecision, "id">
) {
  const decisions = getProjectDecisions();

  const newDecision: ProjectDecision = {
    ...decision,
    id: `DEC-${String(decisions.length + 1).padStart(3, "0")}`,
  };

  saveProjectDecisions([newDecision, ...decisions]);

  return newDecision;
}

export function updateDecision(
  decisionId: string,
  updates: Partial<ProjectDecision>
) {
  const decisions = getProjectDecisions();

  const updated = decisions.map((decision) =>
    decision.id === decisionId
      ? { ...decision, ...updates }
      : decision
  );

  saveProjectDecisions(updated);

  return updated;
}