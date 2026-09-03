"use client";
import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ApplicationDetailItem, ApplicationReview } from "@/types/admin";
import AdminStatusBadge from "@/components/admin/StatusBadge";
import StatusChangeModal from "@/components/admin/StatusChangeModal";
import CandidateReviewModal from "@/components/admin/CandidateReviewModal";
import InternalNotesSection from "@/components/admin/InternalNotesSection";
import AuditTimeline from "@/components/admin/AuditTimeline";
import {
  ArrowRight,
  Star,
  Award,
  Edit3,
  MessageCircle,
  Mail,
  Copy,
  Check,
  Video,
  ExternalLink,
  Phone,
  User,
  MapPin,
  Building2,
  BookOpen,
  Calendar,
  Layers,
} from "lucide-react";

// Full Arabic questions mapped to database keys
const QUESTION_TEXTS: Record<string, string> = {
  // Foundation
  technical_experience: "ما هي تجربتك السابقة مع التقنية أو الذكاء الاصطناعي؟",
  vibe_coding_understanding: "ما هو مفهومك عن أسلوب الـ Vibe Coding وكيف تتوقع أن يساعدك في بناء المنتجات؟",
  motivation: "ما الذي يدفعك للانضمام إلى معسكر BUILDx وما الذي تطمح لتحقيقه خلال أيامه؟",
  problem_and_solution: "اذكر مشكلة واقعية تلاحظها في محيطك أو عملك وتتمنى بناء حل رقمي لمعالجتها.",
  self_learning: "صف تجربة سابقة تعلمت فيها أداة أو مهارة تقنية جديدة بمفردك وكيف طبقتها.",
  team_contribution: "كيف ترى دورك ومساهمتك عند العمل ضمن فريق متنوع المهارات والخلفيات؟",

  // Practitioner
  fast_mvp_experience: "تحدث عن تجربة سابقة قمت فيها ببناء أو إطلاق نموذج أولي (MVP) في وقت قياسي.",
  ai_coding_tools: "ما هي أدوات الذكاء الاصطناعي التي تستخدمها في كتابة وتطوير البرمجيات وكيف تدمجها في عملك؟",
  prompt_engineering_example: "شاركنا مثالًا عمليًا لصيغة Prompt متقدمة استخدمتها لتوليد كود أو حل مشكلة معقدة.",
  system_architecture_basics: "كيف تخطط لمعمارية المنتج الرقمي (قواعد البيانات، الواجهات، الأمان) قبل البدء بالبناء؟",
  debugging_with_ai: "صف موقفًا واجهت فيه خطأً برمجيًا معقدًا وكيف قمت بتشخيصه وحله بالاستعانة بالذكاء الاصطناعي.",
  mvp_tradeoffs: "كيف توازن بين سرعة إطلاق الـ MVP وجودة الكود وتجربة المستخدم عند ضيق الوقت؟",
  team_role_practitioner: "ما هو الدور التقني الأنسب لك داخل فريق الهاكاثون (واجهات، قواعد بيانات، منطق المنتج)؟",
  camp_commitment_practitioner: "ما هو مستوى جاهزيتك وتفرغك للمشاركة النشطة طوال فترة المعسكر؟",

  // Advanced
  strongest_product: "ما هو أقوى منتج رقمي أو نظام تقني قمت ببنائه؟ اشرح معمارية النظام والتقنيات المستخدمة.",
  idea_to_mvp: "صف بالتفصيل منهجيتك في تحويل الفكرة من مجرد مفهوم إلى MVP يعمل فعليًا خلال 48 ساعة.",
  vibe_coding_workflow: "كيف توظف الذكاء الاصطناعي التوليدي في هندسة النظم البرمجية عالية الكفاءة؟",
  advanced_prompt_example: "شاركنا نموذجًا متقدمًا لصيغة Prompt أو Agent استخدمته لأتمتة عملية برمجية معقدة.",
  hardest_problem: "ما هي أصعب مشكلة معمارية أو برمجية واجهتك مؤخرًا وكيف تجاوزتها؟",
  team_leadership: "كيف تقود الفريق تقنيًا وتضمن التناغم وسرعة الإنجاز تحت ضغط الوقت؟",
  mvp_prioritization: "كيف تحدد الأولويات بدقة وتتخذ قرارات استبعاد الميزات غير الأساسية لضمان إطلاق MVP ناجح؟",
  independent_capability: "ما هي قدرتك على تسليم منتج رقمي متكامل من الصفر وحتى النشر السحابي بمفردك؟",
};

