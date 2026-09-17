import { isValidSaudiPhone } from "./applicationSchema";
import type { FormState, PersonalData, LevelData } from "@/types/registration";

export interface FormValidationError {
  step: number;
  stepTitleAr: string;
  stepTitleEn: string;
  fieldId: string;
  fieldLabelAr: string;
  fieldLabelEn: string;
  messageAr: string;
  messageEn: string;
}

export const QUESTION_LABELS: Record<string, { ar: string; en: string }> = {
  technical_experience: { ar: "تجربتك مع التقنية والذكاء الاصطناعي", en: "Tech & AI experience" },
  vibe_coding_understanding: { ar: "مفهوم Vibe Coding", en: "Vibe Coding understanding" },
  motivation: { ar: "دافع التقديم على BUILDx", en: "Motivation to apply" },
  problem_and_solution: { ar: "المشكلة الحقيقية وفكرة الحل", en: "Real problem & solution" },
  self_learning: { ar: "تجربة التعلم الذاتي", en: "Self-learning experience" },
  team_contribution: { ar: "المساهمة في الفريق", en: "Team contribution" },
  programming_experience: { ar: "الخبرة في البرمجة وبناء المنتجات", en: "Programming experience" },
  tools_and_technologies: { ar: "الأدوات والتقنيات المستخدمة", en: "Tools & technologies used" },
  previous_project: { ar: "مشروع رقمي سابق", en: "Previous digital project" },
  ai_usage: { ar: "استخدام الذكاء الاصطناعي أثناء البرمجة", en: "AI usage in programming" },
  registration_page_prompt: { ar: "Prompt بناء صفحة التسجيل", en: "Registration page prompt" },
  debugging_approach: { ar: "طريقة معالجة الأخطاء والـ Debugging", en: "Debugging approach" },
  growth_skill: { ar: "المهارة المطلوبة للتطور", en: "Skill needed to develop" },
  strongest_product: { ar: "أقوى منتج رقمي قمت ببنائه", en: "Strongest digital product" },
  idea_to_mvp: { ar: "الانتقال من الفكرة إلى MVP", en: "From idea to MVP" },
  vibe_coding_workflow: { ar: "توظيف Vibe Coding في البناء", en: "Vibe coding workflow" },
  advanced_prompt_example: { ar: "Prompt متقدم يعكس مستواك", en: "Advanced prompt example" },
  hardest_problem: { ar: "أصعب مشكلة واجهتك وحلها", en: "Hardest problem faced" },
  team_leadership: { ar: "إدارة الفريق وتوزيع المهام", en: "Team leadership" },
  mvp_prioritization: { ar: "ترتيب الأولويات خلال 48 ساعة", en: "48h MVP prioritization" },
  independent_capability: { ar: "القدرة على التنفيذ المستقل", en: "Independent capability" },
  video_url: { ar: "رابط فيديو استعراض المشروع", en: "Showcase video link" },
  video_access_confirmed: { ar: "تأكيد صلاحية الوصول لرابط الفيديو", en: "Video access confirmation" },
};

