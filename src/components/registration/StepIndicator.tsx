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

interface StepIndicatorProps { currentStep: number; }

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
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
          return (
            <div key={step.key} className={`reg-step-item ${done ? "is-done" : ""} ${active ? "is-active" : ""}`}>
              <div className="reg-step-item__circle">
                {done ? "✓" : num}
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
