import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { Language } from '../types';
import { JUDGING_STAGES } from '../data';
import {
  ChevronRight,
  ChevronLeft,
  ArrowLeft,
  ArrowRight,
  HandMetal,
  MoveHorizontal,
  Compass,
} from 'lucide-react';

interface StagesOverviewProps {
  lang: Language;
  activeStageId?: number;
}

export const StagesOverview: React.FC<StagesOverviewProps> = ({
  lang,
  activeStageId = 1,
}) => {
  const isAr = lang === 'ar';
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Scroll to stage section in the page
  const scrollToStage = (id: number) => {
    const el = document.getElementById(`stage-section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll mobile carousel directly to a specific card index (0 to 4)
  const scrollToCardIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>('.stage-mobile-card');
    if (cards[index]) {
      const card = cards[index];
      const offsetLeft = card.offsetLeft;
      // In RTL or LTR, scrolling directly into view smoothly
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      setCurrentMobileIndex(index);
    }
  };

  // Track horizontal scroll position on mobile to update current stage index and indicators
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const cards = container.querySelectorAll<HTMLElement>('.stage-mobile-card');
    if (!cards.length) return;

    const containerCenter = container.getBoundingClientRect().left + container.offsetWidth / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.left + rect.width / 2;
      const distance = Math.abs(containerCenter - cardCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setCurrentMobileIndex(closestIndex);

    // Track scroll bounds
    const scrollLeft = Math.abs(container.scrollLeft);
    const maxScroll = container.scrollWidth - container.clientWidth;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < maxScroll - 10);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();

    return () => container.removeEventListener('scroll', handleScroll);
  }, [lang]);

  // Mobile arrow buttons handler:
  // In Arabic (RTL): "Next" scrolls leftwards; "Prev" scrolls rightwards.
  // In English (LTR): "Next" scrolls rightwards; "Prev" scrolls leftwards.
  const handleMobileNav = (direction: 'next' | 'prev') => {
    const newIndex =
      direction === 'next'
        ? Math.min(currentMobileIndex + 1, JUDGING_STAGES.length - 1)
        : Math.max(currentMobileIndex - 1, 0);

    scrollToCardIndex(newIndex);
  };

  return (
    <section
      id="stages-overview-section"
      className="relative py-8 md:py-12 border-b border-white/[0.06] overflow-hidden"
    >
      {/* Background ambient lighting effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-40 bg-[#c3f937]/5 blur-3xl pointer-events-none rounded-full" />

      <div className="judging-container">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#c3f937] shadow-[0_0_10px_#c3f937]" />
            <span className="text-xs sm:text-sm font-pixel tracking-wider text-[#c3f937] uppercase">
              {isAr ? 'خارطة المراحل الخمس' : 'FIVE STAGES OVERVIEW'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-[#e7edfd]/60 font-mono">
            <Compass className="w-3.5 h-3.5 text-[#c3f937]" />
            <span>{isAr ? 'اضغط على أي مرحلة للانتقال الفوري إليها' : 'Click any stage to jump directly to its criteria'}</span>
          </div>
        </motion.div>

        {/* ========================================================= */}
        {/* MOBILE ONLY: ULTRA-CLEAR SWIPE NOTICE & DIRECTIONAL HINT  */}
        {/* "لف يسار بالعربي" / "لف يمين بالإنجليزي"                   */}
        {/* ========================================================= */}
        <div className="md:hidden flex flex-col gap-2 mb-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-between bg-gradient-to-r from-[#202135]/95 via-[#161928]/95 to-[#0c1018]/95 border border-[#c3f937]/35 rounded-xl px-3.5 py-2.5 shadow-lg shadow-[#c3f937]/5"
          >
            {/* Directional swipe message with animated indicator */}
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c3f937] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c3f937]" />
              </span>

              <div className="flex items-center gap-1.5 text-xs font-bold text-[#e7edfd]">
                <span>
                  {isAr
                    ? 'لف يسار لاستعراض بقية المراحل'
                    : 'Swipe right to explore remaining stages'}
                </span>

                {/* Animated Arrow that pulses in the exact swipe direction */}
                <motion.span
                  animate={
                    isAr
                      ? { x: [-4, 2, -4] } // Moves left in Arabic (RTL)
                      : { x: [2, 8, 2] }   // Moves right in English (LTR)
                  }
                  transition={{
                    repeat: Infinity,
                    duration: 1.2,
                    ease: 'easeInOut',
                  }}
                  className="inline-flex text-[#c3f937] font-black"
                >
                  {isAr ? (
                    <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  )}
                </motion.span>
              </div>
            </div>

            {/* Current stage counter indicator */}
            <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#c3f937]/15 text-[#c3f937] border border-[#c3f937]/30 shrink-0">
              {currentMobileIndex + 1} / {JUDGING_STAGES.length}
            </span>
          </motion.div>

          {/* Quick manual tap controllers for mobile */}
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-mono text-[#e7edfd]/60">
              {isAr ? 'اسحب بيدك أو استخدم الأسهم:' : 'Swipe or use arrows:'}
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleMobileNav('prev')}
                disabled={currentMobileIndex === 0}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-[#e7edfd] hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label={isAr ? 'المرحلة السابقة' : 'Previous stage'}
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={() => handleMobileNav('next')}
                disabled={currentMobileIndex === JUDGING_STAGES.length - 1}
                className="p-1.5 rounded-lg bg-[#c3f937]/15 border border-[#c3f937]/35 text-[#c3f937] hover:bg-[#c3f937]/25 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
                aria-label={isAr ? 'المرحلة التالية' : 'Next stage'}
              >
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CARDS CONTAINER:                                          */}
        {/* Desktop: 5-column responsive grid with staggered motion   */}
        {/* Mobile: Horizontal peek snap carousel with edge hint      */}
        {/* ========================================================= */}
        <div className="relative">
          {/* Edge gradient mask indicator on mobile to hint more offscreen content */}
          <div
            className={`md:hidden pointer-events-none absolute top-0 bottom-3 w-10 z-10 ${
              isAr
                ? 'left-0 bg-gradient-to-r from-[#0c1018] to-transparent'
                : 'right-0 bg-gradient-to-l from-[#0c1018] to-transparent'
            }`}
          />

          <div
            ref={scrollContainerRef}
            className="flex md:grid md:grid-cols-5 gap-3.5 sm:gap-4 overflow-x-auto no-scrollbar pb-4 md:pb-0 snap-x snap-mandatory scroll-smooth px-1"
          >
            {JUDGING_STAGES.map((stage, index) => {
              const isActive = stage.id === activeStageId;
              const isCurrentInMobile = index === currentMobileIndex;
              const arText = stage.translations.ar;
              const enText = stage.translations.en;
              const title = isAr ? arText.shortTitle : enText.shortTitle;

              // Accent color mapping
              const accentColor =
                stage.accent === 'lime'
                  ? '#c3f937'
                  : stage.accent === 'violet'
                  ? '#a855f7'
                  : stage.accent === 'pink'
                  ? '#fb50c3'
                  : '#e05d2b';

              return (
                <motion.button
                  key={stage.id}
                  type="button"
                  onClick={() => scrollToStage(stage.id)}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  whileHover={{
                    y: -5,
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                  whileTap={{ scale: 0.97 }}
                  className={`stage-mobile-card snap-center shrink-0 w-[82vw] max-w-[280px] sm:w-[260px] md:w-auto min-h-[105px] sm:min-h-[115px] p-4 sm:p-5 rounded-[22px] text-start transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden ${
                    isCurrentInMobile
                      ? 'border-2 shadow-[0_10px_25px_rgba(0,0,0,0.4)]'
                      : 'border hover:border-white/20'
                  }`}
                  style={{
                    backgroundColor: 'rgba(32, 33, 53, 0.75)',
                    backdropFilter: 'blur(16px)',
                    borderColor: isCurrentInMobile ? accentColor : 'rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {/* Glowing ambient corner orb */}
                  <div
                    className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl pointer-events-none transition-opacity duration-300 group-hover:opacity-40"
                    style={{
                      backgroundColor: accentColor,
                      opacity: isCurrentInMobile ? 0.25 : 0.1,
                    }}
                  />

                  {/* Top row: Stage number badge & weight pill */}
                  <div className="flex items-center justify-between w-full mb-3 relative z-10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-pixel font-bold px-2 py-0.5 rounded bg-white/10 text-white border border-white/10 group-hover:border-[#c3f937]/40 transition-colors">
                        STAGE {stage.stageNumberStr}
                      </span>
                    </div>

                    <span
                      className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border transition-transform group-hover:scale-105"
                      style={{
                        backgroundColor: `${accentColor}18`,
                        borderColor: `${accentColor}40`,
                        color: accentColor,
                      }}
                    >
                      {stage.weight}%
                    </span>
                  </div>

                  {/* Bottom row: Stage short title + animated chevron */}
                  <div className="flex items-center justify-between w-full relative z-10 mt-auto">
                    <span className="text-sm sm:text-base font-bold text-[#e7edfd] group-hover:text-[#c3f937] transition-colors leading-snug">
                      {title}
                    </span>

                    <motion.div
                      animate={{
                        x: isAr ? [-2, 2, -2] : [2, -2, 2],
                      }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.8,
                        ease: 'easeInOut',
                      }}
                      className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[#e7edfd]/60 group-hover:text-[#c3f937] group-hover:bg-[#c3f937]/15 transition-all shrink-0 ms-2"
                    >
                      <ChevronRight
                        className={`w-3.5 h-3.5 transition-transform ${
                          isAr ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    </motion.div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE ONLY: INTERACTIVE STAGE DOTS STEP TRACKER          */}
        {/* Allows tapping directly to navigate to stage 1..5         */}
        {/* ========================================================= */}
        <div className="md:hidden flex items-center justify-center gap-2 pt-2">
          {JUDGING_STAGES.map((stg, i) => {
            const isSelected = i === currentMobileIndex;
            return (
              <button
                key={stg.id}
                type="button"
                onClick={() => scrollToCardIndex(i)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isSelected
                    ? 'w-7 h-2 bg-[#c3f937] shadow-[0_0_8px_#c3f937]'
                    : 'w-2 h-2 bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`${isAr ? 'المرحلة' : 'Stage'} ${i + 1}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