export function validatePersonal(p: PersonalData, locale: string): Partial<Record<keyof PersonalData, string>> {
  const e: Partial<Record<keyof PersonalData, string>> = {};
  const ar = locale === "ar";
  const trim = (v: string) => (v || "").trim().replace(/\s+/g, " ");
  const name = trim(p.full_name);

  if (!name) {
    e.full_name = ar ? "يرجى كتابة الاسم الثلاثي كاملًا." : "Full name is required";
  } else if (name.split(" ").filter(Boolean).length < 3) {
    e.full_name = ar ? "يرجى كتابة الاسم الثلاثي كاملًا." : "Please enter your full three-part name";
  } else if (/[0-9!@#$%^&*()_+=\[\]{};:'",<>?/\\|`~]/.test(name)) {
    e.full_name = ar ? "الاسم يحتوي على رموز غير مسموح بها" : "Name contains invalid characters";
  }

  if (!p.birth_date) {
    e.birth_date = ar ? "تاريخ الميلاد مطلوب" : "Date of birth is required";
  } else if (new Date(p.birth_date) >= new Date()) {
    e.birth_date = ar ? "تاريخ الميلاد غير صالح" : "Invalid date of birth";
  }

  if (!p.gender) {
    e.gender = ar ? "يرجى اختيار الجنس." : "Please select your gender.";
  }

  if (!p.phone) {
    e.phone = ar ? "رقم الجوال مطلوب" : "Mobile number is required";
  } else if (!isValidSaudiPhone(p.phone)) {
    e.phone = ar ? "رقم الجوال غير صالح. أدخل رقماً سعودياً صحيحاً" : "Invalid mobile number. Enter a valid Saudi number";
  }

  const cleanEmail = (p.email || "").trim().toLowerCase();
  const cleanConfirm = (p.email_confirm || "").trim().toLowerCase();

  if (!cleanEmail) {
    e.email = ar ? "البريد الإلكتروني مطلوب" : "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    e.email = ar ? "البريد الإلكتروني غير صالح" : "Invalid email address";
  }

  if (!cleanConfirm) {
    e.email_confirm = ar ? "تأكيد البريد الإلكتروني مطلوب" : "Email confirmation is required";
  } else if (cleanEmail !== cleanConfirm) {
    e.email_confirm = ar ? "البريد الإلكتروني غير متطابق، تأكد من كتابته بالشكل نفسه." : "Emails do not match, please ensure they are identical.";
  }

  if (!p.city) {
    e.city = ar ? "المدينة مطلوبة" : "City is required";
  }

  if ((p.city === "أخرى" || p.city === "Other") && !p.city_other.trim()) {
    e.city_other = ar ? "يرجى كتابة اسم مدينتك" : "Please enter your city";
  }

  if (!p.organization.trim()) {
    e.organization = ar ? "جهة الدراسة أو العمل مطلوبة" : "Organization is required";
  }

  if (!p.specialization.trim()) {
    e.specialization = ar ? "التخصص أو المجال مطلوب" : "Specialization is required";
  }

  if (!p.current_status) {
    e.current_status = ar ? "يرجى اختيار حالتك الحالية" : "Please select your current status";
  }

  if (p.current_status === "other" && !p.current_status_other.trim()) {
    e.current_status_other = ar ? "يرجى تحديد حالتك" : "Please specify your status";
  }

  return e;
}

export function validateAnswers(levelData: LevelData, locale: string): Record<string, string> {
  const e: Record<string, string> = {};
  const ar = locale === "ar";
  const MIN = 40;
  const msg = () => (ar ? "هذه الإجابة أقل من الحد الأدنى المطلوب (40 حرفاً)." : `Answer must be at least ${MIN} characters`);

  const answers = levelData.answers as unknown as Record<string, string | boolean>;
  for (const [key, val] of Object.entries(answers)) {
    if (key === "video_access_confirmed") {
      if (levelData.level === "advanced" && !val) {
        e[key] = ar ? "يجب تأكيد صلاحية الوصول لرابط الفيديو" : "Must confirm video access";
      }
    } else if (key === "video_url") {
      if (levelData.level === "advanced") {
        if (!val || typeof val !== "string" || !val.trim().startsWith("http")) {
          e[key] = ar ? "رابط الفيديو مطلوب ويجب أن يبدأ بـ https://" : "Video URL is required and must start with https://";
        }
      }
    } else {
      if (typeof val === "string" && val.trim().length < MIN) {
        e[key] = msg();
      }
    }
  }
  return e;
}

export function validateDeclarations(
  declarations: FormState["declarations"],
  locale: string
): Partial<Record<keyof FormState["declarations"], string>> {
  const e: Partial<Record<keyof FormState["declarations"], string>> = {};
  const ar = locale === "ar";

  if (!declarations.laptop_commitment) {
    e.laptop_commitment = ar
      ? "يجب الإقرار بتوفر جهاز محمول صالح للاستخدام والالتزام بإحضاره."
      : "You must commit to having and bringing a functional laptop.";
  }
  if (!declarations.information_accurate) {
    e.information_accurate = ar
      ? "يجب الموافقة على هذا الإقرار."
      : "Must confirm accuracy of information.";
  }
  if (!declarations.full_attendance) {
    e.full_attendance = ar
      ? "يجب الموافقة على هذا الإقرار."
      : "Must commit to full attendance.";
  }
  if (!declarations.application_not_acceptance) {
    e.application_not_acceptance = ar
      ? "يجب الموافقة على هذا الإقرار."
      : "Must understand application criteria.";
  }
  if (!declarations.data_processing) {
    e.data_processing = ar
      ? "يجب الموافقة على هذا الإقرار."
      : "Must agree to data processing.";
  }

  return e;
}

export function validateAllSteps(state: FormState): FormValidationError[] {
  const errs: FormValidationError[] = [];

  // Step 1: Personal Data
  const s1Ar = "الخطوة 1: البيانات الشخصية";
  const s1En = "Step 1: Personal Information";
  const p = state.personal;
  const trim = (v: string) => (v || "").trim().replace(/\s+/g, " ");
  const name = trim(p.full_name);

  if (!name) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "full_name",
      fieldLabelAr: "الاسم الثلاثي",
      fieldLabelEn: "Full Name",
      messageAr: "يرجى كتابة الاسم الثلاثي كاملًا.",
      messageEn: "Please enter your full three-part name",
    });
  } else if (name.split(" ").filter(Boolean).length < 3) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "full_name",
      fieldLabelAr: "الاسم الثلاثي",
      fieldLabelEn: "Full Name",
      messageAr: "يرجى كتابة الاسم الثلاثي كاملًا.",
      messageEn: "Please enter your full three-part name",
    });
  } else if (/[0-9!@#$%^&*()_+=\[\]{};:'",<>?/\\|`~]/.test(name)) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "full_name",
      fieldLabelAr: "الاسم الثلاثي",
      fieldLabelEn: "Full Name",
      messageAr: "الاسم يحتوي على رموز غير مسموح بها",
      messageEn: "Name contains invalid characters",
    });
  }

  if (!p.birth_date) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "birth_date",
      fieldLabelAr: "تاريخ الميلاد",
      fieldLabelEn: "Date of Birth",
      messageAr: "تاريخ الميلاد مطلوب",
      messageEn: "Date of birth is required",
    });
  } else if (new Date(p.birth_date) >= new Date()) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "birth_date",
      fieldLabelAr: "تاريخ الميلاد",
      fieldLabelEn: "Date of Birth",
      messageAr: "تاريخ الميلاد غير صالح",
      messageEn: "Invalid date of birth",
    });
  }

  if (!p.gender) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "gender",
      fieldLabelAr: "الجنس",
      fieldLabelEn: "Gender",
      messageAr: "يرجى اختيار الجنس.",
      messageEn: "Please select your gender",
    });
  }

  if (!p.phone) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "phone",
      fieldLabelAr: "رقم الجوال",
      fieldLabelEn: "Mobile Number",
      messageAr: "رقم الجوال مطلوب",
      messageEn: "Mobile number is required",
    });
  } else if (!isValidSaudiPhone(p.phone)) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "phone",
      fieldLabelAr: "رقم الجوال",
      fieldLabelEn: "Mobile Number",
      messageAr: "رقم الجوال غير صالح. أدخل رقماً سعودياً صحيحاً",
      messageEn: "Invalid Saudi mobile number",
    });
  }

  const cleanEmail = (p.email || "").trim().toLowerCase();
  const cleanConfirm = (p.email_confirm || "").trim().toLowerCase();

  if (!cleanEmail) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "email",
      fieldLabelAr: "البريد الإلكتروني",
      fieldLabelEn: "Email",
      messageAr: "البريد الإلكتروني مطلوب",
      messageEn: "Email is required",
    });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "email",
      fieldLabelAr: "البريد الإلكتروني",
      fieldLabelEn: "Email",
      messageAr: "البريد الإلكتروني غير صالح",
      messageEn: "Invalid email address",
    });
  }

  if (!cleanConfirm) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "email_confirm",
      fieldLabelAr: "تأكيد البريد الإلكتروني",
      fieldLabelEn: "Confirm Email",
      messageAr: "تأكيد البريد الإلكتروني مطلوب",
      messageEn: "Email confirmation is required",
    });
  } else if (cleanEmail !== cleanConfirm) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "email_confirm",
      fieldLabelAr: "تأكيد البريد الإلكتروني",
      fieldLabelEn: "Confirm Email",
      messageAr: "البريد الإلكتروني غير متطابق، تأكد من كتابته بالشكل نفسه.",
      messageEn: "Emails do not match, please ensure they are identical.",
    });
  }

  if (!p.city) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "city",
      fieldLabelAr: "المدينة",
      fieldLabelEn: "City",
      messageAr: "المدينة مطلوبة",
      messageEn: "City is required",
    });
  } else if ((p.city === "أخرى" || p.city === "Other") && !p.city_other.trim()) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "city_other",
      fieldLabelAr: "اسم المدينة",
      fieldLabelEn: "City Name",
      messageAr: "يرجى كتابة اسم مدينتك",
      messageEn: "Please enter your city",
    });
  }

  if (!p.organization.trim()) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "organization",
      fieldLabelAr: "جهة الدراسة أو العمل",
      fieldLabelEn: "Organization",
      messageAr: "جهة الدراسة أو العمل مطلوبة",
      messageEn: "Organization is required",
    });
  }

  if (!p.specialization.trim()) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "specialization",
      fieldLabelAr: "التخصص أو المجال",
      fieldLabelEn: "Specialization",
      messageAr: "التخصص أو المجال مطلوب",
      messageEn: "Specialization is required",
    });
  }

  if (!p.current_status) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "current_status",
      fieldLabelAr: "الحالة الحالية",
      fieldLabelEn: "Current Status",
      messageAr: "يرجى اختيار حالتك الحالية",
      messageEn: "Please select your current status",
    });
  } else if (p.current_status === "other" && !p.current_status_other.trim()) {
    errs.push({
      step: 1,
      stepTitleAr: s1Ar,
      stepTitleEn: s1En,
      fieldId: "current_status_other",
      fieldLabelAr: "تحديد الحالة",
      fieldLabelEn: "Specify Status",
      messageAr: "يرجى تحديد حالتك",
      messageEn: "Please specify your status",
    });
  }

  // Step 2: Level Selection
  const s2Ar = "الخطوة 2: تحديد المستوى";
  const s2En = "Step 2: Level Selection";
  if (!state.levelData || !state.levelData.level) {
    errs.push({
      step: 2,
      stepTitleAr: s2Ar,
      stepTitleEn: s2En,
      fieldId: "level_cards",
      fieldLabelAr: "تحديد المستوى",
      fieldLabelEn: "Level Selection",
      messageAr: "يرجى اختيار مستواك (مبتدئ، ممارس، متقدم)",
      messageEn: "Please select your level",
    });
  }

  // Step 3: Level Questions
  const s3Ar = "الخطوة 3: أسئلة المستوى";
  const s3En = "Step 3: Level Questions";
  if (state.levelData) {
    const answers = state.levelData.answers as unknown as Record<string, string | boolean>;
    const MIN = 40;
    for (const [key, val] of Object.entries(answers)) {
      const qMeta = QUESTION_LABELS[key] || { ar: key, en: key };
      if (key === "video_access_confirmed") {
        if (state.levelData.level === "advanced" && !val) {
          errs.push({
            step: 3,
            stepTitleAr: s3Ar,
            stepTitleEn: s3En,
            fieldId: "video_access_confirmed",
            fieldLabelAr: qMeta.ar,
            fieldLabelEn: qMeta.en,
            messageAr: "يجب تأكيد صلاحية الوصول لرابط الفيديو",
            messageEn: "Must confirm video access permission",
          });
        }
      } else if (key === "video_url") {
        if (state.levelData.level === "advanced") {
          if (!val || typeof val !== "string" || !val.trim().startsWith("http")) {
            errs.push({
              step: 3,
              stepTitleAr: s3Ar,
              stepTitleEn: s3En,
              fieldId: "video_url",
              fieldLabelAr: qMeta.ar,
              fieldLabelEn: qMeta.en,
              messageAr: "رابط الفيديو مطلوب ويجب أن يبدأ بـ https://",
              messageEn: "Video URL is required and must start with https://",
            });
          }
        }
      } else if (typeof val === "string") {
        if (val.trim().length < MIN) {
          errs.push({
            step: 3,
            stepTitleAr: s3Ar,
            stepTitleEn: s3En,
            fieldId: key,
            fieldLabelAr: qMeta.ar,
            fieldLabelEn: qMeta.en,
            messageAr: "هذه الإجابة أقل من الحد الأدنى المطلوب (40 حرفاً).",
            messageEn: `Answer must be at least ${MIN} characters`,
          });
        }
      }
    }
  }

  // Step 4: Team Environment
  const s4Ar = "الخطوة 4: بيئة الفريق";
  const s4En = "Step 4: Team Environment";
  if (!state.team_env) {
    errs.push({
      step: 4,
      stepTitleAr: s4Ar,
      stepTitleEn: s4En,
      fieldId: "team_env",
      fieldLabelAr: "تفضيل بيئة الفريق",
      fieldLabelEn: "Team Environment",
      messageAr: "يرجى الإجابة على سؤال بيئة الفريق",
      messageEn: "Please answer the team environment question",
    });
  }

  // Step 6: Declarations
  const s6Ar = "الخطوة 6: الإقرار والتسليم";
  const s6En = "Step 6: Declaration & Submission";

  if (!state.declarations.laptop_commitment) {
    errs.push({
      step: 6,
      stepTitleAr: s6Ar,
      stepTitleEn: s6En,
      fieldId: "laptop_commitment",
      fieldLabelAr: "إقرار إحضار الجهاز المحمول (Laptop)",
      fieldLabelEn: "Laptop Commitment",
      messageAr: "يجب الإقرار بتوفر جهاز محمول صالح للاستخدام والالتزام بإحضاره.",
      messageEn: "You must commit to having and bringing a functional laptop.",
    });
  }
  if (!state.declarations.information_accurate) {
    errs.push({
      step: 6,
      stepTitleAr: s6Ar,
      stepTitleEn: s6En,
      fieldId: "information_accurate",
      fieldLabelAr: "صحة البيانات والمعلومات",
      fieldLabelEn: "Information Accuracy",
      messageAr: "يجب الموافقة على هذا الإقرار.",
      messageEn: "Must confirm accuracy of information.",
    });
  }
  if (!state.declarations.full_attendance) {
    errs.push({
      step: 6,
      stepTitleAr: s6Ar,
      stepTitleEn: s6En,
      fieldId: "full_attendance",
      fieldLabelAr: "الالتزام بالحضور الكامل",
      fieldLabelEn: "Full Attendance",
      messageAr: "يجب الموافقة على هذا الإقرار.",
      messageEn: "Must commit to full attendance.",
    });
  }
  if (!state.declarations.application_not_acceptance) {
    errs.push({
      step: 6,
      stepTitleAr: s6Ar,
      stepTitleEn: s6En,
      fieldId: "application_not_acceptance",
      fieldLabelAr: "شروط المفاضلة والقبول",
      fieldLabelEn: "Selection & Capacity Terms",
      messageAr: "يجب الموافقة على هذا الإقرار.",
      messageEn: "Must understand application criteria.",
    });
  }
  if (!state.declarations.data_processing) {
    errs.push({
      step: 6,
      stepTitleAr: s6Ar,
      stepTitleEn: s6En,
      fieldId: "data_processing",
      fieldLabelAr: "معالجة واستخدام البيانات",
      fieldLabelEn: "Data Processing",
      messageAr: "يجب الموافقة على هذا الإقرار.",
      messageEn: "Must agree to data processing.",
    });
  }

  return errs;
}

