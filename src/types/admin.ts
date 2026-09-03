// ═══════════════════════════════════════════════════════════════
// BUILDx Admin Dashboard — TypeScript Types
// ═══════════════════════════════════════════════════════════════

import type { Level, TeamEnvPreference, FoundationAnswers, PractitionerAnswers, AdvancedAnswers } from "./registration";

export type AdminRole = "super_admin" | "admin" | "reviewer";

export interface AdminUser {
  id: string;
  full_name: string;
  email?: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type ExtendedApplicationStatus =
  | "submitted"
  | "under_review"
  | "preliminary_candidate"
  | "accepted"
  | "waitlisted"
  | "rejected"
  | "confirmed"
  | "withdrawn";

export type OverallRecommendation =
  | "strong_yes"
  | "yes"
  | "maybe"
  | "no"
  | "strong_no";

export interface ApplicationReview {
  id: string;
  application_id: string;
  reviewer_id: string;
  reviewer_name?: string;
  understanding_score: number;
  motivation_score: number;
  technical_readiness_score: number;
  problem_solving_score: number;
  teamwork_score: number;
  communication_score: number;
  overall_recommendation: OverallRecommendation;
  strengths?: string | null;
  concerns?: string | null;
  internal_notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationNote {
  id: string;
  application_id: string;
  author_id: string;
  author_name?: string;
  note: string;
  is_pinned: boolean;
  deleted_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface StatusHistoryEntry {
  id: string;
  application_id: string;
  actor_id?: string | null;
  actor_name?: string | null;
  previous_status?: string | null;
  new_status: ExtendedApplicationStatus;
  note?: string | null;
  created_at: string;
}

export interface AuditLogEntry {
  id: string;
  actor_id?: string | null;
  actor_name?: string | null;
  application_id?: string | null;
  action: string;
  previous_data?: Record<string, unknown> | null;
  new_data?: Record<string, unknown> | null;
  note?: string | null;
  created_at: string;
}

export interface TeamMemberItem {
  id: string;
  team_id: string;
  application_id: string;
  full_name: string;
  level: Level;
  city: string;
  team_env: TeamEnvPreference;
  role_in_team?: string | null;
}

export interface TeamItem {
  id: string;
  name: string;
  number: number;
  members: TeamMemberItem[];
}

export interface ApplicationListItem {
  id: string;
  reference_code: string;
  full_name: string;
  email: string;
  phone: string;
  birth_date: string;
  city: string;
  organization: string;
  specialization: string;
  current_status: string;
  current_status_other?: string | null;
  level: Level;
  application_status: ExtendedApplicationStatus;
  team_environment_preference: TeamEnvPreference;
  submitted_at: string;
  updated_at: string;
  reviews_count: number;
  avg_score: number | null;
  has_video: boolean;
  my_review?: ApplicationReview | null;
}

export interface ApplicationDetailItem extends ApplicationListItem {
  level_answers: Record<string, string | boolean>;
  portfolio_links: string[];
  professional_links: string[];
  advanced_video_url?: string | null;
  advanced_video_access_confirmed?: boolean;
  reviews: ApplicationReview[];
  notes: ApplicationNote[];
  history: StatusHistoryEntry[];
}

export interface DashboardStats {
  total: number;
  submitted: number;
  under_review: number;
  preliminary_candidate: number;
  accepted: number;
  waitlisted: number;
  rejected: number;
  confirmed: number;
  withdrawn: number;
  today: number;
  last_7_days: number;
  by_level: {
    foundation: number;
    practitioner: number;
    advanced: number;
  };
  by_status: Record<string, number>;
  by_team_env: {
    comfortable: number;
    same_gender_only: number;
  };
  top_cities: { city: string; count: number }[];
  unreviewed_count: number;
  avg_score_overall: number | null;
  recent_applications: ApplicationListItem[];
  recent_activities: AuditLogEntry[];
}

export interface FilterParams {
  search?: string;
  level?: string;
  status?: string;
  city?: string;
  current_status?: string;
  team_env?: string;
  reviewed?: "reviewed" | "unreviewed" | "reviewed_by_me" | "not_reviewed_by_me";
  has_video?: "yes" | "no";
  sort_by?: "submitted_at" | "full_name" | "avg_score" | "updated_at";
  sort_order?: "asc" | "desc";
  page?: number;
  limit?: number;
}
