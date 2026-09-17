"use client";
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import type { ApplicationDetailItem } from "@/types/admin";
import { getGenderLabel } from "@/types/admin";
import AdminStatusBadge from "@/components/admin/StatusBadge";
import StatusChangeModal from "@/components/admin/StatusChangeModal";
import ReviewerEvaluationPanel, { type ReviewerPanelHandle } from "@/components/admin/ReviewerEvaluationPanel";
import ApplicantAnswerCard from "@/components/admin/ApplicantAnswerCard";
import ApplicantProfileModal from "@/components/admin/ApplicantProfileModal";
import IncompleteEvaluationModal, { type MissingEvaluationItem } from "@/components/admin/IncompleteEvaluationModal";
import {
  getQuestionsForLevel,
  type QuestionDefinition,
} from "@/lib/admin/questionRegistry";
import {
  ChevronRight,
  User,
  MapPin,
  Building2,
  GraduationCap,
  Clock,
  Printer,
  Edit3,
  AlertCircle,
  X,
  SlidersHorizontal,
  ChevronLeft,
  Save,
  Send,
  MoreHorizontal,
  CheckCircle2,
  Copy,
  Check,
  Award,
  Filter,
} from "lucide-react";
import {
  formatDateArabic,
  toLatinDigits,
} from "@/lib/admin/formatters";

const LEVEL_CONFIG = {
  foundation: {
    label: "مبتدئ (Foundation)",
    badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    desc: "المسار التأسيسي لتعلم أسلوب Vibe Coding وبناء أول منتج رقمي بالذكاء الاصطناعي.",
  },
  practitioner: {
    label: "ممارس (Practitioner)",
    badgeColor: "bg-[#c3f937]/15 text-[#c3f937] border-[#c3f937]/35 font-bold",
    desc: "مسار ذوي الخبرة المتوسطة في البرمجة لتسريع بناء النماذج الأولية المتقدمة.",
  },
  advanced: {
    label: "متقدم (Advanced)",
    badgeColor: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    desc: "مسار المهندسين والرواد لبناء وإطلاق منتجات رقمية معقدة وقيادة الفرق تقنيًا.",
  },
};
interface Props {
  id: string;
}

