"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import SecondaryLogo from "@/components/shared/SecondaryLogo";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-black px-6 text-white">
      <div className="max-w-xl text-center">
        <SecondaryLogo title="Mason & Arc" className="mx-auto mb-4 h-8 w-8 text-white/50" />
        <h1 className="font-[var(--font-display)] text-5xl uppercase leading-none sm:text-7xl">Something went wrong</h1>
        <p className="mt-6 text-sm leading-7 text-white/60">The page could not be loaded. Please try again.</p>
        <button onClick={() => reset()} className="mt-8 border border-white/30 px-6 py-3 text-[11px] uppercase tracking-[0.25em] transition-opacity hover:opacity-60">Try again</button>
      </div>
    </main>
  );
}
