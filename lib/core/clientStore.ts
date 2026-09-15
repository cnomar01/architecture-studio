"use client";

export type ClientStatus = "Active" | "Inactive";

export type Client = {
  id: string;
  code: string;
  name: string;
  company?: string;
  email: string;
  phone: string;
  address?: string;
  status: ClientStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "mason-arc-clients";

const initialClients: Client[] = [];

export function getClients(): Client[] {
  if (typeof window === "undefined") return initialClients;

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialClients));
    return initialClients;
  }

  try {
    return JSON.parse(stored) as Client[];
  } catch {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialClients));
    return initialClients;
  }
}

export function saveClients(clients: Client[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(clients));
}

export function getClientById(clientId: string): Client | null {
  return (
    getClients().find(
      (client) => client.id === clientId || client.code === clientId
    ) ?? null
  );
}

export function addClient(
  client: Omit<Client, "id" | "createdAt" | "updatedAt">
) {
  const clients = getClients();

  const newClient: Client = {
    ...client,
    id: client.code,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveClients([...clients, newClient]);
  return newClient;
}

export function updateClient(
  clientId: string,
  updates: Partial<Client>
) {
  const clients = getClients();

  const updated = clients.map((client) =>
    client.id === clientId
      ? {
          ...client,
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      : client
  );

  saveClients(updated);
  return updated;
}

export function deleteClient(clientId: string) {
  const clients = getClients();
  const updated = clients.filter((client) => client.id !== clientId);
  saveClients(updated);
  return updated;
}

export function getActiveClients(): Client[] {
  return getClients().filter((client) => client.status === "Active");
}
