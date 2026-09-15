"use client";

import { getTasks, Task } from "@/app/app/admin/tasks/taskStore";
import {
  getActiveTeam,
  getTeamMemberById,
  TeamMember,
} from "@/lib/core/teamStore";

export type TeamIntelligenceStatus =
  | "Balanced"
  | "Busy"
  | "Overloaded"
  | "Available";

export type TeamIntelligence = {
  member: TeamMember;
  totalTasks: number;
  activeTasks: number;
  completedTasks: number;
  highPriorityTasks: number;
  overdueTasks: number;
  workload: number;
  capacity: number;
  completionRate: number;
  projectCount: number;
  projects: string[];
  status: TeamIntelligenceStatus;
};

function getAvailableTeam(): TeamMember[] {
  const ids = new Set<string>(getActiveTeam().map((member) => member.id));

  getTasks().forEach((task) => {
    if (task.assigneeId) ids.add(task.assigneeId);
  });

  return Array.from(ids)
    .map((id) => getTeamMemberById(id))
    .filter((member): member is TeamMember => Boolean(member))
    .filter((member) => member.status === "Active");
}

export function calculateTeamIntelligence(
  tasks: Task[] = getTasks(),
  members: TeamMember[] = getAvailableTeam()
): TeamIntelligence[] {
  return members.map((member) => {
    const own = tasks.filter(
      (task) => task.assigneeId === member.id
    );

    const active = own.filter(
      (task) =>
        task.status === "Open" ||
        task.status === "In Progress" ||
        task.status === "Overdue"
    );

    const completed = own.filter(
      (task) => task.status === "Completed"
    );

    const high = active.filter(
      (task) =>
        task.priority === "High" ||
        task.priority === "Urgent"
    );

    const overdue = own.filter(
      (task) => task.status === "Overdue"
    );

    const projects = Array.from(
      new Set(
        own
          .map((task) => task.project)
          .filter(Boolean)
      )
    );

    const workload = Math.min(
      100,
      active.length * 20 +
        high.length * 10 +
        overdue.length * 15
    );

    const capacity = Math.max(0, 100 - workload);

    const completionRate =
      own.length > 0
        ? Math.round((completed.length / own.length) * 100)
        : 0;

    let status: TeamIntelligenceStatus = "Available";

    if (workload >= 80) {
      status = "Overloaded";
    } else if (workload >= 55) {
      status = "Busy";
    } else if (workload >= 25) {
      status = "Balanced";
    }

    return {
      member,
      totalTasks: own.length,
      activeTasks: active.length,
      completedTasks: completed.length,
      highPriorityTasks: high.length,
      overdueTasks: overdue.length,
      workload,
      capacity,
      completionRate,
      projectCount: projects.length,
      projects,
      status,
    };
  });
}

export function getTeamIntelligence() {
  return calculateTeamIntelligence();
}

export function getTeamAlerts(
  intelligence: TeamIntelligence[] = getTeamIntelligence()
) {
  return intelligence.flatMap((member) => {
    const alerts: {
      memberId: string;
      memberName: string;
      severity: "Critical" | "Warning" | "Info";
      title: string;
      description: string;
    }[] = [];

    if (member.status === "Overloaded") {
      alerts.push({
        memberId: member.member.id,
        memberName: member.member.name,
        severity: "Critical",
        title: "Workload overload",
        description: `${member.member.name} is carrying ${member.workload}% workload.`,
      });
    }

    if (member.overdueTasks > 0) {
      alerts.push({
        memberId: member.member.id,
        memberName: member.member.name,
        severity: "Warning",
        title: "Overdue work",
        description: `${member.overdueTasks} overdue task${member.overdueTasks === 1 ? "" : "s"} assigned.`,
      });
    }

    if (member.capacity >= 60 && member.activeTasks === 0) {
      alerts.push({
        memberId: member.member.id,
        memberName: member.member.name,
        severity: "Info",
        title: "Available capacity",
        description: `${member.member.name} has significant available capacity.`,
      });
    }

    return alerts;
  });
}

export function getSmartAssignee(
  tasks: Task[] = getTasks(),
  members: TeamMember[] = getAvailableTeam()
) {
  const intelligence = calculateTeamIntelligence(tasks, members);

  return [...intelligence].sort((a, b) => {
    if (a.workload !== b.workload) {
      return a.workload - b.workload;
    }

    return b.completionRate - a.completionRate;
  })[0] ?? null;
}
