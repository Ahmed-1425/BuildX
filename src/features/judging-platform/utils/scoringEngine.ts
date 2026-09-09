// =============================================================================
// BUILDx Hackathon Judging Platform - Scoring & Evaluation Engine
// =============================================================================

import {
  Team,
  Criterion,
  Evaluation,
  AwardCategory,
  AwardVote,
  JudgingSettings,
  TeamLeaderboardEntry,
  CategoryWinnerResult,
} from '../types';

export const CRITERION_IMPACT_ID = 'c1000000-0000-0000-0000-000000000007';
export const CRITERION_INNOVATION_ID = 'c1000000-0000-0000-0000-000000000002';
export const CRITERION_TECH_ID = 'c1000000-0000-0000-0000-000000000003';

/**
 * Calculates weighted score for a single criterion:
 * weightedPoints = (rawScore / 10) * criterionWeight
 */
export function calculateWeightedPoints(rawScore: number, weight: number): number {
  const clampedRaw = Math.max(0, Math.min(10, rawScore));
  return Number(((clampedRaw / 10) * weight).toFixed(4));
}

/**
 * Calculates the total score for one judge on one team:
 * Sum of (rawScore / 10) * criterionWeight across all 11 criteria (0 - 100).
 */
export function calculateJudgeTotal(
  evaluation: Evaluation | undefined,
  criteria: Criterion[]
): number {
  if (!evaluation || !evaluation.scores) return 0;
  let total = 0;
  for (const c of criteria) {
    const s = evaluation.scores[c.id];
    if (s && typeof s.rawScore === 'number') {
      total += calculateWeightedPoints(s.rawScore, c.weight);
    }
  }
  return Number(total.toFixed(2));
}

/**
 * Computes criterion averages for a team across submitted evaluations.
 */
export function calculateTeamCriterionAverages(
  teamId: string,
  evaluations: Evaluation[],
  criteria: Criterion[]
): Record<string, number> {
  const submitted = evaluations.filter(
    (e) => e.teamId === teamId && e.status === 'submitted'
  );
  const result: Record<string, number> = {};

  for (const c of criteria) {
    if (submitted.length === 0) {
      result[c.id] = 0;
      continue;
    }
    let sumRaw = 0;
    let count = 0;
    for (const ev of submitted) {
      const sc = ev.scores?.[c.id];
      if (sc && typeof sc.rawScore === 'number') {
        sumRaw += sc.rawScore;
        count++;
      }
    }
    result[c.id] = count > 0 ? Number((sumRaw / count).toFixed(2)) : 0;
  }
  return result;
}

/**
 * Generates sorted leaderboard entries with deterministic tie-breaking.
 */
