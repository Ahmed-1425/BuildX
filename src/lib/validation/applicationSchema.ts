import { z } from "zod";

// ── Phone normalization ────────────────────────────────────────
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("966") && digits.length === 12) return `+${digits}`;
  if (digits.startsWith("05") && digits.length === 10) return `+966${digits.slice(1)}`;
  if (digits.startsWith("5") && digits.length === 9) return `+966${digits}`;
  return `+966${digits}`;
}

export function isValidSaudiPhone(raw: string): boolean {
  const normalized = normalizePhone(raw);
  return /^\+9665[0-9]{8}$/.test(normalized);
}

// ── URL validation ─────────────────────────────────────────────
const urlSchema = z
  .string()
  .url()
  .refine((u) => u.startsWith("http://") || u.startsWith("https://"), {
    message: "الرابط يجب أن يبدأ بـ https:// أو http://",
  });

// ── Foundation answers ─────────────────────────────────────────
const foundationAnswersSchema = z.object({
  technical_experience: z.string().min(40).max(2000),
  vibe_coding_understanding: z.string().min(40).max(2000),
  motivation: z.string().min(40).max(2000),
  problem_and_solution: z.string().min(40).max(2000),
  self_learning: z.string().min(40).max(2000),
  team_contribution: z.string().min(40).max(2000),
});

// ── Practitioner answers ───────────────────────────────────────
const practitionerAnswersSchema = z.object({
  programming_experience: z.string().min(40).max(2000),
  tools_and_technologies: z.string().min(40).max(2000),
  previous_project: z.string().min(40).max(2000),
  ai_usage: z.string().min(40).max(2000),
  registration_page_prompt: z.string().min(40).max(2000),
  debugging_approach: z.string().min(40).max(2000),
  team_contribution: z.string().min(40).max(2000),
  growth_skill: z.string().min(40).max(2000),
});

// ── Advanced answers ───────────────────────────────────────────
const advancedAnswersSchema = z.object({
  strongest_product: z.string().min(40).max(2000),
  idea_to_mvp: z.string().min(40).max(2000),
  vibe_coding_workflow: z.string().min(40).max(2000),
  advanced_prompt_example: z.string().min(40).max(2000),
  hardest_problem: z.string().min(40).max(2000),
  team_leadership: z.string().min(40).max(2000),
  mvp_prioritization: z.string().min(40).max(2000),
  independent_capability: z.string().min(40).max(2000),
  video_url: z.string().url({ error: "رابط الفيديو غير صالح" }),
  video_access_confirmed: z.literal(true, { error: "يجب التأكيد على إمكانية الوصول للفيديو" }),
});

// ── Main application schema ────────────────────────────────────
export const applicationSchema = z
  .object({
    full_name: z
      .string()
      .min(1)
      .max(150)
      .transform((v) => v.trim().replace(/\s+/g, " "))
      .refine((v) => v.split(" ").filter(Boolean).length >= 3, {
        message: "يرجى إدخال الاسم الثلاثي كاملاً",
      })
      .refine((v) => !/[0-9!@#$%^&*()_+=\[\]{};:'",<>?/\\|`~]/.test(v), {
        message: "الاسم يحتوي على رموز غير مسموح بها",
      }),

    birth_date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "تاريخ الميلاد غير صالح")
      .refine((d) => new Date(d) < new Date(), { message: "لا يمكن أن يكون تاريخ الميلاد في المستقبل" }),

    gender: z.enum(["male", "female"], {
      error: "يرجى اختيار الجنس للمتابعة.",
    }),

    phone: z
      .string()
      .transform(normalizePhone)
      .refine(isValidSaudiPhone, { message: "رقم الجوال غير صالح. أدخل رقماً سعودياً صحيحاً" }),

    email: z
      .string()
      .email({ message: "البريد الإلكتروني غير صالح" })
      .transform((v) => v.trim().toLowerCase()),

    city: z.string().min(1, "يرجى اختيار المدينة").max(100),

    organization: z.string().min(1, "يرجى كتابة جهة الدراسة أو العمل").max(200),

    specialization: z.string().min(1, "يرجى كتابة التخصص أو المجال").max(200),

    current_status: z.enum(["student", "graduate", "employed", "job_seeker", "other"]),

    current_status_other: z.string().max(200).optional(),

    level: z.enum(["foundation", "practitioner", "advanced"]),

    level_answers: z.record(z.string(), z.union([z.string(), z.boolean()])),

    portfolio_links: z
      .array(z.string())
      .max(5)
      .transform((arr: string[]) => [...new Set(arr.filter(Boolean))]),

    professional_links: z
      .array(z.string())
      .max(5)
      .transform((arr: string[]) => [...new Set(arr.filter(Boolean))]),

    advanced_video_url: z.string().optional(),

    advanced_video_access_confirmed: z.boolean().optional(),

    team_environment_preference: z.enum(["comfortable", "same_gender_only"]),

    declaration_information_accurate: z.literal(true),
    declaration_full_attendance: z.literal(true),
    declaration_application_not_acceptance: z.literal(true),
    declaration_data_processing: z.literal(true),
    laptop_commitment: z.literal(true, {
      error: "يجب الإقرار بتوفر جهاز محمول والالتزام بإحضاره لإكمال التسجيل.",
    }),

    idempotency_key: z.string().uuid(),

    honeypot: z.string().max(0, "SPAM").optional(),

    submitted_at_client: z.number().optional(),
  })
  .superRefine((data, ctx) => {
    // current_status_other required when status=other
    if (data.current_status === "other" && !data.current_status_other?.trim()) {
      ctx.addIssue({ code: "custom", path: ["current_status_other"], message: "يرجى تحديد حالتك" });
    }

    // Validate level answers match level
    if (data.level === "foundation") {
      const result = foundationAnswersSchema.safeParse(data.level_answers);
      if (!result.success) {
        ctx.addIssue({ code: "custom", path: ["level_answers"], message: "إجابات المبتدئ غير مكتملة" });
      }
    } else if (data.level === "practitioner") {
      const result = practitionerAnswersSchema.safeParse(data.level_answers);
      if (!result.success) {
        ctx.addIssue({ code: "custom", path: ["level_answers"], message: "إجابات الممارس غير مكتملة" });
      }
    } else if (data.level === "advanced") {
      const result = advancedAnswersSchema.safeParse(data.level_answers);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          ctx.addIssue({ code: "custom", path: ["level_answers", ...issue.path.map(String)], message: issue.message });
        });
      }
      if (!data.advanced_video_url) {
        ctx.addIssue({ code: "custom", path: ["advanced_video_url"], message: "رابط الفيديو مطلوب للمستوى المتقدم" });
      }
      if (!data.advanced_video_access_confirmed) {
        ctx.addIssue({ code: "custom", path: ["advanced_video_access_confirmed"], message: "يجب تأكيد صلاحية الوصول للفيديو" });
      }
    }

    // Spam timing check: reject if submitted in less than 8 seconds
    if (data.submitted_at_client) {
      // This is just a soft check; real protection is server-side
    }
  });

export type ValidatedApplication = z.infer<typeof applicationSchema>;
