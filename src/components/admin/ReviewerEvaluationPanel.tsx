"use client";
import React, { useState, useEffect, useImperativeHandle, forwardRef, useMemo } from "react";
import type { ApplicationReview, OverallRecommendation } from "@/types/admin";
import {
  Star,
  CheckCircle2,
  Save,
  Award,
  AlertCircle,
  Clock,
  Send,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  HelpCircle,
  Hourglass,
  ThumbsDown,
  FileText,
  MessageSquare,
} from "lucide-react";
import { toLatinDigits } from "@/lib/admin/formatters";

export interface Criterion {
  key: string;
  order: number;
  name: string;
  desc: string;
}

export const CRITERIA_LIST: Criterion[] = [
  { key: "motivation", order: 1, name: "وضوح الدافع", desc: "مدى جدية ووضوح الرغبة في الانضمام للمعسكر وما يتطلع لاكتسابه." },
  { key: "learning", order: 2, name: "القدرة على التعلم", desc: "القدرة على التعلم الذاتي المستقل وتجاوز الصعوبات التقنية." },
  { key: "understanding", order: 3, name: "فهم المشكلة", desc: "استيعاب المشكلة المقترحة ووضوح فكرة الحل الرقمي المناسب لها." },
  { key: "thinking", order: 4, name: "جودة التفكير", desc: "طريقة التفكير التحليلي واستيعاب منهجية Vibe Coding الذكية." },
  { key: "experience", order: 5, name: "الخبرة المناسبة للمستوى", desc: "تناسب المهارات التقنية الحالية للمتقدم مع متطلبات المسار المختار." },
  { key: "teamwork", order: 6, name: "العمل الجماعي", desc: "الاستعداد للتعاون ودعم الزملاء والمشاركة الفعالة ضمن فريق متنوع." },
  { key: "contribution", order: 7, name: "القدرة على المساهمة", desc: "قيمة الإضافة الملموسة التي سيقدمها المتقدم للمشروع الختامي." },
  { key: "portfolio", order: 8, name: "جودة الأعمال والروابط", desc: "قوة النماذج والمشاريع السابقة وحسابات GitHub / المعرض." },
  { key: "fit", order: 9, name: "ملاءمة المتقدم للمعسكر", desc: "الجاهزية التامة والتفرغ للالتزام بجدول وساعات المعسكر." },
];

export const SCORE_EXPLANATIONS: Record<number, { label: string; desc: string }> = {
  1: { label: "ضعيف", desc: "لا تتوفر المعايير الدنيا المطلوبة" },
  2: { label: "محدود", desc: "تتوفر بشكل جزئي مع وجود فجوات" },
  3: { label: "جيد", desc: "مستوى مناسب ومطابق للمتطلبات" },
  4: { label: "قوي", desc: "مستوى متميز وواضح الإمكانات" },
  5: { label: "استثنائي", desc: "مستوى نادراً ما يُشاهد ومبهر" },
};

export interface ReviewerPanelHandle {
  submitReview: (isFinal: boolean) => Promise<boolean>;
  getMissingItems: () => string[];
  isReadyForFinalSubmit: boolean;
  activeCriterionKey: string;
  focusCriterion: (key: string) => void;
}

interface Props {
  applicationId: string;
  initialReview?: ApplicationReview | null;
  reviewerName: string;
  onReviewSaved: (savedReview: ApplicationReview) => void;
  onValidationFailed?: (missing: string[]) => void;
}

