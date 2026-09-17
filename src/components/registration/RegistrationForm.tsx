"use client";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useRegistrationStatus } from "@/context/RegistrationStatusContext";
import { isValidSaudiPhone, normalizePhone } from "@/lib/validation/applicationSchema";
import type {
  FormState,
  PersonalData,
  LevelData,
  Level,
  Gender,
  TeamEnvPreference,
  FoundationAnswers,
  PractitionerAnswers,
  AdvancedAnswers,
} from "@/types/registration";
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
import { AlertCircle, AlertTriangle, ArrowRight, ArrowLeft, CheckCircle2, X } from "lucide-react";
import {
  type FormValidationError,
  validatePersonal,
  validateAnswers,
  validateDeclarations,
  validateAllSteps,
  getStepsWithErrors,
  translateSubmissionError,
  QUESTION_LABELS,
} from "@/lib/validation/registrationValidator";

// ── Draft helpers ──────────────────────────────────────────────
const DRAFT_KEY = "buildx-reg-draft";
const SUCCESS_KEY = "buildx-reg-success";

function saveDraft(state: FormState) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
  } catch {}
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
  } catch {
    return null;
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
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
  full_name: "",
  birth_date: "",
  gender: "",
  phone: "",
  email: "",
  email_confirm: "",
  city: "",
  city_other: "",
  organization: "",
  specialization: "",
  current_status: "",
  current_status_other: "",
};

function makeInitialState(): FormState {
  return {
    personal: emptyPersonal,
    levelData: null,
    portfolio_links: [],
    professional_links: [],
    team_env: "",
    declarations: {
      information_accurate: false,
      full_attendance: false,
      application_not_acceptance: false,
      data_processing: false,
      laptop_commitment: false,
    },
    currentStep: 1,
    idempotency_key: makeIdempotencyKey(),
  };
}

// ── Empty answers per level ────────────────────────────────────
const emptyFoundation: FoundationAnswers = {
  technical_experience: "",
  vibe_coding_understanding: "",
  motivation: "",
  problem_and_solution: "",
  self_learning: "",
  team_contribution: "",
};

const emptyPractitioner: PractitionerAnswers = {
  programming_experience: "",
  tools_and_technologies: "",
  previous_project: "",
  ai_usage: "",
  registration_page_prompt: "",
  debugging_approach: "",
  team_contribution: "",
  growth_skill: "",
};

const emptyAdvanced: AdvancedAnswers = {
  strongest_product: "",
  idea_to_mvp: "",
  vibe_coding_workflow: "",
  advanced_prompt_example: "",
  hardest_problem: "",
  team_leadership: "",
  mvp_prioritization: "",
  independent_capability: "",
  video_url: "",
  video_access_confirmed: false,
};



