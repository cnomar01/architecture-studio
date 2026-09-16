"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart3, Download, FileText, RefreshCw } from "lucide-react";
import {
  getManagementReport,
  ReportPeriod,
} from "./reportStore";

const periods: ReportPeriod[] = [
  "Today",
  "This Week",
  "This Month",
  "All Time",
];

type ManagementReport = Awaited<
  ReturnType<typeof getManagementReport>
>;

export default function ReportsPage() {
  const [period, setPeriod] =
    useState<ReportPeriod>("All Time");

  const [report, setReport] =
    useState<ManagementReport | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      setLoading(true);

      try {
        const data = await getManagementReport(period);

        if (!cancelled) {
          setReport(data);
        }
      } catch (error) {
        console.error("Failed to load management report:", error);

        if (!cancelled) {
          setReport(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadReport();

    return () => {
      cancelled = true;
    };
  }, [period]);

  async function refreshReport() {
    setLoading(true);

    try {
      const data = await getManagementReport(period);
      setReport(data);
    } catch (error) {
      console.error("Failed to refresh management report:", error);
    } finally {
      setLoading(false);
    }
  }

  function exportReport() {
    if (!report) return;

    const blob = new Blob(
      [JSON.stringify(report, null, 2)],
      {
        type: "application/json",
      }
    );

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `mason-arc-management-report-${period
      .toLowerCase()
      .replace(/ /g, "-")}.json`;

    a.click();

    URL.revokeObjectURL(url);
  }

  if (loading && !report) {
    return (
      <main className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <RefreshCw
              size={20}
              className="mx-auto animate-spin text-white/40"
            />

            <p className="mt-4 text-sm text-white/40">
              Loading management report...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!report) {
    return (
      <main className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="text-sm text-white/40">
              Unable to load management report.
            </p>

            <button
              onClick={refreshReport}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-medium text-black hover:bg-white/90"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  const { totals } = report;

  const completion =
    totals.completedTasks + totals.openTasks
      ? Math.round(
          (totals.completedTasks /
            (totals.completedTasks + totals.openTasks)) *
            100
        )
      : 0;

  return (
    <main className="min-h-screen bg-[#080808] px-4 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col gap-5 border-b border-white/10 pb-7 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-white/30">
              Mason & Arc / Management OS
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight">
              Reports
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-white/40">
              Live management reports generated from projects,
              delivery, approvals, site activity, team capacity
              and finance.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={refreshReport}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-xs text-white/60 hover:bg-white/[0.05] disabled:opacity-40"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>

            <button
              onClick={exportReport}
              className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-medium text-black hover:bg-white/90"
            >
              <Download size={14} />
              Export JSON
            </button>
          </div>
        </header>

        <div className="mt-6 flex flex-wrap gap-2">
          {periods.map((item) => (
            <button
              key={item}
              onClick={() => setPeriod(item)}
              className={`rounded-full border px-4 py-2 text-[10px] uppercase tracking-[0.16em] ${
                period === item
                  ? "border-white/30 bg-white text-black"
                  : "border-white/10 text-white/40 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Active Projects"
            value={totals.activeProjects}
          />

          <Stat
            label="Task Completion"
            value={`${completion}%`}
          />

          <Stat
            label="Pending Approvals"
            value={totals.pendingApprovals}
          />

          <Stat
            label="Open Site Issues"
            value={totals.openIssues}
          />

          <Stat
            label="Overdue Tasks"
            value={totals.overdueTasks}
          />

          <Stat
            label="Overloaded Team"
            value={totals.overloadedTeam}
          />

          <Stat
            label="Income"
            value={`${totals.income.toLocaleString()} EGP`}
          />

          <Stat
            label="Net Profit"
            value={`${totals.profit.toLocaleString()} EGP`}
          />
        </section>

        <section className="mt-6 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                Project Performance
              </p>

              <h2 className="mt-2 text-xl font-medium">
                Portfolio report
              </h2>
            </div>

            <BarChart3
              size={19}
              className="text-white/30"
            />
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[850px] text-left">
              <thead>
                <tr className="border-b border-white/10 text-[9px] uppercase tracking-[0.16em] text-white/25">
                  <th className="pb-3">Project</th>
                  <th>Phase</th>
                  <th>Progress</th>
                  <th>Open Tasks</th>
                  <th>Approvals</th>
                  <th>Issues</th>
                  <th>Profit</th>
                </tr>
              </thead>

              <tbody>
                {report.projectRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-white/5 text-xs"
                  >
                    <td className="py-4">
                      <Link
                        href={`/app/admin/projects/${row.id}`}
                        className="text-white hover:underline"
                      >
                        {row.name}
                      </Link>

                      <span className="ml-2 text-[9px] text-white/25">
                        {row.code}
                      </span>
                    </td>

                    <td className="text-white/40">
                      {row.phase}
                    </td>

                    <td>
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
                          <div
                            className="h-full bg-white"
                            style={{
                              width: `${row.progress}%`,
                            }}
                          />
                        </div>

                        <span>{row.progress}%</span>
                      </div>
                    </td>

                    <td>{row.openTasks}</td>

                    <td>{row.pendingApprovals}</td>

                    <td>{row.openIssues}</td>

                    <td>
                      {row.profit.toLocaleString()} EGP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {report.projectRows.length === 0 && (
              <div className="py-10 text-center text-sm text-white/30">
                No projects available.
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <Panel
            title="Delivery"
            value={`${totals.completedTasks} completed`}
            detail={`${totals.openTasks} open tasks`}
          />

          <Panel
            title="Risk"
            value={`${totals.overdueTasks} overdue`}
            detail={`${totals.openIssues} open site issues`}
          />

          <Panel
            title="Finance"
            value={`${totals.profit.toLocaleString()} EGP`}
            detail={`${totals.expenses.toLocaleString()} EGP expenses`}
          />
        </section>

        <div className="mt-5 flex items-center gap-2 text-[10px] text-white/25">
          <FileText size={13} />

          Generated live from current Studio OS data ·{" "}
          {new Date(report.generatedAt).toLocaleString()}
        </div>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-[9px] uppercase tracking-[0.16em] text-white/25">
        {label}
      </p>

      <p className="mt-3 text-2xl font-medium">
        {value}
      </p>
    </div>
  );
}

function Panel({
  title,
  value,
  detail,
}: {
  title: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-white/25">
        {title}
      </p>

      <p className="mt-3 text-lg">{value}</p>

      <p className="mt-1 text-xs text-white/30">
        {detail}
      </p>
    </div>
  );
}