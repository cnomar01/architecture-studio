import { Task } from "@/app/app/admin/tasks/taskStore";
import { SiteIssue } from "@/app/app/engineer/site/siteStore";

export type ProjectHealth = {
  score: number;
  label: "Excellent" | "Good" | "Needs Attention" | "Critical";
  overdueTasks: number;
  openTasks: number;
  openIssues: number;
  urgentIssues: number;
};

export function calculateProjectHealth(
  tasks: Task[],
  issues: SiteIssue[]
): ProjectHealth {
  let score = 100;

  const openTasks = tasks.filter(
    (task) => task.status !== "Completed"
  );

  const overdueTasks = tasks.filter(
    (task) => task.status === "Overdue"
  );

  const openIssues = issues.filter(
    (issue) => issue.status !== "Resolved"
  );

  const urgentIssues = openIssues.filter(
    (issue) => issue.priority === "Urgent"
  );

  const highPriorityOpenTasks = openTasks.filter(
    (task) =>
      task.priority === "High" ||
      task.priority === "Urgent"
  );

  score -= overdueTasks.length * 15;
  score -= openIssues.length * 8;
  score -= urgentIssues.length * 15;
  score -= highPriorityOpenTasks.length * 3;

  score = Math.max(0, Math.min(100, score));

  let label: ProjectHealth["label"];

  if (score >= 85) {
    label = "Excellent";
  } else if (score >= 70) {
    label = "Good";
  } else if (score >= 50) {
    label = "Needs Attention";
  } else {
    label = "Critical";
  }

  return {
    score,
    label,
    overdueTasks: overdueTasks.length,
    openTasks: openTasks.length,
    openIssues: openIssues.length,
    urgentIssues: urgentIssues.length,
  };
}