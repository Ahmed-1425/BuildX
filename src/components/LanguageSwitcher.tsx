"use client";

import { useLanguage } from "@/context/LanguageContext";
import { motion } from "framer-motion";

export default function LanguageSwitcher() {
  const { locale, setLocale, dir } = useLanguage();

  return (
    <div
      className="language-switch"
      role="group"
      aria-label={locale === "ar" ? "تغيير اللغة" : "Switch Language"}
      style={{
        position: "relative",
        display: "inline-grid",
        gridTemplateColumns: "1fr 1fr",
        width: "112px",
        height: "46px",
        padding: "4px",
        backgroundColor: "#0c1018",
        border: "2px solid #823419",
        boxShadow: "4px 4px 0 #34155f",
        overflow: "hidden",
        direction: "ltr", // keep LTR for consistent internal pill sliding
      }}
    >
      {/* Sliding background indicator */}
      <motion.div
        className="language-indicator"
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        style={{
          position: "absolute",
          top: "4px",
          bottom: "4px",
          left: locale === "ar" ? "4px" : "calc(50% + 2px)",
          width: "calc(50% - 6px)",
          backgroundColor: "#c3f937",
          zIndex: 0,
        }}
      />

      <button
        type="button"
        onClick={() => setLocale("ar")}
        className={`language-option ${locale === "ar" ? "active" : ""}`}
        aria-pressed={locale === "ar"}
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          placeItems: "center",
          border: 0,
          background: "transparent",
          color: locale === "ar" ? "#0c1018" : "#e7edfd",
          fontSize: "15px",
          fontWeight: 800,
          cursor: "pointer",
          transition: "color 150ms ease",
          fontFamily: "var(--font-janna-bold), sans-serif",
        }}
      >
        ع
      </button>

      <button
        type="button"
        onClick={() => setLocale("en")}
        className={`language-option ${locale === "en" ? "active" : ""}`}
        aria-pressed={locale === "en"}
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          placeItems: "center",
          border: 0,
          background: "transparent",
          color: locale === "en" ? "#0c1018" : "#e7edfd",
          fontSize: "14px",
          fontWeight: 800,
          cursor: "pointer",
          transition: "color 150ms ease",
          fontFamily: "var(--font-bauhaus), sans-serif",
        }}
      >
        EN
      </button>
    </div>
  );
}
