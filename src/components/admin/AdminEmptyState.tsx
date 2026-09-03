"use client";
import React from "react";
import Link from "next/link";
import { Inbox, RefreshCw, ExternalLink, Database } from "lucide-react";

interface Props {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function AdminEmptyState({ onRefresh, isRefreshing }: Props) {
  return (
    <div
      className="bento-card w-full p-8 sm:p-12 lg:p-14 text-center relative overflow-hidden my-4"
      dir="rtl"
    >
      {/* Background Ambient Glows (Purple & Lime) */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-64 rounded-full blur-3xl pointer-events-none opacity-25"
        style={{
          background:
            "radial-gradient(circle, rgba(195,249,55,0.4) 0%, rgba(251,80,195,0.3) 45%, rgba(52,21,95,0.5) 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-xl mx-auto space-y-6">
        {/* Inbox Icon inside glowing glass pill */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-white/[0.04] border border-white/10 flex items-center justify-center shadow-lg shadow-[#34155f]/20">
          <Inbox className="w-10 h-10 text-[#c3f937]" strokeWidth={1.5} aria-hidden="true" />
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            المنصة جاهزة لاستقبال الطلبات
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            ستظهر طلبات المتقدمين هنا مباشرة بعد إرسال نموذج التسجيل.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/register"
            target="_blank"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] text-xs sm:text-sm font-bold transition-all shadow-md shadow-[#c3f937]/20"
          >
            <span>فتح صفحة التسجيل</span>
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </Link>

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs sm:text-sm font-semibold text-white transition-colors disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw
                className={`w-4 h-4 text-[#c3f937] ${isRefreshing ? "animate-spin" : ""}`}
                aria-hidden="true"
              />
              <span>تحديث البيانات</span>
            </button>
          )}
        </div>

        {/* Verified Database Status Indicator */}
        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-center gap-2 text-xs text-slate-400">
          <Database className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
          <span>حالة النظام: </span>
          <span className="text-emerald-400 font-semibold">قاعدة البيانات متصلة</span>
        </div>
      </div>
    </div>
  );
}
