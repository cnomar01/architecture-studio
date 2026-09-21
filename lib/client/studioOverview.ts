export type OverviewProject = {
  id: string;
  code: string;
  name: string;
  status: string;
  phase: string;
  location: string;
  type: string;
};

export type OverviewTask = {
  id: string;
  project_id: string | null;
  project_name: string | null;
  title: string;
  status: string;
  priority: string;
  deadline: string | null;
  assignee_id: string | null;
  assignee_name: string | null;
};

export type OverviewApproval = {
  id: string;
  project_id: string | null;
  project_name: string | null;
  title: string;
  type: string;
  revision: string | null;
  status: string;
  submitted_by_name: string | null;
  reviewed_by_name: string | null;
  created_at: string;
  updated_at: string;
};

export type OverviewFinance = {
  id: string;
  project_id: string | null;
  type: "Income" | "Expense";
  category: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  transaction_date: string;
  created_by_name: string | null;
  created_at: string;
};

export type OverviewSiteIssue = {
  id: string;
  project_id: string | null;
  title: string;
  description: string;
  priority: string;
  status: string;
  created_at: string;
  resolved_at: string | null;
};

export type OverviewTeamMember = {
  id: string;
  name: string;
  role: string;
  activeTasks: number;
  overdueTasks: number;
  workload: number;
  status: "Available" | "Balanced" | "Busy" | "Overloaded";
};

export type OverviewActivity = {
  id: number;
  actor_user_id: string | null;
  actor_name: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

type OperationRow = Record<string, string | number | null> & { id: string };

export type StudioOverview = {
  projects: OverviewProject[];
  tasks: OverviewTask[];
  approvals: OverviewApproval[];
  finance: OverviewFinance[];
  siteIssues: OverviewSiteIssue[];
  team: OverviewTeamMember[];
  activity: OverviewActivity[];
  unreadNotifications: number;
  operations: {
    leads: OperationRow[];
    contracts: OperationRow[];
    procurement: OperationRow[];
    quality: OperationRow[];
    safety: OperationRow[];
    construction: OperationRow[];
  };
  generatedAt: string;
};

export async function getStudioOverview(signal?: AbortSignal): Promise<StudioOverview> {
  const response = await fetch("/api/admin/overview", {
    cache: "no-store",
    credentials: "include",
    signal,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Could not load the studio overview.");
  return data as StudioOverview;
}
