"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";
import PixelDecoration from "./PixelDecoration";

const PUZZLE_COLORS = [
  "border-lime/50",
  "border-pink/50",
  "border-primary/60",
  "border-lime/40",
  "border-pink/40",
  "border-primary/50",
];

const PUZZLE_ACCENTS = [
  "bg-lime/10",
  "bg-pink/10",
  "bg-primary/20",
  "bg-lime/8",
  "bg-pink/8",
  "bg-primary/15",
];

export default function ObjectivesSection() {
  const { t, locale } = useLanguage();
  const { ref, hasBeenInView } = useInView();

  return (
    <section id="objectives" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-15" />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl sm:text-4xl text-center text-light mb-12"
          style={{ fontFamily: locale === "ar" ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
        >
          {t.objectives.title}
        </motion.h2>

        {/* Puzzle grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {t.objectives.items.map((obj, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={hasBeenInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`relative border-3 ${PUZZLE_COLORS[i]} ${PUZZLE_ACCENTS[i]} p-6 sm:p-8 group hover:bg-primary/10 transition-all duration-300`}
            >
              {/* Puzzle connector notches */}
              {/* Right notch for odd columns */}
              {i % 3 !== 2 && (
                <div className="absolute top-1/2 -right-2 w-4 h-8 bg-dark border-3 border-primary/30 -translate-y-1/2 hidden lg:block z-10" />
              )}
              {/* Bottom notch for top row */}
              {i < 3 && (
                <div className="absolute -bottom-2 left-1/2 w-8 h-4 bg-dark border-3 border-primary/30 -translate-x-1/2 hidden lg:block z-10" />
              )}

              {/* Number badge */}
              <div
                className="w-10 h-10 flex items-center justify-center border-2 border-lime/40 bg-dark mb-4 text-lime text-lg"
                style={{ fontFamily: "var(--font-arapix)" }}
              >
                {(i + 1).toString().padStart(2, "0")}
              </div>

              <h3
                className="text-lg text-lime mb-3"
                style={{ fontFamily: "var(--font-janna-bold)" }}
              >
                {obj.title}
              </h3>

              <p
                className="text-sm text-light/70 leading-relaxed"
                style={{ fontFamily: "var(--font-janna)" }}
              >
                {obj.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pixel accents */}
      <div className="absolute top-10 left-6 hidden lg:block">
        <PixelDecoration variant="1" color="volt" size={20} opacity={0.15} />
      </div>
      <div className="absolute bottom-10 right-6 hidden lg:block">
        <PixelDecoration variant="2" color="pink" size={20} opacity={0.12} />
      </div>
    </section>
  );
}
