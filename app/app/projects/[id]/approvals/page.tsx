import Link from "next/link";

const approvals = [
  {
    title: "Ground Floor Plan",
    description: "Design Development — Revision 03",
    status: "Awaiting Approval",
  },
  {
    title: "Material Palette",
    description: "Interior materials and finishes",
    status: "Awaiting Approval",
  },
  {
    title: "Exterior Render",
    description: "Front elevation — Day view",
    status: "Approved",
  },
];

export default async function ApprovalsPage({
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
            Client Action
          </p>

          <h1 className="mt-5 text-5xl font-light tracking-[-0.05em] md:text-7xl">
            Approvals
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-white/40">
            Review project items and provide your approval when required.
          </p>

          <div className="mt-16 space-y-3">
            {approvals.map((approval, index) => (
              <div
                key={approval.title}
                className="rounded-2xl border border-white/10 p-6 md:p-8"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex gap-5">
                    <span className="text-xs text-white/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <h2 className="text-xl font-light">
                        {approval.title}
                      </h2>

                      <p className="mt-2 text-xs text-white/35">
                        {approval.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase tracking-[0.15em] text-white/40">
                      {approval.status}
                    </span>

                    {approval.status === "Awaiting Approval" && (
                      <button
                        type="button"
                        className="rounded-full border border-white/20 px-5 py-3 text-[10px] uppercase tracking-[0.15em] transition hover:bg-white hover:text-black"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}