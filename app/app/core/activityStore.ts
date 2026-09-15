"use client";

import { resolveProjectId } from "@/app/app/core/projectRelation";

export type ActivityType =
  | "Project"
  | "Task"
  | "File"
  | "Approval"
  | "Site"
  | "Finance"
  | "Client"
  | "Team"
  | "System";

export type Activity = {
  id: string;

  type: ActivityType;

  title: string;

  description: string;

  projectId?: string;

  projectName?: string;

  userId?: string;

  userName?: string;

  metadata?: Record<string, string>;

  createdAt: string;
};

const STORAGE_KEY = "mason-arc-activity";

/* =========================================
   GET
========================================= */

export function getActivities(): Activity[] {
  if (typeof window === "undefined") {
    return [];
  }

  const stored =
    localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return [];
  }

  try {
    const activities = JSON.parse(stored) as Activity[];
    const normalized = activities.map((activity) => ({
      ...activity,
      projectId: activity.projectId ?? resolveProjectId(activity.projectName),
    }));
    if (JSON.stringify(normalized) !== JSON.stringify(activities)) saveActivities(normalized);
    return normalized;
  } catch {
    localStorage.removeItem(STORAGE_KEY);

    return [];
  }
}

/* =========================================
   SAVE
========================================= */

export function saveActivities(
  activities: Activity[]
) {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(activities)
  );
}

/* =========================================
   ADD
========================================= */

export function addActivity(
  activity: Omit<Activity, "id" | "createdAt">
) {
  const activities = getActivities();

  const newActivity: Activity = {
    ...activity,
    projectId: activity.projectId ?? resolveProjectId(activity.projectName),

    id: `ACT-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 7)}`,

    createdAt:
      new Date().toISOString(),
  };

  saveActivities([
    newActivity,
    ...activities,
  ]);

  return newActivity;
}

/* =========================================
   PROJECT ACTIVITIES
========================================= */

export function getProjectActivities(
  projectId: string
) {
  return getActivities()
    .filter(
      (activity) =>
        activity.projectId === projectId
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date().getTime()
    );
}

/* =========================================
   PROJECT NAME ACTIVITIES
   Useful while old data has no projectId
========================================= */

export function getProjectActivitiesByName(
  projectName: string
) {
  return getActivities()
    .filter(
      (activity) =>
        activity.projectName === projectName
    )
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date().getTime()
    );
}

/* =========================================
   GET ONE
========================================= */

export function getActivityById(
  activityId: string
) {
  return getActivities().find(
    (activity) =>
      activity.id === activityId
  );
}

/* =========================================
   DELETE
========================================= */

export function deleteActivity(
  activityId: string
) {
  const activities = getActivities();

  const updated =
    activities.filter(
      (activity) =>
        activity.id !== activityId
    );

  saveActivities(updated);

  return true;
}

/* =========================================
   CLEAR
========================================= */

export function clearActivities() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(
    STORAGE_KEY
  );
}