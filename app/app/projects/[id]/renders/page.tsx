import Link from "next/link";

const renders = [
  {
    name: "Exterior — Day",
    type: "Exterior",
    date: "10 Sep 2026",
  },
  {
    name: "Living Room",
    type: "Interior",
    date: "08 Sep 2026",
  },
  {
    name: "Master Bedroom",
    type: "Interior",
    date: "08 Sep 2026",
  },
  {
    name: "Garden View",
    type: "Exterior",
    date: "05 Sep 2026",
  },
];

export default async function RendersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <header className="flex items-center justify-between px-6 py-6 md:px-10">
        <Link
          href={`/app/projects/${id}`}
          className="text-xs uppercase tracking-[0.18em] text-white/50 hover:text-white"
        >
          ← Project
        </Link>

        <Link href="/app">
          <img
            src="/images/logo-mason-arc.png"
            alt="Mason & Arc"
            className="h-8 w-auto"
          />
        </Link>

        <span className="w-10" />
      </header>

      <section className="px-6 pb-32 pt-16 md:px-10 md:pt-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
            Project Resources
          </p>

          <h1 className="mt-5 text-5xl font-light tracking-[-0.05em] md:text-7xl">
            Renders
          </h1>

          <div className="mt-16 grid gap-4 md:grid-cols-2">
            {renders.map((render, index) => (
              <button
                type="button"
                key={render.name}
                className="group aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] text-left transition hover:border-white/25"
              >
                <div className="flex h-full flex-col justify-between p-6 md:p-8">
                  <div className="flex justify-between">
                    <span className="text-[10px] text-white/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="text-[10px] uppercase tracking-[0.15em] text-white/30">
                      {render.type}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-light">
                      {render.name}
                    </h2>

                    <p className="mt-2 text-xs text-white/30">
                      {render.date}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}