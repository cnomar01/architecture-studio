 "use client";

import { getTasks, Task } from "./taskStore";
import { getTeamMemberById, TeamMember } from "@/lib/core/teamStore";

function getAvailableTeam(): TeamMember[] {
  const ids = new Set<string>();

  getTasks().forEach((task) => {
    if (task.assigneeId) ids.add(task.assigneeId);
  });

  ids.add("OM-001");
  ids.add("AS-001");

  return Array.from(ids)
    .map((id) => getTeamMemberById(id))
    .filter((member): member is TeamMember => Boolean(member))
    .filter((member) => member.status === "Active");
}

export type AssignmentCandidate = {
  member: TeamMember;
  score: number;
  reasons: string[];
  workload: number;
};

export type SmartAssignmentInput = {
  project?: string;
  department?: string;
  priority?: string;
  tasks?: Task[];
  members?: TeamMember[];
};

export function rankTaskAssignees(
  input: SmartAssignmentInput = {}
): AssignmentCandidate[] {
  const tasks = input.tasks ?? getTasks();
  const members = input.members ?? getAvailableTeam();

  return members
    .map((member) => {
      const own = tasks.filter(
        (task) =>
          task.assigneeId === member.id &&
          task.status !== "Completed"
      );

      const high = own.filter(
        (task) =>
          task.priority === "High" ||
          task.priority === "Urgent"
      );

      const overdue = own.filter(
        (task) => task.status === "Overdue"
      );

      const workload = Math.min(
        100,
        own.length * 20 +
          high.length * 10 +
          overdue.length * 15
      );

      let score = 100;
      const reasons: string[] = [];

      if (
        input.department &&
        member.department === input.department
      ) {
        score += 25;
        reasons.push("Department match");
      } else if (input.department) {
        score -= 20;
      }

      if (
        input.project &&
        member.project === input.project
      ) {
        score += 30;
        reasons.push("Already assigned to this project");
      }

      if (workload >= 80) {
        score -= 35;
        reasons.push("High current workload");
      } else if (workload <= 20) {
        score += 20;
        reasons.push("Good availability");
      }

      if (
        input.priority === "Urgent" &&
        workload >= 60
      ) {
        score -= 20;
        reasons.push("Urgent task should avoid overloaded resource");
      }

      return {
        member,
        score: Math.max(0, Math.round(score)),
        reasons,
        workload,
      };
    })
    .sort((a, b) => b.score - a.score);
}

export function getBestAssignee(
  input: SmartAssignmentInput = {}
) {
  return rankTaskAssignees(input)[0] ?? null;
}

/**
 * Compatibility API used by the New Task screen.
 * Accepts either an input object or individual values.
 */
export function getSmartAssignmentRecommendations(
  input: SmartAssignmentInput = {}
): AssignmentCandidate[] {
  return rankTaskAssignees(input);
}
