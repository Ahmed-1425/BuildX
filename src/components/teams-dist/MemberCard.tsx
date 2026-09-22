"use client";

import { TeamMember } from "@/data/teamsDistribution";

/* ── SVG Icons ───────────────────────────────────────────────── */

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function CodeBracketIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  );
}

/* ── Level Config ─────────────────────────────────────────────── */

const LEVEL_CONFIG = {
  foundation: {
    label: "مبتدئ",
    sublabel: "Foundation",
    color: "#c3f937",
    bg: "rgba(195,249,55,0.08)",
    border: "rgba(195,249,55,0.25)",
  },
  practitioner: {
    label: "ممارس",
    sublabel: "Practitioner",
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.25)",
  },
  advanced: {
    label: "متقدم",
    sublabel: "Advanced",
    color: "#fb50c3",
    bg: "rgba(251,80,195,0.08)",
    border: "rgba(251,80,195,0.25)",
  },
} as const;

const LINK_CONFIG = {
  linkedin: {
    icon: <LinkedInIcon />,
    color: "#0A66C2",
    hoverBg: "rgba(10,102,194,0.15)",
    hoverBorder: "rgba(10,102,194,0.5)",
  },
  portfolio: {
    icon: <BriefcaseIcon />,
    color: "#fb50c3",
    hoverBg: "rgba(251,80,195,0.12)",
    hoverBorder: "rgba(251,80,195,0.4)",
  },
  app: {
    icon: <CodeBracketIcon />,
    color: "#c3f937",
    hoverBg: "rgba(195,249,55,0.12)",
    hoverBorder: "rgba(195,249,55,0.4)",
  },
} as const;

/* ── Main Component ───────────────────────────────────────────── */

interface MemberCardProps {
  member: TeamMember;
  isHighlighted?: boolean;
}

export default function MemberCard({ member, isHighlighted = false }: MemberCardProps) {
  const level = LEVEL_CONFIG[member.level];
  const linkCfg = LINK_CONFIG[member.linkType];

  return (
    <div
      id={`member-${member.id}`}
      className="group relative flex flex-col rounded-2xl transition-all duration-500"
      style={{
        backgroundColor: isHighlighted ? "rgba(21,26,39,1)" : "var(--buildx-surface)",
        border: isHighlighted
          ? "1px solid rgba(195,249,55,0.6)"
          : "1px solid var(--buildx-border)",
        boxShadow: isHighlighted
          ? "0 0 40px rgba(195,249,55,0.2), inset 0 1px 0 rgba(195,249,55,0.1)"
          : "0 2px 20px rgba(0,0,0,0.2)",
        transform: isHighlighted ? "scale(1.02)" : "scale(1)",
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-[15%] right-[15%] h-[1px] rounded-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${level.color}40, transparent)`,
        }}
      />

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* ── Header: Name + Level ── */}
        <div className="mb-5">
          <h3
            className="text-[17px] sm:text-lg font-bold leading-snug mb-3"
            style={{ fontFamily: "var(--font-janna-bold)", color: "var(--buildx-text)" }}
          >
            {member.name}
          </h3>

          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px]"
            style={{
              fontFamily: "var(--font-arapix)",
              backgroundColor: level.bg,
              border: `1px solid ${level.border}`,
              color: level.color,
            }}
          >
            <span
              className="w-[5px] h-[5px] rounded-full"
              style={{ backgroundColor: level.color, boxShadow: `0 0 6px ${level.color}` }}
            />
            <span>{level.label}</span>
            <span style={{ color: `${level.color}80` }}>—</span>
            <span style={{ color: `${level.color}99` }}>{level.sublabel}</span>
          </div>
        </div>

        {/* ── Info rows ── */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-start gap-2.5">
            <span
              className="mt-1 w-[6px] h-[6px] rounded-[1px] shrink-0"
              style={{ backgroundColor: "var(--buildx-lime)", opacity: 0.6 }}
            />
            <div>
              <span className="text-[10px] uppercase tracking-wider block mb-0.5"
                style={{ fontFamily: "var(--font-arapix)", color: "rgba(231,237,253,0.35)" }}>
                التخصص
              </span>
              <span className="text-[13px] leading-snug"
                style={{ fontFamily: "var(--font-janna)", color: "rgba(231,237,253,0.85)" }}>
                {member.specialization}
              </span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <span
              className="mt-1 w-[6px] h-[6px] rounded-[1px] shrink-0"
              style={{ backgroundColor: "var(--buildx-pink)", opacity: 0.6 }}
            />
            <div>
              <span className="text-[10px] uppercase tracking-wider block mb-0.5"
                style={{ fontFamily: "var(--font-arapix)", color: "rgba(231,237,253,0.35)" }}>
                الجهة
              </span>
              <span className="text-[13px] leading-snug"
                style={{ fontFamily: "var(--font-janna)", color: "rgba(231,237,253,0.75)" }}>
                {member.organization}
              </span>
            </div>
          </div>
        </div>

        {/* ── Bio ── */}
        <p
          className="text-[12.5px] leading-[1.7] mb-5 flex-1"
          style={{ fontFamily: "var(--font-janna)", color: "rgba(231,237,253,0.55)" }}
        >
          {member.bio}
        </p>

        {/* ── Action Button ── */}
        <div
          className="pt-4 mt-auto"
          style={{ borderTop: "1px solid var(--buildx-border)" }}
        >
          <a
            href={member.link}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 active:scale-[0.98]"
            style={{
              fontFamily: "var(--font-janna)",
              backgroundColor: "rgba(231,237,253,0.04)",
              border: "1px solid var(--buildx-border)",
              color: "rgba(231,237,253,0.7)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = linkCfg.hoverBg;
              e.currentTarget.style.borderColor = linkCfg.hoverBorder;
              e.currentTarget.style.color = linkCfg.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(231,237,253,0.04)";
              e.currentTarget.style.borderColor = "var(--buildx-border)";
              e.currentTarget.style.color = "rgba(231,237,253,0.7)";
            }}
            aria-label={`${member.linkLabel} — ${member.name}`}
          >
            <span style={{ color: linkCfg.color }}>{linkCfg.icon}</span>
            <span>{member.linkLabel}</span>
            <ExternalIcon />
          </a>
        </div>
      </div>
    </div>
  );
}
