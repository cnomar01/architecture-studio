"use client";

import { getTasks } from "@/app/app/admin/tasks/taskStore";
import { getApprovals } from "@/app/app/admin/approvals/approvalStore";
import {
  getNotifications,
  addNotification,
  hasNotification,
} from "@/app/app/core/notificationStore";
import { getFinanceTransactions } from "@/app/app/admin/finance/financeStore";
import { getTeamIntelligence } from "@/app/app/admin/team/teamIntelligence";
import { getCalendarEvents } from "@/app/app/admin/calendar/calendarStore";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function daysFromToday(dateValue: string) {
  const target = new Date(dateValue);
  const today = new Date();

  target.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  return Math.ceil(
    (target.getTime() - today.getTime()) / 86400000
  );
}

export async function runNotificationEngine() {
  if (typeof window === "undefined") return [];

  const created = [];

  const tasks = getTasks();
  const approvals = getApprovals();
  const team = await getTeamIntelligence();
  const events = await getCalendarEvents();
  const transactions = getFinanceTransactions();

  const overdueTasks = tasks.filter(
    (task) =>
      task.status === "Overdue" ||
      (task.status !== "Completed" &&
        daysFromToday(task.deadline) < 0)
  );

  if (overdueTasks.length) {
    const title = `Overdue tasks: ${overdueTasks.length}`;

    if (!hasNotification(title)) {
      created.push(
        addNotification({
          type: "Task",
          priority: "Critical",
          title,
          message: `${overdueTasks.length} task${
            overdueTasks.length === 1 ? " is" : "s are"
          } overdue and need attention.`,
          link: "/app/admin/tasks",
        })
      );
    }
  }

  const dueSoon = tasks.filter(
    (task) =>
      task.status !== "Completed" &&
      daysFromToday(task.deadline) >= 0 &&
      daysFromToday(task.deadline) <= 1
  );

  if (dueSoon.length) {
    const title = `Tasks due soon: ${dueSoon.length}`;

    if (!hasNotification(title)) {
      created.push(
        addNotification({
          type: "Task",
          priority: "Warning",
          title,
          message: `${dueSoon.length} active task${
            dueSoon.length === 1 ? " is" : "s are"
          } due today or tomorrow.`,
          link: "/app/admin/tasks",
        })
      );
    }
  }

  const pendingApprovals = approvals.filter(
    (approval) => approval.status === "Pending"
  );

  if (pendingApprovals.length) {
    const title = `Pending approvals: ${pendingApprovals.length}`;

    if (!hasNotification(title)) {
      created.push(
        addNotification({
          type: "Approval",
          priority: "Warning",
          title,
          message: `${pendingApprovals.length} approval${
            pendingApprovals.length === 1 ? " is" : "s are"
          } waiting for review.`,
          link: "/app/admin/approvals",
        })
      );
    }
  }

  const overloaded = team.filter(
    (member) => member.status === "Overloaded"
  );

  if (overloaded.length) {
    const title = `Team overload: ${overloaded.length}`;

    if (!hasNotification(title)) {
      created.push(
        addNotification({
          type: "Project",
          priority: "Critical",
          title,
          message: `${overloaded.length} team member${
            overloaded.length === 1 ? " is" : "s are"
          } currently overloaded.`,
          link: "/app/admin/team",
        })
      );
    }
  }

  const upcomingEvents = events.filter(
    (event) =>
      daysFromToday(event.date) >= 0 &&
      daysFromToday(event.date) <= 1
  );

  if (upcomingEvents.length) {
    const title = `Upcoming schedule: ${upcomingEvents.length}`;

    if (!hasNotification(title)) {
      created.push(
        addNotification({
          type: "Project",
          priority: "Info",
          title,
          message: `${upcomingEvents.length} calendar event${
            upcomingEvents.length === 1 ? " is" : "s are"
          } scheduled today or tomorrow.`,
          link: "/app/admin/calendar",
        })
      );
    }
  }

  const pendingFinance = transactions.filter(
    (transaction) => transaction.status === "Pending"
  );

  if (pendingFinance.length) {
    const title = `Finance items pending: ${pendingFinance.length}`;

    if (!hasNotification(title)) {
      created.push(
        addNotification({
          type: "Finance",
          priority: "Warning",
          title,
          message: `${pendingFinance.length} finance transaction${
            pendingFinance.length === 1 ? " is" : "s are"
          } still pending.`,
          link: "/app/admin/finance",
        })
      );
    }
  }

  // Keep a lightweight daily system heartbeat
  // so the alert engine is visibly active.
  const heartbeatTitle = `Studio check ${todayKey()}`;

  if (!hasNotification(heartbeatTitle)) {
    created.push(
      addNotification({
        type: "System",
        priority: "Info",
        title: heartbeatTitle,
        message:
          "Studio alert engine completed its daily operational check.",
        link: "/app/admin/intelligence",
      })
    );
  }

  return created;
}

export function getNotificationSummary() {
  const notifications = getNotifications();

  return {
    total: notifications.length,
    unread: notifications.filter(
      (notification) => !notification.read
    ).length,
    critical: notifications.filter(
      (notification) =>
        notification.priority === "Critical" &&
        !notification.read
    ).length,
    warning: notifications.filter(
      (notification) =>
        notification.priority === "Warning" &&
        !notification.read
    ).length,
  };
}
