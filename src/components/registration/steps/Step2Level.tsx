"use client";
import { useLanguage } from "@/context/LanguageContext";
import type { Level } from "@/types/registration";
import Image from "next/image";

interface Props {
  value: Level | null;
  onChange: (level: Level) => void;
  error?: string;
}

export default function Step2Level({ value, onChange, error }: Props) {
  const { locale } = useLanguage();
  const ar = locale === "ar";

  const levels = [
    {
      id: "foundation" as Level,
      badge: "01",
      titleEn: "Foundation",
      titleAr: "مبتدئ",
      descAr: "خبرتي في البرمجة وبناء المنتجات الرقمية محدودة، أو ما زلت في بداية تجربتي، ولدي رغبة في تعلّم كيفية تحويل الأفكار إلى منتجات باستخدام التقنية والذكاء الاصطناعي.",
      descEn: "My experience in programming and digital product building is limited or just beginning. I have a strong desire to learn how to transform ideas into products using technology and AI.",
      color: "#823419",
      glow: "rgba(130,52,25,0.4)",
    },
    {
      id: "practitioner" as Level,
      badge: "02",
      titleEn: "Practitioner",
      titleAr: "ممارس",
      descAr: "لدي تجربة سابقة في البرمجة أو بناء المشاريع الرقمية، وسبق لي استخدام أدوات وتقنيات مختلفة، وأستطيع تنفيذ أجزاء من منتج رقمي وتطويرها.",
      descEn: "I have prior experience in programming or building digital projects, and have used various tools and technologies. I can implement and develop parts of a digital product.",
      color: "#c3f937",
      glow: "rgba(195,249,55,0.35)",
    },
    {
      id: "advanced" as Level,
      badge: "03",
      titleEn: "Advanced",
      titleAr: "متقدم",
      descAr: "لدي خبرة عملية في بناء وتطوير المنتجات الرقمية، وأستطيع العمل باستقلالية والوصول من الفكرة إلى MVP قابل للتجربة، مع القدرة على توظيف الذكاء الاصطناعي وVibe Coding بفعالية أثناء عملية البناء.",
      descEn: "I have hands-on experience building and developing digital products. I can work independently and go from idea to a testable MVP, effectively leveraging AI and Vibe Coding throughout the process.",
      color: "#fb50c3",
      glow: "rgba(251,80,195,0.35)",
    },
  ];

  return (
    <div className="reg-step">
      <div className="reg-step-header">
        <Image src="/assets/characters/char-thinking.png" alt="" width={72} height={72} className="reg-step-char" />
        <div>
          <h2 className="reg-step-title">{ar ? "تحديد المستوى" : "Level Selection"}</h2>
          <p className="reg-step-subtitle">
            {ar
              ? "بناءً على خبرتك الحالية، أي من المستويات التالية يصفك بشكل أدق؟"
              : "Based on your current experience, which level describes you most accurately?"}
          </p>
          <p className="reg-step-note">
            {ar
              ? "اختر المستوى الذي يعكس قدراتك الحالية فعليًا، وليس المستوى الذي ترغب في الوصول إليه. ستنتقل بعد اختيارك إلى مجموعة من الأسئلة المخصصة لتقييم هذا المستوى."
              : "Choose the level that reflects your current abilities, not the level you aspire to reach. After your selection, you'll proceed to a set of questions tailored to evaluate this level."}
          </p>
        </div>
      </div>

      <div id="level_cards" className="reg-level-cards">
        {levels.map((lvl) => {
          const selected = value === lvl.id;
          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => onChange(lvl.id)}
              className={`reg-level-card ${selected ? "reg-level-card--selected" : ""}`}
              style={selected ? { borderColor: lvl.color, boxShadow: `0 0 28px -6px ${lvl.glow}` } : undefined}
              aria-pressed={selected}
            >
              <div className="reg-level-card__header">
                <span className="reg-level-card__badge" style={{ background: lvl.color, color: lvl.id === "practitioner" ? "#0c1018" : "#e7edfd" }}>
                  {lvl.badge}
                </span>
                <div className="reg-level-card__dot" style={selected ? { background: lvl.color, boxShadow: `0 0 8px ${lvl.color}` } : undefined} />
              </div>
              <h3 className="reg-level-card__en">{lvl.titleEn}</h3>
              <h4 className="reg-level-card__ar" style={selected ? { color: lvl.color } : undefined}>
                {ar ? `| ${lvl.titleAr}` : ""}
              </h4>
              <p className="reg-level-card__desc">{ar ? lvl.descAr : lvl.descEn}</p>
            </button>
          );
        })}
      </div>
      {error && <p className="reg-error text-center mt-4" role="alert">{error}</p>}
    </div>
  );
}