// ── Main RegistrationForm Component ────────────────────────────
export default function RegistrationForm() {
  const { locale } = useLanguage();
  const ar = locale === "ar";
  const { isOpen } = useRegistrationStatus();

  const [state, setState] = useState<FormState>(makeInitialState);
  const [mounted, setMounted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [declarationErrors, setDeclarationErrors] = useState<Partial<Record<keyof FormState["declarations"], string>>>({});
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [pendingDraft, setPendingDraft] = useState<FormState | null>(null);
  const [emailToast, setEmailToast] = useState("");
  const [pendingLevelChange, setPendingLevelChange] = useState<Level | null>(null);

  // Level 2 Multi-Step Error Summary Modal State
  const [validationSummaryErrors, setValidationSummaryErrors] = useState<FormValidationError[]>([]);
  const [showValidationSummary, setShowValidationSummary] = useState(false);

  // Synchronous double-submit lock ref & element refs
  const submittingRef = useRef(false);
  const submitStartTime = useRef<number>(0);
  const topRef = useRef<HTMLDivElement>(null);
  const stepCardRef = useRef<HTMLDivElement>(null);
  const isFirstMount = useRef(true);
  const isJumpingToFieldRef = useRef(false);

  // Load draft on mount with user-confirmation prompt
  useEffect(() => {
    const saved = loadDraft();
    if (saved && (saved.personal.full_name?.trim() || saved.currentStep > 1 || saved.levelData)) {
      setPendingDraft(saved);
    }
    const successRef = localStorage.getItem(SUCCESS_KEY);
    if (successRef) setSuccessCode(successRef);
    setMounted(true);
  }, []);

  // Warn before leave if dirty
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

  // Auto-save draft with debouncing
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

      // Real-time error list update if summary modal is currently open or populated
      if (validationSummaryErrors.length > 0) {
        const remaining = validateAllSteps(next);
        setValidationSummaryErrors(remaining);
        if (remaining.length === 0) {
          setShowValidationSummary(false);
        }
      }

      return next;
    });
  }

  // ── Scroll & Reduced-Motion Handlers ────────────────────────
  function getScrollBehavior(): ScrollBehavior {
    if (typeof window === "undefined") return "smooth";
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth";
  }

  function scrollToFormTop(overrideBehavior?: ScrollBehavior) {
    if (typeof window === "undefined") return;

    const behavior = overrideBehavior || getScrollBehavior();

    // Use requestAnimationFrame to ensure newly rendered step is committed & sized in DOM
    requestAnimationFrame(() => {
      const targetEl = stepCardRef.current || topRef.current;
      if (!targetEl) return;

      const header = document.querySelector(".reg-page-header");
      const headerHeight = header ? header.getBoundingClientRect().height : 68;

      // Comfort offset so step header and first field are cleanly visible below sticky header & banner
      const topPadding = 20;
      const rect = targetEl.getBoundingClientRect();
      const targetY = window.pageYOffset + rect.top - (headerHeight + topPadding);

      window.scrollTo({
        top: Math.max(0, Math.round(targetY)),
        behavior,
      });
    });
  }

  // Effect runs AFTER step change is committed to the DOM
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    if (isJumpingToFieldRef.current) {
      return;
    }

    scrollToFormTop();
  }, [state.currentStep]);

  // Level change confirmation
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

  // ── Step Navigation & Level 1 Validation ─────────────────────
  function validateCurrentStep(): boolean {
    const { currentStep } = state;
    if (currentStep === 1) {
      const e = validatePersonal(state.personal, locale);
      if (Object.keys(e).length > 0) {
        setErrors(e as Record<string, string>);
        const cleanEmail = (state.personal.email || "").trim().toLowerCase();
        const cleanConfirm = (state.personal.email_confirm || "").trim().toLowerCase();
        if (cleanConfirm && cleanEmail !== cleanConfirm) {
          setEmailToast(ar ? "البريد الإلكتروني غير متطابق، تأكد من كتابته بالشكل نفسه." : "Emails do not match, please ensure they are identical.");
          setTimeout(() => setEmailToast(""), 4500);
        }
        return false;
      }
    }
    if (currentStep === 2) {
      if (!state.levelData) {
        setErrors({ level: ar ? "يرجى اختيار مستواك (مبتدئ، ممارس، متقدم)" : "Please select your level" });
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
        setErrors({ team_env: ar ? "يرجى الإجابة على سؤال بيئة الفريق" : "Please answer this question" });
        return false;
      }
    }
    if (currentStep === 5) {
      // Step 5 Review -> Step 6: Verify all prior steps are completed
      const allErrors = validateAllSteps(state);
      const priorErrors = allErrors.filter((e) => e.step < 6);
      if (priorErrors.length > 0) {
        setValidationSummaryErrors(allErrors);
        setShowValidationSummary(true);
        return false;
      }
    }
    setErrors({});
    return true;
  }

  function goNext() {
    if (!validateCurrentStep()) {
      // Smoothly scroll to and focus first invalid field on current step
      const behavior = getScrollBehavior();
      requestAnimationFrame(() => {
        const firstError = document.querySelector(
          "[aria-invalid='true'], .reg-input--error, .reg-error, .reg-declaration-row--error, .reg-checkbox-row--error"
        );
        if (firstError) {
          const fieldEl =
            firstError.closest(".reg-field")?.querySelector("input, textarea, select, [role='radiogroup']") ||
            firstError;

          fieldEl.scrollIntoView({ behavior, block: "center" });
          if (typeof (fieldEl as HTMLElement).focus === "function") {
            (fieldEl as HTMLElement).focus({ preventScroll: true });
          }
        }
      });
      return;
    }
    const next = state.currentStep + 1;
    update({ currentStep: Math.min(next, 6) });
  }

  function goPrev() {
    setErrors({});
    update({ currentStep: Math.max(state.currentStep - 1, 1) });
  }

  function goToStep(step: number) {
    setErrors({});
    if (step === state.currentStep) {
      scrollToFormTop();
      return;
    }
    update({ currentStep: step });
  }

  // ── Jump to Field with Focus & Pulse Animation ────────────────
  function handleJumpToField(step: number, fieldId: string) {
    setShowValidationSummary(false);
    isJumpingToFieldRef.current = true;

    const behavior = getScrollBehavior();

    function focusTargetField() {
      const el =
        document.getElementById(fieldId) ||
        document.querySelector(`[name="${fieldId}"]`) ||
        document.querySelector(`#check_${fieldId}`);

      if (el) {
        el.scrollIntoView({ behavior, block: "center" });
        if (typeof (el as HTMLElement).focus === "function") {
          (el as HTMLElement).focus({ preventScroll: true });
        }
        el.classList.add("reg-field-highlight");
        setTimeout(() => {
          el.classList.remove("reg-field-highlight");
          isJumpingToFieldRef.current = false;
        }, 3600);
      } else {
        isJumpingToFieldRef.current = false;
      }
    }

    if (step !== state.currentStep) {
      update({ currentStep: step });
      setTimeout(() => {
        focusTargetField();
      }, 240);
    } else {
      focusTargetField();
    }
  }

  // ── Final Submit Handler with Double-Submit Lock & Retries ─
  async function handleSubmit() {
    // 0. Strict check if registration is closed
    if (isOpen === false) {
      setSubmitError(
        ar
          ? "تم إغلاق التسجيل أثناء تعبئة الطلب، ولذلك لم يعد بالإمكان إرسال طلب جديد."
          : "Registration was closed while filling out the application, so new submissions are no longer possible."
      );
      return;
    }

    // 1. Synchronous double-submit lock check
    if (submittingRef.current || isSubmitting) {
      return;
    }

    // 2. Comprehensive validation check across all steps
    const allErrors = validateAllSteps(state);
    if (allErrors.length > 0) {
      setValidationSummaryErrors(allErrors);
      setShowValidationSummary(true);

      // Strict laptop commitment enforcement
      if (!state.declarations.laptop_commitment) {
        const laptopMsg = ar
          ? "يجب الإقرار بتوفر جهاز محمول صالح للاستخدام والالتزام بإحضاره."
          : "You must commit to having and bringing a functional laptop.";
        setDeclarationErrors({ laptop_commitment: laptopMsg });
        setSubmitError(laptopMsg);
        if (state.currentStep !== 6) {
          update({ currentStep: 6 });
        }
        setTimeout(() => {
          const el = document.getElementById("laptop_commitment") || document.getElementById("check_laptop_commitment");
          el?.scrollIntoView({ behavior: getScrollBehavior(), block: "center" });
          (el as HTMLElement)?.focus?.();
        }, 220);
      } else {
        setSubmitError(
          ar
            ? "يرجى إكمال جميع الحقول المطلوبة والموافقة على جميع الإقرارات لتسليم الطلب."
            : "Please complete all required fields and confirm all declarations to submit."
        );
      }
      return;
    }

    if (!state.levelData || !state.team_env) {
      return;
    }

    // 3. Acquire lock immediately
    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError("");
    setDeclarationErrors({});
    submitStartTime.current = Date.now();

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
      advanced_video_access_confirmed:
        state.levelData.level === "advanced" ? (answers.video_access_confirmed as boolean) : undefined,
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

    // Safe submission attempt with bounded exponential backoff & jitter (max 2 retries for 429/503/network)
    const MAX_RETRIES = 2;
    let attempt = 0;
    let lastErrorMsg = "";

    while (attempt <= MAX_RETRIES) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      try {
        const res = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const data = await res.json().catch(() => null);

        if (res.ok && data?.success && data?.reference_code) {
          // Confirmed API success: clear draft ONLY now
          clearDraft();
          localStorage.setItem(SUCCESS_KEY, data.reference_code);
          setSuccessCode(data.reference_code);
          submittingRef.current = false;
          setIsSubmitting(false);
          return;
        }

        // Retry on 429, 502, 503, 504
        if ((res.status === 429 || res.status === 502 || res.status === 503 || res.status === 504) && attempt < MAX_RETRIES) {
          attempt++;
          const retryAfterSec = parseInt(res.headers.get("retry-after") || "0", 10);
          const backoffMs = retryAfterSec > 0
            ? retryAfterSec * 1000
            : Math.min(1000 * Math.pow(2, attempt) + Math.random() * 400, 4000);
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          continue;
        }

        lastErrorMsg = translateSubmissionError(res.status, data, null, locale);
        break;
      } catch (fetchErr: unknown) {
        clearTimeout(timeoutId);
        if (attempt < MAX_RETRIES) {
          attempt++;
          const backoffMs = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 400, 3500);
          await new Promise((resolve) => setTimeout(resolve, backoffMs));
          continue;
        }
        lastErrorMsg = translateSubmissionError(0, null, fetchErr, locale);
        break;
      }
    }

    setSubmitError(lastErrorMsg || (ar ? "تعذر إرسال الطلب حاليًا. لم نفقد بياناتك، حاول مرة أخرى بعد قليل." : "Could not submit. Try again shortly."));
    submittingRef.current = false;
    setIsSubmitting(false);
  }

  // ── Render Success Screen ──────────────────────────────────
  if (successCode) {
    return <SuccessScreen referenceCode={successCode} />;
  }

  // ── Render Loading State ───────────────────────────────────
  if (!mounted) {
    return (
      <div className="reg-loading">
        <Image src="/assets/characters/loader.gif" alt="" width={80} height={80} unoptimized />
        <p>{ar ? "جارٍ التحضير..." : "Preparing..."}</p>
      </div>
    );
  }

  const { currentStep } = state;

  // Group validation errors by step for the summary modal
  const groupedErrors = validationSummaryErrors.reduce<Record<number, FormValidationError[]>>((acc, err) => {
    if (!acc[err.step]) acc[err.step] = [];
    acc[err.step].push(err);
    return acc;
  }, {});

  return (
    <div className="reg-form-wrap" ref={topRef}>
      {/* ── Floating Email Mismatch Toast ── */}
      {emailToast && (
        <div
          className="fixed top-20 start-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-rose-950/95 border border-rose-500 text-rose-200 text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{emailToast}</span>
        </div>
      )}

      {/* ── Level 2 Multi-Step Error Summary Modal ── */}
      {showValidationSummary && validationSummaryErrors.length > 0 && (
        <div className="reg-error-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="error-modal-title">
          <div className="reg-error-modal">
            <div className="reg-error-modal__header">
              <div className="reg-error-modal__title-wrap">
                <AlertTriangle className="w-5 h-5 text-[#fb50c3] shrink-0" aria-hidden="true" />
                <h3 id="error-modal-title" className="reg-error-modal__title">
                  {ar ? "لا يمكن إرسال الطلب حتى تكتمل البيانات" : "Cannot submit until required information is complete"}
                </h3>
                <span className="reg-error-modal__badge">
                  {ar ? `تبقى ${validationSummaryErrors.length} حقول لإكمال طلبك` : `${validationSummaryErrors.length} remaining`}
                </span>
              </div>
              <button
                type="button"
                className="reg-error-modal__close"
                onClick={() => setShowValidationSummary(false)}
                aria-label={ar ? "إغلاق" : "Close"}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="reg-error-modal__body">
              <p className="text-xs text-slate-300 leading-relaxed">
                {ar
                  ? "يرجى مراجعة وتعبئة الحقول المتبقية التالية لإتاحة إرسال طلبك. يمكنك الضغط على أي حقل للانتقال إليه مباشرةً وتصحيحه:"
                  : "Please review and complete the following required fields to enable submitting your application. Click on any field to jump directly to it:"}
              </p>

              {Object.entries(groupedErrors).map(([stepStr, errList]) => {
                const sNum = parseInt(stepStr, 10);
                const stepTitle = ar ? errList[0].stepTitleAr : errList[0].stepTitleEn;

                return (
                  <div key={sNum} className="reg-error-step-group">
                    <div className="reg-error-step-header">
                      <span className="w-2 h-2 rounded-full bg-[#c3f937]" />
                      <span>{stepTitle}</span>
                    </div>

                    <div className="space-y-2">
                      {errList.map((err) => (
                        <button
                          key={`${err.step}_${err.fieldId}_${err.messageAr}`}
                          type="button"
                          onClick={() => handleJumpToField(err.step, err.fieldId)}
                          className="reg-error-item w-full cursor-pointer group"
                        >
                          <div className="reg-error-item__text">
                            <span className="reg-error-item__field">
                              {ar ? err.fieldLabelAr : err.fieldLabelEn}
                            </span>
                            <span className="reg-error-item__msg">
                              {ar ? err.messageAr : err.messageEn}
                            </span>
                          </div>
                          <span className="reg-error-item__action flex items-center gap-1">
                            <span>{ar ? "الانتقال والتصحيح" : "Go to field"}</span>
                            {ar ? <ArrowLeft className="w-3 h-3" /> : <ArrowRight className="w-3 h-3" />}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="reg-error-modal__footer">
              <button
                type="button"
                className="reg-btn-secondary py-2 px-5 text-xs"
                onClick={() => setShowValidationSummary(false)}
              >
                {ar ? "متابعة التعبئة" : "Continue Editing"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Pending Level Change Confirmation Dialog ── */}
      {pendingLevelChange && (
        <div className="reg-confirm-overlay" role="dialog" aria-modal="true">
          <div className="reg-confirm-box">
            <p className="reg-confirm-title">{ar ? "تغيير المستوى" : "Change Level"}</p>
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

      {/* ── Step Indicator Header ── */}
      <StepIndicator
        currentStep={currentStep}
        onStepClick={goToStep}
        errorSteps={getStepsWithErrors(validationSummaryErrors)}
      />

      {/* ── Auto-save Draft Toast ── */}
      {draftSaved && (
        <div className="reg-draft-toast" role="status" aria-live="polite">
          💾 {ar ? "تم حفظ المسودة محليًا" : "Draft saved locally"}
        </div>
      )}

      {/* ── Draft Restore Prompt Banner ── */}
      {pendingDraft && (
        <div className="mb-6 p-4 rounded-2xl bg-[#121622]/95 border border-[#c3f937]/35 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="text-2xl shrink-0">💾</span>
            <div>
              <p className="font-bold text-white text-sm">
                {ar ? "تم العثور على مسودة محفوظة لطلبك السابق" : "A saved draft was found for your application"}
              </p>
              <p className="text-xs text-slate-300">
                {ar ? "هل ترغب في استعادة إجاباتك ومتابعة التسجيل؟" : "Would you like to restore your saved answers and continue?"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                clearDraft();
                setPendingDraft(null);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-white/20 text-slate-300 text-xs hover:bg-white/10 transition-colors"
            >
              {ar ? "بدء طلب جديد" : "Start Fresh"}
            </button>
            <button
              type="button"
              onClick={() => {
                setState(pendingDraft);
                setPendingDraft(null);
              }}
              className="px-4 py-1.5 rounded-xl bg-[#c3f937] text-[#0c1018] text-xs font-bold hover:bg-[#b2e82e] transition-colors shadow-md"
            >
              {ar ? "استعادة المسودة" : "Restore Draft"}
            </button>
          </div>
        </div>
      )}

      {/* ── Registration Closed Notice Banner ── */}
      {isOpen === false && (
        <div
          className="mb-6 p-4 sm:p-5 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 flex items-start gap-3.5 shadow-xl backdrop-blur-md"
          role="alert"
        >
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 space-y-1">
            <h4 className="text-sm font-bold text-rose-300">
              {ar ? "تم إغلاق التسجيل" : "Registration Closed"}
            </h4>
            <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">
              {ar
                ? "تم إغلاق التسجيل أثناء تعبئة الطلب، ولذلك لم يعد بالإمكان إرسال طلب جديد."
                : "Registration was closed while filling out the application, so new submissions are no longer possible."}
            </p>
            <p className="text-[11px] text-slate-400">
              {ar
                ? "بياناتك الحالية محفوظة في هذا المتصفح كمسودة."
                : "Your drafted responses remain saved on this browser."}
            </p>
          </div>
        </div>
      )}

      {/* ── Active Step Content ── */}
      <div className="reg-step-content" ref={stepCardRef}>
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
        {currentStep === 5 && <Step5Review formState={state} onEdit={goToStep} />}
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
            isRegistrationClosed={isOpen === false}
          />
        )}
      </div>

      {/* ── Form Navigation (Steps 1 to 5) ── */}
      {currentStep < 6 && (
        <FormNavigation
          currentStep={currentStep}
          totalSteps={6}
          onPrev={goPrev}
          onNext={goNext}
          isLastStep={false}
          isSubmitting={isSubmitting}
          nextLabel={
            currentStep === 5
              ? ar
                ? "الانتقال إلى الإقرار والتسليم ←"
                : "Proceed to Declaration & Submit →"
              : undefined
          }
        />
      )}

      {/* ── Navigation for Step 6 ── */}
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
