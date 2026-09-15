"use client";

export type MessageScope = "Internal" | "Project" | "Client";

export type MessageAttachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  dataUrl?: string;
};

export type MessageMention = {
  id: string;
  name: string;
};

export type Message = {
  id: string;
  scope: MessageScope;
  projectId?: string;
  projectName?: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  recipientId?: string;
  recipientName?: string;
  body: string;
  mentions: MessageMention[];
  attachments: MessageAttachment[];
  createdAt: string;
  readBy: string[];
};

const STORAGE_KEY = "mason-arc-messages";

const seedMessages: Message[] = [
  {
    id: "MSG-001",
    scope: "Project",
    projectId: "CEM-001",
    projectName: "City Edge Mall",
    senderId: "OM-001",
    senderName: "Omar Mohamed",
    senderRole: "Architect",
    body: "Ground floor coordination needs the latest civil updates.",
    mentions: [{ id: "AS-001", name: "Ahmed Shabaan" }],
    attachments: [],
    createdAt: new Date().toISOString(),
    readBy: [],
  },
];

function hasWindow() {
  return typeof window !== "undefined";
}

function load(): Message[] {
  if (!hasWindow()) return seedMessages;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedMessages));
      return seedMessages;
    }
    return JSON.parse(raw) as Message[];
  } catch {
    return seedMessages;
  }
}

function save(messages: Message[]) {
  if (hasWindow()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }
}

function nextId(messages: Message[]) {
  const max = messages.reduce((n, m) => {
    const value = Number(m.id.replace(/\D/g, ""));
    return Number.isFinite(value) ? Math.max(n, value) : n;
  }, 0);
  return `MSG-${String(max + 1).padStart(3, "0")}`;
}

export function getMessages() {
  return load().sort(
    (a, b) =>
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function getMessageById(id: string) {
  return getMessages().find((message) => message.id === id);
}

export function getProjectMessages(projectId: string) {
  return getMessages().filter(
    (message) => message.projectId === projectId
  );
}

export function getInternalMessages() {
  return getMessages().filter((message) => message.scope === "Internal");
}

export function getClientMessages(projectId?: string) {
  return getMessages().filter(
    (message) =>
      message.scope === "Client" &&
      (!projectId || message.projectId === projectId)
  );
}

export function addMessage(input: Omit<Message, "id" | "createdAt">) {
  const messages = getMessages();
  const message: Message = {
    ...input,
    id: nextId(messages),
    createdAt: new Date().toISOString(),
  };
  messages.push(message);
  save(messages);
  return message;
}

export function markMessageRead(messageId: string, userId: string) {
  const messages = getMessages().map((message) => {
    if (message.id !== messageId) return message;
    return {
      ...message,
      readBy: message.readBy.includes(userId)
        ? message.readBy
        : [...message.readBy, userId],
    };
  });
  save(messages);
}

export function deleteMessage(messageId: string) {
  save(getMessages().filter((message) => message.id !== messageId));
}

export function clearMessages() {
  save([]);
}
