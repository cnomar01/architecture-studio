"use client";

export type TeamStatus = "Active" | "Inactive";

export type TeamMember = {
  id: string;
  code: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  status: TeamStatus;
  project?: string;
  projectRole?: string;
};

function mapUser(user: any): TeamMember {
  const name = String(user.name || "");
  const initials =
    name
      .split(" ")
      .filter(Boolean)
      .map((part: string) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "TM";

  return {
    id: user.id,
    code: user.employeeId || user.id,
    name,
    initials,
    role: user.role,
    department: user.department || "",
    status: user.active ? "Active" : "Inactive",
  };
}

export async function getTeam(): Promise<TeamMember[]> {
  const response = await fetch("/api/admin/team", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to load team.");
  }

  const data = await response.json();

  return (data.users || []).map(mapUser);
}

export async function getActiveTeam(): Promise<TeamMember[]> {
  const team = await getTeam();
  return team.filter((member) => member.status === "Active");
}

export async function getTeamMemberById(
  memberId: string
): Promise<TeamMember | null> {
  const team = await getTeam();

  return (
    team.find(
      (member) =>
        member.id === memberId ||
        member.code === memberId
    ) ?? null
  );
}