import { NextResponse } from "next/server";
import {
  matchesOwnerEmailMigrationToken,
  migrateOwnerLoginEmail,
} from "@/lib/server/ownerEmailMigration";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";
  if (!matchesOwnerEmailMigrationToken(token)) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  try {
    const result = await migrateOwnerLoginEmail();
    return NextResponse.json({ migrated: true, email: result.email });
  } catch (error) {
    console.error("Owner email migration failed", error);
    return NextResponse.json({ error: "Migration failed." }, { status: 500 });
  }
}
