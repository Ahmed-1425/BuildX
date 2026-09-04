import type { TeamItem, ExtendedApplicationStatus } from "@/types/admin";

export interface CandidateForTeam {
  id: string;
  full_name: string;
  level: "foundation" | "practitioner" | "advanced";
  gender?: "male" | "female" | null;
  city: string;
  specialization?: string;
  team_env: "comfortable" | "same_gender_only";
  application_status?: ExtendedApplicationStatus;
}

export function generateSuggestedTeams(
  candidates: CandidateForTeam[],
  existingTeams: { id: string; name: string; number: number }[]
): TeamItem[] {
  // Separate candidates by level
  const advanced = candidates.filter((c) => c.level === "advanced");
  const practitioners = candidates.filter((c) => c.level === "practitioner");
  const foundation = candidates.filter((c) => c.level === "foundation");

  // Initialize 8 teams
  const teams: TeamItem[] = existingTeams.map((t) => ({
    id: t.id,
    name: t.name,
    number: t.number,
    members: [],
  }));

  // Distribute 1 Advanced per team
  let advIdx = 0;
  for (const team of teams) {
    if (advIdx < advanced.length) {
      const c = advanced[advIdx++];
      team.members.push({
        id: `m-${c.id}`,
        team_id: team.id,
        application_id: c.id,
        full_name: c.full_name,
        level: c.level,
        gender: c.gender || null,
        city: c.city,
        specialization: c.specialization,
        team_env: c.team_env,
        application_status: c.application_status,
        role_in_team: "متقدم (Advanced Lead)",
      });
    }
  }

  // Distribute 1 Practitioner per team
  let pracIdx = 0;
  for (const team of teams) {
    if (pracIdx < practitioners.length) {
      const c = practitioners[pracIdx++];
      team.members.push({
        id: `m-${c.id}`,
        team_id: team.id,
        application_id: c.id,
        full_name: c.full_name,
        level: c.level,
        gender: c.gender || null,
        city: c.city,
        specialization: c.specialization,
        team_env: c.team_env,
        application_status: c.application_status,
        role_in_team: "ممارس (Practitioner)",
      });
    }
  }

  // Distribute 2 Foundation per team
  let fndIdx = 0;
  for (let slot = 0; slot < 2; slot++) {
    for (const team of teams) {
      if (fndIdx < foundation.length) {
        const c = foundation[fndIdx++];
        team.members.push({
          id: `m-${c.id}`,
          team_id: team.id,
          application_id: c.id,
          full_name: c.full_name,
          level: c.level,
          gender: c.gender || null,
          city: c.city,
          specialization: c.specialization,
          team_env: c.team_env,
          application_status: c.application_status,
          role_in_team: `مبتدئ ${slot + 1} (Foundation)`,
        });
      }
    }
  }

  return teams;
}
