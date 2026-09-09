// =============================================================================
// BUILDx Judging Platform - Category Awards Voting
// =============================================================================

import React, { useState, useMemo } from 'react';
import { useJudging } from '../context/JudgingContext';
import { TeamMascot } from './TeamMascot';
import { formatScore } from '../utils/formatters';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  Vote,
  Users,
  Sparkles,
} from 'lucide-react';

export const AwardsView: React.FC = () => {
  const {
    currentJudge,
    teams,
    awardCategories,
    awardVotes,
    settings,
    leaderboard,
    categoryWinners,
    castAwardVote,
  } = useJudging();

  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    awardCategories[0]?.id || ''
  );
  const [isSubmittingVote, setIsSubmittingVote] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeCategory = useMemo(() => {
    return awardCategories.find((c) => c.id === activeCategoryId) || awardCategories[0];
  }, [awardCategories, activeCategoryId]);

  // Current Top 3 Teams (Critical Ineligibility Rule)
  const topThreeIds = useMemo(() => {
    return new Set(leaderboard.slice(0, 3).map((e) => e.team.id));
  }, [leaderboard]);

  // Judge's current vote for this active category
  const currentVote = useMemo(() => {
    if (!currentJudge || !activeCategory) return null;
    return awardVotes.find(
      (v) => v.judgeId === currentJudge.id && v.awardCategoryId === activeCategory.id
    );
  }, [awardVotes, currentJudge, activeCategory]);

  // Check if current vote is invalid (voted team entered top 3)
  const isCurrentVoteInvalid = useMemo(() => {
    if (!currentVote) return false;
    return topThreeIds.has(currentVote.teamId);
  }, [currentVote, topThreeIds]);

  // Winner calculation for active category
  const categoryResult = useMemo(() => {
    if (!activeCategory) return null;
    return categoryWinners.find((w) => w.category.id === activeCategory.id);
  }, [categoryWinners, activeCategory]);

  // Handle voting
  const handleVote = async (teamId: string) => {
    if (!activeCategory || !currentJudge) return;
    if (topThreeIds.has(teamId)) {
      setErrorMessage('هذا الفريق ضمن المراكز الثلاثة الأولى ولا يمكن التصويت له في جوائز الفئات.');
      return;
    }

    setIsSubmittingVote(true);
    setErrorMessage(null);

    const res = await castAwardVote(activeCategory.id, teamId);
    setIsSubmittingVote(false);

    if (!res.success) {
      setErrorMessage(res.error || 'تعذر تسجيل التصويت.');
    }
  };

  // Helper for vote counter text (English numerals with Arabic pluralization)
  const getVoteText = (count: number) => {
    if (count === 1) return `1 صوت`;
    if (count === 2) return `2 صوتين`;
    if (count >= 3 && count <= 10) return `${count} أصوات`;
    return `${count} صوت`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#34155f]/50 text-[#a855f7] border border-[#a855f7]/30 font-tech font-bold">
            CATEGORY AWARDS ENGINE
          </span>
          <span className="text-xs text-[#e7edfd]/60 font-arabic">
            صوت واحد لكل محكم في كل فئة
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#e7edfd] font-arabic">
          جوائز الفئات الأربع
        </h1>
        <p className="text-xs sm:text-sm text-[#e7edfd]/70 mt-1 max-w-3xl font-arabic leading-relaxed">
          تُمنح هذه الجوائز للفرق المتميزة في جوانب تخصصية محددة. لا يحق للفرق الحاصلة على المراكز الثلاثة الأولى في الترتيب العام الفوز بأي من جوائز الفئات لضمان عدالة التكريم.
        </p>
      </div>

      {/* Real-time Needs Revote Alert (if active category vote is invalid) */}
      {isCurrentVoteInvalid && (
        <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/50 text-amber-200 text-sm space-y-2">
          <div className="flex items-center gap-2 font-bold text-amber-300">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>يحتاج تصويتك إلى تحديث</span>
          </div>
          <p className="text-xs leading-relaxed font-arabic">
            الفريق الذي اخترته أصبح ضمن المراكز الثلاثة الأولى، ولذلك لم يعد مؤهلًا لجائزة الفئة. اختر فريقًا آخر لإكمال التصويت.
          </p>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 4 Category Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        {awardCategories.map((cat, idx) => {
          const isActive = activeCategoryId === cat.id;
          const vote = awardVotes.find((v) => v.judgeId === currentJudge?.id && v.awardCategoryId === cat.id);
          const isInvalid = vote && topThreeIds.has(vote.teamId);

          return (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategoryId(cat.id);
                setErrorMessage(null);
              }}
              className={`p-4 rounded-2xl border text-right transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                isActive
                  ? 'bg-[#c3f937]/15 border-[#c3f937] text-[#c3f937] shadow-[0_0_20px_rgba(195,249,55,0.12)]'
                  : 'bg-[#121826]/80 border-[#e7edfd]/10 text-[#e7edfd]/75 hover:bg-[#121826]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-tech text-xs px-2 py-0.5 rounded-md bg-[#0c1018] text-[#c3f937]">
                  AWARD 0{idx + 1}
                </span>
                {vote ? (
                  isInvalid ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" title="يتطلب إعادة تصويت" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-[#c3f937]" />
                  )
                ) : (
                  <span className="w-2 h-2 rounded-full bg-[#e7edfd]/20" />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold font-arabic line-clamp-1">{cat.title}</h3>
                <span className="text-[11px] text-[#e7edfd]/60 font-arabic line-clamp-1 mt-0.5">
                  معيار: {cat.relatedCriterionName}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Category Details Banner */}
      {activeCategory && (
        <div className="bg-[#121826]/90 border border-[#e7edfd]/15 rounded-3xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#e7edfd]/10">
            <div>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-[#34155f]/40 text-[#a855f7] border border-[#a855f7]/30 font-arabic">
                المعيار المرتبط: {activeCategory.relatedCriterionName}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#e7edfd] font-arabic mt-2">
                {activeCategory.title}
              </h2>
            </div>

            {/* Current Judge Selection Pill */}
            {currentVote && (
              <div
                className={`px-4 py-2 rounded-xl text-xs font-semibold border ${
                  isCurrentVoteInvalid
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                    : 'bg-[#c3f937]/15 text-[#c3f937] border-[#c3f937]/40'
                }`}
              >
                {isCurrentVoteInvalid ? (
                  <span>تصويتك الحالي يتطلب تغييرًا (الفريق صعد للمراكز الأولى)</span>
                ) : (
                  <span>تم تصويتك لهذه الجائزة بنجاح</span>
                )}
              </div>
            )}
          </div>

          <p className="text-xs sm:text-sm text-[#e7edfd]/80 leading-relaxed font-arabic">
            {activeCategory.description}
          </p>
        </div>
      )}

      {/* Eligible Teams Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#e7edfd] font-arabic flex items-center gap-2">
            <Users className="w-4 h-4 text-[#c3f937]" />
            <span>اختر الفريق المرشح للجائزة</span>
          </h3>
          <span className="text-xs text-[#e7edfd]/60 font-arabic">
            الفرق المستبعدة: المركز الأول، الثاني، والثالث في الترتيب العام
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {teams.map((team) => {
            const isTopThree = topThreeIds.has(team.id);
            const isSelected = currentVote?.teamId === team.id;

            // Count votes for this team in this category
            const teamVotesCount = awardVotes.filter(
              (v) => v.awardCategoryId === activeCategory?.id && v.teamId === team.id && !topThreeIds.has(team.id)
            ).length;

            // Get team's score in the related criterion
            const leaderboardItem = leaderboard.find((l) => l.team.id === team.id);
            const relatedScore = leaderboardItem?.criterionAverages[activeCategory?.relatedCriterionId || ''] || 0;

            return (
              <div
                key={team.id}
                className={`relative rounded-2xl p-5 border flex flex-col justify-between transition-all duration-200 ${
                  isTopThree
                    ? 'bg-[#0c1018]/60 border-red-900/30 opacity-60'
                    : isSelected
                    ? 'bg-[#151c2d] border-[#c3f937] shadow-[0_0_20px_rgba(195,249,55,0.12)]'
                    : 'bg-[#121826]/80 border-[#e7edfd]/10 hover:border-[#e7edfd]/25'
                }`}
              >
                {/* Top Info */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="w-14 h-14 rounded-xl bg-[#0c1018] border border-[#e7edfd]/10 p-1 flex items-center justify-center shrink-0">
                      <TeamMascot src={team.mascotUrl} teamCode={team.teamCode} className="w-10 h-10" />
                    </div>

                    <div className="text-left">
                      <span className="font-tech text-xs px-2 py-0.5 rounded-md bg-[#182030] text-[#c3f937] border border-[#c3f937]/20 block">
                        CODE {team.teamCode}
                      </span>
                      {isTopThree && (
                        <span className="text-[10px] text-red-400 font-arabic mt-1 block">
                          ضمن المراكز الـ 3 الأولى
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-[#e7edfd] font-arabic line-clamp-1">
                    {team.projectName}
                  </h4>
                  <p className="text-xs text-[#e7edfd]/60 font-arabic mb-3">{team.teamName}</p>

                  {/* Related Criterion Average */}
                  <div className="p-2.5 rounded-xl bg-[#0c1018] border border-[#e7edfd]/10 mb-4 text-xs flex items-center justify-between">
                    <span className="text-[11px] text-[#e7edfd]/60 font-arabic">معدل المعيار المرتبط:</span>
                    <span className="score-value font-bold text-[#c3f937]">
                      {formatScore(relatedScore)} / 10
                    </span>
                  </div>
                </div>

                {/* Vote Button & Vote Counter */}
                <div className="pt-3 border-t border-[#e7edfd]/10 flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="font-tech font-bold text-[#e7edfd]">
                      {getVoteText(teamVotesCount)}
                    </span>
                  </div>

                  {isTopThree ? (
                    <span className="text-[11px] text-red-400/80 font-arabic">غير مؤهل</span>
                  ) : (
                    <button
                      type="button"
                      disabled={isSubmittingVote || isSelected || (!settings.isJudgingOpen && currentJudge?.role !== 'admin')}
                      onClick={() => handleVote(team.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#c3f937] text-[#0c1018] cursor-default'
                          : 'bg-[#182030] hover:bg-[#c3f937] text-[#e7edfd] hover:text-[#0c1018] border border-[#e7edfd]/15'
                      }`}
                    >
                      {isSelected ? 'اختيارك الحالي' : 'صوّت للفريق'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Authorized Judges Breakdown Section */}
      {categoryResult && categoryResult.judgeVotesBreakdown.length > 0 && (
        <div className="bg-[#121826]/70 border border-[#e7edfd]/10 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-bold text-[#e7edfd] font-arabic flex items-center gap-2">
            <Vote className="w-4 h-4 text-[#c3f937]" />
            <span>سجل تصويت لجنة التحكيم في هذه الفئة (محدث لحظيًا):</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {categoryResult.judgeVotesBreakdown.map((j) => (
              <div
                key={j.judgeId}
                className="p-3 rounded-xl bg-[#0c1018] border border-[#e7edfd]/10 flex items-center justify-between text-xs"
              >
                <span className="text-[#e7edfd]/80 font-arabic">{j.judgeName}:</span>
                <span
                  className={`font-tech font-bold ${
                    j.status === 'needs_revote' ? 'text-amber-400' : 'text-[#c3f937]'
                  }`}
                >
                  {j.teamCode !== '--' ? `الفريق ${j.teamCode}` : 'لم يصوت'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
