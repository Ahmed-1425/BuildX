"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FinalCTA() {
  const { t, locale } = useLanguage();
  const { ref, hasBeenInView } = useInView();
  const [showTransition, setShowTransition] = useState(false);
  const router = useRouter();

  const handleRegister = () => {
    setShowTransition(true);
    setTimeout(() => {
      router.push("/register");
    }, 1200);
  };

  return (
    <>
      <section className="relative py-24 overflow-hidden" id="register">
        {/* Keyboard background */}
        <div className="absolute inset-0">
          <Image
            src="/assets/side/keyboard.png"
            alt=""
            fill
            className="object-cover"
            style={{ opacity: 0.25 }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/85 to-dark/90" />
        </div>

        <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl text-light mb-6"
              style={{ fontFamily: locale === "ar" ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
            >
              {t.finalCta.title}
            </h2>

            <p
              className="text-lg sm:text-xl text-light/70 mb-10"
              style={{ fontFamily: "var(--font-janna)" }}
            >
              {t.finalCta.description}
            </p>

            <button
              onClick={handleRegister}
              className="pixel-btn pixel-btn-primary text-lg py-4 px-10"
            >
              {t.finalCta.button}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Registration transition overlay */}
      <AnimatePresence>
        {showTransition && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center bg-dark/95"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="flex flex-col items-center"
            >
              <Image
                src="/assets/side/impact-makers.png"
                alt="BUILDx"
                width={200}
                height={200}
                className="object-contain mb-4"
              />
              <Image
                src="/assets/icons/loading-99.png"
                alt=""
                width={48}
                height={48}
                className="object-contain animate-spin"
                aria-hidden="true"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
