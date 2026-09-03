"use client";
import React from "react";
import Link from "next/link";
import type { ApplicationListItem } from "@/types/admin";
import AdminStatusBadge from "./StatusBadge";
import { Star, ArrowLeft, Edit3 } from "lucide-react";

interface Props {
  items: ApplicationListItem[];
  onQuickStatusChange: (app: ApplicationListItem) => void;
}

export default function ApplicationsMobileCards({ items, onQuickStatusChange }: Props) {
  const levelLabels = {
    foundation: { text: "مبتدئ", color: "text-slate-100 bg-[#823419]/40 border-[#823419]" },
    practitioner: { text: "ممارس", color: "text-[#0c1018] bg-[#c3f937] border-[#c3f937]" },
    advanced: { text: "متقدم", color: "text-white bg-[#fb50c3]/60 border-[#fb50c3]" },
  };

  if (items.length === 0) {
    return (
      <div className="p-8 text-center bg-[rgba(24,29,40,0.78)] border border-white/10 rounded-2xl text-slate-400 text-sm">
        لا توجد طلبات مطابقة لمعايير البحث.
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:hidden" dir="rtl">
      {items.map((item) => {
        const lvl = levelLabels[item.level] || levelLabels.foundation;

        return (
          <div
            key={item.id}
            className="p-5 bg-[rgba(24,29,40,0.85)] border border-white/10 rounded-2xl space-y-3.5 backdrop-blur-md shadow-lg"
          >
            {/* Header: Name, code, and status */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  href={`/admin/applications/${item.id}`}
                  className="font-bold text-white text-base hover:text-[#c3f937] transition-colors block leading-tight"
                >
                  {item.full_name}
                </Link>
                <span className="font-mono text-xs text-slate-400 mt-0.5 block">
                  {item.reference_code}
                </span>
              </div>
              <AdminStatusBadge status={item.application_status} size="sm" />
            </div>

            {/* Badges: Level, City, Rating */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`px-2.5 py-1 rounded-lg border font-bold ${lvl.color}`}>
                {lvl.text}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-slate-300">
                {item.city}
              </span>
              {item.avg_score !== null && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#c3f937]/10 text-[#c3f937] font-mono font-bold border border-[#c3f937]/30">
                  <Star className="w-3 h-3 fill-[#c3f937] text-[#c3f937]" aria-hidden="true" />
                  <span>{item.avg_score}</span>
                  <span className="text-[10px] text-slate-400">({item.reviews_count})</span>
                </span>
              )}
            </div>

            {/* Details snippet */}
            <p className="text-xs text-slate-400 truncate">
              {item.organization} • {item.specialization}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-2.5 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => onQuickStatusChange(item)}
                className="flex-1 h-11 inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl border border-white/10 text-slate-200 hover:text-[#c3f937] transition-colors text-center"
              >
                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>تعديل الحالة</span>
              </button>
              <Link
                href={`/admin/applications/${item.id}`}
                className="flex-1 h-11 inline-flex items-center justify-center gap-1.5 text-xs font-bold rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors text-center"
              >
                <span>عرض الملف</span>
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
