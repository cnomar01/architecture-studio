"use client";
export type ProcurementStatus="Requested"|"Quoted"|"Ordered"|"Partially Delivered"|"Delivered"|"Cancelled";
export type ProcurementItem={id:string;projectId:string;project:string;item:string;category:string;vendor?:string;quantity:number;unit:string;unitCost:number;total:number;status:ProcurementStatus;requestedBy:string;requiredDate?:string;notes?:string;createdAt:string;updatedAt:string};
const KEY="mason-arc-procurement";
function read():ProcurementItem[]{if(typeof window==="undefined")return [];try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return []}}
function write(v:ProcurementItem[]){if(typeof window!=="undefined")localStorage.setItem(KEY,JSON.stringify(v))}
export function getProcurement(projectId?:string){const v=read();return (projectId?v.filter(x=>x.projectId===projectId):v).sort((a,b)=>b.createdAt.localeCompare(a.createdAt))}
export function addProcurement(input:Omit<ProcurementItem,"id"|"createdAt"|"updatedAt"|"total">){const now=new Date().toISOString();const n={...input,id:`PRC-${Date.now()}`,total:input.quantity*input.unitCost,createdAt:now,updatedAt:now};write([n,...read()]);return n}
export function updateProcurement(id:string,patch:Partial<ProcurementItem>){const v=read();const n=v.find(x=>x.id===id);if(!n)return null;const u={...n,...patch,updatedAt:new Date().toISOString()};u.total=u.quantity*u.unitCost;write(v.map(x=>x.id===id?u:x));return u}
