const nextSteps = [
  {
    title: "Run a safe backup and restore drill",
    status: "Ready to test",
    detail:
      "Backups are now verified after creation, and restore is blocked from using the production DATABASE_URL. Set RESTORE_DATABASE_URL to a disposable database, create a backup, then run the restore drill once.",
    cost: "Free",
  },
  {
    title: "Verify Google Drive uploads in production",
    status: "One live test",
    detail:
      "Admin files, engineer files, site photos, models, renders, reports, contracts and deliverables are wired to Google Drive. Upload one real file and one site photo in production, then confirm both appear in the correct project folders.",
    cost: "Free",
  },
  {
    title: "Connect the Office AI Cloudflare Tunnel",
    status: "External DNS prerequisite",
    detail:
      "The local Office AI bridge and tunnel launcher are ready. The remaining external step is creating the named Cloudflare Tunnel, setting OFFICE_AI_TUNNEL_TOKEN on the office computer, pointing a hostname at it, and setting the hosted OFFICE_AI_BRIDGE_URL.",
    cost: "Free, but needs DNS access",
  },
  {
    title: "Automated WhatsApp messages",
    status: "Optional",
    detail:
      "Free manual WhatsApp Click to Chat is ready in Settings. Official automated sending remains disabled and only needs to be configured later if you want Meta WhatsApp Business automation.",
    cost: "Potentially paid",
  },
];

export default function CompletenessPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black lg:px-12">
      <div className="mx-auto max-w-5xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
          Mason & Arc / Remaining work
        </p>

        <h1 className="mt-3 text-4xl font-medium">
          What still needs attention
        </h1>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-black/60">
          Completed production setup, AI governance, Sentry monitoring,
          Google Calendar authorization, Google Drive folder automation,
          shared file-upload code and free manual WhatsApp are intentionally
          hidden here. This page lists only checks or external setup that
          still need attention.
        </p>

        <div className="mt-8 grid gap-4">
          {nextSteps.map((item) => (
            <section
              key={item.title}
              className="rounded-xl border border-black/10 p-6"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-medium">{item.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-black/65">
                    {item.detail}
                  </p>
                </div>

                <div className="shrink-0 text-xs">
                  <p className="rounded-full bg-black px-3 py-1.5 text-white">
                    {item.status}
                  </p>
                  <p className="mt-2 text-right text-black/45">
                    {item.cost}
                  </p>
                </div>
              </div>
            </section>
          ))}
        </div>

        <div className="mt-6 rounded-xl bg-black p-6 text-white">
          <p className="text-sm font-medium">No-cost path</p>
          <p className="mt-2 text-sm leading-6 text-white/70">
            Do the two production checks first: one Google Drive upload
            test and one restore drill against a disposable database. The
            only remaining external setup after that is the Cloudflare
            Tunnel/DNS step. WhatsApp can stay manual and free.
          </p>
        </div>
      </div>
    </main>
  );
}
