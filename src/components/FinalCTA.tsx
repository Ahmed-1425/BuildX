"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";
import Link from "next/link";

export default function FinalCTA() {
  const { t, locale } = useLanguage();
  const { ref, hasBeenInView } = useInView();
  const isRTL = locale === "ar";

  return (
    <section className="final-cta relative overflow-hidden" id="register">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46rem] h-[26rem] bg-pink/10 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute bottom-4 left-1/3 w-[34rem] h-[18rem] bg-lime/10 rounded-full blur-[150px] pointer-events-none" />

      <div ref={ref} className="final-cta__content relative z-10">
        {/* ======================================================== */}
        {/* 1. BUILDx Keyboard Image Stage (Centered, No Card Frame) */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 35, scale: 0.95 }}
          animate={hasBeenInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="keyboard-stage"
        >
          <motion.img
            src="/assets/final-cta/buildx-keyboard.png"
            alt={isRTL ? "أزرار BUILDx: جاهز للبناء" : "BUILDx Keycaps: Ready to Build"}
            className="w-full h-auto object-contain select-none pointer-events-none"
            initial={{ scale: 1 }}
            animate={hasBeenInView ? { scale: [1, 0.98, 1] } : {}}
            transition={{ duration: 0.6, delay: 0.65, ease: "easeInOut" }}
          />
        </motion.div>

        {/* ======================================================== */}
        {/* 2. Heading Directly Under Image                          */}
        {/* ======================================================== */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.2 }}
          style={{ fontFamily: isRTL ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
        >
          {t.finalCta.title}
        </motion.h2>

        {/* ======================================================== */}
        {/* 3. Styled Sentence with Highlighted Key Terms            */}
        {/* ======================================================== */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.3 }}
          style={{ fontFamily: "var(--font-janna)" }}
        >
          {isRTL ? (
            <>
              فكرتك هي <span className="text-light font-bold">البداية</span>.{" "}
              البرومبت <span className="text-pink font-bold">أداتك</span>.{" "}
              والمنتج هو <span className="text-lime font-bold">النتيجة</span>.
            </>
          ) : (
            <>
              Your idea is the <span className="text-light font-bold">beginning</span>.{" "}
              Your prompt is the <span className="text-pink font-bold">tool</span>.{" "}
              Your product is the <span className="text-lime font-bold">outcome</span>.
            </>
          )}
        </motion.p>

        {/* ======================================================== */}
        {/* 4. Prominent Game Level Registration Button              */}
        {/* ======================================================== */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.4 }}
        >
          <Link
            href="/register"
            className="final-cta__button"
            style={{ fontFamily: "var(--font-janna-bold)" }}
          >
            <span className="w-2 h-2 bg-dark rotate-45 shrink-0" />
            <span>{t.finalCta.button}</span>
            <span className="text-sm">◀</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
