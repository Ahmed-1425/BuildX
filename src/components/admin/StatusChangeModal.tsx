"use client";
import React, { useState } from "react";
import type { ExtendedApplicationStatus } from "@/types/admin";
import AdminStatusBadge from "./StatusBadge";
import { Edit3, AlertCircle, X } from "lucide-react";

interface Props {
  applicationId: string;
  candidateName: string;
  currentStatus: ExtendedApplicationStatus;
  updatedAt: string;
  onSuccess: (newStatus: ExtendedApplicationStatus) => void;
  onClose: () => void;
}

const ALL_STATUSES: { id: ExtendedApplicationStatus; label: string }[] = [
  { id: "submitted", label: "طلب جديد" },
  { id: "under_review", label: "قيد المراجعة" },
  { id: "preliminary_candidate", label: "مرشح مبدئي" },
  { id: "accepted", label: "مقبول" },
  { id: "waitlisted", label: "قائمة الانتظار" },
  { id: "rejected", label: "غير مقبول" },
  { id: "confirmed", label: "تم تأكيد القبول" },
  { id: "withdrawn", label: "منسحب" },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" dir="rtl">
      <div className="bg-[#181d28] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <Edit3 className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
            <h3 className="text-lg font-bold text-white">تغيير حالة الطلب</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <p className="text-sm text-slate-300">
          المتقدم: <span className="font-bold text-white">{candidateName}</span>
        </p>

        {/* Current status */}
        <div className="flex items-center gap-3 p-3.5 bg-white/[0.03] rounded-2xl border border-white/5">
          <span className="text-xs text-slate-400">الحالة الحالية:</span>
          <AdminStatusBadge status={currentStatus} size="sm" />
        </div>

        {/* Select new status */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-200">
            الحالة الجديدة:
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as ExtendedApplicationStatus)}
            className="w-full h-11 bg-[#0c1018] border border-white/15 rounded-xl px-3.5 text-sm text-white focus:outline-none focus:border-[#c3f937]"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s.id} value={s.id} className="bg-[#181d28] text-white">
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Optional note */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-200">
            ملاحظة التغيير (تُحفظ في سجل العمليات):
          </label>
          <textarea
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="اكتب سبب تغيير الحالة أو أي تفاصيل..."
            className="w-full bg-[#0c1018] border border-white/15 rounded-xl p-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c3f937]"
          />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2.5 text-xs font-bold bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] rounded-xl transition-all shadow-lg shadow-[#c3f937]/20 disabled:opacity-50"
          >
            {loading ? "جارٍ الحفظ..." : "تأكيد التغيير"}
          </button>
        </div>
      </div>
    </div>
  );
}
