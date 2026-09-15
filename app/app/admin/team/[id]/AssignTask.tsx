"use client";

import { FormEvent, useState } from "react";

export default function AssignTask() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaved(true);

    setTimeout(() => {
      setOpen(false);
      setSaved(false);
    }, 1200);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full bg-white px-6 py-3 text-[10px] uppercase tracking-[0.16em] text-black transition hover:bg-white/80"
      >
        Assign Task
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-[#151515] p-7 md:p-9">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[9px] uppercase tracking-[0.2em] text-white/25">
                  Mason & Arc OS
                </p>

                <h2 className="mt-3 text-3xl font-light">
                  Assign Task
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xl text-white/25 transition hover:text-white"
              >
                ×
              </button>
            </div>

            {saved ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/15">
                  ✓
                </div>

                <p className="mt-5 text-sm text-white/60">
                  Task assigned successfully.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-9 space-y-6"
              >
                <div>
                  <label className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                    Project
                  </label>

                  <select
                    defaultValue="City Edge Mall"
                    className="mt-3 h-14 w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-5 text-sm text-white outline-none"
                  >
                    <option>City Edge Mall</option>
                    <option>Villa — New Cairo</option>
                    <option>Apartment — Marassi</option>
                    <option>Office — Downtown</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                    Task
                  </label>

                  <input
                    required
                    placeholder="e.g. Review architectural drawings"
                    className="mt-3 h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/30"
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                      Priority
                    </label>

                    <select
                      defaultValue="Medium"
                      className="mt-3 h-14 w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-5 text-sm text-white outline-none"
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                      <option>Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                      Deadline
                    </label>

                    <input
                      required
                      type="date"
                      className="mt-3 h-14 w-full rounded-xl border border-white/10 bg-white/[0.03] px-5 text-sm text-white outline-none focus:border-white/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[9px] uppercase tracking-[0.18em] text-white/25">
                    Description
                  </label>

                  <textarea
                    placeholder="Task details..."
                    className="mt-3 min-h-28 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white outline-none placeholder:text-white/20 focus:border-white/30"
                  />
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 rounded-xl border border-white/10 py-4 text-[10px] uppercase tracking-[0.16em] text-white/40 transition hover:border-white/25 hover:text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-white py-4 text-[10px] uppercase tracking-[0.16em] text-black transition hover:bg-white/80"
                  >
                    Assign Task
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}