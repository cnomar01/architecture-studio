"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BrainCircuit,
  Plus,
  Save,
  X,
} from "lucide-react";

import {
  getProjectDNA,
  saveProjectDNA,
  ProjectDNA,
} from "../projectStore";

export default function ProjectDNAPage() {
  const [dna, setDna] = useState<ProjectDNA | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setDna(getProjectDNA());
  }, []);

  if (!dna) {
    return (
      <main className="min-h-screen bg-[#090909] text-white" />
    );
  }

  function updateField<K extends keyof ProjectDNA>(
    key: K,
    value: ProjectDNA[K]
  ) {
    setDna((current) =>
      current
        ? {
            ...current,
            [key]: value,
          }
        : current
    );

    setSaved(false);
  }

  function updateList(
    key: "priorities" | "risks",
    index: number,
    value: string
  ) {
    setDna((current) => {
      if (!current) return current;

      const list = [...current[key]];
      list[index] = value;

      return {
        ...current,
        [key]: list,
      };
    });

    setSaved(false);
  }

  function addListItem(key: "priorities" | "risks") {
    setDna((current) => {
      if (!current) return current;

      return {
        ...current,
        [key]: [...current[key], ""],
      };
    });

    setSaved(false);
  }

  function removeListItem(
    key: "priorities" | "risks",
    index: number
  ) {
    setDna((current) => {
      if (!current) return current;

      return {
        ...current,
        [key]: current[key].filter(
          (_, i) => i !== index
        ),
      };
    });

    setSaved(false);
  }

  function save() {
    if (!dna) return;

    saveProjectDNA(dna);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 1800);
  }

  return (
    <main className="min-h-screen bg-[#090909] px-4 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/app/admin/projects/city-edge-mall"
          className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Project
        </Link>

        <header className="mt-8 border-b border-white/10 pb-8">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
              <BrainCircuit
                size={22}
                className="text-white/60"
              />
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-white/30">
                Project DNA
              </div>

              <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                {dna.projectName}
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-3xl text-sm leading-6 text-white/40">
            The permanent identity and memory of the project.
            Keep the project direction, priorities, risks and
            important notes in one place.
          </p>

        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">

          <InfoCard
            label="Project ID"
            value={dna.projectId}
          />

          <InfoCard
            label="Project Type"
            value={dna.projectType}
          />

          <InfoCard
            label="Location"
            value={dna.location}
          />

          <InfoCard
            label="Current Phase"
            value={dna.currentPhase}
          />

        </section>

        <div className="mt-8 space-y-5">

          <Section title="Project Identity">

            <div className="grid gap-5 md:grid-cols-2">

              <Input
                label="Project Name"
                value={dna.projectName}
                onChange={(value) =>
                  updateField("projectName", value)
                }
              />

              <Input
                label="Project Type"
                value={dna.projectType}
                onChange={(value) =>
                  updateField("projectType", value)
                }
              />

              <Input
                label="Location"
                value={dna.location}
                onChange={(value) =>
                  updateField("location", value)
                }
              />

              <Input
                label="Current Phase"
                value={dna.currentPhase}
                onChange={(value) =>
                  updateField("currentPhase", value)
                }
              />

            </div>

          </Section>

          <Section title="Project Description">

            <Textarea
              label="Description"
              value={dna.description}
              onChange={(value) =>
                updateField("description", value)
              }
              placeholder="Describe the project and its overall direction..."
            />

          </Section>

          <Section title="Priorities">

            <ListEditor
              items={dna.priorities}
              placeholder="Project priority..."
              emptyText="No priorities added yet."
              onChange={(index, value) =>
                updateList("priorities", index, value)
              }
              onAdd={() =>
                addListItem("priorities")
              }
              onRemove={(index) =>
                removeListItem("priorities", index)
              }
            />

          </Section>

          <Section title="Risks">

            <ListEditor
              items={dna.risks}
              placeholder="Project risk..."
              emptyText="No risks recorded yet."
              onChange={(index, value) =>
                updateList("risks", index, value)
              }
              onAdd={() =>
                addListItem("risks")
              }
              onRemove={(index) =>
                removeListItem("risks", index)
              }
            />

          </Section>

          <Section title="Project Notes">

            <Textarea
              label="Notes"
              value={dna.notes}
              onChange={(value) =>
                updateField("notes", value)
              }
              placeholder="Important project memory, context or notes..."
            />

          </Section>

        </div>

        <div className="mt-7 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">

          <div className="text-sm text-white/35">
            {saved
              ? "Project DNA saved successfully."
              : "Changes are stored locally."}
          </div>

          <button
            onClick={save}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-white/90"
          >
            <Save size={16} />
            Save Project DNA
          </button>

        </div>

      </div>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6">

      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      <div className="mt-5">
        {children}
      </div>

    </section>
  );
}

function InfoCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

      <div className="text-[9px] uppercase tracking-[0.18em] text-white/30">
        {label}
      </div>

      <div className="mt-3 text-sm font-medium text-white/75">
        {value || "—"}
      </div>

    </div>
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
  placeholder?: string;
}) {
  return (
    <label className="block">

      <div className="mb-2 text-[9px] uppercase tracking-[0.16em] text-white/30">
        {label}
      </div>

      <input
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/25"
      />

    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">

      <div className="mb-2 text-[9px] uppercase tracking-[0.16em] text-white/30">
        {label}
      </div>

      <textarea
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        rows={5}
        className="w-full resize-y rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-white/20 focus:border-white/25"
      />

    </label>
  );
}

function ListEditor({
  items,
  placeholder,
  emptyText,
  onChange,
  onAdd,
  onRemove,
}: {
  items: string[];
  placeholder: string;
  emptyText: string;
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div>

      {items.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 py-8 text-center text-xs text-white/25">
          {emptyText}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={`${index}-${item}`}
              className="flex gap-2"
            >

              <input
                value={item}
                onChange={(e) =>
                  onChange(index, e.target.value)
                }
                placeholder={placeholder}
                className="flex-1 rounded-xl border border-white/10 bg-[#111] px-4 py-3 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/25"
              />

              <button
                type="button"
                onClick={() => onRemove(index)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 text-white/30 hover:border-white/20 hover:text-white"
              >
                <X size={16} />
              </button>

            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={onAdd}
        className="mt-4 inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-xs text-white/50 hover:bg-white/5 hover:text-white"
      >
        <Plus size={14} />
        Add Item
      </button>

    </div>
  );
}