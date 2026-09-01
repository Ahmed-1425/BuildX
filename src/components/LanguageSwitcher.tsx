"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const { locale, toggleLocale } = useLanguage();

  return (
    <button
      onClick={toggleLocale}
      className="relative flex items-center h-9 rounded-none border-2 border-primary/60 bg-dark-secondary/30 overflow-hidden cursor-pointer group focus-visible:outline-2 focus-visible:outline-lime"
      aria-label={locale === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      role="switch"
      aria-checked={locale === "en"}
    >
      {/* Sliding indicator */}
      <motion.div
        className="absolute top-0 h-full w-1/2 bg-primary/60"
        animate={{
          x: locale === "ar" ? 0 : "100%",
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{ [locale === "ar" ? "left" : "left"]: 0 }}
      />

      {/* Arabic label */}
      <span
        className={`relative z-10 px-3 text-sm font-bold transition-colors duration-200 ${
          locale === "ar" ? "text-lime" : "text-light/50"
        }`}
        style={{ fontFamily: "var(--font-janna-bold)" }}
      >
        العربية
      </span>

      {/* Divider */}
      <div className="relative z-10 w-px h-5 bg-primary/40" />

      {/* English label */}
      <span
        className={`relative z-10 px-3 text-sm font-bold transition-colors duration-200 ${
          locale === "en" ? "text-lime" : "text-light/50"
        }`}
        style={{ fontFamily: "var(--font-bauhaus)" }}
      >
        EN
      </span>

      {/* Pixel corner accents */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-lime/40" />
      <div className="absolute top-0 right-0 w-1 h-1 bg-lime/40" />
      <div className="absolute bottom-0 left-0 w-1 h-1 bg-lime/40" />
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-lime/40" />
    </button>
  );
}
