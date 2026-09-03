"use client";
import React, { useState } from "react";
import type { ApplicationReview, OverallRecommendation } from "@/types/admin";
import { Star, AlertCircle, X, Award } from "lucide-react";

interface Props {
  applicationId: string;
  candidateName: string;
  existingReview?: ApplicationReview | null;
  onSuccess: (review: ApplicationReview) => void;
  onClose: () => void;
}

const CRITERIA = [
  { key: "understanding_score", label: "فهم الأسئلة ووضوح الإجابات", desc: "مدى استيعاب أسئلة التقديم والإجابة عليها بدقة وتفصيل." },
  { key: "motivation_score", label: "الدافع والشغف للانضمام", desc: "الحماس والالتزام المتوقع لبناء مشروع حقيقي خلال أيام المعسكر." },
  { key: "technical_readiness_score", label: "الاستعداد التقني المناسب للمستوى", desc: "تناسب قدراته مع المستوى المختار (مبتدئ / ممارس / متقدم)." },
  { key: "problem_solving_score", label: "التفكير وحل المشكلات", desc: "طريقة التعامل مع التحديات التقنية والتفكير المنطقي." },
  { key: "teamwork_score", label: "العمل الجماعي وروح الفريق", desc: "القدرة على التعاون بفاعلية مع زملاء الفريق متعددي المستويات." },
  { key: "communication_score", label: "التواصل ووضوح التعبير", desc: "سلاسة الصياغة وشرح الأفكار والمشاريع بوضوح." },
];

const RECOMMENDATIONS: { id: OverallRecommendation; label: string; color: string }[] = [
  { id: "strong_yes", label: "أوصي بشدة (Strong Yes)", color: "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" },
  { id: "yes", label: "أوصي (Yes)", color: "text-[#c3f937] border-[#c3f937]/40 bg-[#c3f937]/10" },
  { id: "maybe", label: "يحتاج مناقشة (Maybe)", color: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10" },
  { id: "no", label: "لا أوصي (No)", color: "text-orange-400 border-orange-500/40 bg-orange-500/10" },
  { id: "strong_no", label: "لا أوصي بشدة (Strong No)", color: "text-rose-400 border-rose-500/40 bg-rose-500/10" },
];

export default function CandidateReviewModal({
  applicationId,
  candidateName,
  existingReview,
  onSuccess,
  onClose,
}: Props) {
  const [scores, setScores] = useState({
    understanding_score: existingReview?.understanding_score || 3,
    motivation_score: existingReview?.motivation_score || 3,
    technical_readiness_score: existingReview?.technical_readiness_score || 3,
    problem_solving_score: existingReview?.problem_solving_score || 3,
    teamwork_score: existingReview?.teamwork_score || 3,
    communication_score: existingReview?.communication_score || 3,
  });

  const [recommendation, setRecommendation] = useState<OverallRecommendation>(
    existingReview?.overall_recommendation || "yes"
  );
  const [strengths, setStrengths] = useState(existingReview?.strengths || "");
  const [concerns, setConcerns] = useState(existingReview?.concerns || "");
  const [internalNotes, setInternalNotes] = useState(existingReview?.internal_notes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const averageScore = (
    Object.values(scores).reduce((a, b) => a + Number(b), 0) / 6
  ).toFixed(1);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/applications/${applicationId}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...scores,
          overall_recommendation: recommendation,
          strengths,
          concerns,
          internal_notes: internalNotes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess(data.review);
      } else {
        setError(data.error || "تعذر حفظ التقييم.");
      }
    } catch {
      setError("تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto" dir="rtl">
      <div className="bg-[#181d28] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-xl w-full my-8 shadow-2xl space-y-5">
        <div className="flex items-start justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
              <h3 className="text-xl font-bold text-white">تقييم المتقدم (Review)</h3>
            </div>
            <p className="text-xs text-slate-300">
              المتقدم: <span className="font-bold text-white">{candidateName}</span>
            </p>
          </div>
          <div className="text-left bg-white/5 px-3 py-2 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-400 block">المتوسط</span>
            <span className="text-xl font-mono font-bold text-[#c3f937] flex items-center gap-1">
              <Star className="w-4 h-4 fill-[#c3f937] text-[#c3f937]" aria-hidden="true" />
              <span>{averageScore} / 5</span>
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Criteria scoring */}
          <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
            {CRITERIA.map((c) => {
              const currentVal = scores[c.key as keyof typeof scores];
              return (
                <div key={c.key} className="p-3.5 bg-white/[0.03] rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{c.label}</span>
                    <span className="text-sm font-mono font-bold text-[#c3f937]">{currentVal} / 5</span>
                  </div>
                  <p className="text-[11px] text-slate-400">{c.desc}</p>
                  <div className="flex gap-2 pt-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setScores({ ...scores, [c.key]: val })}
                        className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          currentVal === val
                            ? "bg-[#c3f937] text-[#0c1018] border-[#c3f937] shadow-[0_0_10px_rgba(195,249,55,0.3)]"
                            : "bg-[#0c1018] text-slate-300 border-white/10 hover:border-[#c3f937]/40"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Overall recommendation */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-200">
              التوصية النهائية:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {RECOMMENDATIONS.map((r) => {
                const selected = recommendation === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRecommendation(r.id)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      selected
                        ? `${r.color} shadow-sm`
                        : "bg-[#0c1018] text-slate-400 border-white/10 hover:border-slate-500"
                    }`}
                  >
                    {r.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Strengths */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200">
              أبرز نقاط القوة:
            </label>
            <textarea
              rows={2}
              value={strengths}
              onChange={(e) => setStrengths(e.target.value)}
              placeholder="ما الذي ميّز إجابات وأعمال المتقدم؟"
              className="w-full bg-[#0c1018] border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c3f937]"
            />
          </div>

          {/* Concerns */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200">
              مخاوف أو تحفظات:
            </label>
            <textarea
              rows={2}
              value={concerns}
              onChange={(e) => setConcerns(e.target.value)}
              placeholder="هل توجد نقاط ضعف أو عدم وضوح في إجاباته؟"
              className="w-full bg-[#0c1018] border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c3f937]"
            />
          </div>

          {/* Internal notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-200">
              ملاحظات إضافية خاصة بالمحكم:
            </label>
            <textarea
              rows={2}
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="أي ملاحظات داخلية لفريق الفرز..."
              className="w-full bg-[#0c1018] border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c3f937]"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-bold bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] rounded-xl transition-all shadow-lg shadow-[#c3f937]/20 disabled:opacity-50"
            >
              {loading ? "جارٍ الحفظ..." : "حفظ التقييم"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
