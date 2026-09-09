import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { Language } from '../types';
import { JUDGING_STAGES } from '../data';

interface StickyStageBarProps {
  lang: Language;
}

export const StickyStageBar: React.FC<StickyStageBarProps> = ({ lang }) => {
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      // Calculate overall page scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(Math.max((window.scrollY / totalHeight) * 100, 0), 100);
        setScrollProgress(progress);
      }

      // Check which stage is currently in view
      const stages = [1, 2, 3, 4, 5];
      for (const id of stages) {
        const element = document.getElementById(`stage-section-${id}`);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If stage section top is near or above mid-screen and bottom is below top
          if (rect.top <= 260 && rect.bottom >= 120) {
            setActiveStageId(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const activeStage = JUDGING_STAGES.find((s) => s.id === activeStageId) || JUDGING_STAGES[0];
  const isAr = lang === 'ar';

  const scrollToStage = (id: number) => {
    const el = document.getElementById(`stage-section-${id}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      id="sticky-stage-bar"
      className="sticky top-[68px] z-30 w-full border-y border-white/[0.08] bg-[#0c1018]/92 backdrop-blur-xl transition-all"
      style={{ height: 'auto', minHeight: '44px' }}
    >
      {/* Top laser progress bar */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-white/5 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#c3f937] via-[#a855f7] to-[#fb50c3]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="judging-container py-2 sm:py-2.5">
        <div className="flex items-center justify-between gap-3 text-xs sm:text-sm">
          {/* Active stage info */}
          <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c3f937] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#c3f937]" />
            </span>

            {/* Desktop text */}
            <div className="hidden sm:flex items-center gap-2 truncate">
              <span className="text-[#e7edfd]/60 font-mono text-xs">
                {isAr ? 'المرحلة النشطة:' : 'Active Stage:'}
              </span>
              <span className="font-bold text-[#e7edfd] truncate">
                {isAr ? activeStage.translations.ar.title : activeStage.translations.en.title}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-[#c3f937] font-mono font-bold">
                {activeStage.weight}%
              </span>
            </div>

            {/* Mobile text */}
            <div className="sm:hidden flex items-center gap-1.5 truncate">
              <span className="font-bold text-[#e7edfd] truncate text-xs">
                {isAr
                  ? `المرحلة 0${activeStage.id} • ${activeStage.translations.ar.shortTitle} (${activeStage.weight}%)`
                  : `Stage 0${activeStage.id} • ${activeStage.translations.en.shortTitle} (${activeStage.weight}%)`}
              </span>
            </div>
          </div>

          {/* Right side navigation jumps (Desktop) & Total */}
          <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
            {/* Direct stage buttons for desktop with smooth active pill */}
            <div className="hidden md:flex items-center gap-1">
              {JUDGING_STAGES.map((stage) => {
                const isActive = stage.id === activeStageId;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => scrollToStage(stage.id)}
                    className={`relative px-2.5 py-1 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                      isActive
                        ? 'text-[#c3f937] font-bold'
                        : 'text-[#e7edfd]/60 hover:text-white hover:bg-white/5'
                    }`}
                    title={isAr ? stage.translations.ar.title : stage.translations.en.title}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-stage-pill"
                        className="absolute inset-0 rounded-lg bg-[#c3f937]/15 border border-[#c3f937]/35 -z-10 shadow-[0_0_10px_rgba(195,249,55,0.15)]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    0{stage.id}
                  </button>
                );
              })}
            </div>

            {/* Total criteria and score tags */}
            <div className="flex items-center gap-2 font-mono text-[11px] sm:text-xs text-[#e7edfd]/80">
              <span className="hidden sm:inline px-2 py-0.5 rounded bg-white/5 border border-white/5">
                11 Criteria
              </span>
              <span className="px-2 py-0.5 rounded bg-[#c3f937]/15 text-[#c3f937] font-bold border border-[#c3f937]/30">
                100% Total
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
