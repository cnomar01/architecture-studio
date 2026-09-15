"use client";

import { useEffect, useState } from "react";
import { Bell, Building2, Check, Clock3, Globe2, RotateCcw, Settings2, SlidersHorizontal } from "lucide-react";
import PermissionGuard from "@/lib/core/PermissionGuard";
import { getStudioSettings, resetStudioSettings, StudioSettings, updateStudioSettings } from "@/lib/core/settingsStore";

export default function SettingsPage() {
  return (
    <PermissionGuard permission="team.manage">
      <SettingsContent />
    </PermissionGuard>
  );
}

function SettingsContent() {
  const [settings, setSettings] = useState<StudioSettings>(getStudioSettings());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSettings(getStudioSettings());
  }, []);

  function save(patch: Partial<StudioSettings>) {
    setSettings(updateStudioSettings(patch));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  function reset() {
    setSettings(resetStudioSettings());
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <main className="min-h-screen bg-[#111111] px-6 py-10 text-white lg:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end">
          <div>
            <p className="text-[9px] uppercase tracking-[0.28em] text-white/30">System Administration</p>
            <h1 className="mt-3 text-3xl font-light tracking-tight">Studio Settings</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/40">Workspace defaults and notification preferences for the Mason & Arc Studio OS.</p>
          </div>
          <div className="flex items-center gap-2">
            {saved && <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-white/45"><Check size={13} /> Saved</span>}
            <button onClick={reset} className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.16em] text-white/50 hover:bg-white/[0.05] hover:text-white"><RotateCcw size={13} /> Reset</button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Section icon={<Building2 size={16} />} title="Workspace">
            <Field label="Studio name">
              <input value={settings.studioName} onChange={(e) => save({ studioName: e.target.value })} className={inputClass} />
            </Field>
            <Field label="Default currency">
              <select value={settings.defaultCurrency} onChange={(e) => save({ defaultCurrency: e.target.value as StudioSettings["defaultCurrency"] })} className={inputClass}>
                <option value="EGP">EGP — Egyptian Pound</option><option value="USD">USD — US Dollar</option><option value="EUR">EUR — Euro</option>
              </select>
            </Field>
          </Section>

          <Section icon={<Clock3 size={16} />} title="Working time">
            <Field label="Week starts on">
              <select value={settings.weekStartsOn} onChange={(e) => save({ weekStartsOn: e.target.value as StudioSettings["weekStartsOn"] })} className={inputClass}>
                <option>Saturday</option><option>Sunday</option><option>Monday</option>
              </select>
            </Field>
            <Field label="Working hours">
              <input value={settings.workingHours} onChange={(e) => save({ workingHours: e.target.value })} className={inputClass} />
            </Field>
          </Section>

          <Section icon={<Globe2 size={16} />} title="Regional">
            <Field label="Timezone">
              <input value={settings.timezone} onChange={(e) => save({ timezone: e.target.value })} className={inputClass} />
            </Field>
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-[10px] text-white/30">These settings are stored locally in this prototype workspace.</div>
          </Section>

          <Section icon={<Bell size={16} />} title="Notifications">
            <Toggle label="Email alerts" description="Allow the workspace to use email-alert preferences." checked={settings.emailAlerts} onChange={(checked) => save({ emailAlerts: checked })} />
            <Toggle label="Browser alerts" description="Enable in-app/browser notification preferences." checked={settings.browserAlerts} onChange={(checked) => save({ browserAlerts: checked })} />
            <Toggle label="Auto refresh" description="Keep live dashboard data refreshed automatically." checked={settings.autoRefresh} onChange={(checked) => save({ autoRefresh: checked })} />
          </Section>
        </div>

        <section className="mt-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-center gap-3"><Settings2 size={17} className="text-white/40" /><div><h2 className="text-sm font-medium">System controls</h2><p className="mt-1 text-[10px] text-white/25">Configuration is intentionally lightweight in this local-first OS prototype.</p></div></div>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <Info icon={<SlidersHorizontal size={14} />} label="Workspace defaults" value="Active" />
            <Info icon={<Bell size={14} />} label="Alert preferences" value={settings.browserAlerts ? "Enabled" : "Disabled"} />
            <Info icon={<Clock3 size={14} />} label="Auto refresh" value={settings.autoRefresh ? "Enabled" : "Disabled"} />
          </div>
        </section>
      </div>
    </main>
  );
}

const inputClass = "mt-2 w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-xs text-white/70 outline-none transition focus:border-white/25";

function Section({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return <section className="rounded-2xl border border-white/10 bg-white/[0.02] p-6"><div className="flex items-center gap-3"><span className="text-white/40">{icon}</span><h2 className="text-sm font-medium">{title}</h2></div><div className="mt-6 space-y-5">{children}</div></section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="text-[9px] uppercase tracking-[0.16em] text-white/25">{label}</span>{children}</label>;
}

function Toggle({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <button type="button" onClick={() => onChange(!checked)} className="flex w-full items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4 text-left hover:bg-white/[0.04]"><span><span className="block text-xs text-white/60">{label}</span><span className="mt-1 block text-[10px] text-white/25">{description}</span></span><span className={`flex h-5 w-9 items-center rounded-full border border-white/10 p-0.5 transition ${checked ? "bg-white/20" : "bg-white/[0.03]"}`}><span className={`h-3.5 w-3.5 rounded-full bg-white/70 transition ${checked ? "translate-x-3.5" : "translate-x-0"}`} /></span></button>;
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-xl border border-white/5 p-4"><div className="flex items-center gap-2 text-white/30">{icon}<span className="text-[9px] uppercase tracking-[0.15em]">{label}</span></div><p className="mt-3 text-xs text-white/60">{value}</p></div>;
}
