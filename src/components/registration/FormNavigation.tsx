"use client";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrev: () => void;
  onNext: () => void;
  isLastStep?: boolean;
  isSubmitting?: boolean;
  nextDisabled?: boolean;
}

export default function FormNavigation({
  currentStep, onPrev, onNext, isLastStep, isSubmitting, nextDisabled,
}: FormNavigationProps) {
  const { locale } = useLanguage();
  const ar = locale === "ar";

  return (
    <div className="reg-nav">
      {currentStep === 1 ? (
        <Link href="/" className="reg-btn-secondary" title={ar ? "العودة للصفحة الرئيسية" : "Back to Homepage"}>
          {ar ? "← العودة للرئيسية" : "← Back to Home"}
        </Link>
      ) : (
        <button type="button" onClick={onPrev} className="reg-btn-secondary" disabled={isSubmitting}>
          {ar ? "← السابق" : "← Previous"}
        </button>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={nextDisabled || isSubmitting}
        className={`reg-btn-primary ${isLastStep ? "reg-btn-primary--submit" : ""}`}
      >
        {isSubmitting
          ? (ar ? "جارٍ تسليم طلبك..." : "Submitting...")
          : isLastStep
          ? (ar ? "تسليم الطلب" : "Submit Application")
          : (ar ? "التالي ←" : "Next →")}
      </button>
    </div>
  );
}
