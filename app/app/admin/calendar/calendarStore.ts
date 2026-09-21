export type CalendarEventType = "Task" | "Site Visit" | "Deadline" | "Meeting" | "Milestone";
export type CalendarEventStatus = "Planned" | "Completed" | "Cancelled";

export type CalendarEvent = {
  id: string; title: string; project: string; projectId?: string | null;
  type: CalendarEventType; date: string; endDate?: string | null; time?: string;
  status: CalendarEventStatus; description?: string; googleEventId?: string | null; createdAt: string;
};

type ApiEvent = { id: string; project_id: string | null; project_name: string; title: string; event_type: CalendarEventType; event_date: string; end_date: string | null; event_time: string; status: CalendarEventStatus; description: string; google_event_id: string | null; created_at: string };

function day(value: string | Date | null | undefined) {
  if (!value) return "";
  return typeof value === "string" ? value.slice(0, 10) : value.toISOString().slice(0, 10);
}

export function mapCalendarEvent(event: ApiEvent): CalendarEvent {
  return { id: event.id, project: event.project_name, projectId: event.project_id, title: event.title, type: event.event_type, date: day(event.event_date), endDate: day(event.end_date) || null, time: event.event_time || "", status: event.status, description: event.description, googleEventId: event.google_event_id, createdAt: new Date(event.created_at).toISOString() };
}

export async function getCalendarEvents() {
  const response = await fetch("/api/calendar-events", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load calendar events.");
  const data = await response.json() as { events?: ApiEvent[] };
  return (data.events || []).map(mapCalendarEvent);
}
