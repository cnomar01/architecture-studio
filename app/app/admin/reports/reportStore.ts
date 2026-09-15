import { getProjects } from "@/lib/core/projectStore";
import { getTasks } from "@/app/app/admin/tasks/taskStore";
import { getApprovals } from "@/app/app/admin/approvals/approvalStore";
import { getFinanceTransactions } from "@/app/app/admin/finance/financeStore";
import { getSiteReports } from "@/app/app/engineer/site/siteStore";
import { getTeamIntelligence } from "@/app/app/admin/team/teamIntelligence";
import { matchesProject } from "@/lib/core/projectRelation";

export type ReportPeriod = "Today" | "This Week" | "This Month" | "All Time";

export function getManagementReport(period: ReportPeriod = "All Time") {
  const projects = getProjects();
  const tasks = getTasks();
  const approvals = getApprovals();
  const transactions = getFinanceTransactions();
  const siteReports = getSiteReports();
  const team = getTeamIntelligence();

  const completedTasks = tasks.filter((task) => task.status === "Completed").length;
  const openTasks = tasks.filter((task) => task.status !== "Completed").length;
  const overdueTasks = tasks.filter((task) => task.status === "Overdue").length;
  const pendingApprovals = approvals.filter((item) => item.status === "Pending").length;
  const openIssues = siteReports.flatMap((report) => report.issues || []).filter((issue) => issue.status !== "Resolved").length;
  const income = transactions.filter((item) => item.type === "Income").reduce((sum, item) => sum + item.amount, 0);
  const expenses = transactions.filter((item) => item.type === "Expense").reduce((sum, item) => sum + item.amount, 0);
  const activeProjects = projects.filter((project) => project.status === "Active").length;
  const overloadedTeam = team.filter((member) => member.status === "Overloaded").length;

  const projectRows = projects.map((project) => {
    const projectTasks = tasks.filter((task) => matchesProject(task, project.id));
    const projectApprovals = approvals.filter((approval) => matchesProject(approval, project.id));
    const projectIssues = siteReports.filter((report) => matchesProject(report, project.id)).flatMap((report) => report.issues || []);
    const projectFinance = transactions.filter((item) => item.projectId === project.id);
    const done = projectTasks.filter((task) => task.status === "Completed").length;
    const projectIncome = projectFinance.filter((item) => item.type === "Income").reduce((sum, item) => sum + item.amount, 0);
    const projectExpenses = projectFinance.filter((item) => item.type === "Expense").reduce((sum, item) => sum + item.amount, 0);
    return {
      id: project.id,
      name: project.name,
      code: project.code,
      status: project.status,
      phase: project.phase,
      progress: projectTasks.length ? Math.round((done / projectTasks.length) * 100) : 0,
      openTasks: projectTasks.filter((task) => task.status !== "Completed").length,
      pendingApprovals: projectApprovals.filter((item) => item.status === "Pending").length,
      openIssues: projectIssues.filter((issue) => issue.status !== "Resolved").length,
      profit: projectIncome - projectExpenses,
    };
  });

  return {
    generatedAt: new Date().toISOString(),
    period,
    totals: { projects: projects.length, activeProjects, completedTasks, openTasks, overdueTasks, pendingApprovals, openIssues, income, expenses, profit: income - expenses, overloadedTeam },
    projectRows,
  };
}
