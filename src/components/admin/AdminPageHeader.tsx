"use client";
import React from "react";
import Link from "next/link";
import { RefreshCw, Files } from "lucide-react";

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
  // Format current time in Riyadh timezone
  const formattedTime = new Date().toLocaleTimeString("ar-SA", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Riyadh",
  });

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 pb-6 border-b border-white/[0.07]" dir="rtl">
      {/* Title & Subtitle */}
      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          {title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      </div>

      {/* Action Buttons & Time */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="text-[11px] text-slate-400 font-mono hidden xl:block">
          <span>آخر تحديث: </span>
          <span className="text-slate-300">{formattedTime} (الرياض)</span>
        </div>

        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white transition-all duration-150 disabled:opacity-50 cursor-pointer"
            aria-label="تحديث البيانات"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#c3f937] ${isRefreshing ? "animate-spin" : ""}`}
              strokeWidth={2}
              aria-hidden="true"
            />
            <span>تحديث البيانات</span>
          </button>
        )}

        <Link
          href="/admin/applications"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#c3f937]/15 cursor-pointer"
        >
          <Files className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
          <span>عرض جميع الطلبات</span>
        </Link>

        {actions}
      </div>
    </div>
  );
}
