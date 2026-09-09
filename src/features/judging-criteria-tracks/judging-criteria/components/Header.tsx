import React, { useState } from 'react';
import type { Language } from '../types';
import { AssetPlaceholder } from './AssetPlaceholder';
import { Globe, Menu, X, ArrowLeft, ArrowRight } from 'lucide-react';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (newLang: Language) => void;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onLanguageChange,
  currentPath,
  onNavigate,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isAr = lang === 'ar';

  const navLinks = [
    {
      titleAr: 'معايير التحكيم',
      titleEn: 'Judging Criteria',
      href: '/معايير-التحكيم',
      exact: true,
    },
    {
      titleAr: 'المسارات',
      titleEn: 'Tracks',
      href: '/المسارات',
    },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    onNavigate(href);
  };

  const isLinkActive = (href: string) => {
    if (href === '/معايير-التحكيم' || href === '/judging-criteria') {
      return (
        currentPath === '/معايير-التحكيم' ||
        currentPath === '/judging-criteria' ||
        currentPath.includes('judging')
      );
    }
    if (href === '/المسارات' || href === '/tracks') {
      return (
        currentPath === '/المسارات' ||
        currentPath === '/tracks' ||
        currentPath === '/' ||
        currentPath === '' ||
        currentPath.includes('tracks') ||
        currentPath.includes('المسارات')
      );
    }
    return currentPath === href;
  };

  return (
    <header
      id="buildx-main-header"
      className="sticky top-0 z-40 w-full h-[68px] border-b border-white/[0.08] bg-[#0c1018]/85 backdrop-blur-xl transition-colors"
    >
      <div className="judging-container h-full flex items-center justify-between gap-4 relative">
        {/* Start side: BUILDx Brand Logo */}
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => handleNavClick('/')}
            className="flex items-center gap-2 text-start cursor-pointer focus-visible:outline-[#c3f937] group transition-opacity hover:opacity-90"
            aria-label="BUILDx"
          >
            <img
              src="/assets/judging-criteria-tracks/الشعار /شعار BUILDx - ابيض بوهج.png"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = '/assets/judging-criteria-tracks/logo.png';
              }}
              alt="BUILDx"
              className="h-8 sm:h-9 w-auto object-contain drop-shadow-[0_0_12px_rgba(195,249,55,0.25)] transition-transform duration-200 group-hover:scale-105"
            />
          </button>
        </div>

        {/* Center Navigation Links: معايير التحكيم first, then to its left المسارات */}
        <nav
          aria-label={isAr ? 'القائمة الرئيسية' : 'Main Navigation'}
          className="hidden lg:flex items-center justify-center gap-2 absolute left-1/2 -translate-x-1/2"
        >
          {navLinks.map((link) => {
            const active = isLinkActive(link.href);
            const label = isAr ? link.titleAr : link.titleEn;
            return (
              <button
                key={link.href}
                type="button"
                onClick={() => handleNavClick(link.href)}
                aria-current={active ? 'page' : undefined}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  active
                    ? 'text-[#c3f937] bg-[#c3f937]/15 font-bold border border-[#c3f937]/30 shadow-sm shadow-[#c3f937]/10'
                    : 'text-[#e7edfd]/75 hover:text-[#e7edfd] hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            );
          })}
        </nav>

        {/* End side controls: Language switcher only */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => onLanguageChange(isAr ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono font-semibold text-[#e7edfd] border border-white/10 transition-colors cursor-pointer"
            aria-label={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
          >
            <Globe className="w-3.5 h-3.5 text-[#c3f937]" aria-hidden="true" />
            <span>{isAr ? 'English' : 'العربية'}</span>
          </button>

          {/* Mobile Menu Trigger (hidden on lg) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-white/5 text-[#e7edfd] border border-white/10 hover:bg-white/10 cursor-pointer"
            aria-label={mobileMenuOpen ? 'إغلاق القائمة' : 'فتح القائمة'}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="lg:hidden absolute top-[68px] inset-x-0 bg-[#0c1018]/95 backdrop-blur-2xl border-b border-white/10 py-4 px-6 shadow-2xl transition-all"
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => {
              const active = isLinkActive(link.href);
              const label = isAr ? link.titleAr : link.titleEn;
              return (
                <button
                  key={link.href}
                  type="button"
                  onClick={() => handleNavClick(link.href)}
                  aria-current={active ? 'page' : undefined}
                  className={`w-full text-start px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    active
                      ? 'text-[#c3f937] bg-[#c3f937]/15 font-bold border border-[#c3f937]/30'
                      : 'text-[#e7edfd]/85 hover:bg-white/5'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
