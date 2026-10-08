"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { BuildxEdition } from "@/data/graduates";

export default function GraduatesClosing({ edition }: { edition: BuildxEdition }) {
  const { t, locale } = useLanguage();
  const isEn = locale === "en";
  const reduce = useReducedMotion();
  const copy = edition.copy;
  if (!copy) return null;

  const title = isEn ? copy.closingTitleEn : copy.closingTitle;
  const text = isEn ? copy.closingTextEn : copy.closingText;
  const btnLabel = t.graduatesPage.closing.button;

  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 36 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.3 },
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <section className="gr-closing" aria-labelledby="gr-closing-title">
      <div className="gr-container">
        <motion.div className="gr-closing__card" {...reveal}>
          <div className="gr-closing__chars" aria-hidden="true">
            <Image src="/assets/characters/success.png" alt="" width={110} height={114} className="gr-char gr-char--1" />
            <Image src="/assets/characters/ready.png" alt="" width={96} height={100} className="gr-char gr-char--2" />
            <Image src="/assets/characters/building.png" alt="" width={104} height={108} className="gr-char gr-char--3" />
          </div>

          <p className="gr-eyebrow" dir="ltr">{copy.closingEnglish}</p>
          <h2 id="gr-closing-title" className="gr-closing__title">
            {title}
          </h2>
          <p className="gr-section-desc">{text}</p>

          <Link href="/" className="gr-btn gr-btn--solid">
            {btnLabel} <ArrowLeft size={18} className="gr-btn__arrow" aria-hidden="true" />
          </Link>

          <div className="gr-closing__pixels" aria-hidden="true">
            <Image src="/assets/icons/pixel/pixel-1-volt.png" alt="" width={18} height={18} />
            <Image src="/assets/icons/pixel/pixel-2-pink.png" alt="" width={18} height={18} />
            <Image src="/assets/icons/pixel/pixel-3-white.png" alt="" width={18} height={18} />
            <Image src="/assets/icons/pixel/pixel-1-yellow.png" alt="" width={18} height={18} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
