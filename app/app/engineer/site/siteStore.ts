"use client";

import { addActivity } from "@/lib/core/activityStore";
import { addTask, getTasks } from "@/app/app/admin/tasks/taskStore";
import { resolveProjectId, matchesProject } from "@/lib/core/projectRelation";

export type SiteIssueStatus = "Open" | "In Progress" | "Resolved";
export type SiteIssuePriority = "Low" | "Medium" | "High" | "Urgent";

export type SitePhoto = {
  id: string;
  name: string;
  dataUrl: string;
  caption?: string;
  location?: string;
  uploadedAt: string;
};

export type SiteIssue = {
  id: string;
  title: string;
  description: string;
  location: string;
  priority: SiteIssuePriority;
  assignedTo: string;
  status: SiteIssueStatus;
  taskId?: string;
  resolvedAt?: string;
};

export type SiteReport = {
  id: string;
  project: string;
  projectId?: string;
  date: string;
  engineer: string;
  visitType: string;
  summary: string;
  weather?: string;
  photos: SitePhoto[];
  issues: SiteIssue[];
  createdAt: string;
};

const STORAGE_KEY = "mason-arc-site-reports";

export function getSiteReports(): SiteReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SiteReport[];
    return parsed.map((report) => ({
      ...report,
      photos: report.photos || [],
      issues: report.issues || [],
    }));
  } catch {
    return [];
  }
}

export function saveSiteReports(reports: SiteReport[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  }
}

export function addSiteReport(report: Omit<SiteReport, "id" | "createdAt">) {
  const reports = getSiteReports();
  const newReport: SiteReport = {
    ...report,
    projectId: report.projectId ?? resolveProjectId(report.project),
    photos: report.photos || [],
    issues: report.issues || [],
    id: createSiteReportId(reports),
    createdAt: new Date().toISOString(),
  };
  saveSiteReports([newReport, ...reports]);
  addActivity({
    type: "Site",
    title: "Site Report Created",
    description: `${newReport.engineer} created a ${newReport.visitType} site report for ${newReport.project}.`,
    projectId: newReport.projectId,
    projectName: newReport.project,
    userName: newReport.engineer,
    metadata: { Report: newReport.id, Visit: newReport.visitType, Date: newReport.date, Issues: String(newReport.issues.length), Photos: String(newReport.photos.length) },
  });
  return newReport;
}

