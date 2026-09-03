"use client";
import React from "react";
import Link from "next/link";
import type { ApplicationListItem } from "@/types/admin";
import AdminStatusBadge from "./StatusBadge";
import { Star, ArrowLeft, Edit3 } from "lucide-react";

interface Props {
  items: ApplicationListItem[];
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAllToggle: () => void;
  onQuickStatusChange: (app: ApplicationListItem) => void;
}

export default function ApplicationsTable({
  items,
  selectedIds,
  onSelectToggle,
  onSelectAllToggle,
  onQuickStatusChange,
}: Props) {
  const allSelected = items.length > 0 && selectedIds.length === items.length;

  const levelLabels = {
    foundation: { text: "مبتدئ", badge: "01", color: "text-slate-100 bg-[#823419]/40 border-[#823419]" },
    practitioner: { text: "ممارس", badge: "02", color: "text-[#0c1018] bg-[#c3f937] border-[#c3f937]" },
    advanced: { text: "متقدم", badge: "03", color: "text-white bg-[#fb50c3]/60 border-[#fb50c3]" },
  };

  const statusOptionsLabels: Record<string, string> = {
    student: "طالب/ـة",
    graduate: "خريج/ـة",
    employed: "موظف/ـة",
    job_seeker: "باحث/ـة",
    other: "أخرى",
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[rgba(24,29,40,0.78)] backdrop-blur-md shadow-xl">
      <table className="w-full text-right text-sm text-slate-300">
        <thead className="bg-white/[0.03] border-b border-white/10 text-xs text-slate-400 font-semibold uppercase tracking-wider">
          <tr>
            <th className="p-4 w-12 text-center">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={onSelectAllToggle}
                className="w-4 h-4 rounded bg-[#0c1018] border-white/20 text-[#c3f937] focus:ring-[#c3f937] cursor-pointer"
                aria-label="تحديد جميع الطلبات في الصفحة"
              />
            </th>
            <th className="p-4">المتقدم</th>
            <th className="p-4">المستوى</th>
            <th className="p-4">المدينة</th>
            <th className="p-4">الجهة والتخصص</th>
            <th className="p-4">حالة الطلب</th>
            <th className="p-4 text-center">التقييم</th>
            <th className="p-4">تاريخ التقديم</th>
            <th className="p-4 text-center">إجراءات</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {items.length === 0 ? (
            <tr>
              <td colSpan={9} className="p-12 text-center text-slate-400 text-sm">
                لا توجد طلبات مطابقة لمعايير البحث الحالية.
              </td>
            </tr>
          ) : (
            items.map((item) => {
              const isSelected = selectedIds.includes(item.id);
              const lvl = levelLabels[item.level] || levelLabels.foundation;

              return (
                <tr
                  key={item.id}
                  className={`min-h-[58px] hover:bg-white/[0.03] transition-colors ${
                    isSelected ? "bg-white/[0.05]" : ""
                  }`}
                >
                  {/* Select Checkbox */}
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectToggle(item.id)}
                      className="w-4 h-4 rounded bg-[#0c1018] border-white/20 text-[#c3f937] focus:ring-[#c3f937] cursor-pointer"
                      aria-label={`تحديد طلب ${item.full_name}`}
                    />
                  </td>

                  {/* Candidate Name & Reference Code */}
                  <td className="p-4">
                    <Link
                      href={`/admin/applications/${item.id}`}
                      className="font-bold text-white hover:text-[#c3f937] transition-colors block text-base leading-tight mb-1"
                    >
                      {item.full_name}
                    </Link>
                    <span className="font-mono text-xs text-slate-400">
                      {item.reference_code}
                    </span>
                  </td>

                  {/* Level Badge */}
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-bold ${lvl.color}`}
                    >
                      <span>{lvl.badge}</span>
                      <span>{lvl.text}</span>
                    </span>
                  </td>

                  {/* City */}
                  <td className="p-4 text-sm">
                    <span className="text-slate-200 block">{item.city}</span>
                    {item.team_environment_preference === "same_gender_only" && (
                      <span className="text-xs text-orange-400">نفس الجنس فقط</span>
                    )}
                  </td>

                  {/* Organization & Major */}
                  <td className="p-4 max-w-[220px]">
                    <span className="block truncate text-slate-200 font-medium" title={item.organization}>
                      {item.organization}
                    </span>
                    <span className="block truncate text-xs text-slate-400" title={item.specialization}>
                      {item.specialization} ({statusOptionsLabels[item.current_status] || item.current_status})
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <AdminStatusBadge status={item.application_status} size="sm" />
                  </td>

                  {/* Rating / Reviews */}
                  <td className="p-4 text-center">
                    {item.avg_score !== null ? (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#c3f937]/10 border border-[#c3f937]/30 text-[#c3f937] font-mono font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-[#c3f937] text-[#c3f937]" aria-hidden="true" />
                        <span>{item.avg_score}</span>
                        <span className="text-[11px] text-slate-400">({item.reviews_count})</span>
                      </div>
                    ) : (
                      <span className="text-slate-500 text-xs">لم يُقيّم</span>
                    )}
                  </td>

                  {/* Date */}
                  <td className="p-4 text-xs font-mono text-slate-400" dir="ltr">
                    {new Date(item.submitted_at).toLocaleDateString("ar-SA", {
                      timeZone: "Asia/Riyadh",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => onQuickStatusChange(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border border-white/10 text-slate-300 hover:text-[#c3f937] hover:border-[#c3f937]/30 transition-colors"
                        title="تغيير الحالة سريعاً"
                      >
                        <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>تعديل</span>
                      </button>

                      <Link
                        href={`/admin/applications/${item.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/15 text-white transition-colors"
                        title="عرض الملف كاملاً"
                      >
                        <span>عرض</span>
                        <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
                      </Link>
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
