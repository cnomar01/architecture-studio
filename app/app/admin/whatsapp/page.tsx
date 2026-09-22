"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowLeft, ExternalLink, MessageCircle } from "lucide-react";

const templates = {
  "Project update":
    "Hello, this is Mason & Arc. We have a project update ready for you. Please let us know a suitable time if you would like to review it together.",
  "Site visit":
    "Hello, this is Mason & Arc. We are confirming the upcoming site visit. Please let us know if there are any access notes or items you want us to review on site.",
  "Meeting follow-up":
    "Hello, this is Mason & Arc. Thank you for your time today. We are following up on the meeting and will proceed with the agreed next steps.",
  "Document ready":
    "Hello, this is Mason & Arc. The requested project document is ready. Please let us know if you need any clarification or an additional revision.",
} as const;

function normalizePhone(value: string) {
  return value.replace(/[^0-9]/g, "");
}

export default function ManualWhatsAppPage() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(
    templates["Project update"]
  );
  const [template, setTemplate] =
    useState<keyof typeof templates>("Project update");
  const [error, setError] = useState("");

  const normalized = useMemo(
    () => normalizePhone(phone),
    [phone]
  );

  const url = useMemo(() => {
    if (!normalized || !message.trim()) return "";
    return `https://wa.me/${normalized}?text=${encodeURIComponent(
      message.trim()
    )}`;
  }, [normalized, message]);

  function openWhatsApp() {
    setError("");

    if (!/^[1-9][0-9]{7,14}$/.test(normalized)) {
      setError(
        "Enter the international WhatsApp number including country code, without a leading +."
      );
      return;
    }

    if (!message.trim()) {
      setError("Enter a message first.");
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="min-h-screen bg-[#f6f6f4] px-4 py-8 text-[#111] md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/app/admin/settings"
          className="inline-flex items-center gap-2 text-sm text-black/50 hover:text-black"
        >
          <ArrowLeft size={15} />
          Back to Settings
        </Link>

        <header className="mt-8">
          <p className="text-xs uppercase tracking-[0.25em] text-black/40">
            Mason & Arc / Communication
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            Manual WhatsApp
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
            Prepare a client message for free using WhatsApp Click to
            Chat. The message opens in WhatsApp and is only sent when a
            person presses Send.
          </p>
        </header>

        {error && (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <section className="mt-8 rounded-2xl border border-black/10 bg-white p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label>
              <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                Recipient WhatsApp
              </span>
              <input
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="2010XXXXXXXX"
                inputMode="tel"
                className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm outline-none focus:border-black/30"
              />
              <span className="mt-2 block text-xs text-black/40">
                Include country code. Example for Egypt: 20...
              </span>
            </label>

            <label>
              <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
                Template
              </span>
              <select
                value={template}
                onChange={(event) => {
                  const next =
                    event.target.value as keyof typeof templates;
                  setTemplate(next);
                  setMessage(templates[next]);
                }}
                className="w-full rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm"
              >
                {Object.keys(templates).map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-xs font-medium uppercase tracking-wider text-black/45">
              Message
            </span>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={7}
              maxLength={4096}
              className="w-full resize-y rounded-xl border border-black/10 bg-[#fafafa] px-4 py-3 text-sm leading-6 outline-none focus:border-black/30"
            />
            <span className="mt-2 block text-right text-xs text-black/35">
              {message.length}/4096
            </span>
          </label>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-black/45">
              <MessageCircle size={15} />
              No Meta API or paid messaging service is used.
            </div>

            <button
              type="button"
              onClick={openWhatsApp}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-5 py-3 text-sm font-medium text-white"
            >
              Open WhatsApp
              <ExternalLink size={14} />
            </button>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-black/10 bg-white p-5 text-sm leading-6 text-black/55">
          Automated WhatsApp sending remains separate and disabled unless
          you later configure and approve the official WhatsApp Business
          API. This page is manual and free.
        </section>
      </div>
    </main>
  );
}
