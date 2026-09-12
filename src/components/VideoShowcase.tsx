"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";

// ─── YouTube Video ID ───────────────────────────────────────────────────────
const YOUTUBE_VIDEO_ID = "a1oLKhzsxtY";

// ─── Floating Pixel Particle ────────────────────────────────────────────────
function FloatingPixel({
  delay,
  x,
  y,
  size,
  color,
}: {
  delay: number;
  x: string;
  y: string;
  size: number;
  color: string;
}) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ left: x, top: y, width: size, height: size, background: color }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: [0, 0.8, 0.4, 0.8, 0],
        scale: [0, 1, 0.8, 1, 0],
        y: [0, -20, -10, -30, -50],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "easeInOut",
      }}
    />
  );
}

// ─── Scanning Line Effect ───────────────────────────────────────────────────
function ScanLine() {
  return (
    <motion.div
      className="absolute left-0 right-0 h-[2px] pointer-events-none z-30"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(195,249,55,0.3) 20%, rgba(195,249,55,0.6) 50%, rgba(195,249,55,0.3) 80%, transparent 100%)",
        boxShadow: "0 0 20px rgba(195,249,55,0.3)",
      }}
      initial={{ top: "0%" }}
      animate={{ top: "100%" }}
      transition={{
        duration: 3.5,
        repeat: Infinity,
        repeatDelay: 2,
        ease: "linear",
      }}
    />
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function VideoShowcase() {
  const { locale } = useLanguage();
  const isRTL = locale === "ar";
  const [isPlaying, setIsPlaying] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  const handlePlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="explainer-video"
      className="video-showcase-section scroll-mt-24"
    >
      {/* ── Ambient Background Effects ── */}
      <div className="video-showcase__ambient-1" />
      <div className="video-showcase__ambient-2" />
      <div className="video-showcase__ambient-3" />
      <div className="absolute inset-0 grid-bg opacity-[0.06] pointer-events-none" />

      {/* ── Floating Pixel Particles ── */}
      <FloatingPixel delay={0} x="8%" y="20%" size={5} color="#c3f937" />
      <FloatingPixel delay={1.2} x="92%" y="30%" size={4} color="#fb50c3" />
      <FloatingPixel delay={0.6} x="15%" y="70%" size={3} color="#fb50c3" />
      <FloatingPixel delay={1.8} x="85%" y="75%" size={5} color="#c3f937" />
      <FloatingPixel delay={2.4} x="50%" y="15%" size={3} color="#823419" />
      <FloatingPixel delay={0.3} x="75%" y="85%" size={4} color="#c3f937" />

      <div className="video-showcase__container relative z-10">
        {/* ── Section Header ── */}
        <motion.div
          className="video-showcase__header"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <div className="video-showcase__badge">
            <span className="video-showcase__badge-dot" />
            <span className="font-arapix text-xs tracking-wider">
              {isRTL ? "الفيديو التوضيحي" : "EXPLAINER VIDEO"}
            </span>
          </div>

          {/* Title */}
          <h2
            className="video-showcase__title"
            style={{
              fontFamily: isRTL
                ? "var(--font-news-almstqbl)"
                : "var(--font-bauhaus)",
            }}
          >
            {isRTL ? (
              <>
                ناظر{" "}
                <span className="video-showcase__title-accent">للتوضيح</span>
              </>
            ) : (
              <>
                Watch the{" "}
                <span className="video-showcase__title-accent">Explainer</span>
              </>
            )}
          </h2>

          {/* Subtitle */}
          <p
            className="video-showcase__subtitle"
            style={{ fontFamily: "var(--font-janna)" }}
          >
            {isRTL
              ? "اكتشف تجربة BUILDx في دقائق — من الفكرة إلى المنتج."
              : "Discover the BUILDx experience in minutes — from idea to product."}
          </p>

          {/* Accent line */}
          <div className="video-showcase__header-line" />
        </motion.div>

        {/* ── Video Player Area ── */}
        <motion.div
          className="video-showcase__player-wrap"
          initial={{ opacity: 0, y: 50, scale: 0.92 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {/* Outer Glow Border Frame */}
          <div className="video-showcase__frame">
            {/* Corner Markers */}
            <div className="video-showcase__corner video-showcase__corner--tl" />
            <div className="video-showcase__corner video-showcase__corner--tr" />
            <div className="video-showcase__corner video-showcase__corner--bl" />
            <div className="video-showcase__corner video-showcase__corner--br" />

            {/* Inner Player */}
            <div className="video-showcase__player">
              {/* Scan Line Effect (only visible on thumbnail) */}
              {!isPlaying && <ScanLine />}

              <AnimatePresence mode="wait">
                {!isPlaying ? (
                  /* ── Thumbnail State ── */
                  <motion.div
                    key="thumbnail"
                    className="video-showcase__thumbnail"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* YouTube Thumbnail */}
                    <Image
                      src={`https://img.youtube.com/vi/${YOUTUBE_VIDEO_ID}/maxresdefault.jpg`}
                      alt={isRTL ? "فيديو BUILDx التوضيحي" : "BUILDx Explainer Video"}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 1100px"
                      priority={false}
                    />

                    {/* Dark Overlay */}
                    <div className="video-showcase__overlay" />

                    {/* Play Button */}
                    <button
                      onClick={handlePlay}
                      className="video-showcase__play-btn group"
                      aria-label={isRTL ? "تشغيل الفيديو" : "Play video"}
                    >
                      {/* Pulsing rings */}
                      <span className="video-showcase__play-ring video-showcase__play-ring--1" />
                      <span className="video-showcase__play-ring video-showcase__play-ring--2" />
                      <span className="video-showcase__play-ring video-showcase__play-ring--3" />

                      {/* Play icon */}
                      <span className="video-showcase__play-icon">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M8 5.14v14l11-7-11-7z" />
                        </svg>
                      </span>
                    </button>

                    {/* Bottom status bar */}
                    <div className="video-showcase__status-bar">
                      <div className="video-showcase__status-dot" />
                      <span className="font-arapix text-[10px] sm:text-xs tracking-wider">
                        {isRTL ? "جاهز للتشغيل" : "READY TO PLAY"}
                      </span>
                    </div>
                  </motion.div>
                ) : (
                  /* ── YouTube Embed State ── */
                  <motion.div
                    key="video"
                    className="video-showcase__embed"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&start=548`}
                      title={
                        isRTL
                          ? "فيديو BUILDx التوضيحي"
                          : "BUILDx Explainer Video"
                      }
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="video-showcase__iframe"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Side Decorative Tags */}
          <motion.div
            className={`video-showcase__side-tag ${
              isRTL ? "video-showcase__side-tag--right" : "video-showcase__side-tag--left"
            }`}
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <span className="video-showcase__side-tag-line" />
            <span className="font-arapix text-[10px] tracking-widest text-lime/50">
              BUILDx
            </span>
          </motion.div>

          <motion.div
            className={`video-showcase__side-tag ${
              isRTL ? "video-showcase__side-tag--left" : "video-showcase__side-tag--right"
            }`}
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <span className="video-showcase__side-tag-line video-showcase__side-tag-line--pink" />
            <span className="font-arapix text-[10px] tracking-widest text-pink/50">
              2026
            </span>
          </motion.div>
        </motion.div>

        {/* ── Bottom CTA Strip ── */}
        <motion.div
          className="video-showcase__bottom-strip"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <span className="w-2 h-2 bg-lime/60" />
          <span className="video-showcase__bottom-strip-line" />
          <span
            className="text-[11px] sm:text-xs text-light/40 tracking-wider font-bold font-arapix"
          >
            {isRTL
              ? "مبادرة تقانة // معسكر BUILDx"
              : "TIQANAH // BUILDx CAMP"}
          </span>
          <span className="video-showcase__bottom-strip-line video-showcase__bottom-strip-line--reverse" />
          <span className="w-2 h-2 bg-pink/60" />
        </motion.div>
      </div>
    </section>
  );
}