export function computeLeaderboard(
  teams: Team[],
  evaluations: Evaluation[],
  criteria: Criterion[],
  judgesCount: number = 4
): TeamLeaderboardEntry[] {
  // Pre-calculate per-team metrics
  const rawEntries = teams.map((team) => {
    const teamEvals = evaluations.filter((e) => e.teamId === team.id);
    const submittedEvals = teamEvals.filter((e) => e.status === 'submitted');

    const judgeTotals: Record<string, number | null> = {};
    let totalScoreSum = 0;

    for (const ev of teamEvals) {
      const score = calculateJudgeTotal(ev, criteria);
      judgeTotals[ev.judgeId] = ev.status === 'submitted' ? score : null;
      if (ev.status === 'submitted') {
        totalScoreSum += score;
      }
    }

    const completedCount = submittedEvals.length;
    const finalAverage =
      completedCount > 0 ? Number((totalScoreSum / completedCount).toFixed(2)) : 0;

    const criterionAverages = calculateTeamCriterionAverages(
      team.id,
      evaluations,
      criteria
    );

    return {
      team,
      judgeTotals,
      completedEvaluations: completedCount,
      finalAverage,
      criterionAverages,
      impactAvg: criterionAverages[CRITERION_IMPACT_ID] || 0,
      innovationAvg: criterionAverages[CRITERION_INNOVATION_ID] || 0,
      techAvg: criterionAverages[CRITERION_TECH_ID] || 0,
    };
  });

  // Sort with deterministic tie-breaking policy:
  // 1. Higher final average score
  // 2. Higher average in "الأثر التشغيلي القابل للقياس" (Impact)
  // 3. Higher average in "الابتكار" (Innovation)
  // 4. Higher average in "جودة التنفيذ التقني" (Tech Execution)
  // 5. Team presentation order / code
  rawEntries.sort((a, b) => {
    if (b.finalAverage !== a.finalAverage) {
      return b.finalAverage - a.finalAverage;
    }
    if (b.impactAvg !== a.impactAvg) {
      return b.impactAvg - a.impactAvg;
    }
    if (b.innovationAvg !== a.innovationAvg) {
      return b.innovationAvg - a.innovationAvg;
    }
    if (b.techAvg !== a.techAvg) {
      return b.techAvg - a.techAvg;
    }
    return a.team.presentationOrder - b.team.presentationOrder;
  });

  // Compute final ranks and difference from above
  return rawEntries.map((entry, index) => {
    let diffFromAbove: number | null = null;
    let isTieBroken = false;
    let tieBreakNote: string | undefined = undefined;

    if (index > 0) {
      const prev = rawEntries[index - 1];
      diffFromAbove = Number((prev.finalAverage - entry.finalAverage).toFixed(2));
      if (prev.finalAverage === entry.finalAverage) {
        isTieBroken = true;
        if (prev.impactAvg !== entry.impactAvg) {
          tieBreakNote = 'فصل التعادل بمعدل الأثر التشغيلي';
        } else if (prev.innovationAvg !== entry.innovationAvg) {
          tieBreakNote = 'فصل التعادل بمعدل الابتكار';
        } else if (prev.techAvg !== entry.techAvg) {
          tieBreakNote = 'فصل التعادل بجودة التنفيذ التقني';
        }
      }
    }

    return {
      rank: index + 1,
      team: entry.team,
      judgeTotals: entry.judgeTotals,
      completedEvaluations: entry.completedEvaluations,
      finalAverage: entry.finalAverage,
      diffFromAbove,
      criterionAverages: entry.criterionAverages,
      isTieBroken,
      tieBreakNote,
    };
  });
}

/**
 * Returns the Top 3 team IDs from current leaderboard.
 */
export function getTopThreeTeamIds(leaderboard: TeamLeaderboardEntry[]): string[] {
  return leaderboard.slice(0, 3).map((e) => e.team.id);
}

/**
 * Critical Category Award Eligibility:
 * Any team finishing in the top three overall places CANNOT win any category award.
 */
export function getCategoryEligibleTeams(
  allTeams: Team[],
  leaderboard: TeamLeaderboardEntry[]
): Team[] {
  const topThreeIds = new Set(getTopThreeTeamIds(leaderboard));
  return allTeams.filter((t) => !topThreeIds.has(t.id));
}

/**
 * Calculates category award winners and detects invalid votes (needs_revote).
 */
