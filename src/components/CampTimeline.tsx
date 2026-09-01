"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";
import CharacterState, { CharacterType } from "./CharacterState";
import PixelDecoration from "./PixelDecoration";

const DAY_CHARACTERS: CharacterType[] = [
  "ready",
  "thinking",
  "building",
  "building",
  "success",
  "loading",
  "ready",
  "building",
  "success",
];

const DAY_PHASES: ("training" | "break" | "hackathon" | "closing")[] = [
  "training",
  "training",
  "training",
  "training",
  "training",
  "break",
  "hackathon",
  "hackathon",
  "closing",
];

const PHASE_COLORS = {
  training: "border-lime/50 bg-lime/5",
  break: "border-light/20 bg-light/5",
  hackathon: "border-pink/50 bg-pink/5",
  closing: "border-lime/60 bg-lime/8",
};

const PHASE_DOT_COLORS = {
  training: "bg-lime",
  break: "bg-light/40",
  hackathon: "bg-pink",
  closing: "bg-lime",
};

export default function CampTimeline() {
  const { t, locale } = useLanguage();
  const { ref, hasBeenInView } = useInView();
  const [activeDay, setActiveDay] = useState<number | null>(null);

  return (
    <section id="journey" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-10" />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl sm:text-4xl text-center text-light mb-6"
          style={{ fontFamily: locale === "ar" ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
        >
          {t.timeline.title}
        </motion.h2>

        {/* Phase indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={hasBeenInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-12"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-lime" />
            <span className="text-sm text-light/70" style={{ fontFamily: "var(--font-janna)" }}>
              {t.timeline.trainingPhase} ({t.timeline.trainingDates})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-pink" />
            <span className="text-sm text-light/70" style={{ fontFamily: "var(--font-janna)" }}>
              {t.timeline.hackathonPhase} ({t.timeline.hackathonDates})
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-lime border border-lime" />
            <span className="text-sm text-light/70" style={{ fontFamily: "var(--font-janna)" }}>
              {t.timeline.closingPhase} ({t.timeline.closingDate})
            </span>
          </div>
        </motion.div>

        {/* Desktop Timeline - zigzag path */}
        <div className="hidden lg:block">
          <div className="relative">
            {t.timeline.days.map((day, i) => {
              const isEven = i % 2 === 0;
              const phase = DAY_PHASES[i];
              const isActive = activeDay === i;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
                  className={`relative flex items-start mb-4 ${
                    isEven ? "justify-start" : "justify-end"
                  }`}
                >
                  {/* Connecting line */}
                  {i < t.timeline.days.length - 1 && (
                    <div
                      className={`absolute top-12 ${
                        isEven ? "left-[50%]" : "right-[50%]"
                      } w-px h-16 bg-gradient-to-b ${
                        phase === "hackathon"
                          ? "from-pink/40 to-pink/20"
                          : "from-lime/40 to-lime/20"
                      }`}
                    />
                  )}

                  {/* Card */}
                  <button
                    onClick={() => setActiveDay(isActive ? null : i)}
                    className={`w-[48%] cursor-pointer text-start ${
                      locale === "ar" ? "text-right" : "text-left"
                    }`}
                    aria-expanded={isActive}
                  >
                    <div
                      className={`pixel-card p-5 transition-all duration-300 ${
                        PHASE_COLORS[phase]
                      } ${isActive ? "border-lime" : ""}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {/* Level dot */}
                        <div
                          className={`w-4 h-4 ${PHASE_DOT_COLORS[phase]} ${
                            isActive ? "animate-pulse" : ""
                          }`}
                        />
                        <span
                          className="text-xs text-light/50"
                          style={{ fontFamily: "var(--font-arapix)" }}
                        >
                          {day.date}
                        </span>
                        <span
                          className="text-xs text-light/40 border border-primary/30 px-2 py-0.5"
                          style={{ fontFamily: "var(--font-arapix)" }}
                        >
                          {day.label}
                        </span>
                      </div>

                      <h4
                        className="text-base text-light mb-1"
                        style={{ fontFamily: "var(--font-janna-bold)" }}
                      >
                        {day.title}
                      </h4>

                      <AnimatePresence>
                        {isActive && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="flex items-start gap-3 pt-3 border-t border-primary/20 mt-3">
                              <CharacterState
                                state={DAY_CHARACTERS[i]}
                                size={48}
                                animate={false}
                              />
                              <p
                                className="text-sm text-light/65 leading-relaxed"
                                style={{ fontFamily: "var(--font-janna)" }}
                              >
                                {day.description}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Mobile Timeline - vertical */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Vertical line */}
            <div
              className={`absolute top-0 bottom-0 w-0.5 bg-gradient-to-b from-lime/40 via-primary/30 to-pink/40 ${
                locale === "ar" ? "right-4" : "left-4"
              }`}
            />

            <div className="space-y-4">
              {t.timeline.days.map((day, i) => {
                const phase = DAY_PHASES[i];
                const isActive = activeDay === i;

                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: locale === "ar" ? 20 : -20 }}
                    animate={hasBeenInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                    className={`relative ${
                      locale === "ar" ? "pr-10" : "pl-10"
                    }`}
                  >
                    {/* Dot on line */}
                    <div
                      className={`absolute top-4 ${
                        locale === "ar" ? "right-2.5" : "left-2.5"
                      } w-3 h-3 ${PHASE_DOT_COLORS[phase]} border-2 border-dark z-10`}
                    />

                    <button
                      onClick={() => setActiveDay(isActive ? null : i)}
                      className={`w-full cursor-pointer text-start ${
                        locale === "ar" ? "text-right" : "text-left"
                      }`}
                      aria-expanded={isActive}
                    >
                      <div
                        className={`pixel-card p-4 transition-all duration-200 ${
                          PHASE_COLORS[phase]
                        } ${isActive ? "border-lime" : ""}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-[10px] text-light/50"
                            style={{ fontFamily: "var(--font-arapix)" }}
                          >
                            {day.date}
                          </span>
                          <span
                            className="text-[10px] text-light/40 border border-primary/30 px-1.5 py-0.5"
                            style={{ fontFamily: "var(--font-arapix)" }}
                          >
                            {day.label}
                          </span>
                        </div>

                        <h4
                          className="text-sm text-light"
                          style={{ fontFamily: "var(--font-janna-bold)" }}
                        >
                          {day.title}
                        </h4>

                        <AnimatePresence>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="pt-3 border-t border-primary/20 mt-2">
                                <div className="flex items-start gap-2">
                                  <CharacterState
                                    state={DAY_CHARACTERS[i]}
                                    size={36}
                                    animate={false}
                                  />
                                  <p
                                    className="text-xs text-light/60 leading-relaxed"
                                    style={{ fontFamily: "var(--font-janna)" }}
                                  >
                                    {day.description}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pixel decorations */}
      <div className="absolute top-20 left-6 hidden lg:block">
        <PixelDecoration variant="3" color="volt" size={28} opacity={0.12} animate />
      </div>
      <div className="absolute bottom-20 right-6 hidden lg:block">
        <PixelDecoration variant="1" color="pink" size={24} opacity={0.1} />
      </div>
    </section>
  );
}
