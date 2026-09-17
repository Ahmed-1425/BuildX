"use client";
import { useLanguage } from "@/context/LanguageContext";
import type { FormState } from "@/types/registration";
import { getGenderLabel } from "@/types/registration";
import Image from "next/image";
import { AlertTriangle, Laptop, CircleCheck } from "lucide-react";

interface Props {
  formState: FormState;
  onEdit: (step: number) => void;
}

function ReviewSection({ title, onEdit, step, children }: { title: string; onEdit: (s: number) => void; step: number; children: React.ReactNode }) {
  const { locale } = useLanguage();
  return (
    <div className="review-section">
      <div className="review-section__header">
        <h3 className="review-section__title">{title}</h3>
        <button type="button" onClick={() => onEdit(step)} className="review-edit-btn">
          {locale === "ar" ? "✎ تعديل" : "✎ Edit"}
        </button>
      </div>
      <div className="review-section__body">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="review-row">
      <span className="review-row__label">{label}</span>
      <span className="review-row__value">{value}</span>
    </div>
  );
}

export default function Step5Review({ formState, onEdit }: Props) {
  const { locale } = useLanguage();
  const ar = locale === "ar";
  const { personal, levelData, portfolio_links, professional_links, team_env } = formState;

  const levelLabels: Record<string, string> = {
    foundation: ar ? "مبتدئ — Foundation" : "Foundation",
    practitioner: ar ? "ممارس — Practitioner" : "Practitioner",
    advanced: ar ? "متقدم — Advanced" : "Advanced",
  };

  const statusLabels: Record<string, string> = ar
    ? { student: "طالب/ـة جامعي/ـة", graduate: "خريج/ـة", employed: "موظف/ـة", job_seeker: "باحث/ـة عن عمل", other: "أخرى" }
    : { student: "University Student", graduate: "Graduate", employed: "Employed", job_seeker: "Job Seeker", other: "Other" };

  const teamLabels: Record<string, string> = ar
    ? { comfortable: "نعم، يناسبني تمامًا.", same_gender_only: "لا يناسبني العمل مع الجنس الآخر." }
    : { comfortable: "Yes, perfectly fine.", same_gender_only: "Same gender only." };

  function answerLabel(key: string): string {
    const labelsAr: Record<string, string> = {
      technical_experience: "التجربة مع التقنية والذكاء الاصطناعي",
      vibe_coding_understanding: "فهم Vibe Coding",
      motivation: "الدافع للتقديم",
      problem_and_solution: "مشكلة وحل مقترح",
      self_learning: "تجربة تعلّم ذاتي",
      team_contribution: "المساهمة في الفريق",
      programming_experience: "الخبرة في البرمجة",
      tools_and_technologies: "الأدوات والتقنيات",
      previous_project: "مشروع سابق",
      ai_usage: "استخدام الذكاء الاصطناعي",
      registration_page_prompt: "Prompt صفحة التسجيل",
      debugging_approach: "التعامل مع الأخطاء",
      growth_skill: "مهارة التطوير",
      strongest_product: "أقوى منتج",
      idea_to_mvp: "من الفكرة إلى MVP",
      vibe_coding_workflow: "Vibe Coding Workflow",
      advanced_prompt_example: "مثال Prompt متقدم",
      hardest_problem: "أصعب مشكلة",
      team_leadership: "قيادة الفريق",
      mvp_prioritization: "تحديد أولويات MVP",
      independent_capability: "القدرات المستقلة",
    };
    const labelsEn: Record<string, string> = {
      technical_experience: "Tech & AI Experience",
      vibe_coding_understanding: "Vibe Coding Understanding",
      motivation: "Motivation",
      problem_and_solution: "Problem & Solution",
      self_learning: "Self-Learning Experience",
      team_contribution: "Team Contribution",
      programming_experience: "Programming Experience",
      tools_and_technologies: "Tools & Technologies",
      previous_project: "Previous Project",
      ai_usage: "AI Usage",
      registration_page_prompt: "Registration Page Prompt",
      debugging_approach: "Debugging Approach",
      growth_skill: "Growth Skill",
      strongest_product: "Strongest Product",
      idea_to_mvp: "Idea to MVP",
      vibe_coding_workflow: "Vibe Coding Workflow",
      advanced_prompt_example: "Advanced Prompt Example",
      hardest_problem: "Hardest Problem",
      team_leadership: "Team Leadership",
      mvp_prioritization: "MVP Prioritization",
      independent_capability: "Independent Capability",
    };
    return ar ? labelsAr[key] ?? key : labelsEn[key] ?? key;
  }

  return (
    <div className="reg-step">
      <div className="reg-step-header">
        <Image src="/assets/characters/char-thinking.png" alt="" width={72} height={72} className="reg-step-char" />
        <div>
          <h2 className="reg-step-title">{ar ? "مراجعة الطلب" : "Review Application"}</h2>
        </div>
      </div>

      <div className="review-warning flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>
          {ar
            ? "راجع بياناتك وإجاباتك بعناية قبل تسليم الطلب. لن تتمكن من تعديل الطلب بعد إرساله."
            : "Review your data and answers carefully before submitting. You won't be able to edit your application after submission."}
        </span>
      </div>

      {/* Personal */}
      <ReviewSection title={ar ? "البيانات الشخصية" : "Personal Information"} onEdit={onEdit} step={1}>
        <ReviewRow label={ar ? "الاسم" : "Name"} value={personal.full_name} />
        <ReviewRow label={ar ? "تاريخ الميلاد" : "Date of Birth"} value={personal.birth_date} />
        <ReviewRow label={ar ? "الجنس" : "Gender"} value={getGenderLabel(personal.gender)} />
        <ReviewRow label={ar ? "الجوال" : "Mobile"} value={personal.phone} />
        <ReviewRow label={ar ? "البريد الإلكتروني" : "Email"} value={personal.email} />
        <ReviewRow label={ar ? "المدينة" : "City"} value={personal.city_other || personal.city} />
        <ReviewRow label={ar ? "الجهة" : "Organization"} value={personal.organization} />
        <ReviewRow label={ar ? "التخصص" : "Specialization"} value={personal.specialization} />
        <ReviewRow label={ar ? "الحالة الحالية" : "Current Status"} value={statusLabels[personal.current_status] + (personal.current_status === "other" && personal.current_status_other ? ` — ${personal.current_status_other}` : "")} />
      </ReviewSection>

      {/* Level */}
      {levelData && (
        <ReviewSection title={ar ? "المستوى المختار" : "Selected Level"} onEdit={onEdit} step={2}>
          <ReviewRow label={ar ? "المستوى" : "Level"} value={levelLabels[levelData.level]} />
        </ReviewSection>
      )}

      {/* Level Answers */}
      {levelData && (
        <ReviewSection title={ar ? "إجابات أسئلة المستوى" : "Level Answers"} onEdit={onEdit} step={3}>
          {Object.entries(levelData.answers).map(([key, val]) => {
            if (key === "video_access_confirmed") return null;
            if (key === "video_url") return (
              <div key={key} className="review-row review-row--answer">
                <span className="review-row__label">{ar ? "رابط الفيديو" : "Video Link"}</span>
                <a href={val as string} target="_blank" rel="noopener noreferrer" className="review-link">{val as string}</a>
              </div>
            );
            return (
              <div key={key} className="review-row review-row--answer">
                <span className="review-row__label">{answerLabel(key)}</span>
                <span className="review-row__value review-row__value--multi">{val as string}</span>
              </div>
            );
          })}
        </ReviewSection>
      )}

      {/* Links */}
      {(portfolio_links.filter(Boolean).length > 0 || professional_links.filter(Boolean).length > 0) && (
        <ReviewSection title={ar ? "الروابط" : "Links"} onEdit={onEdit} step={3}>
          {portfolio_links.filter(Boolean).map((l, i) => (
            <div key={i} className="review-row">
              <span className="review-row__label">{ar ? `رابط أعمال ${i + 1}` : `Portfolio link ${i + 1}`}</span>
              <a href={l} target="_blank" rel="noopener noreferrer" className="review-link">{l}</a>
            </div>
          ))}
          {professional_links.filter(Boolean).map((l, i) => (
            <div key={i} className="review-row">
              <span className="review-row__label">{ar ? `رابط مهني ${i + 1}` : `Professional link ${i + 1}`}</span>
              <a href={l} target="_blank" rel="noopener noreferrer" className="review-link">{l}</a>
            </div>
          ))}
        </ReviewSection>
      )}

      {/* Team */}
      {team_env && (
        <ReviewSection title={ar ? "بيئة الفريق" : "Team Environment"} onEdit={onEdit} step={4}>
          <ReviewRow label={ar ? "التفضيل" : "Preference"} value={teamLabels[team_env]} />
        </ReviewSection>
      )}

      {/* Mandatory Declarations Review */}
      <ReviewSection title={ar ? "الإقرارات والالتزامات" : "Declarations & Commitments"} onEdit={onEdit} step={6}>
        <div className="space-y-2 py-1">
          {/* Laptop Commitment */}
          <div className="review-row flex items-center justify-between py-1">
            <span className="review-row__label flex items-center gap-2">
              <Laptop className="w-4 h-4 text-[#c3f937] shrink-0" />
              <span>{ar ? "توفر الجهاز المحمول (Laptop):" : "Laptop Availability:"}</span>
            </span>
            {formState.declarations?.laptop_commitment === true ? (
              <span className="review-row__value flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{ar ? "تم الإقرار والالتزام بإحضار الجهاز المحمول" : "Committed to bringing a laptop"}</span>
              </span>
            ) : (
              <span className="review-row__value flex items-center gap-1.5 text-amber-400 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{ar ? "لم يتم الإقرار بإحضار الجهاز المحمول بعد" : "Laptop commitment not confirmed yet"}</span>
              </span>
            )}
          </div>

          {/* Other Declarations Status */}
          <div className="review-row flex items-center justify-between py-1">
            <span className="review-row__label">{ar ? "صحة البيانات والمعلومات:" : "Information Accuracy:"}</span>
            {formState.declarations?.information_accurate === true ? (
              <span className="review-row__value flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{ar ? "تم الإقرار" : "Confirmed"}</span>
              </span>
            ) : (
              <span className="review-row__value flex items-center gap-1.5 text-amber-400 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{ar ? "لم يتم الإقرار بعد" : "Not confirmed yet"}</span>
              </span>
            )}
          </div>

          <div className="review-row flex items-center justify-between py-1">
            <span className="review-row__label">{ar ? "الالتزام بالحضور الكامل:" : "Full Attendance:"}</span>
            {formState.declarations?.full_attendance === true ? (
              <span className="review-row__value flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{ar ? "تم الإقرار والالتزام" : "Confirmed"}</span>
              </span>
            ) : (
              <span className="review-row__value flex items-center gap-1.5 text-amber-400 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{ar ? "لم يتم الإقرار بعد" : "Not confirmed yet"}</span>
              </span>
            )}
          </div>

          <div className="review-row flex items-center justify-between py-1">
            <span className="review-row__label">{ar ? "شروط المفاضلة والقبول:" : "Selection & Capacity Terms:"}</span>
            {formState.declarations?.application_not_acceptance === true ? (
              <span className="review-row__value flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{ar ? "تم الإقرار والموافقة" : "Confirmed"}</span>
              </span>
            ) : (
              <span className="review-row__value flex items-center gap-1.5 text-amber-400 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{ar ? "لم يتم الإقرار بعد" : "Not confirmed yet"}</span>
              </span>
            )}
          </div>

          <div className="review-row flex items-center justify-between py-1">
            <span className="review-row__label">{ar ? "معالجة واستخدام البيانات:" : "Data Processing:"}</span>
            {formState.declarations?.data_processing === true ? (
              <span className="review-row__value flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CircleCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{ar ? "تمت الموافقة" : "Confirmed"}</span>
              </span>
            ) : (
              <span className="review-row__value flex items-center gap-1.5 text-amber-400 font-semibold">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{ar ? "لم تتم الموافقة بعد" : "Not confirmed yet"}</span>
              </span>
            )}
          </div>
        </div>
      </ReviewSection>
    </div>
  );
}
