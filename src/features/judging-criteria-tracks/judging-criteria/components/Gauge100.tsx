import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import type { Language } from '../types';

interface Gauge100Props {
  lang: Language;
}

interface SegmentDef {
  id: number;
  weight: number; // 10 or 5
  color: string;
  stageNameAr: string;
  stageNameEn: string;
  titleAr: string;
  titleEn: string;
}

const SEGMENTS: SegmentDef[] = [
  { id: 1, weight: 10, color: '#c3f937', stageNameAr: 'المرحلة 1', stageNameEn: 'Stage 1', titleAr: 'فهم التحدي', titleEn: 'Discovery' },
  { id: 2, weight: 10, color: '#a3e635', stageNameAr: 'المرحلة 1', stageNameEn: 'Stage 1', titleAr: 'الابتكار', titleEn: 'Innovation' },
  { id: 3, weight: 10, color: '#a855f7', stageNameAr: 'المرحلة 2', stageNameEn: 'Stage 2', titleAr: 'التنفيذ التقني', titleEn: 'Tech Build' },
  { id: 4, weight: 5, color: '#c084fc', stageNameAr: 'المرحلة 2', stageNameEn: 'Stage 2', titleAr: 'اكتمال الـ MVP', titleEn: 'MVP Scope' },
  { id: 5, weight: 10, color: '#818cf8', stageNameAr: 'المرحلة 2', stageNameEn: 'Stage 2', titleAr: 'جودة التصميم UX', titleEn: 'Design UX' },
  { id: 6, weight: 5, color: '#a78bfa', stageNameAr: 'المرحلة 2', stageNameEn: 'Stage 2', titleAr: 'دمج الذكاء الاصطناعي', titleEn: 'AI Logic' },
  { id: 7, weight: 10, color: '#fb50c3', stageNameAr: 'المرحلة 3', stageNameEn: 'Stage 3', titleAr: 'الأثر التشغيلي', titleEn: 'Real Impact' },
  { id: 8, weight: 10, color: '#f43f5e', stageNameAr: 'المرحلة 3', stageNameEn: 'Stage 3', titleAr: 'الجدوى والقيمة', titleEn: 'Market Value' },
  { id: 9, weight: 10, color: '#e05d2b', stageNameAr: 'المرحلة 4', stageNameEn: 'Stage 4', titleAr: 'جودة العرض', titleEn: 'Pitch Quality' },
  { id: 10, weight: 10, color: '#f97316', stageNameAr: 'المرحلة 4', stageNameEn: 'Stage 4', titleAr: 'العمل الجماعي', titleEn: 'Teamwork' },
  { id: 11, weight: 10, color: '#10b981', stageNameAr: 'المرحلة 5', stageNameEn: 'Stage 5', titleAr: 'الالتزام والمشاركة', titleEn: 'Commitment' },
];

