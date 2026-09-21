import AuthGuard from "@/lib/core/AuthGuard";

export default function EngineerLayout({ children }: { children: React.ReactNode }) {
  return <AuthGuard allowedRoles={["Engineer"]}>{children}</AuthGuard>;
}
