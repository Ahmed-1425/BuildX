"use client";
import React from "react";
import Link from "next/link";
import type { ApplicationListItem } from "@/types/admin";
import AdminStatusBadge from "./StatusBadge";
import { GenderBadge } from "./ApplicationsTable";
import { Star, ChevronLeft, MapPin, Building2, CheckCircle2, Clock } from "lucide-react";
import {
  formatDateArabic,
  formatTimeArabic,
  formatNumber,
  toLatinDigits,
} from "@/lib/admin/formatters";

interface Props {
  items: ApplicationListItem[];
  onQuickStatusChange: (app: ApplicationListItem) => void;
}

export default function ApplicationsMobileCards({ items }: Props) {
  const levelBadges = {
    foundation: {
      text: "مبتدئ",
      className: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
    },
    practitioner: {
      text: "ممارس",
      className: "bg-[#c3f937]/15 text-[#c3f937] border-[#c3f937]/35 font-bold",
    },
    advanced: {
      text: "متقدم",
      className: "bg-pink-500/15 text-pink-400 border-pink-500/30",
    },
  };

  if (items.length === 0) {
    return (
      <div className="p-8 text-center bento-card text-slate-400 text-sm">
        لا توجد طلبات مطابقة لمعايير البحث.
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:hidden" dir="rtl">
      {items.map((item) => {
        const lvl = levelBadges[item.level] || levelBadges.foundation;

        return (
          <div
            key={item.id}
            className="bento-card p-5 space-y-4 shadow-lg"
          >
            {/* Header: Name & Status */}
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1 space-y-1">
                <Link
                  href={`/admin/applications/${item.id}/review`}
                  className="font-bold text-white text-[17px] hover:text-[#c3f937] transition-colors block leading-snug truncate"
                >
                  {item.full_name}
                </Link>
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                  <span className="application-id bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.08] text-slate-300 font-medium">
                    {toLatinDigits(item.reference_code)}
                  </span>
                  <span>•</span>
                  <span className="truncate">{item.city}</span>
                </div>
              </div>
              <AdminStatusBadge status={item.application_status} size="sm" />
            </div>

            {/* Badges: Level, Gender, Rating, Reviews */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className={`px-2.5 py-1 rounded-lg border text-xs font-semibold ${lvl.className}`}>
                {lvl.text}
              </span>

              <GenderBadge gender={item.gender} />

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-slate-300 border border-white/10 text-xs">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{item.city}</span>
              </span>

              {item.avg_score !== null && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#c3f937]/10 text-[#c3f937] font-mono font-bold border border-[#c3f937]/30 numeric-value">
                  <Star className="w-3 h-3 fill-[#c3f937] text-[#c3f937]" aria-hidden="true" />
                  <span>{item.avg_score.toFixed(1)}</span>
                </span>
              )}

              {item.reviews_count > 0 ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-xs font-bold numeric-value">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{formatNumber(item.reviews_count)} مراجعة</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/5 text-slate-400 text-xs">
                  <Clock className="w-3 h-3" />
                  <span>قيد الانتظار</span>
                </span>
              )}
            </div>

            {/* Organization / Specialization */}
            <div className="text-[13px] text-slate-300/90 truncate flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{item.organization} • {item.specialization}</span>
            </div>

            {/* Registration Time */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-2.5 border-t border-white/5">
              <span>تاريخ التقديم:</span>
              <span className="font-mono numeric-value text-slate-300">
                {formatDateArabic(item.submitted_at)} — {formatTimeArabic(item.submitted_at)}
              </span>
            </div>

            {/* Action button (52px on mobile for easy tapping) */}
            <div className="pt-1">
              <Link
                href={`/admin/applications/${item.id}/review`}
                className="w-full btn-admin-lg bg-[#c3f937] text-[#0c1018] hover:bg-[#c3f937]/90 transition-all shadow-md shadow-[#c3f937]/20 text-center font-bold"
              >
                <span>مراجعة الطلب</span>
                <ChevronLeft className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
