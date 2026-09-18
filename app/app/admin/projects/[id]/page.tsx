"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  DollarSign,
  FileText,
  FolderOpen,
  MessageSquare,
  Pencil,
  ShieldCheck,
  Users,
  Activity,
  MapPin,
  CalendarDays,
} from "lucide-react";

import { getProjectById, Project } from "@/lib/core/projectStore";
import { getTeam, TeamMember } from "@/lib/core/teamStore";
import { getTasks, Task } from "@/app/app/admin/tasks/taskStore";
import { getProjectFiles } from "@/app/app/admin/files/fileStore";
import { getApprovals } from "@/app/app/admin/approvals/approvalStore";
import { getFinanceTransactions } from "@/app/app/admin/finance/financeStore";
import { getSiteReports } from "@/app/app/engineer/site/siteStore";
import { matchesProject } from "@/lib/core/projectRelation";

export default function ProjectCorePage() {
  const params = useParamsSafe();
  const projectId = params.id;

  const [project, setProject] = useState<Project | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filesCount, setFilesCount] = useState(0);
  const [approvalsCount, setApprovalsCount] = useState(0);
  const [pendingApprovals, setPendingApprovals] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [siteReportsCount, setSiteReportsCount] = useState(0);

  async function refresh() {    const current = getProjectById(projectId);

    setProject(current);
    const currentTeam = await getTeam();
    setTeam(currentTeam);

    const currentTasks = getTasks();
    const projectTasks = current
      ? currentTasks.filter((task) => matchesProject(task, current.id))
      : [];

    setTasks(projectTasks);

    if (!current) {
      setFilesCount(0);
      setApprovalsCount(0);
      setPendingApprovals(0);
      setIncome(0);
      setExpenses(0);
      setSiteReportsCount(0);
      return;
    }

    setFilesCount(getProjectFiles(current.id).length);

    const approvals = getApprovals().filter(
      (approval) => matchesProject(approval, current.id)
    );
    setApprovalsCount(approvals.length);
    setPendingApprovals(
      approvals.filter((approval) => approval.status === "Pending").length
    );

    const transactions = getFinanceTransactions().filter(
      (item) => item.projectId === current.id
    );

    setIncome(
      transactions
        .filter((item) => item.type === "Income")
        .reduce((sum, item) => sum + item.amount, 0)
    );

    setExpenses(
      transactions
        .filter((item) => item.type === "Expense")
        .reduce((sum, item) => sum + item.amount, 0)
    );

    setSiteReportsCount(
      getSiteReports().filter((report) =>
        matchesProject(report, current.id)
      ).length
    );
  }

  useEffect(() => {
    refresh();
    const interval = window.setInterval(refresh, 2000);
    return () => window.clearInterval(interval);
  }, [projectId]);

  const projectTeam = useMemo(() => {
    if (!project) return [];
    const ids = project.teamMemberIds ?? [];
    const members = team.filter((member) => ids.includes(member.id));

    if (
      project.projectManagerId &&
      !members.some((member) => member.id === project.projectManagerId)
    ) {
      const manager = team.find(
        (member) => member.id === project.projectManagerId
      );
      if (manager) return [manager, ...members];
    }

    return members;
  }, [project, team]);

  const activeTasks = tasks.filter((task) => task.status !== "Completed");
  const completedTasks = tasks.filter((task) => task.status === "Completed");
  const progress = tasks.length
    ? Math.round((completedTasks.length / tasks.length) * 100)
    : 0;

  if (!project) {
    return (
      <main className="min-h-screen bg-[#080808] text-white">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <Link
            href="/app/admin/projects"
            className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white"
          >
            <ArrowLeft size={16} />
            Projects
          </Link>
          <div className="py-24 text-center">
            <h1 className="text-3xl font-medium">Project not found</h1>
            <p className="mt-3 text-sm text-white/35">
              The requested project does not exist in the current project registry.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="mx-auto max-w-7xl px-5 py-7 md:px-8 lg:px-10">
        <header className="border-b border-white/10 pb-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Link
                href="/app/admin/projects"
                className="inline-flex items-center gap-2 text-xs text-white/40 hover:text-white"
              >
                <ArrowLeft size={14} />
                Projects
              </Link>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="text-[10px] uppercase tracking-[0.24em] text-white/25">
                  {project.code}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/45">
                  {project.status}
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] text-white/45">
                  {project.phase}
                </span>
              </div>

              <h1 className="mt-3 text-4xl font-light tracking-tight md:text-5xl">
                {project.name}
              </h1>

              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/35">
                <span className="inline-flex items-center gap-2">
                  <MapPin size={13} />
                  {project.location}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarDays size={13} />
                  Started {project.startDate || "—"}
                </span>
                <span>{project.type}</span>
              </div>
            </div>

            <Link
              href={`/app/admin/projects/${project.id}/edit`}
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-medium text-black hover:bg-white/90"
            >
              <Pencil size={14} />
              Edit Project
            </Link>
          </div>
        </header>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Task Progress" value={`${progress}%`} icon={<ClipboardList size={16} />} />
          <Metric label="Open Tasks" value={activeTasks.length} icon={<Activity size={16} />} />
          <Metric label="Pending Approvals" value={pendingApprovals} icon={<CheckCircle2 size={16} />} />
          <Metric label="Project Files" value={filesCount} icon={<FileText size={16} />} />
        </section>

        <section className="mt-6 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-5">
            <Panel
              title="Project Workspace"
              subtitle="All operational areas connected to this project."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <WorkspaceLink
                  href={`/app/admin/projects/${project.id}/timeline`}
                  icon={<Activity size={18} />}
                  title="Timeline & Activity"
                  text="Project events and activity history."
                />
                <WorkspaceLink
                  href={`/app/admin/projects/${project.id}/messages`}
                  icon={<MessageSquare size={18} />}
                  title="Messages"
                  text="Project communication workspace."
                />
                <WorkspaceLink
                  href={`/app/admin/projects/${project.id}/finance`}
                  icon={<DollarSign size={18} />}
                  title="Finance"
                  text={`${formatMoney(income - expenses)} net project movement`}
                />
                <WorkspaceLink
                  href={`/app/admin/projects/${project.id}/passport`}
                  icon={<FolderOpen size={18} />}
                  title="Project Passport"
                  text="Core project information and references."
                />
                <WorkspaceLink
                  href={`/app/admin/files?project=${encodeURIComponent(project.id)}`}
                  icon={<FileText size={18} />}
                  title="Files & Documents"
                  text={`${filesCount} connected project files`}
                />
                <WorkspaceLink
                  href="/app/admin/approvals"
                  icon={<CheckCircle2 size={18} />}
                  title="Approvals"
                  text={`${approvalsCount} approvals · ${pendingApprovals} pending`}
                />
              </div>
            </Panel>

            <Panel title="Delivery Snapshot" subtitle="Current project delivery signals.">
              <div className="grid gap-4 sm:grid-cols-3">
                <Snapshot label="Completed Tasks" value={completedTasks.length} />
                <Snapshot label="Site Reports" value={siteReportsCount} />
                <Snapshot label="Net Finance" value={formatMoney(income - expenses)} />
              </div>

              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-white/30">
                  <span>Task progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-white"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Project Team" subtitle="Members assigned to this project.">
              {projectTeam.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-white/30">
                  No project team members assigned yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {projectTeam.map((member) => (
                    <Link
                      key={member.id}
                      href={`/app/admin/team/${member.id}`}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 p-3 hover:bg-white/[0.03]"
                    >
                      <Avatar member={member} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{member.name}</p>
                        <p className="truncate text-[11px] text-white/30">
                          {member.position || member.role || "Team member"}
                          {member.department ? ` · ${member.department}` : ""}
                        </p>
                      </div>
                      <ArrowRight size={14} className="text-white/20" />
                    </Link>
                  ))}
                </div>
              )}

              <Link
                href={`/app/admin/projects/${project.id}/edit`}
                className="mt-4 inline-flex items-center gap-2 text-xs text-white/45 hover:text-white"
              >
                Manage project team
                <ArrowRight size={13} />
              </Link>
            </Panel>

            <Panel title="Project Finance" subtitle="Connected project transactions.">
              <div className="grid grid-cols-2 gap-3">
                <FinanceCard label="Income" value={income} />
                <FinanceCard label="Expenses" value={expenses} />
              </div>
              <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">
                  Net
                </p>
                <p className="mt-2 text-xl">{formatMoney(income - expenses)}</p>
              </div>
            </Panel>

            <Panel title="Project Controls" subtitle="Management and execution links.">
              <div className="space-y-2">
                <ControlLink href="/app/admin/tasks" icon={<ClipboardList size={15} />} text="Open Tasks" />
                <ControlLink href="/app/admin/site" icon={<MapPin size={15} />} text="Site Operations" />
                <ControlLink href="/app/admin/operations/progress" icon={<Activity size={15} />} text="Progress" />
                <ControlLink href="/app/admin/operations/qc" icon={<ShieldCheck size={15} />} text="Quality Control" />
              </div>
            </Panel>
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-white/10 bg-white/[0.025] p-6">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/25">
            Project Description
          </p>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-white/45">
            {project.description || "No project description has been added yet."}
          </p>
        </section>
      </div>
    </main>
  );
}

