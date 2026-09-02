"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import { motion } from "framer-motion";
import Image from "next/image";

// Unified Crisp White Pixel Target & Arrow SVG Icon
function PixelTargetArrowIconWhite({ className = "" }: { className?: string }) {
  return (
    <svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      shapeRendering="crispEdges"
    >
      {/* Outer Target Ring in Pure White #e7edfd */}
      <rect x="15" y="3" width="14" height="3" fill="#e7edfd" />
      <rect x="15" y="38" width="14" height="3" fill="#e7edfd" />
      <rect x="3" y="15" width="3" height="14" fill="#e7edfd" />
      <rect x="38" y="15" width="3" height="14" fill="#e7edfd" />
      <rect x="7" y="7" width="8" height="3" fill="#e7edfd" />
      <rect x="7" y="10" width="3" height="5" fill="#e7edfd" />
      <rect x="29" y="7" width="8" height="3" fill="#e7edfd" />
      <rect x="34" y="10" width="3" height="5" fill="#e7edfd" />
      <rect x="7" y="34" width="8" height="3" fill="#e7edfd" />
      <rect x="7" y="29" width="3" height="5" fill="#e7edfd" />
      <rect x="29" y="34" width="8" height="3" fill="#e7edfd" />
      <rect x="34" y="29" width="3" height="5" fill="#e7edfd" />

      {/* Middle Target Ring */}
      <rect x="17" y="11" width="10" height="2.5" fill="#e7edfd" opacity="0.8" />
      <rect x="17" y="30.5" width="10" height="2.5" fill="#e7edfd" opacity="0.8" />
      <rect x="11" y="17" width="2.5" height="10" fill="#e7edfd" opacity="0.8" />
      <rect x="30.5" y="17" width="2.5" height="10" fill="#e7edfd" opacity="0.8" />

      {/* Center Bullseye */}
      <rect x="19" y="19" width="6" height="6" fill="#e7edfd" />

      {/* Pixel Arrow In-Flight striking center (top-left to bullseye) */}
      <rect x="4" y="4" width="3.5" height="3.5" fill="#e7edfd" />
      <rect x="7.5" y="7.5" width="3.5" height="3.5" fill="#e7edfd" />
      <rect x="11" y="11" width="3.5" height="3.5" fill="#e7edfd" />
      <rect x="14.5" y="14.5" width="3.5" height="3.5" fill="#e7edfd" />
      <rect x="18" y="18" width="3.5" height="3.5" fill="#e7edfd" />

      {/* Arrow Point Head */}
      <rect x="21" y="18" width="3" height="2.5" fill="#e7edfd" />
      <rect x="18" y="21" width="2.5" height="3" fill="#e7edfd" />

      {/* Arrow Tail Fletching */}
      <rect x="2" y="6" width="3.5" height="2" fill="#e7edfd" opacity="0.9" />
      <rect x="6" y="2" width="2" height="3.5" fill="#e7edfd" opacity="0.9" />
    </svg>
  );
}

interface StatItemProps {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  description: string;
  badgeText?: string;
  statusText?: string;
  icon?: string;
  iconAlt?: string;
  isCustomTargetIcon?: boolean;
  started: boolean;
  delay: number;
  featured?: boolean;
  accent: "lime" | "pink" | "purple" | "cyan" | "gold";
  isRTL: boolean;
}

