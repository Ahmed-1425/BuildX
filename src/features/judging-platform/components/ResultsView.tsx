// =============================================================================
// BUILDx Judging Platform - Results & Ceremony Reveal Mode
// Strictly gated until all 4 judges finish scoring + Team codes only
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useJudging } from '../context/JudgingContext';
import { TeamMascot } from './TeamMascot';
import { formatScore } from '../utils/formatters';
import {
  Trophy,
  Crown,
  Medal,
  Award,
  Sparkles,
  Lock,
  Unlock,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  ArrowLeft,
} from 'lucide-react';

export const ResultsView: React.FC = () => {
  const {
    teams,
    leaderboard,
    categoryWinners,
    settings,
    currentJudge,
    isAllJudgesCompleted,
    judgeCompletionStats,
    totalSubmittedEvaluations,
    totalRequiredEvaluations,
    navigate,
  } = useJudging();

  // Ceremony presentation mode state
  const [ceremonyMode, setCeremonyMode] = useState(false);
  const [ceremonyStep, setCeremonyStep] = useState(0);

  // Top 3 Teams
  const firstPlace = leaderboard[0];
  const secondPlace = leaderboard[1];
  const thirdPlace = leaderboard[2];

  // Keyboard navigation for ceremony mode
  useEffect(() => {
    if (!ceremonyMode) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === ' ' || e.key === 'Enter') {
        setCeremonyStep((prev) => Math.min(prev + 1, 8));
      } else if (e.key === 'ArrowRight') {
        setCeremonyStep((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Escape') {
        setCeremonyMode(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [ceremonyMode]);

  // If not all 4 judges have finished, hide results and show completion progress!
  if (!isAllJudgesCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="bg-[#121826]/90 border-2 border-amber-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-5 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#e7edfd] font-arabic">
            النتائج النهائية وحفل الختام محجوبة حالياً
          </h1>
          <p className="text-sm sm:text-base text-[#e7edfd]/75 mt-3 max-w-xl mx-auto font-arabic leading-relaxed">
            لا تظهر النتيجة النهائية ومنصة الفائزين إلا بعد أن ينتهي <strong className="text-[#c3f937]">المحكمون الأربعة كاملين</strong> من رصد واعتماد جميع الفرق.
          </p>

          {/* Overall Progress Meter */}
          <div className="mt-8 max-w-md mx-auto bg-[#0c1018] border border-[#e7edfd]/15 rounded-2xl p-4 text-right">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-[#e7edfd]/70 font-arabic">إجمالي التقييمات المعتمدة:</span>
              <span className="font-tech font-bold text-[#c3f937]">
                {totalSubmittedEvaluations} / {totalRequiredEvaluations} تقييم
              </span>
            </div>
            <div className="w-full h-3 rounded-full bg-[#182030] overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-[#c3f937] transition-all duration-500"
                style={{
                  width: `${Math.round((totalSubmittedEvaluations / (totalRequiredEvaluations || 32)) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* 4 Judges Status Grid */}
          <div className="mt-8 pt-8 border-t border-[#e7edfd]/10">
            <h2 className="text-sm font-bold text-[#e7edfd]/90 font-arabic mb-4">
              حالة رصد المحكمين الأربعة (المطلوب: 8 فرق لكل محكم)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-right">
              {judgeCompletionStats.map(({ judge, submittedCount, isCompleted }) => (
                <div
                  key={judge.id}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isCompleted
                      ? 'bg-[#1b2512]/60 border-[#c3f937]/40'
                      : 'bg-[#182030]/60 border-[#e7edfd]/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-tech font-bold text-sm ${
                        isCompleted ? 'bg-[#c3f937] text-[#0c1018]' : 'bg-[#0c1018] text-[#e7edfd]/60'
                      }`}
                    >
                      {judge.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#e7edfd] font-arabic">
                        {judge.name}
                      </h3>
                      <span className="text-[11px] text-[#e7edfd]/50 font-tech">
                        رصد {submittedCount} من أصل 8 فرق
                      </span>
                    </div>
                  </div>

                  <div>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#c3f937]/20 text-[#c3f937] border border-[#c3f937]/40 font-arabic">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>اكتمل الرصد</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40 font-arabic">
                        <Clock className="w-3.5 h-3.5" />
                        <span>جارٍ الرصد ({submittedCount}/8)</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/judging/dashboard')}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#c3f937] hover:bg-[#b5eb2f] text-[#0c1018] text-sm font-bold shadow-[0_0_20px_rgba(195,249,55,0.25)] transition-all cursor-pointer font-arabic"
            >
              <span>الانتقال إلى لوحة الفرق للتقييم</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Ceremony Presentation Mode Fullscreen
  if (ceremonyMode) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0c1018] text-[#e7edfd] flex flex-col justify-between p-6 sm:p-12 selection:bg-transparent overflow-hidden">
        {/* Ambient Ceremony Glows */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#34155f]/40 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#c3f937]/15 rounded-full blur-[140px] pointer-events-none" />

        {/* Ceremony Top Bar */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/assets/judging-platform/logo.png"
              alt="BUILDx"
              className="h-10 w-auto object-contain"
            />
            <span className="font-tech text-xs tracking-widest text-[#c3f937] uppercase">
              AWARDS CEREMONY
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-tech text-xs text-[#e7edfd]/60">
              STEP {ceremonyStep} / 8
            </span>
            <button
              onClick={() => setCeremonyMode(false)}
              className="px-3 py-1.5 rounded-xl bg-[#182030] text-xs font-semibold hover:bg-[#222d42] transition-colors cursor-pointer font-arabic"
            >
              خروج من العرض (Esc)
            </button>
          </div>
        </div>

        {/* Ceremony Stage Content */}
        <div className="relative z-10 max-w-5xl mx-auto w-full text-center py-8">
          {/* Step 0: Intro */}
          {ceremonyStep === 0 && (
            <div className="space-y-6 animate-fade-in">
              <div className="w-20 h-20 rounded-3xl bg-[#c3f937]/15 border border-[#c3f937]/30 flex items-center justify-center mx-auto text-[#c3f937] shadow-[0_0_50px_rgba(195,249,55,0.3)]">
                <Trophy className="w-10 h-10" />
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold font-arabic tracking-tight text-[#e7edfd]">
                حفل إعلان النتائج والتتويج
              </h1>
              <p className="text-base sm:text-xl text-[#e7edfd]/75 max-w-2xl mx-auto font-arabic leading-relaxed">
                بعد اكتمال رصد كافة المحكمين الأربعة لجميع الفرق المتنافسة، نعلن الآن الفائزين بجوائز الفئات والمراكز الثلاثة الأولى.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setCeremonyStep(1)}
                  className="px-8 py-4 rounded-2xl bg-[#c3f937] hover:bg-[#b5eb2f] text-[#0c1018] text-base font-bold shadow-[0_0_30px_rgba(195,249,55,0.4)] transition-all cursor-pointer font-arabic"
                >
                  بدء إعلان الفائزين
                </button>
              </div>
            </div>
          )}

          {/* Steps 1 to 4: Category Awards */}
          {ceremonyStep >= 1 && ceremonyStep <= 4 && (
            <div className="space-y-6 animate-fade-in">
              {(() => {
                const catIndex = ceremonyStep - 1;
                const winner = categoryWinners[catIndex];
                if (!winner) return null;

                return (
                  <div className="space-y-6">
                    <span className="font-tech text-xs px-3.5 py-1.5 rounded-full bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/40 font-bold uppercase tracking-wider">
                      SPECIAL CATEGORY AWARD • {catIndex + 1} / 4
                    </span>

                    <h1 className="text-3xl sm:text-5xl font-bold font-arabic text-[#e7edfd]">
                      {winner.category.title}
                    </h1>

                    {winner.winnerTeam ? (
                      <div className="bg-[#121826]/90 border-2 border-[#a855f7] rounded-3xl p-8 max-w-lg mx-auto shadow-2xl space-y-4">
                        <TeamMascot
                          src={winner.winnerTeam.mascotUrl}
                          teamCode={winner.winnerTeam.teamCode}
                          className="w-24 h-24 mx-auto"
                        />
                        <div>
                          <span className="font-tech text-xs px-2 py-0.5 rounded bg-[#182030] text-[#c3f937] font-bold">
                            كود {winner.winnerTeam.teamCode}
                          </span>
                          <h2 className="text-2xl font-bold font-tech text-[#e7edfd] mt-1">
                            الفريق {winner.winnerTeam.teamCode}
                          </h2>
                        </div>
                        <div className="pt-2 border-t border-[#e7edfd]/10 flex items-center justify-center gap-2 text-xs text-[#e7edfd]/70 font-arabic">
                          <span>حصل على {winner.votesReceived} أصوات من لجنة التحكيم</span>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#121826]/80 border border-[#e7edfd]/15 rounded-3xl p-8 max-w-md mx-auto">
                        <p className="text-sm text-[#e7edfd]/60 font-arabic">
                          لم يتم حسم تصويت هذه الجائزة أو حُجبت.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Step 5: 3rd Place */}
          {ceremonyStep === 5 && thirdPlace && (
            <div className="space-y-6 animate-fade-in">
              <span className="font-tech text-xs px-3.5 py-1.5 rounded-full bg-[#fb50c3]/20 text-[#fb50c3] border border-[#fb50c3]/40 font-bold tracking-wider">
                3RD PLACE • المركز الثالث
              </span>
              <div className="w-28 h-28 mx-auto">
                <TeamMascot
                  src={thirdPlace.team.mascotUrl}
                  teamCode={thirdPlace.team.teamCode}
                  className="w-full h-full"
                />
              </div>
              <div>
                <span className="font-tech text-xs px-2.5 py-0.5 rounded-md bg-[#182030] text-[#c3f937] font-bold">
                  كود {thirdPlace.team.teamCode}
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold font-tech text-[#e7edfd] mt-2">
                  الفريق {thirdPlace.team.teamCode}
                </h2>
              </div>
              <div className="score-value text-3xl sm:text-4xl font-bold text-[#fb50c3]">
                المعدل النهائي: {formatScore(thirdPlace.finalAverage)}
              </div>
            </div>
          )}

          {/* Step 6: 2nd Place */}
          {ceremonyStep === 6 && secondPlace && (
            <div className="space-y-6 animate-fade-in">
              <span className="font-tech text-xs px-3.5 py-1.5 rounded-full bg-[#a855f7]/20 text-[#a855f7] border border-[#a855f7]/40 font-bold tracking-wider">
                2ND PLACE • المركز الثاني
              </span>
              <div className="w-28 h-28 mx-auto">
                <TeamMascot
                  src={secondPlace.team.mascotUrl}
                  teamCode={secondPlace.team.teamCode}
                  className="w-full h-full"
                />
              </div>
              <div>
                <span className="font-tech text-xs px-2.5 py-0.5 rounded-md bg-[#182030] text-[#c3f937] font-bold">
                  كود {secondPlace.team.teamCode}
                </span>
                <h2 className="text-3xl sm:text-5xl font-bold font-tech text-[#e7edfd] mt-2">
                  الفريق {secondPlace.team.teamCode}
                </h2>
              </div>
              <div className="score-value text-3xl sm:text-4xl font-bold text-[#a855f7]">
                المعدل النهائي: {formatScore(secondPlace.finalAverage)}
              </div>
            </div>
          )}

          {/* Step 7: 1st Place Champion */}
          {ceremonyStep === 7 && firstPlace && (
            <div className="space-y-6 animate-fade-in">
              <Crown className="w-16 h-16 text-[#c3f937] mx-auto animate-bounce" />
              <span className="font-tech text-sm px-4 py-2 rounded-full bg-[#c3f937]/20 text-[#c3f937] border-2 border-[#c3f937] font-bold tracking-widest uppercase">
                CHAMPION • بطل الهاكاثون
              </span>
              <div className="w-36 h-36 mx-auto">
                <TeamMascot
                  src={firstPlace.team.mascotUrl}
                  teamCode={firstPlace.team.teamCode}
                  className="w-full h-full"
                />
              </div>
              <div>
                <span className="font-tech text-xs px-2.5 py-0.5 rounded-md bg-[#182030] text-[#c3f937] font-bold">
                  كود {firstPlace.team.teamCode}
                </span>
                <h2 className="text-4xl sm:text-6xl font-bold font-tech text-[#e7edfd] mt-2">
                  الفريق {firstPlace.team.teamCode}
                </h2>
              </div>
              <div className="score-value text-4xl sm:text-5xl font-display font-bold text-[#c3f937]">
                المعدل النهائي: {formatScore(firstPlace.finalAverage)}
              </div>
            </div>
          )}

          {/* Step 8: Full Stage Podium */}
          {ceremonyStep === 8 && (
            <div className="space-y-8 animate-fade-in w-full">
              <h2 className="text-2xl sm:text-4xl font-bold font-arabic text-[#e7edfd]">
                منصة التتويج الكبرى
              </h2>
              <div className="grid grid-cols-3 gap-3 sm:gap-6 items-end pt-8">
                {/* 2nd Place */}
                {secondPlace && (
                  <div className="flex flex-col items-center bg-[#121826]/90 border border-[#a855f7]/50 rounded-3xl p-4 sm:p-6 shadow-xl h-64 sm:h-72 justify-between">
                    <div className="text-center">
                      <span className="font-tech text-xs text-[#a855f7] font-bold">2ND PLACE</span>
                      <h4 className="text-base sm:text-lg font-bold text-[#e7edfd] font-tech mt-1">
                        الفريق {secondPlace.team.teamCode}
                      </h4>
                    </div>
                    <TeamMascot
                      src={secondPlace.team.mascotUrl}
                      teamCode={secondPlace.team.teamCode}
                      className="w-16 h-16 sm:w-20 sm:h-20"
                    />
                    <div className="score-value text-lg sm:text-xl font-bold text-[#a855f7]">
                      {formatScore(secondPlace.finalAverage)}
                    </div>
                  </div>
                )}

                {/* 1st Place Champion */}
                {firstPlace && (
                  <div className="flex flex-col items-center bg-[#151c2d] border-2 border-[#c3f937] rounded-3xl p-4 sm:p-6 shadow-[0_0_40px_rgba(195,249,55,0.25)] h-80 sm:h-96 justify-between -translate-y-4">
                    <div className="text-center">
                      <Crown className="w-6 h-6 text-[#c3f937] mx-auto mb-1" />
                      <span className="font-tech text-xs text-[#c3f937] font-bold">CHAMPION</span>
                      <h4 className="text-lg sm:text-xl font-bold text-[#e7edfd] font-tech mt-1">
                        الفريق {firstPlace.team.teamCode}
                      </h4>
                    </div>
                    <TeamMascot
                      src={firstPlace.team.mascotUrl}
                      teamCode={firstPlace.team.teamCode}
                      className="w-20 h-20 sm:w-28 sm:h-28"
                    />
                    <div className="score-value text-2xl sm:text-3xl font-bold text-[#c3f937]">
                      {formatScore(firstPlace.finalAverage)}
                    </div>
                  </div>
                )}

                {/* 3rd Place */}
                {thirdPlace && (
                  <div className="flex flex-col items-center bg-[#121826]/90 border border-[#fb50c3]/50 rounded-3xl p-4 sm:p-6 shadow-xl h-56 sm:h-64 justify-between">
                    <div className="text-center">
                      <span className="font-tech text-xs text-[#fb50c3] font-bold">3RD PLACE</span>
                      <h4 className="text-base sm:text-lg font-bold text-[#e7edfd] font-tech mt-1">
                        الفريق {thirdPlace.team.teamCode}
                      </h4>
                    </div>
                    <TeamMascot
                      src={thirdPlace.team.mascotUrl}
                      teamCode={thirdPlace.team.teamCode}
                      className="w-14 h-14 sm:w-16 sm:h-16"
                    />
                    <div className="score-value text-base sm:text-lg font-bold text-[#fb50c3]">
                      {formatScore(thirdPlace.finalAverage)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Ceremony Navigation Controls */}
        <div className="relative z-10 flex items-center justify-between border-t border-[#e7edfd]/10 pt-4">
          <button
            onClick={() => setCeremonyStep((prev) => Math.max(prev - 1, 0))}
            disabled={ceremonyStep === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#121826] border border-[#e7edfd]/15 text-xs font-semibold text-[#e7edfd]/80 disabled:opacity-40 cursor-pointer font-arabic"
          >
            <ChevronRight className="w-4 h-4" />
            <span>السابق</span>
          </button>

          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <button
                key={s}
                onClick={() => setCeremonyStep(s)}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  ceremonyStep === s ? 'bg-[#c3f937] scale-125' : 'bg-[#e7edfd]/20'
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => setCeremonyStep((prev) => Math.min(prev + 1, 8))}
            disabled={ceremonyStep === 8}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-[#c3f937] text-[#0c1018] text-xs font-bold disabled:opacity-40 cursor-pointer font-arabic"
          >
            <span>التالي</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Standard Results View (when all 4 judges have finished)
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#c3f937]/20 text-[#c3f937] border border-[#c3f937]/40 font-tech font-bold">
              FINAL OUTCOMES • اكتمل الرصد
            </span>
            <span className="text-xs text-[#e7edfd]/70 font-arabic">
              تم اعتماد تقييمات كافة المحكمين الأربعة
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#e7edfd] font-arabic">
            النتائج النهائية وحفل الختام
          </h1>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              setCeremonyStep(0);
              setCeremonyMode(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#c3f937] hover:bg-[#b5eb2f] text-[#0c1018] text-xs font-bold shadow-[0_0_20px_rgba(195,249,55,0.25)] transition-all cursor-pointer font-arabic"
          >
            <Maximize2 className="w-4 h-4" />
            <span>تشغيل وضع حفل الختام (Reveal)</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#e7edfd] font-arabic flex items-center gap-2">
          <Trophy className="w-5 h-5 text-[#c3f937]" />
          <span>المراكز الثلاثة الأولى (الترتيب العام)</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          {/* 2nd Place */}
          {secondPlace && (
            <div className="bg-[#121826]/90 border border-[#a855f7]/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-72">
              <div className="flex items-start justify-between">
                <span className="font-tech text-xs px-2.5 py-0.5 rounded-full bg-[#a855f7]/15 text-[#a855f7] border border-[#a855f7]/30 font-bold">
                  2ND PLACE • المركز الثاني
                </span>
                <Trophy className="w-5 h-5 text-[#a855f7]" />
              </div>

              <div className="flex items-center gap-4 my-2">
                <TeamMascot
                  src={secondPlace.team.mascotUrl}
                  teamCode={secondPlace.team.teamCode}
                  className="w-16 h-16"
                />
                <div>
                  <span className="font-tech text-xs px-2 py-0.5 rounded bg-[#182030] text-[#c3f937] font-bold">
                    كود {secondPlace.team.teamCode}
                  </span>
                  <h3 className="text-xl font-bold text-[#e7edfd] font-tech mt-1">
                    الفريق {secondPlace.team.teamCode}
                  </h3>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e7edfd]/10 flex items-center justify-between">
                <span className="text-xs text-[#e7edfd]/50 font-arabic">المعدل النهائي:</span>
                <span className="score-value text-2xl font-bold text-[#a855f7]">
                  {formatScore(secondPlace.finalAverage)}
                </span>
              </div>
            </div>
          )}

          {/* 1st Place Champion */}
          {firstPlace && (
            <div className="bg-[#151c2d] border-2 border-[#c3f937] rounded-3xl p-6 shadow-[0_0_35px_rgba(195,249,55,0.15)] flex flex-col justify-between h-80 -translate-y-2">
              <div className="flex items-start justify-between">
                <span className="font-tech text-xs px-3 py-1 rounded-full bg-[#c3f937]/20 text-[#c3f937] border border-[#c3f937]/40 font-bold">
                  CHAMPION • بطل الهاكاثون
                </span>
                <Crown className="w-6 h-6 text-[#c3f937]" />
              </div>

              <div className="flex items-center gap-4 my-2">
                <TeamMascot
                  src={firstPlace.team.mascotUrl}
                  teamCode={firstPlace.team.teamCode}
                  className="w-20 h-20"
                />
                <div>
                  <span className="font-tech text-xs px-2 py-0.5 rounded bg-[#182030] text-[#c3f937] font-bold">
                    كود {firstPlace.team.teamCode}
                  </span>
                  <h3 className="text-2xl font-bold text-[#e7edfd] font-tech mt-1">
                    الفريق {firstPlace.team.teamCode}
                  </h3>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e7edfd]/10 flex items-center justify-between">
                <span className="text-xs text-[#e7edfd]/60 font-arabic">المعدل النهائي:</span>
                <span className="score-value text-3xl font-display font-bold text-[#c3f937]">
                  {formatScore(firstPlace.finalAverage)}
                </span>
              </div>
            </div>
          )}

          {/* 3rd Place */}
          {thirdPlace && (
            <div className="bg-[#121826]/90 border border-[#fb50c3]/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between h-72">
              <div className="flex items-start justify-between">
                <span className="font-tech text-xs px-2.5 py-0.5 rounded-full bg-[#fb50c3]/15 text-[#fb50c3] border border-[#fb50c3]/30 font-bold">
                  3RD PLACE • المركز الثالث
                </span>
                <Medal className="w-5 h-5 text-[#fb50c3]" />
              </div>

              <div className="flex items-center gap-4 my-2">
                <TeamMascot
                  src={thirdPlace.team.mascotUrl}
                  teamCode={thirdPlace.team.teamCode}
                  className="w-16 h-16"
                />
                <div>
                  <span className="font-tech text-xs px-2 py-0.5 rounded bg-[#182030] text-[#c3f937] font-bold">
                    كود {thirdPlace.team.teamCode}
                  </span>
                  <h3 className="text-xl font-bold text-[#e7edfd] font-tech mt-1">
                    الفريق {thirdPlace.team.teamCode}
                  </h3>
                </div>
              </div>

              <div className="pt-3 border-t border-[#e7edfd]/10 flex items-center justify-between">
                <span className="text-xs text-[#e7edfd]/50 font-arabic">المعدل النهائي:</span>
                <span className="score-value text-2xl font-bold text-[#fb50c3]">
                  {formatScore(thirdPlace.finalAverage)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Category Winners */}
      <div className="space-y-4 pt-6 border-t border-[#e7edfd]/10">
        <h2 className="text-lg font-bold text-[#e7edfd] font-arabic flex items-center gap-2">
          <Award className="w-5 h-5 text-[#c3f937]" />
          <span>جوائز الفئات الأربع التخصصية</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categoryWinners.map((res) => (
            <div
              key={res.category.id}
              className="bg-[#121826]/80 border border-[#e7edfd]/10 rounded-2xl p-5 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-tech font-bold px-2 py-0.5 rounded bg-[#34155f] text-[#c3f937] uppercase">
                  SPECIAL AWARD
                </span>
                <h3 className="text-sm font-bold text-[#e7edfd] font-arabic mt-2">
                  {res.category.title}
                </h3>
              </div>

              <div className="my-4">
                {res.winnerTeam ? (
                  <div className="flex items-center gap-3">
                    <TeamMascot
                      src={res.winnerTeam.mascotUrl}
                      teamCode={res.winnerTeam.teamCode}
                      className="w-12 h-12"
                    />
                    <div>
                      <span className="font-tech text-xs px-1.5 py-0.5 rounded bg-[#182030] text-[#c3f937] font-bold">
                        كود {res.winnerTeam.teamCode}
                      </span>
                      <h4 className="text-base font-bold text-[#e7edfd] font-tech mt-1">
                        الفريق {res.winnerTeam.teamCode}
                      </h4>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-[#e7edfd]/40 font-arabic">لا يوجد فائز محدد</span>
                )}
              </div>

              <div className="pt-2 border-t border-[#e7edfd]/10 text-[11px] text-[#e7edfd]/60 font-arabic">
                {res.votesReceived} أصوات من لجنة التحكيم
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