function useParamsSafe() {
  const [id, setId] = useState("");
  useEffect(() => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    setId(parts.at(-1) || "");
  }, []);
  return { id };
}

function Metric({ label, value, icon }: { label: string; value: React.ReactNode; icon: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">
      <div className="flex items-center justify-between text-white/30">
        <p className="text-[10px] uppercase tracking-[0.16em]">{label}</p>
        {icon}
      </div>
      <p className="mt-3 text-2xl font-light">{value}</p>
    </div>
  );
}

function Panel({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">
      <div>
        <h2 className="text-lg font-medium">{title}</h2>
        <p className="mt-1 text-xs text-white/30">{subtitle}</p>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function WorkspaceLink({ href, icon, title, text }: { href: string; icon: React.ReactNode; title: string; text: string }) {
  return (
    <Link href={href} className="group rounded-2xl border border-white/10 p-4 hover:bg-white/[0.03]">
      <div className="flex items-center justify-between text-white/45">
        {icon}
        <ArrowUpRight size={14} className="text-white/20 group-hover:text-white/50" />
      </div>
      <p className="mt-6 text-sm">{title}</p>
      <p className="mt-1 text-[11px] leading-5 text-white/30">{text}</p>
    </Link>
  );
}

function Snapshot({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">{label}</p>
      <p className="mt-2 text-xl">{value}</p>
    </div>
  );
}

function FinanceCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 p-4">
      <p className="text-[10px] uppercase tracking-[0.16em] text-white/25">{label}</p>
      <p className="mt-2 text-lg">{formatMoney(value)}</p>
    </div>
  );
}

function ControlLink({ href, icon, text }: { href: string; icon: React.ReactNode; text: string }) {
  return (
    <Link href={href} className="flex items-center gap-3 rounded-xl border border-white/10 p-3 text-xs text-white/50 hover:bg-white/[0.03] hover:text-white">
      {icon}
      <span>{text}</span>
      <ArrowRight size={13} className="ml-auto text-white/20" />
    </Link>
  );
}

function Avatar({ member }: { member: TeamMember }) {
  if (member.avatarUrl) {
    return (
      <img
        src={member.avatarUrl}
        alt=""
        className="h-10 w-10 rounded-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[10px] text-white/60">
      {member.initials}
    </div>
  );
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency: "EGP",
    maximumFractionDigits: 0,
  }).format(value);
}
