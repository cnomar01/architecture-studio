import { Task } from "@/app/app/admin/tasks/taskStore";
import { SiteIssue } from "@/app/app/engineer/site/siteStore";

export type ProjectAlert = {
  id: string;
  type: "Critical" | "Warning" | "Info";
  title: string;
  description: string;
  source: "Task" | "Site" | "Project";
};

export function generateProjectAlerts(
  tasks: Task[],
  issues: SiteIssue[]
): ProjectAlert[] {
  const alerts: ProjectAlert[] = [];

  const overdueTasks = tasks.filter(
    (task) => task.status === "Overdue"
  );

  overdueTasks.forEach((task) => {
    alerts.push({
      id: `overdue-${task.id}`,
      type: "Critical",
      title: `Overdue Task: ${task.title}`,
      description: `${task.assignee} has an overdue task in ${task.project}.`,
      source: "Task",
    });
  });

  const urgentIssues = issues.filter(
    (issue) =>
      issue.priority === "Urgent" &&
      issue.status !== "Resolved"
  );

  urgentIssues.forEach((issue) => {
    alerts.push({
      id: `urgent-${issue.id}`,
      type: "Critical",
      title: `Urgent Site Issue: ${issue.title}`,
      description: `${issue.location} · Assigned to ${issue.assignedTo}`,
      source: "Site",
    });
  });

  const highPriorityTasks = tasks.filter(
    (task) =>
      (task.priority === "High" ||
        task.priority === "Urgent") &&
      task.status !== "Completed"
  );

  highPriorityTasks.forEach((task) => {
    const alreadyAlerted = alerts.some(
      (alert) => alert.id === `overdue-${task.id}`
    );

    if (!alreadyAlerted) {
      alerts.push({
        id: `priority-${task.id}`,
        type: "Warning",
        title: `High Priority Task: ${task.title}`,
        description: `${task.assignee} · ${task.status} · Deadline: ${task.deadline}`,
        source: "Task",
      });
    }
  });

  const openIssues = issues.filter(
    (issue) => issue.status !== "Resolved"
  );

  if (openIssues.length >= 3) {
    alerts.push({
      id: "multiple-site-issues",
      type: "Warning",
      title: "Multiple Open Site Issues",
      description: `${openIssues.length} site issues currently require attention.`,
      source: "Site",
    });
  }

  if (tasks.length > 0) {
    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    );

    const completionRate =
      completedTasks.length / tasks.length;

    if (completionRate === 1) {
      alerts.push({
        id: "all-tasks-completed",
        type: "Info",
        title: "All Assigned Tasks Completed",
        description:
          "All currently assigned project tasks have been completed.",
        source: "Project",
      });
    }
  }

  return alerts;
}