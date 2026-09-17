"use client";
import React from "react";
import { CircleX, RefreshCw } from "lucide-react";

interface Props {
  title?: string;
  message?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

/**
 * Unified error state for admin pages.
 * Shows a clear Arabic error message with retry button.
 * Never exposes raw Supabase/backend error details.
 */
export default function AdminErrorState({
  title = "تعذر تحميل البيانات",
  message = "تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.",
  onRetry,
  isRetrying = false,
}: Props) {
  return (
    <div className="admin-empty-card bento-card space-y-5" dir="rtl">
      <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center shadow-lg">
        <CircleX className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
      <p className="body-text text-slate-300 max-w-lg">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          disabled={isRetrying}
          className="btn-admin-md bg-[#c3f937] text-[#0c1018] font-bold shadow-md shadow-[#c3f937]/20 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`}
            aria-hidden="true"
          />
          <span>إعادة المحاولة</span>
        </button>
      )}
    </div>
  );
}
