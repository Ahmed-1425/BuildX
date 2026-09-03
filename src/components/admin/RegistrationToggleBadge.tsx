"use client";
import React, { useState } from "react";
import { Lock, Unlock, AlertTriangle } from "lucide-react";

interface Props {
  isOpen: boolean;
  onToggle?: (newState: boolean) => void;
  canEdit?: boolean;
}

export default function RegistrationToggleBadge({
  isOpen: initialOpen,
  onToggle,
  canEdit = true,
}: Props) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    try {
      const nextState = !isOpen;
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration_open: nextState }),
      });
      const data = await res.json();
      if (data.success) {
        setIsOpen(nextState);
        onToggle?.(nextState);
        setShowConfirm(false);
      } else {
        alert(data.error || "تعذر تحديث حالة التسجيل");
      }
    } catch {
      alert("حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex items-center gap-2.5">
        <div
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
            isOpen
              ? "bg-[#c3f937]/10 border-[#c3f937]/35 text-[#c3f937]"
              : "bg-rose-500/10 border-rose-500/35 text-rose-400"
          }`}
        >
          {isOpen ? (
            <Unlock className="w-3.5 h-3.5" aria-hidden="true" />
          ) : (
            <Lock className="w-3.5 h-3.5" aria-hidden="true" />
          )}
          <span>{isOpen ? "التسجيل مفتوح" : "التسجيل مغلق"}</span>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className={`text-xs px-3 py-1.5 rounded-xl border font-semibold transition-colors ${
              isOpen
                ? "border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                : "border-[#c3f937]/30 text-[#c3f937] hover:bg-[#c3f937]/10"
            }`}
          >
            {isOpen ? "إغلاق التسجيل" : "فتح التسجيل"}
          </button>
        )}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" dir="rtl">
          <div className="bg-[#181d28] border border-white/15 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-right space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-white/10">
              <div
                className={`p-2.5 rounded-xl ${
                  isOpen ? "bg-rose-500/10 text-rose-400" : "bg-[#c3f937]/10 text-[#c3f937]"
                }`}
              >
                <AlertTriangle className="w-5 h-5" aria-hidden="true" />
              </div>
              <h4 className="text-lg font-bold text-white">
                {isOpen ? "تأكيد إغلاق باب التسجيل" : "تأكيد فتح باب التسجيل"}
              </h4>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {isOpen
                ? "عند إغلاق التسجيل، لن يتمكن أي زائر من تقديم طلب جديد عبر صفحة /register وسيظهر إشعار فوري بأن باب التسجيل مغلق حالياً."
                : "عند فتح التسجيل، سيتمكن المتقدمون من ملء النموذج وتسليم طلباتهم مباشرة إلى قاعدة بيانات Supabase."}
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  isOpen
                    ? "bg-rose-500 hover:bg-rose-600 text-white shadow-lg shadow-rose-500/20"
                    : "bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] shadow-lg shadow-[#c3f937]/20"
                }`}
              >
                {loading ? "جارٍ التحديث..." : isOpen ? "نعم، إغلاق التسجيل" : "نعم، فتح التسجيل"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
