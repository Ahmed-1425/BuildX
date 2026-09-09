import React from 'react';
import { motion } from 'motion/react';
import type { ChallengeTrack, Language } from '../types';
import { TrackLogoSlot } from './TrackLogoSlot';
import { CircleHelp, Sparkles, Tag } from 'lucide-react';

interface TrackSectionProps {
  track: ChallengeTrack;
  lang: Language;
  index: number;
}

export const TrackSection: React.FC<TrackSectionProps> = ({
  track,
  lang,
  index,
}) => {
  const isAr = lang === 'ar';
  const content = isAr ? track.translations.ar : track.translations.en;
  const Icon = track.icon;

  // Alternate visual order on desktop:
  // Mahara (01): Content first, Logo second
  // Silsilah (02): Logo first, Content second
  // Nama (03): Content first, Logo second
  const isReversedOnDesktop = track.number === '02';

  return (
    <section
      id={`track-${track.id}`}
      className="track-anchor py-10 sm:py-14 md:py-20 border-b border-white/[0.06] last:border-b-0 relative overflow-hidden"
    >
      {/* Dynamic ambient glow behind the track section */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.08, 0.16, 0.08],
        }}
        transition={{
          repeat: Infinity,
          duration: 7 + index * 2,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 w-[460px] h-[340px] rounded-full blur-[140px] pointer-events-none -z-10"
        style={{
          backgroundColor: track.accent,
          [isReversedOnDesktop ? 'left' : 'right']: '-100px',
        }}
      />

      <div className="tracks-container">
        {/*
          DESKTOP: Large editorial split layout (min-height 620px, 2-column grid)
          MOBILE: Single-column natural height vertical flow
        */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.14fr)_minmax(340px,0.86fr)] gap-8 md:gap-12 lg:gap-[clamp(48px,6vw,88px)] items-center lg:min-h-[620px]">
          {/* CONTENT COLUMN */}
          <div
            className={`flex flex-col z-10 ${
              isReversedOnDesktop ? 'lg:order-2' : 'lg:order-1'
            }`}
          >
            {/* 1. Header (Number, Track Name, Subtitle, Small badge, Icon, Accent line) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="mb-5 sm:mb-6"
            >
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span
                  className="text-xs font-mono font-bold px-2.5 py-1 rounded border"
                  style={{
                    backgroundColor: `${track.accent}15`,
                    borderColor: `${track.accent}40`,
                    color: track.accent,
                  }}
                >
                  TRACK {track.number}
                </span>

                <span className="text-xs font-mono text-[#e7edfd]/60 uppercase tracking-wider">
                  {content.trackBadge}
                </span>

                {/* 40px Glass Icon Box */}
                <div
                  className="w-8 h-8 rounded-lg bg-[#0c1018]/80 border flex items-center justify-center shrink-0"
                  style={{
                    borderColor: `${track.accent}35`,
                    color: track.accent,
                  }}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                </div>
              </div>

              {/* Track Name & Subtitle */}
              <div className="flex flex-col gap-1 mb-3">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#e7edfd] tracking-tight">
                  {content.name}
                </h2>
                <span
                  className="text-base sm:text-lg md:text-xl font-bold tracking-tight"
                  style={{ color: track.accent }}
                >
                  {content.subtitle}
                </span>
              </div>

              {/* Short accent line */}
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: 80 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="h-1 rounded-full"
                style={{
                  background: `linear-gradient(90deg, ${track.accent} 0%, transparent 100%)`,
                }}
              />
            </motion.div>

            {/*
              2. MOBILE ONLY: Reserved Logo Slot immediately under the Subtitle
              (strictly hidden on desktop to avoid duplication)
            */}
            <div className="block lg:hidden my-4">
              <TrackLogoSlot
                logoSrc={track.logoSrc}
                trackName={content.name}
                accent={track.accent}
              />
            </div>

            {/* 3. Track Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
              className="text-[#e7edfd]/85 mb-6 sm:mb-8 font-normal leading-[1.9] max-w-[760px]"
              style={{ fontSize: 'clamp(17px, 1.45vw, 21px)' }}
            >
              {content.description}
            </motion.p>

            {/* 4. Two Dedicated Glass Cards: Challenge Question & Expected Output */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-6 sm:mb-8">
              {/* Challenge Question (High prominence) */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.15 }}
                className="buildx-glass relative rounded-2xl p-5 sm:p-6 border flex flex-col justify-between overflow-hidden shadow-lg transition-all duration-300"
                style={{
                  borderColor: `${track.accent}35`,
                  boxShadow: `0 10px 30px -10px ${track.accent}15`,
                }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${track.accent}15`,
                        borderColor: `${track.accent}35`,
                        color: track.accent,
                      }}
                    >
                      <CircleHelp className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <h3
                      className="text-xs font-mono font-bold tracking-wider uppercase"
                      style={{ color: track.accent }}
                    >
                      {content.challengeQuestionLabel}
                    </h3>
                  </div>

                  {/* Prominent Question Text */}
                  <p className="text-sm sm:text-base md:text-[17px] font-bold text-[#e7edfd] leading-relaxed">
                    {content.challengeQuestion}
                  </p>
                </div>

                <div
                  className="w-12 h-0.5 rounded-full mt-4"
                  style={{ backgroundColor: `${track.accent}60` }}
                />
              </motion.article>

              {/* Expected Output */}
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.22 }}
                className="buildx-glass-subtle relative rounded-2xl p-5 sm:p-6 border border-white/10 flex flex-col justify-between overflow-hidden shadow-lg transition-all duration-300"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#c3f937]">
                      <Sparkles className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <h3 className="text-xs font-mono font-bold tracking-wider uppercase text-[#e7edfd]/70">
                      {content.expectedOutputLabel}
                    </h3>
                  </div>

                  <p className="text-sm sm:text-base text-[#e7edfd]/90 leading-relaxed font-medium">
                    {content.expectedOutput}
                  </p>
                </div>

                <div className="w-12 h-0.5 rounded-full mt-4 bg-white/20" />
              </motion.article>
            </div>

            {/* 5. Beneficiaries Section (Rendered as readable chips) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.28 }}
              className="flex flex-col gap-2.5 pt-2"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-[#e7edfd]/60" aria-hidden="true" />
                <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-[#e7edfd]/70">
                  {content.beneficiariesLabel}
                </h4>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-2.5">
                {content.beneficiaries.map((b, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/20 text-xs sm:text-sm text-[#e7edfd]/85 font-medium transition-colors"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full me-2 shrink-0 opacity-70"
                      style={{ backgroundColor: track.accent }}
                    />
                    {b}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/*
            DESKTOP LOGO DISPLAY:
            Hidden on mobile (mobile uses the in-flow slot above).
            Alternates smoothly using grid order.
            Clean, frameless presentation with subtle ambient glow.
          */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`hidden lg:flex flex-col items-center justify-center z-10 ${
              isReversedOnDesktop ? 'lg:order-1' : 'lg:order-2'
            }`}
          >
            <TrackLogoSlot
              logoSrc={track.logoSrc}
              trackName={content.name}
              accent={track.accent}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
