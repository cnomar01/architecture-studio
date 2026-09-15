"use client";

export type StudioSettings = {
  studioName: string;
  defaultCurrency: "EGP" | "USD" | "EUR";
  weekStartsOn: "Saturday" | "Sunday" | "Monday";
  workingHours: string;
  timezone: string;
  emailAlerts: boolean;
  browserAlerts: boolean;
  autoRefresh: boolean;
};

const STORAGE_KEY = "mason-arc-studio-settings";

const defaults: StudioSettings = {
  studioName: "Mason & Arc Studio",
  defaultCurrency: "EGP",
  weekStartsOn: "Saturday",
  workingHours: "09:00–18:00",
  timezone: "Africa/Cairo",
  emailAlerts: true,
  browserAlerts: true,
  autoRefresh: true,
};

export function getStudioSettings(): StudioSettings {
  if (typeof window === "undefined") return defaults;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return defaults;

  try {
    return { ...defaults, ...(JSON.parse(stored) as Partial<StudioSettings>) };
  } catch {
    return defaults;
  }
}

export function updateStudioSettings(patch: Partial<StudioSettings>): StudioSettings {
  const next = { ...getStudioSettings(), ...patch };
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function resetStudioSettings(): StudioSettings {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
  return defaults;
}
