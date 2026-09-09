import React from 'react';

export type MascotState =
  | 'ready'
  | 'thinking'
  | 'building'
  | 'loading'
  | 'success'
  | 'error';

export type HUDMode = 'expanded' | 'compact';

export type MobileNavId = 'criteria' | 'tracks';

export interface MobileNavItem {
  id: MobileNavId;
  labelAr: string;
  labelEn: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

export interface MascotStateConfig {
  src: string;
  labelAr: string;
  labelEn: string;
}

export const MASCOT_STATES: Record<MascotState, MascotStateConfig> = {
  ready: {
    src: 'https://i.ibb.co/60KJjkys/Ready.png',
    labelAr: 'جاهز',
    labelEn: 'Ready',
  },
  thinking: {
    src: 'https://i.ibb.co/xKHb1dmC/Thinking.png',
    labelAr: 'يفكر',
    labelEn: 'Thinking',
  },
  building: {
    src: 'https://i.ibb.co/Cf0H0G8/Building.png',
    labelAr: 'يبني',
    labelEn: 'Building',
  },
  loading: {
    src: 'https://i.ibb.co/mKcnZK3/Loading.png',
    labelAr: 'يختبر',
    labelEn: 'Testing',
  },
  success: {
    src: 'https://i.ibb.co/M5cv9vZd/Success.png',
    labelAr: 'اكتمل',
    labelEn: 'Success',
  },
  error: {
    src: 'https://i.ibb.co/23KKdQJS/Error.png',
    labelAr: 'تنبيه',
    labelEn: 'Alert',
  },
};

export const HUD_COLORS = {
  void: '#0c1018',
  lime: '#c3f937',
  pink: '#fb50c3',
  purple: '#34155f',
  warm: '#823419',
  text: '#e7edfd',
  muted: 'rgba(231, 237, 253, 0.62)',
} as const;

/**
 * Custom Pixel-Style SVG Icons for Judging Criteria & Tracks
 */

// Pixel Trophy / Evaluation Badge Icon for "معايير التحكيم" (Judging Criteria)
export const PixelCriteriaIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="w-6 h-6 shrink-0"
    {...props}
  >
    {/* Trophy rim & cup */}
    <rect x="5" y="4" width="14" height="2" />
    <rect x="5" y="6" width="14" height="6" />
    <rect x="7" y="12" width="10" height="2" />
    <rect x="9" y="14" width="6" height="2" />
    {/* Trophy handles */}
    <rect x="3" y="6" width="2" height="4" />
    <rect x="19" y="6" width="2" height="4" />
    {/* Trophy stem & base */}
    <rect x="11" y="16" width="2" height="3" />
    <rect x="7" y="19" width="10" height="2" />
    {/* Star / sparkle on cup */}
    <rect x="11" y="7" width="2" height="2" fill="#c3f937" />
    <rect x="10" y="8" width="4" height="1" fill="#c3f937" />
  </svg>
);

// Pixel Tracks / Branching Circuits Icon for "المسارات" (Tracks)
export const PixelTracksIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="w-6 h-6 shrink-0"
    {...props}
  >
    {/* Three parallel & interconnected track layers */}
    {/* Top track */}
    <rect x="4" y="4" width="16" height="3" />
    <rect x="17" y="4" width="3" height="3" fill="#c3f937" />
    {/* Middle track */}
    <rect x="4" y="10" width="16" height="3" />
    <rect x="10" y="10" width="4" height="3" fill="#fb50c3" />
    {/* Bottom track */}
    <rect x="4" y="16" width="16" height="3" />
    <rect x="4" y="16" width="3" height="3" fill="#c3f937" />
    {/* Track connectors */}
    <rect x="7" y="7" width="2" height="3" fill="#c3f937" />
    <rect x="15" y="13" width="2" height="3" fill="#fb50c3" />
  </svg>
);

export const MOBILE_NAV_ITEMS: MobileNavItem[] = [
  {
    id: 'criteria',
    labelAr: 'معايير التحكيم',
    labelEn: 'Judging Criteria',
    href: '/معايير-التحكيم',
    icon: PixelCriteriaIcon,
  },
  {
    id: 'tracks',
    labelAr: 'المسارات',
    labelEn: 'Tracks',
    href: '/المسارات',
    icon: PixelTracksIcon,
  },
];
