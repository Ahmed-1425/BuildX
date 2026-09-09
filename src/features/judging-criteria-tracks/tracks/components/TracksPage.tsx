import React, { useEffect, useState } from 'react';
import type { Language, TrackId } from '../types';
import { CHALLENGE_TRACKS } from '../data';
import { Header } from '../../judging-criteria/components/Header';
import { Footer } from '../../judging-criteria/components/Footer';
import { TracksHero } from './TracksHero';
import { TracksNav } from './TracksNav';
import { TrackSection } from './TrackSection';
import { TracksCta } from './TracksCta';

interface TracksPageProps {
  initialLanguage?: Language;
  currentPath?: string;
  onNavigate?: (path: string) => void;
  lang?: Language;
  onLanguageChange?: (lang: Language) => void;
}

export const TracksPage: React.FC<TracksPageProps> = ({
  initialLanguage = 'ar',
  currentPath = '/المسارات',
  onNavigate,
  lang: propLang,
  onLanguageChange,
}) => {
  const [internalLang, setInternalLang] = useState<Language>(initialLanguage);
  const lang = propLang || internalLang;
  const [activeTrackId, setActiveTrackId] = useState<TrackId>('mahara');

  const handleLanguageChange = (newLang: Language) => {
    setInternalLang(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  // Sync document dir, lang attributes and document title
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title =
      lang === 'ar'
        ? 'مسارات التحدي | BUILDx'
        : 'Challenge Tracks | BUILDx';
  }, [lang]);

  // Handle active track on scroll with IntersectionObserver / scroll detection
  useEffect(() => {
    const trackIds: TrackId[] = ['mahara', 'silsilah', 'nama'];

    const handleScroll = () => {
      for (const id of trackIds) {
        const el = document.getElementById(`track-${id}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If track section is around reading height in viewport
          if (rect.top <= 280 && rect.bottom >= 140) {
            setActiveTrackId(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      id="tracks-page-root"
      className="judging-bg min-h-screen text-[#e7edfd] flex flex-col relative selection:bg-[#c3f937] selection:text-[#0c1018] pb-[calc(96px+env(safe-area-inset-bottom,0px))] md:pb-0"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* 1. Existing Reused BUILDx Header */}
      <Header
        lang={lang}
        onLanguageChange={handleLanguageChange}
        currentPath={currentPath}
        onNavigate={handleNavigate}
      />

      {/* Main Narrative Content Flow */}
      <main id="tracks-main" className="flex-1 w-full">
        {/* 2. Tracks Hero */}
        <TracksHero lang={lang} />

        {/* 3. Compact Tracks Navigation */}
        <TracksNav
          lang={lang}
          activeTrackId={activeTrackId}
          onSelectTrack={setActiveTrackId}
        />

        {/* 4. Mahara Section (Track 01) */}
        <TrackSection
          track={CHALLENGE_TRACKS[0]}
          lang={lang}
          index={0}
        />

        {/* 5. Silsilah Section (Track 02) */}
        <TrackSection
          track={CHALLENGE_TRACKS[1]}
          lang={lang}
          index={1}
        />

        {/* 6. Nama Section (Track 03) */}
        <TrackSection
          track={CHALLENGE_TRACKS[2]}
          lang={lang}
          index={2}
        />

        {/* 7. Final CTA */}
        <TracksCta lang={lang} onNavigate={handleNavigate} />
      </main>

      {/* 8. Existing Reused BUILDx Footer */}
      <Footer lang={lang} onNavigate={handleNavigate} />
    </div>
  );
};
