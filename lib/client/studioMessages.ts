import { createResource, listResource } from "@/lib/client/dataApi";

export type StudioMessage = {
  id: string;
  projectId: string | null;
  senderId: string | null;
  senderName: string;
  body: string;
  createdAt: string;
};

type Row = { id:string;project_id:string|null;sender_id:string|null;sender_name:string|null;body:string;created_at?:string };
const map=(row:Row):StudioMessage=>({id:row.id,projectId:row.project_id||null,senderId:row.sender_id||null,senderName:row.sender_name||"Studio",body:row.body,createdAt:row.created_at||new Date().toISOString()});

export async function getStudioMessages(projectId?:string){return (await listResource<Row>("messages",projectId,500)).data.map(map)}
export async function createStudioMessage(input:{projectId?:string;body:string}){return map((await createResource<Row>("messages",{project_id:input.projectId||null,body:input.body.trim()})).data)}
