"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { getAwardImageSources, AWARD_IMAGE_SIZE, type Award } from "@/data/graduates";

/**
 * Award photo with lazy loading, a BUILDx-branded loading background,
 * and a branded placeholder fallback (never a broken image).
 */
export default function AwardPhoto({
  award,
  priority = false,
  sizes,
}: {
  award: Award;
  priority?: boolean;
  sizes: string;
}) {
  const { locale } = useLanguage();
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { src, srcSet } = getAwardImageSources(award.image);

  const alt = locale === "en" ? award.image.altEn : award.image.alt;
  const title = locale === "en" ? award.titleEn : award.title;

  if (failed) {
    return (
      <div className="gr-photo gr-photo--fallback" role="img" aria-label={alt}>
        <span className="gr-photo__fb-team">TEAM {award.teamNumber}</span>
        <span className="gr-photo__fb-title">{title}</span>
      </div>
    );
  }

  return (
    <div className={`gr-photo ${loaded ? "is-loaded" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        width={AWARD_IMAGE_SIZE.width}
        height={AWARD_IMAGE_SIZE.height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{ objectPosition: award.image.objectPosition ?? "center" }}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        ref={(el) => {
          if (el && el.complete && el.naturalWidth > 0 && !loaded) setLoaded(true);
        }}
      />
    </div>
  );
}
