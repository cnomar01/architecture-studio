"use client";

import {
  getActiveTeam,
  getTeamMemberById,
  TeamMember,
} from "@/lib/core/teamStore";

export type SmartAssignmentTask = {
  project?: string;
  priority?: string;
  department?: string;
  assigneeId?: string;
};

export async function getSmartAssignmentTeam(): Promise<TeamMember[]> {
  return await getActiveTeam();
}

export async function getSmartAssignmentMember(
  memberId: string
): Promise<TeamMember | null> {
  return await getTeamMemberById(memberId);
}

export async function getSmartAssignmentRecommendations(
  options: {
    tasks?: SmartAssignmentTask[];
    project?: string;
    priority?: string;
    department?: string;
  } = {}
): Promise<TeamMember[]> {
  const team = await getActiveTeam();
  const tasks = options.tasks ?? [];

  const workload = new Map<string, number>();

  for (const member of team) {
    workload.set(member.id, 0);
  }

  for (const task of tasks) {
    if (task.assigneeId && workload.has(task.assigneeId)) {
      workload.set(
        task.assigneeId,
        (workload.get(task.assigneeId) ?? 0) + 1
      );
    }
  }

  return [...team].sort((a, b) => {
    // 1. Prefer matching department.
    if (options.department) {
      const aDepartmentMatch =
        a.department.toLowerCase() ===
        options.department.toLowerCase();

      const bDepartmentMatch =
        b.department.toLowerCase() ===
        options.department.toLowerCase();

      if (aDepartmentMatch !== bDepartmentMatch) {
        return aDepartmentMatch ? -1 : 1;
      }
    }

    // 2. Prefer the team member with the lower current workload.
    const aWorkload = workload.get(a.id) ?? 0;
    const bWorkload = workload.get(b.id) ?? 0;

    if (aWorkload !== bWorkload) {
      return aWorkload - bWorkload;
    }

    // 3. Stable alphabetical fallback.
    return a.name.localeCompare(b.name);
  });
}