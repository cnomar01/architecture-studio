import { redirect } from "next/navigation";

// Operations Hub is the shared, database-backed source of truth.
// Keep the older workspace URL working without sending users to retired local-only screens.
export default function OperationsPage() {
  redirect("/app/admin/operations-hub");
}
