"use client";
import { useLanguage } from "@/context/LanguageContext";

interface Step { key: string; labelAr: string; labelEn: string; }

const STEPS: Step[] = [
  { key: "personal", labelAr: "البيانات الشخصية", labelEn: "Personal Info" },
  { key: "level", labelAr: "تحديد المستوى", labelEn: "Level" },
  { key: "questions", labelAr: "أسئلة المستوى", labelEn: "Questions" },
  { key: "team", labelAr: "بيئة الفريق", labelEn: "Team" },
  { key: "review", labelAr: "مراجعة الطلب", labelEn: "Review" },
  { key: "submit", labelAr: "الإقرار والتسليم", labelEn: "Submit" },
];

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
  errorSteps?: number[];
}

export default function StepIndicator({ currentStep, onStepClick, errorSteps = [] }: StepIndicatorProps) {
  const { locale } = useLanguage();
  const ar = locale === "ar";
  const total = STEPS.length;

  return (
    <>
      {/* Mobile: compact */}
      <div className="reg-step-mobile">
        <div className="reg-step-mobile__text">
          {ar
            ? `الخطوة ${currentStep} من ${total}`
            : `Step ${currentStep} of ${total}`}
        </div>
        <div className="reg-step-mobile__bar">
          <div
            className="reg-step-mobile__fill"
            style={{ width: `${((currentStep - 1) / (total - 1)) * 100}%` }}
          />
        </div>
        <div className="reg-step-mobile__label">
          {ar ? STEPS[currentStep - 1].labelAr : STEPS[currentStep - 1].labelEn}
        </div>
      </div>

      {/* Desktop: full steps */}
      <nav className="reg-step-desktop" aria-label={ar ? "مراحل التسجيل" : "Registration steps"}>
        {STEPS.map((step, idx) => {
          const num = idx + 1;
          const done = num < currentStep;
          const active = num === currentStep;
          const hasError = errorSteps.includes(num);
          const isClickable = (done || hasError) && Boolean(onStepClick);
          return (
            <div
              key={step.key}
              className={`reg-step-item ${done ? "is-done" : ""} ${active ? "is-active" : ""} ${
                hasError ? "has-error" : ""
              } ${isClickable ? "cursor-pointer hover:opacity-90 transition-opacity" : ""}`}
              onClick={isClickable ? () => onStepClick?.(num) : undefined}
              role={isClickable ? "button" : undefined}
              tabIndex={isClickable ? 0 : undefined}
              onKeyDown={
                isClickable
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onStepClick?.(num);
                      }
                    }
                  : undefined
              }
              aria-current={active ? "step" : undefined}
            >
              <div className="reg-step-item__circle relative">
                {done && !hasError ? "✓" : num}
                {hasError && (
                  <span
                    className="absolute -top-1 -end-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md animate-pulse"
                    title={ar ? "توجد حقول غير مكتملة" : "Incomplete fields"}
                  >
                    !
                  </span>
                )}
              </div>
              <span className="reg-step-item__label">
                {ar ? step.labelAr : step.labelEn}
              </span>
              {idx < STEPS.length - 1 && <div className={`reg-step-connector ${done ? "is-done" : ""}`} />}
            </div>
          );
        })}
      </nav>
    </>
  );
}
