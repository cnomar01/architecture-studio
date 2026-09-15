"use client";

export type CalendarEventType = "Task" | "Site Visit" | "Deadline" | "Meeting" | "Milestone";
export type CalendarEventStatus = "Planned" | "Completed" | "Cancelled";

export type CalendarEvent = {
  id: string; title: string; project: string; projectId?: string;
  type: CalendarEventType; date: string; endDate?: string; time?: string;
  assignee?: string; assigneeId?: string; status: CalendarEventStatus;
  description?: string; linkedTaskId?: string; createdAt: string;
};

const KEY = "mason-arc-calendar";
const initialEvents: CalendarEvent[] = [
  { id: "CAL-001", title: "Revise Ground Floor Plan", project: "City Edge Mall", projectId: "CEM-001", type: "Task", date: new Date().toISOString().slice(0,10), time: "09:00", assignee: "Omar Mohamed", assigneeId: "OM-001", status: "Planned", linkedTaskId: "TSK-001", createdAt: new Date().toISOString() },
  { id: "CAL-002", title: "Design Development Milestone", project: "City Edge Mall", projectId: "CEM-001", type: "Milestone", date: new Date(Date.now()+7*86400000).toISOString().slice(0,10), status: "Planned", createdAt: new Date().toISOString() },
];
function load(): CalendarEvent[] { if (typeof window === "undefined") return initialEvents; try { const raw=localStorage.getItem(KEY); if(!raw){localStorage.setItem(KEY,JSON.stringify(initialEvents));return initialEvents;} return JSON.parse(raw) as CalendarEvent[];}catch{return initialEvents;} }
function save(items: CalendarEvent[]){ if(typeof window!=="undefined") localStorage.setItem(KEY,JSON.stringify(items)); }
export function getCalendarEvents(){return load();}
export function getCalendarEventById(id:string){return load().find(e=>e.id===id);}
export function getEventsForDate(date:string){return load().filter(e=>e.date===date);}
export function getProjectCalendarEvents(projectId:string){return load().filter(e=>e.projectId===projectId);}
export function addCalendarEvent(input:Omit<CalendarEvent,"id"|"createdAt">){const items=load(); const event={...input,id:`CAL-${String(items.length+1).padStart(3,"0")}`,createdAt:new Date().toISOString()}; items.push(event);save(items);return event;}
export function updateCalendarEvent(id:string,updates:Partial<Omit<CalendarEvent,"id"|"createdAt">>){const items=load();const i=items.findIndex(e=>e.id===id);if(i<0)return undefined;items[i]={...items[i],...updates};save(items);return items[i];}
export function deleteCalendarEvent(id:string){const items=load();const next=items.filter(e=>e.id!==id);if(next.length===items.length)return false;save(next);return true;}
export function getUpcomingEvents(days=14){const now=new Date();const end=new Date(now.getTime()+days*86400000);return load().filter(e=>{const d=new Date(e.date);return d>=new Date(now.toISOString().slice(0,10))&&d<=end&&e.status!=="Cancelled";}).sort((a,b)=>a.date.localeCompare(b.date));}
