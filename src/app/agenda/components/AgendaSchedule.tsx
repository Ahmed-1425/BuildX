"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import {
  Clock, Users, BookOpen, Flag, Mic2, Film, Play,
  MessageCircle, Heart, Coffee, Target, Award,
  Trophy, Star, Camera, Rocket, Sparkles, ArrowRight,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useRiyadhTime } from "../hooks/useRiyadhTime";
import {
  AGENDA_ITEMS, PHASES,
  getItemStatus, getItemProgress,
  formatTime12h, formatDuration,
  type AgendaItem, type AgendaItemType,
} from "../agenda-data";

/* ─── Icon map ───────────────────────────────────────────────────────── */
const ICON_MAP: Record<AgendaItemType, React.ComponentType<{ style?: React.CSSProperties }>> = {
  reception: Users, prayer: Clock, anthem: Flag, welcome: Mic2,
  quran: BookOpen, intro: Sparkles, speech: Mic2, "video-intro": Film,
  video: Play, "judges-intro": Users, panel: MessageCircle,
  "judges-thanks": Heart, "projects-intro": Rocket, projects: Rocket,
  "teams-thanks": Heart, break: Coffee, return: Target,
  "honor-team": Award, "honor-sponsors": Heart,
  "rank-3": Trophy, "rank-2": Trophy, "rank-1": Trophy,
  "category-awards": Star, closing: Sparkles, photo: Camera,
};

/* ─── Rank colors ────────────────────────────────────────────────────── */
const RANK_COLOR: Record<string, string> = {
  bronze: "#cd7f32",
  silver: "#c0c0c0",
  gold: "#ffd700",
};

/* ─── Featured item types ────────────────────────────────────────────── */
const FEATURED: Set<AgendaItemType> = new Set([
  "projects", "rank-1", "rank-2", "rank-3", "category-awards",
]);

