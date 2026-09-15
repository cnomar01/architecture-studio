"use client";

export type NotificationType =
  | "Task"
  | "Approval"
  | "File"
  | "Site"
  | "Finance"
  | "Project"
  | "System";

export type NotificationPriority = "Info" | "Warning" | "Critical";

export type Notification = {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
};

const STORAGE_KEY = "mason-arc-notifications";

/* =========================================
   GET NOTIFICATIONS
========================================= */

export function getNotifications(): Notification[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    return JSON.parse(stored) as Notification[];
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

/* =========================================
   SAVE NOTIFICATIONS
========================================= */

export function saveNotifications(
  notifications: Notification[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(notifications)
  );
}

/* =========================================
   ADD NOTIFICATION
========================================= */

export function addNotification(
  notification: Omit<
    Notification,
    "id" | "createdAt" | "read" | "priority"
  > & {
    priority?: NotificationPriority;
  }
) {
  const notifications = getNotifications();

  const newNotification: Notification = {
    ...notification,
    priority: notification.priority || "Info",
    id: `NOT-${Date.now()}`,
    read: false,
    createdAt: new Date().toISOString(),
  };

  saveNotifications([
    newNotification,
    ...notifications,
  ]);

  return newNotification;
}

/* =========================================
   GET ONE NOTIFICATION
========================================= */

export function getNotificationById(
  notificationId: string
) {
  return getNotifications().find(
    (notification) =>
      notification.id === notificationId
  );
}

/* =========================================
   MARK AS READ
========================================= */

export function markNotificationRead(
  notificationId: string
) {
  const notifications = getNotifications();

  const updatedNotifications =
    notifications.map((notification) =>
      notification.id === notificationId
        ? {
            ...notification,
            read: true,
          }
        : notification
    );

  saveNotifications(updatedNotifications);

  return updatedNotifications.find(
    (notification) =>
      notification.id === notificationId
  );
}

/* =========================================
   MARK AS UNREAD
========================================= */

export function markNotificationUnread(
  notificationId: string
) {
  const notifications = getNotifications();

  const updatedNotifications =
    notifications.map((notification) =>
      notification.id === notificationId
        ? {
            ...notification,
            read: false,
          }
        : notification
    );

  saveNotifications(updatedNotifications);

  return updatedNotifications.find(
    (notification) =>
      notification.id === notificationId
  );
}

/* =========================================
   MARK ALL AS READ
========================================= */

export function markAllNotificationsRead() {
  const notifications = getNotifications();

  const updatedNotifications =
    notifications.map((notification) => ({
      ...notification,
      read: true,
    }));

  saveNotifications(updatedNotifications);

  return updatedNotifications;
}

/* =========================================
   GET UNREAD
========================================= */

export function getUnreadNotifications() {
  return getNotifications().filter(
    (notification) => !notification.read
  );
}

/* =========================================
   UNREAD COUNT
========================================= */

export function getUnreadNotificationCount() {
  return getUnreadNotifications().length;
}

/* =========================================
   DELETE NOTIFICATION
========================================= */

export function deleteNotification(
  notificationId: string
) {
  const notifications = getNotifications();

  const updatedNotifications =
    notifications.filter(
      (notification) =>
        notification.id !== notificationId
    );

  saveNotifications(updatedNotifications);

  return true;
}

/* =========================================
   ALERT HELPERS
========================================= */

export function hasNotification(title: string) {
  return getNotifications().some((notification) => notification.title === title);
}

export function clearReadNotifications() {
  const unread = getNotifications().filter((notification) => !notification.read);
  saveNotifications(unread);
  return unread;
}

/* =========================================
   CLEAR ALL
========================================= */

export function clearNotifications() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
}