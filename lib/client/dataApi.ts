export type DataApiResponse<T> = { data: T[]; count?: number };

async function request<T>(resource: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`/api/data/${resource}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    credentials: "include",
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload?.error || `Request failed (${response.status})`);
  return payload as T;
}

export function listResource<T>(resource: string, projectId?: string, limit = 100) {
  const params = new URLSearchParams({ limit: String(limit) });
  if (projectId) params.set("projectId", projectId);
  return request<DataApiResponse<T>>(`${resource}?${params.toString()}`);
}

export function createResource<T>(resource: string, body: Record<string, unknown>) {
  return request<{ data: T }>(resource, { method: "POST", body: JSON.stringify(body) });
}

export function updateResource<T>(resource: string, body: Record<string, unknown>) {
  return request<{ data: T }>(resource, { method: "PATCH", body: JSON.stringify(body) });
}

export function deleteResource(resource: string, id: string) {
  return request<{ ok: true; id: string }>(`${resource}?id=${encodeURIComponent(id)}`, { method: "DELETE" });
}
