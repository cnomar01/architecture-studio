"use client";

import { FormEvent, useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to send your inquiry.");
      form.reset();
      setStatus("success");
      setMessage("Thank you. We’ll get back to you shortly.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send your inquiry.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-16 border-t border-neutral-300 pt-8 text-neutral-900">
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="grid gap-8 md:grid-cols-2">
        <Field name="name" label="Name" required />
        <Field name="email" label="Email" type="email" required />
        <Field name="phone" label="Phone" type="tel" />
        <Field name="company" label="Company" />
      </div>
      <label className="mt-8 block">
        <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-500">Project / Inquiry</span>
        <textarea name="notes" required rows={5} className="mt-3 w-full resize-y border-b border-neutral-300 bg-transparent px-0 py-3 text-sm font-light text-neutral-900 outline-none placeholder:text-neutral-500 focus:border-neutral-900" placeholder="Tell us briefly about your project, scope, location, or what you need." />
      </label>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p aria-live="polite" className={`text-xs ${status === "error" ? "text-red-600" : "text-neutral-500"}`}>{message}</p>
        <button disabled={status === "sending"} type="submit" className="inline-flex items-center justify-center rounded-full border border-neutral-900 px-7 py-3 text-[9px] uppercase tracking-[0.25em] text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white disabled:cursor-wait disabled:opacity-50">
          {status === "sending" ? "Sending…" : "Send Inquiry ↗"}
        </button>
      </div>
    </form>
  );
}

function Field({ name, label, type = "text", required = false }: { name: string; label: string; type?: string; required?: boolean }) {
  return (
    <label className="block">
      <span className="text-[9px] uppercase tracking-[0.3em] text-neutral-500">{label}{required ? " *" : ""}</span>
      <input name={name} type={type} required={required} className="mt-3 w-full border-b border-neutral-300 bg-transparent px-0 py-3 text-sm font-light text-neutral-900 outline-none placeholder:text-neutral-500 focus:border-neutral-900" />
    </label>
  );
}
