import React, { useEffect, useState } from 'react';
import type { Language } from '../types';
import { JUDGING_STAGES, TOTAL_CRITERIA_COUNT, TOTAL_CRITERIA_WEIGHT } from '../data';
import { Header } from './Header';
import { StickyStageBar } from './StickyStageBar';
import { HeroSection } from './HeroSection';
import { StagesOverview } from './StagesOverview';
import { StageSection } from './StageSection';
import { ScoreCalculationSection } from './ScoreCalculationSection';
import { ReminderCard } from './ReminderCard';
import { CtaSection } from './CtaSection';
import { Footer } from './Footer';

interface JudgingCriteriaPageProps {
  initialLanguage?: Language;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  lang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const JudgingCriteriaPage: React.FC<JudgingCriteriaPageProps> = ({
  initialLanguage = 'ar',
  currentPath = '/معايير-التحكيم',
  onNavigate,
  lang: propLang,
  onLanguageChange,
}) => {
  const [internalLang, setInternalLang] = useState<Language>(initialLanguage);
  const lang = propLang || internalLang;

  const handleLanguageChange = (newLang: Language) => {
    setInternalLang(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  // Sync document dir and lang attributes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Handle in-page routing/navigation
  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div
      id="judging-criteria-page-root"
      className="judging-bg min-h-screen text-[#e7edfd] flex flex-col relative selection:bg-[#c3f937] selection:text-[#0c1018] pb-[calc(96px+env(safe-area-inset-bottom,0px))] md:pb-0"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* 1. BUILDx Header */}
      <Header
        lang={lang}
        onLanguageChange={handleLanguageChange}
        currentPath={currentPath}
        onNavigate={handleNavigate}
      />

      {/* 2. Compact Sticky Stage Progress Bar */}
      <StickyStageBar lang={lang} />

      {/* Main Content Flow */}
      <main id="judging-criteria-main" className="flex-1 w-full">
        {/* 3. Hero Section with 100% SVG Gauge */}
        <HeroSection lang={lang} onNavigate={handleNavigate} />

        {/* 4. Five-Stage Overview */}
        <StagesOverview lang={lang} />

        {/* 5 - 9. Stage 1 to Stage 5 Criteria Sections */}
        {JUDGING_STAGES.map((stage) => (
          <StageSection key={stage.id} stage={stage} lang={lang} />
        ))}

        {/* 10. Score Calculation Section */}
        <ScoreCalculationSection lang={lang} />

        {/* 11. Reminder Card */}
        <ReminderCard lang={lang} />

        {/* 12. Final CTA Section */}
        <CtaSection lang={lang} onNavigate={handleNavigate} />
      </main>

      {/* 13. BUILDx Footer */}
      <Footer lang={lang} onNavigate={handleNavigate} currentPath={currentPath} />
    </div>
  );
};
