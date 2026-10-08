"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Crown, Medal } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { Award, BuildxEdition } from "@/data/graduates";
import AwardPhoto from "./AwardPhoto";
import { AwardGlyph } from "./icons";
import { prefersReducedMotion } from "./utils";

type Props = {
  edition: BuildxEdition;
  onMeetTeam: (teamNumber: number) => void;
};

export default function WinnersSection({ edition, onMeetTeam }: Props) {
  const { t, locale } = useLanguage();
  const wTrans = t.graduatesPage.winners;
  const reduce = useReducedMotion();
  const places = edition.awards.filter((a) => a.kind === "place").sort((a, b) => (a.rank ?? 9) - (b.rank ?? 9));
  const categories = edition.awards.filter((a) => a.kind === "category");
  const headRef = useRef<HTMLDivElement>(null);
  const celebrated = useRef(false);

  // One light pixel-confetti burst, once, when the winners section first appears.
  useEffect(() => {
    const el = headRef.current;
    if (!el || celebrated.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting) || celebrated.current) return;
        celebrated.current = true;
        io.disconnect();
        if (prefersReducedMotion()) return;
        import("canvas-confetti").then(({ default: confetti }) => {
          const base = {
            shapes: ["square" as const],
            colors: ["#c3f937", "#fb50c3", "#e7edfd", "#823419"],
            scalar: 0.9,
            gravity: 0.9,
            ticks: 140,
            disableForReducedMotion: true,
            zIndex: 5,
          };
          confetti({ ...base, particleCount: 36, angle: 60, spread: 55, origin: { x: 0, y: 0.35 } });
          confetti({ ...base, particleCount: 36, angle: 120, spread: 55, origin: { x: 1, y: 0.35 } });
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reveal = (delay = 0, y = 36) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.2 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  // Podium reveal order: 3rd → 2nd → 1st
  const podiumDelay = (rank?: number) => (rank === 1 ? 0.35 : rank === 2 ? 0.18 : 0);

  return (
    <section id="winners" className="gr-winners" aria-labelledby="gr-winners-title" tabIndex={-1}>
      <div className="gr-container">
        <div ref={headRef} className="gr-section-head">
          <p className="gr-eyebrow" dir="ltr">{wTrans.eyebrow}</p>
          <h2 id="gr-winners-title" className="gr-section-title">
            {wTrans.titleLead} <span className="gr-hl">{wTrans.titleHighlight}</span>
          </h2>
          <p className="gr-section-desc">{wTrans.description}</p>
        </div>

        <h3 className="gr-sr-only">
          {locale === "ar" ? "المراكز الثلاثة الأولى" : "Top Three Places"}
        </h3>
        <div className="gr-podium">
          {places.map((award) => {
            const title = locale === "en" ? award.titleEn : award.title;
            const teamLabel = locale === "en" ? `Team ${award.teamNumber}` : `الفريق ${award.teamNumber}`;
            const pedestal = award.rank ? wTrans.pedestalRanks[award.rank as 1 | 2 | 3] : "";
            return (
              <motion.article
                key={award.id}
                className={`gr-podium__item gr-podium__item--${award.rank}`}
                {...reveal(podiumDelay(award.rank), 56)}
              >
                <div className="gr-pcard">
                  <div className="gr-pcard__top">
                    <span className="gr-rank" aria-hidden="true">
                      {award.rank === 1 ? <Crown size={18} /> : <Medal size={18} />}
                      <b>{award.rank}</b>
                    </span>
                    <span className="gr-team-pill">TEAM {award.teamNumber}</span>
                  </div>
                  <AwardPhoto
                    award={award}
                    priority={award.rank === 1}
                    sizes="(min-width: 1024px) 40vw, (min-width: 640px) 50vw, 100vw"
                  />
                  <div className="gr-pcard__body">
                    <h4 className="gr-pcard__title">{title}</h4>
                    <p className="gr-pcard__team">{teamLabel}</p>
                    <button
                      type="button"
                      className="gr-btn"
                      onClick={() => onMeetTeam(award.teamNumber)}
                      aria-label={
                        locale === "ar"
                          ? `تعرّف على الفريق ${award.teamNumber} — ${title}`
                          : `Meet Team ${award.teamNumber} — ${title}`
                      }
                    >
                      {wTrans.meetTeam} <ArrowLeft size={18} className="gr-btn__arrow" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="gr-pedestal" aria-hidden="true">
                  <span>{award.rank}</span>
                  <small>{pedestal}</small>
                </div>
              </motion.article>
            );
          })}
        </div>

        {categories.length > 0 && (
          <div className="gr-categories">
            <motion.div className="gr-section-head gr-section-head--sub" {...reveal(0, 24)}>
              <h3 className="gr-subtitle">{wTrans.categoryAwardsTitle}</h3>
              <span className="gr-subtitle__bar" aria-hidden="true" />
            </motion.div>

            <div className="gr-categories__grid">
              {categories.map((award, i) => (
                <CategoryCard
                  key={award.id}
                  award={award}
                  reveal={reveal((i % 3) * 0.1, 32)}
                  onMeetTeam={onMeetTeam}
                  meetLabel={wTrans.meetTeam}
                  locale={locale}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function CategoryCard({
  award,
  reveal,
  onMeetTeam,
  meetLabel,
  locale,
}: {
  award: Award;
  reveal: object;
  onMeetTeam: (teamNumber: number) => void;
  meetLabel: string;
  locale: "ar" | "en";
}) {
  const title = locale === "en" ? award.titleEn : award.title;
  const teamLabel = locale === "en" ? `Team ${award.teamNumber}` : `الفريق ${award.teamNumber}`;

  return (
    <motion.article className="gr-ccard" {...reveal}>
      <AwardPhoto award={award} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
      <div className="gr-ccard__body">
        <div className="gr-ccard__row">
          <span className="gr-ccard__icon">
            <AwardGlyph icon={award.icon} />
          </span>
          <span className="gr-team-pill">TEAM {award.teamNumber}</span>
        </div>
        <h4 className="gr-ccard__title">{title}</h4>
        <p className="gr-pcard__team">{teamLabel}</p>
        <button
          type="button"
          className="gr-btn gr-btn--ghost"
          onClick={() => onMeetTeam(award.teamNumber)}
          aria-label={
            locale === "ar"
              ? `تعرّف على الفريق ${award.teamNumber} — ${title}`
              : `Meet Team ${award.teamNumber} — ${title}`
          }
        >
          {meetLabel} <ArrowLeft size={18} className="gr-btn__arrow" aria-hidden="true" />
        </button>
      </div>
    </motion.article>
  );
}
