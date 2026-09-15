import { getProjects } from "@/app/app/core/projectStore";
import { getTasks } from "@/app/app/admin/tasks/taskStore";
import { getApprovals } from "@/app/app/admin/approvals/approvalStore";
import { getFinanceTransactions } from "@/app/app/admin/finance/financeStore";
import { getSiteReports } from "@/app/app/engineer/site/siteStore";
import { getFiles } from "@/app/app/admin/files/fileStore";
import { getActivities } from "@/app/app/core/activityStore";
import { matchesProject } from "@/app/app/core/projectRelation";

export type BrainSignal = {
  level: "Critical" | "Warning" | "Info";
  title: string;
  detail: string;
  projectId?: string;
};

export function getProjectBrain() {
  const projects = getProjects();
  const tasks = getTasks();
  const approvals = getApprovals();
  const finance = getFinanceTransactions();
  const reports = getSiteReports();
  const files = getFiles();
  const activities = getActivities();

  const signals: BrainSignal[] = [];

  for (const project of projects) {
    const projectTasks = tasks.filter((task) => matchesProject(task, project.id));
    const projectApprovals = approvals.filter((item) => matchesProject(item, project.id));
    const projectReports = reports.filter((report) => matchesProject(report, project.id));
    const projectFiles = files.filter((file) => matchesProject(file, project.id));
    const overdue = projectTasks.filter((task) => task.status === "Overdue").length;
    const pending = projectApprovals.filter((item) => item.status === "Pending").length;
    const openIssues = projectReports.flatMap((report) => report.issues || []).filter((issue) => issue.status !== "Resolved").length;
    const pendingFiles = projectFiles.filter((file) => file.status === "Pending Approval" || file.status === "Changes Requested").length;

    if (overdue) signals.push({ level: "Critical", title: `${project.name}: overdue tasks`, detail: `${overdue} task${overdue === 1 ? "" : "s"} need attention.`, projectId: project.id });
    if (pending) signals.push({ level: "Warning", title: `${project.name}: approvals waiting`, detail: `${pending} approval${pending === 1 ? " is" : "s are"} still pending.`, projectId: project.id });
    if (openIssues) signals.push({ level: "Warning", title: `${project.name}: site issues`, detail: `${openIssues} unresolved site issue${openIssues === 1 ? "" : "s"}.`, projectId: project.id });
    if (pendingFiles) signals.push({ level: "Info", title: `${project.name}: document attention`, detail: `${pendingFiles} file${pendingFiles === 1 ? " needs" : "s need"} review or approval.`, projectId: project.id });
  }

  const income = finance.filter((item) => item.type === "Income").reduce((sum, item) => sum + item.amount, 0);
  const expenses = finance.filter((item) => item.type === "Expense").reduce((sum, item) => sum + item.amount, 0);
  if (expenses > income && income > 0) {
    signals.push({ level: "Critical", title: "Studio margin signal", detail: "Recorded expenses currently exceed recorded income." });
  }

  return {
    generatedAt: new Date().toISOString(),
    summary: {
      projects: projects.length,
      tasks: tasks.length,
      approvals: approvals.length,
      files: files.length,
      siteReports: reports.length,
      activities: activities.length,
      signals: signals.length,
    },
    signals: signals.slice(0, 30),
  };
}

export function answerBrainQuestion(question: string) {
  const q = question.toLowerCase();
  const projects = getProjects();
  const tasks = getTasks();
  const approvals = getApprovals();
  const reports = getSiteReports();
  const finance = getFinanceTransactions();

  if (q.includes("overdue") || q.includes("late")) {
    const items = tasks.filter((task) => task.status === "Overdue");
    return items.length ? `${items.length} overdue task${items.length === 1 ? "" : "s"} found: ${items.map((task) => task.title).join(", ")}.` : "No overdue tasks are currently recorded.";
  }

  if (q.includes("approval")) {
    const pending = approvals.filter((item) => item.status === "Pending");
    return pending.length ? `${pending.length} pending approval${pending.length === 1 ? "" : "s"} found.` : "No pending approvals are currently recorded.";
  }

  if (q.includes("site") || q.includes("issue")) {
    const issues = reports.flatMap((report) => report.issues || []).filter((issue) => issue.status !== "Resolved");
    return issues.length ? `${issues.length} unresolved site issue${issues.length === 1 ? "" : "s"} found.` : "No unresolved site issues are currently recorded.";
  }

  if (q.includes("profit") || q.includes("finance") || q.includes("money")) {
    const income = finance.filter((item) => item.type === "Income").reduce((sum, item) => sum + item.amount, 0);
    const expenses = finance.filter((item) => item.type === "Expense").reduce((sum, item) => sum + item.amount, 0);
    return `Recorded income: ${income.toLocaleString()} EGP. Recorded expenses: ${expenses.toLocaleString()} EGP. Net: ${(income - expenses).toLocaleString()} EGP.`;
  }

  if (q.includes("project")) {
    return projects.length ? `${projects.length} project${projects.length === 1 ? " is" : "s are"} currently in the studio workspace: ${projects.map((project) => project.name).join(", ")}.` : "No projects are currently recorded.";
  }

  return "I can currently answer from the studio workspace about projects, overdue tasks, approvals, site issues, files, and recorded finance. Try asking: ‘What is overdue?’";
}
