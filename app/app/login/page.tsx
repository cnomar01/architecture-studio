"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";

import {
  databaseLogin,
  AuthUser,
} from "@/lib/core/authStore";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function redirectUser(user: AuthUser) {
    if (user.role === "Owner" || user.role === "Manager") {
      router.push("/app/admin");
      return;
    }

    if (user.role === "Engineer") {
      router.push("/app/engineer");
      return;
    }

    if (user.role === "Client") {
      router.push("/app");
      return;
    }

    setError("No dashboard is available for this account.");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setError("Please enter your email.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const user = await databaseLogin(cleanEmail, password);

      if (!user) {
        setError("Invalid email or password.");
        return;
      }

      redirectUser(user);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">

          {/* LOGO */}
          <div className="mb-10 flex justify-center">
            <Image
              src="/images/logo-mason-arc.png"
              alt="Mason & Arc"
              width={170}
              height={70}
              className="h-auto w-[150px] object-contain"
              priority
            />
          </div>

          {/* CARD */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-7 shadow-2xl">

            <div className="mb-8">
              <p className="text-[9px] uppercase tracking-[0.3em] text-white/25">
                Mason & Arc
              </p>

              <h1 className="mt-2 text-2xl font-medium tracking-tight">
                Studio Login
              </h1>

              <p className="mt-2 text-xs leading-5 text-white/30">
                Access the Mason & Arc Digital Studio OS.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* EMAIL */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/30">
                  <Mail size={13} />
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@masonandarc.com"
                  autoComplete="email"
                  maxLength={254}
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-white/30">
                  <LockKeyhole size={13} />
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="••••••••"
                  autoComplete="current-password"
                  maxLength={256}
                  required
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/25"
                />

                <Link href="/app/forgot-password" className="mt-2 flex min-h-11 items-center justify-end text-sm text-white/70 underline underline-offset-4 hover:text-white">
                  Forgot your password?
                </Link>
              </div>

              {/* ERROR */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-xs leading-5 text-red-300"
                >
                  {error}
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3.5 text-xs font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Signing in..." : "Sign In"}

                {!loading && (
                  <ArrowRight
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                )}
              </button>

            </form>
          </div>

          <p className="mt-8 text-center text-[9px] uppercase tracking-[0.2em] text-white/15">
            Mason & Arc Digital Studio OS
          </p>

        </div>
      </div>
    </main>
  );
}
