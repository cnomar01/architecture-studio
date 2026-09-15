"use client";

import { getProjects, Project } from "@/lib/core/projectStore";
import { getTasks, Task } from "@/app/app/admin/tasks/taskStore";
import { getApprovals } from "@/app/app/admin/approvals/approvalStore";
import { getSiteReports } from "@/app/app/engineer/site/siteStore";
import { getFinanceTransactions, getProjectBudget } from "@/app/app/admin/finance/financeStore";
import { matchesProject } from "@/lib/core/projectRelation";

export type ForecastLevel = "Stable" | "Watch" | "High Risk" | "Critical";

export type ProjectForecast = {
  project: Project;
  health: number;
  scheduleRisk: number;
  costRisk: number;
  deliveryRisk: number;
  qualityRisk: number;
  overallRisk: number;
  level: ForecastLevel;
  progress: number;
  overdueTasks: number;
  blockedTasks: number;
  pendingApprovals: number;
  openIssues: number;
  urgentIssues: number;
  budgetUtilization: number | null;
  profit: number;
  criticalTasks: Task[];
  reasons: string[];
};

function deadlineTime(deadline: string) {
  const now = new Date();
  const value = String(deadline || "").trim().toLowerCase();
  if (value === "today") return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).getTime();
  if (value === "tomorrow") return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59).getTime();
  const parsed = Date.parse(deadline);
  return Number.isNaN(parsed) ? Number.POSITIVE_INFINITY : parsed;
}

function daysToTarget(targetDate: string) {
  const parsed = Date.parse(targetDate);
  if (Number.isNaN(parsed)) return null;
  return Math.ceil((parsed - Date.now()) / 86400000);
}

function riskLevel(score: number): ForecastLevel {
  if (score >= 75) return "Critical";
  if (score >= 55) return "High Risk";
  if (score >= 30) return "Watch";
  return "Stable";
}

export function calculateProjectForecast(project: Project, tasks: Task[] = getTasks()): ProjectForecast {
  const projectTasks = tasks.filter((task) => matchesProject(task, project.id));
  const approvals = getApprovals().filter((item) => matchesProject(item, project.id));
  const reports = getSiteReports().filter((item) => matchesProject(item, project.id));
  const issues = reports.flatMap((report) => report.issues || []).filter((issue) => issue.status !== "Resolved");
  const transactions = getFinanceTransactions().filter((item) => item.projectId === project.id);
  const budget = getProjectBudget(project.id);

  const completed = projectTasks.filter((task) => task.status === "Completed").length;
  const progress = projectTasks.length ? Math.round((completed / projectTasks.length) * 100) : 0;
  const overdue = projectTasks.filter((task) => task.status === "Overdue" || deadlineTime(task.deadline) < Date.now() && task.status !== "Completed").length;
  const blocked = projectTasks.filter((task) => (task.dependencies || []).some((id) => {
    const dependency = projectTasks.find((item) => item.id === id);
    return dependency && dependency.status !== "Completed";
  })).length;
  const pendingApprovals = approvals.filter((item) => item.status === "Pending").length;
  const urgentIssues = issues.filter((issue) => issue.priority === "Urgent").length;

  const income = transactions.filter((item) => item.type === "Income").reduce((sum, item) => sum + item.amount, 0);
  const expenses = transactions.filter((item) => item.type === "Expense").reduce((sum, item) => sum + item.amount, 0);
  const profit = income - expenses;
  const budgetUtilization = budget && budget.budget > 0 ? Math.round((expenses / budget.budget) * 100) : null;

  const scheduleRisk = Math.min(100, overdue * 18 + blocked * 12 + pendingApprovals * 8 + (daysToTarget(project.targetDate) !== null && (daysToTarget(project.targetDate) as number) < 14 && progress < 70 ? 25 : 0));
  const costRisk = budgetUtilization === null ? 15 : Math.min(100, Math.max(0, budgetUtilization - 70) * 3 + (profit < 0 ? 35 : 0));
  const deliveryRisk = Math.min(100, (projectTasks.length === 0 ? 20 : Math.max(0, 70 - progress)) + overdue * 8 + pendingApprovals * 5);
  const qualityRisk = Math.min(100, urgentIssues * 25 + issues.filter((issue) => issue.priority === "High").length * 10);
  const overallRisk = Math.round(scheduleRisk * 0.35 + costRisk * 0.2 + deliveryRisk * 0.25 + qualityRisk * 0.2);
  const health = Math.max(0, 100 - overallRisk);

  const criticalTasks = projectTasks.filter((task) => task.status !== "Completed" && (task.status === "Overdue" || task.priority === "Urgent" || (task.dependencies || []).length > 0)).sort((a, b) => deadlineTime(a.deadline) - deadlineTime(b.deadline)).slice(0, 6);

  const reasons: string[] = [];
  if (overdue) reasons.push(`${overdue} overdue task${overdue === 1 ? "" : "s"} are pressuring the schedule.`);
  if (blocked) reasons.push(`${blocked} task${blocked === 1 ? " is" : "s are"} waiting on incomplete dependencies.`);
  if (pendingApprovals) reasons.push(`${pendingApprovals} approval${pendingApprovals === 1 ? " is" : "s are"} still pending.`);
  if (urgentIssues) reasons.push(`${urgentIssues} urgent site issue${urgentIssues === 1 ? " is" : "s are"} open.`);
  if (budgetUtilization !== null && budgetUtilization >= 80) reasons.push(`Budget utilization is ${budgetUtilization}%.`);
  if (!reasons.length) reasons.push("No major risk signal is visible in the current studio data.");

  return { project, health, scheduleRisk, costRisk, deliveryRisk, qualityRisk, overallRisk, level: riskLevel(overallRisk), progress, overdueTasks: overdue, blockedTasks: blocked, pendingApprovals, openIssues: issues.length, urgentIssues, budgetUtilization, profit, criticalTasks, reasons };
}

export function getPortfolioForecast() {
  return getProjects().map((project) => calculateProjectForecast(project));
}
