import React from 'react';
import type { Language } from '../../judging-criteria/types';
import { MOBILE_NAV_ITEMS } from './mobileNavigationConfig';
import type { MobileNavItem } from './mobileNavigationConfig';
import { useScrollHUD } from './useScrollHUD';
import { MascotImage } from './MascotImage';

interface MobileGameHUDProps {
  lang: Language;
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileGameHUD: React.FC<MobileGameHUDProps> = ({
  lang,
  currentPath,
  onNavigate,
}) => {
  // Prohibit rendering in /admin or /admin/* routes
  const cleanPath = currentPath.toLowerCase().replace(/\/$/, '') || '/';
  if (cleanPath.startsWith('/admin')) {
    return null;
  }

  const { mode, mascotState, isMobile, forceExpand } = useScrollHUD(currentPath);

  // Strictly do not render on desktop widths (>= 768px)
  if (!isMobile) {
    return null;
  }

  const isAr = lang === 'ar';

  const handleItemClick = (e: React.MouseEvent, item: MobileNavItem) => {
    e.preventDefault();
    onNavigate(item.href);
  };

  const isItemActive = (item: MobileNavItem): boolean => {
    if (item.id === 'criteria') {
      return cleanPath === '/معايير-التحكيم' || cleanPath === '/judging-criteria';
    }
    if (item.id === 'tracks') {
      return (
        cleanPath === '/المسارات' ||
        cleanPath === '/tracks' ||
        cleanPath === '/' ||
        cleanPath === ''
      );
    }
    return false;
  };

  return (
    <nav
      id="buildx-mobile-game-hud"
      aria-label={isAr ? 'شريط التنقل التفاعلي للجوال' : 'Mobile HUD Navigation'}
      className="hud-stage"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {mode === 'compact' ? (
        /* COMPACT STATE: Interactive Pixel-Mascot Capsule */
        <button
          type="button"
          onClick={forceExpand}
          className="game-hud game-hud-compact"
          aria-label={isAr ? 'فتح قائمة التنقل' : 'Open navigation'}
          title={isAr ? 'فتح قائمة التنقل' : 'Open navigation'}
        >
          <MascotImage state={mascotState} size={48} />
        </button>
      ) : (
        /* EXPANDED STATE: Full Four-Tab Glassmorphic Navigation Bar */
        <div
          className="game-hud game-hud-expanded"
          onFocus={forceExpand}
        >
          {/* Status Node Mascot centered above the HUD edge */}
          <div className="hud-expanded-status-node" aria-hidden="true">
            <MascotImage state={mascotState} size={42} />
          </div>

          {/* 4-Tab Navigation Grid */}
          <div className="hud-tabs">
            {MOBILE_NAV_ITEMS.map((item) => {
              const active = isItemActive(item);
              const label = isAr ? item.labelAr : item.labelEn;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={(e) => handleItemClick(e, item)}
                  aria-current={active ? 'page' : undefined}
                  className={`hud-nav-item ${active ? 'hud-nav-item-active' : ''}`}
                >
                  <Icon className="w-[22px] h-[22px] transition-transform" />
                  <span className="hud-nav-item-label">{label}</span>
                  {active && <div className="hud-active-indicator" aria-hidden="true" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};
