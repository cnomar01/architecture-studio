const nextSteps = [
  { title: "Connect Google Calendar", status: "One click needed", detail: "The API, OAuth callback and encrypted database storage are ready. In Settings, choose Connect Calendar and approve the studio account.", cost: "Free" },
  { title: "Test database backup and restore", status: "Ready to complete", detail: "Error monitoring is live. The remaining check is a safe backup-and-restore drill; this can use a free local backup workflow.", cost: "Free" },
  { title: "Retire or migrate legacy screens", status: "Code work remaining", detail: "The optional local calendar, forecast and archived project tools need to be moved to the database or removed from navigation.", cost: "Free" },
  { title: "Secure office AI access from the hosted site", status: "External DNS prerequisite", detail: "Ollama and ComfyUI already auto-start locally. A free Cloudflare Tunnel is possible after masonandarc.com is added as a Cloudflare zone and its DNS is pointed there.", cost: "Free, but needs DNS access" },
  { title: "Large shared file storage", status: "Not enabled", detail: "R2 requires activating a billing profile, even with a free allowance and possible overage. Small files remain in the existing database; do not activate R2 if no paid risk is acceptable.", cost: "Potentially paid" },
  { title: "Automated WhatsApp messages", status: "Not enabled", detail: "Direct office WhatsApp remains available. Automation needs a Meta Developer App, WhatsApp Business credentials and may charge per message or conversation.", cost: "Potentially paid" },
];

export default function CompletenessPage() {
  return <main className="min-h-screen bg-white px-6 py-10 text-black lg:px-12"><div className="mx-auto max-w-5xl">
    <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">Mason & Arc / Remaining work</p>
    <h1 className="mt-3 text-4xl font-medium">What still needs attention</h1>
    <p className="mt-3 max-w-3xl text-sm leading-6 text-black/60">Completed production, AI governance, Sentry monitoring, Calendar API setup and database workflows are intentionally hidden here. This page lists only open work.</p>
    <div className="mt-8 grid gap-4">{nextSteps.map((item) => <section key={item.title} className="rounded-xl border border-black/10 p-6"><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="font-medium">{item.title}</h2><p className="mt-2 text-sm leading-6 text-black/65">{item.detail}</p></div><div className="shrink-0 text-xs"><p className="rounded-full bg-black px-3 py-1.5 text-white">{item.status}</p><p className="mt-2 text-right text-black/45">{item.cost}</p></div></div></section>)}</div>
    <div className="mt-6 rounded-xl bg-black p-6 text-white"><p className="text-sm font-medium">No-cost path</p><p className="mt-2 text-sm leading-6 text-white/70">Finish Calendar connection, test backup/restore, and migrate or retire the legacy screens. Keep R2 and WhatsApp automation disabled unless you later accept their billing terms. The office AI remains fully available on the office computer without any paid provider.</p></div>
  </div></main>;
}
