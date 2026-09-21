import { NextResponse } from "next/server";
import { requireServerUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(){try{const user=await requireServerUser();const result=await query(`SELECT id,type,priority,title,body,read_at,created_at FROM notifications WHERE user_id=$1 OR user_id IS NULL ORDER BY created_at DESC LIMIT 200`,[user.id]);return NextResponse.json({notifications:result.rows,unread:result.rows.filter((item)=>!item.read_at).length},{headers:{"Cache-Control":"no-store"}})}catch(error){return failure(error)}}
export async function PATCH(request:Request){try{const user=await requireServerUser();const body=await request.json().catch(()=>({}));const id=String(body?.id||"");if(body?.all){await query(`UPDATE notifications SET read_at=COALESCE(read_at,NOW()) WHERE user_id=$1 OR user_id IS NULL`,[user.id])}else if(id){await query(`UPDATE notifications SET read_at=COALESCE(read_at,NOW()) WHERE id=$1 AND (user_id=$2 OR user_id IS NULL)`,[id,user.id])}else{return NextResponse.json({error:"id or all is required."},{status:400})}return NextResponse.json({ok:true})}catch(error){return failure(error)}}
function failure(error:unknown){const message=error instanceof Error?error.message:"";return NextResponse.json({error:message==="UNAUTHENTICATED"?"Authentication required.":"Notification request failed."},{status:message==="UNAUTHENTICATED"?401:500})}
