"use client";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

interface Declarations {
  information_accurate: boolean;
  full_attendance: boolean;
  application_not_acceptance: boolean;
  data_processing: boolean;
}

interface Props {
  declarations: Declarations;
  onChange: (d: Declarations) => void;
  errors: Partial<Record<keyof Declarations, string>>;
  isSubmitting: boolean;
  onSubmit: () => void;
  submitError?: string;
}

export default function Step6Submit({ declarations, onChange, errors, isSubmitting, onSubmit, submitError }: Props) {
  const { locale } = useLanguage();
  const ar = locale === "ar";

  function toggle(key: keyof Declarations) {
    onChange({ ...declarations, [key]: !declarations[key] });
  }

  const checks: { key: keyof Declarations; labelAr: string; labelEn: string }[] = [
    {
      key: "information_accurate",
      labelAr: "أقر بأن جميع البيانات والإجابات الواردة في هذا الطلب صحيحة وتمثل خبرتي الفعلية.",
      labelEn: "I confirm that all data and answers in this application are accurate and represent my actual experience.",
    },
    {
      key: "full_attendance",
      labelAr: "ألتزم بحضور جميع أيام المعسكر والهاكاثون والحفل الختامي في حال قبولي.",
      labelEn: "I commit to attending all camp days, the hackathon, and the closing ceremony if accepted.",
    },
    {
      key: "application_not_acceptance",
      labelAr: "أفهم أن تقديم الطلب لا يعني القبول النهائي، وأن الاختيار يتم وفق معايير المفاضلة والطاقة الاستيعابية.",
      labelEn: "I understand that submitting an application does not guarantee acceptance; selection is based on evaluation criteria and capacity.",
    },
    {
      key: "data_processing",
      labelAr: "أوافق على استخدام بياناتي لغرض فرز الطلبات والتواصل المتعلق بمعسكر BUILDx.",
      labelEn: "I agree to my data being used for application screening and communication related to BUILDx camp.",
    },
  ];

  const allChecked = Object.values(declarations).every(Boolean);

  return (
    <div className="reg-step">
      <div className="reg-step-header">
        <Image src={isSubmitting ? "/assets/characters/loader.gif" : "/assets/characters/char-loading.png"} alt="" width={72} height={72} className="reg-step-char" unoptimized={isSubmitting} />
        <div>
          <h2 className="reg-step-title">{ar ? "الإقرار والتسليم" : "Declaration & Submission"}</h2>
          <p className="reg-step-subtitle">{ar ? "اقرأ الإقرارات التالية بعناية وحدد موافقتك على كل منها." : "Read the following declarations carefully and confirm each one."}</p>
        </div>
      </div>

      <div className="reg-declarations">
        {checks.map((c) => (
          <label key={c.key} className={`reg-declaration-row ${declarations[c.key] ? "reg-declaration-row--checked" : ""} ${errors[c.key] ? "reg-declaration-row--error" : ""}`}>
            <input
              type="checkbox"
              checked={declarations[c.key]}
              onChange={() => toggle(c.key)}
              className="reg-checkbox"
            />
            <span className="reg-declaration-label">{ar ? c.labelAr : c.labelEn}</span>
          </label>
        ))}
      </div>

      {submitError && (
        <div className="reg-submit-error" role="alert">
          {submitError}
        </div>
      )}

      <div className="reg-submit-wrap">
        <button
          type="button"
          onClick={onSubmit}
          disabled={!allChecked || isSubmitting}
          className={`reg-submit-btn ${allChecked && !isSubmitting ? "reg-submit-btn--ready" : ""}`}
          aria-busy={isSubmitting}
        >
          {isSubmitting
            ? (ar ? "جارٍ تسليم طلبك..." : "Submitting your application...")
            : (ar ? "تسليم الطلب" : "Submit Application")}
        </button>
        {!allChecked && !isSubmitting && (
          <p className="reg-submit-hint">{ar ? "يرجى الموافقة على جميع الإقرارات أعلاه لتفعيل زر التسليم." : "Please confirm all declarations above to enable the submit button."}</p>
        )}
      </div>

      {/* Honeypot — hidden from users */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden="true" />
    </div>
  );
}
