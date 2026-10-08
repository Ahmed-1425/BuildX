"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import type { BuildxEdition } from "@/data/graduates";
import { getGraduatesCount } from "@/data/graduates";

export default function GraduatesHero({ edition }: { edition: BuildxEdition }) {
  const { t, locale } = useLanguage();
  const h = t.graduatesPage.hero;
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  const graduates = getGraduatesCount(edition);

  return (
    <section className="gr-hero" aria-labelledby="gr-title">
      <div className="gr-container gr-hero__inner">
        <div className="gr-hero__side gr-hero__side--a" aria-hidden="true">
          <Image src="/assets/characters/success.png" alt="" width={150} height={156} className="gr-char gr-char--1" priority />
          <Image src="/assets/characters/building.png" alt="" width={120} height={125} className="gr-char gr-char--2" />
        </div>

        <div className="gr-hero__content">
          <motion.div {...rise(0)} className="gr-hero__logo">
            <Image
              src="/assets/logos/logo-white-glow.png"
              alt="BUILDx"
              width={220}
              height={63}
              priority
            />
          </motion.div>

          <motion.p {...rise(0.08)} className="gr-eyebrow" dir="ltr">
            BUILT HERE. GROWING EVERYWHERE.
          </motion.p>

          <motion.h1 {...rise(0.16)} id="gr-title" className="gr-hero__title">
            <span className="gr-hero__kicker">{h.kicker}</span>
            <span className="gr-hero__headline">
              {h.headlineLead}{" "}
              <span className="gr-hl">{h.headlineHighlight}</span>
            </span>
          </motion.h1>

          <motion.p {...rise(0.26)} className="gr-hero__desc">
            {h.description}
          </motion.p>

          <motion.ul
            {...rise(0.36)}
            className="gr-hero__stats"
            aria-label={locale === "ar" ? "أرقام النسخة الأولى" : "Edition 1 Statistics"}
          >
            <li>
              <strong>{edition.teams.length}</strong>
              <span>{h.teamsCount}</span>
            </li>
            <li>
              <strong>{graduates}</strong>
              <span>{h.graduatesCount}</span>
            </li>
            <li>
              <strong>{edition.awards.length}</strong>
              <span>{h.awardsCount}</span>
            </li>
          </motion.ul>
        </div>

        <div className="gr-hero__side gr-hero__side--b" aria-hidden="true">
          <Image src="/assets/characters/thinking.png" alt="" width={140} height={146} className="gr-char gr-char--3" />
          <Image src="/assets/characters/ready.png" alt="" width={120} height={125} className="gr-char gr-char--4" />
        </div>
      </div>
    </section>
  );
}
