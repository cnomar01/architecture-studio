export type ConstructionStatus =
  | "Draft"
  | "Open"
  | "Submitted"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Closed"
  | "Resolved";

export type ConstructionItemType =
  | "RFI"
  | "Submittal"
  | "Material Approval"
  | "Inspection"
  | "NCR"
  | "Snag"
  | "Handover";

export type ConstructionItem = {
  id: string;
  type: ConstructionItemType;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  status: ConstructionStatus;
  priority: "Low" | "Medium" | "High" | "Urgent";
  assignee?: string;
  reference?: string;
  createdAt: string;
  dueDate?: string;
  closedAt?: string;
  linkedTaskId?: string;
  linkedFileId?: string;
};

const KEY = "mason_arc_construction_os_v15";

const seed: ConstructionItem[] = [
  {
    id: "RFI-001",
    type: "RFI",
    projectId: "city-edge-mall",
    projectName: "City Edge Mall",
    title: "Clarification on ground floor ceiling coordination",
    description: "Confirm ceiling level and coordination requirements before site execution.",
    status: "Open",
    priority: "High",
    assignee: "Omar Mohamed",
    reference: "A-104",
    createdAt: "2026-09-15",
    dueDate: "2026-09-17",
  },
  {
    id: "SUB-001",
    type: "Submittal",
    projectId: "city-edge-mall",
    projectName: "City Edge Mall",
    title: "Marble finish sample",
    description: "Submit material sample, technical data and finish reference for review.",
    status: "Submitted",
    priority: "Medium",
    assignee: "Ahmed Shabaan",
    reference: "MAT-021",
    createdAt: "2026-09-14",
  },
  {
    id: "MAT-001",
    type: "Material Approval",
    projectId: "city-edge-mall",
    projectName: "City Edge Mall",
    title: "External façade stone approval",
    description: "Review supplier sample, finish, dimensions and compliance before procurement.",
    status: "Under Review",
    priority: "High",
    assignee: "Omar Mohamed",
    reference: "FIN-03",
    createdAt: "2026-09-13",
  },
  {
    id: "INS-001",
    type: "Inspection",
    projectId: "city-edge-mall",
    projectName: "City Edge Mall",
    title: "Ground floor waterproofing inspection",
    description: "Inspection request before covering waterproofing works.",
    status: "Open",
    priority: "Urgent",
    assignee: "Ahmed Shabaan",
    reference: "IR-014",
    createdAt: "2026-09-15",
    dueDate: "2026-09-16",
  },
  {
    id: "NCR-001",
    type: "NCR",
    projectId: "city-edge-mall",
    projectName: "City Edge Mall",
    title: "Incorrect finish installation",
    description: "Installed finish does not match the approved reference; corrective action required.",
    status: "Open",
    priority: "High",
    assignee: "Ahmed Shabaan",
    reference: "NCR-007",
    createdAt: "2026-09-15",
  },
  {
    id: "SNAG-001",
    type: "Snag",
    projectId: "city-edge-mall",
    projectName: "City Edge Mall",
    title: "Lobby door alignment",
    description: "Door leaf alignment and hardware adjustment required.",
    status: "Open",
    priority: "Medium",
    assignee: "Omar Mohamed",
    reference: "SNAG-031",
    createdAt: "2026-09-14",
  },
  {
    id: "HO-001",
    type: "Handover",
    projectId: "city-edge-mall",
    projectName: "City Edge Mall",
    title: "Residential handover readiness",
    description: "Track closeout documents, inspections, snag clearance and final approvals.",
    status: "Under Review",
    priority: "High",
    assignee: "Omar Mohamed",
    reference: "HO-01",
    createdAt: "2026-09-10",
  },
];

function read(): ConstructionItem[] {
  if (typeof window === "undefined") return seed;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : seed;
  } catch {
    return seed;
  }
}

function write(items: ConstructionItem[]) {
  if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
}

export function getConstructionItems() {
  return read();
}

export function getConstructionItemsByType(type: ConstructionItemType) {
  return read().filter((item) => item.type === type);
}

export function addConstructionItem(
  item: Omit<ConstructionItem, "id" | "createdAt">
) {
  const items = read();
  const prefix = item.type === "Material Approval" ? "MAT" : item.type === "Inspection" ? "INS" : item.type === "Handover" ? "HO" : item.type === "Submittal" ? "SUB" : item.type === "NCR" ? "NCR" : item.type === "Snag" ? "SNAG" : "RFI";
  const next = items.filter((x) => x.type === item.type).length + 1;
  const created = {
    ...item,
    id: `${prefix}-${String(next).padStart(3, "0")}`,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  write([created, ...items]);
  return created;
}

export function updateConstructionItem(id: string, patch: Partial<ConstructionItem>) {
  const items = read().map((item) => item.id === id ? { ...item, ...patch } : item);
  write(items);
  return items.find((item) => item.id === id);
}

export function resetConstructionItems() {
  write(seed);
}