export function computeCategoryWinners(
  awards: AwardCategory[],
  allTeams: Team[],
  votes: AwardVote[],
  leaderboard: TeamLeaderboardEntry[],
  judges: { id: string; name: string }[],
  settings: JudgingSettings
): CategoryWinnerResult[] {
  const topThreeIds = new Set(getTopThreeTeamIds(leaderboard));
  const teamMap = new Map(allTeams.map((t) => [t.id, t]));
  const leaderboardMap = new Map(leaderboard.map((e) => [e.team.id, e]));

  const assignedWinningTeamIds = new Set<string>();

  return awards.map((category) => {
    // Collect votes for this category
    const categoryVotes = votes.filter((v) => v.awardCategoryId === category.id);

    // Track judge votes breakdown
    const judgeVotesBreakdown = judges
      .filter((j) => j.name !== 'إدارة التحكيم (Admin)')
      .map((judge) => {
        const vote = categoryVotes.find((v) => v.judgeId === judge.id);
        if (!vote) {
          return {
            judgeId: judge.id,
            judgeName: judge.name,
            teamId: '',
            teamCode: '--',
            teamName: 'لم يصوت بعد',
            status: 'valid' as const,
          };
        }
        const team = teamMap.get(vote.teamId);
        const isNowTopThree = topThreeIds.has(vote.teamId);
        const effectiveStatus = isNowTopThree ? ('needs_revote' as const) : ('valid' as const);

        return {
          judgeId: judge.id,
          judgeName: judge.name,
          teamId: vote.teamId,
          teamCode: team?.teamCode || '--',
          teamName: team?.projectName || team?.teamName || '--',
          status: effectiveStatus,
        };
      });

    // Count only valid votes for eligible teams (NOT in top 3)
    const validVoteCounts: Record<string, number> = {};
    for (const v of judgeVotesBreakdown) {
      if (v.status === 'valid' && v.teamId && !topThreeIds.has(v.teamId)) {
        validVoteCounts[v.teamId] = (validVoteCounts[v.teamId] || 0) + 1;
      }
    }

    // Sort candidate teams by:
    // 1. Valid vote count
    // 2. Related criterion average score
    // 3. Overall final average
    const candidateTeams = Object.keys(validVoteCounts).map((teamId) => {
      const team = teamMap.get(teamId)!;
      const lb = leaderboardMap.get(teamId);
      const relatedAvg = lb?.criterionAverages[category.relatedCriterionId] || 0;
      const finalAvg = lb?.finalAverage || 0;
      return {
        team,
        votes: validVoteCounts[teamId],
        relatedAvg,
        finalAvg,
      };
    });

    candidateTeams.sort((a, b) => {
      if (b.votes !== a.votes) return b.votes - a.votes;
      if (b.relatedAvg !== a.relatedAvg) return b.relatedAvg - a.relatedAvg;
      return b.finalAvg - a.finalAvg;
    });

    // Filter out previous winners if duplicate awards are prevented
    let winnerCandidate = candidateTeams[0];
    if (settings.allowRepeatCategoryWinners === false) {
      winnerCandidate = candidateTeams.find((c) => !assignedWinningTeamIds.has(c.team.id)) || candidateTeams[0];
    }

    let winningTeam: Team | null = null;
    let votesCount = 0;
    let relatedCriterionAverage = 0;
    let isTied = false;
    let tieBreakApplied: string | undefined = undefined;

    if (winnerCandidate && winnerCandidate.votes > 0) {
      winningTeam = winnerCandidate.team;
      votesCount = winnerCandidate.votes;
      relatedCriterionAverage = winnerCandidate.relatedAvg;
      assignedWinningTeamIds.add(winningTeam.id);

      // Check if there was a tie on votes
      const runnerUp = candidateTeams[1];
      if (runnerUp && runnerUp.votes === winnerCandidate.votes) {
        isTied = true;
        if (winnerCandidate.relatedAvg !== runnerUp.relatedAvg) {
          tieBreakApplied = `فصل التعادل بمعدل معيار: ${category.relatedCriterionName}`;
        } else {
          tieBreakApplied = 'فصل التعادل بالمعدل النهائي العام';
        }
      }
    }

    const totalJudges = judges.filter((j) => j.name !== 'إدارة التحكيم (Admin)').length || 4;
    const percentage = totalJudges > 0 ? Number(((votesCount / totalJudges) * 100).toFixed(0)) : 0;

    return {
      category,
      winningTeam,
      votesCount,
      totalJudgesCount: totalJudges,
      percentage,
      relatedCriterionAverage,
      isTied,
      tieBreakApplied,
      judgeVotesBreakdown,
    };
  });
}
