"use client";

import React, { useState } from "react";
import { CheckCircle2, AlertTriangle, Clock, User, ShieldAlert, Sparkles, RefreshCw } from "lucide-react";

interface Props {
  initialOpen: boolean;
  updatedAt?: string | null;
  updatedByName?: string | null;
  canEdit?: boolean;
  onStatusChange?: (nextState: boolean, updatedAt: string, updatedByName: string) => void;
}

export default function RegistrationStatusControlCard({
  initialOpen,
  updatedAt: initialUpdatedAt,
  updatedByName: initialUpdatedByName,
  canEdit = true,
  onStatusChange,
}: Props) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [updatedAt, setUpdatedAt] = useState<string | null>(initialUpdatedAt || null);
  const [updatedByName, setUpdatedByName] = useState<string | null>(initialUpdatedByName || null);

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function formatDate(isoString: string | null) {
    if (!isoString) return "غير متوفر";
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat("ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }).format(d);
    } catch {
      return isoString;
    }
  }

  async function handleToggleExecution() {
    setIsSubmitting(true);
    setErrorMessage(null);

    const nextState = !isOpen;

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration_open: nextState }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsOpen(nextState);
        const newTime = data.settings?.registration_updated_at || new Date().toISOString();
        const newName = data.settings?.registration_updated_by_name || "مدير النظام";
        setUpdatedAt(newTime);
        setUpdatedByName(newName);

        setShowModal(false);
        const toast = nextState ? "تم فتح التسجيل بنجاح" : "تم إغلاق التسجيل بنجاح";
        setToastMessage(toast);
        setTimeout(() => setToastMessage(null), 4000);

        onStatusChange?.(nextState, newTime, newName);
      } else {
        setErrorMessage(data.error || "تعذر تحديث حالة التسجيل، يرجى المحاولة مرة أخرى.");
      }
    } catch {
      setErrorMessage("حدث خطأ أثناء الاتصال بالخادم. يرجى التحقق من اتصال الإنترنت والمحاولة ثانية.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className="fixed top-6 start-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-emerald-950/95 border border-emerald-500/50 text-emerald-100 shadow-2xl text-sm font-bold animate-in fade-in slide-in-from-top-4"
          role="status"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Card */}
      <div className="p-6 sm:p-8 bg-[rgba(24,29,40,0.85)] border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div
          className={`absolute -top-24 -end-24 w-60 h-60 rounded-full blur-[90px] pointer-events-none transition-colors duration-700 ${
            isOpen ? "bg-[#c3f937]/10" : "bg-rose-500/10"
          }`}
        />

        <div className="relative z-10 space-y-6">
          {/* Header Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <h3 className="text-xl font-bold text-white font-bauhaus">حالة التسجيل</h3>
                {/* Visual Status Indicator Badge */}
                <div
                  className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold border transition-colors ${
                    isOpen
                      ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-400"
                      : "bg-rose-500/15 border-rose-500/35 text-rose-400"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isOpen ? "bg-emerald-400 animate-ping" : "bg-rose-500 animate-pulse"
                    }`}
                  />
                  <span>{isOpen ? "التسجيل مفتوح" : "التسجيل مغلق"}</span>
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
                التحكم المباشر في إتاحة استقبال طلبات الانضمام في الموقع الرئيسي وفورم التسجيل والخادم.
              </p>
            </div>

            {/* Action Button */}
            {canEdit && (
              <div>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    setShowModal(true);
                  }}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-lg cursor-pointer ${
                    isOpen
                      ? "bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/35 shadow-rose-500/10 hover:border-rose-500/60"
                      : "bg-[#c3f937] hover:bg-[#b2e82e] text-[#0c1018] shadow-[#c3f937]/20"
                  }`}
                >
                  {isOpen ? (
                    <>
                      <ShieldAlert className="w-4 h-4 text-rose-400" />
                      <span>إغلاق التسجيل</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#0c1018]" />
                      <span>فتح التسجيل</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Metadata & Audit Information */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-y-3 gap-x-8 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>آخر تحديث:</span>
              <span className="font-semibold text-slate-200" dir="ltr">
                {formatDate(updatedAt)}
              </span>
            </div>

            {updatedByName && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <span>بواسطة:</span>
                <span className="font-semibold text-slate-200">{updatedByName}</span>
              </div>
            )}

            {!canEdit && (
              <span className="text-amber-400/90 text-xs">
                (حسابك بصلاحية مراجع فقط ولا يملك إذن تعديل حالة التسجيل)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          dir="rtl"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#181d28] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-5 text-right relative">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div
                className={`p-3 rounded-2xl ${
                  isOpen ? "bg-rose-500/15 text-rose-400" : "bg-[#c3f937]/15 text-[#c3f937]"
                }`}
              >
                <AlertTriangle className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">
                  {isOpen ? "تأكيد إغلاق باب التسجيل" : "تأكيد فتح باب التسجيل"}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">يرجى التأكد قبل تنفيذ هذا الإجراء</p>
              </div>
            </div>

            {/* Prompt text strictly aligned with specifications */}
            <div className="text-sm text-slate-300 leading-relaxed bg-black/20 p-4 rounded-2xl border border-white/5">
              {isOpen
                ? "هل أنت متأكد من إغلاق التسجيل؟ سيتم منع استقبال أي طلبات جديدة فورًا في الموقع والخادم."
                : "هل أنت متأكد من فتح التسجيل؟ سيتاح للزوار التقديم مجددًا فورًا."}
            </div>

            {/* Error Message inside modal */}
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-semibold">
                {errorMessage}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => {
                  if (!isSubmitting) {
                    setShowModal(false);
                    setErrorMessage(null);
                  }
                }}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                إلغاء
              </button>

              <button
                type="button"
                onClick={handleToggleExecution}
                disabled={isSubmitting}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
                  isOpen
                    ? "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20"
                    : "bg-[#c3f937] hover:bg-[#b2e82e] text-[#0c1018] shadow-[#c3f937]/20"
                } ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{isOpen ? "جارٍ إغلاق التسجيل…" : "جارٍ فتح التسجيل…"}</span>
                  </>
                ) : (
                  <span>{isOpen ? "نعم، إغلاق التسجيل" : "نعم، فتح التسجيل"}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
