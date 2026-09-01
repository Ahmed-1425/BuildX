"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";
import CharacterState from "./CharacterState";
import PixelDecoration from "./PixelDecoration";

export default function VibeCodingSection() {
  const { t, locale } = useLanguage();
  const { ref, hasBeenInView } = useInView();

  return (
    <section id="about" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section: What is BUILDx */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h2
            className="text-3xl sm:text-4xl text-light mb-8 text-center"
            style={{ fontFamily: locale === "ar" ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
          >
            {t.about.title}
          </h2>

          <div className="pixel-card p-6 sm:p-8">
            <p
              className="text-base sm:text-lg text-light/80 leading-relaxed mb-4"
              style={{ fontFamily: "var(--font-janna)" }}
            >
              {t.about.description}
            </p>
            <p
              className="text-base sm:text-lg text-light/80 leading-relaxed"
              style={{ fontFamily: "var(--font-janna)" }}
            >
              {t.about.description2}
            </p>
          </div>
        </motion.div>

        {/* Divider */}
        <div className="section-divider mb-20" />

        {/* Section: What is Vibe Coding */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2
            className="text-3xl sm:text-4xl text-light mb-8 text-center"
            style={{ fontFamily: locale === "ar" ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
          >
            {t.vibeCoding.title}
          </h2>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Characters progression */}
            <div className="flex lg:flex-col items-center gap-4 mx-auto lg:mx-0 flex-shrink-0">
              <div className="flex flex-col items-center">
                <CharacterState state="thinking" size={80} />
                <span className="text-[10px] text-light/40 mt-1" style={{ fontFamily: "var(--font-arapix)" }}>
                  {locale === "ar" ? "فكّر" : "Think"}
                </span>
              </div>
              <div className="w-8 h-0.5 lg:w-0.5 lg:h-8 bg-primary/40" />
              <div className="flex flex-col items-center">
                <CharacterState state="building" size={80} />
                <span className="text-[10px] text-light/40 mt-1" style={{ fontFamily: "var(--font-arapix)" }}>
                  {locale === "ar" ? "ابنِ" : "Build"}
                </span>
              </div>
              <div className="w-8 h-0.5 lg:w-0.5 lg:h-8 bg-primary/40" />
              <div className="flex flex-col items-center">
                <CharacterState state="success" size={80} />
                <span className="text-[10px] text-lime/60 mt-1" style={{ fontFamily: "var(--font-arapix)" }}>
                  {locale === "ar" ? "نجاح" : "Success"}
                </span>
              </div>
            </div>

            {/* Text content */}
            <div className="flex-1">
              <div className="pixel-card p-6 sm:p-8 mb-4">
                <p
                  className="text-base sm:text-lg text-light/80 leading-relaxed"
                  style={{ fontFamily: "var(--font-janna)" }}
                >
                  {t.vibeCoding.p1}
                </p>
              </div>
              <div className="pixel-card p-6 sm:p-8">
                <p
                  className="text-base sm:text-lg text-light/80 leading-relaxed"
                  style={{ fontFamily: "var(--font-janna)" }}
                >
                  {t.vibeCoding.p2}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pixel decorations */}
      <div className="absolute top-16 right-8 hidden lg:block">
        <PixelDecoration variant="2" color="volt" size={24} opacity={0.15} />
      </div>
      <div className="absolute bottom-16 left-8 hidden lg:block">
        <PixelDecoration variant="3" color="pink" size={28} opacity={0.12} />
      </div>
    </section>
  );
}
