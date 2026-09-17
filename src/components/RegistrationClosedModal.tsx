"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { Lock, X } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationClosedModal({ isOpen, onClose }: Props) {
  const { locale } = useLanguage();
  const ar = locale === "ar";
  const okButtonRef = useRef<HTMLButtonElement>(null);

  // Lock body scroll when modal is open & handle ESC
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    const timer = setTimeout(() => {
      okButtonRef.current?.focus();
    }, 50);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      dir={ar ? "rtl" : "ltr"}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="closed-modal-title"
        className="relative w-full max-w-md bg-[#121622] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 text-center space-y-5 overflow-hidden animate-in zoom-in-95 duration-200"
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(251, 80, 195, 0.08), transparent 70%), #121622",
        }}
      >
        {/* Close X button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 sm:top-5 sm:left-5 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label={ar ? "إغلاق" : "Close"}
        >
          <X size={18} />
        </button>

        {/* Character image specified by user */}
        <div className="pt-2 flex justify-center">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
            <Image
              src="/assets/characters/thinking-closed.png"
              alt={ar ? "نمط التفكير" : "Thinking character"}
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 border border-rose-500/30 text-rose-400">
          <Lock className="w-3.5 h-3.5" />
          <span>{ar ? "التسجيل مغلق" : "Registration Closed"}</span>
        </div>

        {/* Modal Title */}
        <h3
          id="closed-modal-title"
          className="text-xl sm:text-2xl font-bold text-white tracking-tight"
          style={{ fontFamily: "var(--font-janna-bold)" }}
        >
          {ar ? "التسجيل مغلق" : "Registration Closed"}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-sm mx-auto">
          {ar
            ? "نعتذر، تم إغلاق التسجيل في معسكر BUILDx ولم يعد استقبال الطلبات متاحًا حاليًا."
            : "Sorry, registration for the BUILDx Camp is now closed."}
        </p>

        {/* Action Button */}
        <div className="pt-2">
          <button
            ref={okButtonRef}
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto min-w-[140px] px-8 h-12 rounded-xl bg-[#c3f937] hover:bg-[#b2e82e] text-[#0c1018] font-bold text-sm shadow-lg shadow-[#c3f937]/20 transition-all cursor-pointer"
            style={{ fontFamily: "var(--font-janna-bold)" }}
          >
            {ar ? "حسنًا" : "OK"}
          </button>
        </div>
      </div>
    </div>
  );
}
