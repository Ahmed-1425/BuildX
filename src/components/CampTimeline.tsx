"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";
import Image from "next/image";

export default function CampTimeline() {
  const { t, locale } = useLanguage();
  const { ref, hasBeenInView } = useInView();
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const isRTL = locale === "ar";

  const { phases } = t.timeline;

  const tabs = [
    {
      id: "reg" as const,
      num: phases.reg.num,
      name: phases.reg.name,
      badgeClass: "journey-phase__badge--wine",
      accentColor: "#c3f937",
      accentGlow: "rgba(195, 249, 55, 0.6)",
    },
    {
      id: "camp" as const,
      num: phases.camp.num,
      name: phases.camp.name,
      badgeClass: "journey-phase__badge--lime",
      accentColor: "#c3f937",
      accentGlow: "rgba(195, 249, 55, 0.6)",
    },
    {
      id: "hackathon" as const,
      num: phases.hackathon.num,
      name: phases.hackathon.name,
      badgeClass: "journey-phase__badge--pink",
      accentColor: "#fb50c3",
      accentGlow: "rgba(251, 80, 195, 0.6)",
    },
    {
      id: "closing" as const,
      num: phases.closing.num,
      name: phases.closing.name,
      badgeClass: "journey-phase__badge--gold",
      accentColor: "#c3f937",
      accentGlow: "rgba(195, 249, 55, 0.6)",
    },
  ];

  type PhaseKey = (typeof tabs)[number]["id"];
  const [activeTab, setActiveTab] = useState<PhaseKey>("reg");

  return (
    <section id="journey" className="journey-section scroll-mt-24">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 w-[46rem] h-[24rem] bg-primary/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-16 right-1/4 w-[36rem] h-[22rem] bg-lime/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      {/* Ghost Watermark */}
      <div className="absolute top-20 right-10 w-80 h-80 opacity-[0.03] pointer-events-none select-none">
        <Image
          src="/assets/characters/hollow-purple.png"
          alt=""
          width={320}
          height={320}
          className="object-contain"
        />
      </div>

      <div ref={ref} className="journey-container relative z-10 w-full">
        {/* ======================================================== */}
        {/* Section Heading & Centered Location Badge                */}
        {/* ======================================================== */}
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

          {/* Prominent Location Badge centered under heading */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={hasBeenInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.45, delay: 0.2 }}
            className="mt-5"
          >
            <div className="location-badge">
              <Image
                src="/assets/icons/location-white.png"
                alt=""
                width={16}
                height={16}
                className="w-4 h-4 object-contain shrink-0"
              />
              <span className="font-arapix text-xs sm:text-sm tracking-wide font-medium whitespace-nowrap">
                {t.timeline.location}
              </span>
            </div>
          </motion.div>

          {/* Decorative accent line */}
          <div className="journey-heading-accent" />
        </div>

        {/* ======================================================== */}
        {/* Horizontal Tabs Bar                                      */}
        {/* ======================================================== */}
        <div className="journey-tabs-wrapper">
          <div
            className="journey-tabs-nav"
            role="tablist"
            aria-label={isRTL ? "مراحل رحلة BUILDx" : "BUILDx Journey Phases"}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  id={`journey-tab-${tab.id}`}
                  aria-selected={isActive}
                  aria-controls={`journey-panel-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`journey-tab-btn ${isActive ? "is-active" : ""}`}
                >
                  <span className={`journey-phase__badge ${tab.badgeClass} journey-tab-btn__badge`}>
                    {tab.num}
                  </span>
                  <span
                    className="journey-tab-btn__name"
                    style={{
                      fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)",
                    }}
                  >
                    {tab.name}
                  </span>

                  {isActive && (
                    <motion.span
                      layoutId="journeyTabActiveIndicator"
                      className="journey-tab-indicator"
                      style={{
                        backgroundColor: tab.accentColor,
                        boxShadow: `0 0 12px ${tab.accentGlow}`,
                      }}
                      transition={{ type: "spring", stiffness: 450, damping: 32 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* Active Phase Content Panel                               */}
        {/* ======================================================== */}
        <div className="journey-tab-panel-wrap">
          <AnimatePresence mode="wait">
            {activeTab === "reg" && (
              <motion.div
                key="reg"
                id="journey-panel-reg"
                role="tabpanel"
                aria-labelledby="journey-tab-reg"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="journey-phase journey-phase--reg"
              >
                <div className="journey-phase__header">
                  <div className="journey-phase__title-wrap">
                    <span className="journey-phase__badge journey-phase__badge--wine">
                      {phases.reg.num}
                    </span>
                    <h3 className="journey-phase__name">{phases.reg.name}</h3>
                  </div>
                  <span className="journey-phase__range font-arapix">
                    17 ── 23 {isRTL ? "سبتمبر" : "Sep"}
                  </span>
                </div>

                <div
                  className="journey-events"
                  style={{ "--event-count": 4 } as React.CSSProperties}
                >
                  {phases.reg.events.map((evt, idx) => (
                    <div
                      key={`reg-${idx}`}
                      onMouseEnter={() => setHoveredEvent(`reg-${idx}`)}
                      onMouseLeave={() => setHoveredEvent(null)}
                      className={`journey-node group ${
                        hoveredEvent === `reg-${idx}` ? "is-hovered" : ""
                      }`}
                    >
                      <div className="journey-node__top">
                        <span className="journey-node__date">{evt.date}</span>
                        <span className="journey-node__dot journey-node__dot--wine" />
                      </div>
                      <h4 className="journey-node__title">{evt.title}</h4>
                      <p className="journey-node__desc">{evt.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "camp" && (
              <motion.div
                key="camp"
                id="journey-panel-camp"
                role="tabpanel"
                aria-labelledby="journey-tab-camp"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="journey-phase journey-phase--camp"
              >
                <div className="journey-phase__header">
                  <div className="journey-phase__title-wrap">
                    <span className="journey-phase__badge journey-phase__badge--lime">
                      {phases.camp.num}
                    </span>
                    <h3 className="journey-phase__name">{phases.camp.name}</h3>
                    <div className="location-badge location-badge--compact">
                      <Image
                        src="/assets/icons/location-white.png"
                        alt=""
                        width={14}
                        height={14}
                        className="w-3.5 h-3.5 object-contain shrink-0"
                      />
                      <span className="font-arapix text-xs tracking-wider font-medium">
                        {phases.camp.badge}
                      </span>
                    </div>
                  </div>
                  <span className="journey-phase__range font-arapix">
                    27 {isRTL ? "سبتمبر" : "Sep"} ── 1 {isRTL ? "أكتوبر" : "Oct"}
                  </span>
                </div>

                <div
                  className="journey-events"
                  style={{ "--event-count": 5 } as React.CSSProperties}
                >
                  {phases.camp.events.map((evt, idx) => (
                    <div
                      key={`camp-${idx}`}
                      onMouseEnter={() => setHoveredEvent(`camp-${idx}`)}
                      onMouseLeave={() => setHoveredEvent(null)}
                      className={`journey-node group ${
                        hoveredEvent === `camp-${idx}` ? "is-hovered" : ""
                      }`}
                    >
                      <div className="journey-node__top">
                        <span className="journey-node__date">{evt.date}</span>
                        <span className="journey-node__dot journey-node__dot--lime" />
                      </div>
                      <span className="journey-node__subtag font-arapix">{evt.dayNum}</span>
                      <h4 className="journey-node__title">{evt.title}</h4>
                      <p className="journey-node__desc">{evt.desc}</p>
                    </div>
                  ))}
                </div>

                <div className="journey-break-node mt-4">
                  <div className="journey-break-node__inner">
                    <div className="flex items-center gap-3">
                      <span className="w-2.5 h-2.5 bg-light/80 rotate-45 shrink-0" />
                      <span className="font-bold text-light text-sm sm:text-base font-arapix">
                        {phases.camp.breakEvent.date} — {phases.camp.breakEvent.title}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-light/70 mt-1 sm:mt-0 font-janna">
                      {phases.camp.breakEvent.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "hackathon" && (
              <motion.div
                key="hackathon"
                id="journey-panel-hackathon"
                role="tabpanel"
                aria-labelledby="journey-tab-hackathon"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="journey-phase journey-phase--hackathon"
              >
                <div className="journey-phase__header">
                  <div className="journey-phase__title-wrap">
                    <span className="journey-phase__badge journey-phase__badge--pink">
                      {phases.hackathon.num}
                    </span>
                    <h3 className="journey-phase__name">{phases.hackathon.name}</h3>
                  </div>
                  <span className="journey-phase__range font-arapix">
                    4 ── 5 {isRTL ? "أكتوبر" : "Oct"}
                  </span>
                </div>

                <div
                  className="journey-events"
                  style={{ "--event-count": 2 } as React.CSSProperties}
                >
                  {phases.hackathon.events.map((evt, idx) => (
                    <div
                      key={`hack-${idx}`}
                      onMouseEnter={() => setHoveredEvent(`hack-${idx}`)}
                      onMouseLeave={() => setHoveredEvent(null)}
                      className={`journey-node journey-node--featured group ${
                        hoveredEvent === `hack-${idx}` ? "is-hovered" : ""
                      }`}
                    >
                      <div className="journey-node__top">
                        <span className="journey-node__date">{evt.date}</span>
                        <span className="journey-node__dot journey-node__dot--pink" />
                      </div>
                      <span className="journey-node__subtag font-arapix">{evt.dayNum}</span>
                      <h4 className="journey-node__title text-pink">{evt.title}</h4>
                      <p className="journey-node__desc">{evt.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "closing" && (
              <motion.div
                key="closing"
                id="journey-panel-closing"
                role="tabpanel"
                aria-labelledby="journey-tab-closing"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="journey-phase journey-phase--closing"
              >
                <div className="journey-phase__header">
                  <div className="journey-phase__title-wrap">
                    <span className="journey-phase__badge journey-phase__badge--gold">
                      {phases.closing.num}
                    </span>
                    <h3 className="journey-phase__name">{phases.closing.name}</h3>
                  </div>
                  <span className="journey-phase__range font-arapix text-lime">
                    6 {isRTL ? "أكتوبر" : "Oct"}
                  </span>
                </div>

                <div
                  className="journey-events"
                  style={{ "--event-count": 1 } as React.CSSProperties}
                >
                  {phases.closing.events.map((evt, idx) => (
                    <div
                      key={`closing-${idx}`}
                      onMouseEnter={() => setHoveredEvent(`closing-${idx}`)}
                      onMouseLeave={() => setHoveredEvent(null)}
                      className={`journey-node journey-node--final group ${
                        hoveredEvent === `closing-${idx}` ? "is-hovered" : ""
                      }`}
                    >
                      <div className="journey-node__top">
                        <span className="journey-node__date text-lime">{evt.date}</span>
                        <div className="flex items-center gap-2">
                          <Image
                            src="/assets/icons/trophy-light.png"
                            alt=""
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                          />
                          <span className="journey-node__dot journey-node__dot--lime" />
                        </div>
                      </div>
                      <span className="journey-node__subtag font-arapix">{evt.dayNum}</span>
                      <h4 className="journey-node__title text-lime text-lg sm:text-xl font-black">
                        {evt.title}
                      </h4>
                      <p className="journey-node__desc sm:text-base">{evt.desc}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
