
export type CommercialStatus = "Lead" | "Proposal" | "Negotiation" | "Won" | "Lost";
export type ContractStatus = "Draft" | "Active" | "Variation" | "Completed" | "Expired";
export type ProcurementStatus = "Draft" | "RFQ" | "Quotations" | "Approved" | "Ordered" | "Delivered" | "Closed";
export type QualityStatus = "Open" | "Under Review" | "Corrective Action" | "Closed";
export type SafetyStatus = "Open" | "Investigating" | "Corrective Action" | "Closed";

export type Lead = { id:string; company:string; contact:string; service:string; value:number; status:CommercialStatus; nextAction:string; createdAt:string };
export type Contract = { id:string; projectId:string; projectName:string; title:string; value:number; currency:"EGP"|"USD"; status:ContractStatus; startDate:string; endDate:string };
export type ProcurementItem = { id:string; projectId:string; projectName:string; item:string; supplier:string; amount:number; currency:"EGP"|"USD"; status:ProcurementStatus; dueDate?:string };
export type QualityItem = { id:string; projectId:string; projectName:string; type:"Inspection"|"NCR"|"Snag"; title:string; status:QualityStatus; priority:"Low"|"Medium"|"High"|"Urgent"; assignee:string };
export type SafetyItem = { id:string; projectId:string; projectName:string; type:"Observation"|"Incident"|"Risk Assessment"|"Permit"; title:string; status:SafetyStatus; severity:"Low"|"Medium"|"High"|"Critical"; assignee:string };
export type Timesheet = { id:string; projectId:string; projectName:string; member:string; date:string; hours:number; activity:string };

const key = "mason_arc_v16_complete";
const seed = {
  leads: [
    {id:"LEAD-001",company:"Residential Client",contact:"New enquiry",service:"Architecture + Interior",value:450000,status:"Proposal",nextAction:"Follow up on proposal",createdAt:"2026-09-15"},
    {id:"LEAD-002",company:"Commercial Prospect",contact:"Management team",service:"Design + Execution",value:1200000,status:"Negotiation",nextAction:"Confirm scope and payment milestones",createdAt:"2026-09-12"},
  ] as Lead[],
  contracts: [
    {id:"CON-001",projectId:"city-edge-mall",projectName:"City Edge Mall",title:"Design & Construction Services",value:2400000,currency:"EGP",status:"Active",startDate:"2026-01-01",endDate:"2026-12-31"},
  ] as Contract[],
  procurement: [
    {id:"PO-001",projectId:"city-edge-mall",projectName:"City Edge Mall",item:"External façade stone",supplier:"Approved supplier",amount:380000,currency:"EGP",status:"RFQ",dueDate:"2026-09-20"},
    {id:"PO-002",projectId:"city-edge-mall",projectName:"City Edge Mall",item:"Lobby doors hardware",supplier:"Approved supplier",amount:95000,currency:"EGP",status:"Ordered",dueDate:"2026-09-25"},
  ] as ProcurementItem[],
  quality: [
    {id:"QC-001",projectId:"city-edge-mall",projectName:"City Edge Mall",type:"Inspection",title:"Waterproofing inspection",status:"Open",priority:"Urgent",assignee:"Ahmed Shabaan"},
    {id:"QC-002",projectId:"city-edge-mall",projectName:"City Edge Mall",type:"NCR",title:"Incorrect finish installation",status:"Corrective Action",priority:"High",assignee:"Ahmed Shabaan"},
    {id:"QC-003",projectId:"city-edge-mall",projectName:"City Edge Mall",type:"Snag",title:"Lobby door alignment",status:"Open",priority:"Medium",assignee:"Omar Mohamed"},
  ] as QualityItem[],
  safety: [
    {id:"HSE-001",projectId:"city-edge-mall",projectName:"City Edge Mall",type:"Observation",title:"Housekeeping around work zone",status:"Open",severity:"Medium",assignee:"Site Team"},
    {id:"HSE-002",projectId:"city-edge-mall",projectName:"City Edge Mall",type:"Risk Assessment",title:"Working at height review",status:"Investigating",severity:"High",assignee:"Site Team"},
  ] as SafetyItem[],
  timesheets: [] as Timesheet[],
};

function load<T extends keyof typeof seed>(name:T): typeof seed[T] {
  if (typeof window === "undefined") return seed[name];
  try { const raw=localStorage.getItem(`${key}_${name}`); return raw ? JSON.parse(raw) : seed[name]; } catch { return seed[name]; }
}
function save<T extends keyof typeof seed>(name:T, value:typeof seed[T]) {
  if (typeof window !== "undefined") localStorage.setItem(`${key}_${name}`, JSON.stringify(value));
}
export function getLeads(){return load("leads")}
export function getContracts(){return load("contracts")}
export function getProcurement(){return load("procurement")}
export function getQuality(){return load("quality")}
export function getSafety(){return load("safety")}
export function getTimesheets(){return load("timesheets")}
export function updateLead(id:string,patch:Partial<Lead>){const x=getLeads().map(v=>v.id===id?{...v,...patch}:v);save("leads",x);return x}
export function updateContract(id:string,patch:Partial<Contract>){const x=getContracts().map(v=>v.id===id?{...v,...patch}:v);save("contracts",x);return x}
export function updateProcurement(id:string,patch:Partial<ProcurementItem>){const x=getProcurement().map(v=>v.id===id?{...v,...patch}:v);save("procurement",x);return x}
export function updateQuality(id:string,patch:Partial<QualityItem>){const x=getQuality().map(v=>v.id===id?{...v,...patch}:v);save("quality",x);return x}
export function updateSafety(id:string,patch:Partial<SafetyItem>){const x=getSafety().map(v=>v.id===id?{...v,...patch}:v);save("safety",x);return x}
export function addTimesheet(v:Omit<Timesheet,"id">){const x=[{...v,id:`TIME-${Date.now()}`},...getTimesheets()];save("timesheets",x);return x}
