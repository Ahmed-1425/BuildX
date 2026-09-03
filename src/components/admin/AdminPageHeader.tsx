"use client";
import React from "react";
import { RefreshCw } from "lucide-react";

interface Props {
  title: string;
  subtitle: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  actions?: React.ReactNode;
}

export default function AdminPageHeader({
  title,
  subtitle,
  onRefresh,
  isRefreshing = false,
  actions,
}: Props) {
  return (
    <div
      className="flex flex-col md:flex-row md:items-flex-start md:justify-between gap-5 lg:gap-6 pb-6 border-b border-white/[0.07]"
      dir="rtl"
    >
      {/* Title & Subtitle */}
      <div className="space-y-2 min-w-0 flex-1">
        <h1
          className="font-bold text-white tracking-tight leading-tight"
          style={{ fontSize: "clamp(1.625rem, 2.5vw, 2.125rem)" }}
        >
          {title}
        </h1>
        <p
          className="text-slate-300 leading-relaxed max-w-2xl"
          style={{ fontSize: "clamp(0.8125rem, 1.2vw, 1rem)" }}
        >
          {subtitle}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-sm font-semibold text-slate-200 hover:text-white transition-all duration-150 disabled:opacity-50 cursor-pointer"
            aria-label="تحديث البيانات"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#c3f937] ${isRefreshing ? "animate-spin" : ""}`}
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>تحديث</span>
          </button>
        )}

        {actions}
      </div>
    </div>
  );
}
