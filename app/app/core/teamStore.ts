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

const STORAGE_KEY = "mason-arc-team";

const initialTeam: TeamMember[] = [
  {
    id: "OM-001",
    code: "OM-001",
    name: "Omar Mohamed",
    initials: "OM",
    role: "Architect",
    department: "Architecture",
    status: "Active",
    project: "City Edge Mall",
    projectRole: "Project Architect",
  },
  {
    id: "AS-001",
    code: "AS-001",
    name: "Ahmed Shabaan",
    initials: "AS",
    role: "Civil Engineer",
    department: "Civil",
    status: "Active",
    project: "City Edge Mall",
    projectRole: "Civil Engineer",
  },
];

export function getTeam(): TeamMember[] {
  if (typeof window === "undefined") {
    return initialTeam;
  }

  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialTeam)
    );

    return initialTeam;
  }

  try {
    return JSON.parse(stored) as TeamMember[];
  } catch {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialTeam)
    );

    return initialTeam;
  }
}

export function saveTeam(team: TeamMember[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(team)
  );
}

export function getTeamMemberById(
  memberId: string
): TeamMember | null {
  return (
    getTeam().find(
      (member) =>
        member.id === memberId ||
        member.code === memberId
    ) ?? null
  );
}

export function getActiveTeam(): TeamMember[] {
  return getTeam().filter(
    (member) => member.status === "Active"
  );
}

export function addTeamMember(
  member: Omit<TeamMember, "id">
) {
  const team = getTeam();

  const newMember: TeamMember = {
    ...member,
    id: member.code,
  };

  saveTeam([...team, newMember]);

  return newMember;
}

export function updateTeamMember(
  memberId: string,
  updates: Partial<TeamMember>
) {
  const team = getTeam();

  const updated = team.map((member) =>
    member.id === memberId
      ? {
          ...member,
          ...updates,
        }
      : member
  );

  saveTeam(updated);

  return updated;
}

export function deleteTeamMember(
  memberId: string
) {
  const team = getTeam();

  const updated = team.filter(
    (member) => member.id !== memberId
  );

  saveTeam(updated);

  return updated;
}