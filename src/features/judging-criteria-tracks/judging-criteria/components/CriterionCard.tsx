import React from 'react';
import { motion } from 'motion/react';
import type { JudgingCriterion, Language } from '../types';

interface CriterionCardProps {
  criterion: JudgingCriterion;
  lang: Language;
  index?: number;
}

export const CriterionCard: React.FC<CriterionCardProps> = ({ criterion, lang, index = 0 }) => {
  const isAr = lang === 'ar';
  const content = isAr ? criterion.translations.ar : criterion.translations.en;
  const IconComponent = criterion.icon;

  // Accent colors configuration
  const accentBorder =
    criterion.accent === 'lime'
      ? 'hover:border-[#c3f937]/50 hover:shadow-[0_10px_30px_rgba(195,249,55,0.12)]'
      : criterion.accent === 'violet'
      ? 'hover:border-[#a855f7]/50 hover:shadow-[0_10px_30px_rgba(168,85,247,0.12)]'
      : criterion.accent === 'pink'
      ? 'hover:border-[#fb50c3]/50 hover:shadow-[0_10px_30px_rgba(251,80,195,0.12)]'
      : 'hover:border-[#e05d2b]/50 hover:shadow-[0_10px_30px_rgba(224,93,43,0.12)]';

  const accentBadgeBg =
    criterion.accent === 'lime'
      ? 'bg-[#c3f937]/15 text-[#c3f937] border-[#c3f937]/30'
      : criterion.accent === 'violet'
      ? 'bg-[#a855f7]/15 text-[#c084fc] border-[#a855f7]/30'
      : criterion.accent === 'pink'
      ? 'bg-[#fb50c3]/15 text-[#fb50c3] border-[#fb50c3]/30'
      : 'bg-[#e05d2b]/15 text-[#f97316] border-[#e05d2b]/30';

  const accentProgressColor =
    criterion.accent === 'lime'
      ? 'bg-[#c3f937]'
      : criterion.accent === 'violet'
      ? 'bg-[#a855f7]'
      : criterion.accent === 'pink'
      ? 'bg-[#fb50c3]'
      : 'bg-[#e05d2b]';

  return (
    <motion.article
      id={`criterion-card-${criterion.id}`}
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.12, ease: 'easeOut' }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`buildx-glass relative rounded-[22px] sm:rounded-[26px] p-5 sm:p-7 md:p-8 flex flex-col justify-between transition-colors duration-300 md:min-h-[390px] h-full group overflow-hidden ${accentBorder}`}
    >
      {/* Subtle corner indicator */}
      <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[#c3f937] transition-colors" />

      {/* TOP ROW */}
      <div className="flex items-start justify-between gap-4 mb-4 relative z-10">
        {/* Left/Right in RTL: Number and Stage label */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-white/10 text-white border border-white/10 group-hover:border-white/25 transition-colors">
              #{criterion.criterionNumberStr}
            </span>
            <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded border ${accentBadgeBg}`}>
              {criterion.weight}%
            </span>
          </div>
          <span className="text-xs font-mono text-[#e7edfd]/60 tracking-wider">
            {content.stageLabel}
          </span>
        </div>

        {/* 48px Glass Icon Box */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 3 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
          className="w-12 h-12 rounded-xl bg-[#0c1018]/80 border border-white/10 flex items-center justify-center shrink-0 shadow-inner group-hover:border-white/25 transition-all"
        >
          <IconComponent
            className={`w-6 h-6 ${
              criterion.accent === 'lime'
                ? 'text-[#c3f937]'
                : criterion.accent === 'violet'
                ? 'text-[#c084fc]'
                : criterion.accent === 'pink'
                ? 'text-[#fb50c3]'
                : 'text-[#f97316]'
            }`}
            aria-hidden="true"
          />
        </motion.div>
      </div>

      {/* MIDDLE SECTION */}
      <div className="flex-1 flex flex-col relative z-10">
        {/* Criterion Title */}
        <h3 className="text-xl sm:text-2xl font-bold text-[#e7edfd] leading-snug mb-3 group-hover:text-[#c3f937] transition-colors">
          {content.title}
        </h3>

        {/* Slim animated weight progress indicator */}
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-4">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${(criterion.weight / 10) * 100}%` }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className={`h-full rounded-full ${accentProgressColor}`}
          />
        </div>

        {/* Description: 16px-18px, line-height around 1.85 */}
        <p className="text-sm sm:text-base text-[#e7edfd]/85 leading-[1.85] mb-6">
          {content.description}
        </p>
      </div>

      {/* BOTTOM SECTION: What are judges looking for? */}
      <div className="mt-auto pt-5 border-t border-[#e7edfd]/[0.08] relative z-10">
        <div className="flex items-center gap-2 mb-3">
          {/* Small diamond SVG */}
          <svg
            className="w-3.5 h-3.5 text-[#c3f937] shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2L2 12L12 22L22 12L12 2Z" />
          </svg>
          <h4 className="text-xs font-bold text-[#e7edfd]/90 uppercase tracking-wide">
            {content.checkpointsTitle}
          </h4>
        </div>

        <ul className="space-y-2.5">
          {content.checkpoints.map((point, idx) => (
            <motion.li
              key={idx}
              initial={{ opacity: 0, x: isAr ? 10 : -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: 0.25 + idx * 0.08 }}
              className="flex items-start gap-2.5 text-xs sm:text-sm text-[#e7edfd]/80 leading-relaxed"
            >
              {/* Check indicator with micro-glow */}
              <span className="w-1.5 h-1.5 rounded-full bg-[#c3f937] mt-2 shrink-0 shadow-[0_0_6px_#c3f937]" />
              <span>{point}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
};
