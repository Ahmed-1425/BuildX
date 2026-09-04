"use client";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { AlertCircle, ArrowLeft, X, CheckCircle2 } from "lucide-react";

export interface MissingEvaluationItem {
  id: string;
  type: "criterion" | "recommendation" | "rejection_reason" | "unreviewed_questions";
  label: string;
  targetId?: string;
  onNavigate?: () => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
  missingItems: MissingEvaluationItem[];
  onNavigateToFirstMissing: () => void;
}

export default function IncompleteEvaluationModal({
  open,
  onClose,
  missingItems,
  onNavigateToFirstMissing,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483645,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        background: "rgba(4, 7, 12, 0.8)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        direction: "rtl",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="incomplete-modal-title"
        style={{
          width: "min(520px, calc(100vw - 32px))",
          background: "linear-gradient(145deg, rgba(30, 31, 49, 0.99), rgba(12, 16, 24, 0.99))",
          border: "1px solid rgba(251, 80, 195, 0.3)",
          borderRadius: "20px",
          boxShadow: "0 28px 80px rgba(0, 0, 0, 0.7), 0 0 40px rgba(251, 80, 195, 0.15)",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          position: "relative",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "12px",
                background: "rgba(251, 80, 195, 0.15)",
                border: "1px solid rgba(251, 80, 195, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fb50c3",
                flexShrink: 0,
              }}
            >
              <AlertCircle size={22} />
            </div>
            <div>
              <h3 id="incomplete-modal-title" style={{ margin: 0, color: "#ffffff", fontSize: "18px", fontWeight: 700 }}>
                التقييم غير مكتمل
              </h3>
              <p style={{ margin: "2px 0 0", color: "rgba(231, 237, 253, 0.65)", fontSize: "13px" }}>
                يرجى استكمال الحقول الإلزامية قبل اعتماد المراجعة النهائية
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "rgba(231, 237, 253, 0.05)",
              border: "1px solid rgba(231, 237, 253, 0.1)",
              color: "rgba(231, 237, 253, 0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            aria-label="إغلاق التنبيه"
          >
            <X size={18} />
          </button>
        </div>

        {/* Missing items list */}
        <div
          style={{
            background: "rgba(251, 80, 195, 0.04)",
            border: "1px solid rgba(251, 80, 195, 0.15)",
            borderRadius: "14px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#fb50c3" }}>
            تبقى العناصر التالية لإتمام التقييم:
          </span>

          <ul style={{ margin: 0, paddingRight: "18px", display: "flex", flexDirection: "column", gap: "6px" }}>
            {missingItems.map((item, idx) => (
              <li
                key={idx}
                style={{
                  color: "#e7edfd",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Footer Actions */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px", paddingTop: "4px" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              minHeight: "42px",
              padding: "0 18px",
              borderRadius: "12px",
              background: "rgba(231, 237, 253, 0.05)",
              border: "1px solid rgba(231, 237, 253, 0.12)",
              color: "#e7edfd",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            إغلاق ومتابعة
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              onNavigateToFirstMissing();
            }}
            style={{
              minHeight: "42px",
              padding: "0 20px",
              borderRadius: "12px",
              background: "#c3f937",
              border: "1px solid #c3f937",
              color: "#0c1018",
              fontSize: "14px",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
            }}
          >
            <span>الانتقال إلى أول عنصر ناقص</span>
            <ArrowLeft size={16} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
