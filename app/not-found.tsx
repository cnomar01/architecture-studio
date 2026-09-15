export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
      <div className="max-w-2xl text-center">
        <p className="mb-5 text-[10px] uppercase tracking-[0.35em] text-white/50">Mason & Arc</p>
        <p className="text-xs uppercase tracking-[0.3em] text-white/40">404</p>
        <h1 className="mt-4 font-[var(--font-display)] text-5xl uppercase leading-[0.9] sm:text-7xl">Page not found</h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-white/60">The page you are looking for does not exist or has moved.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="/" className="border border-white/30 px-6 py-3 text-[11px] uppercase tracking-[0.25em] transition-opacity hover:opacity-60">Back home</a>
          <a href="/projects" className="border border-white/15 px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-white/70 transition-opacity hover:opacity-60">View projects</a>
        </div>
      </div>
    </main>
  );
}
