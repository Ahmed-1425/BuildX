import React from 'react';
import { ArrowDown, Layers, Sparkles, Compass } from 'lucide-react';
import { motion } from 'motion/react';
import type { Language } from '../types';
import { Gauge100 } from './Gauge100';

interface HeroSectionProps {
  lang: Language;
  onNavigate?: (path: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ lang, onNavigate }) => {
  const isAr = lang === 'ar';

  const scrollToOverview = () => {
    const el = document.getElementById('stages-overview-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigateToTracks = () => {
    if (onNavigate) {
      onNavigate('/المسارات');
    } else {
      window.history.pushState({}, '', '/المسارات');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <section
      id="judging-hero-section"
      className="relative pt-8 pb-14 md:pt-14 md:pb-20 overflow-hidden"
    >
      {/* Dynamic cyberpunk ambient light orbs */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.12, 0.2, 0.12],
        }}
        transition={{
          repeat: Infinity,
          duration: 8,
          ease: 'easeInOut',
        }}
        className="absolute top-10 -right-20 w-[420px] h-[420px] rounded-full bg-[#c3f937]/15 blur-[120px] pointer-events-none -z-10"
      />
      <motion.div
        animate={{
          scale: [1.1, 1, 1.1],
          opacity: [0.08, 0.16, 0.08],
        }}
        transition={{
          repeat: Infinity,
          duration: 9,
          ease: 'easeInOut',
        }}
        className="absolute bottom-0 -left-20 w-[450px] h-[450px] rounded-full bg-[#a855f7]/15 blur-[120px] pointer-events-none -z-10"
      />

      <div className="judging-container">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] gap-8 md:gap-12 lg:gap-[clamp(48px,6vw,88px)] items-center min-h-[480px] lg:min-h-[520px]">
          {/* Text block with staggered entrance animations */}
          <div className="flex flex-col items-start max-w-[680px] z-10">
            {/* System Badge */}
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#202135]/80 border border-[#c3f937]/30 text-[#c3f937] text-xs font-pixel tracking-wide mb-6 shadow-sm backdrop-blur-md"
            >
              <span className="w-2 h-2 rounded-sm bg-[#c3f937] shadow-[0_0_8px_#c3f937]" />
              <span>{isAr ? 'نظام التقييم // BUILDx' : 'EVALUATION SYSTEM // BUILDx'}</span>
            </motion.div>

            {/* Headline on two deliberate lines with smooth text mask reveal */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-[62px] font-black tracking-tight leading-[1.15] mb-6"
            >
              {isAr ? (
                <div className="flex flex-col items-start gap-1">
                  <span className="text-white">معايير التقييم</span>
                  <span className="text-[#c3f937] drop-shadow-[0_0_24px_rgba(195,249,55,0.4)]">
                    والتحكيم
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-start gap-1">
                  <span className="text-white">Judging & Evaluation</span>
                  <span className="text-[#c3f937] drop-shadow-[0_0_24px_rgba(195,249,55,0.4)]">
                    Criteria
                  </span>
                </div>
              )}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
              className="text-lg sm:text-xl text-[#e7edfd]/90 font-medium leading-[1.8] mb-4"
            >
              {isAr
                ? 'كل درجة لها معنى، وكل معيار يقيس جانبًا أساسيًا من رحلة تحويل الفكرة إلى منتج رقمي فعّال.'
                : 'Every point carries purpose. Each criterion measures an essential dimension in transforming an idea into an impactful digital product.'}
            </motion.p>

            {/* Clarification text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
              className="text-sm sm:text-base text-[#e7edfd]/75 leading-[1.85] mb-8"
            >
              {isAr
                ? 'تعرّف على المعايير والأوزان قبل بدء البناء، ووجّه قرارات فريقك نحو منتج متكامل وقابل للاستخدام.'
                : 'Master the criteria and weights before you start building, guiding your team decisions toward a cohesive, usable product.'}
            </motion.p>

            {/* Quick Action button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-4"
            >
              <motion.button
                type="button"
                onClick={scrollToOverview}
                whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(195, 249, 55, 0.3)' }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-[#c3f937] text-[#0c1018] font-bold text-sm hover:bg-[#b0e82c] transition-all duration-200 shadow-lg shadow-[#c3f937]/20 cursor-pointer group"
              >
                <Layers className="w-4 h-4 text-[#0c1018]" aria-hidden="true" />
                <span>{isAr ? 'استكشف المراحل الـ 5' : 'Explore the 5 Stages'}</span>
                <ArrowDown className="w-4 h-4 text-[#0c1018] group-hover:translate-y-1 transition-transform" aria-hidden="true" />
              </motion.button>

              <motion.button
                type="button"
                onClick={handleNavigateToTracks}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/5 text-[#e7edfd] font-semibold text-sm border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#fb50c3]" aria-hidden="true" />
                <span>{isAr ? 'استكشف مسارات التحدي' : 'Explore Challenge Tracks'}</span>
              </motion.button>

              <div className="flex items-center gap-2 text-xs text-[#e7edfd]/70 font-mono px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-[#c3f937]" />
                <span>{isAr ? '100% الدرجة الإجمالية' : '100% Total Score'}</span>
              </div>
            </motion.div>
          </div>

          {/* Visual 100% Gauge with entrance spring animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, delay: 0.25, type: 'spring', bounce: 0.25 }}
            className="w-full flex justify-center lg:justify-end z-10"
          >
            <Gauge100 lang={lang} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
