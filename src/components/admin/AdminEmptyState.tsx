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
      className="bento-card admin-empty-card"
      dir="rtl"
    >
      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center justify-center text-center">
        {/* 1. Icon Container */}
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-lg mb-4">
          <Inbox className="w-7 h-7 text-[#c3f937]" strokeWidth={1.75} aria-hidden="true" />
        </div>

        {/* 2. Title & Description with 10px gap */}
        <div className="space-y-2.5">
          <h3 className="text-xl font-bold text-white tracking-tight">
            {title}
          </h3>
          <p className="body-text text-slate-300 leading-[1.8] max-w-md mx-auto">
            {description}
          </p>
        </div>

        {/* 3. Action Buttons with 24px gap before */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
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
