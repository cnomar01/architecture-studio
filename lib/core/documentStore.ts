"use client";
export type DocumentStatus="Draft"|"Under Review"|"Approved"|"Superseded"|"Archived";
export type OfficeDocument={id:string;projectId?:string;name:string;category:string;revision:string;status:DocumentStatus;owner:string;fileUrl?:string;tags:string[];createdAt:string;updatedAt:string};
const KEY="mason-arc-documents";
function read():OfficeDocument[]{if(typeof window==="undefined")return [];try{return JSON.parse(localStorage.getItem(KEY)||"[]")}catch{return []}}
function write(v:OfficeDocument[]){if(typeof window!=="undefined")localStorage.setItem(KEY,JSON.stringify(v))}
export function getDocuments(projectId?:string){const v=read();return (projectId?v.filter(x=>x.projectId===projectId):v).sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt))}
export function addDocument(input:Omit<OfficeDocument,"id"|"createdAt"|"updatedAt">){const now=new Date().toISOString();const n={...input,id:`DOC-${Date.now()}`,createdAt:now,updatedAt:now};write([n,...read()]);return n}
export function updateDocument(id:string,patch:Partial<OfficeDocument>){const v=read();const n=v.find(x=>x.id===id);if(!n)return null;const u={...n,...patch,updatedAt:new Date().toISOString()};write(v.map(x=>x.id===id?u:x));return u}
