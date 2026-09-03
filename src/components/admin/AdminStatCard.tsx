"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Props {
  title: string;
  value: number | string;
  description?: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accentColor?: "lime" | "pink" | "purple" | "cyan" | "gold";
  href?: string;
  featured?: boolean; // Large card for Total Applications
  subValueText?: string;
}

export default function AdminStatCard({
  title,
  value,
  description,
  badge,
  icon: Icon,
  accentColor = "lime",
  href,
  featured = false,
  subValueText,
}: Props) {
  const accentStyles = {
    lime: {
      text: "text-[#c3f937]",
      iconBg: "bg-[#c3f937]/10 text-[#c3f937] border-[#c3f937]/25",
      cornerGlow: "bg-[#c3f937]/10",
      topLine: "bg-gradient-to-r from-transparent via-[#c3f937]/50 to-transparent",
    },
    pink: {
      text: "text-[#fb50c3]",
      iconBg: "bg-[#fb50c3]/10 text-[#fb50c3] border-[#fb50c3]/25",
      cornerGlow: "bg-[#fb50c3]/10",
      topLine: "bg-gradient-to-r from-transparent via-[#fb50c3]/50 to-transparent",
    },
    purple: {
      text: "text-purple-300",
      iconBg: "bg-purple-500/10 text-purple-300 border-purple-500/25",
      cornerGlow: "bg-purple-500/10",
      topLine: "bg-gradient-to-r from-transparent via-purple-500/50 to-transparent",
    },
    cyan: {
      text: "text-cyan-300",
      iconBg: "bg-cyan-500/10 text-cyan-300 border-cyan-500/25",
      cornerGlow: "bg-cyan-500/10",
      topLine: "bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent",
    },
    gold: {
      text: "text-yellow-300",
      iconBg: "bg-yellow-500/10 text-yellow-300 border-yellow-500/25",
      cornerGlow: "bg-yellow-500/10",
      topLine: "bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent",
    },
  }[accentColor];

  const content = (
    <div
      className={`bento-card group flex flex-col justify-between p-5 sm:p-6 ${
        featured ? "h-full min-h-[190px]" : "min-h-[135px]"
      }`}
      dir="rtl"
    >
      {/* Subtle Top Edge Accent */}
      <div className={`absolute top-0 right-0 left-0 h-[2px] ${accentStyles.topLine} pointer-events-none`} />

      {/* Ambient Corner Aura */}
      <div
        className={`absolute -top-10 -right-10 w-28 h-28 rounded-full blur-2xl pointer-events-none ${accentStyles.cornerGlow} opacity-60`}
        aria-hidden="true"
      />

      {/* Top Row: Icon & Badge/Link */}
      <div className="flex items-center justify-between gap-3 relative z-10 mb-2">
        <div
          className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${accentStyles.iconBg}`}
        >
          <Icon className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
        </div>

        <div className="flex items-center gap-2">
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/5 border border-white/10 text-slate-300">
              {badge}
            </span>
          )}
          {href && (
            <div className="w-7 h-7 rounded-lg bg-white/[0.04] text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-colors flex items-center justify-center">
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* Middle/Bottom: Number and Title */}
      <div className="relative z-10 space-y-1">
        <span className="text-xs sm:text-sm font-semibold text-slate-300 block">
          {title}
        </span>

        <div className="flex items-baseline gap-2 pt-1">
          <span
            className={`font-mono font-bold tracking-tight ${accentStyles.text} ${
              featured ? "text-4xl sm:text-5xl" : "text-3xl sm:text-4xl"
            }`}
          >
            {value}
          </span>
          {subValueText && (
            <span className="text-xs text-slate-400 font-normal">
              {subValueText}
            </span>
          )}
        </div>

        {description && (
          <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed pt-1 line-clamp-1">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block focus:outline-none" aria-label={title}>
        {content}
      </Link>
    );
  }

  return content;
}
