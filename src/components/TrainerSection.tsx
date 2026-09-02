"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";
import Image from "next/image";

export default function TrainerSection() {
  const { t, locale } = useLanguage();
  const isRTL = locale === "ar";
  const { ref, hasBeenInView } = useInView();

  // Desktop subtle 3D tilt
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, translateY: 0 });
  const [breakdownHighlight, setBreakdownHighlight] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -y * 3,
      rotateY: x * 5,
      translateY: -Math.abs(y) * 4,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, translateY: 0 });
  };

  return (
    <section id="trainer" className="trainer-section scroll-mt-24">
      {/* Background Subtle Watermark */}
      <div className="trainer-ghost-watermark">01</div>

      <div ref={ref} className="trainer-container">
        {/* ====================================================================
            1. SECTION HEADING
            ==================================================================== */}
        <div className="trainer-section-heading">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-lime/10 border border-lime/30 text-lime text-xs font-bold font-arapix tracking-wider">
              <span className="w-1.5 h-1.5 bg-lime inline-block animate-pulse" />
              <span>{t.trainer.fileBadge}</span>
            </div>
          </div>

          <h2
            className="trainer-section-title"
            style={{ fontFamily: isRTL ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
          >
            {t.trainer.sectionHeading}
          </h2>

          <p
            className="text-base sm:text-lg lg:text-xl text-light/75 max-w-3xl mt-3 leading-relaxed"
            style={{ fontFamily: "var(--font-janna)" }}
          >
            {t.trainer.sectionSubheading}
          </p>
        </div>

        {/* ====================================================================
            2. PROFILE LAYOUT
            ==================================================================== */}
        <div className="trainer-profile-layout">
          {/* PORTRAIT COLUMN */}
          <div
            className="trainer-portrait-column"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="trainer-portrait-sticky">
              <motion.div
                className="trainer-portrait-wrapper"
                initial={{ opacity: 0, y: 25 }}
                animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div
                  animate={{
                    rotateX: tilt.rotateX,
                    rotateY: tilt.rotateY,
                    y: tilt.translateY,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 140,
                    damping: 18,
                    mass: 0.6,
                  }}
                  className="w-full h-full flex items-start justify-center"
                >
                  <Image
                    src="/assets/trainer/ahmed-alrasheed-portrait.png"
                    alt={t.trainer.name}
                    width={2580}
                    height={3692}
                    priority
                    className="trainer-portrait"
                    sizes="(max-width: 768px) 88vw, (max-width: 1200px) 45vw, 540px"
                  />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* CONTENT COLUMN */}
          <div className="trainer-content">
            {/* Identity: Name & Roles */}
            <div className="trainer-identity">
              <h3
                className="trainer-name"
                style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
              >
                {t.trainer.name}
              </h3>

              <div className="trainer-roles">
                {t.trainer.roles.map((role, idx) => (
                  <span key={idx} className="trainer-role-item">
                    {idx > 0 && <span className="role-sep">◆</span>}
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {/* Biography */}
            <div className="trainer-biography">
              <p
                className="trainer-bio-p"
                style={{ fontFamily: isRTL ? "var(--font-janna)" : "sans-serif" }}
              >
                {t.trainer.bioP1}
              </p>
              <p
                className="trainer-bio-p mt-3 text-light/85 font-medium"
                style={{ fontFamily: isRTL ? "var(--font-janna)" : "sans-serif" }}
              >
                {t.trainer.bioP2}
              </p>
            </div>

            {/* Five Stats: +32 | +26 | 13 | 2 | Top 50 */}
            <div className="trainer-stats">
              {t.trainer.stats.map((stat, idx) => (
                <div key={idx} className="trainer-stat">
                  <span className="trainer-stat-number">
                    {stat.number === "13" ? (
                      <span className="inline-flex items-center justify-center gap-1.5 font-arapix">
                        <span>1</span>
                        <span>3</span>
                      </span>
                    ) : (
                      stat.number
                    )}
                  </span>
                  <span
                    className="trainer-stat-label"
                    style={{ fontFamily: isRTL ? "var(--font-janna)" : "sans-serif" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* 13 Achievements Breakdown Panel */}
            <div
              id="achievements-breakdown"
              className={`achievement-breakdown-wrapper scroll-mt-28 transition-all duration-500 ${
                breakdownHighlight ? "is-highlighted" : ""
              }`}
            >
              <div className="achievement-breakdown-header">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-lime inline-block" />
                  <h4
                    className="text-base sm:text-lg font-bold text-light"
                    style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
                  >
                    {t.trainer.breakdownTitle}
                  </h4>
                </div>
              </div>

              {/* Visual Equation: 8 + 3 + 2 = 13 (always LTR) */}
              <div
                className="achievement-equation"
                dir="ltr"
                aria-label={
                  isRTL
                    ? "ثمانية زائد ثلاثة زائد اثنين يساوي ثلاثة عشر"
                    : "Eight plus three plus two equals thirteen"
                }
              >
                <span>{t.trainer.breakdownParts.hackathons.number}</span>
                <span className="operator">+</span>
                <span>{t.trainer.breakdownParts.entrepreneurship.number}</span>
                <span className="operator">+</span>
                <span>{t.trainer.breakdownParts.international.number}</span>
                <span className="operator">=</span>
                <strong
                  className="achievement-equation__result"
                  aria-label="13"
                >
                  <span className="equation-digit">1</span>
                  <span className="equation-digit">3</span>
                </strong>
              </div>

              {/* Three Breakdown Parts */}
              <div className="achievement-breakdown">
                {/* Part 1: 8 Hackathon Wins */}
                <div className="achievement-part">
                  <span className="achievement-part-number font-arapix">
                    {t.trainer.breakdownParts.hackathons.number}
                  </span>
                  <h5
                    className="achievement-part__title"
                    style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
                  >
                    {t.trainer.breakdownParts.hackathons.label}
                  </h5>
                  <p
                    className="achievement-part__sub"
                    style={{ fontFamily: isRTL ? "var(--font-janna)" : "sans-serif" }}
                  >
                    {t.trainer.breakdownParts.hackathons.sub}
                  </p>
                </div>

                {/* Part 2: 3 Entrepreneurship Placements */}
                <div className="achievement-part">
                  <span className="achievement-part-number font-arapix">
                    {t.trainer.breakdownParts.entrepreneurship.number}
                  </span>
                  <h5
                    className="achievement-part__title"
                    style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
                  >
                    {t.trainer.breakdownParts.entrepreneurship.label}
                  </h5>
                  <p
                    className="achievement-part__sub"
                    style={{ fontFamily: isRTL ? "var(--font-janna)" : "sans-serif" }}
                  >
                    {t.trainer.breakdownParts.entrepreneurship.sub}
                  </p>
                </div>

                {/* Part 3: 1 International Achievement → 2 Awards */}
                <div className="achievement-part">
                  <span className="achievement-part-number font-arapix">
                    {t.trainer.breakdownParts.international.number}
                  </span>
                  <h5
                    className="achievement-part__title"
                    style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
                  >
                    {t.trainer.breakdownParts.international.label}
                  </h5>
                  <span className="achievement-part__event font-mono text-xs text-lime/90 block mb-2">
                    {t.trainer.breakdownParts.international.event}
                  </span>
                  <p
                    className="achievement-part__sub"
                    style={{ fontFamily: isRTL ? "var(--font-janna)" : "sans-serif" }}
                  >
                    {t.trainer.breakdownParts.international.sub}
                  </p>

                  {/* 2 International Awards detail */}
                  <div className="international-awards-detail mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="international-awards-count font-arapix">
                        {t.trainer.breakdownParts.international.awardsCount}
                      </span>
                      <span
                        className="text-sm font-bold text-pink"
                        style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "sans-serif" }}
                      >
                        {t.trainer.breakdownParts.international.awardsLabel}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      {t.trainer.breakdownParts.international.awards.map((award, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          {idx === 0 ? (
                            <Image
                              src="/assets/icons/trophy-light.png"
                              alt=""
                              width={16}
                              height={16}
                              className="w-4 h-4 object-contain opacity-80"
                            />
                          ) : (
                            <span
                              className="inline-flex items-center justify-center text-sm leading-none select-none w-4 h-4"
                              role="img"
                              aria-label={isRTL ? "الميدالية الذهبية" : "Gold Medal"}
                            >
                              🥇
                            </span>
                          )}
                          <span
                            className="text-sm text-light/90 font-semibold"
                            style={{ fontFamily: isRTL ? "var(--font-janna)" : "sans-serif" }}
                          >
                            {award}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Programs That Shaped the Journey */}
            <div className="trainer-programs-section">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 bg-lime inline-block" />
                <h4
                  className="text-base sm:text-lg font-bold text-light"
                  style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
                >
                  {t.trainer.programsTitle}
                </h4>
              </div>

              <div className="trainer-programs">
                {t.trainer.programsList.map((prog, idx) => (
                  <div key={idx} className="trainer-program-chip">
                    <span className="trainer-program-chip__dot" />
                    <div className="trainer-program-chip__content">
                      <span
                        className="trainer-program-chip__name"
                        style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "sans-serif" }}
                      >
                        {prog.institution}
                      </span>
                      <span
                        className="trainer-program-chip__desc"
                        style={{ fontFamily: isRTL ? "var(--font-janna)" : "sans-serif" }}
                      >
                        {prog.desc}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Link Button */}
            <div className="trainer-profile-link-wrap">
              <a
                href="https://ahmedalrasheed.com"
                target="_blank"
                rel="noopener noreferrer"
                className="trainer-profile-link"
                style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
              >
                <span>{t.trainer.exploreProfile}</span>
                <span className="text-lg">{isRTL ? "←" : "→"}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
