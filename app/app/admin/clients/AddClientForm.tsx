"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

export default function AddClientForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [createdId, setCreatedId] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const firstName = String(form.get("firstName") || "").trim();
    const lastName = String(form.get("lastName") || "").trim();
    const email = String(form.get("email") || "").trim().toLowerCase();
    const id = `CLI-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
    const response = await fetch("/api/data/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        id,
        code: id,
        name: `${firstName} ${lastName}`.trim(),
        company: String(form.get("company") || "").trim() || null,
        contact_name: `${firstName} ${lastName}`.trim(),
        contact_email: email || null,
        contact_phone: String(form.get("phone") || "").trim() || null,
        address: String(form.get("location") || "").trim() || null,
        notes: String(form.get("notes") || "").trim(),
        active: true,
      }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "Could not create the client. Please try again.");
      return;
    }
    setCreatedId(data.data?.id || id);
    setSubmitted(true);
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-6 py-6 md:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/app/admin">
            <img
              src="/images/logo-mason-arc.png"
              alt="Mason & Arc"
              className="h-8 w-auto object-contain"
            />
          </Link>

          <Link
            href="/app/admin/clients"
            className="text-xs uppercase tracking-[0.18em] text-white/40 transition hover:text-white"
          >
            ← Clients
          </Link>
        </div>
      </header>

      {/* Form */}
      <section className="px-6 pb-32 pt-16 md:px-10 md:pt-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/30">
            Client Management
          </p>

          <h1 className="mt-5 text-5xl font-light tracking-[-0.055em] md:text-7xl">
            Add Client
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-6 text-white/40">
            Create a new client profile and prepare their access to the Mason
            & Arc Client Portal.
          </p>

          {submitted ? (
            <div className="mt-16 rounded-2xl border border-white/10 p-8 md:p-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-xl">
                ✓
              </div>

              <h2 className="mt-8 text-2xl font-light">
                Client created
              </h2>

              <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
                The client profile is saved in the shared studio database and
                can now be linked to a project.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={createdId ? `/app/admin/clients/${createdId}` : "/app/admin/clients"}
                  className="rounded-full bg-white px-6 py-3 text-[10px] uppercase tracking-[0.18em] text-black transition hover:bg-white/80"
                >
                  Back to Clients
                </Link>

                <button
                  type="button"
                  onClick={() => { setSubmitted(false); setError(""); setCreatedId(""); }}
                  className="rounded-full border border-white/15 px-6 py-3 text-[10px] uppercase tracking-[0.18em] text-white/50 transition hover:border-white/40 hover:text-white"
                >
                  Add Another
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-16 space-y-10">
              {/* Personal Information */}
              <div>
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                    01
                  </p>

                  <h2 className="mt-2 text-xl font-light">
                    Personal Information
                  </h2>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <Field
                    label="First Name"
                    name="firstName"
                    placeholder="Ahmed"
                    required
                  />

                  <Field
                    label="Last Name"
                    name="lastName"
                    placeholder="Hassan"
                    required
                  />

                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="ahmed@example.com"
                    required
                  />

                  <Field
                    label="Phone"
                    name="phone"
                    type="tel"
                    placeholder="+20 100 000 0000"
                  />
                </div>
              </div>

              {/* Client Details */}
              <div>
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                    02
                  </p>

                  <h2 className="mt-2 text-xl font-light">
                    Client Details
                  </h2>
                </div>

                <div className="space-y-5">
                  <Field
                    label="Company / Client Type"
                    name="company"
                    placeholder="Private Client"
                  />

                  <Field
                    label="Location"
                    name="location"
                    placeholder="New Cairo, Egypt"
                  />

                  <div>
                    <label
                      htmlFor="notes"
                      className="mb-3 block text-[10px] uppercase tracking-[0.18em] text-white/30"
                    >
                      Notes
                    </label>

                    <textarea
                      id="notes"
                      name="notes"
                      placeholder="Additional information..."
                      className="min-h-32 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/30"
                    />
                  </div>
                </div>
              </div>

              {/* Portal Access */}
              <div>
                <div className="mb-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
                    03
                  </p>

                  <h2 className="mt-2 text-xl font-light">
                    Portal Access
                  </h2>
                </div>

                <div className="rounded-2xl border border-white/10 p-6 md:p-8">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 h-2 w-2 rounded-full bg-white" />

                    <div>
                      <p className="text-sm text-white/70">
                        Client Portal Access
                      </p>

                      <p className="mt-2 text-xs leading-5 text-white/35">
                        The client will eventually receive a secure invitation
                        to create their password and access their projects.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="border-t border-white/10 pt-8">
                {error && <p role="alert" className="mb-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[10px] leading-5 text-white/25">
                    This saves immediately to the shared studio database.
                  </p>

                  <button
                    type="submit"
                    className="h-14 rounded-xl bg-white px-8 text-[10px] uppercase tracking-[0.18em] text-black transition hover:bg-white/80"
                  >
                    Create Client
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 px-6 py-8 md:px-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-[9px] uppercase tracking-[0.25em] text-white/20">
            Mason & Arc
          </span>

          <span className="text-[9px] uppercase tracking-[0.25em] text-white/20">
            Client Management
          </span>
        </div>
      </footer>
    </main>
  );
}

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-3 block text-[10px] uppercase tracking-[0.18em] text-white/30"
      >
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-white/30"
      />
    </div>
  );
}
