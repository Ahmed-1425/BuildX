"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";

export default function TargetAudienceSection() {
  const { t, locale } = useLanguage();
  const { ref, hasBeenInView } = useInView();

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-15" />

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
        >
          <h2
            className="text-3xl sm:text-4xl text-center text-light mb-6"
            style={{ fontFamily: locale === "ar" ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
          >
            {t.targetAudience.title}
          </h2>

          <p
            className="text-base sm:text-lg text-center text-light/70 max-w-3xl mx-auto mb-10"
            style={{ fontFamily: "var(--font-janna)" }}
          >
            {t.targetAudience.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {t.targetAudience.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
              className="pixel-card p-5 flex items-start gap-3 group hover:border-pink/40 transition-colors"
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 border-pink/40 bg-pink/10 text-pink text-sm"
                style={{ fontFamily: "var(--font-arapix)" }}
              >
                {(i + 1).toString().padStart(2, "0")}
              </div>
              <p
                className="text-sm text-light/80 leading-relaxed pt-1"
                style={{ fontFamily: "var(--font-janna)" }}
              >
                {item}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
