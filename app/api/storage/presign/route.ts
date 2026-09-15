import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { audit, requireServerUser } from "@/lib/server/auth";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const user = await requireServerUser(["Owner", "Manager", "Engineer"]);
    if (!process.env.S3_BUCKET || !process.env.S3_REGION) return NextResponse.json({ error: "S3 storage is not configured." }, { status: 503 });
    const body = await request.json();
    const fileName = String(body?.fileName || "").replace(/[^a-zA-Z0-9._/-]/g, "_");
    const contentType = String(body?.contentType || "application/octet-stream");
    const projectId = String(body?.projectId || "general");
    if (!fileName) return NextResponse.json({ error: "fileName is required." }, { status: 400 });
    const key = `projects/${projectId}/${crypto.randomUUID()}-${fileName}`;
    const client = new S3Client({ region: process.env.S3_REGION, endpoint: process.env.S3_ENDPOINT || undefined, forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true" });
    const url = await getSignedUrl(client, new PutObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key, ContentType: contentType }), { expiresIn: Number(process.env.S3_PRESIGN_SECONDS || 600) });
    await audit("storage.presign", "File", undefined, { key, userId: user.id });
    return NextResponse.json({ url, key, expiresIn: Number(process.env.S3_PRESIGN_SECONDS || 600) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Storage presign failed.";
    return NextResponse.json({ error: message }, { status: message === "UNAUTHENTICATED" ? 401 : message === "FORBIDDEN" ? 403 : 500 });
  }
}
