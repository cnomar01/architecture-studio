"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  FileText,
} from "lucide-react";

import {
  getClientById,
  updateClient,
  deleteClient,
  Client,
} from "@/lib/core/clientStore";

export default function EditClientPage() {
  const params = useParams();
  const router = useRouter();

  const clientId = String(params.id);

  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const foundClient = getClientById(clientId);

    if (!foundClient) {
      setLoading(false);
      return;
    }

    setClient(foundClient);
    setName(foundClient.name);
    setCompany(foundClient.company ?? "");
    setEmail(foundClient.email);
    setPhone(foundClient.phone);
    setAddress(foundClient.address ?? "");
    setStatus(foundClient.status);
    setNotes(foundClient.notes ?? "");

    setLoading(false);
  }, [clientId]);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (!client) return;

    if (!name.trim()) {
      alert("Client name is required.");
      return;
    }

    if (!email.trim()) {
      alert("Email is required.");
      return;
    }

    updateClient(client.id, {
      name: name.trim(),
      company: company.trim(),
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
      status,
      notes: notes.trim(),
    });

    router.push(`/app/admin/clients/${client.id}`);
  }

  function handleDelete() {
    if (!client) return;

    const confirmed = window.confirm(
      `Delete ${client.name}? This action cannot be undone.`
    );

    if (!confirmed) return;

    deleteClient(client.id);

    router.push("/app/admin/clients");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#080808] text-white">
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-sm text-white/40">Loading client...</p>
        </div>
      </main>
    );
  }

  if (!client) {
    return (
      <main className="min-h-screen bg-[#080808] text-white">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Link
            href="/app/admin/clients"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to Clients
          </Link>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10">
            <h1 className="text-2xl font-medium">Client Not Found</h1>
            <p className="mt-2 text-sm text-white/40">
              This client does not exist or may have been deleted.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <div className="mx-auto max-w-5xl px-6 py-10 lg:px-10">

        {/* Header */}
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link
              href={`/app/admin/clients/${client.id}`}
              className="mb-5 inline-flex items-center gap-2 text-sm text-white/40 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Client
            </Link>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                <User size={20} className="text-white/60" />
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                  Client Management
                </p>
                <h1 className="mt-1 text-3xl font-medium">
                  Edit Client
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/10"
            >
              <Trash2 size={16} />
              Delete
            </button>

            <button
              form="client-edit-form"
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-white/90"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>

        <form
          id="client-edit-form"
          onSubmit={handleSave}
          className="space-y-6"
        >
          {/* Basic Information */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                Basic Information
              </p>
              <h2 className="mt-2 text-lg font-medium">
                Client Details
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* Name */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-white/60">
                  <User size={15} />
                  Client Name
                </label>

                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Client name"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-white/30"
                />
              </div>

              {/* Company */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-white/60">
                  <Building2 size={15} />
                  Company
                </label>

                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company name"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-white/30"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-white/60">
                  <Mail size={15} />
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@email.com"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-white/30"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm text-white/60">
                  <Phone size={15} />
                  Phone
                </label>

                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+20 ..."
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-white/30"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "Active" | "Inactive")
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              {/* Client Code */}
              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Client Code
                </label>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/40">
                  {client.code}
                </div>
              </div>
            </div>
          </section>

          {/* Address */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                Contact
              </p>
              <h2 className="mt-2 text-lg font-medium">
                Address
              </h2>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-white/60">
                <MapPin size={15} />
                Address
              </label>

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Client address"
                rows={3}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-white/30"
              />
            </div>
          </section>

          {/* Notes */}
          <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-6">
              <p className="text-xs uppercase tracking-[0.2em] text-white/30">
                Internal
              </p>
              <h2 className="mt-2 text-lg font-medium">
                Notes
              </h2>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-2 text-sm text-white/60">
                <FileText size={15} />
                Internal Notes
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Internal notes about this client..."
                rows={5}
                className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-sm outline-none transition placeholder:text-white/20 focus:border-white/30"
              />
            </div>
          </section>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between border-t border-white/10 pt-6">
            <Link
              href={`/app/admin/clients/${client.id}`}
              className="text-sm text-white/40 transition hover:text-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}