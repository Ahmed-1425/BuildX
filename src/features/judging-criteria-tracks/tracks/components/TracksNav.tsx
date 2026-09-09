import React from 'react';
import { motion } from 'motion/react';
import type { Language, TrackId } from '../types';
import { CHALLENGE_TRACKS } from '../data';

interface TracksNavProps {
  lang: Language;
  activeTrackId: TrackId;
  onSelectTrack?: (id: TrackId) => void;
}

export const TracksNav: React.FC<TracksNavProps> = ({
  lang,
  activeTrackId,
  onSelectTrack,
}) => {
  const isAr = lang === 'ar';

  const scrollToTrack = (id: TrackId) => {
    if (onSelectTrack) {
      onSelectTrack(id);
    }
    const element = document.getElementById(`track-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      id="tracks-nav-section"
      aria-label={isAr ? 'التنقل بين المسارات' : 'Tracks Navigation'}
      className="sticky top-[68px] z-30 w-full py-3.5 bg-[#0c1018]/92 backdrop-blur-xl border-y border-white/[0.08] transition-all"
    >
      <div className="tracks-container">
        {/* Desktop: Centered 3-column control */}
        <div className="hidden md:flex items-center justify-center">
          <div className="inline-flex items-center gap-2 p-1.5 rounded-2xl bg-[#141724]/90 border border-white/10 shadow-lg">
            {CHALLENGE_TRACKS.map((track) => {
              const isActive = track.id === activeTrackId;
              const trackContent = isAr ? track.translations.ar : track.translations.en;
              const Icon = track.icon;

              return (
                <button
                  key={track.id}
                  type="button"
                  onClick={() => scrollToTrack(track.id)}
                  className={`relative min-h-[44px] px-6 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center gap-2.5 select-none ${
                    isActive ? 'text-white font-bold' : 'text-[#e7edfd]/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {/* Sliding animated active indicator with track-specific accent */}
                  {isActive && (
                    <motion.div
                      layoutId="active-track-pill"
                      className="absolute inset-0 rounded-xl border -z-10 shadow-md"
                      style={{
                        backgroundColor: `${track.accent}20`,
                        borderColor: `${track.accent}60`,
                        boxShadow: `0 0 15px ${track.accent}25`,
                      }}
                      transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    />
                  )}

                  <span
                    className="font-mono text-xs font-bold px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: isActive ? `${track.accent}30` : 'rgba(255, 255, 255, 0.08)',
                      color: isActive ? track.accent : 'inherit',
                    }}
                  >
                    {track.number}
                  </span>

                  <Icon
                    className="w-4 h-4 shrink-0 transition-transform"
                    style={{ color: isActive ? track.accent : 'currentColor' }}
                    aria-hidden="true"
                  />

                  <span>{trackContent.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile: Horizontal snap scroll with touch targets at least 48px */}
        <div className="md:hidden flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-1 py-0.5">
          {CHALLENGE_TRACKS.map((track) => {
            const isActive = track.id === activeTrackId;
            const trackContent = isAr ? track.translations.ar : track.translations.en;
            const Icon = track.icon;

            return (
              <button
                key={track.id}
                type="button"
                onClick={() => scrollToTrack(track.id)}
                className={`snap-center shrink-0 min-h-[48px] px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 border select-none ${
                  isActive
                    ? 'border-transparent text-white font-bold shadow-md'
                    : 'bg-[#141724]/80 text-[#e7edfd]/70 border-white/10'
                }`}
                style={{
                  backgroundColor: isActive ? `${track.accent}25` : undefined,
                  borderColor: isActive ? `${track.accent}70` : undefined,
                  boxShadow: isActive ? `0 0 12px ${track.accent}30` : undefined,
                }}
              >
                <span
                  className="font-mono text-xs font-bold px-1.5 py-0.5 rounded"
                  style={{
                    backgroundColor: isActive ? `${track.accent}40` : 'rgba(255, 255, 255, 0.1)',
                    color: isActive ? track.accent : 'inherit',
                  }}
                >
                  {track.number}
                </span>

                <Icon
                  className="w-4 h-4 shrink-0"
                  style={{ color: isActive ? track.accent : 'currentColor' }}
                  aria-hidden="true"
                />

                <span className="whitespace-nowrap">{trackContent.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
