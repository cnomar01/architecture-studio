"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  FileText,
  MapPin,
  Users,
  AlertTriangle,
  Clock3,
  Building2,
  Brain,
  Activity,
} from "lucide-react";

import { getTasks } from "@/app/app/admin/tasks/taskStore";
import { matchesProject } from "@/lib/core/projectRelation";
import { getSiteReports } from "@/app/app/engineer/site/siteStore";
import { calculateProjectHealth } from "./projectHealth";
import { generateProjectAlerts } from "./projectAlerts";
import {
  getFiles,
  getFileRevisions,
  ProjectFile,
} from "@/app/app/admin/files/fileStore";
import {
  getApprovals,
  Approval,
} from "@/app/app/admin/approvals/approvalStore";

const PROJECT_NAME = "City Edge Mall";
const PROJECT_ID = "CEM-001";

export default function CityEdgeMallCommandCenter() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);

  useEffect(() => {
    const refresh = () => {
      setTasks(getTasks());
      setReports(getSiteReports());
      setFiles(getFiles());
      setApprovals(getApprovals());
    };

    refresh();

    const interval = window.setInterval(refresh, 2000);

    return () => window.clearInterval(interval);
  }, []);

  /* =========================================
     PROJECT TASKS
  ========================================= */

  const projectTasks = useMemo(() => {
    return tasks.filter(
      (task) => matchesProject(task, PROJECT_ID)
    );
  }, [tasks]);

  /* =========================================
     PROJECT SITE REPORTS
  ========================================= */

  const projectReports = useMemo(() => {
    return reports.filter(
      (report) => matchesProject(report, PROJECT_ID)
    );
  }, [reports]);

  /* =========================================
     TASK COUNTS
  ========================================= */

  const completedTasks = projectTasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const openTasks = projectTasks.filter(
    (task) => task.status !== "Completed"
  ).length;

  /* =========================================
     SITE ISSUES
  ========================================= */

  const allIssues = useMemo(() => {
    return projectReports.flatMap(
      (report) => report.issues || []
    );
  }, [projectReports]);

  const openIssues = allIssues.filter(
    (issue: any) =>
      issue.status !== "Resolved"
  ).length;

  const urgentIssues = allIssues.filter(
    (issue: any) =>
      issue.priority === "Urgent" &&
      issue.status !== "Resolved"
  ).length;

  /* =========================================
     PROJECT FILES
  ========================================= */

  const projectFiles = useMemo(() => {
    return files.filter(
      (file) => matchesProject(file, PROJECT_ID)
    );
  }, [files]);

  /* =========================================
     PROJECT APPROVALS
  ========================================= */

  const projectApprovals = useMemo(() => {
    return approvals.filter(
      (approval) =>
        matchesProject(approval, PROJECT_ID)
    );
  }, [approvals]);

  const pendingApprovals =
    projectApprovals.filter(
      (approval) =>
        approval.status === "Pending"
    ).length;

  const approvedApprovals =
    projectApprovals.filter(
      (approval) =>
        approval.status === "Approved"
    ).length;

  const changesRequestedApprovals =
    projectApprovals.filter(
      (approval) =>
        approval.status ===
        "Changes Requested"
    ).length;

  /* =========================================
     LATEST FILE REVISIONS
  ========================================= */

  const latestProjectFiles = useMemo(() => {
    const latest = new Map<
      string,
      ProjectFile
    >();

    projectFiles.forEach((file) => {
      const rootId =
        file.parentFileId ?? file.id;

      const existing = latest.get(rootId);

      const currentNumber = Number(
        file.revision.match(/\d+/)?.[0] ?? 1
      );

      const existingNumber = existing
        ? Number(
            existing.revision.match(/\d+/)?.[0] ??
              1
          )
        : -1;

      if (
        !existing ||
        currentNumber > existingNumber
      ) {
        latest.set(rootId, file);
      }
    });

    return Array.from(
      latest.values()
    ).sort((a, b) =>
      b.uploadedDate.localeCompare(
        a.uploadedDate
      )
    );
  }, [projectFiles]);

  /* =========================================
     PROJECT HEALTH
  ========================================= */

  const health = useMemo(() => {
    return calculateProjectHealth(
      projectTasks,
      allIssues
    );
  }, [projectTasks, allIssues]);

  /* =========================================
     PROJECT ALERTS
  ========================================= */

  const alerts = useMemo(() => {
    return generateProjectAlerts(
      projectTasks,
      allIssues
    );
  }, [projectTasks, allIssues]);

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      <main className="mx-auto max-w-[1500px] px-5 py-6 md:px-8 lg:px-10">

        {/* =========================================
            HEADER
        ========================================= */}

        <div className="mb-8 flex flex-col gap-5 border-b border-white/10 pb-7 lg:flex-row lg:items-end lg:justify-between">

          <div>

            <Link
              href="/app/admin/projects"
              className="mb-5 inline-flex items-center gap-2 text-xs text-white/40 transition hover:text-white"
            >
              <ArrowLeft size={14} />
              All Projects
            </Link>

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <Building2 size={19} />
              </div>

              <div>

                <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">
                  Project Command Center
                </p>

                <h1 className="mt-1 text-3xl font-medium tracking-tight md:text-4xl">
                  {PROJECT_NAME}
                </h1>

              </div>

            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-white/45">

              <span className="flex items-center gap-1.5">
                <MapPin size={13} />
                City Edge
              </span>

              <span>•</span>

              <span>Active Project</span>

              <span>•</span>

              <span className="text-white/25">
                {PROJECT_ID}
              </span>

            </div>

          </div>

          {/* HEADER ACTIONS */}

          <div className="flex flex-wrap gap-2">

            <Link
              href="/app/admin/projects/city-edge-mall/timeline"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs transition hover:bg-white/[0.08]"
            >
              <Activity size={14} />
              Project Timeline
            </Link>

            <Link
              href="/app/admin/projects/city-edge-mall/intelligence"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs transition hover:bg-white/[0.08]"
            >
              <Brain size={14} />
              Intelligence
            </Link>

            <Link
              href="/app/engineer/site/new"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-xs transition hover:bg-white/[0.08]"
            >
              New Site Report
            </Link>

            <Link
              href="/app/admin/tasks/new"
              className="rounded-xl bg-white px-4 py-3 text-xs font-medium text-black transition hover:bg-white/90"
            >
              Assign Task
            </Link>

          </div>

        </div>

        {/* =========================================
            HEALTH SCORE
        ========================================= */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">

          <div className="flex flex-col gap-8 p-6 md:flex-row md:items-center md:justify-between md:p-7">

            <div className="flex items-center gap-5">

              <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.02]">

                <div className="text-center">

                  <p className="text-3xl font-light">
                    {health.score}
                  </p>

                  <p className="text-[8px] uppercase tracking-wider text-white/25">
                    / 100
                  </p>

                </div>

              </div>

              <div>

                <div className="flex items-center gap-2">

                  <Activity
                    size={15}
                    className="text-white/40"
                  />

                  <p className="text-[9px] uppercase tracking-[0.22em] text-white/30">
                    Project Health Score
                  </p>

                </div>

                <h2 className="mt-2 text-xl font-medium">
                  {health.label}
                </h2>

                <p className="mt-2 max-w-lg text-xs leading-5 text-white/30">
                  Operational indicator based on current
                  tasks and reported site issues.
                </p>

              </div>

            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">

              <HealthMini
                label="Overdue"
                value={health.overdueTasks}
              />

              <HealthMini
                label="Open Tasks"
                value={health.openTasks}
              />

              <HealthMini
                label="Open Issues"
                value={health.openIssues}
              />

              <HealthMini
                label="Urgent"
                value={health.urgentIssues}
              />

            </div>

          </div>

          <div className="border-t border-white/8 px-6 py-3 md:px-7">

            <p className="text-[9px] text-white/20">
              Health score is an internal management indicator
              and does not replace professional project or site
              assessment.
            </p>

          </div>

        </section>

        {/* =========================================
            PROJECT ALERTS
        ========================================= */}

        <section className="mb-6">

          <div className="mb-4 flex items-end justify-between">

            <div>

              <p className="text-[10px] uppercase tracking-[0.22em] text-white/30">
                Intelligence
              </p>

              <h2 className="mt-1 text-lg font-medium">
                Project Alerts
              </h2>

              <p className="mt-1 text-xs text-white/30">
                Automatic risks and actions detected from
                project activity.
              </p>

            </div>

            <span className="text-xs text-white/25">
              {alerts.length} active
            </span>

          </div>

          {alerts.length === 0 ? (

            <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-6">

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">

                  <CheckCircle2
                    size={18}
                    className="text-white/45"
                  />

                </div>

                <div>

                  <p className="text-sm text-white/70">
                    No active alerts
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    The project is currently operating without
                    detected critical risks.
                  </p>

                </div>

              </div>

            </div>

          ) : (

            <div className="space-y-2">

              {alerts.map((alert) => (

                <div
                  key={alert.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition hover:bg-white/[0.04]"
                >

                  <div className="flex items-start gap-4">

                    <div
                      className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                        alert.type === "Critical"
                          ? "border-red-400/20 bg-red-400/10 text-red-300"
                          : alert.type === "Warning"
                          ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
                          : "border-white/10 bg-white/[0.04] text-white/50"
                      }`}
                    >

                      {alert.type === "Critical" ? (
                        <AlertTriangle size={17} />
                      ) : alert.type === "Warning" ? (
                        <Clock3 size={17} />
                      ) : (
                        <CheckCircle2 size={17} />
                      )}

                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="text-sm font-medium">
                          {alert.title}
                        </h3>

                        <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[8px] uppercase tracking-wider text-white/30">
                          {alert.source}
                        </span>

                      </div>

                      <p className="mt-1 text-xs leading-5 text-white/35">
                        {alert.description}
                      </p>

                    </div>

                    <span
                      className={`hidden rounded-full border px-2 py-1 text-[8px] uppercase tracking-wider sm:block ${
                        alert.type === "Critical"
                          ? "border-red-400/20 bg-red-400/10 text-red-300"
                          : alert.type === "Warning"
                          ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
                          : "border-white/10 bg-white/[0.03] text-white/30"
                      }`}
                    >
                      {alert.type}
                    </span>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

        {/* =========================================
            PROJECT OVERVIEW
        ========================================= */}

        <section className="mb-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">

          <div className="mb-5 flex items-center justify-between">

            <div>

              <p className="text-[10px] uppercase tracking-[0.22em] text-white/35">
                Project Overview
              </p>

              <h2 className="mt-1 text-lg font-medium">
                {PROJECT_NAME}
              </h2>

            </div>

            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-[10px] uppercase tracking-wider text-emerald-300">
              Active
            </div>

          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">

            <Metric
              label="Open Tasks"
              value={openTasks}
              icon={<ClipboardList size={16} />}
            />

            <Metric
              label="Completed Tasks"
              value={completedTasks}
              icon={<CheckCircle2 size={16} />}
            />

            <Metric
              label="Site Reports"
              value={projectReports.length}
              icon={<MapPin size={16} />}
            />

            <Metric
              label="Open Issues"
              value={openIssues}
              icon={<AlertTriangle size={16} />}
            />

            <Metric
              label="Urgent Issues"
              value={urgentIssues}
              icon={<Clock3 size={16} />}
              danger={urgentIssues > 0}
            />

          </div>

        </section>

        {/* =========================================
            PROJECT DNA
        ========================================= */}

        <Link
          href="/app/admin/projects/city-edge-mall/dna"
          className="group mb-6 flex flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition hover:border-white/20 hover:bg-white/[0.05] md:flex-row md:items-center md:justify-between"
        >

          <div className="flex items-center gap-4">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">

              <Brain
                size={19}
                className="text-white/50"
              />

            </div>

            <div>

              <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                Project Intelligence
              </p>

              <h2 className="mt-1 text-lg font-medium">
                Project DNA
              </h2>

              <p className="mt-1 text-xs text-white/30">
                Identity, priorities, risks and project decisions
              </p>

            </div>

          </div>

          <div className="flex items-center gap-2 text-xs text-white/30 transition group-hover:text-white">

            Open Intelligence

            <ArrowUpRight size={16} />

          </div>

        </Link>

        {/* =========================================
            PROJECT TIMELINE
        ========================================= */}

        <Link
          href={"/app/admin/projects/CEM-001/timeline"}
          className="group mb-6 block rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition hover:border-white/20 hover:bg-white/[0.05]"
        >

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">

                <Activity
                  size={19}
                  className="text-white/50"
                />

              </div>

              <div>

                <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
                  Project History
                </p>

                <h2 className="mt-1 text-lg font-medium">
                  Project Timeline
                </h2>

                <p className="mt-1 max-w-2xl text-xs text-white/30">
                  Tasks, files, approvals, site activity and
                  project decisions in one chronological view.
                </p>

              </div>

            </div>

            <div className="flex shrink-0 items-center gap-2 text-xs text-white/30 transition group-hover:text-white">

              Open Timeline

              <ArrowUpRight size={16} />

            </div>

          </div>

        </Link>

        {/* =========================================
            MAIN GRID
        ========================================= */}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* TEAM */}

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

            <SectionHeader
              icon={<Users size={17} />}
              title="Project Team"
              href="/app/admin/team"
            />

            <div className="mt-5 space-y-3">

              <TeamMember
                initials="OM"
                name="Omar Mohamed"
                role="Architect"
                projectRole="Project Architect"
                href="/app/admin/team/OM-001"
              />

              <TeamMember
                initials="AS"
                name="Ahmed Shabaan"
                role="Civil Engineer"
                projectRole="Civil Engineer"
                href="/app/admin/team/AS-001"
              />

            </div>

          </section>

          {/* TASKS */}

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

            <SectionHeader
              icon={<ClipboardList size={17} />}
              title="Tasks"
              href="/app/admin/tasks"
            />

            <div className="mt-5 space-y-3">

              {projectTasks.length === 0 ? (

                <Empty text="No tasks assigned yet." />

              ) : (

                projectTasks
                  .slice(0, 5)
                  .map((task) => (

                    <div
                      key={task.id}
                      className="rounded-xl border border-white/8 bg-black/20 p-4"
                    >

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="text-sm font-medium">
                            {task.title}
                          </p>

                          <p className="mt-1 text-[11px] text-white/35">
                            {task.assignee}
                          </p>

                        </div>

                        <StatusBadge
                          status={task.status}
                        />

                      </div>

                      <div className="mt-3 flex items-center justify-between text-[10px] text-white/35">

                        <span>
                          {task.priority}
                        </span>

                        <span>
                          {task.deadline}
                        </span>

                      </div>

                    </div>

                  ))

              )}

            </div>

          </section>

          {/* APPROVALS */}

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

            <SectionHeader
              icon={<CheckCircle2 size={17} />}
              title="Approvals"
              href="/app/admin/approvals"
            />

            <div className="mt-5 space-y-3">

              {projectApprovals.length === 0 ? (

                <Empty text="No approvals submitted yet." />

              ) : (

                projectApprovals
                  .slice()
                  .sort((a, b) => {
                    if (
                      a.status === "Pending" &&
                      b.status !== "Pending"
                    ) {
                      return -1;
                    }

                    if (
                      b.status === "Pending" &&
                      a.status !== "Pending"
                    ) {
                      return 1;
                    }

                    return 0;
                  })
                  .slice(0, 5)
                  .map((approval) => (

                    <Link
                      key={approval.id}
                      href={`/app/admin/approvals/${approval.id}`}
                      className="group flex items-center gap-3 rounded-xl border border-white/8 bg-black/20 p-4 transition hover:bg-white/[0.05]"
                    >

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/[0.03]">

                        <FileText
                          size={14}
                          className="text-white/40"
                        />

                      </div>

                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm">
                          {approval.title}
                        </p>

                        <p className="mt-1 text-[10px] text-white/30">
                          {approval.type} · {approval.revision}
                        </p>

                      </div>

                      <ApprovalStatusBadge
                        status={approval.status}
                      />

                    </Link>

                  ))

              )}

            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">

              <MiniCount
                label="Pending"
                value={pendingApprovals}
              />

              <MiniCount
                label="Approved"
                value={approvedApprovals}
              />

              <MiniCount
                label="Changes"
                value={changesRequestedApprovals}
              />

            </div>

          </section>

        </div>

        {/* =========================================
            LOWER GRID
        ========================================= */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* SITE */}

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

            <SectionHeader
              icon={<MapPin size={17} />}
              title="Site Intelligence"
              href="/app/engineer/site"
            />

            <div className="mt-5">

              {projectReports.length === 0 ? (

                <Empty text="No site reports yet." />

              ) : (

                <div className="space-y-3">

                  {projectReports
                    .slice(0, 4)
                    .map((report) => (

                      <div
                        key={report.id}
                        className="rounded-xl border border-white/8 bg-black/20 p-4"
                      >

                        <p className="text-sm font-medium">
                          {report.visitType}
                        </p>

                        <p className="mt-1 text-[11px] text-white/35">
                          {report.date} · {report.engineer}
                        </p>

                        <p className="mt-3 text-xs leading-5 text-white/55">
                          {report.summary}
                        </p>

                        <p className="mt-3 text-[10px] text-white/35">
                          {(report.issues || []).length} issues
                        </p>

                      </div>

                    ))}

                </div>

              )}

            </div>

          </section>

          {/* FILES */}

          <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-5">

            <SectionHeader
              icon={<FileText size={17} />}
              title="Project Files"
              href="/app/engineer/files"
            />

            <div className="mt-5 space-y-3">

              {latestProjectFiles.length === 0 ? (

                <Empty text="No project files uploaded yet." />

              ) : (

                latestProjectFiles
                  .slice(0, 5)
                  .map((file) => {

                    const revisions =
                      getFileRevisions(
                        file.id
                      );

                    return (
                      <div
                        key={file.id}
                        className="rounded-xl border border-white/8 bg-black/20 p-4"
                      >

                        <div className="flex items-start gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/[0.03]">

                            <FileText
                              size={14}
                              className="text-white/40"
                            />

                          </div>

                          <div className="min-w-0 flex-1">

                            <div className="flex items-center justify-between gap-3">

                              <p className="truncate text-sm">
                                {file.name}
                              </p>

                              <FileStatusBadge
                                status={file.status}
                              />

                            </div>

                            <p className="mt-1 text-[10px] text-white/30">
                              {file.category} ·{" "}
                              {file.revision}
                            </p>

                            <div className="mt-3 flex items-center justify-between text-[9px] text-white/20">

                              <span>
                                {revisions.length} revision
                                {revisions.length === 1
                                  ? ""
                                  : "s"}
                              </span>

                              {file.approvalId && (
                                <Link
                                  href={`/app/admin/approvals/${file.approvalId}`}
                                  className="text-white/35 transition hover:text-white"
                                >
                                  Open Approval
                                </Link>
                              )}

                            </div>

                          </div>

                        </div>

                      </div>
                    );
                  })

              )}

            </div>

            <Link
              href="/app/engineer/files"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs text-white/50 transition hover:bg-white/[0.05] hover:text-white"
            >
              Open Project Files
              <ArrowUpRight size={14} />
            </Link>

          </section>

        </div>

        {/* =========================================
            PROJECT MEMORY
        ========================================= */}

        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 md:p-6">

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            <div>

              <p className="text-[9px] uppercase tracking-[0.22em] text-white/25">
                Project Memory
              </p>

              <h2 className="mt-2 text-lg font-medium">
                Decisions & Project Knowledge
              </h2>

              <p className="mt-2 max-w-xl text-xs leading-5 text-white/30">
                Keep important design, technical, client and
                site decisions connected to the project.
              </p>

            </div>

            <div className="flex flex-wrap gap-2">

              <Link
                href={`/app/admin/projects/city-edge-mall/timeline`}
                className="flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs text-white/40 transition hover:bg-white/[0.05] hover:text-white"
              >
                Project Timeline
                <Activity size={14} />
              </Link>

              <Link
                href="/app/admin/projects/city-edge-mall/decisions"
                className="flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs text-white/40 transition hover:bg-white/[0.05] hover:text-white"
              >
                Open Decision Log
                <ArrowUpRight size={14} />
              </Link>

            </div>

          </div>

        </section>

      </main>

    </div>
  );
}

/* =========================================
   HEALTH MINI
========================================= */

function HealthMini({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="min-w-[80px] rounded-xl border border-white/8 bg-black/20 px-4 py-3">

      <p className="text-[8px] uppercase tracking-wider text-white/25">
        {label}
      </p>

      <p className="mt-2 text-lg font-medium">
        {value}
      </p>

    </div>
  );
}

/* =========================================
   METRIC
========================================= */

function Metric({
  label,
  value,
  icon,
  danger = false,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-4">

      <div className="flex items-center gap-2 text-white/35">

        {icon}

        <span className="text-[10px] uppercase tracking-wider">
          {label}
        </span>

      </div>

      <p
        className={`mt-3 text-2xl font-medium ${
          danger
            ? "text-red-300"
            : "text-white"
        }`}
      >
        {value}
      </p>

    </div>
  );
}

/* =========================================
   SECTION HEADER
========================================= */

function SectionHeader({
  icon,
  title,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between">

      <div className="flex items-center gap-2.5">

        <span className="text-white/45">
          {icon}
        </span>

        <h2 className="text-sm font-medium">
          {title}
        </h2>

      </div>

      <Link
        href={href}
        className="text-[10px] uppercase tracking-wider text-white/30 transition hover:text-white"
      >
        View all
      </Link>

    </div>
  );
}

/* =========================================
   TEAM MEMBER
========================================= */

function TeamMember({
  initials,
  name,
  role,
  projectRole,
  href,
}: {
  initials: string;
  name: string;
  role: string;
  projectRole: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-3 rounded-xl border border-white/8 bg-black/20 p-3 transition hover:bg-white/[0.05]"
    >

      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xs font-medium text-black">
        {initials}
      </div>

      <div className="min-w-0 flex-1">

        <p className="text-sm">
          {name}
        </p>

        <p className="mt-0.5 text-[10px] text-white/35">
          {role} · {projectRole}
        </p>

      </div>

      <ArrowUpRight
        size={14}
        className="text-white/20 transition group-hover:text-white"
      />

    </Link>
  );
}

/* =========================================
   STATUS
========================================= */

function StatusBadge({
  status,
}: {
  status: string;
}) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 text-[9px] text-white/45">
      {status}
    </span>
  );
}

/* =========================================
   APPROVAL STATUS
========================================= */

function ApprovalStatusBadge({
  status,
}: {
  status: Approval["status"];
}) {
  const className =
    status === "Approved"
      ? "border-white/15 bg-white/[0.05] text-white/55"
      : status ===
        "Changes Requested"
      ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
      : "border-amber-400/20 bg-amber-400/10 text-amber-300";

  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-1 text-[8px] uppercase tracking-wider ${className}`}
    >
      {status}
    </span>
  );
}

/* =========================================
   FILE STATUS
========================================= */

function FileStatusBadge({
  status,
}: {
  status: ProjectFile["status"];
}) {
  const className =
    status === "Approved"
      ? "border-white/15 bg-white/[0.05] text-white/55"
      : status ===
        "Changes Requested"
      ? "border-yellow-400/20 bg-yellow-400/10 text-yellow-300"
      : status ===
        "Pending Approval"
      ? "border-amber-400/20 bg-amber-400/10 text-amber-300"
      : "border-white/10 bg-white/[0.03] text-white/35";

  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-1 text-[8px] uppercase tracking-wider ${className}`}
    >
      {status}
    </span>
  );
}

/* =========================================
   MINI COUNT
========================================= */

function MiniCount({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-lg border border-white/8 bg-black/20 p-3">

      <p className="text-[8px] uppercase tracking-wider text-white/20">
        {label}
      </p>

      <p className="mt-2 text-sm font-medium text-white/70">
        {value}
      </p>

    </div>
  );
}

/* =========================================
   EMPTY
========================================= */

function Empty({
  text,
}: {
  text: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-xs text-white/25">
      {text}
    </div>
  );
}