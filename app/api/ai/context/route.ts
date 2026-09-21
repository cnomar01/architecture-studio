import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const count = async (table: string, where = "") => Number((await query<{ count: string }>(`SELECT COUNT(*)::text AS count FROM ${table}${where}`)).rows[0]?.count || 0);

export async function GET() {
  try {
    await requireServerUser(["Owner", "Manager"]);
    const [projects, tasks, approvals, files, finance, issues, team] = await Promise.all([
      query<{ id:string; code:string; name:string; status:string; phase:string; project_manager_name:string|null; target_date:string|null }>("SELECT id,code,name,status,phase,project_manager_name,target_date::text FROM projects ORDER BY created_at DESC LIMIT 100"),
      query<{ id:string; title:string; project_name:string|null; assignee_name:string|null; priority:string; status:string; deadline:string|null }>("SELECT id,title,project_name,assignee_name,priority,status,deadline::text FROM tasks ORDER BY created_at DESC LIMIT 100"),
      query<{ id:string; title:string; project_name:string|null; status:string }>("SELECT id,title,project_name,status FROM approvals ORDER BY created_at DESC LIMIT 100"),
      query<{ id:string; name:string; category:string; revision:string; status:string }>("SELECT id,name,category,revision,status FROM project_files ORDER BY created_at DESC LIMIT 100"),
      query<{ id:string; type:string; category:string; amount:string; currency:string; status:string }>("SELECT id,type,category,amount::text,currency,status FROM finance_transactions ORDER BY created_at DESC LIMIT 100"),
      query<{ id:string; title:string; description:string; priority:string; status:string }>("SELECT id,title,description,priority,status FROM site_issues ORDER BY created_at DESC LIMIT 100"),
      query<{ id:string; name:string; role:string; employee_id:string|null }>("SELECT id,name,role,employee_id FROM users WHERE active=true ORDER BY created_at ASC LIMIT 100"),
    ]);
    const [openTasks, overdue, pendingApprovals, openIssues] = await Promise.all([
      count("tasks", " WHERE status <> 'Completed'"), count("tasks", " WHERE status = 'Overdue'"),
      count("approvals", " WHERE lower(status) LIKE '%pending%'"), count("site_issues", " WHERE status <> 'Resolved'"),
    ]);
    const stats = { projects: projects.rowCount || 0, openTasks, overdue, pendingApprovals, siteIssues: openIssues, files: files.rowCount || 0, finance: finance.rowCount || 0, team: team.rowCount || 0 };
    const context = [
      `CURRENT DATE: ${new Date().toISOString().slice(0, 10)}`,
      `PROJECTS (${stats.projects}):`, ...projects.rows.map(p => `- ${p.name} | ${p.code} | ${p.status} | ${p.phase} | PM: ${p.project_manager_name || "Not assigned"} | Target: ${p.target_date || "Not set"}`),
      `TASKS (${tasks.rowCount || 0}; open ${openTasks}; overdue ${overdue}):`, ...tasks.rows.map(t => `- ${t.id} | ${t.title} | ${t.project_name || "Unknown"} | ${t.assignee_name || "Unassigned"} | ${t.priority} | ${t.status} | deadline: ${t.deadline || "Not set"}`),
      `PENDING APPROVALS (${pendingApprovals}):`, ...approvals.rows.filter(a => a.status.toLowerCase().includes("pending")).map(a => `- ${a.id} | ${a.title} | ${a.project_name || "Unknown"} | ${a.status}`),
      `SITE OPEN ISSUES (${openIssues}):`, ...issues.rows.filter(i => i.status !== "Resolved").map(i => `- ${i.id} | ${i.title || i.description} | ${i.priority} | ${i.status}`),
      `FILES (${files.rowCount || 0}):`, ...files.rows.map(f => `- ${f.id} | ${f.name} | ${f.category} | Rev ${f.revision} | ${f.status}`),
      `FINANCE TRANSACTIONS (${finance.rowCount || 0}):`, ...finance.rows.map(f => `- ${f.id} | ${f.type} | ${f.category} | ${f.amount} ${f.currency} | ${f.status}`),
      `ACTIVE USERS (${team.rowCount || 0}):`, ...team.rows.map(u => `- ${u.name} | ${u.role}${u.employee_id ? ` | ${u.employee_id}` : ""}`),
    ].join("\n");
    return NextResponse.json({ stats, context, projects: projects.rows.map(p => ({ id:p.id, name:p.name })) }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "";
    return NextResponse.json({ error: reason === "UNAUTHENTICATED" ? "Sign in to use AI Studio." : reason === "FORBIDDEN" ? "Owner or Manager access is required." : "Could not load live studio context." }, { status: reason === "UNAUTHENTICATED" ? 401 : reason === "FORBIDDEN" ? 403 : 500 });
  }
}
