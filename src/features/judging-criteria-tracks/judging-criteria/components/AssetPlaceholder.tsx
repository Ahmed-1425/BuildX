import React from 'react';
import { Image as ImageIcon, Sparkles } from 'lucide-react';

interface AssetPlaceholderProps {
  id?: string;
  labelAr: string;
  labelEn: string;
  recommendedSize?: string;
  aspectRatio?: string;
  className?: string;
  variant?: 'logo' | 'mascot' | 'banner';
  src?: string;
  alt?: string;
}

export const AssetPlaceholder: React.FC<AssetPlaceholderProps> = ({
  id,
  labelAr,
  labelEn,
  recommendedSize = '240x80 px',
  className = '',
  variant = 'logo',
  src,
  alt,
}) => {
  if (src) {
    return (
      <img
        id={id}
        src={src}
        alt={alt || labelEn}
        className={className}
        loading="lazy"
      />
    );
  }

  const isMascot = variant === 'mascot';

  return (
    <div
      id={id}
      className={`relative group overflow-hidden rounded-2xl border border-dashed border-[#fb50c3]/30 bg-[#202135]/40 p-4 transition-all duration-300 hover:border-[#c3f937]/50 hover:bg-[#202135]/60 flex flex-col items-center justify-center text-center ${className}`}
      style={{ backdropFilter: 'blur(10px)' }}
    >
      {/* Decorative corner cyber marks */}
      <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-[#c3f937]/60" />
      <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-[#fb50c3]/60" />

      <div className="w-10 h-10 rounded-xl bg-[#0c1018]/80 border border-white/10 flex items-center justify-center text-[#c3f937] mb-2 shadow-inner">
        {isMascot ? (
          <Sparkles className="w-5 h-5 text-[#fb50c3] animate-pulse" aria-hidden="true" />
        ) : (
          <ImageIcon className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
        )}
      </div>

      <span className="text-xs font-semibold text-[#e7edfd] tracking-wide block">
        {labelAr}
      </span>
      <span className="text-[11px] text-[#e7edfd]/60 font-mono mt-0.5 block">
        {labelEn}
      </span>

      {recommendedSize && (
        <span className="mt-2 text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-[#c3f937]/80 border border-white/5">
          {recommendedSize}
        </span>
      )}
    </div>
  );
};
