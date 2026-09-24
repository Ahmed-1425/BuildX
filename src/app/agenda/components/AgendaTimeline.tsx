"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import {
  Clock, Users, BookOpen, Flag, Mic2, Film, Play,
  MessageCircle, Heart, Coffee, Target, Award,
  Trophy, Star, Camera, Rocket, Sparkles, MapPin, ChevronDown,
} from "lucide-react";
import confetti from "canvas-confetti";
import { useRiyadhTime } from "../hooks/useRiyadhTime";
import {
  AGENDA_ITEMS, PHASES, EVENT_INFO,
  getItemStatus, getItemProgress, getEventStatus, getEventProgress,
  formatTime12h, formatDuration,
  type AgendaItem, type AgendaItemType,
} from "../agenda-data";

// ─── Icon mapping ───────────────────────────────────────────────────────────
const ICON_MAP: Record<AgendaItemType, React.ComponentType<{ className?: string }>> = {
  reception: Users,
  prayer: Clock,
  anthem: Flag,
  welcome: Mic2,
  quran: BookOpen,
  intro: Sparkles,
  speech: Mic2,
  "video-intro": Film,
  video: Play,
  "judges-intro": Users,
  panel: MessageCircle,
  "judges-thanks": Heart,
  "projects-intro": Rocket,
  projects: Rocket,
  "teams-thanks": Heart,
  break: Coffee,
  return: Target,
  "honor-team": Award,
  "honor-sponsors": Heart,
  "rank-3": Trophy,
  "rank-2": Trophy,
  "rank-1": Trophy,
  "category-awards": Star,
  closing: Sparkles,
  photo: Camera,
};

// ─── Rank accent colors ─────────────────────────────────────────────────────
const RANK_STYLES: Record<string, { accent: string; glow: string }> = {
  bronze: { accent: "#cd7f32", glow: "rgba(205,127,50,0.12)" },
  silver: { accent: "#c0c0c0", glow: "rgba(192,192,192,0.12)" },
  gold: { accent: "#ffd700", glow: "rgba(255,215,0,0.15)" },
};

// ─── Phase config ────────────────────────────────────────────────────────────
const PHASE_COLORS: Record<number, string> = {
  1: "#823419", 2: "#c3f937", 3: "#fb50c3",
  4: "#34155f", 5: "#fb50c3", 6: "#c3f937",
};

