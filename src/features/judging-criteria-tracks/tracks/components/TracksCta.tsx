import React from 'react';
import { motion } from 'motion/react';
import type { Language } from '../types';
import { ArrowLeft, ArrowRight, Sparkles, Award } from 'lucide-react';

interface TracksCtaProps {
  lang: Language;
  onNavigate?: (path: string) => void;
}

export const TracksCta: React.FC<TracksCtaProps> = ({ lang, onNavigate }) => {
  const isAr = lang === 'ar';

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <section id="tracks-cta-section" className="py-12 sm:py-16 md:py-20 relative overflow-hidden">
      <div className="tracks-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="buildx-glass relative max-w-[1020px] mx-auto rounded-[28px] sm:rounded-[34px] p-7 sm:p-10 md:p-14 text-center overflow-hidden border border-[#fb50c3]/30 shadow-2xl"
        >
          {/* Ambient glow in background */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.15, 0.28, 0.15],
            }}
            transition={{
              repeat: Infinity,
              duration: 7,
              ease: 'easeInOut',
            }}
            className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full blur-3xl pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #fb50c3 0%, #8234f9 50%, transparent 100%)',
            }}
          />

          <div className="relative z-10 max-w-[740px] mx-auto">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fb50c3]/15 border border-[#fb50c3]/30 text-[#fb50c3] text-xs font-pixel mb-5"
            >
              <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{isAr ? 'انطلاقة التحدي // BUILDx' : 'LAUNCHPAD // BUILDx'}</span>
            </motion.div>

            {/* Title */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#e7edfd] tracking-tight leading-tight mb-4">
              {isAr
                ? 'اختر المسار الذي ستصنع فيه الأثر'
                : "Choose the Track Where You'll Make Your Impact"}
            </h2>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#e7edfd]/85 leading-[1.85] mb-8 sm:mb-10">
              {isAr
                ? 'افهم التحدي، حدّد المستفيد، وابنِ منتجًا رقميًا يحوّل البيانات إلى قرار وقيمة قابلة للقياس.'
                : 'Understand the challenge, identify your beneficiaries, and engineer a digital product transforming data into clear decisions and measurable impact.'}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 max-w-[540px] mx-auto">
              {/* Primary button: Explore Judging Criteria */}
              <motion.button
                type="button"
                onClick={() => handleNavigate('/معايير-التحكيم')}
                whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(195, 249, 55, 0.35)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 rounded-xl bg-[#c3f937] text-[#0c1018] font-bold text-base hover:bg-[#b0e82c] transition-colors shadow-lg shadow-[#c3f937]/20 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Award className="w-5 h-5 text-[#0c1018]" aria-hidden="true" />
                <span>{isAr ? 'الاطلاع على معايير التحكيم' : 'Explore Judging Criteria'}</span>
                {isAr ? (
                  <ArrowLeft
                    className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                ) : (
                  <ArrowRight
                    className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                    aria-hidden="true"
                  />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
