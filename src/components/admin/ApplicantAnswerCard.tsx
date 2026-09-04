"use client";
import React, { useState, useMemo } from "react";
import type { QuestionDefinition } from "@/lib/admin/questionRegistry";
import { parseApplicantLink, type ParsedLinkItem } from "@/lib/admin/questionRegistry";
import {
  CheckCircle2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Globe,
  ExternalLink,
  Code2,
  Video,
  AlertCircle,
  FileText,
  Share2,
  Layers,
  ArrowLeft,
  ChevronLeft,
} from "lucide-react";
import { toLatinDigits } from "@/lib/admin/formatters";

interface Props {
  question: QuestionDefinition;
  totalQuestions: number;
  rawAnswer: unknown;
  isReviewed: boolean;
  onToggleReviewed: () => void;
  questionScore?: number;
  onScoreChange?: (score: number) => void;
  note?: string;
  onNoteChange?: (note: string) => void;
  isOpen?: boolean;
  onToggleOpen?: () => void;
  onGoToNextQuestion?: () => void;
  hasNextQuestion?: boolean;
}

const SCORE_LABELS: Record<number, string> = {
  1: "1 — ضعيف",
  2: "2 — محدود",
  3: "3 — جيد",
  4: "4 — قوي",
  5: "5 — استثنائي",
};

function getPlatformIcon(platform: ParsedLinkItem["platform"]) {
  switch (platform) {
    case "github":
      return <Code2 className="w-4 h-4 text-[#c3f937]" />;
    case "linkedin":
      return <Share2 className="w-4 h-4 text-cyan-400" />;
    case "x":
      return <Globe className="w-4 h-4 text-slate-300" />;
    case "drive":
      return <FileText className="w-4 h-4 text-amber-400" />;
    case "portfolio":
      return <Layers className="w-4 h-4 text-pink-400" />;
    default:
      return <Globe className="w-4 h-4 text-slate-400" />;
  }
}

