const nextSteps = [
  {
    title: "Test database backup and restore",
    status: "Ready to complete",
    detail:
      "Error monitoring is live. The remaining check is a safe backup-and-restore drill; this can use a free local backup workflow.",
    cost: "Free",
  },
  {
    title: "Secure office AI access from the hosted site",
    status: "External DNS prerequisite",
    detail:
      "Ollama and ComfyUI already auto-start locally. A free Cloudflare Tunnel is possible after masonandarc.com is added as a Cloudflare zone and its DNS is pointed there.",
    cost: "Free, but needs DNS access",
  },
  {
    title: "Finish Google Drive shared file uploads",
    status: "Integration in progress",
    detail:
      "Google Drive OAuth and the Mason & Arc Projects root folder are connected. The remaining work is wiring project file and site-photo uploads to the project Drive folders and saving their Drive references in the shared database.",
    cost: "Free",
  },
  {
    title: "Automated WhatsApp messages",
    status: "Not enabled",
    detail:
      "Direct office WhatsApp remains available. Automation needs a Meta Developer App, WhatsApp Business credentials and may charge per message or conversation.",
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
          Google Calendar connection and Google Drive authorization are
          intentionally hidden here. This page lists only open work.
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
            Finish the Google Drive upload workflow and test
            backup/restore. Keep WhatsApp automation disabled unless you
            later accept its billing terms. The office AI remains fully
            available on the office computer without any paid provider.
          </p>
        </div>
      </div>
    </main>
  );
}