export function addSitePhotos(reportId: string, photos: Omit<SitePhoto, "id" | "uploadedAt">[]) {
  const reports = getSiteReports();
  const updated = reports.map((report) => {
    if (report.id !== reportId) return report;
    return {
      ...report,
      photos: [
        ...report.photos,
        ...photos.map((photo) => ({ ...photo, id: `PHOTO-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, uploadedAt: new Date().toISOString() })),
      ],
    };
  });
  saveSiteReports(updated);
  return updated;
}

export function deleteSitePhoto(reportId: string, photoId: string) {
  const reports = getSiteReports();
  const updated = reports.map((report) => report.id === reportId ? { ...report, photos: report.photos.filter((photo) => photo.id !== photoId) } : report);
  saveSiteReports(updated);
  return updated;
}

export function updateSiteReport(reportId: string, updates: Partial<Omit<SiteReport, "id" | "createdAt">>) {
  const reports = getSiteReports();
  const updated = reports.map((report) => report.id === reportId ? { ...report, ...updates } : report);
  saveSiteReports(updated);
  return updated;
}

export function updateIssue(reportId: string, issueId: string, status: SiteIssueStatus) {
  return updateSiteIssue(reportId, issueId, { status });
}

export function updateSiteIssue(reportId: string, issueId: string, updates: Partial<SiteIssue>) {
  const reports = getSiteReports();
  const report = reports.find((item) => item.id === reportId);
  if (!report) return reports;
  const oldIssue = report.issues.find((issue) => issue.id === issueId);
  if (!oldIssue) return reports;

  const updatedReports = reports.map((currentReport) => {
    if (currentReport.id !== reportId) return currentReport;
    return {
      ...currentReport,
      issues: currentReport.issues.map((issue) => issue.id === issueId ? {
        ...issue,
        ...updates,
        resolvedAt: updates.status === "Resolved" ? new Date().toISOString() : issue.resolvedAt,
      } : issue),
    };
  });
  saveSiteReports(updatedReports);

  if (updates.status && updates.status !== oldIssue.status) {
    addActivity({ type: "Site", title: updates.status === "Resolved" ? "Site Issue Resolved" : "Site Issue Status Updated", description: `${oldIssue.title} changed from ${oldIssue.status} to ${updates.status}.`, projectId: report.projectId, projectName: report.project, metadata: { Issue: oldIssue.id, From: oldIssue.status, To: updates.status } });
  }
  if (updates.assignedTo !== undefined && updates.assignedTo !== oldIssue.assignedTo) {
    addActivity({ type: "Site", title: "Site Issue Assigned", description: `${oldIssue.title} was assigned to ${updates.assignedTo || "Unassigned"}.`, projectId: report.projectId, projectName: report.project, metadata: { Issue: oldIssue.id, AssignedTo: updates.assignedTo || "Unassigned" } });
  }
  if (updates.priority && updates.priority !== oldIssue.priority) {
    addActivity({ type: "Site", title: "Site Issue Priority Updated", description: `${oldIssue.title} priority changed from ${oldIssue.priority} to ${updates.priority}.`, projectId: report.projectId, projectName: report.project, metadata: { Issue: oldIssue.id, From: oldIssue.priority, To: updates.priority } });
  }
  return updatedReports;
}

export function addIssueToReport(reportId: string, issue: Omit<SiteIssue, "id">) {
  const reports = getSiteReports();
  const report = reports.find((item) => item.id === reportId);
  if (!report) return reports;
  const newIssue = { ...issue, id: createIssueId(reports) };
  const updated = reports.map((item) => item.id === reportId ? { ...item, issues: [...item.issues, newIssue] } : item);
  saveSiteReports(updated);
  return updated;
}

export function createTaskFromSiteIssue(reportId: string, issueId: string) {
  const reports = getSiteReports();
  const report = reports.find((item) => item.id === reportId);
  const issue = report?.issues.find((item) => item.id === issueId);
  if (!report || !issue) return undefined;
  if (issue.taskId) return getTasks().find((task) => task.id === issue.taskId);

  const assignee = issue.assignedTo || "Omar Mohamed";
  const assigneeId = assignee === "Ahmed Shabaan" ? "AS-001" : "OM-001";
  const task = addTask({
    title: `Site Issue: ${issue.title}`,
    project: report.project,
    projectId: report.projectId,
    assignee,
    assigneeId,
    department: assignee === "Ahmed Shabaan" ? "Civil" : "Architecture",
    priority: issue.priority,
    deadline: "Today",
    status: "Open",
    description: `${issue.description || issue.title} Location: ${issue.location}. Created from ${report.id}.`,
    dependencies: [],
  });

  const updated = reports.map((item) => item.id === reportId ? { ...item, issues: item.issues.map((current) => current.id === issueId ? { ...current, taskId: task.id } : current) } : item);
  saveSiteReports(updated);
  addActivity({ type: "Site", title: "Site Issue Converted To Task", description: `${issue.title} became ${task.id}.`, projectId: report.projectId, projectName: report.project, metadata: { Issue: issue.id, Task: task.id } });
  return task;
}

export function deleteSiteReport(reportId: string) {
  const reports = getSiteReports();
  saveSiteReports(reports.filter((report) => report.id !== reportId));
}

export function getSiteReportById(reportId: string) {
  return getSiteReports().find((report) => report.id === reportId) ?? null;
}

export function getProjectSiteReports(project: string) {
  return getSiteReports().filter((report) => matchesProject(report, project));
}

export function getOpenSiteIssues(project?: string) {
  const reports = project ? getProjectSiteReports(project) : getSiteReports();
  return reports.flatMap((report) => report.issues.filter((issue) => issue.status !== "Resolved"));
}

export function getUrgentSiteIssues(project?: string) {
  return getOpenSiteIssues(project).filter((issue) => issue.priority === "Urgent");
}

export function getSiteHistory(project?: string) {
  return (project ? getProjectSiteReports(project) : getSiteReports()).sort((a, b) => b.date.localeCompare(a.date));
}

function createSiteReportId(reports: SiteReport[]) {
  const max = reports.reduce((m, r) => Math.max(m, Number(r.id.match(/SITE-(\d+)/)?.[1] || 0)), 0);
  return `SITE-${String(max + 1).padStart(3, "0")}`;
}

function createIssueId(reports: SiteReport[]) {
  const max = reports.flatMap((r) => r.issues).reduce((m, i) => Math.max(m, Number(i.id.match(/ISS-(\d+)/)?.[1] || 0)), 0);
  return `ISS-${String(max + 1).padStart(3, "0")}`;
}
