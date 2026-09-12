"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useInView as useCustomInView } from "@/hooks/useInView";
import Image from "next/image";

// ─── Phase config ──────────────────────────────────────────────────────────────
type PhaseConfig = {
  id: string;
  badgeClass: string;
  accentColor: string;
  dotClass: string;
  borderColor: string;
};

const PHASE_CONFIG: PhaseConfig[] = [
  {
    id: "reg",
    badgeClass: "journey-phase__badge--wine",
    accentColor: "#823419",
    dotClass: "journey-node__dot--wine",
    borderColor: "rgba(130, 52, 25, 0.55)",
  },
  {
    id: "camp",
    badgeClass: "journey-phase__badge--lime",
    accentColor: "#c3f937",
    dotClass: "journey-node__dot--lime",
    borderColor: "rgba(195, 249, 55, 0.4)",
  },
  {
    id: "hackathon",
    badgeClass: "journey-phase__badge--pink",
    accentColor: "#fb50c3",
    dotClass: "journey-node__dot--pink",
    borderColor: "rgba(251, 80, 195, 0.45)",
  },
  {
    id: "closing",
    badgeClass: "journey-phase__badge--gold",
    accentColor: "#c3f937",
    dotClass: "journey-node__dot--lime",
    borderColor: "rgba(195, 249, 55, 0.6)",
  },
];

// ─── Animated phase card ──────────────────────────────────────────────────────
function PhaseCard({
  cfg,
  children,
  index,
}: {
  cfg: PhaseConfig;
  children: React.ReactNode;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="vt-phase"
      style={
        {
          "--phase-border": cfg.borderColor,
          "--phase-accent": cfg.accentColor,
        } as React.CSSProperties
      }
    >
      {children}
    </motion.div>
  );
}

