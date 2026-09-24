"use client";
import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { formatNumber } from "@/lib/admin/formatters";

interface Props {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  limitOptions?: number[];
}

export default function AdminPagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  onLimitChange,
  limitOptions = [10, 20, 50, 100],
}: Props) {
  return (
    <div className="bento-card p-4 flex flex-wrap items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span>عرض</span>
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="h-8 px-2 rounded-lg bg-white/[0.05] border border-white/10 text-white font-mono text-xs focus:outline-none"
        >
          {limitOptions.map((opt) => (
            <option key={opt} value={opt} className="bg-[#121622]">
              {opt}
            </option>
          ))}
        </select>
        <span>طلب لكل صفحة</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 px-3 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 border border-white/10 disabled:opacity-40 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
          <span>السابق</span>
        </button>

        <span className="text-xs font-mono text-slate-300 px-2 numeric-value">
          صفحة {formatNumber(page)} من {formatNumber(totalPages)}
        </span>

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 px-3 h-8 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-200 border border-white/10 disabled:opacity-40 cursor-pointer"
        >
          <span>التالي</span>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
