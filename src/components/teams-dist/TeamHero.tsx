"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface TeamHeroProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  hasSearchResults: boolean;
  searchPerformed: boolean;
}

export default function TeamHero({
  searchQuery,
  onSearchChange,
  onClearSearch,
  hasSearchResults,
  searchPerformed,
}: TeamHeroProps) {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
      {/* ─── Deep cinematic ambient lighting ─── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[700px] h-[700px] rounded-full opacity-40"
          style={{ background: "radial-gradient(circle, rgba(130,52,25,0.35) 0%, transparent 70%)" }} />
        <div className="absolute bottom-[-15%] left-[-8%] w-[600px] h-[600px] rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, rgba(195,249,55,0.2) 0%, transparent 70%)" }} />
        <div className="absolute top-[30%] left-[50%] w-[500px] h-[500px] rounded-full opacity-25 -translate-x-1/2"
          style={{ background: "radial-gradient(circle, rgba(251,80,195,0.18) 0%, transparent 70%)" }} />
      </div>

      {/* ─── Subtle grid pattern overlay ─── */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(195,249,55,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(195,249,55,0.3) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ─── Floating pixel accents ─── */}
      <motion.div
        className="absolute top-[15%] right-[12%] hidden lg:block"
        animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/assets/icons/pixel/pixel-2-pink.png" alt="" width={24} height={24} className="opacity-40" />
      </motion.div>
      <motion.div
        className="absolute bottom-[20%] left-[8%] hidden lg:block"
        animate={{ y: [0, 10, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/assets/icons/pixel/pixel-1-volt.png" alt="" width={20} height={20} className="opacity-35" />
      </motion.div>
      <motion.div
        className="absolute top-[60%] right-[6%] hidden md:block"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image src="/assets/icons/pixel/pixel-3-white.png" alt="" width={16} height={16} className="opacity-25" />
      </motion.div>

      {/* ─── Main Content ─── */}
      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center">

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <Image
            src="/assets/logos/logo-white.png"
            alt="BUILDx"
            width={180}
            height={50}
            priority
            className="h-11 sm:h-14 w-auto object-contain"
            style={{ filter: "drop-shadow(0 0 30px rgba(195,249,55,0.2))" }}
          />
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-24 h-[2px] mb-8"
          style={{ background: "linear-gradient(90deg, transparent, #c3f937, #fb50c3, transparent)" }}
        />

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="mb-5"
          style={{ fontFamily: "var(--font-news-almstqbl)" }}
        >
          <span className="block text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1]"
            style={{ color: "var(--buildx-text)" }}>
            اكتشف{" "}
            <span className="relative inline-block">
              <span style={{ color: "var(--buildx-lime)" }}>فريقك</span>
              <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                style={{ background: "linear-gradient(90deg, var(--buildx-lime), transparent)" }} />
            </span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg sm:text-xl leading-relaxed max-w-lg mb-4"
          style={{ fontFamily: "var(--font-janna)", color: "rgba(231,237,253,0.75)" }}
        >
          تعرّف على أعضاء فريقك، خبراتهم، وابدؤوا رحلة البناء معًا.
        </motion.p>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-6 mb-10"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: "var(--buildx-lime)", boxShadow: "0 0 8px var(--buildx-lime)" }} />
            <span className="text-sm" style={{ fontFamily: "var(--font-arapix)", color: "rgba(231,237,253,0.6)" }}>
              8 فرق
            </span>
          </div>
          <div className="w-px h-4" style={{ backgroundColor: "rgba(231,237,253,0.15)" }} />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: "var(--buildx-pink)", boxShadow: "0 0 8px var(--buildx-pink)" }} />
            <span className="text-sm" style={{ fontFamily: "var(--font-arapix)", color: "rgba(231,237,253,0.6)" }}>
              32 مشارك
            </span>
          </div>
          <div className="w-px h-4" style={{ backgroundColor: "rgba(231,237,253,0.15)" }} />
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: "#823419", boxShadow: "0 0 8px #823419" }} />
            <span className="text-sm" style={{ fontFamily: "var(--font-arapix)", color: "rgba(231,237,253,0.6)" }}>
              رحلة البناء
            </span>
          </div>
        </motion.div>

        {/* ─── Premium Search Bar ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="w-full max-w-xl"
        >
          <div className="relative group">
            {/* Outer glow ring on focus */}
            <div className="absolute -inset-[2px] rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"
              style={{ background: "linear-gradient(135deg, rgba(195,249,55,0.3), rgba(251,80,195,0.2), rgba(195,249,55,0.15))" }} />

            <div className="relative flex items-center rounded-2xl overflow-hidden"
              style={{ backgroundColor: "var(--buildx-surface)", border: "1px solid var(--buildx-border)" }}>

              {/* Search icon */}
              <div className="absolute right-5 pointer-events-none">
                <svg className="w-5 h-5" fill="none" stroke="rgba(231,237,253,0.4)" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="ابحث باسمك أو اسم زميلك..."
                className="w-full pr-14 pl-14 py-4 sm:py-5 bg-transparent text-sm sm:text-base outline-none placeholder:text-white/30"
                style={{ fontFamily: "var(--font-janna)", color: "var(--buildx-text)" }}
              />

              {searchQuery && (
                <button
                  onClick={onClearSearch}
                  className="absolute left-4 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 cursor-pointer"
                  style={{ backgroundColor: "rgba(231,237,253,0.08)", color: "rgba(231,237,253,0.6)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(231,237,253,0.15)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(231,237,253,0.08)"; e.currentTarget.style.color = "rgba(231,237,253,0.6)"; }}
                  aria-label="مسح البحث"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Not found message */}
          {searchPerformed && !hasSearchResults && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 py-3 px-5 rounded-xl text-center text-sm"
              style={{
                fontFamily: "var(--font-janna)",
                backgroundColor: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "rgba(252,165,165,0.9)",
              }}
            >
              لم نجد الاسم ضمن توزيع الفرق الحالي. تأكد من كتابة الاسم بشكل صحيح.
            </motion.div>
          )}
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-12"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-[11px]" style={{ fontFamily: "var(--font-arapix)", color: "rgba(231,237,253,0.35)" }}>
              مرّر للأسفل
            </span>
            <svg className="w-4 h-4" fill="none" stroke="rgba(231,237,253,0.3)" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
