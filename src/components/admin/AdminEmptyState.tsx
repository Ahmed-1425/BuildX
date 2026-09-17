"use client";
import React from "react";
import Link from "next/link";
import { Inbox, RefreshCw, Files } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  showAllLink?: boolean;
}

export default function AdminEmptyState({
  title = "لا يوجد متقدمون في هذه المرحلة",
  description = "لم يتم تصنيف أو فرز أي طلبات ضمن هذه المرحلة حتى الآن.",
  onRefresh,
  isRefreshing,
  showAllLink = true,
}: Props) {
  return (
    <div
      className="admin-empty-state bento-card"
      dir="rtl"
    >
      <div className="flex flex-col items-center justify-center text-center gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center">
          <Inbox className="w-6 h-6 text-[#c3f937]" strokeWidth={1.75} aria-hidden="true" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white tracking-tight">
            {title}
          </h3>
          <p className="text-sm text-slate-300 leading-[1.75] max-w-md mx-auto">
            {description}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {showAllLink && (
            <Link
              href="/admin/applications"
              className="btn-admin-md bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] font-bold shadow-md shadow-[#c3f937]/20 transition-all"
            >
              <Files className="w-4 h-4" aria-hidden="true" />
              <span>عرض جميع الطلبات</span>
            </Link>
          )}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="btn-admin-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-white font-semibold transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 text-[#c3f937] ${isRefreshing ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              <span>تحديث البيانات</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
