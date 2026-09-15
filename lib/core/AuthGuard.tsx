"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getCurrentUser,
  getDatabaseCurrentUser,
  isDatabaseAuth,
  UserRole,
} from "@/lib/core/authStore";

type AuthGuardProps = {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: string;
};

export default function AuthGuard({
  children,
  allowedRoles,
  fallback = "/app/login",
}: AuthGuardProps) {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      const user = isDatabaseAuth ? await getDatabaseCurrentUser() : getCurrentUser();
      if (cancelled) return;

      if (!user) {
      router.replace(fallback);
      return;
    }

    if (!user.active) {
      router.replace(fallback);
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      if (
        user.role === "Owner" ||
        user.role === "Manager"
      ) {
        router.replace("/app/admin");
        return;
      }

      if (user.role === "Engineer") {
        router.replace("/app/engineer");
        return;
      }

      if (user.role === "Client") {
        router.replace("/app");
        return;
      }

      router.replace(fallback);
      return;
    }

      setAllowed(true);
      setChecking(false);
    };
    void check();
    return () => { cancelled = true; };
  }, [router, allowedRoles, fallback]);

  if (checking || !allowed) {
    return (
      <main className="min-h-screen bg-[#050505] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border border-white/10 border-t-white" />

            <p className="mt-4 text-xs text-white/30">
              Checking access...
            </p>
          </div>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}