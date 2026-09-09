import React from 'react';
import { motion } from 'motion/react';
import type { Language } from '../types';
import { Plus, Equal, Calculator } from 'lucide-react';

interface ScoreCalculationSectionProps {
  lang: Language;
}

interface CalcBlock {
  stageId: number;
  score: number;
  labelAr: string;
  labelEn: string;
  color: string;
}

const CALC_BLOCKS: CalcBlock[] = [
  { stageId: 1, score: 20, labelAr: 'الفكرة والفهم', labelEn: 'Idea & Discovery', color: '#c3f937' },
  { stageId: 2, score: 30, labelAr: 'المنتج والتنفيذ', labelEn: 'Product & Build', color: '#a855f7' },
  { stageId: 3, score: 20, labelAr: 'الأثر والقيمة', labelEn: 'Impact & Value', color: '#fb50c3' },
  { stageId: 4, score: 20, labelAr: 'العرض والفريق', labelEn: 'Pitch & Team', color: '#e05d2b' },
  { stageId: 5, score: 10, labelAr: 'الالتزام والمشاركة', labelEn: 'Commitment', color: '#10b981' },
];

export const ScoreCalculationSection: React.FC<ScoreCalculationSectionProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  return (
    <section id="score-calculation-section" className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="judging-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="buildx-glass relative max-w-[1120px] mx-auto rounded-[24px] sm:rounded-[30px] p-6 sm:p-9 md:p-11 overflow-hidden shadow-2xl border border-white/10"
        >
          {/* Subtle decorative glow */}
          <motion.div
            animate={{
              opacity: [0.12, 0.25, 0.12],
              scale: [1, 1.1, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 5,
              ease: 'easeInOut',
            }}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-28 bg-[#c3f937]/15 blur-3xl pointer-events-none rounded-full"
          />

          {/* Section Header */}
          <div className="text-center max-w-[760px] mx-auto mb-8 sm:mb-12 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c3f937]/10 border border-[#c3f937]/25 text-[#c3f937] text-xs font-pixel mb-3">
              <Calculator className="w-3.5 h-3.5" />
              <span>{isAr ? 'حساب النتيجة // FORMULA' : 'FINAL SCORE // FORMULA'}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#e7edfd] tracking-tight mb-3">
              {isAr ? 'كيف تُحتسب النتيجة؟' : 'How is the Final Score Calculated?'}
            </h2>
            <p className="text-sm sm:text-base text-[#e7edfd]/80 leading-[1.85]">
              {isAr
                ? 'تُقيّم المشاريع وفق أحد عشر معيارًا، ويحصل كل معيار على درجته بحسب وزنه المحدد. تُجمع الدرجات للحصول على النتيجة النهائية من 100.'
                : 'Projects are evaluated against eleven criteria, each graded according to its specified weight. Scores are aggregated to determine the final mark out of 100.'}
            </p>
          </div>

          {/* DESKTOP CALCULATION: Horizontal blocks with sequential entrance */}
          <div className="hidden lg:flex items-center justify-center gap-2 xl:gap-3 relative z-10">
            <div className="flex items-center justify-center gap-2 xl:gap-3" dir="ltr">
              {CALC_BLOCKS.map((item, index) => (
                <React.Fragment key={item.stageId}>
                  {/* Animated Block */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 15 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.09 }}
                    whileHover={{ y: -4, scale: 1.04 }}
                    className="flex flex-col items-center bg-[#0c1018]/70 border border-white/10 hover:border-white/25 rounded-2xl p-4 min-w-[140px] text-center shadow-md transition-colors"
                  >
                    <span
                      className="text-3xl font-display font-extrabold"
                      style={{ color: item.color }}
                    >
                      {item.score}
                    </span>
                    <span
                      className="text-xs font-semibold text-[#e7edfd]/90 mt-1 line-clamp-1"
                      dir={isAr ? 'rtl' : 'ltr'}
                    >
                      {isAr ? item.labelAr : item.labelEn}
                    </span>
                    <span className="text-[10px] font-mono text-[#e7edfd]/50 mt-0.5">
                      Stage 0{item.stageId}
                    </span>
                  </motion.div>

                  {/* Plus operator */}
                  {index < CALC_BLOCKS.length - 1 && (
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ repeat: Infinity, duration: 2, delay: index * 0.3 }}
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#e7edfd]/70 shrink-0"
                    >
                      <Plus className="w-4 h-4" aria-hidden="true" />
                    </motion.div>
                  )}
                </React.Fragment>
              ))}

              {/* Equals operator */}
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1.2 }}
                className="w-8 h-8 rounded-full bg-white/10 border border-[#c3f937]/30 flex items-center justify-center text-[#c3f937] shrink-0"
              >
                <Equal className="w-4 h-4" aria-hidden="true" />
              </motion.div>

              {/* Final Score Block with subtle breathing glow */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85, y: 15 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center bg-gradient-to-br from-[#c3f937]/20 via-[#202135] to-[#fb50c3]/20 border-2 border-[#c3f937]/50 rounded-2xl p-4 min-w-[160px] text-center shadow-lg shadow-[#c3f937]/10"
              >
                <span className="text-3xl font-display font-black text-[#c3f937] tracking-tight">
                  100%
                </span>
                <span
                  className="text-xs font-bold text-white mt-1"
                  dir={isAr ? 'rtl' : 'ltr'}
                >
                  {isAr ? 'النتيجة النهائية' : 'Final Score'}
                </span>
                <span className="text-[10px] font-mono text-[#c3f937]/90 mt-0.5">
                  11 Criteria
                </span>
              </motion.div>
            </div>
          </div>

          {/* MOBILE & TABLET: Vertical Clean Stack with entrance animations */}
          <div className="lg:hidden flex flex-col gap-2.5 max-w-[480px] mx-auto relative z-10">
            {CALC_BLOCKS.map((item, index) => (
              <motion.div
                key={item.stageId}
                initial={{ opacity: 0, x: isAr ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="flex items-center justify-between bg-[#0c1018]/80 border border-white/10 rounded-xl px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 text-[#e7edfd]/60">
                    0{item.stageId}
                  </span>
                  <span className="text-sm font-bold text-[#e7edfd]">
                    {isAr ? item.labelAr : item.labelEn}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className="text-xl font-display font-extrabold"
                    style={{ color: item.color }}
                  >
                    +{item.score}
                  </span>
                  <span className="text-xs text-[#e7edfd]/50 font-mono">%</span>
                </div>
              </motion.div>
            ))}

            {/* Total Divider & Box */}
            <div className="mt-2 pt-2 border-t border-white/10">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="flex items-center justify-between bg-gradient-to-r from-[#c3f937]/15 to-[#fb50c3]/15 border border-[#c3f937]/40 rounded-xl px-5 py-3.5 shadow-md"
              >
                <span className="text-base font-bold text-white">
                  {isAr ? 'النتيجة النهائية' : 'Final Score'}
                </span>
                <span className="text-2xl font-display font-black text-[#c3f937]">
                  100%
                </span>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
