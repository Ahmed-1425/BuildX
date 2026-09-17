"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatNumber, toLatinDigits } from "@/lib/admin/formatters";

type AccentColor = "lime" | "pink" | "purple" | "cyan" | "gold";

interface Props {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accentColor?: AccentColor;
  href?: string;
}

const ACCENT_STYLES: Record<AccentColor, { text: string; iconBg: string; topLine: string }> = {
  lime: {
    text: "text-[#c3f937]",
    iconBg: "bg-[#c3f937]/10 text-[#c3f937] border-[#c3f937]/25",
    topLine: "bg-gradient-to-r from-transparent via-[#c3f937]/50 to-transparent",
  },
  pink: {
    text: "text-[#fb50c3]",
    iconBg: "bg-[#fb50c3]/10 text-[#fb50c3] border-[#fb50c3]/25",
    topLine: "bg-gradient-to-r from-transparent via-[#fb50c3]/50 to-transparent",
  },
  purple: {
    text: "text-purple-300",
    iconBg: "bg-purple-500/10 text-purple-300 border-purple-500/25",
    topLine: "bg-gradient-to-r from-transparent via-purple-500/50 to-transparent",
  },
  cyan: {
    text: "text-cyan-300",
    iconBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
    topLine: "bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent",
  },
  gold: {
    text: "text-yellow-300",
    iconBg: "bg-yellow-500/10 text-yellow-300 border-yellow-500/25",
    topLine: "bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent",
  },
};

export default function AdminKpiCard({
  title,
  value,
  description,
  icon: Icon,
  accentColor = "lime",
  href,
}: Props) {
  const accent = ACCENT_STYLES[accentColor];
  const formattedValue = typeof value === "number" ? formatNumber(value) : toLatinDigits(String(value));

  const content = (
    <div className="kpi-card bento-card group relative" dir="rtl">
      {/* Top accent line */}
      <div className={`absolute top-0 right-0 left-0 h-[2px] ${accent.topLine} pointer-events-none`} />

      {/* Row 1: Icon + Label */}
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${accent.iconBg}`}
          >
            <Icon className="w-4 h-4" strokeWidth={1.8} aria-hidden="true" />
          </div>
          <span className="text-sm font-bold text-slate-200 leading-snug">
            {title}
          </span>
        </div>

        {href && (
          <div className="w-7 h-7 rounded-lg bg-white/[0.04] text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-colors flex items-center justify-center shrink-0">
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
          </div>
        )}
      </div>

      {/* Row 2: Large Number */}
      <div className="relative z-10">
        <span
          className={`numeric-value font-mono font-bold tracking-tight text-[36px] sm:text-[44px] leading-none ${accent.text}`}
        >
          {formattedValue}
        </span>
      </div>

      {/* Row 3: Description */}
      {description && (
        <div className="relative z-10 pt-1.5 border-t border-white/[0.05]">
          <p className="text-[13px] text-slate-400 leading-[1.65] line-clamp-2">
            {description}
          </p>
        </div>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none h-full" aria-label={title}>
        {content}
      </Link>
    );
  }

  return content;
}
