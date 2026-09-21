export type StudioStats = { projects:number; openTasks:number; overdue:number; pendingApprovals:number; siteIssues:number; files:number; finance:number; team:number };
export type StudioContext = { stats:StudioStats; context:string; projects:Array<{id:string;name:string}> };
export async function getStudioContext() {
  const response = await fetch("/api/ai/context", { cache:"no-store", credentials:"include" });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Could not load live studio context.");
  return data as StudioContext;
}
