import type { LucideIcon } from 'lucide-react';

export type CriterionWeight = 5 | 10;

export type AccentColor = 'lime' | 'pink' | 'violet' | 'orange';

export type Language = 'ar' | 'en';

export interface JudgingCriterion {
  id: number;
  stageId: number;
  stageNumberStr: string; // "01", "02", etc.
  criterionNumberStr: string; // "01" - "11"
  weight: CriterionWeight;
  accent: AccentColor;
  icon: LucideIcon;
  translations: {
    ar: {
      title: string;
      stageLabel: string;
      description: string;
      checkpointsTitle: string;
      checkpoints: string[];
    };
    en: {
      title: string;
      stageLabel: string;
      description: string;
      checkpointsTitle: string;
      checkpoints: string[];
    };
  };
}

export interface JudgingStage {
  id: number;
  stageNumberStr: string; // "01", "02", etc.
  weight: number; // e.g. 20, 30
  accent: AccentColor;
  translations: {
    ar: {
      title: string;
      shortTitle: string;
      ordinal: string; // "المرحلة الأولى"
      subtitle: string;
      weightLabel: string; // "20% من التقييم"
    };
    en: {
      title: string;
      shortTitle: string;
      ordinal: string; // "Stage One"
      subtitle: string;
      weightLabel: string; // "20% of Score"
    };
  };
  criteria: JudgingCriterion[];
}
