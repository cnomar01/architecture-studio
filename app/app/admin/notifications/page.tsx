"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Bell,
  Check,
  CheckCheck,
  ClipboardCheck,
  FileText,
  HardHat,
  Wallet,
  RefreshCw,
} from "lucide-react";

import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  Notification,
} from "@/lib/core/notificationStore";
import { runNotificationEngine, getNotificationSummary } from "@/lib/core/notificationEngine";

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>([]);
  const [filter, setFilter] = useState<"All" | "Unread" | "Critical" | "Warning">("All");

  useEffect(() => {
    runNotificationEngine();
    setNotifications(getNotifications());
  }, []);

  function markRead(id: string) {
    markNotificationRead(id);

    setNotifications(
      getNotifications()
    );
  }

  function markAllRead() {
    markAllNotificationsRead();

    setNotifications(
      getNotifications()
    );
  }

  const summary = getNotificationSummary();
  const unread = summary.unread;
  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "Unread") return !notification.read;
    if (filter === "Critical") return notification.priority === "Critical";
    if (filter === "Warning") return notification.priority === "Warning";
    return true;
  });

  function refresh() {
    runNotificationEngine();
    setNotifications(getNotifications());
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white">

      <div className="mx-auto max-w-5xl px-5 py-8 md:px-8 lg:px-10">

        <div className="mb-8 flex items-end justify-between border-b border-white/10 pb-7">

          <div>

            <Link
              href="/app/admin"
              className="mb-5 inline-flex items-center gap-2 text-xs text-white/40 hover:text-white"
            >
              <ArrowLeft size={14} />
              Back to Overview
            </Link>

            <p className="text-[9px] uppercase tracking-[0.25em] text-white/25">
              Studio Activity
            </p>

            <h1 className="mt-2 text-3xl font-medium">
              Notifications
            </h1>

            <p className="mt-2 text-xs text-white/30">
              Important activity across Mason & Arc.
            </p>

          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            {(["All", "Unread", "Critical", "Warning"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full border px-3 py-1.5 text-[9px] uppercase tracking-wider transition ${filter === item ? "border-white/25 bg-white/10 text-white" : "border-white/10 text-white/30 hover:text-white"}`}
              >
                {item}
                {item === "Unread" && ` ${summary.unread}`}
                {item === "Critical" && ` ${summary.critical}`}
                {item === "Warning" && ` ${summary.warning}`}
              </button>
            ))}
            <button
              type="button"
              onClick={refresh}
              className="ml-auto inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[9px] uppercase tracking-wider text-white/30 hover:text-white"
            >
              <RefreshCw size={11} />
              Run alert check
            </button>
          </div>

          {unread > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white/50 hover:text-white"
            >
              <CheckCheck size={14} />
              Mark all read
            </button>
          )}

        </div>

        {notifications.length === 0 ? (

          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">

            <Bell
              size={22}
              className="mx-auto text-white/20"
            />

            <h2 className="mt-4 text-sm font-medium">
              No notifications
            </h2>

            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-white/25">
              New project activity, approvals,
              tasks and site events will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-3">

            {filteredNotifications.map(
              (notification) => (

                <div
                  key={notification.id}
                  className={`rounded-2xl border p-5 transition ${
                    notification.read
                      ? "border-white/10 bg-white/[0.02]"
                      : "border-white/15 bg-white/[0.045]"
                  }`}
                >

                  <div className="flex gap-4">

                    <NotificationIcon
                      type={notification.type}
                    />

                    <div className="min-w-0 flex-1">

                      <div className="mb-2 flex items-center gap-2">
                        <span className={`rounded-full border px-2 py-1 text-[8px] uppercase tracking-wider ${notification.priority === "Critical" ? "border-white/20 text-white/70" : notification.priority === "Warning" ? "border-white/15 text-white/50" : "border-white/10 text-white/25"}`}>
                          {notification.priority}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                        <div>

                          <p className="text-sm font-medium">
                            {notification.title}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-white/35">
                            {notification.message}
                          </p>

                        </div>

                        {!notification.read && (
                          <span className="shrink-0 rounded-full border border-white/10 px-2 py-1 text-[9px] uppercase tracking-wider text-white/50">
                            New
                          </span>
                        )}

                      </div>

                      <div className="mt-4 flex items-center justify-between">

                        <span className="text-[10px] text-white/20">
                          {formatDate(
                            notification.createdAt
                          )}
                        </span>

                        {!notification.read && (
                          <button
                            type="button"
                            onClick={() =>
                              markRead(
                                notification.id
                              )
                            }
                            className="inline-flex items-center gap-1.5 text-[10px] text-white/35 hover:text-white"
                          >
                            <Check size={13} />
                            Mark read
                          </button>
                        )}

                        {notification.link && (
                          <Link
                            href={
                              notification.link
                            }
                            onClick={() =>
                              markRead(
                                notification.id
                              )
                            }
                            className="text-[10px] text-white/40 hover:text-white"
                          >
                            Open →
                          </Link>
                        )}

                      </div>

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </main>
  );
}

function NotificationIcon({
  type,
}: {
  type: Notification["type"];
}) {
  if (type === "Approval") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
        <ClipboardCheck
          size={17}
          className="text-white/50"
        />
      </div>
    );
  }

  if (type === "File") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
        <FileText
          size={17}
          className="text-white/50"
        />
      </div>
    );
  }

  if (type === "Site") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
        <HardHat
          size={17}
          className="text-white/50"
        />
      </div>
    );
  }

  if (type === "Finance") {
    return (
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
        <Wallet
          size={17}
          className="text-white/50"
        />
      </div>
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
      <Bell
        size={17}
        className="text-white/50"
      />
    </div>
  );
}

function formatDate(date: string) {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );
}