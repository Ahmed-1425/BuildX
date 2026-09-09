import React from 'react';

export interface TrackLogoSlotProps {
  logoSrc: string | null;
  trackName: string;
  accent: string;
  className?: string;
}

export const TrackLogoSlot: React.FC<TrackLogoSlotProps> = ({
  logoSrc,
  trackName,
  accent,
  className = '',
}) => {
  // When no logo is provided yet
  if (!logoSrc) {
    return null;
  }

  const getFallbackSrc = () => {
    if (trackName.includes('مهارة') || trackName.toLowerCase().includes('mahara')) {
      return '/assets/judging-criteria-tracks/tracks/mahara.png';
    }
    if (trackName.includes('سلسلة') || trackName.toLowerCase().includes('silsilah')) {
      return '/assets/judging-criteria-tracks/tracks/silsilah.png';
    }
    if (trackName.includes('نماء') || trackName.toLowerCase().includes('nama')) {
      return '/assets/judging-criteria-tracks/tracks/namaa.png';
    }
    return '/assets/judging-criteria-tracks/logo.png';
  };

  // Display logo cleanly with subtle ambient glow and zero unnecessary frames or borders
  return (
    <div
      className={`track-logo-slot relative w-full max-w-[500px] flex items-center justify-center py-2 ${className}`}
    >
      {/* Ambient background glow matching track accent */}
      <div
        className="absolute inset-0 -inset-x-8 blur-3xl pointer-events-none opacity-30"
        style={{
          background: `radial-gradient(ellipse at center, ${accent}50 0%, transparent 70%)`,
        }}
      />
      <img
        src={logoSrc}
        onError={(e) => {
          const fallback = getFallbackSrc();
          const target = e.currentTarget as HTMLImageElement;
          if (target.src !== fallback && !target.src.endsWith(fallback)) {
            target.src = fallback;
          }
        }}
        alt={`شعار مسار ${trackName}`}
        className="w-full max-h-[220px] sm:max-h-[260px] md:max-h-[300px] object-contain relative z-10 filter drop-shadow-[0_12px_28px_rgba(0,0,0,0.55)] transition-transform duration-300 hover:scale-[1.02]"
        loading="lazy"
      />
    </div>
  );
};