export default function ApplicantAnswerCard({
  question,
  totalQuestions,
  rawAnswer,
  isReviewed,
  onToggleReviewed,
  questionScore = 0,
  onScoreChange,
  note = "",
  onNoteChange,
  isOpen = false,
  onToggleOpen,
  onGoToNextQuestion,
  hasNextQuestion = false,
}: Props) {
  const [showFullText, setShowFullText] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(Boolean(note));
  const [copied, setCopied] = useState(false);

  // Format order number e.g. "01"
  const orderPadded = String(question.order).padStart(2, "0");
  const isLinkType = question.answerType === "links";
  const isVideoType = question.answerType === "video";

  const answerString = useMemo(() => {
    if (rawAnswer === null || rawAnswer === undefined) return "";
    if (Array.isArray(rawAnswer)) return rawAnswer.join("\n");
    if (typeof rawAnswer === "string") return rawAnswer.trim();
    return String(rawAnswer);
  }, [rawAnswer]);

  // Check if answer is long (> 8 lines or > 450 chars)
  const isLongAnswer = useMemo(() => {
    if (!answerString || isLinkType || isVideoType) return false;
    const lines = answerString.split("\n").length;
    return lines > 8 || answerString.length > 450;
  }, [answerString, isLinkType, isVideoType]);

  const displayedAnswerText = useMemo(() => {
    if (!isLongAnswer || showFullText) return answerString;
    const lines = answerString.split("\n");
    if (lines.length > 8) {
      return lines.slice(0, 8).join("\n");
    }
    return answerString.slice(0, 420) + "...";
  }, [answerString, isLongAnswer, showFullText]);

  // Parse links if linkType
  const parsedLinks = useMemo(() => {
    if (!isLinkType || !answerString) return [];
    const rawItems = Array.isArray(rawAnswer)
      ? (rawAnswer as string[])
      : answerString.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    return rawItems.map(parseApplicantLink);
  }, [isLinkType, rawAnswer, answerString]);

  function handleCopy(text: string) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <article
      id={`question-${question.order}`}
      className={`answer-review-card ${
        isReviewed ? "border-emerald-500/25" : ""
      }`}
      dir="rtl"
    >
      {/* ── Collapsed / Expandable Trigger Header ─────────────────── */}
      <button
        type="button"
        onClick={onToggleOpen}
        className="answer-card-trigger"
        aria-expanded={isOpen}
      >
        {/* Question Number Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`w-11 h-11 rounded-2xl font-mono text-sm font-bold flex items-center justify-center border transition-all ${
              isOpen
                ? "bg-[#c3f937] text-[#0c1018] border-[#c3f937] shadow-md shadow-[#c3f937]/20"
                : isReviewed
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                : "bg-white/[0.04] text-slate-300 border-white/10"
            }`}
          >
            <span className="numeric-value">{toLatinDigits(orderPadded)}</span>
          </span>
        </div>

        {/* Question Title & Helper */}
        <div className="min-w-0 pr-1">
          <h3 className="question-title truncate">
            {question.titleAr}
          </h3>
          {question.helperAr && (
            <p className="question-helper line-clamp-1">
              {question.helperAr}
            </p>
          )}
        </div>

        {/* Status Badge & Chevron */}
        <div className="flex items-center gap-3 shrink-0">
          {isReviewed ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 size={14} />
              <span>تمت المراجعة</span>
            </span>
          ) : questionScore > 0 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-pink-500/15 text-pink-400 border border-pink-500/30">
              <AlertCircle size={14} />
              <span>يحتاج مراجعة</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-slate-400 bg-white/[0.04] border border-white/10">
              <span>لم يبدأ</span>
            </span>
          )}

          <span className="w-8 h-8 rounded-xl bg-white/[0.04] flex items-center justify-center text-slate-400">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        </div>
      </button>

      {/* ── Open Question Body ─────────────────────────────────────── */}
      {isOpen && (
        <div className="border-t border-white/[0.08] pt-5">
          {/* Subheader: Full Question Title & Details */}
          <div className="px-6 pb-4 space-y-2">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold text-[#c3f937] tracking-wider uppercase">
                نص السؤال الكامل
              </span>
              <button
                type="button"
                onClick={() => handleCopy(answerString)}
                disabled={!answerString}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-colors disabled:opacity-40"
              >
                {copied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                <span>{copied ? "تم نسخ الإجابة" : "نسخ الإجابة"}</span>
              </button>
            </div>
            <h4 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
              {question.titleAr}
            </h4>
            {question.helperAr && (
              <p className="text-sm text-slate-300 leading-relaxed">
                {question.helperAr}
              </p>
            )}
          </div>

          {/* Section: Applicant Answer Box */}
          <div className="px-6 pb-2">
            <div className="text-xs font-bold text-slate-400 pb-2">
              إجابة المتقدم:
            </div>

            {/* Answer Display */}
            {isLinkType ? (
              <div className="p-5 rounded-2xl bg-[#050910]/60 border border-white/[0.08] mb-5 space-y-3">
                {parsedLinks.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {parsedLinks.map((link, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {getPlatformIcon(link.platform)}
                          <div className="min-w-0">
                            <span className="text-xs text-slate-400 block">{link.name}</span>
                            <span className="text-xs font-mono text-cyan-400 block truncate" dir="ltr">
                              {link.domain}
                            </span>
                          </div>
                        </div>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                          title="فتح الرابط"
                        >
                          <ExternalLink size={15} />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-2">لا توجد روابط مرفقة.</p>
                )}
              </div>
            ) : isVideoType ? (
              <div className="p-5 rounded-2xl bg-[#050910]/60 border border-white/[0.08] mb-5 space-y-3">
                {answerString ? (
                  <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-pink-500/10 border border-pink-500/20">
                    <div className="flex items-center gap-3 min-w-0">
                      <Video className="w-5 h-5 text-pink-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block">رابط الفيديو المرفق</span>
                        <a
                          href={answerString}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono text-cyan-400 hover:underline block truncate"
                          dir="ltr"
                        >
                          {answerString}
                        </a>
                      </div>
                    </div>
                    <a
                      href={answerString}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-1.5 rounded-lg bg-pink-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5"
                    >
                      <ExternalLink size={14} />
                      <span>مشاهدة الفيديو</span>
                    </a>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 py-2">لم يقم المتقدم بإرفاق رابط فيديو.</p>
                )}
              </div>
            ) : (
              <div className="applicant-answer">
                {displayedAnswerText || (
                  <span className="text-slate-500 italic">لم يقدم المتقدم إجابة على هذا السؤال.</span>
                )}

                {/* Truncation Toggle Button */}
                {isLongAnswer && (
                  <div className="pt-3 mt-3 border-t border-white/[0.08] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowFullText(!showFullText)}
                      className="text-xs font-bold text-[#c3f937] hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>{showFullText ? "طي الإجابة" : "عرض الإجابة كاملة"}</span>
                      {showFullText ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                    <span className="text-xs text-slate-400 font-mono">
                      {answerString.split("\n").length} أسطر
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Optional Note Box Input */}
          {showNoteInput && (
            <div className="px-6 pb-4 space-y-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <MessageSquare size={13} className="text-[#c3f937]" />
                <span>ملاحظة المحكّم على هذه الإجابة:</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => onNoteChange?.(e.target.value)}
                rows={2}
                placeholder="اكتب ملاحظاتك الفنية حول إجابة هذا السؤال..."
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-[#c3f937]"
              />
            </div>
          )}

          {/* ── Question Review Action Strip ───────────────────────── */}
          <div className="answer-review-actions">
            {/* Score 1 - 5 Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs text-slate-400 font-bold">تقييم الإجابة:</span>

              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((val) => {
                  const isSelected = questionScore === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => onScoreChange?.(val)}
                      style={{ width: "48px", height: "44px" }}
                      className={`rounded-xl text-xs font-bold font-mono transition-all flex flex-col items-center justify-center cursor-pointer ${
                        isSelected
                          ? "bg-[#c3f937] text-[#0c1018] font-black shadow-md shadow-[#c3f937]/30 scale-105"
                          : "bg-white/[0.05] hover:bg-white/[0.12] text-slate-200 hover:text-white border border-white/10"
                      }`}
                      title={SCORE_LABELS[val]}
                    >
                      <span className="numeric-value text-sm">{toLatinDigits(val)}</span>
                    </button>
                  );
                })}
              </div>

              {/* Selected Score Meaning */}
              {questionScore > 0 && (
                <span className="text-xs font-bold text-[#c3f937] px-2.5 py-1 rounded-lg bg-[#c3f937]/10 border border-[#c3f937]/20">
                  {SCORE_LABELS[questionScore]}
                </span>
              )}
            </div>

            {/* Actions: Add Note, Toggle Reviewed, Next Question */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowNoteInput(!showNoteInput)}
                className={`h-11 px-3.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                  showNoteInput || note
                    ? "bg-[#c3f937]/10 border-[#c3f937]/30 text-[#c3f937]"
                    : "bg-white/[0.04] border-white/10 text-slate-300 hover:text-white"
                }`}
              >
                <MessageSquare size={15} />
                <span>{note ? "تعديل الملاحظة" : "إضافة ملاحظة"}</span>
              </button>

              <button
                type="button"
                onClick={onToggleReviewed}
                className={`h-11 px-4 rounded-xl border text-xs font-bold inline-flex items-center gap-2 transition-all cursor-pointer ${
                  isReviewed
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-sm"
                    : "bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-slate-300 hover:text-white"
                }`}
              >
                <CheckCircle2 size={16} className={isReviewed ? "text-emerald-400" : "text-slate-400"} />
                <span>{isReviewed ? "تمت مراجعة الإجابة" : "تحديد كمراجعة"}</span>
              </button>

              {hasNextQuestion && (
                <button
                  type="button"
                  onClick={onGoToNextQuestion}
                  className="h-11 px-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white font-bold text-xs inline-flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <span>السؤال التالي</span>
                  <ChevronLeft size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