// ─── Animated event node ──────────────────────────────────────────────────────
function NodeCard({
  phaseId,
  idx,
  children,
}: {
  phaseId: string;
  idx: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className={`vt-node vt-node--${phaseId}`}
    >
      {children}
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function CampTimeline() {
  const { t, locale } = useLanguage();
  const { ref, hasBeenInView } = useCustomInView();
  const isRTL = locale === "ar";

  const { phases } = t.timeline;

  const phaseRanges: Record<string, string> = {
    reg: isRTL ? "18 ── 24 سبتمبر" : "18 ── 24 Sep",
    camp: isRTL ? "27 سبتمبر ── 1 أكتوبر" : "27 Sep ── 1 Oct",
    hackathon: isRTL ? "4 ── 5 أكتوبر" : "4 ── 5 Oct",
    closing: isRTL ? "6 أكتوبر" : "6 Oct",
  };

  return (
    <section id="journey" className="journey-section scroll-mt-24">
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[46rem] h-[24rem] bg-primary/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-16 right-1/4 w-[36rem] h-[22rem] bg-lime/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      <div className="absolute top-20 right-10 w-80 h-80 opacity-[0.03] pointer-events-none select-none">
        <Image src="/assets/characters/hollow-purple.png" alt="" width={320} height={320} className="object-contain" />
      </div>

      <div ref={ref} className="journey-container relative z-10 w-full">
        {/* Heading */}
        <div className="journey-heading flex flex-col items-center justify-center text-center px-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-lime/10 border border-lime/30 text-lime text-xs font-bold mb-3 font-arapix tracking-wider">
            <span className="w-1.5 h-1.5 bg-lime inline-block animate-pulse" />
            <span>{isRTL ? "خريطة المراحل" : "LEVEL MAP"}</span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="section-title text-center w-full"
            style={{ fontFamily: isRTL ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
          >
            {t.timeline.title}
          </motion.h2>

          <p
            className="text-base sm:text-lg lg:text-xl text-light/75 max-w-2xl mx-auto mt-3 leading-relaxed text-center"
            style={{ fontFamily: "var(--font-janna)", textAlign: "center" }}
          >
            {t.timeline.subtitle}
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={hasBeenInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mt-5"
          >
            <div className="location-badge">
              <Image src="/assets/icons/location-white.png" alt="" width={16} height={16} className="w-4 h-4 object-contain shrink-0" />
              <span className="font-arapix text-xs sm:text-sm tracking-wide font-medium whitespace-nowrap">
                {t.timeline.location}
              </span>
            </div>
          </motion.div>

          <div className="journey-heading-accent" />
        </div>

        {/* ── VERTICAL TIMELINE ── */}
        <div className="vt-root">
          {/* Animated spine */}
          <div className="vt-spine" aria-hidden="true">
            <div className="vt-spine__track" />
            <motion.div
              className="vt-spine__fill"
              initial={{ scaleY: 0 }}
              animate={hasBeenInView ? { scaleY: 1 } : {}}
              transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
            />
          </div>

          {PHASE_CONFIG.map((cfg, phaseIdx) => {
            type PhaseData = {
              num: string;
              name: string;
              badge?: string;
              events: Array<{ date: string; title: string; desc: string; dayNum?: string }>;
              breakEvent?: { date: string; title: string; desc: string };
            };
            const phase = phases[cfg.id as keyof typeof phases] as PhaseData;
            const isClosing = cfg.id === "closing";
            const isHackathon = cfg.id === "hackathon";
            const isCamp = cfg.id === "camp";

            return (
              <div key={cfg.id} className="vt-phase-wrap">
                {/* Spine marker */}
                <motion.div
                  className="vt-marker"
                  style={{ "--marker-color": cfg.accentColor } as React.CSSProperties}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={hasBeenInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{
                    duration: 0.4,
                    delay: 0.5 + phaseIdx * 0.2,
                    type: "spring",
                    stiffness: 400,
                    damping: 20,
                  }}
                >
                  <span className={`journey-phase__badge ${cfg.badgeClass}`}>{phase.num}</span>
                </motion.div>

                {/* Phase card */}
                <PhaseCard cfg={cfg} index={phaseIdx}>
                  <div className="vt-phase__header">
                    <div className="vt-phase__title-row">
                      <h3
                        className="vt-phase__name"
                        style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
                      >
                        {phase.name}
                      </h3>
                      {phase.badge && (
                        <div className="location-badge location-badge--compact">
                          <Image src="/assets/icons/location-white.png" alt="" width={14} height={14} className="w-3.5 h-3.5 object-contain shrink-0" />
                          <span className="font-arapix text-xs tracking-wider font-medium">{phase.badge}</span>
                        </div>
                      )}
                    </div>
                    <span className="vt-phase__range font-arapix" style={{ color: isClosing ? "#c3f937" : undefined }}>
                      {phaseRanges[cfg.id]}
                    </span>
                  </div>

                  {/* Events */}
                  <div className="vt-events">
                    {phase.events.map((evt, evtIdx) => (
                      <NodeCard key={`${cfg.id}-${evtIdx}`} phaseId={cfg.id} idx={evtIdx}>
                        <div className="journey-node__top">
                          <span className="journey-node__date" style={{ color: isClosing ? "#c3f937" : undefined }}>
                            {evt.date}
                          </span>
                          <div className="flex items-center gap-2">
                            {isClosing && (
                              <Image src="/assets/icons/trophy-light.png" alt="" width={20} height={20} className="w-5 h-5 object-contain" />
                            )}
                            <span className={`journey-node__dot ${cfg.dotClass}`} />
                          </div>
                        </div>
                        {evt.dayNum && (
                          <span className="journey-node__subtag font-arapix">{evt.dayNum}</span>
                        )}
                        <h4
                          className={`journey-node__title ${
                            isHackathon ? "text-pink" : isClosing ? "text-lime text-lg sm:text-xl font-black" : ""
                          }`}
                        >
                          {evt.title}
                        </h4>
                        <p className={`journey-node__desc ${isClosing ? "sm:text-base" : ""}`}>{evt.desc}</p>
                      </NodeCard>
                    ))}
                  </div>

                  {isCamp && phase.breakEvent && (
                    <div className="journey-break-node mt-4">
                      <div className="journey-break-node__inner">
                        <div className="flex items-center gap-3">
                          <span className="w-2.5 h-2.5 bg-light/80 rotate-45 shrink-0" />
                          <span className="font-bold text-light text-sm sm:text-base font-arapix">
                            {phase.breakEvent.date} — {phase.breakEvent.title}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-light/70 mt-1 sm:mt-0 font-janna">
                          {phase.breakEvent.desc}
                        </p>
                      </div>
                    </div>
                  )}
                </PhaseCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
