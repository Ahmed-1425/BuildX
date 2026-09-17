"use client";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { Laptop } from "lucide-react";

interface Declarations {
  information_accurate: boolean;
  full_attendance: boolean;
  application_not_acceptance: boolean;
  data_processing: boolean;
  laptop_commitment: boolean;
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
    onChange({ ...declarations, [key]: !Boolean(declarations[key]) });
  }

  const checks: {
    key: keyof Declarations;
    labelAr: string;
    labelEn: string;
    descAr?: string;
    descEn?: string;
    icon?: React.ReactNode;
  }[] = [
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
      key: "laptop_commitment",
      labelAr: "أقر بأن لدي جهاز كمبيوتر محمول (Laptop) صالح للاستخدام، وألتزم بإحضاره معي طوال أيام معسكر وهاكاثون BUILDx.",
      labelEn: "I confirm that I have a functional laptop and commit to bringing it with me throughout all days of the BUILDx camp and hackathon.",
      descAr: "الجهاز المحمول متطلب أساسي لتنفيذ التطبيقات والمهام العملية والمشاركة في بناء مشروع الفريق.",
      descEn: "A laptop is an essential requirement for hands-on tasks and participating in team project development.",
      icon: <Laptop className="w-5 h-5 text-[#c3f937] shrink-0 mt-0.5" aria-hidden="true" />,
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
        {checks.map((c) => {
          const isChecked = Boolean(declarations?.[c.key]);
          return (
            <label
              key={c.key}
              id={c.key}
              className={`reg-declaration-row ${
                isChecked ? "reg-declaration-row--checked" : ""
              } ${errors[c.key] ? "reg-declaration-row--error" : ""}`}
            >
              <input
                id={`check_${c.key}`}
                type="checkbox"
                checked={isChecked}
                onChange={() => toggle(c.key)}
                className="reg-checkbox mt-1 cursor-pointer"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-start gap-2.5">
                  {c.icon && <span>{c.icon}</span>}
                  <span className="reg-declaration-label font-medium text-slate-100 text-sm leading-relaxed cursor-pointer">
                    {ar ? c.labelAr : c.labelEn}
                  </span>
                </div>
                {c.descAr && (
                  <p className="text-xs text-slate-400 leading-normal ps-0 sm:ps-7">
                    {ar ? c.descAr : c.descEn}
                  </p>
                )}
                {errors[c.key] && (
                  <p className="text-xs text-rose-400 font-semibold pt-0.5 flex items-center gap-1.5">
                    <span>⚠</span>
                    <span>{errors[c.key]}</span>
                  </p>
                )}
              </div>
            </label>
          );
        })}
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
          disabled={isSubmitting}
          className={`reg-submit-btn ${allChecked && !isSubmitting ? "reg-submit-btn--ready" : ""} ${isSubmitting ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-[#0c1018] border-t-transparent rounded-full animate-spin" />
              <span>{ar ? "جارٍ إرسال الطلب..." : "Submitting your application..."}</span>
            </span>
          ) : (
            <span>{ar ? "تسليم الطلب" : "Submit Application"}</span>
          )}
        </button>
        {!allChecked && !isSubmitting && (
          <p className="reg-submit-hint">{ar ? "يرجى الموافقة على جميع الإقرارات أعلاه لتفعيل تسليم الطلب." : "Please confirm all declarations above to enable application submission."}</p>
        )}
      </div>

      {/* Honeypot — hidden from users */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: "none" }} aria-hidden="true" />
    </div>
  );
}