export function getStepsWithErrors(errors: FormValidationError[]): number[] {
  return Array.from(new Set(errors.map((e) => e.step)));
}

interface ApiErrorPayload {
  code?: string;
  error?: string;
  field?: string;
  details?: unknown;
}

export function translateSubmissionError(
  status: number,
  data: ApiErrorPayload | null,
  err: unknown,
  locale: string
): string {
  const ar = locale === "ar";

  // 1. Client offline / connection failure
  if (typeof navigator !== "undefined" && !navigator.onLine) {
    return ar
      ? "تعذر الاتصال بالخادم. تحقق من الإنترنت ثم حاول مرة أخرى. بياناتك ما زالت محفوظة."
      : "Could not connect to the server. Check your internet connection and try again. Your data is safely saved.";
  }

  // 2. Timeout
  const errObj = err as { name?: string; message?: string } | null;
  if (
    errObj &&
    (errObj.name === "AbortError" ||
      errObj.message?.includes("aborted") ||
      errObj.message?.includes("timeout") ||
      errObj.message?.includes("Failed to fetch") ||
      errObj.message?.includes("NetworkError"))
  ) {
    if (errObj.name === "AbortError" || errObj.message?.includes("timeout")) {
      return ar
        ? "استغرق الإرسال وقتًا أطول من المتوقع. لا تعِد الإرسال مباشرة؛ سنتحقق أولًا من حالة الطلب."
        : "Submission took longer than expected. Please do not re-submit immediately; checking application status first.";
    }
    return ar
      ? "تعذر الاتصال بالخادم. تحقق من الإنترنت ثم حاول مرة أخرى. بياناتك ما زالت محفوظة."
      : "Could not connect to the server. Check your internet connection and try again. Your data is safely saved.";
  }

  // 3. Duplicate email or phone
  if (data?.code === "DUPLICATE_EMAIL") {
    return ar
      ? "يوجد طلب مسجل مسبقًا باستخدام هذا البريد الإلكتروني."
      : "An application is already registered with this email address.";
  }

  if (data?.code === "DUPLICATE_PHONE") {
    return ar
      ? "يوجد طلب مسجل مسبقًا باستخدام رقم الجوال هذا."
      : "An application is already registered with this mobile number.";
  }

  if (
    status === 409 ||
    (typeof data?.error === "string" && (data.error.includes("مسبقًا") || data.error.includes("duplicate")))
  ) {
    if (data?.error?.includes("جوال") || data?.field === "phone") {
      return ar
        ? "يوجد طلب مسجل مسبقًا باستخدام رقم الجوال هذا."
        : "An application is already registered with this mobile number.";
    }
    return ar
      ? "يوجد طلب مسجل مسبقًا باستخدام هذا البريد الإلكتروني."
      : "An application is already registered with this email address.";
  }

  // 4. Temporary server load / Rate limit (429, 502, 503, 504)
  if (status === 429 || status === 502 || status === 503 || status === 504 || data?.code === "RATE_LIMIT") {
    return ar
      ? "يوجد ضغط مؤقت على التسجيل. بياناتك محفوظة، انتظر قليلًا ثم حاول مرة أخرى."
      : "There is temporary high traffic on registration. Your data is preserved, please wait a moment and try again.";
  }

  // 5. Camp closed
  if (status === 403 || data?.code === "REGISTRATION_CLOSED") {
    return ar
      ? "نعتذر، تم إغلاق التسجيل ولم يعد استقبال الطلبات متاحًا."
      : "Sorry, registration for the BUILDx Camp is now closed.";
  }

  // 6. Generic validation or server error
  if (status === 422 || data?.code === "VALIDATION") {
    return ar
      ? "البيانات المرسلة غير مكتملة أو غير صحيحة. يرجى مراجعة وتصحيح الحقول المطلوبة."
      : "The submitted data is incomplete or invalid. Please review and correct the required fields.";
  }

  return ar
    ? "تعذر إرسال الطلب حاليًا. لم نفقد بياناتك، حاول مرة أخرى بعد قليل."
    : "Could not submit application at this time. Your data was not lost, please try again shortly.";
}
