"use client";

import { useEffect } from "react";

const SOURCES = {
  clients: "mason-arc-clients",
  projects: "mason-arc-projects",
  messages: "mason-arc-messages",
  notifications: "mason-arc-notifications",
  documents: "mason-arc-documents",
  procurement: "mason-arc-procurement",
} as const;

const MARKER = "mason-arc-postgres-migration-v2";

function read(key: string) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export default function LegacyStorageMigration() {
  useEffect(() => {
    if (localStorage.getItem(MARKER)) return;
    const payload = Object.fromEntries(Object.entries(SOURCES).map(([name, key]) => [name, read(key)]));
    if (!Object.values(payload).some((items) => items.length)) {
      localStorage.setItem(MARKER, new Date().toISOString());
      return;
    }
    void fetch("/api/migration/local-storage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    }).then(async (response) => {
      if (!response.ok) throw new Error("Migration request failed");
      localStorage.setItem(MARKER, new Date().toISOString());
    }).catch((error) => console.error("Legacy storage migration will retry on the next visit", error));
  }, []);

  return null;
}
