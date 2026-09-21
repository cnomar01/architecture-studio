import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Row = Record<string, unknown>;

function number(value: unknown) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "";
  if (message === "UNAUTHENTICATED") {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }
  if (message === "FORBIDDEN") {
    return NextResponse.json({ error: "Owner or manager access is required." }, { status: 403 });
  }
  console.error("Studio overview failed", error);
  return NextResponse.json({ error: "Could not load the studio overview." }, { status: 500 });
}

export async function GET() {
  try {
    const user = await requireServerUser(["Owner", "Manager"]);
    const [
      projectsResult,
      tasksResult,
      approvalsResult,
      financeResult,
      siteIssuesResult,
      teamResult,
      activityResult,
      notificationResult,
      leadsResult,
      contractsResult,
      procurementResult,
      qualityResult,
      safetyResult,
      constructionResult,
    ] = await Promise.all([
      query<Row>(`SELECT id,code,name,status,phase,location,type FROM projects ORDER BY updated_at DESC LIMIT 500`),
      query<Row>(`SELECT id,project_id,project_name,title,status,priority,deadline,assignee_id,assignee_name FROM tasks ORDER BY updated_at DESC LIMIT 500`),
      query<Row>(`SELECT id,project_id,project_name,title,type,revision,status,submitted_by_name,reviewed_by_name,created_at,updated_at FROM approvals ORDER BY updated_at DESC LIMIT 500`),
      query<Row>(`SELECT id,project_id,type,category,amount,currency,status,description,transaction_date,created_by_name,created_at FROM finance_transactions ORDER BY created_at DESC LIMIT 500`),
      query<Row>(`SELECT id,project_id,title,description,priority,status,created_at,resolved_at FROM site_issues ORDER BY created_at DESC LIMIT 500`),
      query<Row>(`SELECT id,name,role,active FROM users WHERE active=true AND role IN ('Owner','Manager','Engineer') ORDER BY created_at ASC`),
      query<Row>(`SELECT id,actor_user_id,actor_name,action,entity_type,entity_id,metadata,created_at FROM audit_logs ORDER BY created_at DESC LIMIT 30`),
      query<Row>(`SELECT count(*)::int AS count FROM notifications WHERE (user_id=$1 OR user_id IS NULL) AND read_at IS NULL`, [user.id]),
      query<Row>(`SELECT id,company,status,contact_name,email,notes,created_at FROM leads ORDER BY created_at DESC LIMIT 200`),
      query<Row>(`SELECT id,project_id,title,status,value,currency,start_date,end_date,created_at FROM contracts ORDER BY created_at DESC LIMIT 200`),
      query<Row>(`SELECT id,project_id,item,status,priority,supplier,needed_by,created_at FROM procurement_items ORDER BY created_at DESC LIMIT 200`),
      query<Row>(`SELECT id,project_id,title,status,priority,description,created_at FROM quality_items ORDER BY created_at DESC LIMIT 200`),
      query<Row>(`SELECT id,project_id,title,status,severity,description,created_at FROM safety_items ORDER BY created_at DESC LIMIT 200`),
      query<Row>(`SELECT id,project_id,type,title,status,priority,description,created_at FROM construction_items ORDER BY created_at DESC LIMIT 200`),
    ]);

    const tasks = tasksResult.rows;
    const team = teamResult.rows.map((member) => {
      const own = tasks.filter((task) => task.assignee_id === member.id);
      const active = own.filter((task) => !["Completed", "Closed"].includes(String(task.status)));
      const high = active.filter((task) => ["High", "Urgent"].includes(String(task.priority)));
      const overdue = active.filter((task) => {
        if (task.status === "Overdue") return true;
        const deadline = task.deadline instanceof Date ? task.deadline.toISOString().slice(0, 10) : typeof task.deadline === "string" ? task.deadline.slice(0, 10) : "";
        return Boolean(deadline && deadline < new Date().toISOString().slice(0, 10));
      });
      const workload = Math.min(100, active.length * 20 + high.length * 10 + overdue.length * 15);
      return {
        id: String(member.id),
        name: String(member.name),
        role: String(member.role),
        activeTasks: active.length,
        overdueTasks: overdue.length,
        workload,
        status: workload >= 80 ? "Overloaded" : workload >= 55 ? "Busy" : workload >= 25 ? "Balanced" : "Available",
      };
    });

    const finance = financeResult.rows.map((item) => ({ ...item, amount: number(item.amount) }));

    return NextResponse.json(
      {
        projects: projectsResult.rows,
        tasks,
        approvals: approvalsResult.rows,
        finance,
        siteIssues: siteIssuesResult.rows,
        team,
        activity: activityResult.rows,
        unreadNotifications: number(notificationResult.rows[0]?.count),
        operations: {
          leads: leadsResult.rows,
          contracts: contractsResult.rows.map((item) => ({ ...item, value: number(item.value) })),
          procurement: procurementResult.rows,
          quality: qualityResult.rows,
          safety: safetyResult.rows,
          construction: constructionResult.rows,
        },
        generatedAt: new Date().toISOString(),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
