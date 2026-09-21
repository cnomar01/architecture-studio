"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, CheckCircle2, LockKeyhole, Mail } from "lucide-react";

export default function PasswordRecovery({ reset = false }: { reset?: boolean }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!reset) return;
    const value = new URLSearchParams(window.location.hash.slice(1)).get("token") || "";
    setToken(value);
    if (!value) setError("Open the password-reset link from your email, or request a new link.");
  }, [reset]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (reset && password !== confirmation) { setError("The passwords do not match."); return; }
    setBusy(true);
    try {
      const response = await fetch(`/api/auth/${reset ? "reset-password" : "forgot-password"}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reset ? { token, password } : { email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Please try again.");
      setMessage(reset ? "Your password has been updated. Sign in with your new password." : data.message);
      if (reset) { setToken(""); setPassword(""); setConfirmation(""); window.history.replaceState(null, "", window.location.pathname); }
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again."); }
    finally { setBusy(false); }
  }

  const inputStyle = "w-full rounded-xl border border-white/15 bg-black/30 px-4 py-3.5 text-base text-white outline-none focus:border-white/60";
  return <main className="flex min-h-svh items-center justify-center bg-[#080808] px-5 py-10 text-white">
    <div className="w-full max-w-md">
      <Link href="/" className="mx-auto mb-10 block w-[150px]" aria-label="Mason & Arc home"><Image src="/images/logo-mason-arc.png" width={170} height={70} alt="Mason & Arc" className="h-auto w-full" /></Link>
      <section className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
        <p className="text-[10px] uppercase tracking-[0.25em] text-white/50">Mason & Arc Studio</p>
        <h1 className="mt-3 text-2xl font-medium">{reset ? "Choose a new password" : "Forgot your password?"}</h1>
        <p className="mt-3 text-sm leading-6 text-white/60">{reset ? "Use a strong password with at least 12 characters." : "Enter your studio account email and we’ll send you a link to reset your password."}</p>
        {message ? <div className="mt-6 space-y-5" role="status"><CheckCircle2 className="text-emerald-400" /><p className="text-sm leading-6 text-white/80">{message}</p><Link href="/app/login" className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black">Back to sign in <ArrowRight size={16} /></Link></div> : <form onSubmit={submit} className="mt-6 space-y-5">
          {reset ? <>
            <div><label htmlFor="new-password" className="mb-2 flex items-center gap-2 text-sm text-white/70"><LockKeyhole size={15} />New password</label><input id="new-password" type="password" autoComplete="new-password" required minLength={12} maxLength={72} value={password} onChange={e => setPassword(e.target.value)} className={inputStyle} /></div>
            <div><label htmlFor="confirm-password" className="mb-2 block text-sm text-white/70">Confirm password</label><input id="confirm-password" type="password" autoComplete="new-password" required minLength={12} maxLength={72} value={confirmation} onChange={e => setConfirmation(e.target.value)} className={inputStyle} /></div>
          </> : <div><label htmlFor="reset-email" className="mb-2 flex items-center gap-2 text-sm text-white/70"><Mail size={15} />Email address</label><input id="reset-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} className={inputStyle} placeholder="you@example.com" /></div>}
          {error && <p role="alert" className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm leading-5 text-red-200">{error}</p>}
          <button disabled={busy || (reset && !token)} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-medium text-black disabled:opacity-40">{busy ? "Please wait…" : reset ? "Update password" : "Send reset link"}<ArrowRight size={16} /></button>
          {reset && <Link href="/app/forgot-password" className="block text-center text-sm text-white/70 underline">Request a new reset link</Link>}
        </form>}
      </section>
      <Link href="/app/login" className="mt-6 flex min-h-11 items-center justify-center gap-2 text-sm text-white/60"><ArrowLeft size={15} />Back to sign in</Link>
    </div>
  </main>;
}
