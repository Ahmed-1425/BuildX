"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { isValidSaudiPhone, normalizePhone } from "@/lib/validation/applicationSchema";
import type { FormState, PersonalData, LevelData, Level, Gender, TeamEnvPreference, FoundationAnswers, PractitionerAnswers, AdvancedAnswers } from "@/types/registration";
import StepIndicator from "./StepIndicator";
import FormNavigation from "./FormNavigation";
import Step1Personal from "./steps/Step1Personal";
import Step2Level from "./steps/Step2Level";
import Step3Questions from "./steps/Step3Questions";
import Step4TeamEnv from "./steps/Step4TeamEnv";
import Step5Review from "./steps/Step5Review";
import Step6Submit from "./steps/Step6Submit";
import SuccessScreen from "./SuccessScreen";
import Image from "next/image";
import Link from "next/link";

// ── Draft helpers ──────────────────────────────────────────────
const DRAFT_KEY = "buildx-reg-draft";
const SUCCESS_KEY = "buildx-reg-success";

function saveDraft(state: FormState) {
  try { localStorage.setItem(DRAFT_KEY, JSON.stringify(state)); } catch {}
}
function loadDraft(): FormState | null {
  try {
    const s = localStorage.getItem(DRAFT_KEY);
    if (!s) return null;
    const parsed = JSON.parse(s);
    return {
      ...parsed,
      declarations: {
        information_accurate: false,
        full_attendance: false,
        application_not_acceptance: false,
        data_processing: false,
        laptop_commitment: false,
        ...(parsed.declarations || {}),
      },
    };
  } catch { return null; }
}
function clearDraft() {
  try { localStorage.removeItem(DRAFT_KEY); } catch {}
}

// ── Initial state ──────────────────────────────────────────────
function makeIdempotencyKey(): string {
  try {
    const existing = sessionStorage.getItem("buildx-idem");
    if (existing && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(existing)) {
      return existing;
    }
    let key: string;
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      key = crypto.randomUUID();
    } else {
      key = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    }
    sessionStorage.setItem("buildx-idem", key);
    return key;
  } catch {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}

const emptyPersonal: PersonalData = {
  full_name: "", birth_date: "", gender: "", phone: "", email: "", email_confirm: "",
  city: "", city_other: "", organization: "", specialization: "",
  current_status: "", current_status_other: "",
};

function makeInitialState(): FormState {
  return {
    personal: emptyPersonal,
    levelData: null,
    portfolio_links: [],
    professional_links: [],
    team_env: "",
    declarations: { information_accurate: false, full_attendance: false, application_not_acceptance: false, data_processing: false, laptop_commitment: false },
    currentStep: 1,
    idempotency_key: makeIdempotencyKey(),
  };
}

// ── Empty answers per level ────────────────────────────────────
const emptyFoundation: FoundationAnswers = { technical_experience: "", vibe_coding_understanding: "", motivation: "", problem_and_solution: "", self_learning: "", team_contribution: "" };
const emptyPractitioner: PractitionerAnswers = { programming_experience: "", tools_and_technologies: "", previous_project: "", ai_usage: "", registration_page_prompt: "", debugging_approach: "", team_contribution: "", growth_skill: "" };
const emptyAdvanced: AdvancedAnswers = { strongest_product: "", idea_to_mvp: "", vibe_coding_workflow: "", advanced_prompt_example: "", hardest_problem: "", team_leadership: "", mvp_prioritization: "", independent_capability: "", video_url: "", video_access_confirmed: false };

