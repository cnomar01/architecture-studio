"use client";

export type LeadStatus = "New" | "Qualified" | "Proposal" | "Won" | "Lost";
export type ContractStatus = "Draft" | "Active" | "Completed" | "Expired";
export type ProcurementStatus = "Requested" | "RFQ" | "Quoted" | "PO Issued" | "Delivered" | "Cancelled";
export type QCStatus = "Open" | "In Review" | "Approved" | "Rejected";
export type HSESeverity = "Low" | "Medium" | "High" | "Critical";

export type Lead = { id:string; company:string; contact:string; email:string; service:string; value:number; status:LeadStatus; nextFollowUp:string };
export type Contract = { id:string; projectId:string; client:string; scope:string; value:number; startDate:string; endDate:string; status:ContractStatus; paymentMilestones:number };
export type ProcurementRequest = { id:string; projectId:string; item:string; category:string; supplier:string; qty:number; unit:string; estimatedCost:number; status:ProcurementStatus; neededBy:string };
export type QCItem = { id:string; projectId:string; title:string; discipline:string; inspector:string; status:QCStatus; priority:HSESeverity; dueDate:string; notes:string };
export type HSEItem = { id:string; projectId:string; title:string; area:string; severity:HSESeverity; owner:string; status:"Open"|"In Progress"|"Closed"; date:string; action:string };
export type Timesheet = { id:string; projectId:string; employee:string; date:string; hours:number; activity:string; billable:boolean };
export type ProgressItem = { id:string; projectId:string; phase:string; planned:number; actual:number; baseline:number; forecast:number; status:"On Track"|"At Risk"|"Delayed" };

const keys={leads:"mason-arc-leads",contracts:"mason-arc-contracts",procurement:"mason-arc-procurement",qc:"mason-arc-qc",hse:"mason-arc-hse",timesheets:"mason-arc-timesheets",progress:"mason-arc-progress"};
const seed={
leads:[{id:"LD-001",company:"City Edge",contact:"Project Client",email:"",service:"Architecture & Construction",value:0,status:"Qualified",nextFollowUp:"2026-09-18"}] as Lead[],
contracts:[{id:"CON-001",projectId:"CEM-001",client:"City Edge",scope:"Architecture, coordination and construction support",value:0,startDate:"2026-09-01",endDate:"",status:"Active",paymentMilestones:4}] as Contract[],
procurement:[{id:"PR-001",projectId:"CEM-001",item:"Exterior lighting package",category:"Electrical / Lighting",supplier:"",qty:1,unit:"Package",estimatedCost:0,status:"Requested",neededBy:"2026-09-25"}] as ProcurementRequest[],
qc:[{id:"QC-001",projectId:"CEM-001",title:"Architectural finish inspection",discipline:"Architecture",inspector:"Omar Mohamed",status:"Open",priority:"Medium",dueDate:"2026-09-20",notes:"Verify finish quality against approved drawings."}] as QCItem[],
hse:[{id:"HSE-001",projectId:"CEM-001",title:"Site access / housekeeping observation",area:"Site",severity:"Medium",owner:"",status:"Open",date:"2026-09-15",action:"Review and close with photo evidence."}] as HSEItem[],
timesheets:[] as Timesheet[],
progress:[{id:"PRG-001",projectId:"CEM-001",phase:"Design Development",planned:45,actual:40,baseline:45,forecast:52,status:"At Risk"}] as ProgressItem[]};

function read<T>(key:string,fallback:T):T{ if(typeof window==="undefined") return fallback; const raw=localStorage.getItem(key); if(!raw){localStorage.setItem(key,JSON.stringify(fallback));return fallback;} try{return JSON.parse(raw) as T}catch{return fallback} }
function write<T>(key:string,v:T){if(typeof window!=="undefined")localStorage.setItem(key,JSON.stringify(v));}
export const getLeads=()=>read(keys.leads,seed.leads); export const saveLeads=(v:Lead[])=>write(keys.leads,v);
export const getContracts=()=>read(keys.contracts,seed.contracts); export const saveContracts=(v:Contract[])=>write(keys.contracts,v);
export const getProcurement=()=>read(keys.procurement,seed.procurement); export const saveProcurement=(v:ProcurementRequest[])=>write(keys.procurement,v);
export const getQC=()=>read(keys.qc,seed.qc); export const saveQC=(v:QCItem[])=>write(keys.qc,v);
export const getHSE=()=>read(keys.hse,seed.hse); export const saveHSE=(v:HSEItem[])=>write(keys.hse,v);
export const getTimesheets=()=>read(keys.timesheets,seed.timesheets); export const saveTimesheets=(v:Timesheet[])=>write(keys.timesheets,v);
export const getProgress=()=>read(keys.progress,seed.progress); export const saveProgress=(v:ProgressItem[])=>write(keys.progress,v);
export function addLead(x:Omit<Lead,"id">){const v=[...getLeads(),{...x,id:`LD-${String(getLeads().length+1).padStart(3,"0")}`}];saveLeads(v);return v[v.length-1]}
export function addContract(x:Omit<Contract,"id">){const v=[...getContracts(),{...x,id:`CON-${String(getContracts().length+1).padStart(3,"0")}`}];saveContracts(v);return v[v.length-1]}
export function addProcurement(x:Omit<ProcurementRequest,"id">){const v=[...getProcurement(),{...x,id:`PR-${String(getProcurement().length+1).padStart(3,"0")}`}];saveProcurement(v);return v[v.length-1]}
export function addQC(x:Omit<QCItem,"id">){const v=[...getQC(),{...x,id:`QC-${String(getQC().length+1).padStart(3,"0")}`}];saveQC(v);return v[v.length-1]}
export function addHSE(x:Omit<HSEItem,"id">){const v=[...getHSE(),{...x,id:`HSE-${String(getHSE().length+1).padStart(3,"0")}`}];saveHSE(v);return v[v.length-1]}
export function addTimesheet(x:Omit<Timesheet,"id">){const v=[...getTimesheets(),{...x,id:`TS-${String(getTimesheets().length+1).padStart(3,"0")}`}];saveTimesheets(v);return v[v.length-1]}
export function updateProgress(id:string,x:Partial<ProgressItem>){const v=getProgress().map(i=>i.id===id?{...i,...x}:i);saveProgress(v);return v}
