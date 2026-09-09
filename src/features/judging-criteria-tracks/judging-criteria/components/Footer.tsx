import React from 'react';
import type { Language } from '../types';
import { AssetPlaceholder } from './AssetPlaceholder';

interface FooterProps {
  lang: Language;
  onNavigate: (path: string) => void;
  currentPath?: string;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate, currentPath }) => {
  const isAr = lang === 'ar';
  const isJudging = currentPath === '/معايير-التحكيم' || currentPath === '/judging-criteria';
  const isTracks = currentPath === '/المسارات' || currentPath === '/tracks';

  return (
    <footer
      id="buildx-main-footer"
      className="border-t border-white/[0.08] bg-[#080b11] pt-12 pb-10 text-[#e7edfd]/70"
    >
      <div className="judging-container">
        {/* Brand info & Logo only */}
        <div className="flex flex-col items-center text-center max-w-xl mx-auto mb-10">
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="mb-5 cursor-pointer focus-visible:outline-[#c3f937] group transition-opacity hover:opacity-90"
            aria-label="BUILDx"
          >
            <img
              src="/assets/judging-criteria-tracks/الشعار /شعار BUILDx - ابيض بوهج.png"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/judging-criteria-tracks/logo.png';
              }}
              alt="BUILDx"
              className="h-10 sm:h-11 w-auto object-contain drop-shadow-[0_0_14px_rgba(195,249,55,0.28)] transition-transform duration-200 group-hover:scale-105"
            />
          </button>
          <p className="text-sm sm:text-base text-[#e7edfd]/80 leading-relaxed mb-4">
            {isAr
              ? 'مبادرة وطنية لبناء الجيل القادم من المنتجات الرقمية الفعالة وتطبيقات الذكاء الاصطناعي في بيئة تنافسية تمكينية.'
              : 'A nationwide initiative to build the next generation of impactful digital products and AI applications in an empowering hackathon ecosystem.'}
          </p>
          <span className="text-xs font-mono text-[#c3f937]/90 px-3 py-1 rounded bg-[#c3f937]/10 border border-[#c3f937]/20">
            BUILDx // HACKATHON & INCUBATOR
          </span>
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#e7edfd]/50">
          <p>© {new Date().getFullYear()} BUILDx. {isAr ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}</p>
          <div className="flex items-center gap-4 font-mono text-[11px]">
            <span>3 Tracks</span>
            <span>•</span>
            <span>11 Criteria</span>
            <span>•</span>
            <span className="text-[#c3f937]">BUILDx Ecosystem</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