// ── Validation helpers ─────────────────────────────────────────
function validatePersonal(p: PersonalData, locale: string): Partial<Record<keyof PersonalData, string>> {
  const e: Partial<Record<keyof PersonalData, string>> = {};
  const ar = locale === "ar";
  const trim = (v: string) => v.trim().replace(/\s+/g, " ");
  const name = trim(p.full_name);
  if (!name) e.full_name = ar ? "الاسم الثلاثي مطلوب" : "Full name is required";
  else if (name.split(" ").filter(Boolean).length < 3) e.full_name = ar ? "يرجى إدخال الاسم الثلاثي كاملاً" : "Please enter your full three-part name";
  else if (/[0-9!@#$%^&*()\[\]{};:'",<>?/\\|`~]/.test(name)) e.full_name = ar ? "الاسم يحتوي على رموز غير مسموح بها" : "Name contains invalid characters";
  if (!p.birth_date) e.birth_date = ar ? "تاريخ الميلاد مطلوب" : "Date of birth is required";
  else if (new Date(p.birth_date) >= new Date()) e.birth_date = ar ? "تاريخ الميلاد غير صالح" : "Invalid date of birth";
  if (!p.gender) e.gender = ar ? "يرجى اختيار الجنس للمتابعة." : "Please select your gender to proceed.";
  if (!p.phone) e.phone = ar ? "رقم الجوال مطلوب" : "Mobile number is required";
  else if (!isValidSaudiPhone(p.phone)) e.phone = ar ? "رقم الجوال غير صالح. أدخل رقماً سعودياً صحيحاً" : "Invalid mobile number. Enter a valid Saudi number";
  if (!p.email) e.email = ar ? "البريد الإلكتروني مطلوب" : "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) e.email = ar ? "البريد الإلكتروني غير صالح" : "Invalid email address";
  if (!p.email_confirm) e.email_confirm = ar ? "تأكيد البريد الإلكتروني مطلوب" : "Email confirmation is required";
  else if (p.email.toLowerCase().trim() !== p.email_confirm.toLowerCase().trim()) e.email_confirm = ar ? "البريد الإلكتروني غير متطابق" : "Emails do not match";
  if (!p.city) e.city = ar ? "المدينة مطلوبة" : "City is required";
  if ((p.city === "أخرى" || p.city === "Other") && !p.city_other.trim()) e.city_other = ar ? "يرجى كتابة اسم مدينتك" : "Please enter your city";
  if (!p.organization.trim()) e.organization = ar ? "جهة الدراسة أو العمل مطلوبة" : "Organization is required";
  if (!p.specialization.trim()) e.specialization = ar ? "التخصص أو المجال مطلوب" : "Specialization is required";
  if (!p.current_status) e.current_status = ar ? "يرجى اختيار حالتك الحالية" : "Please select your current status";
  if (p.current_status === "other" && !p.current_status_other.trim()) e.current_status_other = ar ? "يرجى تحديد حالتك" : "Please specify your status";
  return e;
}

function validateAnswers(levelData: LevelData, locale: string): Record<string, string> {
  const e: Record<string, string> = {};
  const ar = locale === "ar";
  const MIN = 40;
  const msg = (field: string) => ar ? `يرجى الإجابة بما لا يقل عن ${MIN} حرفاً` : `Answer must be at least ${MIN} characters`;

  const answers = levelData.answers as unknown as Record<string, string | boolean>;
  for (const [key, val] of Object.entries(answers)) {
    if (key === "video_access_confirmed") {
      if (levelData.level === "advanced" && !val) e[key] = ar ? "يجب تأكيد صلاحية الوصول للفيديو" : "Must confirm video access";
    } else if (key === "video_url") {
      if (levelData.level === "advanced") {
        if (!val || typeof val !== "string" || !val.startsWith("http")) e[key] = ar ? "رابط الفيديو مطلوب ويجب أن يبدأ بـ https://" : "Video URL is required and must start with https://";
      }
    } else {
      if (typeof val === "string" && val.trim().length < MIN) e[key] = msg(key);
    }
  }
  return e;
}

// ── Main component ─────────────────────────────────────────────
export default function RegistrationForm() {
  const { locale } = useLanguage();
  const ar = locale === "ar";

  const [state, setState] = useState<FormState>(makeInitialState);
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [declarationErrors, setDeclarationErrors] = useState<Partial<Record<keyof FormState["declarations"], string>>>({});
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [pendingLevelChange, setPendingLevelChange] = useState<Level | null>(null);
  const submitStartTime = useRef<number>(0);
  const topRef = useRef<HTMLDivElement>(null);

  // Load draft on mount
  useEffect(() => {
    const saved = loadDraft();
    if (saved) setState(saved);
    // Check if already submitted
    const successRef = localStorage.getItem(SUCCESS_KEY);
    if (successRef) setSuccessCode(successRef);
    setMounted(true);
  }, []);

  // Warn before leave
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (state.currentStep > 1 && !successCode) {
        e.preventDefault();
        e.returnValue = "";
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [state.currentStep, successCode]);

  // Auto-save draft
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  function scheduleDraft(s: FormState) {
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      saveDraft(s);
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2500);
    }, 1200);
  }

  function update(partial: Partial<FormState>) {
    setState((prev) => {
      const next = { ...prev, ...partial };
      scheduleDraft(next);
      return next;
    });
  }

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ── Level change with confirmation ─────────────────────────
  function requestLevelChange(newLevel: Level) {
    if (state.levelData && state.levelData.level !== newLevel) {
      setPendingLevelChange(newLevel);
    } else {
      applyLevelChange(newLevel);
    }
  }

  function applyLevelChange(level: Level) {
    let ld: LevelData;
    if (level === "foundation") ld = { level: "foundation", answers: { ...emptyFoundation } };
    else if (level === "practitioner") ld = { level: "practitioner", answers: { ...emptyPractitioner } };
    else ld = { level: "advanced", answers: { ...emptyAdvanced } };
    update({ levelData: ld, portfolio_links: [], professional_links: [] });
    setPendingLevelChange(null);
  }

  // ── Validation per step ────────────────────────────────────
  function validateCurrentStep(): boolean {
    const { currentStep } = state;
    if (currentStep === 1) {
      const e = validatePersonal(state.personal, locale);
      if (Object.keys(e).length > 0) {
        setErrors(e as Record<string, string>);
        return false;
      }
    }
    if (currentStep === 2) {
      if (!state.levelData) {
        setErrors({ level: ar ? "يرجى اختيار مستواك" : "Please select your level" });
        return false;
      }
    }
    if (currentStep === 3) {
      if (!state.levelData) return false;
      const e = validateAnswers(state.levelData, locale);
      if (Object.keys(e).length > 0) {
        setErrors(e);
        return false;
      }
    }
    if (currentStep === 4) {
      if (!state.team_env) {
        setErrors({ team_env: ar ? "يرجى الإجابة على هذا السؤال" : "Please answer this question" });
        return false;
      }
    }
    setErrors({});
    return true;
  }

  function goNext() {
    if (!validateCurrentStep()) {
      // Scroll to first error
      const firstError = document.querySelector("[aria-invalid='true'], .reg-error");
      firstError?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const next = state.currentStep + 1;
    update({ currentStep: Math.min(next, 6) });
    scrollTop();
  }

  function goPrev() {
    setErrors({});
    update({ currentStep: Math.max(state.currentStep - 1, 1) });
    scrollTop();
  }

  function goToStep(step: number) {
    setErrors({});
    update({ currentStep: step });
    scrollTop();
  }

  // ── Submit ─────────────────────────────────────────────────
  async function handleSubmit() {
    if (isSubmitting) return;
    if (!state.levelData || !state.team_env) return;

    if (!state.declarations.laptop_commitment) {
      const msg = locale === "ar"
        ? "يجب الإقرار بتوفر جهاز محمول والالتزام بإحضاره لإكمال التسجيل."
        : "You must commit to having and bringing a laptop to complete registration.";
      setSubmitError(msg);
      setDeclarationErrors({ laptop_commitment: msg });
      return;
    }

    const allChecked = Object.values(state.declarations).every(Boolean);
    if (!allChecked) {
      const msg = locale === "ar"
        ? "يرجى الموافقة على جميع الإقرارات أعلاه لتفعيل زر التسليم."
        : "Please confirm all declarations above to enable the submit button.";
      setSubmitError(msg);
      return;
    }

    setSubmitError("");
    setDeclarationErrors({});
    setIsSubmitting(true);

    const answers = state.levelData.answers as unknown as Record<string, string | boolean>;
    const payload = {
      full_name: state.personal.full_name.trim().replace(/\s+/g, " "),
      birth_date: state.personal.birth_date,
      gender: state.personal.gender as Gender,
      phone: normalizePhone(state.personal.phone),
      email: state.personal.email.toLowerCase().trim(),
      city: state.personal.city_other.trim() || state.personal.city,
      organization: state.personal.organization.trim(),
      specialization: state.personal.specialization.trim(),
      current_status: state.personal.current_status,
      current_status_other: state.personal.current_status_other.trim() || undefined,
      level: state.levelData.level,
      level_answers: answers,
      portfolio_links: state.portfolio_links.filter((l) => l.trim()),
      professional_links: state.professional_links.filter((l) => l.trim()),
      advanced_video_url: state.levelData.level === "advanced" ? (answers.video_url as string) : undefined,
      advanced_video_access_confirmed: state.levelData.level === "advanced" ? (answers.video_access_confirmed as boolean) : undefined,
      team_environment_preference: state.team_env as TeamEnvPreference,
      declaration_information_accurate: state.declarations.information_accurate,
      declaration_full_attendance: state.declarations.full_attendance,
      declaration_application_not_acceptance: state.declarations.application_not_acceptance,
      declaration_data_processing: state.declarations.data_processing,
      laptop_commitment: state.declarations.laptop_commitment,
      idempotency_key: state.idempotency_key,
      honeypot: "",
      submitted_at_client: submitStartTime.current,
    };

    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        clearDraft();
        localStorage.setItem(SUCCESS_KEY, data.reference_code);
        setSuccessCode(data.reference_code);
      } else {
        setSubmitError(data.error || (ar ? "تعذر تسليم الطلب حاليًا. حاول مرة أخرى بعد قليل." : "Submission failed. Please try again."));
      }
    } catch {
      setSubmitError(ar
        ? "تعذر إرسال الطلب بسبب مشكلة في الاتصال. إجاباتك ما زالت محفوظة على هذا الجهاز، حاول مرة أخرى."
        : "Failed to submit due to a connection issue. Your answers are still saved on this device. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ── Success screen ─────────────────────────────────────────
  if (successCode) {
    return <SuccessScreen referenceCode={successCode} />;
  }

  if (!mounted) {
    return (
      <div className="reg-loading">
        <Image src="/assets/characters/loader.gif" alt="" width={80} height={80} unoptimized />
        <p>{ar ? "جارٍ التحضير..." : "Preparing..."}</p>
      </div>
    );
  }

  const { currentStep } = state;

  return (
    <div className="reg-form-wrap" ref={topRef}>
      {/* Pending level change confirmation */}
      {pendingLevelChange && (
        <div className="reg-confirm-overlay" role="dialog" aria-modal="true">
          <div className="reg-confirm-box">
            <p className="reg-confirm-title">
              {ar ? "تغيير المستوى" : "Change Level"}
            </p>
            <p className="reg-confirm-body">
              {ar
                ? "سيؤدي تغيير المستوى إلى حذف إجاباتك السابقة على أسئلة المستوى الحالي. هل تريد المتابعة؟"
                : "Changing the level will delete your previous answers for the current level. Do you want to continue?"}
            </p>
            <div className="reg-confirm-actions">
              <button type="button" className="reg-btn-secondary" onClick={() => setPendingLevelChange(null)}>
                {ar ? "إلغاء" : "Cancel"}
              </button>
              <button type="button" className="reg-btn-primary" onClick={() => applyLevelChange(pendingLevelChange)}>
                {ar ? "نعم، تغيير المستوى" : "Yes, change level"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <StepIndicator currentStep={currentStep} />

      {/* Draft saved toast */}
      {draftSaved && (
        <div className="reg-draft-toast" role="status" aria-live="polite">
          💾 {ar ? "يتم حفظ تقدمك على هذا الجهاز" : "Your progress is saved on this device"}
        </div>
      )}

      {/* Step content */}
      <div className="reg-step-content">
        {currentStep === 1 && (
          <Step1Personal
            data={state.personal}
            onChange={(p) => update({ personal: p })}
            errors={errors as Partial<Record<keyof PersonalData, string>>}
          />
        )}
        {currentStep === 2 && (
          <Step2Level
            value={state.levelData?.level ?? null}
            onChange={requestLevelChange}
            error={errors.level}
          />
        )}
        {currentStep === 3 && state.levelData && (
          <Step3Questions
            levelData={state.levelData}
            portfolioLinks={state.portfolio_links}
            professionalLinks={state.professional_links}
            onLevelDataChange={(ld) => update({ levelData: ld })}
            onPortfolioChange={(links) => update({ portfolio_links: links })}
            onProfessionalChange={(links) => update({ professional_links: links })}
            errors={errors}
          />
        )}
        {currentStep === 4 && (
          <Step4TeamEnv
            value={state.team_env}
            onChange={(v) => update({ team_env: v })}
            error={errors.team_env}
          />
        )}
        {currentStep === 5 && (
          <Step5Review formState={state} onEdit={goToStep} />
        )}
        {currentStep === 6 && (
          <Step6Submit
            declarations={state.declarations}
            onChange={(d) => {
              update({ declarations: d });
              if (submitError) setSubmitError("");
              if (d.laptop_commitment && declarationErrors.laptop_commitment) {
                setDeclarationErrors((prev) => {
                  const next = { ...prev };
                  delete next.laptop_commitment;
                  return next;
                });
              }
            }}
            errors={declarationErrors}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            submitError={submitError}
          />
        )}
      </div>

      {/* Navigation */}
      {currentStep < 6 && (
        <FormNavigation
          currentStep={currentStep}
          totalSteps={6}
          onPrev={goPrev}
          onNext={goNext}
          isLastStep={currentStep === 5}
          isSubmitting={isSubmitting}
        />
      )}
      {currentStep === 6 && state.currentStep > 1 && (
        <div className="reg-nav reg-nav--step6">
          <button type="button" onClick={goPrev} className="reg-btn-secondary" disabled={isSubmitting}>
            {ar ? "← السابق" : "← Previous"}
          </button>
          <Link href="/" className="reg-btn-secondary opacity-75 hover:opacity-100">
            {ar ? "العودة للرئيسية" : "Back to Home"}
          </Link>
        </div>
      )}
    </div>
  );
}
