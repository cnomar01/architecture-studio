"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import {
  addProjectDecision,
  getProjectDecisions,
  ProjectDecision,
  updateDecision,
} from "../projectStore";

export default function DecisionsPage() {
  const [decisions, setDecisions] = useState<ProjectDecision[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] =
    useState<ProjectDecision["category"]>("Design");
  const [decision, setDecision] = useState("");
  const [responsible, setResponsible] = useState("Omar Mohamed");

  useEffect(() => {
    setDecisions(getProjectDecisions());
  }, []);

  function createDecision() {
    if (!title.trim() || !decision.trim()) return;

    const newDecision = addProjectDecision({
      title: title.trim(),
      description: description.trim(),
      category,
      decision: decision.trim(),
      responsible,
      date: new Date().toISOString().split("T")[0],
      status: "Decided",
    });

    setDecisions((current) => [
      newDecision,
      ...current,
    ]);

    setTitle("");
    setDescription("");
    setDecision("");
    setResponsible("Omar Mohamed");
    setShowForm(false);
  }

  function markOpen(id: string) {
    const updated = updateDecision(id, {
      status: "Open",
    });

    setDecisions(updated);
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-[1200px] px-5 py-8 md:px-8 lg:px-10">

        <Link
          href="/app/admin/projects/city-edge-mall"
          className="inline-flex items-center gap-2 text-xs text-white/35 hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to Project
        </Link>

        <div className="mt-8 flex flex-col gap-5 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/30">
              City Edge Mall
            </p>

            <h1 className="mt-2 text-3xl font-light">
              Decision Log
            </h1>

            <p className="mt-3 text-sm text-white/30">
              A permanent record of important project decisions.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-xs font-medium text-black hover:bg-white/90"
          >
            <Plus size={15} />
            {showForm ? "Close" : "New Decision"}
          </button>

        </div>

        {showForm && (
          <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-6">

            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="Decision Title"
                value={title}
                onChange={setTitle}
                placeholder="e.g. Ground Floor Entrance Revision"
              />

              <div>
                <label className="text-[9px] uppercase tracking-wider text-white/30">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value as ProjectDecision["category"]
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-xs text-white outline-none"
                >
                  <option value="Design">Design</option>
                  <option value="Site">Site</option>
                  <option value="Client">Client</option>
                  <option value="Technical">Technical</option>
                  <option value="Management">Management</option>
                </select>
              </div>

            </div>

            <div className="mt-5">
              <label className="text-[9px] uppercase tracking-wider text-white/30">
                Context
              </label>

              <textarea
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                rows={3}
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-xs text-white outline-none"
                placeholder="What happened or what required a decision?"
              />
            </div>

            <div className="mt-5">
              <label className="text-[9px] uppercase tracking-wider text-white/30">
                Decision
              </label>

              <textarea
                value={decision}
                onChange={(e) =>
                  setDecision(e.target.value)
                }
                rows={3}
                className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-xs text-white outline-none"
                placeholder="What was decided?"
              />
            </div>

            <div className="mt-5">
              <label className="text-[9px] uppercase tracking-wider text-white/30">
                Responsible
              </label>

              <select
                value={responsible}
                onChange={(e) =>
                  setResponsible(e.target.value)
                }
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-xs text-white outline-none md:max-w-md"
              >
                <option>Omar Mohamed</option>
                <option>Ahmed Shabaan</option>
              </select>
            </div>

            <div className="mt-6 flex gap-3">

              <button
                onClick={createDecision}
                className="rounded-xl bg-white px-5 py-3 text-xs font-medium text-black hover:bg-white/90"
              >
                Save Decision
              </button>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-white/10 px-5 py-3 text-xs text-white/40 hover:text-white"
              >
                Cancel
              </button>

            </div>

          </section>
        )}

        <section className="mt-8 space-y-3">

          {decisions.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-white/10 px-6 py-20 text-center">

              <p className="text-sm text-white/30">
                No decisions recorded yet.
              </p>

              <p className="mt-2 text-xs text-white/15">
                Start building the project's memory.
              </p>

            </div>

          ) : (

            decisions.map((item) => (

              <article
                key={item.id}
                className="rounded-2xl border border-white/10 bg-white/[0.025] p-6"
              >

                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                  <div>

                    <div className="flex flex-wrap items-center gap-3">

                      <h2 className="text-sm font-medium">
                        {item.title}
                      </h2>

                      <span className="rounded-full border border-white/10 px-2 py-1 text-[9px] text-white/35">
                        {item.category}
                      </span>

                    </div>

                    <p className="mt-2 text-[10px] text-white/25">
                      {item.id} · {item.date} · {item.responsible}
                    </p>

                  </div>

                  {item.status === "Decided" ? (

                    <span className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-emerald-300">
                      <CheckCircle2 size={13} />
                      Decided
                    </span>

                  ) : (

                    <button
                      onClick={() => markOpen(item.id)}
                      className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-yellow-300"
                    >
                      <Clock3 size={13} />
                      Open
                    </button>

                  )}

                </div>

                {item.description && (
                  <div className="mt-5">
                    <p className="text-[9px] uppercase tracking-wider text-white/20">
                      Context
                    </p>

                    <p className="mt-2 text-xs leading-6 text-white/40">
                      {item.description}
                    </p>
                  </div>
                )}

                <div className="mt-5 border-t border-white/5 pt-5">

                  <p className="text-[9px] uppercase tracking-wider text-white/20">
                    Decision
                  </p>

                  <p className="mt-2 text-sm leading-6 text-white/65">
                    {item.decision}
                  </p>

                </div>

              </article>

            ))

          )}

        </section>

      </div>
    </main>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label>
      <div className="mb-2 text-[9px] uppercase tracking-wider text-white/30">
        {label}
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-xs text-white outline-none placeholder:text-white/20 focus:border-white/25"
      />
    </label>
  );
}