// ─── Single Agenda Card ─────────────────────────────────────────────────────
function AgendaCard({
  item, status, progress, isFeatured,
}: {
  item: AgendaItem;
  status: "past" | "current" | "upcoming";
  progress: number;
  isFeatured: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  const confettiFired = useRef(false);

  const IconComponent = ICON_MAP[item.type] || Sparkles;
  const rankStyle = item.accent ? RANK_STYLES[item.accent] : null;
  const phaseColor = PHASE_COLORS[item.phase] || "#c3f937";
  const isFirstPlace = item.type === "rank-1";

  // Fire confetti once for first place when current
  useEffect(() => {
    if (isFirstPlace && status === "current" && inView && !confettiFired.current) {
      confettiFired.current = true;
      const timer = setTimeout(() => {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#ffd700", "#c3f937", "#fb50c3", "#e7edfd"],
          disableForReducedMotion: true,
        });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isFirstPlace, status, inView]);

  const accentColor = status === "current" ? phaseColor : rankStyle ? rankStyle.accent : undefined;
  const minHeight = isFeatured ? "min-h-[220px] lg:min-h-[260px]" : "min-h-[150px] lg:min-h-[180px]";

  return (
    <motion.article
      ref={ref}
      id={`agenda-item-${item.id}`}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`relative ${minHeight} flex flex-col ${status === "past" ? "opacity-50" : ""}`}
      aria-current={status === "current" ? "step" : undefined}
    >
      <div
        className={`relative flex-1 flex flex-col p-5 sm:p-6 lg:p-7 border overflow-hidden transition-all duration-500 ${
          status === "current"
            ? "bg-[#151a27] shadow-[0_0_30px_rgba(195,249,55,0.06)]"
            : rankStyle
              ? "bg-[#151a27]"
              : "bg-[#131720] hover:bg-[#151a27]"
        }`}
        style={{
          borderColor: status === "current" ? `${phaseColor}30` : rankStyle ? `${rankStyle.accent}20` : "rgba(231,237,253,0.06)",
          boxShadow: rankStyle ? `0 0 20px ${rankStyle.glow}` : undefined,
        }}
      >
        {/* Top accent line for current */}
        {status === "current" && (
          <div className="absolute top-0 right-0 left-0 h-[3px]" style={{ background: `linear-gradient(to left, ${phaseColor}, ${phaseColor}60, transparent)` }} />
        )}
        {/* Top accent for rank items */}
        {rankStyle && status !== "current" && (
          <div className="absolute top-0 right-0 left-0 h-[2px]" style={{ background: `linear-gradient(to left, ${rankStyle.accent}, ${rankStyle.accent}40, transparent)` }} />
        )}

        {/* Header: status + time */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            {/* Icon */}
            <div
              className="w-10 h-10 flex items-center justify-center shrink-0"
              style={{
                backgroundColor: status === "current" ? `${phaseColor}12` : rankStyle ? `${rankStyle.accent}10` : "rgba(231,237,253,0.03)",
                border: `1px solid ${status === "current" ? `${phaseColor}20` : rankStyle ? `${rankStyle.accent}15` : "rgba(231,237,253,0.06)"}`,
                color: accentColor || "rgba(231,237,253,0.4)",
              }}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            {/* Status badge */}
            {status === "current" && (
              <span className="px-2.5 py-1 text-[11px] font-bold border animate-pulse"
                style={{
                  fontFamily: "var(--font-arapix)",
                  color: phaseColor,
                  backgroundColor: `${phaseColor}10`,
                  borderColor: `${phaseColor}25`,
                }}
              >الآن</span>
            )}
            {status === "past" && (
              <span className="px-2.5 py-1 text-[11px] font-bold bg-light/3 border border-light/6 text-light/25"
                style={{ fontFamily: "var(--font-arapix)" }}
              >انتهت</span>
            )}
            {status === "upcoming" && (
              <span className="px-2.5 py-1 text-[11px] font-bold bg-light/2 border border-light/5 text-light/20"
                style={{ fontFamily: "var(--font-arapix)" }}
              >قادمة</span>
            )}
          </div>
          <time
            dateTime={`2026-10-06T${item.startTime}:00+03:00`}
            className="text-sm sm:text-base font-bold"
            style={{
              fontFamily: "var(--font-janna-bold)",
              color: accentColor || "rgba(231,237,253,0.45)",
              fontSize: "clamp(0.85rem, 1vw, 1.05rem)",
            }}
          >
            {formatTime12h(item.startTime)} – {formatTime12h(item.endTime)}
          </time>
        </div>

        {/* Title */}
        <h4
          className={`font-bold mb-2 leading-snug ${isFeatured ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"}`}
          style={{
            fontFamily: "var(--font-janna-bold)",
            color: status === "current" ? "#e7edfd" : rankStyle ? rankStyle.accent : "rgba(231,237,253,0.8)",
          }}
        >
          {item.title}
        </h4>

        {/* Description */}
        {item.description && (
          <p className="text-light/35 text-sm sm:text-base leading-relaxed mb-3" style={{ fontFamily: "var(--font-janna)" }}>
            {item.description}
          </p>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Bottom: duration + progress */}
        <div className="flex items-center justify-between mt-3">
          <span className="text-light/25 text-sm" style={{ fontFamily: "var(--font-janna)" }}>
            {formatDuration(item.durationMinutes)}
          </span>
          {item.type === "projects" && (
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-dark-secondary/15 border border-dark-secondary/20 text-light/30 text-[11px]" style={{ fontFamily: "var(--font-arapix)" }}>8 TEAMS</span>
              <span className="px-2 py-0.5 bg-dark-secondary/15 border border-dark-secondary/20 text-light/30 text-[11px]" style={{ fontFamily: "var(--font-arapix)" }}>70 MIN</span>
            </div>
          )}
        </div>

        {/* Progress bar for current item */}
        {status === "current" && (
          <div className="mt-3">
            <div className="w-full h-1.5 bg-dark rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%`, backgroundColor: phaseColor }}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </div>
        )}

        {/* Character for special items */}
        {item.characterImage && (
          <Image
            src={item.characterImage}
            alt=""
            width={48}
            height={48}
            className="absolute bottom-4 left-4 w-12 h-12 object-contain image-pixelated opacity-20 pointer-events-none hidden sm:block"
            loading="lazy"
          />
        )}
      </div>
    </motion.article>
  );
}

// ─── Phase Header ────────────────────────────────────────────────────────────
function PhaseHeader({ phase, index }: { phase: typeof PHASES[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-center gap-4 sm:gap-5 lg:gap-6 py-4"
    >
      {phase.characterImage && (
        <Image
          src={phase.characterImage}
          alt=""
          width={48}
          height={48}
          className="w-10 h-10 sm:w-12 sm:h-12 object-contain image-pixelated opacity-60 shrink-0"
          loading="lazy"
        />
      )}
      <div className="flex-1 min-w-0">
        <span className="text-[11px] tracking-wider uppercase block mb-1" style={{ fontFamily: "var(--font-arapix)", color: `${phase.accentColor}80` }}>
          PHASE {String(phase.id).padStart(2, "0")}
        </span>
        <h3
          className="font-bold leading-tight"
          style={{
            fontFamily: "var(--font-news-almstqbl)",
            fontSize: "clamp(1.4rem, 2.5vw, 2.2rem)",
            color: phase.accentColor,
          }}
        >
          {phase.title}
        </h3>
      </div>
      <div className="h-[2px] flex-1 max-w-[120px] hidden sm:block" style={{ background: `linear-gradient(to left, transparent, ${phase.accentColor}30)` }} />
    </motion.div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function AgendaSidebar({ nowMs }: { nowMs: number | null }) {
  const status = nowMs !== null ? getEventStatus(nowMs) : "before";
  const progress = nowMs !== null && status === "during" ? getEventProgress(nowMs) : 0;
  const currentItem = nowMs !== null ? AGENDA_ITEMS.find((i) => getItemStatus(i, nowMs) === "current") : null;
  const currentPhaseId = currentItem?.phase || 0;

  const scrollToCurrent = useCallback(() => {
    if (!currentItem) return;
    document.getElementById(`agenda-item-${currentItem.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentItem]);

  return (
    <aside className="hidden lg:block lg:col-span-3">
      <div className="sticky top-8 space-y-6">
        {/* Title */}
        <div>
          <h2 className="text-xl font-bold text-light mb-1" style={{ fontFamily: "var(--font-news-almstqbl)" }}>
            برنامج الحفل
          </h2>
          {status === "during" && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-light/30" style={{ fontFamily: "var(--font-janna)" }}>تقدم البرنامج</span>
                <span className="text-xs text-lime/60" dir="ltr" style={{ fontFamily: "var(--font-arapix)" }}>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-dark rounded-full overflow-hidden">
                <div className="h-full bg-lime rounded-full transition-all duration-1000" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Phase navigation */}
        <nav aria-label="مراحل البرنامج">
          <ul className="space-y-1">
            {PHASES.map((phase) => {
              const isCurrent = phase.id === currentPhaseId;
              const isPast = nowMs !== null && AGENDA_ITEMS.filter((i) => i.phase === phase.id).every((i) => getItemStatus(i, nowMs) === "past");

              return (
                <li key={phase.id}>
                  <button
                    type="button"
                    onClick={() => {
                      const firstItem = AGENDA_ITEMS.find((i) => i.phase === phase.id);
                      if (firstItem) {
                        document.getElementById(`agenda-item-${firstItem.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                    className={`w-full text-right flex items-center gap-2.5 px-3 py-2.5 text-sm transition-all duration-200 cursor-pointer min-h-[44px] ${
                      isCurrent ? "bg-[#151a27] border border-light/8" : isPast ? "opacity-40" : "hover:bg-[#151a27]/50"
                    }`}
                    style={{ fontFamily: "var(--font-janna-bold)" }}
                  >
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: isCurrent ? phase.accentColor : isPast ? "rgba(231,237,253,0.15)" : `${phase.accentColor}40` }}
                    />
                    <span className={isCurrent ? "text-light" : "text-light/50"}>
                      {phase.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Jump to current */}
        {currentItem && (
          <button
            type="button"
            onClick={scrollToCurrent}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-lime/8 border border-lime/20 text-lime text-sm font-bold hover:bg-lime/12 transition-colors min-h-[44px] cursor-pointer"
            style={{ fontFamily: "var(--font-janna-bold)" }}
          >
            <ChevronDown className="w-4 h-4" />
            انتقل إلى الفقرة الحالية
          </button>
        )}

        {/* Mini venue card */}
        <a
          href={EVENT_INFO.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block px-4 py-3 bg-[#131720] border border-light/5 hover:border-lime/15 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <Image
              src="/images/agenda/partners/t2-business-logo.png"
              alt="شعار T2 Business"
              width={28}
              height={28}
              className="w-7 h-7 object-contain shrink-0"
            />
            <div className="min-w-0">
              <p className="text-light/70 text-sm font-bold truncate group-hover:text-lime transition-colors" style={{ fontFamily: "var(--font-janna-bold)" }}>
                {EVENT_INFO.venue}
              </p>
              <p className="text-light/30 text-xs flex items-center gap-1" style={{ fontFamily: "var(--font-janna)" }}>
                <MapPin className="w-3 h-3 inline-block" />
                {EVENT_INFO.city}
              </p>
            </div>
          </div>
        </a>

        {/* End time */}
        <div className="text-light/20 text-xs flex items-center gap-2 px-1" style={{ fontFamily: "var(--font-janna)" }}>
          <Clock className="w-3.5 h-3.5" />
          <span>ينتهي الحفل: {EVENT_INFO.endTime}</span>
        </div>
      </div>
    </aside>
  );
}

// ─── Mobile Jump Button ──────────────────────────────────────────────────────
function MobileJumpButton({ nowMs }: { nowMs: number | null }) {
  const currentItem = nowMs !== null ? AGENDA_ITEMS.find((i) => getItemStatus(i, nowMs) === "current") : null;

  if (!currentItem) return null;

  return (
    <div className="lg:hidden sticky top-3 z-40 flex justify-center mb-4">
      <button
        type="button"
        onClick={() => {
          document.getElementById(`agenda-item-${currentItem.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        }}
        className="flex items-center gap-2 px-5 py-2.5 bg-lime text-dark text-sm font-bold border-2 border-lime shadow-[3px_3px_0px_0px_#34155f] hover:-translate-y-0.5 active:translate-y-0.5 transition-all cursor-pointer min-h-[44px] backdrop-blur-sm"
        style={{ fontFamily: "var(--font-janna-bold)" }}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dark opacity-40" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-dark" />
        </span>
        انتقل إلى الفقرة الحالية
      </button>
    </div>
  );
}

// ─── Main Timeline Component ─────────────────────────────────────────────────
export default function AgendaTimeline() {
  const now = useRiyadhTime();

  // Group items by phase
  const phases = PHASES.map((phase) => ({
    ...phase,
    items: AGENDA_ITEMS.filter((item) => item.phase === phase.id),
  }));

  // Determine featured items (projects, rank items, category awards)
  const featuredTypes: AgendaItemType[] = ["projects", "rank-1", "rank-2", "rank-3", "category-awards"];

  return (
    <section id="agenda-content" className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 pt-16 sm:pt-20 lg:pt-28 pb-12">
      {/* Section Header */}
      <div className="text-center mb-12 lg:mb-16">
        <h2
          className="text-light font-bold mb-4"
          style={{
            fontFamily: "var(--font-news-almstqbl)",
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
          }}
        >
          برنامج الحفل الختامي
        </h2>
        <p
          className="text-light/40 max-w-lg mx-auto"
          style={{
            fontFamily: "var(--font-janna)",
            fontSize: "clamp(0.95rem, 1.2vw, 1.2rem)",
          }}
        >
          26 فقرة على مدى 5 ساعات و29 دقيقة
        </p>
      </div>

      {/* Mobile Jump Button */}
      <MobileJumpButton nowMs={now} />

      {/* Main Grid: Sidebar + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14">
        {/* Sidebar */}
        <AgendaSidebar nowMs={now} />

        {/* Timeline Content */}
        <div className="lg:col-span-9 min-w-0" role="list" aria-label="أجندة الحفل الختامي">
          {phases.map((phase) => (
            <div key={phase.id} className="mb-16 lg:mb-24 last:mb-0">
              {/* Phase Header */}
              <PhaseHeader phase={phase} index={phase.id - 1} />

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6 mt-6">
                {phase.items.map((item) => {
                  const status = now !== null ? getItemStatus(item, now) : "upcoming";
                  const progress = status === "current" && now !== null ? getItemProgress(item, now) : 0;
                  const isFeatured = featuredTypes.includes(item.type);
                  const isFullWidth = isFeatured || item.type === "prayer" || item.type === "panel" || item.durationMinutes >= 20;

                  return (
                    <div
                      key={item.id}
                      role="listitem"
                      className={isFullWidth ? "sm:col-span-2" : ""}
                    >
                      <AgendaCard item={item} status={status} progress={progress} isFeatured={isFeatured} />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
