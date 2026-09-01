"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";
import CharacterState from "./CharacterState";
import Image from "next/image";

export default function OutcomesSection() {
  const { t, locale } = useLanguage();
  const { ref, hasBeenInView } = useInView();

  return (
    <section id="outcomes" className="relative py-20 overflow-hidden">
      {/* Collage background */}
      <div className="absolute inset-0">
        <Image
          src="/assets/side/collage.png"
          alt=""
          fill
          className="object-cover"
          style={{ opacity: 0.3 }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-dark/80" />
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl sm:text-4xl text-light mb-4"
            style={{ fontFamily: locale === "ar" ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
          >
            {t.outcomes.title}
          </h2>
          <CharacterState state="success" size={64} className="mx-auto" />
        </motion.div>

        {/* Achievement unlocks */}
        <div className="space-y-4">
          {t.outcomes.items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: locale === "ar" ? 40 : -40 }}
              animate={hasBeenInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="flex items-start gap-4 pixel-card p-4 sm:p-5 group"
            >
              {/* Achievement badge */}
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center border-2 border-lime/40 bg-lime/10">
                <span
                  className="text-lime text-lg"
                  style={{ fontFamily: "var(--font-arapix)" }}
                >
                  {"✓"}
                </span>
              </div>

              <p
                className="text-base text-light/80 leading-relaxed pt-2"
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
