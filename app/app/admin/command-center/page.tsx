"use client";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bot,
  CheckCircle2,
  CircleDollarSign,
  HardHat,
  ShieldAlert,
} from "lucide-react";

import { getConstructionItems } from "../construction/constructionStore";
import {
  getLeads,
  getContracts,
  getProcurement,
  getQuality,
  getSafety,
} from "../complete/operationsStore";

type Card = {
  label: string;
  value: string | number;
  status: string;
  icon: React.ComponentType<{ size?: number }>;
};

export default function CommandCenterPage() {
  const construction = getConstructionItems();

  const leads = getLeads();
  const contracts = getContracts();
  const procurement = getProcurement();
  const quality = getQuality();
  const safety = getSafety();

  const urgent = [
    ...construction.filter(
      (x) => x.priority === "Urgent" && x.status !== "Closed"
    ),
    ...quality.filter(
      (x) => x.priority === "Urgent" && x.status !== "Closed"
    ),
  ];

  const openProc = procurement.filter(
    (x) => !["Closed", "Delivered"].includes(x.status)
  );

  const openSafety = safety.filter((x) => x.status !== "Closed");

  const activeContracts = contracts.filter(
    (x) => x.status === "Active"
  );

  const weightedRisk = Math.min(
    100,
    urgent.length * 18 +
      openSafety.filter((x) =>
        ["High", "Critical"].includes(x.severity)
      ).length *
        15 +
      openProc.length * 5
  );

  const health = 100 - weightedRisk;

  const signal =
    health >= 80
      ? "Stable"
      : health >= 60
        ? "Watch"
        : health >= 40
          ? "High Risk"
          : "Critical";

  const cards: Card[] = [
    {
      label: "Project Health",
      value: `${health}%`,
      status: signal,
      icon: Activity,
    },
    {
      label: "Urgent Controls",
      value: urgent.length,
      status: "Needs attention",
      icon: AlertTriangle,
    },
    {
      label: "Procurement",
      value: openProc.length,
      status: "Open items",
      icon: HardHat,
    },
    {
      label: "Safety / HSE",
      value: openSafety.length,
      status: "Open controls",
      icon: ShieldAlert,
    },
    {
      label: "Active Contracts",
      value: activeContracts.length,
      status: "Commercial",
      icon: CircleDollarSign,
    },
    {
      label: "AI Actions",
      value: "Ready",
      status: "Owner-gated",
      icon: Bot,
    },
  ];

  return (
    <main className="min-h-screen bg-white px-6 py-10 text-black lg:px-12">
      <div className="mx-auto max-w-7xl">
        <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
          Mason & Arc / Command Center
        </p>

        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-medium tracking-tight">
              Studio Command Center
            </h1>

            <p className="mt-2 text-sm text-black/50">
              SEE → UNDERSTAND → DETECT → DECIDE → ACT
            </p>
          </div>

          <span className="rounded-full border border-black/10 px-4 py-2 text-xs">
            {signal}
          </span>
        </div>

        <section className="mt-8 grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-xl border border-black/10 p-5"
              >
                <Icon size={17} />

                <p className="mt-5 text-[10px] uppercase tracking-[0.18em] text-black/40">
                  {card.label}
                </p>

                <p className="mt-2 text-2xl font-medium">
                  {card.value}
                </p>

                <p className="mt-1 text-[10px] text-black/40">
                  {card.status}
                </p>
              </div>
            );
          })}
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-black/10 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-medium">Critical signals</h2>
              <Bot size={17} />
            </div>

            <div className="mt-5 space-y-3">
              {urgent.slice(0, 5).map((x) => (
                <div
                  key={x.id}
                  className="flex items-center justify-between border-b border-black/[.06] pb-3"
                >
                  <div>
                    <p className="text-sm">{x.title}</p>

                    <p className="text-[10px] text-black/40">
                      {x.id} · {x.projectName}
                    </p>
                  </div>

                  <ArrowRight size={14} />
                </div>
              ))}

              {urgent.length === 0 && (
                <p className="text-sm text-black/45">
                  No urgent controls detected.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-black/10 p-6">
            <h2 className="font-medium">Next decisions</h2>

            <div className="mt-5 space-y-3 text-sm">
              {openProc.slice(0, 3).map((x) => (
                <div
                  key={x.id}
                  className="flex gap-3 border-b border-black/[.06] pb-3"
                >
                  <CircleDollarSign size={15} />

                  <span>
                    Review procurement:{" "}
                    <strong>{x.item}</strong>
                  </span>
                </div>
              ))}

              {leads
                .filter((x) =>
                  ["Proposal", "Negotiation"].includes(x.status)
                )
                .slice(0, 2)
                .map((x) => (
                  <div
                    key={x.id}
                    className="flex gap-3 border-b border-black/[.06] pb-3"
                  >
                    <Activity size={15} />

                    <span>
                      Commercial follow-up:{" "}
                      <strong>{x.company}</strong>
                    </span>
                  </div>
                ))}

              {activeContracts.map((x) => (
                <div
                  key={x.id}
                  className="flex gap-3"
                >
                  <CheckCircle2 size={15} />

                  <span>
                    Contract active:{" "}
                    <strong>{x.title}</strong>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-6 rounded-xl bg-black p-6 text-white">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/45">
            AI Operating Loop
          </p>

          <p className="mt-3 max-w-3xl text-sm leading-6 text-white/75">
            The command center combines project intelligence, construction
            controls, commercial signals, procurement and HSE. AI
            recommendations remain owner-gated before operational changes
            are applied.
          </p>
        </div>
      </div>
    </main>
  );
}