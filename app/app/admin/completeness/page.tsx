export default function CompletenessPage() {
  const shared = [
    "Postgres database, migrations, secure sessions and sign-in rate limits",
    "Password reset with one-time expiring tokens",
    "Clients, projects, finance and team records shared from the database",
    "Dashboard, Finance Snapshot, Intelligence and Reports share one live database overview",
    "Files, revisions, transmittals and document metadata shared from the database",
    "Approvals, project messages, notifications, audit, site reports, construction and timesheets are shared",
    "Public project imagery, multilingual content and project story sections are managed from the website CMS",
    "CRM, contracts, procurement, QA/QC and HSE records with Create / Edit / Delete",
    "Server-side authorization and audit foundation",
    "Production deployment, domain and SSL",
    "Gmail send-only authorization is saved",
    "Office AI autostart is configured; Ollama and ComfyUI run on the office computer",
    "Direct office WhatsApp link (+20 1044007555)",
  ];
  const remaining = [
    "Secure office-AI bridge: the hosted website cannot reach the office computer's localhost without a protected tunnel or cloud AI provider",
    "Shared S3 / R2 file storage for large files and independently verified upload/download permissions",
    "Calendar provider connection and automatic notification delivery",
    "WhatsApp automation: Meta Business / WhatsApp Cloud API setup is required and messages may incur fees",
    "Production error monitoring plus a tested backup-and-restore drill",
    "Migrate or retire optional legacy specialist screens such as calendar, forecast and archived project-specific tools",
    "AI audit trail, usage controls and model governance",
  ];

  return <main className="min-h-screen bg-white px-6 py-10 text-black lg:px-12"><div className="mx-auto max-w-6xl">
    <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">Mason & Arc / System Status</p>
    <h1 className="mt-3 text-4xl font-medium">What is finished — what remains</h1>
    <div className="mt-8 grid gap-6 lg:grid-cols-2"><section className="rounded-xl border border-black/10 p-6"><h2 className="font-medium">Shared production workflow</h2><div className="mt-5 space-y-3">{shared.map((item) => <div key={item} className="flex gap-3 text-sm"><span>✓</span><span>{item}</span></div>)}</div></section><section className="rounded-xl border border-black/10 p-6"><h2 className="font-medium">Still needs external setup or a remaining migration</h2><div className="mt-5 space-y-3">{remaining.map((item) => <div key={item} className="flex gap-3 text-sm"><span>○</span><span>{item}</span></div>)}</div></section></div>
    <div className="mt-6 rounded-xl bg-black p-6 text-white"><p className="text-sm font-medium">Current rollout status</p><p className="mt-2 text-sm leading-6 text-white/70">The primary studio workflows — dashboards, clients, projects, finance, approvals, messages, site work, files, transmittals and the Operations Hub — are now database-backed and shared across devices. Public portfolio updates and translations also flow from one CMS record. The remaining items require an external provider account, a secure office connection, or retirement of an optional legacy screen.</p></div>
  </div></main>;
}
