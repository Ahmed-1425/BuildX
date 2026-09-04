"use client";
import React from "react";
import Link from "next/link";
import type { ApplicationListItem } from "@/types/admin";
import AdminStatusBadge from "./StatusBadge";
import {
  Star,
  ChevronLeft,
  ArrowUpDown,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  User,
  UserRound,
  HelpCircle,
} from "lucide-react";
import {
  formatDateArabic,
  formatTimeArabic,
  formatNumber,
  toLatinDigits,
} from "@/lib/admin/formatters";

export function GenderBadge({ gender }: { gender?: "male" | "female" | null }) {
  if (gender === "male") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/20">
        <User className="w-3.5 h-3.5 shrink-0" />
        <span>ذكر</span>
      </span>
    );
  }
  if (gender === "female") {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
        <UserRound className="w-3.5 h-3.5 shrink-0" />
        <span>أنثى</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
      <HelpCircle className="w-3.5 h-3.5 shrink-0" />
      <span>غير محدد</span>
    </span>
  );
}

interface Props {
  items: ApplicationListItem[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAllToggle: () => void;
  onQuickStatusChange: (app: ApplicationListItem) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortChange?: (column: string) => void;
}

export default function ApplicationsTable({
  items,
  selectedIds,
  onSelectToggle,
  onSelectAllToggle,
  onQuickStatusChange,
  sortBy,
  sortOrder,
  onSortChange,
}: Props) {
  const allSelected = items.length > 0 && selectedIds.length === items.length;

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

  const statusOptionsLabels: Record<string, string> = {
    student: "طالب/ـة",
    graduate: "خريج/ـة",
    employed: "موظف/ـة",
    job_seeker: "باحث/ـة",
    other: "أخرى",
  };

  function renderSortIcon(col: string) {
    if (!onSortChange) return null;
    return (
      <button
        type="button"
        onClick={() => onSortChange(col)}
        className="inline-flex items-center text-slate-400 hover:text-white mr-1.5 transition-colors cursor-pointer"
        aria-label={`ترتيب حسب ${col}`}
      >
        <ArrowUpDown className="w-3.5 h-3.5" />
      </button>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[rgba(20,24,36,0.85)] backdrop-blur-md shadow-xl">
      <table className="w-full text-right text-slate-300 border-collapse">
        {/* Sticky Table Header (Height: 58px) */}
        <thead className="sticky top-0 z-20 bg-[#121622] border-b border-white/10 text-xs text-slate-400 font-semibold tracking-wide">
          <tr className="h-[58px]">
            {/* 1. Select */}
            <th className="px-[18px] w-12 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAllToggle}
                className="w-4 h-4 rounded bg-[#0c1018] border-white/20 text-[#c3f937] focus:ring-[#c3f937] cursor-pointer"
                aria-label="تحديد جميع الطلبات في الصفحة"
              />
            </th>

            {/* 2. Applicant */}
            <th className="px-[18px] font-bold text-white min-w-[240px]">
              <div className="flex items-center justify-between">
                <span>المتقدم</span>
                {renderSortIcon("full_name")}
              </div>
            </th>

            {/* 3. Level */}
            <th className="px-[18px] w-28 font-bold text-white">المستوى</th>

            {/* 4. Gender */}
            <th className="px-[18px] w-28 font-bold text-white">الجنس</th>

            {/* 5. City */}
            <th className="px-[18px] w-36 font-bold text-white">المدينة</th>

            {/* 6. Organization & Major */}
            <th className="px-[18px] min-w-[200px] font-bold text-white">الجهة والتخصص</th>

            {/* 7. Status */}
            <th className="px-[18px] w-40 font-bold text-white">حالة الطلب</th>

            {/* 8. Review Progress */}
            <th className="px-[18px] w-32 text-center font-bold text-white">المراجعة</th>

            {/* 9. Avg Rating */}
            <th className="px-[18px] w-32 text-center font-bold text-white">
              <div className="flex items-center justify-center">
                <span>التقييم</span>
                {renderSortIcon("avg_score")}
              </div>
            </th>

            {/* 10. Application Date */}
            <th className="px-[18px] w-40 font-bold text-white">
              <div className="flex items-center justify-between">
                <span>تاريخ التقديم</span>
                {renderSortIcon("submitted_at")}
              </div>
            </th>

            {/* 11. Actions */}
            <th className="px-[18px] w-48 text-center font-bold text-white">الإجراءات</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-white/5">
          {items.length === 0 ? (
            <tr>
              <td colSpan={11} className="p-14 text-center text-slate-400 text-sm">
                لا توجد طلبات مطابقة لمعايير البحث الحالية.
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const lvl = levelBadges[item.level] || levelBadges.foundation;

              return (
                <tr
                  key={item.id}
                  className={`min-h-[84px] h-[88px] hover:bg-white/[0.035] transition-colors ${
                    isSelected ? "bg-[#c3f937]/[0.06]" : ""
                  }`}
                >
                  {/* 1. Select Checkbox */}
                  <td className="px-[18px] py-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectToggle(item.id)}
                      className="w-4 h-4 rounded bg-[#0c1018] border-white/20 text-[#c3f937] focus:ring-[#c3f937] cursor-pointer"
                      aria-label={`تحديد طلب ${item.full_name}`}
                    />
                  </td>

                  {/* 2. Applicant Info (Primary Name 17px, Secondary 14px with gap) */}
                  <td className="px-[18px] py-4">
                    <div className="applicant-primary">
                      <Link
                        href={`/admin/applications/${item.id}/review`}
                        className="font-bold text-white hover:text-[#c3f937] transition-colors block text-[17px] leading-snug tracking-tight"
                      >
                        {item.full_name}
                      </Link>
                      <div className="applicant-secondary font-mono text-[13px] text-slate-400">
                        <span className="application-id bg-white/[0.05] px-2 py-0.5 rounded border border-white/[0.08] text-slate-300 font-medium">
                          {toLatinDigits(item.reference_code)}
                        </span>
                        <span className="phone-number text-slate-400 hidden sm:inline" dir="ltr">
                          {toLatinDigits(item.phone)}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* 3. Level Badge */}
                  <td className="px-[18px] py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-lg border text-xs font-semibold ${lvl.className}`}
                    >
                      {lvl.text}
                    </span>
                  </td>

                  {/* 4. Gender Badge */}
                  <td className="px-[18px] py-4">
                    <GenderBadge gender={item.gender} />
                  </td>

                  {/* 5. City */}
                  <td className="px-[18px] py-4">
                    <span className="text-slate-200 block text-[14px] font-medium">{item.city}</span>
                    {item.team_environment_preference === "same_gender_only" && (
                      <span className="text-[12px] text-amber-400 font-medium block mt-0.5">
                        نفس الجنس فقط
                      </span>
                    )}
                  </td>

                  {/* 6. Organization & Specialization (14px) */}
                  <td className="px-[18px] py-4 max-w-[220px]">
                    <span className="block truncate text-slate-200 text-[14px] font-medium" title={item.organization}>
                      {item.organization}
                    </span>
                    <span className="block truncate text-[13px] text-slate-400 mt-0.5" title={item.specialization}>
                      {item.specialization} ({statusOptionsLabels[item.current_status] || item.current_status})
                    </span>
                  </td>

                  {/* 7. Application Status Badge */}
                  <td className="px-[18px] py-4">
                    <AdminStatusBadge status={item.application_status} size="sm" />
                  </td>

                  {/* 8. Review Progress */}
                  <td className="px-[18px] py-4 text-center">
                    {item.reviews_count > 0 ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span className="numeric-value">{formatNumber(item.reviews_count)} مراجعة</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 text-slate-400 text-xs font-medium">
                        <Clock className="w-3 h-3" />
                        <span>قيد الانتظار</span>
                      </span>
                    )}
                  </td>

                  {/* 9. Avg Rating */}
                  <td className="px-[18px] py-4 text-center">
                    {item.avg_score !== null ? (
                      <span className="inline-flex items-center gap-1 font-mono text-sm font-bold text-[#c3f937] numeric-value">
                        <Star className="w-3.5 h-3.5 fill-[#c3f937] text-[#c3f937]" aria-hidden="true" />
                        <span>{item.avg_score.toFixed(1)}</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs">—</span>
                    )}
                  </td>

                  {/* 10. Application Date (Latin Digits) */}
                  <td className="px-[18px] py-4 text-xs">
                    <span className="block text-slate-200 font-medium text-[13px] numeric-value">
                      {formatDateArabic(item.submitted_at)}
                    </span>
                    <span className="block text-slate-400 font-mono text-[12px] mt-0.5 numeric-value">
                      {formatTimeArabic(item.submitted_at)}
                    </span>
                  </td>

                  {/* 11. Actions (Spacious gap >= 10px, non-glued) */}
                  <td className="px-[18px] py-4 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Link
                        href={`/admin/applications/${item.id}/review`}
                        className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-xl bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] text-xs font-bold transition-all shadow-sm shadow-[#c3f937]/15 cursor-pointer shrink-0"
                      >
                        <span>مراجعة الطلب</span>
                        <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => onQuickStatusChange(item)}
                        className="w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-colors flex items-center justify-center cursor-pointer shrink-0"
                        title="تغيير الحالة السريعة"
                        aria-label="تغيير الحالة السريعة"
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
