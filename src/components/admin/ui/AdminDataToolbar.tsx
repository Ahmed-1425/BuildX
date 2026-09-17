"use client";
import React from "react";
import {
  Search,
  X,
  SlidersHorizontal,
  RefreshCw,
  Download,
} from "lucide-react";
import { formatNumber } from "@/lib/admin/formatters";

interface Props {
  /** Current search input value */
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  /** Total result count */
  totalCount: number;

  /** Filter panel */
  activeFiltersCount?: number;
  showFilters?: boolean;
  onToggleFilters?: () => void;

  /** Refresh */
  onRefresh: () => void;
  isRefreshing?: boolean;

  /** Export */
  onExport?: () => void;
  isExporting?: boolean;
  exportLabel?: string;
}

export default function AdminDataToolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "ابحث بالاسم، رقم الطلب، البريد، الجوال، المدينة...",
  totalCount,
  activeFiltersCount = 0,
  showFilters = false,
  onToggleFilters,
  onRefresh,
  isRefreshing = false,
  onExport,
  isExporting = false,
  exportLabel = "تصدير CSV",
}: Props) {
  return (
    <div className="space-y-3">
      {/* Main toolbar row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search field */}
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full h-11 pr-10 pl-10 rounded-xl bg-[rgba(20,24,36,0.85)] border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#c3f937] transition-colors"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Controls group */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Result count badge */}
          <span className="font-mono text-xs font-bold px-2.5 py-1.5 rounded-lg bg-white/[0.04] text-slate-300 border border-white/[0.08] numeric-value hidden sm:inline-flex">
            {formatNumber(totalCount)} نتيجة
          </span>

          {/* Filter toggle */}
          {onToggleFilters && (
            <button
              type="button"
              onClick={onToggleFilters}
              className={`btn-admin-md border transition-all cursor-pointer ${
                showFilters || activeFiltersCount > 0
                  ? "bg-[#c3f937]/10 text-[#c3f937] border-[#c3f937]/30"
                  : "bg-white/[0.04] text-slate-200 hover:text-white border-white/10 hover:bg-white/[0.08]"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span className="hidden sm:inline">الفلاتر</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#c3f937] text-[#0c1018] text-[11px] font-bold flex items-center justify-center numeric-value">
                  {formatNumber(activeFiltersCount)}
                </span>
              )}
            </button>
          )}

          {/* Refresh */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="btn-admin-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            aria-label="تحديث البيانات"
          >
            <RefreshCw
              className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span className="hidden md:inline">تحديث</span>
          </button>

          {/* Export */}
          {onExport && (
            <button
              type="button"
              onClick={onExport}
              disabled={isExporting}
              className="btn-admin-md bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] font-bold shadow-sm shadow-[#c3f937]/15 cursor-pointer disabled:opacity-50 hidden sm:inline-flex"
            >
              <Download className="w-4 h-4" />
              <span>{exportLabel}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
