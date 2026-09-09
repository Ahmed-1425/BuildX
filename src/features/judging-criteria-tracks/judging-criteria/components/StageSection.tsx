import React from 'react';
import { motion } from 'motion/react';
import type { JudgingStage, Language } from '../types';
import { CriterionCard } from './CriterionCard';

interface StageSectionProps {
  stage: JudgingStage;
  lang: Language;
}

export const StageSection: React.FC<StageSectionProps> = ({ stage, lang }) => {
  const isAr = lang === 'ar';
  const stageData = isAr ? stage.translations.ar : stage.translations.en;
  const isSingleCardStage = stage.criteria.length === 1;

  // Header accent colors
  const accentColor =
    stage.accent === 'lime'
      ? '#c3f937'
      : stage.accent === 'violet'
      ? '#a855f7'
      : stage.accent === 'pink'
      ? '#fb50c3'
      : '#e05d2b';

  return (
    <section
      id={`stage-section-${stage.id}`}
      className="stage-anchor py-10 sm:py-14 md:py-16 border-b border-white/[0.04] last:border-b-0 relative"
    >
      {/* Ambient background glow for the stage */}
      <div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-96 h-40 rounded-full blur-[100px] pointer-events-none opacity-10 -z-10"
        style={{ backgroundColor: accentColor }}
      />

      <div className="judging-container">
        {/* Stage Structured Header with animated reveal */}
        <motion.header
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-8 sm:mb-12"
        >
          {/* Top meta row */}
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <span className="text-xs font-pixel font-bold px-2.5 py-1 rounded bg-white/10 text-[#c3f937] border border-[#c3f937]/30">
              STAGE {stage.stageNumberStr}
            </span>
            <span className="text-xs font-mono text-[#e7edfd]/60 font-semibold">
              {stageData.ordinal}
            </span>
            <span
              className="text-xs font-mono font-bold px-3 py-1 rounded-full text-white border"
              style={{
                borderColor: `${accentColor}40`,
                backgroundColor: `${accentColor}15`,
              }}
            >
              {stageData.weightLabel}
            </span>
          </div>

          {/* Main Stage Title */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#e7edfd] tracking-tight mb-3">
            {stageData.title}
          </h2>

          {/* Short supporting line */}
          <p className="text-sm sm:text-base text-[#e7edfd]/70 max-w-[720px] leading-relaxed mb-5">
            {stageData.subtitle}
          </p>

          {/* Short animated gradient divider */}
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 88 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-1 rounded-full"
            style={{
              background: `linear-gradient(90deg, ${accentColor} 0%, transparent 100%)`,
            }}
          />
        </motion.header>

        {/* Criteria Grid */}
        {isSingleCardStage ? (
          /* Stage 5: single card max-w-[760px] precisely centered */
          <div className="max-w-[760px] mx-auto w-full">
            <CriterionCard criterion={stage.criteria[0]} lang={lang} index={0} />
          </div>
        ) : (
          /* Stages 1, 2, 3, 4: 2 columns on desktop */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 items-stretch">
            {stage.criteria.map((criterion, idx) => (
              <div key={criterion.id} className="h-full">
                <CriterionCard criterion={criterion} lang={lang} index={idx} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