export default function CandidateReviewWorkstation({ id }: Props) {
  const [candidate, setCandidate] = useState<ApplicationDetailItem | null>(null);
  const [currentUser, setCurrentUser] = useState<{ id?: string; full_name?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modals & Panels
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMobileEvalModal, setShowMobileEvalModal] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const profileTriggerRef = useRef<HTMLButtonElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const evalPanelRef = useRef<ReviewerPanelHandle>(null);

  // Review states per question
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>({});
  const [reviewedQuestions, setReviewedQuestions] = useState<Record<string, boolean>>({});
  const [questionScores, setQuestionScores] = useState<Record<string, number>>({});
  const [questionNotes, setQuestionNotes] = useState<Record<string, string>>({});
  const [filterOnlyUnreviewed, setFilterOnlyUnreviewed] = useState(false);

  // Missing items for incomplete submission alert
  const [missingItemsList, setMissingItemsList] = useState<MissingEvaluationItem[]>([]);

  // Draft auto-save indicator
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const reloadData = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    let active = true;

    async function loadInitialData() {
      try {
        const [appRes, meRes] = await Promise.all([
          fetch(`/api/admin/applications/${id}`),
          fetch("/api/admin/auth/me"),
        ]);

        const appData = await appRes.json();
        const meData = await meRes.json();

        if (!active) return;

        if (appData.success) {
          setCandidate(appData.item);

          const qList = getQuestionsForLevel(appData.item.level);

          const draftKey = `buildx_qreview_${id}`;
          let savedDraft: {
            reviewedQuestions?: Record<string, boolean>;
            questionScores?: Record<string, number>;
            questionNotes?: Record<string, string>;
          } | null = null;
          try {
            const raw = localStorage.getItem(draftKey);
            if (raw) savedDraft = JSON.parse(raw);
          } catch {}

          const initialReviewed = savedDraft?.reviewedQuestions || {};
          const initialScores = savedDraft?.questionScores || {};
          const initialNotes = savedDraft?.questionNotes || {};

          setReviewedQuestions(initialReviewed);
          setQuestionScores(initialScores);
          setQuestionNotes(initialNotes);

          // Automatically open FIRST unreviewed question only
          const firstUnreviewed = qList.find((q) => !initialReviewed[q.key]) || qList[0];
          if (firstUnreviewed) {
            setOpenQuestions({ [firstUnreviewed.key]: true });
          }
        } else {
          setError(appData.error || "تعذر جلب ملف المتقدم.");
        }

        if (meData.success) {
          setCurrentUser(meData.user);
        }
      } catch {
        if (active) setError("تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadInitialData();

    return () => {
      active = false;
    };
  }, [id]);

  // Close more menu on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setShowMoreMenu(false);
      }
    }
    if (showMoreMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMoreMenu]);

  // Persist question evaluations to localStorage (Auto-save draft)
  const saveDraftLocally = useCallback(
    (
      newReviewed: Record<string, boolean>,
      newScores: Record<string, number>,
      newNotes: Record<string, string>
    ) => {
      setSaveStatus("saving");
      try {
        const draftKey = `buildx_qreview_${id}`;
        localStorage.setItem(
          draftKey,
          JSON.stringify({
            reviewedQuestions: newReviewed,
            questionScores: newScores,
            questionNotes: newNotes,
            updatedAt: Date.now(),
          })
        );
        setTimeout(() => setSaveStatus("saved"), 300);
      } catch {
        setSaveStatus("error");
      }
    },
    [id]
  );

  function copyText(text: string, key: string) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  // Questions for this candidate's level
  const questionsForLevel = useMemo(() => {
    if (!candidate) return [];
    return getQuestionsForLevel(candidate.level);
  }, [candidate]);

  // Filtered questions based on toggle
  const visibleQuestions = useMemo(() => {
    if (!filterOnlyUnreviewed) return questionsForLevel;
    return questionsForLevel.filter((q) => !reviewedQuestions[q.key]);
  }, [questionsForLevel, filterOnlyUnreviewed, reviewedQuestions]);

  // Review Progress stats
  const totalQuestionsCount = questionsForLevel.length;
  const reviewedCount = useMemo(() => {
    return questionsForLevel.filter((q) => reviewedQuestions[q.key]).length;
  }, [questionsForLevel, reviewedQuestions]);

  const reviewProgressPercent = totalQuestionsCount > 0
    ? Math.round((reviewedCount / totalQuestionsCount) * 100)
    : 0;

  // Question action handlers
  const handleToggleReviewed = (qKey: string) => {
    const nextState = !reviewedQuestions[qKey];
    const updated = { ...reviewedQuestions, [qKey]: nextState };
    setReviewedQuestions(updated);
    saveDraftLocally(updated, questionScores, questionNotes);
  };

  const handleScoreChange = (qKey: string, score: number) => {
    const updated = { ...questionScores, [qKey]: score };
    setQuestionScores(updated);
    let updatedReviewed = reviewedQuestions;
    if (score > 0 && !reviewedQuestions[qKey]) {
      updatedReviewed = { ...reviewedQuestions, [qKey]: true };
      setReviewedQuestions(updatedReviewed);
    }
    saveDraftLocally(updatedReviewed, updated, questionNotes);
  };

  const handleNoteChange = (qKey: string, note: string) => {
    const updated = { ...questionNotes, [qKey]: note };
    setQuestionNotes(updated);
    saveDraftLocally(reviewedQuestions, questionScores, updated);
  };

  const handleToggleCardOpen = (qKey: string) => {
    setOpenQuestions((prev) => ({ ...prev, [qKey]: !prev[qKey] }));
  };

  const expandAll = () => {
    const all: Record<string, boolean> = {};
    questionsForLevel.forEach((q) => (all[q.key] = true));
    setOpenQuestions(all);
  };

  const collapseAll = () => {
    setOpenQuestions({});
  };

  const jumpToQuestion = (q: QuestionDefinition) => {
    setOpenQuestions({ [q.key]: true });
    const elem = document.getElementById(`question-${q.order}`);
    if (elem) {
      elem.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const goToNextQuestionFrom = (currentOrder: number) => {
    const nextQ = questionsForLevel.find((q) => q.order === currentOrder + 1);
    if (nextQ) {
      setOpenQuestions({ [nextQ.key]: true });
      const elem = document.getElementById(`question-${nextQ.order}`);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const goToPrevQuestion = () => {
    const currentlyOpenKey = Object.keys(openQuestions).find((k) => openQuestions[k]);
    const currentQ = questionsForLevel.find((q) => q.key === currentlyOpenKey);
    const prevOrder = currentQ ? currentQ.order - 1 : 1;
    const prevQ = questionsForLevel.find((q) => q.order === Math.max(1, prevOrder));
    if (prevQ) {
      jumpToQuestion(prevQ);
    }
  };

  const goToNextQuestion = () => {
    const currentlyOpenKey = Object.keys(openQuestions).find((k) => openQuestions[k]);
    const currentQ = questionsForLevel.find((q) => q.key === currentlyOpenKey);
    const nextOrder = currentQ ? currentQ.order + 1 : 1;
    const nextQ = questionsForLevel.find((q) => q.order === Math.min(totalQuestionsCount, nextOrder));
    if (nextQ) {
      jumpToQuestion(nextQ);
    }
  };

  // Final evaluation submission verification
  const handleFinalSubmitAttempt = async () => {
    const missing: MissingEvaluationItem[] = [];

    // Check unreviewed questions
    const unreviewedQuestionsList = questionsForLevel.filter((q) => !reviewedQuestions[q.key]);
    if (unreviewedQuestionsList.length > 0) {
      missing.push({
        id: "questions",
        type: "unreviewed_questions",
        label: `${toLatinDigits(unreviewedQuestionsList.length)} إجابات لم تتم مراجعتها بعد`,
        onNavigate: () => {
          jumpToQuestion(unreviewedQuestionsList[0]);
        },
      });
    }

    // Check evaluation panel missing items
    if (evalPanelRef.current) {
      const panelMissing = evalPanelRef.current.getMissingItems();
      panelMissing.forEach((itemText, idx) => {
        missing.push({
          id: `panel_${idx}`,
          type: "criterion",
          label: itemText,
          onNavigate: () => {
            if (window.innerWidth < 1200) {
              setShowMobileEvalModal(true);
            } else {
              const el = document.getElementById("evaluation-panel");
              el?.scrollIntoView({ behavior: "smooth", block: "center" });
            }
          },
        });
      });
    }

    if (missing.length > 0) {
      setMissingItemsList(missing);
      setShowIncompleteModal(true);
      return;
    }

    // If all complete, execute submission
    if (evalPanelRef.current) {
      await evalPanelRef.current.submitReview(true);
    }
  };

  if (loading) {
    return (
      <div className="review-workspace space-y-6 animate-pulse" dir="rtl">
        <div className="h-36 bg-white/[0.03] rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-[650px] bg-white/[0.03] rounded-3xl" />
          <div className="lg:col-span-4 h-[650px] bg-white/[0.03] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="review-workspace" dir="rtl">
        <div className="p-10 text-center bento-card text-rose-300 max-w-xl mx-auto my-14 space-y-5">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">تعذر فتح ملف المتقدم</h2>
          <p className="text-sm text-slate-300">{error}</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={reloadData}
              className="px-5 py-2.5 rounded-xl bg-[#c3f937] text-[#0c1018] font-bold text-xs cursor-pointer"
            >
              إعادة المحاولة
            </button>
            <Link
              href="/admin/applications"
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs cursor-pointer"
            >
              العودة للطلبات
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const levelInfo = LEVEL_CONFIG[candidate.level] || LEVEL_CONFIG.foundation;
  const myReview = candidate.reviews?.find((r) => r.reviewer_id === currentUser?.id);

  return (
    <div className="review-workspace" dir="rtl">
      {/* ── 1. Applicant Review Hero Card ────────────────────────────── */}
      <header className="applicant-review-hero">
        {/* Row 1: Identity & Primary Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 min-w-0">
            {/* Back Button */}
            <Link
              href="/admin/applications"
              className="w-10 h-10 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors shrink-0"
              title="العودة لقائمة الطلبات"
            >
              <ChevronRight size={20} />
            </Link>

            {/* Candidate Name */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight truncate">
              {candidate.full_name}
            </h1>

            {/* Reference Code */}
            <span
              onClick={() => copyText(candidate.reference_code, "ref_code")}
              className="font-mono text-xs text-slate-300 bg-white/[0.05] hover:bg-white/[0.08] border border-white/10 px-2.5 py-1 rounded-lg cursor-pointer transition-colors numeric-value"
              title="انقر لنسخ رقم الطلب"
            >
              {copiedKey === "ref_code" ? "تم النسخ" : toLatinDigits(candidate.reference_code)}
            </span>

            {/* Status & Level Badges */}
            <AdminStatusBadge status={candidate.application_status} size="sm" />
            <span className={`px-2.5 py-0.5 rounded-lg text-xs border font-semibold ${levelInfo.badgeColor}`}>
              {levelInfo.label}
            </span>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Primary Action: "بيانات المتقدم" */}
            <button
              ref={profileTriggerRef}
              type="button"
              onClick={() => setShowProfileModal(true)}
              className="inline-flex items-center gap-2 px-4 h-11 rounded-xl bg-[#c3f937] hover:bg-[#b2e82e] text-[#0c1018] font-bold text-xs sm:text-sm shadow-md shadow-[#c3f937]/20 transition-all cursor-pointer"
            >
              <User size={16} />
              <span>بيانات المتقدم</span>
            </button>

            {/* More Actions Dropdown */}
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setShowMoreMenu(!showMoreMenu)}
                className="w-11 h-11 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="إجراءات إضافية"
                aria-label="قائمة الإجراءات الإضافية"
                aria-expanded={showMoreMenu}
              >
                <MoreHorizontal size={18} />
              </button>

              {showMoreMenu && (
                <div
                  className="absolute left-0 mt-2 w-52 rounded-2xl bg-[#111624] border border-white/15 p-1.5 shadow-2xl z-50 animate-in fade-in zoom-in-95 text-right"
                  role="menu"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      setShowStatusModal(true);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.08] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Edit3 size={15} className="text-cyan-400" />
                    <span>تعديل حالة الطلب</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      window.print();
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.08] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    <Printer size={15} className="text-[#c3f937]" />
                    <span>طباعة ملخص المتقدم</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      copyText(window.location.href, "page_link");
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.08] flex items-center gap-2.5 transition-colors cursor-pointer"
                  >
                    {copiedKey === "page_link" ? (
                      <Check size={15} className="text-emerald-400" />
                    ) : (
                      <Copy size={15} className="text-purple-400" />
                    )}
                    <span>{copiedKey === "page_link" ? "تم نسخ الرابط" : "نسخ رابط الصفحة"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Row 2: Short Meta Items */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300 pt-1">
          <span className="flex items-center gap-1.5">
            <MapPin size={14} className="text-slate-400" />
            <span>{candidate.city || "غير محدد"}</span>
          </span>

          <span className="text-slate-500">•</span>

          <span className="flex items-center gap-1.5">
            <User size={14} className="text-slate-400" />
            <span>الجنس: {getGenderLabel(candidate.gender)}</span>
          </span>

          <span className="text-slate-500">•</span>

          <span className="flex items-center gap-1.5">
            <Building2 size={14} className="text-slate-400" />
            <span>{candidate.organization || "غير محدد"}</span>
          </span>

          <span className="text-slate-500">•</span>

          <span className="flex items-center gap-1.5">
            <GraduationCap size={14} className="text-slate-400" />
            <span>{candidate.specialization || "غير محدد"}</span>
          </span>

          <span className="text-slate-500">•</span>

          <span className="flex items-center gap-1.5">
            <Clock size={14} className="text-slate-400" />
            <span>
              تاريخ التقديم:{" "}
              <strong className="text-slate-200 numeric-value">
                {formatDateArabic(candidate.submitted_at)}
              </strong>
            </span>
          </span>

          {currentUser?.full_name && (
            <>
              <span className="text-slate-500">•</span>
              <span className="flex items-center gap-1.5">
                <Award size={14} className="text-[#c3f937]" />
                <span>المحكّم: <strong className="text-[#c3f937]">{currentUser.full_name}</strong></span>
              </span>
            </>
          )}
        </div>

        {/* Row 3: Single Clear Progress Bar */}
        <div className="pt-3 border-t border-white/[0.08] space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4 text-slate-300">
              <span>
                مراجعة الإجابات:{" "}
                <strong className="text-white numeric-value">
                  {toLatinDigits(reviewedCount)} / {toLatinDigits(totalQuestionsCount)}
                </strong>
              </span>

              <span className="text-slate-500">•</span>

              <span>
                اكتمال الأسئلة:{" "}
                <strong className="text-[#c3f937] numeric-value">{toLatinDigits(reviewProgressPercent)}%</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              {candidate.reviews && candidate.reviews.length > 0 && (
                <span className="text-slate-300 text-xs">
                  {toLatinDigits(candidate.reviews.length)} تقييمات سابقة
                </span>
              )}
              {saveStatus === "saving" ? (
                <span className="text-xs text-amber-400 font-mono">جارٍ الحفظ...</span>
              ) : saveStatus === "saved" ? (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  <span>تم حفظ المسودة</span>
                </span>
              ) : null}
            </div>
          </div>

          <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
            <div
              className="h-full rounded-full bg-[#c3f937] transition-all duration-300"
              style={{ width: `${reviewProgressPercent}%` }}
            />
          </div>
        </div>
      </header>

      {/* ── 2. Review Layout ─────────────────────────────────────────── */}
      <div className="review-layout">
        {/* Right Side: Questions & Answers Area */}
        <main className="space-y-5 min-w-0">
          {/* Section Header & Toolbar Card */}
          <div className="bento-card p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  إجابات المتقدم
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  مسار {levelInfo.label} — {toLatinDigits(totalQuestionsCount)} أسئلة
                </p>
              </div>

              {/* Toolbar Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilterOnlyUnreviewed(!filterOnlyUnreviewed)}
                  className={`h-9 px-3 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer ${
                    filterOnlyUnreviewed
                      ? "bg-[#c3f937] text-[#0c1018] border-[#c3f937] font-bold"
                      : "bg-white/[0.05] border-white/10 text-slate-300 hover:text-white"
                  }`}
                >
                  <Filter size={13} />
                  <span>غير المراجعة فقط</span>
                </button>

                <button
                  type="button"
                  onClick={expandAll}
                  className="h-9 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  فتح الجميع
                </button>

                <button
                  type="button"
                  onClick={collapseAll}
                  className="h-9 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  إغلاق الجميع
                </button>
              </div>
            </div>

            {/* Fast Jump Strip (01, 02, ...) */}
            <div className="pt-2 border-t border-white/[0.08]">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {questionsForLevel.map((q) => {
                  const isRev = reviewedQuestions[q.key];
                  const hasScore = (questionScores[q.key] || 0) > 0;
                  const isOpen = Boolean(openQuestions[q.key]);
                  const orderPadded = String(q.order).padStart(2, "0");

                  return (
                    <button
                      key={q.key}
                      type="button"
                      onClick={() => jumpToQuestion(q)}
                      style={{ width: "48px", height: "44px" }}
                      className={`rounded-xl font-mono text-xs font-bold shrink-0 flex items-center justify-center transition-all cursor-pointer border ${
                        isOpen
                          ? "bg-[#c3f937] text-[#0c1018] border-[#c3f937] ring-2 ring-[#c3f937]/30 scale-105 shadow-md shadow-[#c3f937]/20"
                          : isRev
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                          : hasScore
                          ? "bg-pink-500/20 text-pink-300 border-pink-500/40"
                          : "bg-white/[0.04] text-slate-400 border-white/10 hover:bg-white/[0.08] hover:text-white"
                      }`}
                      title={q.titleAr}
                    >
                      <span className="numeric-value">{toLatinDigits(orderPadded)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Question Cards List */}
          <div className="space-y-4">
            {visibleQuestions.length > 0 ? (
              visibleQuestions.map((q) => {
                const answer = candidate.level_answers?.[q.key];

                return (
                  <ApplicantAnswerCard
                    key={q.key}
                    question={q}
                    totalQuestions={totalQuestionsCount}
                    rawAnswer={answer}
                    isReviewed={Boolean(reviewedQuestions[q.key])}
                    onToggleReviewed={() => handleToggleReviewed(q.key)}
                    questionScore={questionScores[q.key] || 0}
                    onScoreChange={(score) => handleScoreChange(q.key, score)}
                    note={questionNotes[q.key] || ""}
                    onNoteChange={(n) => handleNoteChange(q.key, n)}
                    isOpen={Boolean(openQuestions[q.key])}
                    onToggleOpen={() => handleToggleCardOpen(q.key)}
                    onGoToNextQuestion={() => goToNextQuestionFrom(q.order)}
                    hasNextQuestion={q.order < totalQuestionsCount}
                  />
                );
              })
            ) : (
              <div className="bento-card p-10 text-center space-y-2">
                <CheckCircle2 size={32} className="mx-auto text-emerald-400" />
                <h3 className="text-base font-bold text-white">تمت مراجعة جميع الأسئلة!</h3>
                <p className="text-xs text-slate-400">
                  يمكنك الآن الانتقال إلى لوحة التقييم لتدوين درجات المحاور والتوصية النهائية.
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Left Side: Desktop Sticky Reviewer Evaluation Panel */}
        <aside className="hidden xl:block">
          <ReviewerEvaluationPanel
            ref={evalPanelRef}
            applicationId={candidate.id}
            initialReview={myReview}
            reviewerName={currentUser?.full_name || "المحكم"}
            onReviewSaved={() => {
              reloadData();
            }}
            onValidationFailed={(missing) => {
              setMissingItemsList(
                missing.map((m, idx) => ({
                  id: String(idx),
                  type: "criterion",
                  label: m,
                }))
              );
              setShowIncompleteModal(true);
            }}
          />
        </aside>
      </div>

      {/* ── 3. Fixed Bottom Workspace Action Bar ──────────────────────── */}
      <footer className="workspace-action-bar flex items-center justify-between gap-4">
        {/* Left indicators (Progress & Autosave) */}
        <div className="flex items-center gap-4 text-xs min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 hidden sm:inline">حالة الحفظ:</span>
            <span className="font-mono text-emerald-400 font-semibold">
              {saveStatus === "saving" ? "جارٍ الحفظ..." : "تم حفظ المسودة"}
            </span>
          </div>

          <span className="text-slate-600 hidden sm:inline">|</span>

          <div className="text-slate-300 font-mono hidden md:inline">
            إجابات:{" "}
            <strong className="text-white numeric-value">
              {toLatinDigits(reviewedCount)} / {toLatinDigits(totalQuestionsCount)}
            </strong>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Navigation Between Questions */}
          <button
            type="button"
            onClick={goToPrevQuestion}
            className="h-10 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer hidden sm:inline-flex items-center gap-1"
          >
            <ChevronRight size={16} />
            <span>السابق</span>
          </button>

          <button
            type="button"
            onClick={goToNextQuestion}
            className="h-10 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white text-xs font-semibold cursor-pointer hidden sm:inline-flex items-center gap-1"
          >
            <span>التالي</span>
            <ChevronLeft size={16} />
          </button>

          {/* Under 1200px Mobile Eval Trigger */}
          <button
            type="button"
            onClick={() => setShowMobileEvalModal(true)}
            className="xl:hidden h-10 px-3.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <SlidersHorizontal size={15} />
            <span>فتح التقييم</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={() => evalPanelRef.current?.submitReview(false)}
            className="h-10 px-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
          >
            <Save size={15} />
            <span className="hidden sm:inline">حفظ المسودة</span>
          </button>

          {/* Final Submit Review - Single Primary Lime CTA */}
          <button
            type="button"
            onClick={handleFinalSubmitAttempt}
            className="h-10 px-4 rounded-xl bg-[#c3f937] hover:bg-[#b2e82e] text-[#0c1018] text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-md shadow-[#c3f937]/20"
          >
            <Send size={15} />
            <span>إنهاء وإرسال التقييم</span>
          </button>
        </div>
      </footer>

      {/* ── 4. Mobile & Tablet Evaluation Panel Modal (< 1200px) ──────── */}
      {showMobileEvalModal && (
        <div
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowMobileEvalModal(false);
          }}
          className="xl:hidden fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md"
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg max-h-[92dvh] bg-[#111624] border border-white/15 rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200"
          >
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0e1320]">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-[#c3f937]" />
                <span>لوحة تقييم المحكّم</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowMobileEvalModal(false)}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              <ReviewerEvaluationPanel
                ref={evalPanelRef}
                applicationId={candidate.id}
                initialReview={myReview}
                reviewerName={currentUser?.full_name || "المحكم"}
                showFooter={true}
                onReviewSaved={() => {
                  reloadData();
                  setShowMobileEvalModal(false);
                }}
                onValidationFailed={(missing) => {
                  setMissingItemsList(
                    missing.map((m, idx) => ({
                      id: String(idx),
                      type: "criterion",
                      label: m,
                    }))
                  );
                  setShowIncompleteModal(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── 5. Incomplete Evaluation Alert Modal ──────────────────────── */}
      <IncompleteEvaluationModal
        open={showIncompleteModal}
        onClose={() => setShowIncompleteModal(false)}
        missingItems={missingItemsList}
        onNavigateToFirstMissing={() => {
          setShowIncompleteModal(false);
          if (missingItemsList.length > 0 && missingItemsList[0].onNavigate) {
            missingItemsList[0].onNavigate();
          }
        }}
      />

      {/* ── 6. Applicant Profile Centered Modal ───────────────────────── */}
      <ApplicantProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        applicant={candidate}
        onEditStatus={() => setShowStatusModal(true)}
        onGoToReview={() => {
          const firstUnreviewed = questionsForLevel.find((q) => !reviewedQuestions[q.key]);
          if (firstUnreviewed) {
            jumpToQuestion(firstUnreviewed);
          }
        }}
        returnFocusRef={profileTriggerRef}
      />

      {/* ── 7. Status Change Modal ────────────────────────────────────── */}
      {showStatusModal && (
        <StatusChangeModal
          applicationId={candidate.id}
          candidateName={candidate.full_name}
          currentStatus={candidate.application_status}
          updatedAt={candidate.updated_at}
          onSuccess={() => {
            setShowStatusModal(false);
            reloadData();
          }}
          onClose={() => setShowStatusModal(false)}
        />
      )}
    </div>
  );
}