const ReviewerEvaluationPanel = forwardRef<ReviewerPanelHandle, Props>(function ReviewerEvaluationPanel(
  { applicationId, initialReview, reviewerName, onReviewSaved, onValidationFailed },
  ref
) {
  // Scores for the 9 criteria
  const [scores, setScores] = useState<Record<string, number>>({
    motivation: 0,
    learning: 0,
    understanding: 0,
    thinking: 0,
    experience: 0,
    teamwork: 0,
    contribution: 0,
    portfolio: 0,
    fit: 0,
  });

  const [activeCriterionKey, setActiveCriterionKey] = useState<string>("motivation");
  const [recommendation, setRecommendation] = useState<OverallRecommendation | "">("");
  const [strengths, setStrengths] = useState("");
  const [concerns, setConcerns] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Populate from initialReview if present
  useEffect(() => {
    if (initialReview) {
      let parsedCriteria: Record<string, number> | null = null;
      let cleanNotes = initialReview.internal_notes || "";

      if (cleanNotes.includes("[CRITERIA:")) {
        try {
          const match = cleanNotes.match(/\[CRITERIA:\s*({[\s\S]*?})\]/);
          if (match && match[1]) {
            parsedCriteria = JSON.parse(match[1]);
            cleanNotes = cleanNotes.replace(/\[CRITERIA:\s*({[\s\S]*?})\]\n*/, "").trim();
          }
        } catch {}
      }

      if (parsedCriteria) {
        setScores(parsedCriteria);
      } else {
        setScores({
          motivation: Math.round(Number(initialReview.motivation_score) || 0),
          learning: Math.round(Number(initialReview.motivation_score) || 0),
          understanding: Math.round(Number(initialReview.understanding_score) || 0),
          thinking: Math.round(Number(initialReview.problem_solving_score) || 0),
          experience: Math.round(Number(initialReview.technical_readiness_score) || 0),
          teamwork: Math.round(Number(initialReview.teamwork_score) || 0),
          contribution: Math.round(Number(initialReview.communication_score) || 0),
          portfolio: Math.round(Number(initialReview.technical_readiness_score) || 0),
          fit: Math.round(Number(initialReview.communication_score) || 0),
        });
      }

      setRecommendation(initialReview.overall_recommendation);
      setStrengths(initialReview.strengths || "");
      setConcerns(initialReview.concerns || "");
      setInternalNotes(cleanNotes);

      // Extract rejection reason if recorded
      if (cleanNotes.includes("[سبب القرار]:")) {
        const match = cleanNotes.match(/\[سبب القرار\]:\s*(.*?)(?:\n|$)/);
        if (match && match[1]) {
          setRejectionReason(match[1].trim());
        }
      }

      // Open first un-scored criterion
      const firstUnscored = CRITERIA_LIST.find((c) => !parsedCriteria || !parsedCriteria[c.key]);
      if (firstUnscored) {
        setActiveCriterionKey(firstUnscored.key);
      }
    }
  }, [initialReview]);

  // Statistics
  const scoredCount = useMemo(() => {
    return Object.values(scores).filter((s) => s > 0).length;
  }, [scores]);

  const completionPct = Math.round((scoredCount / 9) * 100);
  const totalScoreSum = Object.values(scores).reduce((a, b) => a + b, 0);
  const averageScore = scoredCount > 0 ? (totalScoreSum / scoredCount).toFixed(1) : "—";

  // Check missing items
  const missingItems = useMemo(() => {
    const list: string[] = [];
    const unscored = CRITERIA_LIST.filter((c) => !scores[c.key] || scores[c.key] === 0);
    if (unscored.length > 0) {
      list.push(`${toLatinDigits(unscored.length)} محاور تقييم لم تكتمل`);
    }
    if (!recommendation) {
      list.push("التوصية النهائية لم تُحدد");
    }
    if ((recommendation === "no" || recommendation === "strong_no") && !rejectionReason.trim()) {
      list.push("سبب القرار إلزامي عند التوصية بعدم القبول");
    }
    return list;
  }, [scores, recommendation, rejectionReason]);

  const isReadyForFinalSubmit = missingItems.length === 0;

  function setScore(key: string, val: number) {
    setScores((prev) => ({ ...prev, [key]: val }));
    setErrorMsg("");

    // Auto advance to next unscored criterion
    const currentIdx = CRITERIA_LIST.findIndex((c) => c.key === key);
    if (currentIdx < CRITERIA_LIST.length - 1) {
      const nextCriterion = CRITERIA_LIST[currentIdx + 1];
      if (!scores[nextCriterion.key]) {
        setActiveCriterionKey(nextCriterion.key);
      }
    }
  }

  async function executeSubmit(isFinal: boolean): Promise<boolean> {
    setErrorMsg("");
    setSuccessMsg("");

    if (isFinal) {
      if (missingItems.length > 0) {
        if (onValidationFailed) {
          onValidationFailed(missingItems);
        }
        setErrorMsg(`تبقى ${toLatinDigits(missingItems.length)} عناصر يجب إكمالها قبل إنهاء المراجعة.`);
        return false;
      }
    }

    setSaving(true);

    try {
      const motivationScore = Math.max(1, Math.min(5, Math.round(((scores.motivation || 3) + (scores.learning || 3)) / 2)));
      const understandingScore = Math.max(1, Math.min(5, scores.understanding || 3));
      const problemSolvingScore = Math.max(1, Math.min(5, scores.thinking || 3));
      const technicalReadinessScore = Math.max(1, Math.min(5, Math.round(((scores.experience || 3) + (scores.portfolio || 3)) / 2)));
      const teamworkScore = Math.max(1, Math.min(5, scores.teamwork || 3));
      const communicationScore = Math.max(1, Math.min(5, Math.round(((scores.contribution || 3) + (scores.fit || 3)) / 2)));

      const criteriaTag = `[CRITERIA: ${JSON.stringify(scores)}]`;
      const combinedNotes = rejectionReason.trim()
        ? `${criteriaTag}\n[سبب القرار]: ${rejectionReason.trim()}\n${internalNotes.trim()}`
        : `${criteriaTag}\n${internalNotes.trim()}`;

      const rec = recommendation || "maybe";

      const res = await fetch(`/api/admin/applications/${applicationId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          understanding_score: understandingScore,
          motivation_score: motivationScore,
          technical_readiness_score: technicalReadinessScore,
          problem_solving_score: problemSolvingScore,
          teamwork_score: teamworkScore,
          communication_score: communicationScore,
          overall_recommendation: rec,
          strengths: strengths.trim() || null,
          concerns: concerns.trim() || null,
          internal_notes: combinedNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMsg(isFinal ? "تم إنهاء المراجعة واعتماد التقييم بنجاح." : "تم حفظ المسودة بنجاح.");
        if (data.review) {
          onReviewSaved(data.review);
        }
        setTimeout(() => setSuccessMsg(""), 3500);
        return true;
      } else {
        setErrorMsg(data.error || "تعذر حفظ التقييم.");
        return false;
      }
    } catch {
      setErrorMsg("حدث خطأ أثناء الاتصال بالخادم.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  useImperativeHandle(ref, () => ({
    submitReview: executeSubmit,
    getMissingItems: () => missingItems,
    isReadyForFinalSubmit,
    activeCriterionKey,
    focusCriterion: (key: string) => {
      setActiveCriterionKey(key);
      const el = document.getElementById(`criterion-row-${key}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    },
  }));

  return (
    <div id="evaluation-panel" className="judge-score-panel shadow-2xl" dir="rtl">
      {/* ── Fixed Panel Header ───────────────────────────────────────── */}
      <div className="p-5 border-b border-white/10 space-y-3 bg-[#111624]/90 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#c3f937]/15 border border-[#c3f937]/30 flex items-center justify-center text-[#c3f937] shrink-0">
              <Award size={18} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-white tracking-tight leading-tight">
                تقييم المحكّم
              </h2>
              <span className="text-xs text-slate-400 block truncate">
                {reviewerName || "المحكم"}
              </span>
            </div>
          </div>

          <div className="text-left shrink-0 font-mono">
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-slate-300 numeric-value">
              {toLatinDigits(scoredCount)} / {toLatinDigits(9)} مكتملة
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-300 pt-1">
          <span>المتوسط الحسابي:</span>
          <span className="font-mono text-[#c3f937] font-bold text-sm">
            <span className="numeric-value">{toLatinDigits(averageScore)}</span> / <span className="numeric-value">5</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#c3f937] transition-all duration-300"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* ── Notifications ────────────────────────────────────────────── */}
      {successMsg && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="mx-4 mt-3 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 font-semibold animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── Scrollable Body ──────────────────────────────────────────── */}
      <div className="judge-score-body space-y-6">
        {/* 9 Criteria List Accordion */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold text-slate-300 tracking-wider">
              محاور التقييم (9 محاور)
            </h3>
            <span className="text-[11px] font-mono text-slate-400 numeric-value">
              {toLatinDigits(scoredCount)} من {toLatinDigits(9)}
            </span>
          </div>

          <div className="space-y-2.5">
            {CRITERIA_LIST.map((crit) => {
              const currentVal = scores[crit.key] || 0;
              const isExpanded = activeCriterionKey === crit.key;
              const hasScore = currentVal > 0;
              const orderPadded = String(crit.order).padStart(2, "0");

              return (
                <div
                  id={`criterion-row-${crit.key}`}
                  key={crit.key}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isExpanded
                      ? "bg-white/[0.045] border-[#c3f937]/35 shadow-lg shadow-black/40"
                      : hasScore
                      ? "bg-white/[0.025] border-emerald-500/25 hover:bg-white/[0.04]"
                      : "bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.035]"
                  }`}
                >
                  {/* Criterion Header Row */}
                  <button
                    type="button"
                    onClick={() => setActiveCriterionKey(isExpanded ? "" : crit.key)}
                    className="w-full p-3.5 flex items-center justify-between gap-3 text-right cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-mono text-xs font-bold text-slate-400 numeric-value shrink-0">
                        {toLatinDigits(orderPadded)}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white truncate">
                        {crit.name}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {hasScore ? (
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          {toLatinDigits(currentVal)} — {SCORE_EXPLANATIONS[currentVal]?.label}
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400 px-2 py-0.5 rounded bg-white/[0.04] border border-white/10">
                          لم يُقيّم
                        </span>
                      )}
                      {isExpanded ? (
                        <ChevronUp size={16} className="text-slate-400" />
                      ) : (
                        <ChevronDown size={16} className="text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Detail View */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-white/[0.06] space-y-3 bg-black/20">
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {crit.desc}
                      </p>

                      {/* 5 Score Buttons (48px x 44px) */}
                      <div className="grid grid-cols-5 gap-2 pt-1">
                        {[1, 2, 3, 4, 5].map((val) => {
                          const isSelected = currentVal === val;

                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() => setScore(crit.key, val)}
                              style={{ width: "100%", height: "44px" }}
                              className={`rounded-xl text-xs font-bold font-mono transition-all flex flex-col items-center justify-center cursor-pointer ${
                                isSelected
                                  ? "bg-[#c3f937] text-[#0c1018] font-black shadow-md shadow-[#c3f937]/30 scale-[1.03]"
                                  : "bg-white/[0.05] hover:bg-white/[0.12] text-slate-200 hover:text-white border border-white/10"
                              }`}
                              title={SCORE_EXPLANATIONS[val]?.label}
                            >
                              <span className="numeric-value text-sm">{toLatinDigits(val)}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Score meaning description */}
                      {hasScore && (
                        <div className="flex items-center justify-between text-[11px] text-[#c3f937] bg-[#c3f937]/10 border border-[#c3f937]/20 p-2 rounded-xl">
                          <span className="font-bold">
                            {toLatinDigits(currentVal)} — {SCORE_EXPLANATIONS[currentVal]?.label}:
                          </span>
                          <span className="text-slate-300">
                            {SCORE_EXPLANATIONS[currentVal]?.desc}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Final Recommendation Section ──────────────────────────── */}
        <div className="pt-3 border-t border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-white tracking-wider flex items-center gap-1.5">
              <span>التوصية النهائية</span>
              <span className="text-rose-400">*</span>
            </h3>
            {recommendation && (
              <span className="text-[11px] text-[#c3f937] font-semibold">محددة</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {[
              {
                key: "strong_yes" as const,
                label: "أوصي بترشيحه مبدئيًا",
                icon: <ThumbsUp size={16} />,
                activeClass: "text-emerald-300 border-emerald-500/50 bg-emerald-500/15 ring-1 ring-emerald-500/30",
              },
              {
                key: "maybe" as const,
                label: "يحتاج مراجعة إضافية",
                icon: <HelpCircle size={16} />,
                activeClass: "text-purple-300 border-purple-500/50 bg-purple-500/15 ring-1 ring-purple-500/30",
              },
              {
                key: "yes" as const,
                label: "قائمة الانتظار",
                icon: <Hourglass size={16} />,
                activeClass: "text-amber-300 border-amber-500/50 bg-amber-500/15 ring-1 ring-amber-500/30",
              },
              {
                key: "no" as const,
                label: "لا أوصي بقبوله",
                icon: <ThumbsDown size={16} />,
                activeClass: "text-rose-300 border-rose-500/50 bg-rose-500/15 ring-1 ring-rose-500/30",
              },
            ].map((item) => {
              const isSelected = recommendation === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setRecommendation(item.key);
                    setErrorMsg("");
                  }}
                  className={`p-3 rounded-xl text-xs font-bold border transition-all text-right flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? item.activeClass
                      : "bg-white/[0.03] hover:bg-white/[0.07] border-white/10 text-slate-300"
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mandatory reason when rejecting */}
        {(recommendation === "no" || recommendation === "strong_no") && (
          <div className="space-y-1.5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
            <label className="text-xs font-bold text-rose-300 flex items-center justify-between">
              <span>سبب القرار (إلزامي عند عدم التوصية)</span>
              <span className="text-rose-400 font-mono text-xs">*</span>
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={2}
              placeholder="اكتب أسباب عدم التوصية بقبول المتقدم..."
              className="w-full p-2.5 rounded-lg bg-black/40 border border-rose-500/30 text-white text-xs placeholder-rose-300/40 focus:outline-none focus:border-rose-400"
            />
          </div>
        )}

        {/* Notes Areas */}
        <div className="space-y-3 pt-1">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">نقاط القوة</label>
            <textarea
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              rows={2}
              placeholder="أبرز ما يميز المتقدم وإجاباته..."
              className="w-full p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#c3f937]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">نقاط تحتاج مناقشة</label>
            <textarea
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              rows={2}
              placeholder="أي تحفظات أو استيضاحات إضافية..."
              className="w-full p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#c3f937]"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">الملاحظة النهائية (سرية للمحكمين)</label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              rows={2}
              placeholder="أي ملاحظات إضافية للجنة التحكيم..."
              className="w-full p-2.5 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#c3f937]"
            />
          </div>
        </div>
      </div>

      {/* ── Fixed Panel Footer ───────────────────────────────────────── */}
      <div className="p-4 border-t border-white/10 bg-[#0e1320] flex items-center gap-2.5">
        <button
          type="button"
          onClick={() => executeSubmit(false)}
          disabled={saving}
          className="flex-1 h-11 inline-flex items-center justify-center gap-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-bold text-slate-200 hover:text-white transition-all cursor-pointer disabled:opacity-50"
        >
          <Save size={16} />
          <span>حفظ المسودة</span>
        </button>

        <button
          type="button"
          onClick={() => executeSubmit(true)}
          disabled={saving}
          className="flex-1 h-11 inline-flex items-center justify-center gap-2 px-3 rounded-xl bg-[#c3f937] hover:bg-[#b2e82e] text-[#0c1018] text-xs font-bold transition-all shadow-md shadow-[#c3f937]/20 cursor-pointer disabled:opacity-50"
        >
          <Send size={16} />
          <span>{saving ? "جارٍ الحفظ..." : "إنهاء وإرسال التقييم"}</span>
        </button>
      </div>
    </div>
  );
});

export default ReviewerEvaluationPanel;
