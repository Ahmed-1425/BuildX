"use client";
import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toLatinDigits, formatNumber } from "@/lib/admin/formatters";

interface Props {
  title: string;
  value: number | string;
  description?: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accentColor?: "lime" | "pink" | "purple" | "cyan" | "gold";
  href?: string;
  featured?: boolean;
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

  // Enforce English Latin Digits
  const formattedValue = typeof value === "number" ? formatNumber(value) : toLatinDigits(String(value));

  const content = (
    <div
      className={`bento-card metric-card group relative transition-all duration-200 ${
        featured ? "border-white/20 bg-gradient-to-br from-white/[0.06] to-white/[0.02]" : ""
      }`}
      dir="rtl"
    >
      {/* Subtle Top Edge Accent */}
      <div className={`absolute top-0 right-0 left-0 h-[2px] ${accentStyles.topLine} pointer-events-none`} />

      {/* Ambient Corner Aura */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none ${accentStyles.cornerGlow} opacity-50`}
        aria-hidden="true"
      />

      {/* ── 1. Top Row: Icon, Title & Optional Badge/Arrow ─────────────────── */}
      <div className="flex items-center justify-between gap-3 relative z-10">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-11 h-11 rounded-xl border flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${accentStyles.iconBg}`}
          >
            <Icon className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
          </div>
          <h2 className="text-[17px] font-bold text-white tracking-tight truncate">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {badge && (
            <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-white/5 border border-white/10 text-slate-300 numeric-value">
              {toLatinDigits(badge)}
            </span>
          )}
          {href && (
            <div className="w-8 h-8 rounded-xl bg-white/[0.04] text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-colors flex items-center justify-center">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            </div>
          )}
        </div>
      </div>

      {/* ── 2. Middle Row: Number in Independent Area ─────────────────────── */}
      <div className="relative z-10 my-auto py-1">
        <div className="flex items-baseline gap-2.5">
          <span
            className={`numeric-value font-mono font-bold tracking-tight text-[42px] sm:text-[46px] leading-none ${accentStyles.text}`}
          >
            {formattedValue}
          </span>
          {subValueText && (
            <span className="text-xs text-slate-400 font-medium numeric-value">
              {toLatinDigits(subValueText)}
            </span>
          )}
        </div>
      </div>

      {/* ── 3. Bottom Row: Description ────────────────────────────────────── */}
      <div className="relative z-10 pt-1 border-t border-white/[0.04]">
        <p className="text-[14px] text-slate-300 leading-[1.7] line-clamp-2">
          {description || "مؤشر أداء معتمد"}
        </p>
      </div>
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
