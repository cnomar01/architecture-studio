"use client";

export type NotificationType =
  | "task"
  | "approval"
  | "site"
  | "finance"
  | "project"
  | "system";

export type NotificationPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  priority?: NotificationPriority;
  read: boolean;
  createdAt: string;
  href?: string;
  userId?: string;
};

const KEY = "mason-arc-notifications";

function createNotificationId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `NTF-${crypto.randomUUID()}`;
  }

  return `NTF-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function read(): Notification[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || "[]") as Notification[];
    const ids = new Set<string>();
    let repaired = false;
    const notifications = stored.map((notification) => {
      if (!ids.has(notification.id)) {
        ids.add(notification.id);
        return notification;
      }

      repaired = true;
      const id = createNotificationId();
      ids.add(id);
      return { ...notification, id };
    });

    // Repair legacy localStorage entries created with Date.now() in the same tick.
    if (repaired) write(notifications);
    return notifications;
  } catch {
    return [];
  }
}

function write(v: Notification[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(v));
  }
}

export function getNotifications(userId?: string): Notification[] {
  return read()
    .filter((n) => !userId || !n.userId || n.userId === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function addNotification(
  input: Omit<Notification, "id" | "createdAt" | "read">
): Notification {
  const v = read();

  const n: Notification = {
    ...input,
    id: createNotificationId(),
    createdAt: new Date().toISOString(),
    read: false,
  };

  write([n, ...v]);

  return n;
}

export function markNotificationRead(id: string) {
  write(
    read().map((n) =>
      n.id === id
        ? {
            ...n,
            read: true,
          }
        : n
    )
  );
}

export function markAllNotificationsRead(userId?: string) {
  write(
    read().map((n) =>
      !userId || !n.userId || n.userId === userId
        ? {
            ...n,
            read: true,
          }
        : n
    )
  );
}

export function unreadNotificationCount(userId?: string): number {
  return getNotifications(userId).filter((n) => !n.read).length;
}

export function getUnreadNotificationCount(): number {
  return getNotifications().filter((notification) => !notification.read)
    .length;
}

export function hasNotification(key: string): boolean {
  return getNotifications().some(
    (notification) =>
      notification.id === key || notification.title === key
  );
}
