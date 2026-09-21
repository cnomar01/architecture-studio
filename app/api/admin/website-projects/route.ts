import { NextResponse } from "next/server";
import { audit, requireServerUser } from "@/lib/server/auth";
import { query } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const fields = "id,slug,title,location,year,category,description,image_url,gallery,published,created_at,updated_at";
const text = (value: unknown, limit: number) => typeof value === "string" ? value.trim().slice(0, limit) : "";
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 100);
function images(value: unknown) {
  const list = Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
  return list.map((item) => item.trim()).filter((item) => /^https?:\/\//.test(item) || item.startsWith("/") || /^data:image\/(png|jpe?g|webp|gif);base64,/i.test(item)).filter((item) => item.length <= 5_500_000).slice(0, 12);
}
function body(value: Record<string, unknown>) {
  const title = text(value.title, 160);
  const slug = slugify(text(value.slug, 120) || title);
  const imageUrl = images([value.image_url])[0] || "";
  return { title, slug, location: text(value.location, 160), year: text(value.year, 80), category: text(value.category, 80) || "Architecture", description: text(value.description, 12_000), imageUrl, gallery: images(value.gallery), published: Boolean(value.published) };
}
function errorResponse(error: unknown) { const message = error instanceof Error ? error.message : ""; if (message === "UNAUTHENTICATED") return NextResponse.json({ error:"Sign in as the Owner to manage website content." },{status:401}); if (message === "FORBIDDEN") return NextResponse.json({ error:"Only the Owner can manage public website content." },{status:403}); if ((error as {code?:string})?.code === "23505") return NextResponse.json({error:"That public URL is already in use."},{status:409}); console.error("Website CMS error",error); return NextResponse.json({error:"Website content operation failed."},{status:500}); }

export async function GET(){try{await requireServerUser(["Owner"]);const result=await query(`SELECT ${fields} FROM website_projects ORDER BY updated_at DESC`);return NextResponse.json({projects:result.rows},{headers:{"Cache-Control":"no-store"}})}catch(error){return errorResponse(error)}}
export async function POST(request:Request){try{const user=await requireServerUser(["Owner"]);const value=body(await request.json());if(!value.title||!value.slug||!value.imageUrl)return NextResponse.json({error:"Title, public URL and cover image are required."},{status:400});const id=`WEB-${crypto.randomUUID().slice(0,8).toUpperCase()}`;const result=await query(`INSERT INTO website_projects(id,slug,title,location,year,category,description,image_url,gallery,published) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING ${fields}`,[id,value.slug,value.title,value.location,value.year,value.category,value.description,value.imageUrl,JSON.stringify(value.gallery),value.published]);await audit("website_project.created","WebsiteProject",id,{actor:user.id,slug:value.slug});return NextResponse.json({project:result.rows[0]},{status:201})}catch(error){return errorResponse(error)}}
export async function PATCH(request:Request){try{const user=await requireServerUser(["Owner"]);const raw=await request.json() as Record<string,unknown>;const id=text(raw.id,100);const value=body(raw);if(!id||!value.title||!value.slug||!value.imageUrl)return NextResponse.json({error:"ID, title, public URL and cover image are required."},{status:400});const result=await query(`UPDATE website_projects SET slug=$1,title=$2,location=$3,year=$4,category=$5,description=$6,image_url=$7,gallery=$8,published=$9,updated_at=NOW() WHERE id=$10 RETURNING ${fields}`,[value.slug,value.title,value.location,value.year,value.category,value.description,value.imageUrl,JSON.stringify(value.gallery),value.published,id]);if(!result.rows[0])return NextResponse.json({error:"Website project not found."},{status:404});await audit("website_project.updated","WebsiteProject",id,{actor:user.id,slug:value.slug});return NextResponse.json({project:result.rows[0]})}catch(error){return errorResponse(error)}}
export async function DELETE(request:Request){try{const user=await requireServerUser(["Owner"]);const id=new URL(request.url).searchParams.get("id")||"";if(!id)return NextResponse.json({error:"Project ID is required."},{status:400});const result=await query("DELETE FROM website_projects WHERE id=$1 RETURNING id",[id]);if(!result.rows[0])return NextResponse.json({error:"Website project not found."},{status:404});await audit("website_project.deleted","WebsiteProject",id,{actor:user.id});return NextResponse.json({ok:true})}catch(error){return errorResponse(error)}}
