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
  statusText,
  icon,
  iconAlt = "",
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
        className="stats-featured-card group"
      >
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#e7edfd_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.04] pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-4 sm:gap-6">
          {/* Main Number & Labels Block (Properly aligned to start/right in RTL) */}
          <div className="stat-card-content flex-1 min-w-0">
            {/* Big Counter with self-start so it stays on the right above label in RTL */}
            <div
              dir="ltr"
              className="stat-number self-start inline-flex items-baseline gap-1 text-lime tracking-tight drop-shadow-[0_0_20px_rgba(195,249,55,0.4)]"
              style={{ fontFamily: "var(--font-arapix)" }}
            >
              <span>{prefix}</span>
              <span>{count.toLocaleString()}</span>
              {suffix && <span className="stat-suffix text-xl sm:text-2xl lg:text-3xl text-light/80">{suffix}</span>}
            </div>
            <h3
              className="text-base sm:text-lg lg:text-xl text-light font-bold truncate"
              style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
            >
              {label}
            </h3>

            <p
              className="text-[11px] sm:text-xs lg:text-sm text-light/70 max-w-xl leading-relaxed line-clamp-2"
              style={{ fontFamily: "var(--font-janna)" }}
            >
              {description}
            </p>
          </div>

          {/* Icon & Status Block */}
          <div className="flex flex-col items-center justify-center gap-2 shrink-0">
            <div className="p-2 sm:p-2.5 lg:p-3 bg-[#0c1018]/80 border border-light/20 rounded-xl group-hover:scale-105 group-hover:border-lime/50 transition-all duration-300 shadow-sm">
              <PixelTargetArrowIconWhite className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 drop-shadow-[0_0_8px_rgba(231,237,253,0.4)]" />
            </div>

            <span className="text-[9px] sm:text-[10px] font-arapix text-lime tracking-wider">
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
      className="stat-card group flex flex-col justify-between"
    >
      {/* Top Row: Big Counter and Icon side by side (No badge or empty space above) */}
      <div className="flex items-center justify-between gap-1.5 sm:gap-2 relative z-10">
        <div
          dir="ltr"
          className={`stat-number self-start font-bold ${numberColors} group-hover:text-lime transition-colors tracking-tight inline-flex items-baseline gap-0.5`}
          style={{ fontFamily: "var(--font-arapix)" }}
        >
          <span>{prefix}</span>
          <span>{count.toLocaleString()}</span>
          {suffix && <span className="stat-suffix text-lg sm:text-xl text-light/80">{suffix}</span>}
        </div>

        {icon && (
          <div className="p-1 sm:p-1.5 lg:p-2 bg-[#0c1018]/80 border border-light/15 rounded-lg transition-all duration-300 group-hover:scale-105 group-hover:border-lime/40 shadow-sm shrink-0">
            <Image
              src={icon}
              alt={iconAlt}
              width={20}
              height={20}
              className="object-contain drop-shadow-[0_0_6px_rgba(231,237,253,0.4)]"
            />
          </div>
        )}
      </div>

      {/* Content Block: Label & Short Description */}
      <div className="stat-card-content relative z-10 mt-1">
        <h4
          className="text-xs sm:text-sm lg:text-base font-bold text-light leading-snug"
          style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
        >
          {label}
        </h4>

        <p
          className="text-[10px] sm:text-[11px] lg:text-xs text-light/65 leading-snug font-normal line-clamp-2"
          style={{ fontFamily: "var(--font-janna)" }}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function StatsSection() {
  const { t, locale } = useLanguage();
  const { ref, hasBeenInView } = useInView();
  const isRTL = locale === "ar";

  // Data for the 7 statistics (without any metric labels like "المؤشر الرئيسي" or "مؤشر 01")
  const stats = [
    // 1. Featured Target Registrations
    {
      value: 1200,
      prefix: "+",
      suffix: "",
      label: t.stats.registrations,
      description: t.stats.registrationsDesc,
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
      className="stats-section relative w-full overflow-hidden bg-dark scroll-mt-28 pt-24 sm:pt-32 lg:pt-36 pb-16 sm:pb-24 lg:pb-28"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[42rem] h-[22rem] bg-primary/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-8 right-1/4 w-[28rem] h-[18rem] bg-lime/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Container */}
      <div
        ref={ref}
        className="stats-container relative z-10"
      >
        {/* ======================================================== */}
        {/* Section Heading (Guaranteed safe margin above cards)     */}
        {/* ======================================================== */}
        <div className="stats-heading relative flex flex-col items-center justify-center text-center">
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

          {/* Subtitle tag: «مؤشرات التجربة» kept intact as required */}
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

          <div className="stats-title-accent" />
        </div>

        {/* ======================================================== */}
        {/* Cards Area with Subtle Background Art Layer               */}
        {/* ======================================================== */}
        <div className="stats-cards-area relative isolate">
          {/* Subtle Background Art behind cards only */}
          <div className="absolute -inset-x-6 -inset-y-10 sm:-inset-x-12 sm:-inset-y-12 flex items-center justify-center pointer-events-none select-none -z-20 overflow-hidden">
            <Image
              src="/assets/side/buildx-data.png"
              alt=""
              width={1600}
              height={900}
              className="w-full max-w-[1550px] h-full object-contain object-center opacity-[0.28] filter saturate-[1.2] contrast-[1.1]"
            />
          </div>

          {/* Radial Dark Vignette between image and cards */}
          <div className="absolute -inset-x-6 -inset-y-10 sm:-inset-x-12 sm:-inset-y-12 bg-[radial-gradient(circle_at_center,rgba(12,16,24,0.05),rgba(12,16,24,0.45)_75%)] pointer-events-none -z-10" />

          {/* 1. Featured Primary Card (+1,200 Targeted Registrations) */}
          <StatCard
            {...stats[0]}
            started={hasBeenInView}
            delay={0.1}
            isRTL={isRTL}
          />

          {/* 2. Symmetrical Grid of 6 Secondary Stat Cards */}
          <div className="stats-grid">
            {stats.slice(1).map((stat, i) => (
              <StatCard
                key={i + 1}
                {...stat}
                started={hasBeenInView}
                delay={0.15 + i * 0.05}
                isRTL={isRTL}
              />
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* Dashboard Bottom Telemetry Strip                         */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={hasBeenInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 sm:mt-10 p-3 bg-[#0c1018]/80 border border-primary/25 rounded-lg flex flex-wrap items-center justify-between text-xs text-light/50 font-arapix max-w-[980px] mx-auto backdrop-blur-sm"
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