export const Gauge100: React.FC<Gauge100Props> = ({ lang }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [hoveredSegment, setHoveredSegment] = useState<SegmentDef | null>(null);

  useEffect(() => {
    let start = 0;
    const duration = 1400;
    const startTime = performance.now();

    const frame = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease out
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(ease * 100);
      setAnimatedScore(current);

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    const handle = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(handle);
  }, []);

  const size = 260;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const center = size / 2;

  // We have 11 segments with small gaps between them
  const gapDegrees = 2.8;
  const totalGapDegrees = gapDegrees * SEGMENTS.length;
  const availableDegrees = 360 - totalGapDegrees;

  let currentAngle = -90; // Start at top (12 o'clock)

  const arcPaths = SEGMENTS.map((seg) => {
    const sweepDegrees = (seg.weight / 100) * availableDegrees;
    const startAngle = currentAngle;
    const endAngle = startAngle + sweepDegrees;
    currentAngle = endAngle + gapDegrees;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRad);
    const y1 = center + radius * Math.sin(startRad);
    const x2 = center + radius * Math.cos(endRad);
    const y2 = center + radius * Math.sin(endRad);

    const largeArcFlag = sweepDegrees > 180 ? 1 : 0;
    const d = `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;

    return {
      ...seg,
      d,
    };
  });

  const isAr = lang === 'ar';

  return (
    <motion.div
      id="gauge-100-card"
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="buildx-glass relative w-full max-w-[360px] mx-auto rounded-[28px] p-6 sm:p-7 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-white/25 overflow-hidden shadow-2xl"
    >
      {/* Dynamic ambient glow behind gauge */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          repeat: Infinity,
          duration: 4,
          ease: 'easeInOut',
        }}
        className="absolute w-52 h-52 rounded-full pointer-events-none blur-3xl -z-10"
        style={{
          background: hoveredSegment
            ? `radial-gradient(circle, ${hoveredSegment.color} 0%, transparent 70%)`
            : 'radial-gradient(circle, #c3f937 0%, #fb50c3 80%)',
        }}
      />

      {/* Header brand tag */}
      <div className="flex items-center justify-between w-full mb-3 px-1">
        <span className="text-[11px] font-mono tracking-wider text-[#c3f937] px-2.5 py-1 rounded-md bg-[#c3f937]/10 border border-[#c3f937]/25 uppercase font-bold">
          BUILDx // EVAL-100
        </span>
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c3f937] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c3f937]" />
          </span>
          <span className="text-[11px] font-mono font-bold text-[#e7edfd]/80">
            {isAr ? '11 معيارًا معتمدًا' : '11 Total Criteria'}
          </span>
        </div>
      </div>

      {/* Circular SVG Gauge */}
      <div className="relative w-[240px] h-[240px] sm:w-[260px] sm:h-[260px] flex items-center justify-center my-2">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full"
          aria-label={isAr ? 'مخطط 11 معيارًا للتقييم' : '11 Criteria Evaluation Gauge'}
        >
          {/* Background track circle */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(231, 237, 253, 0.06)"
            strokeWidth={strokeWidth}
          />

          {/* 11 Rounded segments with animated drawing and hover interaction */}
          {arcPaths.map((arc, index) => {
            const isHovered = hoveredSegment?.id === arc.id;
            return (
              <motion.path
                key={arc.id}
                d={arc.d}
                fill="none"
                stroke={arc.color}
                strokeWidth={isHovered ? strokeWidth + 4 : strokeWidth}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  duration: 0.9,
                  delay: index * 0.06,
                  ease: 'easeOut',
                }}
                onMouseEnter={() => setHoveredSegment(arc)}
                onMouseLeave={() => setHoveredSegment(null)}
                className="cursor-pointer transition-all duration-200"
                style={{
                  filter: isHovered ? `drop-shadow(0 0 8px ${arc.color})` : undefined,
                }}
              >
                <title>{`#${arc.id} ${isAr ? arc.titleAr : arc.titleEn} (${arc.weight}%)`}</title>
              </motion.path>
            );
          })}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="text-[11px] font-pixel tracking-wider text-[#c3f937] uppercase mb-0.5">
            {hoveredSegment
              ? `#${hoveredSegment.id} ${hoveredSegment.weight}%`
              : 'BUILDx'}
          </span>

          <div className="flex items-baseline justify-center">
            <span className="text-5xl sm:text-6xl font-display font-black tracking-tight text-[#e7edfd] leading-none drop-shadow-lg">
              {animatedScore}
            </span>
            <span className="text-2xl sm:text-3xl font-display font-bold text-[#c3f937] ms-0.5">
              %
            </span>
          </div>

          <span className="text-xs sm:text-sm font-semibold text-[#e7edfd]/90 mt-1 max-w-[160px] line-clamp-1">
            {hoveredSegment
              ? isAr ? hoveredSegment.titleAr : hoveredSegment.titleEn
              : isAr ? 'إجمالي التقييم النهائي' : 'Total Evaluation'}
          </span>
        </div>
      </div>

      {/* Bottom info banner */}
      <div className="w-full mt-2 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs px-1">
        <span className="text-[#e7edfd]/70 font-mono text-[11px]">
          {isAr ? 'المراحل الـ 5' : '5 Stages'}
        </span>
        <span className="text-[#c3f937] font-bold font-mono text-[11px]">
          {isAr ? '100% الدرجة الكاملة' : '100% Full Score'}
        </span>
      </div>
    </motion.div>
  );
};
