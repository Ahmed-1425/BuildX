"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";
import { useCountUp } from "@/hooks/useCountUp";
import Image from "next/image";

export default function TrainerSection() {
  const { t, locale } = useLanguage();
  const { ref, hasBeenInView } = useInView();
  const [showMore, setShowMore] = useState(false);

  const projects = useCountUp(32, 2000, hasBeenInView);
  const achievements = useCountUp(8, 1500, hasBeenInView);

  const stats = [
    { value: `+${projects}`, label: t.trainer.stats.projects },
    { value: `${achievements}`, label: t.trainer.stats.achievements },
    { value: locale === "ar" ? "٢" : "2", label: t.trainer.stats.awards },
    { value: "Top 50", label: t.trainer.stats.top50 },
  ];

  return (
    <section id="trainer" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-secondary/8 to-dark" />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          className="text-3xl sm:text-4xl text-center text-light mb-12"
          style={{ fontFamily: locale === "ar" ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
        >
          {t.trainer.sectionTitle}
        </motion.h2>

        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={hasBeenInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="flex-shrink-0 order-1 lg:order-none"
          >
            <div className="relative w-64 h-80 sm:w-72 sm:h-96">
              <Image
                src="/assets/trainer/ahmed-alrasheed.png"
                alt={t.trainer.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 256px, 288px"
                priority
              />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex-1 order-2 lg:order-none"
          >
            {/* Name */}
            <h3
              className="text-2xl sm:text-3xl text-light mb-2"
              style={{ fontFamily: "var(--font-janna-bold)" }}
            >
              {t.trainer.name}
            </h3>

            {/* Title */}
            <p
              className="text-sm text-lime/80 mb-6 leading-relaxed"
              style={{ fontFamily: "var(--font-janna)" }}
            >
              {t.trainer.title}
            </p>

            {/* Bio */}
            <p
              className="text-base text-light/75 leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-janna)" }}
            >
              {t.trainer.bio}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="pixel-card p-3 text-center"
                >
                  <div
                    className="text-xl sm:text-2xl text-lime mb-1"
                    style={{ fontFamily: "var(--font-arapix)" }}
                  >
                    {stat.value}
                  </div>
                  <div
                    className="text-[10px] text-light/50"
                    style={{ fontFamily: "var(--font-janna)" }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Visit Profile button */}
            <a
              href="https://ahmedalrasheed.com"
              target="_blank"
              rel="noopener noreferrer"
              className="pixel-btn pixel-btn-primary text-sm py-2 px-6 mb-4 inline-block"
            >
              {t.trainer.visitProfile}
            </a>

            {/* Accordion: More about trainer */}
            <div className="mt-6">
              <button
                onClick={() => setShowMore(!showMore)}
                className="flex items-center gap-2 text-light/60 hover:text-light transition-colors cursor-pointer group"
                aria-expanded={showMore}
                style={{ fontFamily: "var(--font-janna-bold)" }}
              >
                <span className="text-sm">{t.trainer.moreAbout}</span>
                <motion.span
                  animate={{ rotate: showMore ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-lime"
                >
                  ▼
                </motion.span>
              </button>

              <AnimatePresence>
                {showMore && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 space-y-6">
                      {/* Programs */}
                      <div>
                        <h4
                          className="text-sm text-pink mb-3"
                          style={{ fontFamily: "var(--font-janna-bold)" }}
                        >
                          {t.trainer.programs}
                        </h4>
                        <ul className="space-y-2">
                          {t.trainer.programsList.map((prog, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-light/60"
                              style={{ fontFamily: "var(--font-janna)" }}
                            >
                              <span className="text-lime mt-1 flex-shrink-0">{"▸"}</span>
                              {prog}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Experience */}
                      <div>
                        <h4
                          className="text-sm text-pink mb-3"
                          style={{ fontFamily: "var(--font-janna-bold)" }}
                        >
                          {t.trainer.experience}
                        </h4>
                        <ul className="space-y-2">
                          {t.trainer.experienceList.map((exp, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-light/60"
                              style={{ fontFamily: "var(--font-janna)" }}
                            >
                              <span className="text-lime mt-1 flex-shrink-0">{"▸"}</span>
                              {exp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
