// =============================================================================
// BUILDx Hackathon Judging Platform - TypeScript Domain Types
// =============================================================================

export type JudgeRole = 'judge' | 'admin';

export interface Judge {
  id: string;
  name: string;
  role: JudgeRole;
  isActive: boolean;
  isLocked?: boolean;
  mustChangePin?: boolean;
}

export interface JudgeSession {
  token: string;
  judge: Judge;
  expiresAt: string;
}

export type TeamStatus = 'pending' | 'ready' | 'presented' | 'evaluation_complete';

export interface TeamMember {
  name: string;
  role?: string;
  avatar?: string;
}

export interface Team {
  id: string;
  teamCode: string; // '10', '20', ... '80'
  teamName: string;
  projectName: string;
  challengeTrack: string;
  description: string;
  teamMembers: TeamMember[];
  presentationOrder: number;
  presentationUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  notes?: string;
  mascotUrl: string;
  status: TeamStatus;
  accentColor: string;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Criterion {
  id: string;
  orderNum: number;
  title: string;
  weight: number; // e.g. 10 or 5 (sums to 100)
  description: string;
  isActive: boolean;
}

export interface EvaluationScore {
  criterionId: string;
  rawScore: number; // 0 to 10
  weightedPoints: number; // (rawScore / 10) * weight
  justification: string;
  updatedAt?: string;
}

export type EvaluationStatus = 'draft' | 'submitted' | 'needs_revision' | 'locked';

export interface Evaluation {
  id: string;
  judgeId: string;
  teamId: string;
  status: EvaluationStatus;
  strengths: string;
  improvements: string;
  finalRecommendation: string;
  totalWeightedScore: number;
  version: number;
  submittedAt?: string;
  updatedAt: string;
  scores: Record<string, EvaluationScore>; // keyed by criterionId
}

export interface AwardCategory {
  id: string;
  orderNum: number;
  title: string;
  description: string;
  relatedCriterionId: string;
  relatedCriterionName: string;
}

export type VoteStatus = 'valid' | 'needs_revote';

export interface AwardVote {
  id: string;
  judgeId: string;
  awardCategoryId: string;
  teamId: string;
  status: VoteStatus;
  revoteReason?: string;
  updatedAt: string;
}

export interface JudgingSettings {
  isJudgingOpen: boolean;
  areResultsLocked: boolean;
  areResultsPublished: boolean;
  allowRepeatCategoryWinners: boolean;
  allowSubFourCalculation: boolean;
  subFourReason?: string;
  minJustificationLength: number;
  publishedRevealStage: number; // 0: unrevealed, 1: awards, 2: 3rd place, 3: 2nd place, 4: 1st place
  tieBreakPriority: string[];
}

export interface ResultOverride {
  id: string;
  teamId: string;
  overrideType: 'position_override' | 'score_override' | 'award_override' | 'tie_break_decision';
  previousValue?: string;
  newValue: string;
  reason: string;
  adminId: string;
  adminName: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId?: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: Record<string, any>;
  reason?: string;
  createdAt: string;
}

export interface TeamLeaderboardEntry {
  rank: number;
  team: Team;
  judgeTotals: Record<string, number | null>; // judgeId -> score (0-100) or null
  completedEvaluations: number;
  finalAverage: number;
  diffFromAbove: number | null;
  criterionAverages: Record<string, number>; // criterionId -> average
  isTieBroken?: boolean;
  tieBreakNote?: string;
}

export interface CategoryWinnerResult {
  category: AwardCategory;
  winningTeam: Team | null;
  votesCount: number;
  totalJudgesCount: number;
  percentage: number;
  relatedCriterionAverage: number;
  isTied: boolean;
  tieBreakApplied?: string;
  judgeVotesBreakdown: {
    judgeId: string;
    judgeName: string;
    teamId: string;
    teamCode: string;
    teamName: string;
    status: VoteStatus;
  }[];
}
