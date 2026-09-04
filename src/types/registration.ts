// ═══════════════════════════════════════════════════════════════
// BUILDx Registration — TypeScript Types
// ═══════════════════════════════════════════════════════════════

export type Level = "foundation" | "practitioner" | "advanced";
export type TeamEnvPreference = "comfortable" | "same_gender_only";
export type ApplicationStatus = "submitted" | "under_review" | "accepted" | "waitlisted" | "rejected";
export type CurrentStatus = "student" | "graduate" | "employed" | "job_seeker" | "other";
export type Gender = "male" | "female";

export function getGenderLabel(gender: Gender | "" | null | undefined | string): string {
  if (gender === "male") return "ذكر";
  if (gender === "female") return "أنثى";
  return "غير محدد";
}

// ── Level Answers ──────────────────────────────────────────────

export interface FoundationAnswers {
  technical_experience: string;
  vibe_coding_understanding: string;
  motivation: string;
  problem_and_solution: string;
  self_learning: string;
  team_contribution: string;
}

export interface PractitionerAnswers {
  programming_experience: string;
  tools_and_technologies: string;
  previous_project: string;
  ai_usage: string;
  registration_page_prompt: string;
  debugging_approach: string;
  team_contribution: string;
  growth_skill: string;
}

export interface AdvancedAnswers {
  strongest_product: string;
  idea_to_mvp: string;
  vibe_coding_workflow: string;
  advanced_prompt_example: string;
  hardest_problem: string;
  team_leadership: string;
  mvp_prioritization: string;
  independent_capability: string;
  video_url: string;
  video_access_confirmed: boolean;
}

// ── Discriminated Union ────────────────────────────────────────

export type LevelData =
  | { level: "foundation"; answers: FoundationAnswers }
  | { level: "practitioner"; answers: PractitionerAnswers }
  | { level: "advanced"; answers: AdvancedAnswers };

// ── Form State ─────────────────────────────────────────────────

export interface PersonalData {
  full_name: string;
  birth_date: string;
  gender: Gender | "";
  phone: string;
  email: string;
  email_confirm: string;
  city: string;
  city_other: string;
  organization: string;
  specialization: string;
  current_status: CurrentStatus | "";
  current_status_other: string;
}

export interface FormState {
  personal: PersonalData;
  levelData: LevelData | null;
  portfolio_links: string[];
  professional_links: string[];
  team_env: TeamEnvPreference | "";
  declarations: {
    information_accurate: boolean;
    full_attendance: boolean;
    application_not_acceptance: boolean;
    data_processing: boolean;
    laptop_commitment: boolean;
  };
  currentStep: number;
  idempotency_key: string;
}

// ── API Payload ────────────────────────────────────────────────

export interface ApplicationPayload {
  full_name: string;
  birth_date: string;
  gender: Gender;
  phone: string;
  email: string;
  city: string;
  organization: string;
  specialization: string;
  current_status: string;
  current_status_other?: string;
  level: Level;
  level_answers: Record<string, string | boolean>;
  portfolio_links: string[];
  professional_links: string[];
  advanced_video_url?: string;
  advanced_video_access_confirmed?: boolean;
  team_environment_preference: TeamEnvPreference;
  declaration_information_accurate: boolean;
  declaration_full_attendance: boolean;
  declaration_application_not_acceptance: boolean;
  declaration_data_processing: boolean;
  laptop_commitment: boolean;
  idempotency_key: string;
  honeypot?: string;
  submitted_at_client?: number;
}

export interface ApplicationResponse {
  success: true;
  reference_code: string;
}

export interface ApplicationError {
  success: false;
  error: string;
  code?: "DUPLICATE_EMAIL" | "DUPLICATE_PHONE" | "DUPLICATE_IDEMPOTENCY" | "VALIDATION" | "SERVER_ERROR";
}
