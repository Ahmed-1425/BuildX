// =============================================================================
// BUILDx Judging Platform - Team Evaluation Form
// Scoring Only (No mandatory justification) & Category Voting at the End
// =============================================================================

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useJudging } from '../context/JudgingContext';
import { Team, Criterion, Evaluation, EvaluationScore } from '../types';
import { TeamMascot } from './TeamMascot';
import { calculateWeightedPoints } from '../utils/scoringEngine';
import { formatScore } from '../utils/formatters';
import {
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  ExternalLink,
  ArrowRight,
  Award,
  Sparkles,
  Zap,
  Target,
  Presentation,
  Bot,
} from 'lucide-react';

interface EvaluationFormProps {
  teamId: string;
  onBack: () => void;
}

export const EvaluationForm: React.FC<EvaluationFormProps> = ({ teamId, onBack }) => {
  const {
    teams,
    criteria,
    evaluations,
    awardCategories,
    awardVotes,
    currentJudge,
    settings,
    saveEvaluationDraft,
    submitEvaluation,
    castAwardVote,
  } = useJudging();

  const team = useMemo(() => teams.find((t) => t.id === teamId), [teams, teamId]);

  // Find existing evaluation by this judge for this team
  const existingEvaluation = useMemo(() => {
    if (!currentJudge) return undefined;
    return evaluations.find((e) => e.judgeId === currentJudge.id && e.teamId === teamId);
  }, [evaluations, currentJudge, teamId]);

  // Scores state: purely criterionId -> rawScore (0 to 10)
  const [scores, setScores] = useState<Record<string, number | null>>({});
  const [optionalNotes, setOptionalNotes] = useState('');

  // UI State
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [validationAlert, setValidationAlert] = useState<{
    missingCount: number;
    missingItems: string[];
    firstMissingId: string | null;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // References for scrolling to invalid cards
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Initialize scores from existing evaluation
  useEffect(() => {
    if (existingEvaluation) {
      const initialScores: Record<string, number | null> = {};
      criteria.forEach((c) => {
        const s = existingEvaluation.scores?.[c.id];
        initialScores[c.id] = s?.rawScore !== undefined ? s.rawScore : null;
      });
      setScores(initialScores);
      setOptionalNotes(existingEvaluation.finalRecommendation || '');
    } else {
      const emptyScores: Record<string, number | null> = {};
      criteria.forEach((c) => {
        emptyScores[c.id] = null;
      });
      setScores(emptyScores);
      setOptionalNotes('');
    }
  }, [existingEvaluation, criteria]);

  // Compute live total weighted score (0 to 100)
  const currentTotalScore = useMemo(() => {
    let total = 0;
    criteria.forEach((c) => {
      const raw = scores[c.id];
      if (typeof raw === 'number') {
        total += calculateWeightedPoints(raw, c.weight);
      }
    });
    return Number(total.toFixed(2));
  }, [scores, criteria]);

  // Completed criteria count (how many criteria have a score)
  const completedCriteriaCount = useMemo(() => {
    return criteria.filter((c) => typeof scores[c.id] === 'number').length;
  }, [scores, criteria]);

  // Debounced Autosave
  const autosaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  const triggerAutosave = useCallback(() => {
    if (!currentJudge || !team) return;
    if (!settings.isJudgingOpen && currentJudge.role !== 'admin') return;

    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    setSaveStatus('saving');

    autosaveTimeoutRef.current = setTimeout(async () => {
      const formattedScores: Record<string, EvaluationScore> = {};
      criteria.forEach((c) => {
        const raw = scores[c.id];
        if (typeof raw === 'number') {
          formattedScores[c.id] = {
            criterionId: c.id,
            rawScore: raw,
            weightedPoints: calculateWeightedPoints(raw, c.weight),
            justification: '',
            updatedAt: new Date().toISOString(),
          };
        }
      });

      const res = await saveEvaluationDraft(team.id, {
        scores: formattedScores,
        finalRecommendation: optionalNotes,
      });

      if (res.success) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
      }
    }, 800);
  }, [currentJudge, team, settings.isJudgingOpen, criteria, scores, optionalNotes, saveEvaluationDraft]);

  // Trigger autosave when scores change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    triggerAutosave();
  }, [scores, optionalNotes, triggerAutosave]);

  // Score select handler (Instant score record)
  const handleScoreSelect = (criterionId: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [criterionId]: value,
    }));
    setValidationAlert(null);
  };

  // Validate: all 11 criteria must have a score recorded
  const validateSubmission = () => {
    const missing: { id: string; label: string }[] = [];

    criteria.forEach((c) => {
      const raw = scores[c.id];
      if (typeof raw !== 'number') {
        missing.push({ id: `criterion-${c.id}`, label: `معيار ${c.orderNum}: ${c.title}` });
      }
    });

    if (missing.length > 0) {
      const first = missing[0];
      setValidationAlert({
        missingCount: missing.length,
        missingItems: missing.map((m) => m.label),
        firstMissingId: first.id,
      });

      // Auto scroll to first missing element
      const element = document.getElementById(first.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }

    setValidationAlert(null);
    return true;
  };

  const handleFinalSubmit = async () => {
    if (!validateSubmission()) return;
    setShowConfirmModal(true);
  };

  const confirmSubmission = async () => {
    if (!team || !currentJudge) return;
    setIsSubmitting(true);

    const formattedScores: Record<string, EvaluationScore> = {};
    criteria.forEach((c) => {
      const raw = scores[c.id]!;
      formattedScores[c.id] = {
        criterionId: c.id,
        rawScore: raw,
        weightedPoints: calculateWeightedPoints(raw, c.weight),
        justification: '',
        updatedAt: new Date().toISOString(),
      };
    });

    const fullEvaluation: Evaluation = {
      id: existingEvaluation?.id || crypto.randomUUID(),
      judgeId: currentJudge.id,
      teamId: team.id,
      status: 'submitted',
      strengths: '',
      improvements: '',
      finalRecommendation: optionalNotes,
      totalWeightedScore: currentTotalScore,
      version: (existingEvaluation?.version || 0) + 1,
      submittedAt: existingEvaluation?.submittedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scores: formattedScores,
    };

    const res = await submitEvaluation(team.id, fullEvaluation);
    setIsSubmitting(false);
    setShowConfirmModal(false);

    if (res.success) {
      setSaveStatus('saved');
      onBack();
    } else {
      setValidationAlert({
        missingCount: 1,
        missingItems: [res.error || 'فشل إرسال التقييم النهائي.'],
        firstMissingId: null,
      });
    }
  };

  if (!team) {
    return (
      <div className="p-8 text-center">
        <p className="text-[#e7edfd]/60 font-arabic">الفريق غير موجود.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 rounded-xl bg-[#182030] text-[#c3f937] font-arabic">
          العودة
        </button>
      </div>
    );
  }

  const isAlreadySubmitted = existingEvaluation?.status === 'submitted';

  // Category Voting Helper for this Judge
  const getJudgeVoteForCategory = (catId: string) => {
    if (!currentJudge) return null;
    return awardVotes.find((v) => v.judgeId === currentJudge.id && v.awardCategoryId === catId) || null;
  };

  const categoryIcons: Record<string, any> = {
    '1': Target,
    '2': Zap,
    '3': Presentation,
    '4': Bot,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-[#e7edfd]/70 hover:text-[#c3f937] transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" />
          <span className="font-arabic">العودة إلى لوحة الفرق</span>
        </button>

        {/* Autosave Pill */}
        <div className="flex items-center gap-2 text-xs font-tech px-3 py-1.5 rounded-full bg-[#121826] border border-[#e7edfd]/10">
          {saveStatus === 'saving' && (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span className="text-amber-300 font-arabic">جارٍ الحفظ تلقائيًا...</span>
            </>
          )}
          {saveStatus === 'saved' && (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#c3f937]" />
              <span className="text-[#c3f937] font-arabic">تم الحفظ</span>
            </>
          )}
          {saveStatus === 'error' && (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-red-400 font-arabic">تعذر الحفظ — إعادة المحاولة</span>
            </>
          )}
        </div>
      </div>

      {/* Team Header Hero Card (Code Only, No Project Name) */}
      <div
        className="bg-[#121826]/90 border border-[#e7edfd]/15 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden"
        style={{ borderTop: `4px solid ${team.accentColor || '#c3f937'}` }}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#0c1018] border border-[#e7edfd]/15 p-2 flex items-center justify-center shrink-0 shadow-inner">
              <TeamMascot src={team.mascotUrl} teamCode={team.teamCode} className="w-16 h-16" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-tech text-sm font-bold px-2.5 py-0.5 rounded-md bg-[#182030] text-[#c3f937] border border-[#c3f937]/30">
                  كود {team.teamCode}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#34155f]/40 text-[#a855f7] border border-[#a855f7]/30 font-arabic">
                  {team.challengeTrack}
                </span>
                <span className="text-xs text-[#e7edfd]/50 font-tech">#{team.presentationOrder}</span>
              </div>
              <h1 className="text-3xl font-bold text-[#e7edfd] mt-1 font-tech">
                الفريق {team.teamCode}
              </h1>
            </div>
          </div>

          {/* Links: Demo & Slides */}
          <div className="flex flex-wrap items-center gap-2">
            {team.presentationUrl && (
              <a
                href={team.presentationUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#182030] hover:bg-[#1f2a40] text-xs font-medium text-[#e7edfd] border border-[#e7edfd]/10 transition-colors"
              >
                <span className="font-arabic">العرض التقديمي</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#c3f937]" />
              </a>
            )}
            {team.demoUrl && (
              <a
                href={team.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#182030] hover:bg-[#1f2a40] text-xs font-medium text-[#e7edfd] border border-[#e7edfd]/10 transition-colors"
              >
                <span className="font-arabic">الرابط التجريبي Demo</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#c3f937]" />
              </a>
            )}
          </div>
        </div>

        {/* Live Score & Completion Floating Bar */}
        <div className="mt-8 pt-6 border-t border-[#e7edfd]/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-[#e7edfd]/60 font-arabic">الدرجة الإجمالية الموزونة</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="score-value text-3xl font-display font-bold text-[#c3f937]">
                {formatScore(currentTotalScore)}
              </span>
              <span className="text-xs text-[#e7edfd]/50 font-tech">/ 100.00</span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-[#e7edfd]/60 font-arabic">المعايير التي تم رصدها</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="font-tech text-2xl font-bold text-[#e7edfd]">
                {completedCriteriaCount}
              </span>
              <span className="text-xs text-[#e7edfd]/50 font-tech">/ 11 معيارًا</span>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-[#e7edfd]/60 font-arabic">نسبة اكتمال الرصد</span>
              <span className="font-tech text-[#c3f937]">
                {Math.round((completedCriteriaCount / 11) * 100)}%
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#0c1018] overflow-hidden p-0.5 border border-[#e7edfd]/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#a855f7] to-[#c3f937] transition-all duration-300"
                style={{ width: `${(completedCriteriaCount / 11) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Incomplete Validation Alert Banner */}
      {validationAlert && (
        <div className="p-5 rounded-2xl bg-red-950/40 border border-red-500/50 text-red-200 text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-red-300">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="font-arabic">يرجى رصد كافة المعايير قبل اعتماد التقييم</span>
          </div>
          <p className="text-xs font-arabic">
            تبقى <span className="font-tech font-bold text-amber-300">{validationAlert.missingCount}</span> معايير لم يتم رصد درجات لها:
          </p>
          <ul className="list-disc list-inside text-xs space-y-1 text-red-200/90 pr-2 font-arabic">
            {validationAlert.missingItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 11 Judging Criteria Cards - Score Only (No mandatory justification) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#e7edfd] font-arabic flex items-center gap-2">
            <span>معايير التقييم الـ 11</span>
            <span className="text-xs font-normal text-[#e7edfd]/60 font-arabic">
              (مجموع الأوزان = 100%)
            </span>
          </h2>
          <span className="text-xs text-[#c3f937] font-arabic font-medium">
            رصد الدرجة مباشرة من 0 إلى 10
          </span>
        </div>

        {criteria.map((criterion) => {
          const rawScore = scores[criterion.id];
          const hasScore = typeof rawScore === 'number';
          const weightedPts = hasScore ? calculateWeightedPoints(rawScore, criterion.weight) : 0;

          return (
            <div
              key={criterion.id}
              id={`criterion-${criterion.id}`}
              ref={(el) => (cardRefs.current[criterion.id] = el)}
              className={`bg-[#121826]/80 border rounded-2xl p-5 transition-all duration-200 ${
                hasScore
                  ? 'border-[#c3f937]/35 shadow-[0_0_15px_rgba(195,249,55,0.05)]'
                  : 'border-[#e7edfd]/10 hover:border-[#e7edfd]/20'
              }`}
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e7edfd]/10">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-tech text-sm font-bold shrink-0 mt-0.5 ${
                      hasScore
                        ? 'bg-[#c3f937] text-[#0c1018]'
                        : 'bg-[#182030] text-[#c3f937] border border-[#e7edfd]/15'
                    }`}
                  >
                    {criterion.orderNum}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#e7edfd] font-arabic">
                      {criterion.title}
                    </h3>
                    <p className="text-xs text-[#e7edfd]/65 mt-0.5 leading-relaxed font-arabic">
                      {criterion.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <div className="text-left">
                    <span className="text-[10px] text-[#e7edfd]/50 font-arabic block">النقاط المحسوبة</span>
                    <span className="score-value text-base font-bold text-[#c3f937]">
                      {hasScore ? formatScore(weightedPts) : '0.00'}
                    </span>
                    <span className="text-[10px] text-[#e7edfd]/40 font-tech"> / {criterion.weight}%</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#34155f]/40 text-[#a855f7] border border-[#a855f7]/30 font-tech text-xs font-bold">
                    {criterion.weight}%
                  </span>
                </div>
              </div>

              {/* Instant Score Selection Buttons (0 to 10) */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#e7edfd]/80 font-arabic">
                    اختر الدرجة:
                  </span>
                  <span className="text-xs font-tech font-bold text-[#c3f937]">
                    {hasScore ? `الدرجة المرصودة: ${rawScore} / 10` : 'لم ترصد الدرجة بعد'}
                  </span>
                </div>

                <div className="grid grid-cols-11 gap-1.5 sm:gap-2" dir="ltr">
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => {
                    const isSelected = rawScore === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleScoreSelect(criterion.id, val)}
                        className={`h-11 sm:h-12 rounded-xl font-tech font-bold text-sm sm:text-base transition-all flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-[#c3f937] text-[#0c1018] shadow-[0_0_18px_rgba(195,249,55,0.4)] scale-105 border-2 border-[#c3f937]'
                            : 'bg-[#182030]/90 hover:bg-[#1f2a40] text-[#e7edfd] border border-[#e7edfd]/10 hover:border-[#c3f937]/40'
                        }`}
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* Category Voting Section (Right at the end before final submit!) */}
      {/* ========================================================================= */}
      <div className="bg-[#121826]/90 border-2 border-[#a855f7]/30 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Award className="w-5 h-5 text-[#c3f937]" />
              <h2 className="text-lg sm:text-xl font-bold text-[#e7edfd] font-arabic">
                تصويت جوائز الفئات الخاصة بالفكرة
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#e7edfd]/70 font-arabic leading-relaxed">
              إذا كانت فكرة <strong className="text-[#c3f937]">الفريق {team.teamCode}</strong> مميزة ومناسبة لإحدى الجوائز التخصصية، يمكنك التصويت لها هنا مباشرة قبل اعتماد التقييم:
            </p>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {awardCategories.map((category) => {
            const Icon = categoryIcons[category.id] || Sparkles;
            const currentVote = getJudgeVoteForCategory(category.id);
            const isVotedForThisTeam = currentVote?.teamId === team.id;
            const votedForOtherTeam = currentVote && currentVote.teamId !== team.id
              ? teams.find((t) => t.id === currentVote.teamId)
              : null;

            return (
              <div
                key={category.id}
                className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                  isVotedForThisTeam
                    ? 'bg-[#1b2512]/70 border-[#c3f937] shadow-[0_0_20px_rgba(195,249,55,0.15)]'
                    : 'bg-[#0c1018]/70 border-[#e7edfd]/10 hover:border-[#a855f7]/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        isVotedForThisTeam ? 'bg-[#c3f937] text-[#0c1018]' : 'bg-[#34155f] text-[#c3f937]'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-[#e7edfd] font-arabic">
                        {category.title}
                      </h3>
                    </div>

                    {isVotedForThisTeam && (
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#c3f937]/20 text-[#c3f937] border border-[#c3f937]/40 font-arabic">
                        صوتك هنا ✓
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-[#e7edfd]/65 font-arabic leading-relaxed mb-4">
                    {category.description}
                  </p>
                </div>

                {/* Vote Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => castAwardVote(category.id, team.id)}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isVotedForThisTeam
                        ? 'bg-[#c3f937] text-[#0c1018] shadow-[0_0_15px_rgba(195,249,55,0.3)] hover:bg-[#b5eb2f]'
                        : votedForOtherTeam
                        ? 'bg-[#182030] hover:bg-[#222d42] text-amber-300 border border-amber-400/30'
                        : 'bg-[#182030] hover:bg-[#c3f937] hover:text-[#0c1018] text-[#e7edfd] border border-[#e7edfd]/15'
                    }`}
                  >
                    {isVotedForThisTeam ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-arabic">مصوّت لهذا الفريق (انقر للإلغاء)</span>
                      </>
                    ) : votedForOtherTeam ? (
                      <>
                        <Award className="w-4 h-4 text-amber-400" />
                        <span className="font-arabic">
                          مصوّت للفريق {votedForOtherTeam.teamCode} — انقر للنقل لهذا الفريق
                        </span>
                      </>
                    ) : (
                      <>
                        <Award className="w-4 h-4" />
                        <span className="font-arabic">صوّت للفريق {team.teamCode} في هذه الفئة</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Final Submission Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-[#121826] border border-[#e7edfd]/15">
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-[#e7edfd]/60 font-arabic">الدرجة النهائية المرصودة:</span>
            <div className="flex items-baseline gap-1">
              <span className="score-value text-3xl font-bold text-[#c3f937]">
                {formatScore(currentTotalScore)}
              </span>
              <span className="text-xs text-[#e7edfd]/40 font-tech">/ 100</span>
            </div>
          </div>
          <div className="h-8 w-px bg-[#e7edfd]/15 hidden sm:block" />
          <div className="text-right hidden sm:block">
            <span className="text-xs text-[#e7edfd]/60 font-arabic">حالة الرصد:</span>
            <span className="block text-xs font-bold text-[#e7edfd] font-arabic mt-0.5">
              {completedCriteriaCount === 11 ? 'جاهز للاعتماد' : `${11 - completedCriteriaCount} معايير متبقية`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={triggerAutosave}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#182030] hover:bg-[#1f2a40] text-[#e7edfd] text-xs sm:text-sm font-semibold border border-[#e7edfd]/15 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span className="font-arabic">حفظ كمسودة</span>
          </button>

          <button
            type="button"
            onClick={handleFinalSubmit}
            disabled={!settings.isJudgingOpen && currentJudge?.role !== 'admin'}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#c3f937] hover:bg-[#b5eb2f] text-[#0c1018] text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(195,249,55,0.25)] transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="font-arabic">
              {isAlreadySubmitted ? 'تحديث التقييم النهائي' : 'اعتماد وإرسال التقييم النهائي'}
            </span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c1018]/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#121826] border border-[#e7edfd]/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-right">
            <div className="w-12 h-12 rounded-2xl bg-[#c3f937]/15 border border-[#c3f937]/40 flex items-center justify-center text-[#c3f937] mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-[#e7edfd] text-center font-arabic">
              تأكيد اعتماد التقييم
            </h3>

            <p className="text-xs text-[#e7edfd]/75 text-center leading-relaxed font-arabic">
              أنت على وشك اعتماد التقييم النهائي لـ{' '}
              <strong className="text-[#c3f937] font-tech">الفريق {team.teamCode}</strong> بدرجة إجمالية{' '}
              <strong className="score-value text-sm text-[#c3f937]">
                {formatScore(currentTotalScore)}
              </strong>
              . يمكنك تعديل درجاتك لاحقًا طالما أن فترة التحكيم لا تزال مفتوحة.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-3 rounded-xl bg-[#182030] hover:bg-[#1f2a40] text-xs font-semibold text-[#e7edfd] border border-[#e7edfd]/15 transition-all cursor-pointer font-arabic"
              >
                مراجعة إضافية
              </button>
              <button
                type="button"
                onClick={confirmSubmission}
                disabled={isSubmitting}
                className="flex-1 py-3 rounded-xl bg-[#c3f937] hover:bg-[#b5eb2f] text-xs font-bold text-[#0c1018] transition-all cursor-pointer flex items-center justify-center gap-1.5 font-arabic"
              >
                {isSubmitting ? 'جارٍ الإرسال...' : 'نعم، اعتمد التقييم'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
