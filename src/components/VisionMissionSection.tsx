"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";
import Image from "next/image";

export default function VisionMissionSection() {
  const { t, locale } = useLanguage();
  const { ref, hasBeenInView } = useInView();

  const valueIcons = [
    "/assets/icons/lamp.png",
    "/assets/icons/magic-wand.png",
    "/assets/icons/knowledge.png",
    "/assets/icons/handshake.png",
    "/assets/icons/growth.png",
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark-secondary/5 to-dark" />

      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Vision & Mission */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Vision */}
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? 30 : -30 }}
            animate={hasBeenInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="pixel-card p-6 sm:p-8 relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-lime/60 to-transparent" />
            <h3
              className="text-2xl sm:text-3xl text-lime mb-4"
              style={{ fontFamily: locale === "ar" ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
            >
              {t.vision.title}
            </h3>
            <p
              className="text-base text-light/80 leading-relaxed"
              style={{ fontFamily: "var(--font-janna)" }}
            >
              {t.vision.text}
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, x: locale === "ar" ? -30 : 30 }}
            animate={hasBeenInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="pixel-card p-6 sm:p-8 relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink/60 to-transparent" />
            <h3
              className="text-2xl sm:text-3xl text-pink mb-4"
              style={{ fontFamily: locale === "ar" ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
            >
              {t.mission.title}
            </h3>
            <p
              className="text-base text-light/80 leading-relaxed"
              style={{ fontFamily: "var(--font-janna)" }}
            >
              {t.mission.text}
            </p>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h3
            className="text-2xl sm:text-3xl text-center text-light mb-8"
            style={{ fontFamily: locale === "ar" ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
          >
            {t.values.title}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {t.values.items.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + i * 0.08, duration: 0.4 }}
                className="pixel-card p-5 text-center group hover:border-lime/40 transition-colors"
              >
                <div className="mb-3 flex justify-center">
                  <Image
                    src={valueIcons[i]}
                    alt={value.name}
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <h4
                  className="text-sm text-lime mb-2"
                  style={{ fontFamily: "var(--font-janna-bold)" }}
                >
                  {value.name}
                </h4>
                <p
                  className="text-xs text-light/60 leading-relaxed"
                  style={{ fontFamily: "var(--font-janna)" }}
                >
                  {value.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