function StatCard({
  value,
  prefix = "",
  suffix = "",
  label,
  description,
  badgeText,
  statusText,
  icon,
  iconAlt = "",
  isCustomTargetIcon = false,
  started,
  delay,
  featured = false,
  accent,
  isRTL,
}: StatItemProps) {
  const count = useCountUp(value, 2000, started);

  const numberColors = {
    lime: "text-lime",
    pink: "text-pink",
    purple: "text-light",
    cyan: "text-cyan-300",
    gold: "text-yellow-300",
  }[accent];

  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={started ? { opacity: 1, y: 0 } : {}}
        transition={{ delay, duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-[920px] mx-auto rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 group
          bg-gradient-to-br from-[#141925]/75 via-[#0c1018]/65 to-[#160d24]/75
          border border-light/[0.14] hover:border-lime/60
          shadow-[inset_0_1px_0_rgba(231,237,253,0.08),0_12px_35px_rgba(0,0,0,0.35)]
          hover:shadow-[inset_0_1px_0_rgba(231,237,253,0.12),0_15px_45px_rgba(195,249,55,0.15)]
          p-5 sm:p-6 lg:p-7"
      >
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e7edfd_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.04] pointer-events-none" />

        {/* Refined Pixel Corner Highlights */}
        <span className={`absolute top-0 ${isRTL ? "right-6" : "left-6"} w-16 h-[2px] bg-gradient-to-r from-transparent via-lime to-transparent shadow-[0_0_10px_rgba(195,249,55,0.6)] pointer-events-none`} />
        <span className={`absolute bottom-0 ${isRTL ? "left-6" : "right-6"} w-12 h-[2px] bg-pink shadow-[0_0_8px_rgba(251,80,195,0.5)] pointer-events-none`} />
        <span className={`absolute top-0 ${isRTL ? "right-0" : "left-0"} w-2 h-2 bg-lime pointer-events-none`} />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Main Number & Labels Block */}
          <div className="flex-1">
            {/* Top row with badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 bg-lime/10 border border-lime/30 text-lime text-[11px] font-bold font-arapix mb-2">
              <span className="w-1.5 h-1.5 bg-lime rounded-full animate-ping" />
              <span>{badgeText}</span>
            </div>

            {/* Big Counter */}
            <div
              dir="ltr"
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-lime tracking-tight drop-shadow-[0_0_20px_rgba(195,249,55,0.4)] flex items-baseline gap-1"
              style={{ fontFamily: "var(--font-arapix)", unicodeBidi: "isolate" }}
            >
              <span>{prefix}</span>
              <span>{count.toLocaleString()}</span>
              {suffix && <span className="text-2xl sm:text-3xl text-light/80">{suffix}</span>}
            </div>

            <h3
              className="text-lg sm:text-xl text-light font-bold mt-1"
              style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
            >
              {label}
            </h3>

            <p
              className="text-xs sm:text-sm text-light/70 mt-1 max-w-xl leading-relaxed"
              style={{ fontFamily: "var(--font-janna)" }}
            >
              {description}
            </p>
          </div>

          {/* Right Icon Block (Unified Pure White Icon) */}
          <div className="flex md:flex-col items-center justify-between md:justify-center gap-3 shrink-0">
            <div className="p-3 bg-[#0c1018]/90 border border-light/20 rounded-xl group-hover:scale-105 group-hover:border-lime/50 transition-all duration-300 shadow-sm">
              <PixelTargetArrowIconWhite className="w-9 h-9 sm:w-10 sm:h-10 drop-shadow-[0_0_8px_rgba(231,237,253,0.4)]" />
            </div>

            <span className="text-[10px] font-arapix text-lime/80 tracking-wider">
              ● {statusText}
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={started ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.45, ease: "easeOut" }}
      className="relative rounded-xl overflow-hidden backdrop-blur-md transition-all duration-300 group
        bg-gradient-to-br from-[#141925]/75 via-[#0c1018]/65 to-[#160d24]/75
        border border-light/[0.13] hover:border-lime/50
        shadow-[inset_0_1px_0_rgba(231,237,253,0.06),0_10px_25px_rgba(0,0,0,0.3)]
        hover:shadow-[inset_0_1px_0_rgba(231,237,253,0.1),0_12px_32px_rgba(195,249,55,0.1)]
        hover:-translate-y-1 p-4 sm:p-5 flex flex-col justify-between min-h-[165px] sm:min-h-[175px]"
    >
      {/* Refined Corner Highlights */}
      <span className={`absolute top-0 ${isRTL ? "right-4" : "left-4"} w-10 h-[1.5px] bg-gradient-to-r from-transparent via-lime/80 to-transparent pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />
      <span className={`absolute bottom-0 ${isRTL ? "left-4" : "right-4"} w-8 h-[1.5px] bg-pink/80 pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity`} />
      <span className={`absolute top-0 ${isRTL ? "right-0" : "left-0"} w-1.5 h-1.5 bg-lime pointer-events-none opacity-75`} />

      {/* Top Bar with Badge and White Icon */}
      <div className="flex items-center justify-between gap-2 mb-2 relative z-10">
        <span className="text-[9px] font-arapix text-light/40 uppercase tracking-wider">
          {badgeText}
        </span>
        <div className="p-2 bg-[#0c1018]/90 border border-light/15 rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:border-lime/40 shadow-sm">
          {icon && (
            <Image
              src={icon}
              alt={iconAlt}
              width={26}
              height={26}
              className="object-contain drop-shadow-[0_0_6px_rgba(231,237,253,0.4)]"
            />
          )}
        </div>
      </div>

      {/* Compact Content Block */}
      <div className="relative z-10 my-0.5">
        <div
          dir="ltr"
          className={`text-3xl sm:text-4xl font-bold ${numberColors} group-hover:text-lime transition-colors tracking-tight inline-flex items-baseline gap-0.5`}
          style={{ fontFamily: "var(--font-arapix)", unicodeBidi: "isolate" }}
        >
          <span>{prefix}</span>
          <span>{count.toLocaleString()}</span>
          {suffix && <span className="text-xl sm:text-2xl text-light/80">{suffix}</span>}
        </div>

        <h4
          className="text-sm sm:text-base font-bold text-light leading-snug mt-1"
          style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
        >
          {label}
        </h4>

        <p
          className="text-[11px] sm:text-xs text-light/60 mt-1 leading-snug font-normal line-clamp-2"
          style={{ fontFamily: "var(--font-janna)" }}
        >
          {description}
        </p>
      </div>

      {/* Bottom Status Bar */}
      <div className="mt-2.5 pt-1.5 border-t border-light/[0.08] flex items-center justify-between text-[9px] font-arapix text-light/40 relative z-10">
        <span>{isRTL ? "مؤشر" : "METRIC"}</span>
        <span className="text-lime group-hover:inline-block">● {statusText}</span>
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  const { t, locale } = useLanguage();
  const { ref, hasBeenInView } = useInView();
  const isRTL = locale === "ar";

  // Data for the 7 statistics
  const stats = [
    // 1. Featured Target Registrations
    {
      value: 1200,
      prefix: "+",
      suffix: "",
      label: t.stats.registrations,
      description: t.stats.registrationsDesc,
      badgeText: isRTL ? "المؤشر الرئيسي" : "PRIMARY METRIC",
      statusText: isRTL ? "تحقق المستهدف" : "TARGET MET",
      isCustomTargetIcon: true,
      featured: true,
      accent: "lime" as const,
    },
    // Row 1: 32 participants, 3% acceptance, 28 hours
    {
      value: 32,
      prefix: "",
      suffix: "",
      label: t.stats.participants,
      description: t.stats.participantsDesc,
      badgeText: isRTL ? "مؤشر 01" : "METRIC 01",
      statusText: isRTL ? "ضمن المسار" : "ON TRACK",
      icon: "/assets/icons/people-light.png",
      iconAlt: isRTL ? "أيقونة المشاركين" : "Participants icon",
      featured: false,
      accent: "purple" as const,
    },
    {
      value: 3,
      prefix: "",
      suffix: "%",
      label: t.stats.acceptanceRate,
      description: t.stats.acceptanceRateDesc,
      badgeText: isRTL ? "مؤشر 02" : "METRIC 02",
      statusText: isRTL ? "معيار الجودة" : "QUALITY TARGET",
      icon: "/assets/icons/diamond-light.png",
      iconAlt: isRTL ? "أيقونة نسبة القبول" : "Acceptance rate icon",
      featured: false,
      accent: "cyan" as const,
    },
    {
      value: 28,
      prefix: "",
      suffix: "",
      label: t.stats.hours,
      description: t.stats.hoursDesc,
      badgeText: isRTL ? "مؤشر 03" : "METRIC 03",
      statusText: isRTL ? "خطة مكتملة" : "COMPLETED SYLLABUS",
      icon: "/assets/icons/development-light.png",
      iconAlt: isRTL ? "أيقونة الساعات" : "Hours icon",
      featured: false,
      accent: "lime" as const,
    },
    // Row 2: 8 teams, 8 products, 3 winning projects
    {
      value: 8,
      prefix: "",
      suffix: "",
      label: t.stats.teams,
      description: t.stats.teamsDesc,
      badgeText: isRTL ? "مؤشر 04" : "METRIC 04",
      statusText: isRTL ? "فرق متكاملة" : "ACTIVE SQUADS",
      icon: "/assets/icons/challenge-light.png",
      iconAlt: isRTL ? "أيقونة الفرق" : "Teams icon",
      featured: false,
      accent: "pink" as const,
    },
    {
      value: 8,
      prefix: "",
      suffix: "",
      label: t.stats.products,
      description: t.stats.productsDesc,
      badgeText: isRTL ? "مؤشر 05" : "METRIC 05",
      statusText: isRTL ? "جاهزة للإطلاق" : "READY TO LAUNCH",
      icon: "/assets/icons/product-light.png",
      iconAlt: isRTL ? "أيقونة المنتجات" : "Products icon",
      featured: false,
      accent: "gold" as const,
    },
    {
      value: 3,
      prefix: "",
      suffix: "",
      label: t.stats.winningProjects,
      description: t.stats.winningProjectsDesc,
      badgeText: isRTL ? "مؤشر 06" : "METRIC 06",
      statusText: isRTL ? "منصة التتويج" : "PODIUM FINISH",
      icon: "/assets/icons/trophy-light.png",
      iconAlt: isRTL ? "أيقونة المشاريع الفائزة" : "Winning projects icon",
      featured: false,
      accent: "gold" as const,
    },
  ];

  return (
    <section
      id="stats"
      className="relative w-full overflow-hidden bg-dark scroll-mt-28 pt-24 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 lg:pb-28"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[42rem] h-[22rem] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-8 right-1/4 w-[28rem] h-[18rem] bg-lime/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div
        ref={ref}
        className="relative z-10 w-[min(calc(100%-32px),1480px)] sm:w-[min(calc(100%-48px),1480px)] mx-auto"
      >
        {/* ======================================================== */}
        {/* Section Heading (With guaranteed safe margin above cards)*/}
        {/* ======================================================== */}
        <div className="relative flex flex-col items-center justify-center text-center mb-14 sm:mb-16 lg:mb-20">
          {/* Luminous Glow Accent behind title */}
          <div className="absolute -top-7 sm:-top-9 flex items-center justify-center pointer-events-none select-none opacity-30">
            <Image
              src="/assets/icons/text-glow.png"
              alt=""
              width={240}
              height={64}
              className="object-contain blur-[2px]"
            />
          </div>

          {/* Subtitle tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-lime/10 border border-lime/30 text-lime text-xs font-bold mb-3 font-arapix tracking-wider relative z-10">
            <span className="w-1.5 h-1.5 bg-lime inline-block animate-pulse" />
            <span>{t.stats.subtitle}</span>
          </div>

          {/* Main Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl text-light font-bold relative z-10 tracking-tight"
            style={{ fontFamily: isRTL ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
          >
            {t.stats.title}
          </motion.h2>

          <div className="w-20 sm:w-24 h-1 bg-gradient-to-r from-lime via-pink to-primary mt-3 sm:mt-4 rounded-full" />
        </div>

        {/* ======================================================== */}
        {/* Cards Area with Subtle Background Art Layer               */}
        {/* ======================================================== */}
        <div className="relative isolate w-full">
          {/* Subtle Background Art behind cards only */}
          <div className="absolute -inset-x-6 -inset-y-10 sm:-inset-x-12 sm:-inset-y-12 flex items-center justify-center pointer-events-none select-none -z-20 overflow-hidden">
            <Image
              src="/assets/side/buildx-data.png"
              alt=""
              width={1600}
              height={900}
              className="w-full max-w-[1550px] h-full object-contain object-center opacity-[0.13] filter saturate-[1.15] contrast-[1.05]"
            />
          </div>

          {/* Radial Dark Vignette between image and cards */}
          <div className="absolute -inset-x-6 -inset-y-10 sm:-inset-x-12 sm:-inset-y-12 bg-[radial-gradient(circle_at_center,rgba(12,16,24,0.15),rgba(12,16,24,0.65)_75%)] pointer-events-none -z-10" />

          {/* 1. Featured Primary Card (+1,200 Targeted Registrations) */}
          <div className="w-full flex justify-center mb-4 sm:mb-5">
            <StatCard
              {...stats[0]}
              started={hasBeenInView}
              delay={0.1}
              isRTL={isRTL}
            />
          </div>

          {/* 2. Symmetrical 2x3 Grid of 6 Secondary Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-4.5 lg:gap-5 w-full max-w-[1240px] mx-auto">
            {stats.slice(1).map((stat, i) => (
              <div
                key={i + 1}
                className={i === 5 ? "sm:col-span-2 lg:col-span-1" : ""}
              >
                <StatCard
                  {...stat}
                  started={hasBeenInView}
                  delay={0.15 + i * 0.06}
                  isRTL={isRTL}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* Dashboard Bottom Telemetry Strip                         */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={hasBeenInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-10 sm:mt-12 p-3 bg-[#0c1018]/80 border border-primary/25 rounded-lg flex flex-wrap items-center justify-between text-xs text-light/50 font-arapix max-w-[1240px] mx-auto backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-lime inline-block" />
            <span>
              {isRTL
                ? "مصدر البيانات: معايير قبول ومنهج معسكر BUILDx"
                : "DATA SOURCE: BUILDX CAMP ADMISSIONS & SYLLABUS"}
            </span>
          </div>
          <span className="text-light/35">
            {isRTL ? "النسخة الأولى | 2026" : "COHORT 01 // 2026"}
          </span>
        </motion.div>

      </div>
    </section>
  );
}
