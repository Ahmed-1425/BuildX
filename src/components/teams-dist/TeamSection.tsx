"use client";

import { motion } from "framer-motion";
import { Team } from "@/data/teamsDistribution";
import MemberCard from "./MemberCard";

interface TeamSectionProps {
  team: Team;
  highlightedMemberId?: string | null;
  index: number;
}

/* Team accent colors mapped to team numbers */
const TEAM_ACCENTS: Record<number, string> = {
  10: "#c3f937",
  20: "#fb50c3",
  30: "#38bdf8",
  40: "#f59e0b",
  50: "#a855f7",
  60: "#10b981",
  70: "#f97316",
  80: "#ec4899",
};

export default function TeamSection({ team, highlightedMemberId, index }: TeamSectionProps) {
  const accent = TEAM_ACCENTS[team.number] || "#c3f937";

  return (
    <section
      id={team.id}
      className="scroll-mt-16 relative py-16 sm:py-20"
    >
      {/* Subtle ambient glow behind the section */}
      <div
        className="absolute top-1/3 right-[-15%] w-[500px] h-[500px] rounded-full pointer-events-none opacity-[0.07]"
        style={{ background: `radial-gradient(circle, ${accent} 0%, transparent 70%)` }}
      />

      {/* ─── Section Header ─── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, delay: 0.05 }}
        className="mb-10 sm:mb-12"
      >
        {/* Top decoration line */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[2px] rounded-full" style={{ backgroundColor: accent }} />
          <span
            className="text-[11px] uppercase tracking-[0.2em]"
            style={{ fontFamily: "var(--font-arapix)", color: `${accent}99` }}
          >
            Team {team.number}
          </span>
          <div className="flex-1 h-[1px]" style={{ backgroundColor: "var(--buildx-border)" }} />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h2
              className="text-3xl sm:text-4xl font-black tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-news-almstqbl)", color: "var(--buildx-text)" }}
            >
              <span className="relative">
                فريق{" "}
                <span style={{ color: accent }}>{team.number}</span>
              </span>
            </h2>
            <p
              className="text-sm sm:text-base mt-2 max-w-md"
              style={{ fontFamily: "var(--font-janna)", color: "var(--buildx-muted)" }}
            >
              {team.tagline}
            </p>
          </div>

          {/* Member count indicator (subtle, not administrative) */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg self-start sm:self-auto"
            style={{
              backgroundColor: `${accent}10`,
              border: `1px solid ${accent}20`,
            }}
          >
            {team.members.map((_, i) => (
              <span
                key={i}
                className="w-[6px] h-[6px] rounded-full"
                style={{ backgroundColor: accent, opacity: 0.4 + i * 0.2 }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* ─── Members Grid ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
        {team.members.map((member, memberIdx) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay: memberIdx * 0.08 }}
          >
            <MemberCard
              member={member}
              isHighlighted={highlightedMemberId === member.id}
            />
          </motion.div>
        ))}
      </div>

      {/* Bottom separator */}
      <div className="mt-16 sm:mt-20 flex items-center justify-center gap-3">
        <div className="w-1.5 h-1.5 rounded-sm" style={{ backgroundColor: accent, opacity: 0.3 }} />
        <div className="w-16 h-[1px]"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}40, transparent)` }} />
        <div className="w-1 h-1 rounded-full" style={{ backgroundColor: "var(--buildx-pink)", opacity: 0.3 }} />
      </div>
    </section>
  );
}
