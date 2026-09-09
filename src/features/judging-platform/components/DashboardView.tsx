// =============================================================================
// BUILDx Judging Platform - Judge Personal Dashboard
// =============================================================================

import React, { useMemo } from 'react';
import { useJudging } from '../context/JudgingContext';
import { TeamCard } from './TeamCard';
import { formatScore, formatPercent } from '../utils/formatters';
import {
  CheckCircle2,
  FileEdit,
  Clock,
  Award,
  AlertTriangle,
  ArrowLeft,
  Users,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

interface DashboardViewProps {
  onSelectTeam: (teamId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectTeam }) => {
  const {
    currentJudge,
    teams,
    evaluations,
    awardCategories,
    awardVotes,
    settings,
    leaderboard,
    navigate,
  } = useJudging();

  // Judge's specific evaluations
  const judgeEvaluations = useMemo(() => {
    if (!currentJudge) return [];
    return evaluations.filter((e) => e.judgeId === currentJudge.id);
  }, [evaluations, currentJudge]);

  const judgeEvalMap = useMemo(() => {
    const map = new Map();
    judgeEvaluations.forEach((e) => map.set(e.teamId, e));
    return map;
  }, [judgeEvaluations]);

  // Evaluated teams metrics
  const submittedCount = useMemo(() => {
    return judgeEvaluations.filter((e) => e.status === 'submitted').length;
  }, [judgeEvaluations]);

  const draftCount = useMemo(() => {
    return judgeEvaluations.filter((e) => e.status === 'draft').length;
  }, [judgeEvaluations]);

  const totalTeams = teams.length || 8;
  const missingCount = Math.max(0, totalTeams - submittedCount);
  const completionPercentage = Math.round((submittedCount / totalTeams) * 100);

  // Category votes metrics
  const judgeVotes = useMemo(() => {
    if (!currentJudge) return [];
    return awardVotes.filter((v) => v.judgeId === currentJudge.id);
  }, [awardVotes, currentJudge]);

  const topThreeIds = useMemo(() => {
    return new Set(leaderboard.slice(0, 3).map((e) => e.team.id));
  }, [leaderboard]);

  // Identify any invalid votes where the voted team entered top 3
  const invalidVotes = useMemo(() => {
    return judgeVotes.filter((v) => topThreeIds.has(v.teamId));
  }, [judgeVotes, topThreeIds]);

  const votesCount = judgeVotes.length;
  const totalCategories = awardCategories.length || 4;

  // Next team to evaluate (first not submitted)
  const nextTeam = useMemo(() => {
    return teams.find((t) => {
      const ev = judgeEvalMap.get(t.id);
      return !ev || ev.status !== 'submitted';
    });
  }, [teams, judgeEvalMap]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-[#121826]/90 border border-[#e7edfd]/15 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#c3f937]/15 text-[#c3f937] border border-[#c3f937]/30 font-tech font-bold">
                BUILDx JUDGING CONSOLE
              </span>
              <span className="text-xs text-[#e7edfd]/60 font-arabic">
                {settings.isJudgingOpen ? 'فترة التحكيم جارية' : 'التحكيم مقفل'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#e7edfd] font-arabic">
              مرحبًا بك، {currentJudge?.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#e7edfd]/70 mt-1 max-w-2xl font-arabic leading-relaxed">
              قم بتقييم الفرق الثمانية وفق المعايير الـ 11 المعتمدة، وصوّت لجوائز الفئات. تحفظ مسوداتك تلقائيًا أثناء العمل.
            </p>
          </div>

          {/* Quick Action to Next Team */}
          {nextTeam && (
            <button
              onClick={() => onSelectTeam(nextTeam.id)}
              className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-[#c3f937] hover:bg-[#b5eb2f] text-[#0c1018] text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(195,249,55,0.2)] transition-all shrink-0 cursor-pointer"
            >
              <span>الفريق التالي للتقييم: الفريق {nextTeam.teamCode}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Critical Revote Alert Banner (if a voted team is in top 3) */}
        {invalidVotes.length > 0 && (
          <div className="mt-6 p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-300">يحتاج تصويتك إلى تحديث</p>
                <p className="text-amber-200/90 mt-0.5 font-arabic">
                  الفريق الذي اخترته في إحدى جوائز الفئات أصبح ضمن المراكز الثلاثة الأولى في الترتيب العام، ولذلك لم يعد مؤهلًا لجائزة الفئة. يرجى مراجعة صفحة جوائز الفئات واختيار فريق بديل.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/judging/awards')}
              className="px-4 py-2 rounded-xl bg-amber-500 text-[#0c1018] font-bold text-xs shrink-0 cursor-pointer hover:bg-amber-400 transition-colors"
            >
              تحديث التصويت الآن
            </button>
          </div>
        )}
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Completed Teams */}
        <div className="bg-[#121826]/80 border border-[#e7edfd]/10 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#e7edfd]/60 font-arabic mb-2">
            <span>الفرق المكتملة</span>
            <CheckCircle2 className="w-4 h-4 text-[#c3f937]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1 font-tech">
              <span className="text-2xl font-bold text-[#c3f937]">{submittedCount}</span>
              <span className="text-xs text-[#e7edfd]/40">/ {totalTeams}</span>
            </div>
            <span className="text-[10px] text-[#e7edfd]/50 font-arabic mt-1 block">تقييم نهائي معتمد</span>
          </div>
        </div>

        {/* Drafts */}
        <div className="bg-[#121826]/80 border border-[#e7edfd]/10 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#e7edfd]/60 font-arabic mb-2">
            <span>المسودات</span>
            <FileEdit className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="flex items-baseline gap-1 font-tech">
              <span className="text-2xl font-bold text-amber-300">{draftCount}</span>
              <span className="text-xs text-[#e7edfd]/40">مسودة</span>
            </div>
            <span className="text-[10px] text-[#e7edfd]/50 font-arabic mt-1 block">قيد الاستكمال</span>
          </div>
        </div>

        {/* Missing */}
        <div className="bg-[#121826]/80 border border-[#e7edfd]/10 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#e7edfd]/60 font-arabic mb-2">
            <span>المتبقي</span>
            <Clock className="w-4 h-4 text-[#fb50c3]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1 font-tech">
              <span className="text-2xl font-bold text-[#fb50c3]">{missingCount}</span>
              <span className="text-xs text-[#e7edfd]/40">فرق</span>
            </div>
            <span className="text-[10px] text-[#e7edfd]/50 font-arabic mt-1 block">بانتظار التقييم</span>
          </div>
        </div>

        {/* Award Votes */}
        <div className="bg-[#121826]/80 border border-[#e7edfd]/10 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#e7edfd]/60 font-arabic mb-2">
            <span>تصويت الجوائز</span>
            <Award className="w-4 h-4 text-[#a855f7]" />
          </div>
          <div>
            <div className="flex items-baseline gap-1 font-tech">
              <span className="text-2xl font-bold text-[#a855f7]">{votesCount}</span>
              <span className="text-xs text-[#e7edfd]/40">/ {totalCategories}</span>
            </div>
            <span className="text-[10px] text-[#e7edfd]/50 font-arabic mt-1 block">فئات مكتملة</span>
          </div>
        </div>

        {/* Invalid Votes */}
        <div className="bg-[#121826]/80 border border-[#e7edfd]/10 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#e7edfd]/60 font-arabic mb-2">
            <span>تحديث التصويت</span>
            <AlertTriangle className={`w-4 h-4 ${invalidVotes.length > 0 ? 'text-amber-400 animate-pulse' : 'text-[#e7edfd]/40'}`} />
          </div>
          <div>
            <div className="flex items-baseline gap-1 font-tech">
              <span className={`text-2xl font-bold ${invalidVotes.length > 0 ? 'text-amber-300' : 'text-[#e7edfd]'}`}>
                {invalidVotes.length}
              </span>
              <span className="text-xs text-[#e7edfd]/40">يتطلب تعديلاً</span>
            </div>
            <span className="text-[10px] text-[#e7edfd]/50 font-arabic mt-1 block">لصعوده للمراكز الأولى</span>
          </div>
        </div>

        {/* Completion Progress */}
        <div className="bg-[#121826]/80 border border-[#e7edfd]/10 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#e7edfd]/60 font-arabic mb-2">
            <span>نسبة الإنجاز</span>
            <TrendingUp className="w-4 h-4 text-[#c3f937]" />
          </div>
          <div>
            <div className="font-tech text-2xl font-bold text-[#c3f937]">
              {completionPercentage}%
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#0c1018] mt-2 overflow-hidden">
              <div
                className="h-full bg-[#c3f937] transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Teams Grid (8 Teams: 10 to 80) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#e7edfd] font-arabic flex items-center gap-2">
            <Users className="w-5 h-5 text-[#c3f937]" />
            <span>الفرق المشاركة (الأكواد 10 — 80)</span>
          </h2>
          <span className="text-xs text-[#e7edfd]/60 font-tech">8 TEAMS TOTAL</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {teams.map((team) => {
            const ev = judgeEvalMap.get(team.id);
            return (
              <TeamCard
                key={team.id}
                team={team}
                evaluation={ev}
                onEvaluate={onSelectTeam}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
