import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { audit, requireServerUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";
import { createGoogleCalendarEvent } from "@/lib/server/googleCalendar";

export const runtime = "nodejs";
const types = new Set(["Task", "Site Visit", "Deadline", "Meeting", "Milestone"]);

export async function GET() {
  try {
    await requireServerUser(["Owner", "Manager"]);
    const result = await query("SELECT id,project_id,project_name,title,event_type,event_date,end_date,event_time,status,description,google_event_id,created_at FROM calendar_events ORDER BY event_date ASC, created_at ASC");
    return NextResponse.json({ events: result.rows }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    return NextResponse.json({ error: "Could not load calendar events." }, { status: message === "UNAUTHENTICATED" ? 401 : message === "FORBIDDEN" ? 403 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireServerUser(["Owner", "Manager"]);
    const body = await request.json() as Record<string, unknown>;
    const title = typeof body.title === "string" ? body.title.trim().slice(0, 180) : "";
    const eventDate = typeof body.date === "string" ? body.date.slice(0, 10) : "";
    const eventType = typeof body.type === "string" && types.has(body.type) ? body.type : "Meeting";
    if (!title || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) return NextResponse.json({ error: "Title and a valid date are required." }, { status: 400 });
    const projectId = typeof body.projectId === "string" && body.projectId ? body.projectId.slice(0, 100) : null;
    const projectName = typeof body.project === "string" ? body.project.trim().slice(0, 180) : "";
    const endDate = typeof body.endDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(body.endDate) ? body.endDate : null;
    const time = typeof body.time === "string" && /^\d{2}:\d{2}$/.test(body.time) ? body.time : "";
    const description = typeof body.description === "string" ? body.description.trim().slice(0, 2000) : "";
    const googleEventId = await createGoogleCalendarEvent({ title, date: eventDate, endDate, time, description: `${projectName ? `Project: ${projectName}\n` : ""}${description}` });
    const id = `CAL-${randomUUID().slice(0, 8).toUpperCase()}`;
    const result = await query("INSERT INTO calendar_events(id,project_id,project_name,title,event_type,event_date,end_date,event_time,status,description,google_event_id,created_by_user_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8,'Planned',$9,$10,$11) RETURNING id,project_id,project_name,title,event_type,event_date,end_date,event_time,status,description,google_event_id,created_at", [id, projectId, projectName, title, eventType, eventDate, endDate, time, description, googleEventId, user.id]);
    await audit("calendar.event.create", "CalendarEvent", id, { type: eventType, projectId, syncedToGoogle: Boolean(googleEventId) });
    return NextResponse.json({ event: result.rows[0] }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "UNAUTHENTICATED" || message === "FORBIDDEN") return NextResponse.json({ error: "Not authorized to create calendar events." }, { status: message === "UNAUTHENTICATED" ? 401 : 403 });
    console.error("Calendar event creation failed", error);
    return NextResponse.json({ error: message === "Google Calendar could not create the event." ? message : "Could not create calendar event." }, { status: 500 });
  }
}
