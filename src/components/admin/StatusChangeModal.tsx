"use client";
import React, { useState } from "react";
import type { ExtendedApplicationStatus } from "@/types/admin";
import AdminStatusBadge from "./StatusBadge";
import { Edit3, AlertCircle, X, ArrowLeft, CheckCircle2, Info } from "lucide-react";

interface Props {
  applicationId: string;
  candidateName: string;
  currentStatus: ExtendedApplicationStatus;
  updatedAt: string;
  onSuccess: (newStatus: ExtendedApplicationStatus) => void;
  onClose: () => void;
}

const ALL_STATUSES: { id: ExtendedApplicationStatus; label: string; impact: string }[] = [
  {
    id: "submitted",
    label: "طلب جديد",
    impact: "إعادة الطلب إلى قائمة الوارد الجديد قبل مرحلة الفرز والتقييم.",
  },
  {
    id: "under_review",
    label: "قيد المراجعة",
    impact: "إتاحة الطلب للمحكمين لبدء فحص الإجابات وتدوين الدرجات.",
  },
  {
    id: "preliminary_candidate",
    label: "مرشح مبدئيًا",
    impact: "ترشيح المتقدم للمفاضلة النهائية قبل اعتماد القبول في المعسكر.",
  },
  {
    id: "accepted",
    label: "مقبول",
    impact: "اعتماد قبول المتقدم وإتاحته لتوزيع الفرق في معسكر BUILDx.",
  },
  {
    id: "confirmed",
    label: "مؤكد الحضور",
    impact: "تثبيت حضور المتقدم والتأكيد النهائي على المقعد المخصص.",
  },
  {
    id: "waitlisted",
    label: "قائمة الانتظار",
    impact: "وضع المتقدم في الاحتياط للترقية في حال اعتذار أي مرشح مقبول.",
  },
  {
    id: "rejected",
    label: "غير مقبول",
    impact: "استبعاد الطلب من المعسكر مع تسجيل سبب الرفض في سجل التدقيق.",
  },
];

export default function StatusChangeModal({
  applicationId,
  candidateName,
  currentStatus,
  updatedAt,
  onSuccess,
  onClose,
}: Props) {
  const [selectedStatus, setSelectedStatus] = useState<ExtendedApplicationStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentImpact = ALL_STATUSES.find((s) => s.id === selectedStatus)?.impact || "";

  async function handleSave() {
    if (selectedStatus === currentStatus) {
      onClose();
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: selectedStatus,
          note: note.trim() || undefined,
          expected_updated_at: updatedAt,
        }),
      });

      const data = await res.json();
      if (data.success) {
        onSuccess(selectedStatus);
      } else {
        setError(data.error || "تعذر تحديث الحالة.");
      }
    } catch {
      setError("تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      dir="rtl"
    >
      <div className="bg-[#161b28] border border-white/15 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
            <h3 className="text-lg font-bold text-white">تأكيد نقل حالة الطلب</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        {/* Applicant Name */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
          <span className="text-xs text-slate-400">المتقدم:</span>
          <p className="text-base font-bold text-white">{candidateName}</p>
        </div>

        {/* Transition Comparison: Previous vs New */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
          <div className="space-y-1 text-right">
            <span className="text-[11px] text-slate-400 block font-semibold">الحالة السابقة:</span>
            <AdminStatusBadge status={currentStatus} size="sm" />
          </div>
          <div className="space-y-1 text-right">
            <span className="text-[11px] text-slate-400 block font-semibold">الحالة الجديدة:</span>
            <AdminStatusBadge status={selectedStatus} size="sm" />
          </div>
        </div>

        {/* Select new status */}
        <div className="space-y-1.5 text-right">
          <label className="block text-xs font-bold text-slate-200">
            تحديد الحالة الجديدة:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ExtendedApplicationStatus)}
            className="w-full h-11 bg-[#0c1018] border border-white/15 rounded-xl px-3.5 text-sm text-white focus:outline-none focus:border-[#c3f937]"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#161b28] text-white">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Decision Impact Box */}
        {currentImpact && (
          <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 text-cyan-400 mt-0.5" />
            <div className="space-y-0.5 text-right">
              <span className="font-bold block">أثر القرار:</span>
              <p className="text-slate-300 text-[11px] leading-relaxed">{currentImpact}</p>
            </div>
          </div>
        )}

        {/* Reason / Note field */}
        <div className="space-y-1.5 text-right">
          <label className="block text-xs font-bold text-slate-200">
            سبب التغيير أو الملاحظة (تُسجل في سجل التدقيق):
          </label>
          <textarea
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="اكتب سبب القرار أو تفاصيل التغيير الإداري..."
            className="w-full bg-[#0c1018] border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c3f937]"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-4 h-11 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-slate-300"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || selectedStatus === currentStatus}
            className="px-6 h-11 rounded-xl bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] text-xs font-bold transition-all shadow-md shadow-[#c3f937]/20 disabled:opacity-40 cursor-pointer"
          >
            {loading ? "جارٍ التحديث..." : "تأكيد تغيير الحالة"}
          </button>
        </div>
      </div>
    </div>
  );
}
