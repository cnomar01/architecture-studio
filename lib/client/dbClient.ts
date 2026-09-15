export type DataMode = "prototype" | "database";
export const dataMode: DataMode = process.env.NEXT_PUBLIC_DATA_MODE === "database" ? "database" : "prototype";

export async function dbList<T = unknown>(resource: string, projectId?: string): Promise<T[]> {
  const url = new URL(`/api/data/${resource}`, window.location.origin);
  if (projectId) url.searchParams.set("projectId", projectId);
  const response = await fetch(url, { credentials: "include", cache: "no-store" });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error || "Database request failed.");
  return payload.data || [];
}

export async function dbCreate<T = unknown>(resource: string, data: Record<string, unknown>): Promise<T> {
  const response = await fetch(`/api/data/${resource}`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error || "Database create failed.");
  return payload.data;
}

export async function dbUpdate<T = unknown>(resource: string, data: Record<string, unknown>): Promise<T> {
  const response = await fetch(`/api/data/${resource}`, { method: "PATCH", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload?.error || "Database update failed.");
  return payload.data;
}
