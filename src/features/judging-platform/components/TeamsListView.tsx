// =============================================================================
// BUILDx Judging Platform - Teams Directory
// =============================================================================

import React, { useState, useMemo } from 'react';
import { useJudging } from '../context/JudgingContext';
import { Team } from '../types';
import { TeamMascot } from './TeamMascot';
import { formatScore } from '../utils/formatters';
import {
  Users,
  Search,
  ExternalLink,
  ChevronLeft,
  Filter,
  FileEdit,
  CheckCircle2,
  Clock,
} from 'lucide-react';

interface TeamsListViewProps {
  onSelectTeam: (teamId: string) => void;
}

export const TeamsListView: React.FC<TeamsListViewProps> = ({ onSelectTeam }) => {
  const { teams, evaluations, currentJudge, leaderboard } = useJudging();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('all');

  // Tracks list
  const tracks = useMemo(() => {
    const set = new Set<string>();
    teams.forEach((t) => {
      if (t.challengeTrack) set.add(t.challengeTrack);
    });
    return Array.from(set);
  }, [teams]);

  // Filtered teams
  const filteredTeams = useMemo(() => {
    return teams.filter((t) => {
      const matchesSearch =
        t.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.teamCode.includes(searchTerm) ||
        (t.description && t.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesTrack = selectedTrack === 'all' || t.challengeTrack === selectedTrack;

      return matchesSearch && matchesTrack;
    });
  }, [teams, searchTerm, selectedTrack]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#c3f937]/15 text-[#c3f937] border border-[#c3f937]/30 font-tech font-bold">
            TEAMS REPOSITORY
          </span>
          <span className="text-xs text-[#e7edfd]/60 font-arabic">
            الأكواد 10 — 80
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#e7edfd] font-arabic">
          دليل الفرق والمشاريع
        </h1>
        <p className="text-xs sm:text-sm text-[#e7edfd]/70 mt-1 max-w-2xl font-arabic leading-relaxed">
          استعرض تفاصيل المشاريع المتنافسة، الروابط التجريبية، وملفات العرض التقديمي.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#121826]/90 border border-[#e7edfd]/15">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="البحث باسم الفريق، المشروع، أو الكود..."
            className="w-full bg-[#0c1018] border border-[#e7edfd]/15 rounded-xl pr-10 pl-4 py-2 text-xs text-[#e7edfd] placeholder-[#e7edfd]/30 focus:outline-none focus:border-[#c3f937] font-arabic"
          />
          <Search className="w-4 h-4 text-[#e7edfd]/40 absolute right-3.5 top-2.5" />
        </div>

        {/* Track Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedTrack('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedTrack === 'all'
                ? 'bg-[#c3f937] text-[#0c1018]'
                : 'bg-[#182030] text-[#e7edfd]/70 hover:text-[#e7edfd]'
            }`}
          >
            جميع المسارات
          </button>
          {tracks.map((track) => (
            <button
              key={track}
              onClick={() => setSelectedTrack(track)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedTrack === track
                  ? 'bg-[#c3f937] text-[#0c1018]'
                  : 'bg-[#182030] text-[#e7edfd]/70 hover:text-[#e7edfd]'
              }`}
            >
              {track}
            </button>
          ))}
        </div>
      </div>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredTeams.map((team) => {
          // Current judge evaluation for this team
          const ev = evaluations.find(
            (e) => e.judgeId === currentJudge?.id && e.teamId === team.id
          );
          const isSubmitted = ev?.status === 'submitted';
          const isDraft = ev?.status === 'draft';

          return (
            <div
              key={team.id}
              className="bg-[#121826]/80 hover:bg-[#151c2d] border border-[#e7edfd]/10 hover:border-[#c3f937]/30 rounded-3xl p-6 transition-all duration-300 flex flex-col justify-between gap-6 shadow-xl"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-[#0c1018] border border-[#e7edfd]/15 p-2 flex items-center justify-center shrink-0">
                      <TeamMascot
                        src={team.mascotUrl}
                        teamCode={team.teamCode}
                        className="w-12 h-12"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-tech text-xs px-2 py-0.5 rounded-md bg-[#182030] text-[#c3f937] border border-[#c3f937]/30 font-bold">
                          كود {team.teamCode}
                        </span>
                        <span className="font-tech text-xs text-[#e7edfd]/50">
                          #{team.presentationOrder}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-[#e7edfd] font-tech mt-1">
                        الفريق {team.teamCode}
                      </h3>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isSubmitted ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#c3f937]/15 text-[#c3f937] border border-[#c3f937]/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>تم تقييمك</span>
                      </span>
                    ) : isDraft ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-400/15 text-amber-300 border border-amber-400/30">
                        <Clock className="w-3.5 h-3.5" />
                        <span>مسودة</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-[#182030] text-[#e7edfd]/50 border border-[#e7edfd]/10">
                        <span>لم يُقيّم</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Track */}
                <div className="mb-3">
                  <span className="inline-block text-xs px-2.5 py-0.5 rounded-lg bg-[#34155f]/40 text-[#a855f7] border border-[#a855f7]/30 font-arabic">
                    {team.challengeTrack}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-[#e7edfd]/75 leading-relaxed font-arabic mb-4">
                  {team.description}
                </p>

                {/* Members list */}
                {team.members && team.members.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[11px] text-[#e7edfd]/50 font-arabic block mb-1">
                      أعضاء الفريق:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {team.members.map((m, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-[#0c1018] text-[#e7edfd]/70 text-[11px] font-arabic border border-[#e7edfd]/10"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* External links */}
                <div className="flex flex-wrap gap-2">
                  {team.presentationUrl && (
                    <a
                      href={team.presentationUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#0c1018] hover:bg-[#182030] text-[11px] text-[#e7edfd] border border-[#e7edfd]/10"
                    >
                      <span>العرض التقديمي</span>
                      <ExternalLink className="w-3 h-3 text-[#c3f937]" />
                    </a>
                  )}
                  {team.demoUrl && (
                    <a
                      href={team.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#0c1018] hover:bg-[#182030] text-[11px] text-[#e7edfd] border border-[#e7edfd]/10"
                    >
                      <span>الرابط التجريبي Demo</span>
                      <ExternalLink className="w-3 h-3 text-[#c3f937]" />
                    </a>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-[#e7edfd]/10 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-[#e7edfd]/50 font-arabic">تقييمك للفريق</span>
                  <span className="score-value text-base font-bold text-[#c3f937]">
                    {ev?.totalWeightedScore ? `${formatScore(ev.totalWeightedScore)} / 100` : '--'}
                  </span>
                </div>

                <button
                  onClick={() => onSelectTeam(team.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#c3f937] hover:bg-[#b5eb2f] text-[#0c1018] text-xs font-bold shadow-[0_0_15px_rgba(195,249,55,0.2)] transition-all cursor-pointer"
                >
                  <span>
                    {isSubmitted ? 'مراجعة وتعديل التقييم' : isDraft ? 'استكمال التقييم' : 'بدء التقييم'}
                  </span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
