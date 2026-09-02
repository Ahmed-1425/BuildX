"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";
import Image from "next/image";

export default function VibeCodingSection() {
  const { t, locale } = useLanguage();
  const { ref, hasBeenInView } = useInView();
  const isRTL = locale === "ar";

  return (
    <section id="about" className="relative w-full overflow-hidden py-16 sm:py-24 lg:py-32 bg-dark">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 -right-36 w-[32rem] h-[32rem] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -left-36 w-[32rem] h-[32rem] bg-lime/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      {/* Full-width container using wide breathing room */}
      <div ref={ref} className="relative z-10 w-[min(calc(100%-32px),1440px)] sm:w-[min(calc(100%-64px),1440px)] lg:w-[min(calc(100%-96px),1500px)] mx-auto">
        
        {/* ======================================================== */}
        {/* 1. ROW 1: ما هو BUILDx؟ (What is BUILDx?)                */}
        {/* Desktop: Text Right (55%), Image Left (45%) in Arabic    */}
        {/* Mobile: Stacked vertically with image directly below     */}
        {/* ======================================================== */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 xl:gap-24 items-center min-h-[auto] lg:min-h-[540px]">
          
          {/* Big Pixel Number Watermark in Background */}
          <div
            className={`absolute top-0 pointer-events-none select-none text-8xl sm:text-9xl lg:text-[14rem] font-bold text-light/[0.03] font-arapix z-0 leading-none ${
              isRTL ? "right-0 lg:-right-6" : "left-0 lg:-left-6"
            }`}
          >
            01
          </div>

          {/* Text Column (55% on desktop -> col-span-7) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className={`relative z-10 lg:col-span-7 flex flex-col ${
              isRTL ? "text-right items-start" : "text-left items-start"
            } ${!isRTL ? "lg:order-1" : "lg:order-2"}`}
          >
            {/* Top Tag with Short Pixel Line */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <span
                className="text-xs sm:text-sm font-bold font-arapix text-lime tracking-wider"
              >
                [01] // {locale === "ar" ? "المعسكر التطبيقي" : "APPLIED CAMP"}
              </span>
              <span className="w-12 sm:w-20 h-[2px] bg-gradient-to-r from-lime to-transparent inline-block" />
            </div>

            {/* Main Section Title */}
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-light font-bold mb-6 sm:mb-8 leading-[1.15]"
              style={{ fontFamily: locale === "ar" ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
            >
              {locale === "ar" ? (
                <>
                  ما هو <span className="text-lime drop-shadow-[0_0_20px_rgba(195,249,55,0.4)]">BUILDx</span>؟
                </>
              ) : (
                <>
                  WHAT IS <span className="text-lime drop-shadow-[0_0_20px_rgba(195,249,55,0.4)]">BUILDx</span>?
                </>
              )}
            </h2>

            {/* Structured Readable Description */}
            <div
              className="space-y-4 sm:space-y-5 max-w-[700px] text-light/85 text-base sm:text-lg lg:text-[20px] leading-[1.9] sm:leading-[2]"
              style={{ fontFamily: "var(--font-janna)" }}
            >
              <p>{t.about.description}</p>
              <p className="text-light/70">{t.about.description2}</p>
            </div>

            {/* Keywords Strip (No boxes, clean pixel separators) */}
            <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-light/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-arapix text-light/70">
              <span className="text-lime font-bold">⚡ {locale === "ar" ? "تدريب فردي" : "Solo Prep"}</span>
              <span className="text-light/30">■</span>
              <span className="text-pink font-bold">👥 {locale === "ar" ? "هاكاثون جماعي" : "Co-op Hackathon"}</span>
              <span className="text-light/30">■</span>
              <span className="text-lime font-bold">🚀 {locale === "ar" ? "منتج فعّال" : "Live Product"}</span>
            </div>
          </motion.div>

          {/* Visual Column: Glass BUILDx Characters (45% on desktop -> col-span-5) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={hasBeenInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className={`relative z-10 lg:col-span-5 flex justify-center items-center w-full mt-4 lg:mt-0 ${
              !isRTL ? "lg:order-2" : "lg:order-1"
            } ${isRTL ? "max-lg:-translate-x-2" : "max-lg:translate-x-2"}`}
          >
            {/* Subtle localized glow behind visual */}
            <div className="absolute inset-10 bg-primary/20 rounded-full blur-[50px] pointer-events-none -z-10" />

            <div className="vibe-float-1 relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[500px] xl:max-w-[540px]">
              <Image
                src="/assets/side/glass-characters.png"
                alt={locale === "ar" ? "شخصيات BUILDx الزجاجية" : "BUILDx Glass Characters"}
                width={560}
                height={560}
                className="w-full h-auto max-h-[380px] sm:max-h-[460px] lg:max-h-[520px] object-contain object-center drop-shadow-[0_20px_40px_rgba(52,21,95,0.6)] select-none hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>

        </div>

        {/* ======================================================== */}
        {/* Visual Rhythm Transition (Pixel Command Row)             */}
        {/* ======================================================== */}
        <div className="my-16 sm:my-24 lg:my-28 flex items-center justify-center gap-3 select-none pointer-events-none opacity-60">
          <span className="w-2 h-2 bg-pink/70" />
          <span className="w-16 sm:w-28 h-[1px] bg-gradient-to-r from-pink/50 via-lime/50 to-primary/50" />
          <span
            className="text-[11px] sm:text-xs text-light/50 tracking-wider font-bold"
            style={{ fontFamily: locale === "ar" ? "var(--font-janna-bold)" : "var(--font-arapix)" }}
          >
            {locale === "ar" ? "نقلة نوعية // في أسلوب البناء" : "PARADIGM // SHIFT"}
          </span>
          <span className="w-16 sm:w-28 h-[1px] bg-gradient-to-r from-primary/50 via-lime/50 to-pink/50" />
          <span className="w-2 h-2 bg-lime/70" />
        </div>

        {/* ======================================================== */}
        {/* 2. ROW 2: ما هو Vibe Coding؟ (What is Vibe Coding?)      */}
        {/* Desktop: Image Right (45%), Text Left (55%) in Arabic    */}
        {/* (Inverted Rhythm)                                        */}
        {/* Mobile: Stacked vertically with image directly below     */}
        {/* ======================================================== */}
        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 xl:gap-24 items-center min-h-[auto] lg:min-h-[540px]">
          
          {/* Big Pixel Number Watermark in Background */}
          <div
            className={`absolute top-0 pointer-events-none select-none text-8xl sm:text-9xl lg:text-[14rem] font-bold text-light/[0.03] font-arapix z-0 leading-none ${
              isRTL ? "left-0 lg:-left-6" : "right-0 lg:-right-6"
            }`}
          >
            02
          </div>

          {/* Visual Column: Collage Asset (45% on desktop -> col-span-5) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={hasBeenInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className={`relative z-10 lg:col-span-5 flex justify-center items-center w-full max-lg:order-2 mt-4 lg:mt-0 ${
              !isRTL ? "lg:order-1" : "lg:order-2"
            } ${isRTL ? "max-lg:translate-x-2" : "max-lg:-translate-x-2"}`}
          >
            {/* Subtle localized glow behind visual */}
            <div className="absolute inset-10 bg-pink/20 rounded-full blur-[50px] pointer-events-none -z-10" />

            <div className="vibe-float-2 relative w-full max-w-[340px] sm:max-w-[420px] lg:max-w-[500px] xl:max-w-[540px]">
              <Image
                src="/assets/side/collage.png"
                alt={locale === "ar" ? "كولاج BUILDx" : "BUILDx Collage"}
                width={560}
                height={560}
                className="w-full h-auto max-h-[380px] sm:max-h-[460px] lg:max-h-[520px] object-contain object-center drop-shadow-[0_20px_40px_rgba(251,80,195,0.4)] select-none hover:scale-105 transition-transform duration-500"
              />
            </div>
          </motion.div>

          {/* Text Column (55% on desktop -> col-span-7) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className={`relative z-10 lg:col-span-7 flex flex-col max-lg:order-1 ${
              isRTL ? "text-right items-start" : "text-left items-start"
            } ${!isRTL ? "lg:order-2" : "lg:order-1"}`}
          >
            {/* Top Tag with Short Pixel Line */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <span
                className="text-xs sm:text-sm font-bold font-arapix text-pink tracking-wider"
              >
                [02] // {locale === "ar" ? "المفهوم والأسلوب" : "THE CONCEPT"}
              </span>
              <span className="w-12 sm:w-20 h-[2px] bg-gradient-to-r from-pink to-transparent inline-block" />
            </div>

            {/* Main Section Title */}
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-light font-bold mb-6 sm:mb-8 leading-[1.15]"
              style={{ fontFamily: locale === "ar" ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
            >
              {locale === "ar" ? (
                <>
                  ما هو <span className="text-pink drop-shadow-[0_0_20px_rgba(251,80,195,0.4)]">Vibe Coding</span>؟
                </>
              ) : (
                <>
                  WHAT IS <span className="text-pink drop-shadow-[0_0_20px_rgba(251,80,195,0.4)]">VIBE CODING</span>?
                </>
              )}
            </h2>

            {/* Structured Readable Description */}
            <div
              className="space-y-4 sm:space-y-5 max-w-[700px] text-light/85 text-base sm:text-lg lg:text-[20px] leading-[1.9] sm:leading-[2]"
              style={{ fontFamily: "var(--font-janna)" }}
            >
              <p>{t.vibeCoding.p1}</p>
              <p className="text-light/70">{t.vibeCoding.p2}</p>
            </div>

            {/* Keywords Strip (No boxes, clean pixel separators) */}
            <div className="mt-8 sm:mt-10 pt-4 sm:pt-6 border-t border-light/10 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs sm:text-sm font-arapix text-light/70">
              <span className="text-pink font-bold">💬 {locale === "ar" ? "لغة طبيعية" : "Natural Language"}</span>
              <span className="text-light/30">■</span>
              <span className="text-lime font-bold">⚡ {locale === "ar" ? "توجيه فوري واختبار" : "Iterate & Test"}</span>
              <span className="text-light/30">■</span>
              <span className="text-pink font-bold">🎯 {locale === "ar" ? "التركيز على القيمة" : "Value-Driven"}</span>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
