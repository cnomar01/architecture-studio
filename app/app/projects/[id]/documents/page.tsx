import Link from "next/link";

const documents = [
  {
    name: "Project Brief",
    type: "PDF",
    size: "2.4 MB",
    date: "02 Sep 2026",
  },
  {
    name: "Material Schedule",
    type: "PDF",
    size: "1.8 MB",
    date: "06 Sep 2026",
  },
  {
    name: "Project Timeline",
    type: "PDF",
    size: "1.2 MB",
    date: "08 Sep 2026",
  },
  {
    name: "Design Development Package",
    type: "PDF",
    size: "8.6 MB",
    date: "10 Sep 2026",
  },
];

export default async function DocumentsPage({
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
            Documents
          </h1>

          <div className="mt-16 overflow-hidden rounded-2xl border border-white/10">
            {documents.map((document, index) => (
              <button
                type="button"
                key={document.name}
                className="group w-full border-b border-white/10 p-6 text-left last:border-b-0 hover:bg-white/[0.04] md:p-8"
              >
                <div className="grid gap-4 md:grid-cols-[60px_1fr_100px_120px_30px] md:items-center">
                  <span className="text-xs text-white/25">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h2 className="font-light">{document.name}</h2>

                    <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/30">
                      {document.type}
                    </p>
                  </div>

                  <span className="text-xs text-white/30">
                    {document.size}
                  </span>

                  <span className="text-xs text-white/30">
                    {document.date}
                  </span>

                  <span className="text-white/30 group-hover:text-white">
                    ↓
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}