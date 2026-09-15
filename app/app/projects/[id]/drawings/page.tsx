import Link from "next/link";

const drawings = [
  {
    number: "A-101",
    name: "Ground Floor Plan",
    type: "Architectural",
    status: "Latest",
    date: "10 Sep 2026",
  },
  {
    number: "A-102",
    name: "First Floor Plan",
    type: "Architectural",
    status: "Latest",
    date: "10 Sep 2026",
  },
  {
    number: "A-201",
    name: "North Elevation",
    type: "Elevation",
    status: "Review",
    date: "08 Sep 2026",
  },
  {
    number: "A-202",
    name: "South Elevation",
    type: "Elevation",
    status: "Review",
    date: "08 Sep 2026",
  },
];

export default async function DrawingsPage({
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
            Drawings
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-white/40">
            Architectural drawings and technical documentation for your
            project.
          </p>

          <div className="mt-16 overflow-hidden rounded-2xl border border-white/10">
            {drawings.map((drawing, index) => (
              <div
                key={drawing.number}
                className="group border-b border-white/10 p-6 last:border-b-0 hover:bg-white/[0.04] md:p-8"
              >
                <div className="grid gap-5 md:grid-cols-[80px_1fr_160px_120px_30px] md:items-center">
                  <span className="text-xs text-white/25">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                      {drawing.number} · {drawing.type}
                    </p>

                    <h2 className="mt-2 text-lg font-light">
                      {drawing.name}
                    </h2>
                  </div>

                  <span className="text-xs text-white/40">
                    {drawing.date}
                  </span>

                  <span className="text-xs uppercase tracking-[0.15em] text-white/40">
                    {drawing.status}
                  </span>

                  <span className="text-white/30 transition group-hover:translate-x-1 group-hover:text-white">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}