/* ─── Single Agenda Row ──────────────────────────────────────────────── */
function AgendaRow({
  item,
  nowMs,
  phaseColor,
}: {
  item: AgendaItem;
  nowMs: number | null;
  phaseColor: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const confettiFired = useRef(false);
  const status = nowMs !== null ? getItemStatus(item, nowMs) : "upcoming";
  const progress = status === "current" && nowMs !== null
    ? getItemProgress(item, nowMs)
    : 0;
  const isFeatured = FEATURED.has(item.type);
  const rankColor = item.accent ? RANK_COLOR[item.accent] : null;
  const accentColor = rankColor ?? (status === "current" ? phaseColor : null);

  // Confetti for first place when current
  useEffect(() => {
    if (item.type === "rank-1" && status === "current" && inView && !confettiFired.current) {
      confettiFired.current = true;
      const t = setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ffd700", "#c3f937", "#fb50c3", "#e7edfd"],
          disableForReducedMotion: true,
        });
      }, 500);
      return () => clearTimeout(t);
    }
  }, [item.type, status, inView]);

  const Icon = ICON_MAP[item.type] ?? Sparkles;

  const rowBg =
    status === "current"
      ? `rgba(${phaseColor === "#c3f937" ? "195,249,55" : phaseColor === "#fb50c3" ? "251,80,195" : "52,21,95"},0.05)`
      : isFeatured
        ? "rgba(231,237,253,0.03)"
        : "rgba(231,237,253,0.02)";

  const borderColor =
    status === "current"
      ? `${accentColor}30`
      : rankColor
        ? `${rankColor}20`
        : "rgba(231,237,253,0.06)";

  return (
    <motion.div
      ref={ref}
      id={`item-${item.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      aria-current={status === "current" ? "step" : undefined}
      style={{
        width: "100%",
        boxSizing: "border-box",
        position: "relative",
        background: rowBg,
        border: `1px solid ${borderColor}`,
        opacity: status === "past" ? 0.55 : 1,
        transition: "opacity 0.3s",
      }}
    >
      {/* Left accent bar */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: "3px",
          background: accentColor ?? "transparent",
          transition: "background 0.3s",
        }}
      />

      {/* Top accent line for current */}
      {status === "current" && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background: `linear-gradient(to left,${accentColor},transparent)`,
          }}
        />
      )}

      {/* Row content */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: "16px",
          alignItems: "center",
          padding: isFeatured
            ? "clamp(16px,2vw,22px) clamp(16px,2.5vw,24px)"
            : "clamp(14px,1.8vw,18px) clamp(16px,2.5vw,24px)",
          boxSizing: "border-box",
          paddingRight: "calc(clamp(16px,2.5vw,24px) + 3px)", // account for accent bar
        }}
      >
        {/* Time column — fixed width */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            minWidth: "clamp(72px,8vw,96px)",
            flexShrink: 0,
            gap: "3px",
          }}
        >
          <time
            dateTime={`2026-10-06T${item.startTime}:00+03:00`}
            style={{
              fontFamily: "var(--font-janna,sans-serif)",
              fontSize: "clamp(13px,1vw,15px)",
              fontWeight: 700,
              color: accentColor ?? "rgba(231,237,253,0.75)",
              whiteSpace: "nowrap",
            }}
          >
            {formatTime12h(item.startTime)}
          </time>
          <span
            style={{
              fontFamily: "var(--font-janna,sans-serif)",
              fontSize: "11px",
              color: "rgba(231,237,253,0.25)",
              whiteSpace: "nowrap",
            }}
          >
            {formatDuration(item.durationMinutes)}
          </span>
        </div>

        {/* Main content */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: item.description ? "6px" : 0,
            }}
          >
            {/* Icon */}
            <Icon
              style={{
                width: isFeatured ? "22px" : "18px",
                height: isFeatured ? "22px" : "18px",
                color: accentColor ?? "rgba(231,237,253,0.35)",
                flexShrink: 0,
              }}
            />
            {/* Title */}
            <h4
              style={{
                fontFamily: "var(--font-janna,sans-serif)",
                fontSize: isFeatured
                  ? "clamp(1rem,1.4vw,1.2rem)"
                  : "clamp(0.9rem,1.1vw,1.05rem)",
                fontWeight: 700,
                color: status === "past"
                  ? "rgba(231,237,253,0.5)"
                  : rankColor ?? "#e7edfd",
                margin: 0,
                overflowWrap: "anywhere",
              }}
            >
              {item.title}
            </h4>
          </div>
          {item.description && (
            <p
              style={{
                fontFamily: "var(--font-janna,sans-serif)",
                fontSize: "clamp(12px,0.9vw,14px)",
                color: "rgba(231,237,253,0.45)",
                margin: 0,
                overflowWrap: "anywhere",
                lineHeight: 1.5,
                paddingRight: "28px", // align under title (icon width + gap)
              }}
            >
              {item.description}
            </p>
          )}
          {/* Progress bar inside row */}
          {status === "current" && (
            <div
              style={{
                marginTop: "10px",
                width: "100%",
                height: "3px",
                background: "rgba(231,237,253,0.06)",
                borderRadius: "2px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: accentColor ?? "#c3f937",
                  borderRadius: "2px",
                  transition: "width 1s linear",
                }}
              />
            </div>
          )}
        </div>

        {/* Status badge */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "6px",
            flexShrink: 0,
          }}
        >
          {status === "current" && (
            <span
              style={{
                padding: "3px 8px",
                background: `${accentColor}15`,
                border: `1px solid ${accentColor}30`,
                fontFamily: "var(--font-arapix,sans-serif)",
                fontSize: "10px",
                fontWeight: 700,
                color: accentColor ?? "#c3f937",
                whiteSpace: "nowrap",
              }}
            >
              الآن
            </span>
          )}
          {status === "past" && (
            <span
              style={{
                padding: "3px 8px",
                background: "rgba(231,237,253,0.03)",
                border: "1px solid rgba(231,237,253,0.07)",
                fontFamily: "var(--font-arapix,sans-serif)",
                fontSize: "10px",
                color: "rgba(231,237,253,0.2)",
                whiteSpace: "nowrap",
              }}
            >
              انتهت
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Phase Section ──────────────────────────────────────────────────── */
function PhaseSection({
  phase,
  nowMs,
}: {
  phase: typeof PHASES[number];
  nowMs: number | null;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.05 });
  const items = AGENDA_ITEMS.filter((i) => i.phase === phase.id);

  return (
    <motion.section
      ref={ref}
      id={`phase-${phase.id}`}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      aria-label={phase.title}
      style={{
        width: "100%",
        boxSizing: "border-box",
        scrollMarginTop: "72px", // account for sticky PhaseNav
      }}
    >
      {/* Phase header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          marginBottom: "16px",
          paddingBottom: "16px",
          borderBottom: `1px solid ${phase.accentColor}20`,
          boxSizing: "border-box",
        }}
      >
        {/* Character */}
        {phase.characterImage && (
          <Image
            src={phase.characterImage}
            alt=""
            width={64}
            height={64}
            aria-hidden
            style={{
              width: "clamp(48px,6vw,64px)",
              height: "clamp(48px,6vw,64px)",
              objectFit: "contain",
              imageRendering: "pixelated",
              flexShrink: 0,
              maxWidth: "100%",
            }}
            loading="lazy"
          />
        )}
        <div style={{ minWidth: 0 }}>
          {/* Phase number */}
          <span
            style={{
              display: "block",
              fontFamily: "var(--font-arapix,sans-serif)",
              fontSize: "11px",
              color: `${phase.accentColor}80`,
              letterSpacing: "0.08em",
              marginBottom: "4px",
            }}
          >
            المرحلة {String(phase.id).padStart(2, "0")}
          </span>
          {/* Phase title */}
          <h3
            style={{
              fontFamily: "var(--font-news-almstqbl,serif)",
              fontSize: "clamp(1.4rem,2.5vw,2rem)",
              color: phase.accentColor,
              margin: 0,
              overflowWrap: "anywhere",
            }}
          >
            {phase.title}
          </h3>
        </div>
      </div>

      {/* Agenda rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          width: "100%",
          boxSizing: "border-box",
        }}
        role="list"
      >
        {items.map((item) => (
          <div key={item.id} role="listitem" style={{ width: "100%", boxSizing: "border-box" }}>
            <AgendaRow item={item} nowMs={nowMs} phaseColor={phase.accentColor} />
          </div>
        ))}
      </div>
    </motion.section>
  );
}

/* ─── Main Schedule ──────────────────────────────────────────────────── */
export default function AgendaSchedule() {
  const now = useRiyadhTime();

  return (
    <div
      id="agenda-schedule"
      style={{
        width: "100%",
        boxSizing: "border-box",
        background: "#0a0d14",
        paddingTop: "clamp(40px,5vw,64px)",
        paddingBottom: "clamp(48px,6vw,80px)",
      }}
    >
      <div
        style={{
          maxWidth: "1360px",
          marginInline: "auto",
          paddingInline: "clamp(16px,4vw,48px)",
          boxSizing: "border-box",
        }}
      >
        {/* Section header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "clamp(32px,4vw,52px)",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-news-almstqbl,serif)",
              fontSize: "clamp(1.8rem,3.5vw,3rem)",
              color: "#e7edfd",
              margin: 0,
              marginBottom: "12px",
            }}
          >
            برنامج الحفل الختامي
          </h2>
          <p
            style={{
              fontFamily: "var(--font-janna,sans-serif)",
              fontSize: "clamp(0.9rem,1.1vw,1.05rem)",
              color: "rgba(231,237,253,0.4)",
              margin: 0,
            }}
          >
            26 فقرة — 5 ساعات و29 دقيقة
          </p>
          {/* Divider */}
          <div
            aria-hidden
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <div style={{ width: "48px", height: "1px", background: "linear-gradient(to right,transparent,rgba(195,249,55,0.3))" }} />
            <div style={{ width: "6px", height: "6px", background: "#c3f937" }} />
            <div style={{ width: "48px", height: "1px", background: "linear-gradient(to left,transparent,rgba(195,249,55,0.3))" }} />
          </div>
        </div>

        {/* Phases */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "clamp(40px,5vw,64px)",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {PHASES.map((phase) => (
            <PhaseSection key={phase.id} phase={phase} nowMs={now} />
          ))}
        </div>
      </div>
    </div>
  );
}
