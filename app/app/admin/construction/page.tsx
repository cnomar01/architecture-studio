"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ClipboardCheck,
  FileQuestion,
  PackageCheck,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Plus,
} from "lucide-react";
import {
  addConstructionItem,
  ConstructionItemType,
  getConstructionItems,
  updateConstructionItem,
} from "./constructionStore";

const types: Array<{
  type: ConstructionItemType;
  label: string;
  icon: typeof FileQuestion;
}> = [
  { type: "RFI", label: "RFIs", icon: FileQuestion },
  { type: "Submittal", label: "Submittals", icon: ClipboardCheck },
  { type: "Material Approval", label: "Materials", icon: PackageCheck },
  { type: "Inspection", label: "Inspections", icon: ClipboardCheck },
  { type: "NCR", label: "NCRs", icon: ShieldAlert },
  { type: "Snag", label: "Snags", icon: AlertTriangle },
  { type: "Handover", label: "Handover", icon: CheckCircle2 },
];

export default function ConstructionOSPage() {
  const [items, setItems] = useState(getConstructionItems());
  const [filter, setFilter] = useState<ConstructionItemType | "All">("All");
  const [showForm, setShowForm] = useState(false);

  const visible = useMemo(
    () => filter === "All" ? items : items.filter((item) => item.type === filter),
    [items, filter]
  );

  const open = items.filter((x) => ["Open", "Submitted", "Under Review"].includes(x.status)).length;
  const urgent = items.filter((x) => x.priority === "Urgent" && x.status !== "Closed").length;
  const closed = items.filter((x) => ["Closed", "Resolved", "Approved"].includes(x.status)).length;

  function refresh() {
    setItems(getConstructionItems());
  }

  function addDemo() {
    addConstructionItem({
      type: "RFI",
      projectId: "city-edge-mall",
      projectName: "City Edge Mall",
      title: "New coordination clarification",
      description: "New construction coordination item generated from the Construction OS.",
      status: "Draft",
      priority: "Medium",
      assignee: "Omar Mohamed",
      reference: "AI-DRAFT",
    });
    refresh();
    setShowForm(false);
  }

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 border-b border-black/10 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">Mason & Arc / Construction OS</p>
            <h1 className="mt-3 text-4xl font-medium tracking-tight">Construction Control</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-black/55">
              One operational layer connecting RFIs, submittals, materials, inspections, NCRs,
              snags and handover.
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-5 py-3 text-xs font-medium text-white"
          >
            <Plus size={15} />
            New Control Item
          </button>
        </div>

        {showForm && (
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl border border-black/10 bg-black/[0.02] p-5">
            <span className="text-xs text-black/60">Quick-create a controlled RFI draft:</span>
            <button onClick={addDemo} className="rounded-lg border border-black/15 px-4 py-2 text-xs hover:bg-black hover:text-white">
              Create RFI
            </button>
          </div>
        )}

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["Open control items", open],
            ["Urgent", urgent],
            ["Closed / approved", closed],
          ].map(([label, value]) => (
            <div key={String(label)} className="rounded-xl border border-black/10 p-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">{label}</p>
              <p className="mt-3 text-3xl font-medium">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-8 grid gap-3 sm:grid-cols-4 lg:grid-cols-8">
          <button
            onClick={() => setFilter("All")}
            className={`rounded-lg border px-3 py-3 text-xs ${filter === "All" ? "bg-black text-white" : "border-black/10"}`}
          >
            All
          </button>
          {types.map(({ type, label, icon: Icon }) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`rounded-lg border px-3 py-3 text-xs ${filter === type ? "bg-black text-white" : "border-black/10"}`}
            >
              <Icon size={14} className="mx-auto mb-1" />
              {label}
            </button>
          ))}
        </section>

        <section className="mt-8 overflow-hidden rounded-xl border border-black/10">
          <div className="grid grid-cols-[110px_1fr_120px_120px_110px] gap-4 border-b border-black/10 px-5 py-3 text-[9px] uppercase tracking-[0.15em] text-black/35">
            <span>Type</span><span>Control item</span><span>Priority</span><span>Status</span><span>Action</span>
          </div>
          {visible.map((item) => (
            <div key={item.id} className="grid grid-cols-[110px_1fr_120px_120px_110px] items-center gap-4 border-b border-black/[0.06] px-5 py-5 last:border-0">
              <div>
                <p className="text-[10px] font-medium">{item.type}</p>
                <p className="mt-1 text-[9px] text-black/35">{item.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="mt-1 text-xs leading-5 text-black/50">{item.description}</p>
                <p className="mt-2 text-[10px] text-black/35">{item.projectName} · {item.assignee || "Unassigned"}</p>
              </div>
              <span className="text-xs">{item.priority}</span>
              <span className="text-xs">{item.status}</span>
              <button
                onClick={() => {
                  updateConstructionItem(
                    item.id,
                    item.type === "NCR" ? { status: "Resolved", closedAt: new Date().toISOString().slice(0, 10) } : { status: "Under Review" }
                  );
                  refresh();
                }}
                className="inline-flex items-center gap-1 text-xs underline underline-offset-4"
              >
                Advance <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </section>

        <div className="mt-6 rounded-xl border border-black/10 bg-black/[0.02] p-5 text-xs leading-6 text-black/55">
          <strong className="text-black">Next automation layer:</strong> AI Agents will be able to
          create these control items from site photos, drawings, meetings and project signals,
          while Owner approval remains the execution gate.
        </div>
      </div>
    </main>
  );
}
