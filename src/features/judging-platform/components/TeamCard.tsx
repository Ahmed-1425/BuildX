// =============================================================================
// BUILDx Team Card Component
// =============================================================================

import React from 'react';
import { Team, Evaluation, EvaluationScore } from '../types';
import { TeamMascot } from './TeamMascot';
import { formatScore } from '../utils/formatters';
import { ChevronLeft, CheckCircle2, Clock, FileEdit, AlertCircle } from 'lucide-react';

interface TeamCardProps {
  team: Team;
  evaluation?: Evaluation;
  onEvaluate: (teamId: string) => void;
}

export const TeamCard: React.FC<TeamCardProps> = ({ team, evaluation, onEvaluate }) => {
  const isSubmitted = evaluation?.status === 'submitted';
  const isDraft = evaluation?.status === 'draft';
  const isNeedsRevision = evaluation?.status === 'needs_revision';
  const notStarted = !evaluation || !evaluation.status;

  const score = isSubmitted || isDraft ? evaluation.totalWeightedScore : null;

  // Calculate completion percentage of criteria for this team (0 to 11)
  const scoredCount = evaluation?.scores
    ? (Object.values(evaluation.scores) as EvaluationScore[]).filter(
        (s) => typeof s.rawScore === 'number'
      ).length
    : 0;
  const progressPercent = Math.round((scoredCount / 11) * 100);

  return (
    <div
      className="group relative bg-[#121826]/80 hover:bg-[#151c2d] border border-[#e7edfd]/10 hover:border-[#c3f937]/40 rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between shadow-lg hover:shadow-[0_0_25px_rgba(195,249,55,0.08)]"
      style={{
        borderRightWidth: '4px',
        borderRightColor: team.accentColor || '#c3f937',
      }}
    >
      {/* Top Header: Code, Mascot & Status Badge */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-xl bg-[#0c1018] border border-[#e7edfd]/10 p-1.5 flex items-center justify-center shrink-0">
              <TeamMascot src={team.mascotUrl} teamCode={team.teamCode} className="w-12 h-12" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-tech text-xs px-2 py-0.5 rounded-md bg-[#182030] text-[#c3f937] border border-[#c3f937]/20 font-bold">
                  كود {team.teamCode}
                </span>
                <span className="text-[11px] text-[#e7edfd]/60 font-tech">#{team.presentationOrder}</span>
              </div>
              <h3 className="text-xl font-bold text-[#e7edfd] group-hover:text-[#c3f937] transition-colors mt-1 font-tech">
                الفريق {team.teamCode}
              </h3>
            </div>
          </div>

          {/* Status Badge */}
          <div>
            {isSubmitted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#c3f937]/15 text-[#c3f937] border border-[#c3f937]/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>مكتمل ({formatScore(score || 0)})</span>
              </span>
            )}
            {isDraft && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                <FileEdit className="w-3.5 h-3.5" />
                <span>مسودة ({scoredCount}/11)</span>
              </span>
            )}
            {isNeedsRevision && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#fb50c3]/15 text-[#fb50c3] border border-[#fb50c3]/30">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>يحتاج تحديثًا</span>
              </span>
            )}
            {notStarted && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#182030] text-[#e7edfd]/50 border border-[#e7edfd]/10">
                <Clock className="w-3.5 h-3.5" />
                <span>لم يبدأ</span>
              </span>
            )}
          </div>
        </div>

        {/* Track description */}
        <div className="mb-4">
          <span className="inline-block text-[11px] px-2.5 py-0.5 rounded-lg bg-[#34155f]/40 text-[#a855f7] border border-[#a855f7]/30 font-arabic mb-1">
            {team.challengeTrack}
          </span>
          <p className="text-xs text-[#e7edfd]/60 font-tech">
            معرف الفريق: {team.teamCode}
          </p>
        </div>
      </div>

      {/* Footer: Score / Progress & Action Button */}
      <div className="pt-4 border-t border-[#e7edfd]/10 flex items-center justify-between gap-3">
        {/* Score display */}
        <div className="flex flex-col">
          <span className="text-[10px] text-[#e7edfd]/50 font-arabic">درجتك للفريق</span>
          {score !== null ? (
            <div className="flex items-baseline gap-1">
              <span className="score-value text-xl font-bold text-[#c3f937] leading-none">
                {formatScore(score)}
              </span>
              <span className="text-[10px] text-[#e7edfd]/40 font-tech">/ 100</span>
            </div>
          ) : (
            <span className="text-xs text-[#e7edfd]/40 font-arabic">لم يُقيّم بعد</span>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onEvaluate(team.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isSubmitted
              ? 'bg-[#182030] hover:bg-[#1f2a40] text-[#e7edfd] border border-[#e7edfd]/20'
              : isDraft
              ? 'bg-[#c3f937]/15 hover:bg-[#c3f937]/25 text-[#c3f937] border border-[#c3f937]/40 shadow-[0_0_12px_rgba(195,249,55,0.1)]'
              : 'bg-[#c3f937] hover:bg-[#b5eb2f] text-[#0c1018] shadow-[0_0_15px_rgba(195,249,55,0.2)]'
          }`}
        >
          <span>
            {isSubmitted ? 'مراجعة التقييم' : isDraft ? 'استكمال التقييم' : 'بدء التقييم'}
          </span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
