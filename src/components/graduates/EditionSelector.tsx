"use client";

import { Check, Clock } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import type { BuildxEdition } from "@/data/graduates";

type Props = {
  editions: BuildxEdition[];
  selectedId: string;
  peekId: string | null;
  onSelect: (edition: BuildxEdition) => void;
};

export default function EditionSelector({ editions, selectedId, peekId, onSelect }: Props) {
  const { t, locale } = useLanguage();
  const eTrans = t.graduatesPage.edition;
  const peeked = editions.find((e) => e.id === peekId);

  const getEditionNotice = (ed: BuildxEdition) => {
    const label = locale === "en" ? ed.labelEn : ed.label;
    if (locale === "en") {
      return `${label} — ${eTrans.notice}`;
    }
    return `${label} ${eTrans.notice}`;
  };

  return (
    <section className="gr-edition" aria-labelledby="gr-edition-title">
      <div className="gr-container">
        <h2 id="gr-edition-title" className="gr-edition__title">
          {eTrans.title}
        </h2>

        <div className="gr-edition__list" role="group" aria-labelledby="gr-edition-title">
          {editions.map((edition) => {
            const soon = edition.status === "coming_soon";
            const selected = edition.id === selectedId;
            const label = locale === "en" ? edition.labelEn : edition.label;
            return (
              <button
                key={edition.id}
                type="button"
                id={`gr-edition-${edition.id}`}
                className={`gr-edition__btn ${selected ? "is-selected" : ""} ${soon ? "is-soon" : ""}`}
                aria-pressed={selected}
                aria-disabled={soon || undefined}
                onClick={() => onSelect(edition)}
              >
                <span className="gr-edition__label">{label}</span>
                <span className="gr-edition__meta">
                  {soon ? (
                    <>
                      <Clock size={14} aria-hidden="true" /> {eTrans.comingSoon}
                    </>
                  ) : (
                    <>
                      {selected && <Check size={14} aria-hidden="true" />} {edition.year}
                    </>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <p className="gr-edition__notice" role="status" aria-live="polite">
          {peeked ? getEditionNotice(peeked) : ""}
        </p>
      </div>
    </section>
  );
}
