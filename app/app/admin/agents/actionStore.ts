"use client";

export type AgentActionType = "Task" | "Approval" | "RFI" | "NCR" | "Site Issue" | "Procurement" | "Notification";
export type AgentActionStatus = "Suggested" | "Applied" | "Dismissed";
export type AgentAction = {
  id: string; type: AgentActionType; title: string; description: string; project: string; projectId?: string;
  priority: "Low" | "Medium" | "High" | "Urgent"; sourceAgent: string; status: AgentActionStatus; createdAt: string; appliedAt?: string; linkedId?: string;
};
const KEY="mason-arc-agent-actions";
export function getAgentActions(): AgentAction[]{ if(typeof window==="undefined") return []; try{return JSON.parse(localStorage.getItem(KEY)||"[]") as AgentAction[]}catch{return [];} }
function save(items:AgentAction[]){if(typeof window!=="undefined") localStorage.setItem(KEY,JSON.stringify(items));}
function nextId(items:AgentAction[]){const n=items.reduce((m,x)=>Math.max(m,Number(x.id.match(/AIA-(\d+)/)?.[1]||0)),0)+1;return `AIA-${String(n).padStart(3,"0")}`;}
export function addAgentAction(input:Omit<AgentAction,"id"|"status"|"createdAt">){const items=getAgentActions();const item:AgentAction={...input,id:nextId(items),status:"Suggested",createdAt:new Date().toISOString()};save([item,...items]);return item;}
export function applyAgentAction(id:string,linkedId?:string){const items=getAgentActions();const updated=items.map(x=>x.id===id?{...x,status:"Applied" as const,appliedAt:new Date().toISOString(),linkedId}:x);save(updated);return updated.find(x=>x.id===id);}
export function dismissAgentAction(id:string){const items=getAgentActions();const updated=items.map(x=>x.id===id?{...x,status:"Dismissed" as const}:x);save(updated);return updated.find(x=>x.id===id);}