export default function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [candidate, setCandidate] = useState<ApplicationDetailItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modals
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  async function fetchCandidate() {
    setLoading(true);
    try {
      const [appRes, meRes] = await Promise.all([
        fetch(`/api/admin/applications/${id}`),
        fetch("/api/admin/auth/me"),
      ]);

      const appData = await appRes.json();
      const meData = await meRes.json();

      if (appData.success) {
        setCandidate(appData.item);
      } else {
        setError(appData.error || "تعذر جلب ملف المتقدم.");
      }

      if (meData.success) {
        setCurrentUser(meData.user);
      }
    } catch {
      setError("تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCandidate();
  }, [id]);

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  // Calculate age
  function getAge(birthDate: string): number | null {
    if (!birthDate) return null;
    const diff = Date.now() - new Date(birthDate).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse p-4" dir="rtl">
        <div className="h-24 bg-[rgba(24,29,40,0.5)] rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-96 bg-[rgba(24,29,40,0.5)] rounded-3xl lg:col-span-2" />
          <div className="h-96 bg-[rgba(24,29,40,0.5)] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="p-12 text-center bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-300 max-w-xl mx-auto my-12 space-y-4" dir="rtl">
        <h2 className="text-xl font-bold text-white">تعذر فتح ملف المتقدم</h2>
        <p className="text-sm">{error}</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-all"
        >
          <ArrowRight className="w-4 h-4 rotate-180" aria-hidden="true" />
          <span>الرجوع لقائمة الطلبات</span>
        </button>
      </div>
    );
  }

  const age = getAge(candidate.birth_date);
  const waNumber = candidate.phone.replace("+", "");
  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `مرحبًا ${candidate.full_name}، نتواصل معك من فريق معسكر BUILDx بخصوص طلبك رقم ${candidate.reference_code}.`
  )}`;
  const emailLink = `mailto:${candidate.email}?subject=${encodeURIComponent(
    `معسكر BUILDx — بخصوص طلب التقديم ${candidate.reference_code}`
  )}`;

  return (
    <div className="space-y-8 pb-16" dir="rtl">
      {/* Top Bar / Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
          <span>العودة لقائمة الطلبات</span>
        </button>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowReviewModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] rounded-xl transition-all shadow-lg shadow-[#c3f937]/20"
          >
            <Award className="w-4 h-4" aria-hidden="true" />
            <span>تقييم المتقدم</span>
            {candidate.my_review && <span className="text-xs font-normal">(مُقيّم مسبقًا)</span>}
          </button>

          {currentUser?.role !== "reviewer" && (
            <button
              type="button"
              onClick={() => setShowStatusModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl transition-all"
            >
              <Edit3 className="w-4 h-4" aria-hidden="true" />
              <span>تعديل الحالة</span>
            </button>
          )}
        </div>
      </div>

      {/* Candidate Hero Card */}
      <div className="p-6 sm:p-8 bg-[rgba(24,29,40,0.85)] border border-white/10 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-6 backdrop-blur-md">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{candidate.full_name}</h1>
            <AdminStatusBadge status={candidate.application_status} size="md" />
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400 font-mono">
            <span>رقم الطلب: <strong className="text-[#c3f937]">{candidate.reference_code}</strong></span>
            <span>•</span>
            <span>تاريخ التقديم: {new Date(candidate.submitted_at).toLocaleDateString("ar-SA", { timeZone: "Asia/Riyadh" })}</span>
          </div>
        </div>

        {/* Rating KPI Container */}
        <div className="flex items-center gap-6 bg-black/40 px-6 py-4 rounded-2xl border border-white/10">
          <div className="text-center">
            <span className="text-xs text-slate-400 block mb-1">متوسط التقييم</span>
            <div className="flex items-center gap-1.5 justify-center">
              <Star className="w-5 h-5 fill-[#c3f937] text-[#c3f937]" aria-hidden="true" />
              <span className="text-2xl sm:text-3xl font-mono font-bold text-[#c3f937]">
                {candidate.avg_score !== null ? candidate.avg_score : "—"}
              </span>
            </div>
          </div>
          <div className="text-center border-r border-white/10 pr-6">
            <span className="text-xs text-slate-400 block mb-1">المحكمين</span>
            <span className="text-2xl font-mono font-bold text-white">{candidate.reviews_count}</span>
          </div>
        </div>
      </div>

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Left / Main: Questions & Answers, Links, Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Level Details */}
          <div className="p-6 bg-[rgba(24,29,40,0.78)] border border-white/10 rounded-3xl space-y-3 backdrop-blur-md">
            <h3 className="text-base font-bold text-white">المستوى المختار</h3>
            <div className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 space-y-1">
              <span className="text-base font-bold text-[#c3f937]">
                {candidate.level === "foundation"
                  ? "المبتدئ (Foundation)"
                  : candidate.level === "practitioner"
                  ? "الممارس (Practitioner)"
                  : "المتقدم (Advanced)"}
              </span>
              <p className="text-xs sm:text-sm text-slate-300">
                {candidate.level === "foundation"
                  ? "بناء أول MVP وفهم أساسيات توجيه الذكاء الاصطناعي."
                  : candidate.level === "practitioner"
                  ? "تحويل الأفكار إلى منتجات متكاملة بسرعة واحترافية."
                  : "بناء أنظمة متقدمة وقيادة الفرق التقنية في الهاكاثون."}
              </p>
            </div>
          </div>

          {/* Level Answers Section */}
          <div className="p-6 bg-[rgba(24,29,40,0.78)] border border-white/10 rounded-3xl space-y-5 backdrop-blur-md">
            <h3 className="text-base font-bold text-white">
              إجابات التقييم ({Object.keys(candidate.level_answers || {}).length} أسئلة)
            </h3>

            <div className="space-y-4">
              {Object.entries(candidate.level_answers || {}).map(([key, val]) => {
                const questionText = QUESTION_TEXTS[key] || key;
                const isMonospace = key.includes("prompt") || key.includes("vibe_coding");

                return (
                  <div key={key} className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-bold text-[#c3f937] leading-snug">{questionText}</span>
                      <button
                        type="button"
                        onClick={() => copyText(String(val), key)}
                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg border border-white/10 hover:border-white/20 transition-colors shrink-0"
                      >
                        {copiedKey === key ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[#c3f937]" aria-hidden="true" />
                            <span>تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                            <span>نسخ الإجابة</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p
                      className={`text-sm text-slate-200 whitespace-pre-wrap leading-relaxed ${
                        isMonospace ? "font-mono bg-[#0c1018] p-4 rounded-xl border border-white/10 text-slate-300" : ""
                      }`}
                    >
                      {String(val)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Links & Video */}
          <div className="p-6 bg-[rgba(24,29,40,0.78)] border border-white/10 rounded-3xl space-y-5 backdrop-blur-md">
            <h3 className="text-base font-bold text-white">الروابط وسابقة الأعمال</h3>

            {/* Video (Advanced) */}
            {candidate.advanced_video_url && (
              <div className="p-4 bg-pink-500/10 border border-pink-500/25 rounded-2xl space-y-1.5">
                <span className="text-xs font-bold text-pink-300 flex items-center gap-1.5">
                  <Video className="w-4 h-4" aria-hidden="true" />
                  <span>رابط فيديو التعريف بالمشروع (المستوى المتقدم):</span>
                </span>
                <a
                  href={candidate.advanced_video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs sm:text-sm text-pink-400 hover:underline font-mono break-all"
                >
                  <span>{candidate.advanced_video_url}</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            )}

            {/* Portfolio Links */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block">روابط سابقة الأعمال (Portfolio):</span>
              {candidate.portfolio_links?.length > 0 ? (
                <div className="space-y-1.5">
                  {candidate.portfolio_links.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#c3f937] hover:underline font-mono break-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{link}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">لم يتم إرفاق روابط أعمال.</p>
              )}
            </div>

            {/* Professional Links */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 block">الروابط المهنية (LinkedIn / GitHub):</span>
              {candidate.professional_links?.length > 0 ? (
                <div className="space-y-1.5">
                  {candidate.professional_links.map((link, i) => (
                    <a
                      key={i}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-cyan-400 hover:underline font-mono break-all"
                    >
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{link}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">لم يتم إرفاق روابط مهنية.</p>
              )}
            </div>
          </div>

          {/* Evaluations / Reviews Breakdown */}
          <div className="p-6 bg-[rgba(24,29,40,0.78)] border border-white/10 rounded-3xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">تقييمات المحكمين ({candidate.reviews.length})</h3>
              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="text-xs font-bold text-[#c3f937] hover:underline"
              >
                + إضافة أو تعديل تقييمي
              </button>
            </div>

            {candidate.reviews.length === 0 ? (
              <p className="text-sm text-slate-400 py-6 text-center">لم يقم أي محكم بتقييم هذا المتقدم بعد.</p>
            ) : (
              <div className="space-y-4">
                {candidate.reviews.map((rev) => (
                  <div key={rev.id} className="p-5 bg-white/[0.03] border border-white/5 rounded-2xl space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <span className="text-sm font-bold text-white">المحكم: {rev.reviewer_name}</span>
                      <span className="text-xs font-mono font-bold text-[#c3f937]">
                        التوصية: {rev.overall_recommendation}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                      <div className="p-2.5 bg-[#0c1018] rounded-xl">فهم الإجابات: <strong>{rev.understanding_score}/5</strong></div>
                      <div className="p-2.5 bg-[#0c1018] rounded-xl">الدافع والشغف: <strong>{rev.motivation_score}/5</strong></div>
                      <div className="p-2.5 bg-[#0c1018] rounded-xl">الاستعداد التقني: <strong>{rev.technical_readiness_score}/5</strong></div>
                      <div className="p-2.5 bg-[#0c1018] rounded-xl">حل المشكلات: <strong>{rev.problem_solving_score}/5</strong></div>
                      <div className="p-2.5 bg-[#0c1018] rounded-xl">العمل الجماعي: <strong>{rev.teamwork_score}/5</strong></div>
                      <div className="p-2.5 bg-[#0c1018] rounded-xl">التواصل: <strong>{rev.communication_score}/5</strong></div>
                    </div>

                    {rev.strengths && (
                      <p className="text-xs text-emerald-300 bg-emerald-500/10 p-3 rounded-xl">
                        <strong>نقاط القوة:</strong> {rev.strengths}
                      </p>
                    )}
                    {rev.concerns && (
                      <p className="text-xs text-orange-300 bg-orange-500/10 p-3 rounded-xl">
                        <strong>ملاحظات وتحفظات:</strong> {rev.concerns}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right / Side: Contact, Info, Notes, Timeline */}
        <div className="space-y-6">
          {/* Direct Contact Actions */}
          <div className="p-6 bg-[rgba(24,29,40,0.78)] border border-white/10 rounded-3xl space-y-4 backdrop-blur-md">
            <h3 className="text-base font-bold text-white">التواصل المباشر</h3>
            <div className="space-y-3">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#c3f937]/10 border border-[#c3f937]/30 text-[#c3f937] font-bold text-xs hover:bg-[#c3f937]/20 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" aria-hidden="true" />
                  <span>محادثة فورية عبر واتساب</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" aria-hidden="true" />
              </a>

              <a
                href={emailLink}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-300 font-bold text-xs hover:bg-purple-500/20 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" aria-hidden="true" />
                  <span>إرسال بريد إلكتروني</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Personal Info Details */}
          <div className="p-6 bg-[rgba(24,29,40,0.78)] border border-white/10 rounded-3xl space-y-4 text-xs sm:text-sm backdrop-blur-md">
            <h3 className="text-base font-bold text-white mb-2">البيانات الشخصية</h3>

            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">تاريخ الميلاد:</span>
              <span className="font-mono text-white">
                {candidate.birth_date} {age ? `(${age} سنة)` : ""}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">رقم الجوال:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-white" dir="ltr">{candidate.phone}</span>
                <button
                  type="button"
                  onClick={() => copyText(candidate.phone, "phone")}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  {copiedKey === "phone" ? <Check className="w-3.5 h-3.5 text-[#c3f937]" aria-hidden="true" /> : "نسخ"}
                </button>
              </div>
            </div>

            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">البريد:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-white truncate max-w-[140px]" title={candidate.email}>
                  {candidate.email}
                </span>
                <button
                  type="button"
                  onClick={() => copyText(candidate.email, "email")}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  {copiedKey === "email" ? <Check className="w-3.5 h-3.5 text-[#c3f937]" aria-hidden="true" /> : "نسخ"}
                </button>
              </div>
            </div>

            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">المدينة:</span>
              <span className="text-white font-bold">{candidate.city}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">الجهة الحالية:</span>
              <span className="text-white text-left truncate max-w-[160px]" title={candidate.organization}>
                {candidate.organization}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">التخصص:</span>
              <span className="text-white text-left truncate max-w-[160px]" title={candidate.specialization}>
                {candidate.specialization}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-white/5">
              <span className="text-slate-400">الحالة:</span>
              <span className="text-white">{candidate.current_status}</span>
            </div>

            <div className="flex justify-between py-2">
              <span className="text-slate-400">بيئة الفريق:</span>
              <span className={`font-bold ${candidate.team_environment_preference === "comfortable" ? "text-[#c3f937]" : "text-orange-400"}`}>
                {candidate.team_environment_preference === "comfortable" ? "بيئة مشتركة تناسبه" : "نفس الجنس فقط"}
              </span>
            </div>
          </div>

          {/* Internal Notes Thread */}
          <div className="p-6 bg-[rgba(24,29,40,0.78)] border border-white/10 rounded-3xl space-y-4 backdrop-blur-md">
            <h3 className="text-base font-bold text-white">الملاحظات الداخلية ({candidate.notes.length})</h3>
            <InternalNotesSection
              applicationId={candidate.id}
              notes={candidate.notes}
              currentUserId={currentUser?.id || ""}
              isSuperAdmin={currentUser?.role === "super_admin"}
              onNoteAdded={(n) => setCandidate({ ...candidate, notes: [n, ...candidate.notes] })}
              onNoteDeleted={(nid) => setCandidate({ ...candidate, notes: candidate.notes.filter((n) => n.id !== nid) })}
            />
          </div>

          {/* Audit Timeline */}
          <div className="p-6 bg-[rgba(24,29,40,0.78)] border border-white/10 rounded-3xl space-y-4 backdrop-blur-md">
            <h3 className="text-base font-bold text-white">سجل حالات الطلب</h3>
            <AuditTimeline history={candidate.history} />
          </div>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && (
        <StatusChangeModal
          applicationId={candidate.id}
          candidateName={candidate.full_name}
          currentStatus={candidate.application_status}
          updatedAt={candidate.updated_at}
          onSuccess={() => {
            setShowStatusModal(false);
            fetchCandidate();
          }}
          onClose={() => setShowStatusModal(false)}
        />
      )}

      {/* Candidate Review Modal */}
      {showReviewModal && (
        <CandidateReviewModal
          applicationId={candidate.id}
          candidateName={candidate.full_name}
          existingReview={candidate.my_review}
          onSuccess={() => {
            setShowReviewModal(false);
            fetchCandidate();
          }}
          onClose={() => setShowReviewModal(false)}
        />
      )}
    </div>
  );
}
