import type { ComponentType } from 'react';

export type Language = 'ar' | 'en';

export type TrackId = 'mahara' | 'silsilah' | 'nama';

export interface TrackLocalizedContent {
  name: string;
  subtitle: string;
  trackBadge: string;
  description: string;
  challengeQuestionLabel: string;
  challengeQuestion: string;
  expectedOutputLabel: string;
  expectedOutput: string;
  beneficiariesLabel: string;
  beneficiaries: string[];
}

export interface ChallengeTrack {
  id: TrackId;
  number: '01' | '02' | '03';
  name: string;
  subtitle: string;
  description: string;
  challengeQuestion: string;
  expectedOutput: string;
  beneficiaries: string[];
  accent: string;
  secondaryAccent: string;
  icon: ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  logoSrc: string | null;
  translations: {
    ar: TrackLocalizedContent;
    en: TrackLocalizedContent;
  };
}
