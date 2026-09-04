"use client";
import React from "react";
import { RefreshCw, Clock } from "lucide-react";
import { toLatinDigits } from "@/lib/admin/formatters";

interface Props {
  title: string;
  subtitle: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  lastUpdated?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function AdminPageHeader({
  title,
  subtitle,
  onRefresh,
  isRefreshing = false,
  lastUpdated,
  badge,
  actions,
}: Props) {
  return (
    <header className="page-header pb-6 border-b border-white/[0.08]" dir="rtl">
      {/* ── Title & Description Area ─────────────────────────────── */}
      <div className="page-header-copy flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="admin-title font-bold text-white tracking-tight">
            {title}
          </h1>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>

        <p className="body-text text-slate-300 leading-relaxed max-w-3xl">
          {subtitle}
        </p>

        {lastUpdated && (
          <div className="flex items-center gap-2 text-xs text-slate-400 pt-0.5">
            <Clock className="w-3.5 h-3.5 text-[#c3f937] shrink-0" aria-hidden="true" />
            <span>
              آخر تحديث:{" "}
              <span className="numeric-value font-mono text-slate-300 font-medium">
                {toLatinDigits(lastUpdated)}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* ── Actions Container ────────────────────────────────────── */}
      <div className="page-header-actions">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="btn-admin-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 hover:text-white transition-all cursor-pointer disabled:opacity-50"
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
    </header>
  );
}
