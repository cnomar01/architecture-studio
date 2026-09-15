"use client";

import { addActivity } from "@/lib/core/activityStore";
import { getFiles, type ProjectFile } from "../fileStore";

export type TransmittalStatus = "Draft" | "Issued" | "Acknowledged";

export type Transmittal = {
  id: string;
  number: string;
  projectId?: string;
  project: string;
  subject: string;
  issuedBy: string;
  issuedDate: string;
  recipient: string;
  status: TransmittalStatus;
  fileIds: string[];
  notes: string;
};

const KEY = "mason-arc-transmittals";
const initial: Transmittal[] = [
  {
    id: "TR-001",
    number: "MA-TR-001",
    projectId: "CEM-001",
    project: "City Edge Mall",
    subject: "Architectural coordination package R03",
    issuedBy: "Mason & Arc",
    issuedDate: "2026-09-11",
    recipient: "Project Coordination Team",
    status: "Issued",
    fileIds: ["FIL-001"],
    notes: "Issued for design coordination and review.",
  },
];

function load() {
  if (typeof window === "undefined") return initial;
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(initial));
    return initial;
  }
  try { return JSON.parse(raw) as Transmittal[]; } catch { return initial; }
}
function save(items: Transmittal[]) { localStorage.setItem(KEY, JSON.stringify(items)); }
function nextId(items: Transmittal[]) {
  const n = items.reduce((m, x) => Math.max(m, Number(x.id.replace(/\D/g, "")) || 0), 0) + 1;
  return `TR-${String(n).padStart(3, "0")}`;
}
export function getTransmittals() { return load(); }
export function getTransmittalById(id: string) { return load().find(x => x.id === id); }
export function getTransmittalFiles(item: Transmittal): ProjectFile[] {
  const files = getFiles();
  return item.fileIds.map(id => files.find(f => f.id === id)).filter(Boolean) as ProjectFile[];
}
export function addTransmittal(input: Omit<Transmittal, "id" | "number" | "issuedDate">) {
  const items = load();
  const id = nextId(items);
  const item: Transmittal = { ...input, id, number: `MA-${id}`, issuedDate: new Date().toISOString().slice(0, 10) };
  save([...items, item]);
  addActivity({ type: "File Uploaded" as never, title: item.number, description: `Transmittal ${item.number} issued for ${item.project}.`, projectId: item.projectId, projectName: item.project, userName: item.issuedBy, metadata: { transmittalId: item.id } });
  return item;
}
export function updateTransmittal(id: string, updates: Partial<Omit<Transmittal, "id">>) {
  const items = load();
  const index = items.findIndex(x => x.id === id);
  if (index < 0) return undefined;
  items[index] = { ...items[index], ...updates };
  save(items);
  return items[index];
}
