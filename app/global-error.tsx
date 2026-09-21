"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-black text-white">
        <main className="flex min-h-screen items-center justify-center px-6">
          <div className="max-w-xl text-center">
            <p className="mb-4 text-[10px] uppercase tracking-[0.35em] text-white/50">Mason & Arc</p>
            <h1 className="font-sans text-4xl uppercase sm:text-6xl">Unexpected error</h1>
            <button onClick={() => reset()} className="mt-8 border border-white/30 px-6 py-3 text-[11px] uppercase tracking-[0.25em]">Reload</button>
          </div>
        </main>
      </body>
    </html>
  );
}
