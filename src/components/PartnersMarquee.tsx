"use client";

import { useRef, useSyncExternalStore } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { partners } from "@/data/team";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function PartnersMarquee() {
  const { t, locale } = useLanguage();
  const isRTL = locale === "ar";
  const { ref, hasBeenInView } = useInView();
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false
  );
  const trackRef = useRef<HTMLDivElement>(null);

  // Repeat logos enough times for seamless loop (4 is sufficient, reduced from 8)
  const repetitions = 4;
  const repeatedPartners = Array.from({ length: repetitions }, () => partners).flat();

  return (
    <section
      className="partners-section"
      aria-labelledby="partners-title"
      ref={ref}
    >
      <div className="team-container">
        <motion.div
          className="partners-header"
          initial={{ opacity: 0, y: 20 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <h2
            id="partners-title"
            className="partners-title"
            style={{
              fontFamily: isRTL
                ? "var(--font-news-almstqbl)"
                : "var(--font-bauhaus)",
            }}
          >
            {t.partnersSection.title}
          </h2>
        </motion.div>
      </div>

      {/* Marquee Track */}
      <div className="partners-marquee-wrap">
        <div className="partners-marquee-fade partners-marquee-fade-start" />
        <div className="partners-marquee-fade partners-marquee-fade-end" />

        <div
          ref={trackRef}
          className={`partners-marquee-track ${reducedMotion ? "is-static" : ""}`}
        >
          {repeatedPartners.map((partner, i) => (
            <div
              key={`${partner.id}-${i}`}
              className="partners-marquee-item"
            >
              <span className="partners-type font-arapix">
                {isRTL ? partner.typeAr : partner.typeEn}
              </span>
              <Image
                src={partner.logoSrc}
                alt={isRTL ? partner.nameAr : partner.nameEn}
                width={140}
                height={56}
                className="partners-logo"
                sizes="140px"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
