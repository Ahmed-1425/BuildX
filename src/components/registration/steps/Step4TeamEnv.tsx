"use client";
import { useLanguage } from "@/context/LanguageContext";
import type { TeamEnvPreference } from "@/types/registration";
import Image from "next/image";

interface Props {
  value: TeamEnvPreference | "";
  onChange: (v: TeamEnvPreference) => void;
  error?: string;
}

export default function Step4TeamEnv({ value, onChange, error }: Props) {
  const { locale } = useLanguage();
  const ar = locale === "ar";

  const options: { id: TeamEnvPreference; labelAr: string; labelEn: string }[] = [
    { id: "comfortable", labelAr: "نعم، يناسبني تمامًا.", labelEn: "Yes, this is perfectly fine with me." },
    { id: "same_gender_only", labelAr: "لا يناسبني العمل مع الجنس الآخر.", labelEn: "I prefer working with the same gender only." },
  ];

  return (
    <div className="reg-step">
      <div className="reg-step-header">
        <Image src="/assets/characters/char-thinking.png" alt="" width={72} height={72} className="reg-step-char" />
        <div>
          <h2 className="reg-step-title">{ar ? "بيئة الفريق" : "Team Environment"}</h2>
        </div>
      </div>

      <div className="reg-team-notice">
        <p>
          {ar
            ? "تُشكّل فرق BUILDx بناءً على مستويات المشاركين ومهاراتهم، وقد يضم الفريق رجالًا ونساءً. نود من خلال هذا السؤال معرفة مدى ملاءمة هذه البيئة لك واستعدادك للعمل ضمنها طوال فترة المعسكر."
            : "BUILDx teams are formed based on participants' levels and skills, and may include both men and women. Through this question, we'd like to know how comfortable you are with this environment and your readiness to work within it throughout the camp."}
        </p>
      </div>

      <div className="reg-team-options" role="radiogroup">
        {options.map((opt) => {
          const selected = value === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.id)}
              className={`reg-team-card ${selected ? "reg-team-card--selected" : ""}`}
            >
              <span className="reg-team-card__dot" aria-hidden="true" />
              <span className="reg-team-card__label">{ar ? opt.labelAr : opt.labelEn}</span>
            </button>
          );
        })}
      </div>
      {error && <p className="reg-error text-center mt-4" role="alert">{error}</p>}
    </div>
  );
}
