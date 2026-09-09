// =============================================================================
// BUILDx Judging Platform - Leaderboard View
// Gated until all 4 judges finish scoring + Team codes only
// =============================================================================

import React from 'react';
import { useJudging } from '../context/JudgingContext';
import { TeamMascot } from './TeamMascot';
import { formatScore } from '../utils/formatters';
import {
  Lock,
  Trophy,
  Medal,
  Crown,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Users,
  AlertTriangle,
} from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const {
    teams,
    leaderboard,
    settings,
    isAllJudgesCompleted,
    judgeCompletionStats,
    totalSubmittedEvaluations,
    totalRequiredEvaluations,
    navigate,
  } = useJudging();

  // Judge IDs for individual score breakdown columns
  const judgeHeaders = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'أحمد الرشيد' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'إقبال الدلامي' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'عبدالعزيز بن نشوان' },
    { id: '44444444-4444-4444-4444-444444444444', name: 'أضواء الغامدي' },
  ];

  // If not all 4 judges have finished, hide results and show completion progress!
  if (!isAllJudgesCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Main Locked Card */}
        <div className="bg-[#121826]/90 border-2 border-amber-500/40 rounded-3xl p-8 sm:p-10 shadow-2xl text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-5 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-[#e7edfd] font-arabic">
            النتائج النهائية محجوبة حالياً
          </h1>
          <p className="text-sm sm:text-base text-[#e7edfd]/75 mt-3 max-w-xl mx-auto font-arabic leading-relaxed">
            لا تظهر لوحة النتائج وترتيب الفرق إلا بعد انتهاء <strong className="text-[#c3f937]">المحكمين الأربعة كاملين</strong> من رصد واعتماد تقييمات جميع الفرق الـ 8.
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

  // Once ALL 4 judges have finished, display the full official rankings!
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#c3f937]/20 text-[#c3f937] border border-[#c3f937]/40 font-tech font-bold">
              OFFICIAL RANKINGS • اكتمل الرصد
            </span>
            <span className="text-xs text-[#e7edfd]/70 font-arabic">
              تم اعتماد تقييمات كافة المحكمين الأربعة (32 تقييمًا معتمدًا)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#e7edfd] font-arabic">
            لوحة النتائج الرسمية وترتيب الفرق
          </h1>
        </div>
      </div>

      {/* Official Rankings Table */}
      <div className="bg-[#121826]/80 border border-[#e7edfd]/15 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-[#e7edfd]/10 bg-[#0c1018]/60 text-xs font-semibold text-[#e7edfd]/60">
                <th className="py-4 px-5 text-center font-tech">الترتيب</th>
                <th className="py-4 px-5 font-arabic">الفريق</th>
                <th className="py-4 px-5 font-arabic">المسار</th>
                {judgeHeaders.map((j) => (
                  <th key={j.id} className="py-4 px-3 text-center font-arabic hidden lg:table-cell">
                    {j.name}
                  </th>
                ))}
                <th className="py-4 px-5 text-center font-tech">المعدل النهائي</th>
                <th className="py-4 px-5 text-center font-tech">الفارق</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7edfd]/5 text-sm">
              {leaderboard.map((entry) => {
                const isTop1 = entry.rank === 1;
                const isTop2 = entry.rank === 2;
                const isTop3 = entry.rank === 3;

                return (
                  <tr
                    key={entry.team.id}
                    className={`hover:bg-[#151c2d] transition-colors ${
                      isTop1 ? 'bg-[#c3f937]/5' : isTop2 ? 'bg-[#a855f7]/5' : isTop3 ? 'bg-[#fb50c3]/5' : ''
                    }`}
                  >
                    {/* Rank Badge */}
                    <td className="py-4 px-5 text-center">
                      <div className="flex items-center justify-center">
                        {isTop1 ? (
                          <div className="w-8 h-8 rounded-full bg-[#c3f937]/20 border border-[#c3f937]/50 flex items-center justify-center text-[#c3f937]">
                            <Crown className="w-4 h-4" />
                          </div>
                        ) : isTop2 ? (
                          <div className="w-8 h-8 rounded-full bg-[#a855f7]/20 border border-[#a855f7]/50 flex items-center justify-center text-[#a855f7]">
                            <Trophy className="w-4 h-4" />
                          </div>
                        ) : isTop3 ? (
                          <div className="w-8 h-8 rounded-full bg-[#fb50c3]/20 border border-[#fb50c3]/50 flex items-center justify-center text-[#fb50c3]">
                            <Medal className="w-4 h-4" />
                          </div>
                        ) : (
                          <span className="font-tech text-sm font-bold text-[#e7edfd]/50">
                            {entry.rank}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Team Code Only (No Project Name) */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-[#0c1018] border border-[#e7edfd]/10 p-1 flex items-center justify-center shrink-0">
                          <TeamMascot
                            src={entry.team.mascotUrl}
                            teamCode={entry.team.teamCode}
                            className="w-9 h-9"
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-tech text-xs px-2 py-0.5 rounded-md bg-[#182030] text-[#c3f937] border border-[#c3f937]/20 font-bold">
                              كود {entry.team.teamCode}
                            </span>
                            <span className="font-bold text-base text-[#e7edfd] font-tech">
                              الفريق {entry.team.teamCode}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Track */}
                    <td className="py-4 px-5">
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-[#34155f]/40 text-[#a855f7] border border-[#a855f7]/30 font-arabic">
                        {entry.team.challengeTrack}
                      </span>
                    </td>

                    {/* Judge Individual Scores */}
                    {judgeHeaders.map((jh) => {
                      const jScore = entry.judgeScores[jh.id];
                      return (
                        <td key={jh.id} className="py-4 px-3 text-center hidden lg:table-cell">
                          {jScore?.isSubmitted ? (
                            <span className="font-tech text-sm font-semibold text-[#e7edfd]">
                              {formatScore(jScore.totalScore)}
                            </span>
                          ) : (
                            <span className="font-tech text-xs text-[#e7edfd]/30">-</span>
                          )}
                        </td>
                      );
                    })}

                    {/* Final Average */}
                    <td className="py-4 px-5 text-center">
                      <span
                        className={`score-value text-lg font-bold ${
                          isTop1
                            ? 'text-[#c3f937]'
                            : isTop2
                            ? 'text-[#a855f7]'
                            : isTop3
                            ? 'text-[#fb50c3]'
                            : 'text-[#e7edfd]'
                        }`}
                      >
                        {formatScore(entry.finalAverage)}
                      </span>
                    </td>

                    {/* Gap to Leader */}
                    <td className="py-4 px-5 text-center">
                      {entry.gapToLeader === 0 ? (
                        <span className="text-xs font-tech font-bold text-[#c3f937]">المتصدر</span>
                      ) : (
                        <span className="text-xs font-tech text-[#e7edfd]/50">
                          -{formatScore(entry.gapToLeader)}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
