"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  X,
  UserRound,
  Phone,
  GraduationCap,
  ShieldCheck,
  Globe,
  Mail,
  Copy,
  Check,
  ExternalLink,
  MessageCircle,
  Video,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import type { ApplicationDetailItem } from "@/types/admin";
import { getGenderLabel } from "@/types/admin";
import { toLatinDigits } from "@/lib/admin/formatters";
import { extractCandidateLinks } from "@/lib/admin/questionRegistry";
import styles from "./ApplicantProfileModal.module.css";

export type ApplicantProfileModalProps = {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  applicant?: ApplicationDetailItem | null;
  candidate?: ApplicationDetailItem | null;
  onEditStatus?: () => void;
  onGoToReview?: () => void;
  returnFocusRef?: React.RefObject<HTMLButtonElement | null>;
};

const STATUS_LABELS: Record<string, string> = {
  student: "طالب/ـة",
  graduate: "خريج/ـة",
  employed: "موظف/ـة",
  job_seeker: "باحث/ـة عن عمل",
  other: "أخرى",
};

const LEVEL_CONFIG: Record<string, { label: string; desc: string }> = {
  foundation: {
    label: "مبتدئ (Foundation)",
    desc: "المسار التأسيسي لتعلم أسلوب Vibe Coding وبناء أول منتج رقمي بالذكاء الاصطناعي.",
  },
  practitioner: {
    label: "ممارس (Practitioner)",
    desc: "مسار ذوي الخبرة المتوسطة في البرمجة لتسريع بناء النماذج الأولية المتقدمة.",
  },
  advanced: {
    label: "متقدم (Advanced)",
    desc: "المسار المتقدم للمحترفين لبناء وتطوير أنظمة رقمية متكاملة.",
  },
};

const APP_STATUS_LABELS: Record<string, string> = {
  submitted: "طلب جديد",
  under_review: "قيد المراجعة",
  in_review: "قيد المراجعة",
  preliminary_candidate: "مرشح مبدئيًا",
  shortlisted: "مرشح مبدئيًا",
  accepted: "مقبول",
  confirmed: "مؤكد الحضور",
  waitlisted: "قائمة الانتظار",
  waitlist: "قائمة الانتظار",
  rejected: "غير مقبول",
  withdrawn: "منسحب",
};

export function ApplicantProfileModal({
  open,
  isOpen,
  onClose,
  applicant: applicantProp,
  candidate,
  onEditStatus,
  onGoToReview,
  returnFocusRef,
}: ApplicantProfileModalProps) {
  const isModalOpen = open ?? isOpen ?? false;
  const applicant = applicantProp ?? candidate ?? null;

  const [mounted, setMounted] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (!isModalOpen || !applicant) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isModalOpen, applicant]);

  // Handle ESC key and Focus trap
  useEffect(() => {
    if (!isModalOpen || !applicant) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === first) {
            event.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            event.preventDefault();
            first.focus();
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    // Initial focus on close button
    const timer = setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
      if (returnFocusRef?.current) {
        returnFocusRef.current.focus();
      }
    };
  }, [isModalOpen, applicant, onClose, returnFocusRef]);

  // Copy helper
  function copyValue(val: string, key: string) {
    if (!val) return;
    navigator.clipboard.writeText(val);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  // Calculate age safely with validation
  const { calculatedAge, isBirthDateInvalid } = useMemo(() => {
    if (!applicant?.birth_date) return { calculatedAge: null, isBirthDateInvalid: false };
    const birth = new Date(applicant.birth_date);
    if (isNaN(birth.getTime())) return { calculatedAge: null, isBirthDateInvalid: true };
    const today = new Date();
    if (birth > today) return { calculatedAge: null, isBirthDateInvalid: true };
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    if (age <= 0 || age > 115) {
      return { calculatedAge: null, isBirthDateInvalid: true };
    }
    return { calculatedAge: age, isBirthDateInvalid: false };
  }, [applicant?.birth_date]);

  // Extract professional links
  const links = useMemo(() => {
    if (!applicant) return [];
    return extractCandidateLinks(applicant);
  }, [applicant]);

  if (!isModalOpen || !applicant || !mounted || typeof document === "undefined") {
    return null;
  }

  const levelDetails = LEVEL_CONFIG[applicant.level] || {
    label: applicant.level || "غير محدد",
    desc: "غير محدد",
  };

  const cleanPhoneDigits = applicant.phone ? applicant.phone.replace(/[^0-9]/g, "") : "";
  const whatsappUrl = cleanPhoneDigits ? `https://wa.me/${cleanPhoneDigits}` : null;

  return createPortal(
    <div
      className={styles.applicantOverlay}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        ref={dialogRef}
        className={styles.applicantDialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="applicant-profile-title"
      >
        {/* ── Fixed Header ────────────────────────────────────────────── */}
        <header className={styles.applicantHeader}>
          <div className={styles.headerCopy}>
            <span className={styles.eyebrow}>بيانات المتقدم</span>

            <h2 id="applicant-profile-title" className={styles.applicantName}>
              {applicant.full_name || "غير محدد"}
            </h2>

            <div className={styles.applicantMeta}>
              <span className={styles.metaChip}>
                رقم الطلب:{" "}
                <strong className={styles.ltrField}>
                  {toLatinDigits(applicant.reference_code || "غير محدد")}
                </strong>
              </span>

              <span className={styles.metaChip}>
                الحالة:{" "}
                <strong>
                  {APP_STATUS_LABELS[applicant.application_status] || applicant.application_status}
                </strong>
              </span>

              <span className={styles.metaChip}>
                المستوى: <strong>{levelDetails.label}</strong>
              </span>

              <span className={styles.metaChip}>
                المدينة: <strong>{applicant.city || "غير محدد"}</strong>
              </span>
            </div>
          </div>

          <button
            ref={closeBtnRef}
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="إغلاق نافذة بيانات المتقدم"
          >
            <X size={22} />
          </button>
        </header>

        {/* ── Scrollable Body ─────────────────────────────────────────── */}
        <div className={styles.applicantBody}>
          <div className={styles.sectionsGrid}>
            {/* 1. المعلومات الأساسية */}
            <article className={styles.profileSection}>
              <h3 className={styles.sectionHeading}>
                <span className={styles.sectionHeadingIcon}>
                  <UserRound size={20} />
                </span>
                <span>المعلومات الأساسية</span>
              </h3>

              <div className={styles.fieldsList}>
                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>الاسم الثلاثي</span>
                  <span className={styles.fieldValue}>{applicant.full_name || "غير محدد"}</span>
                </div>

                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>رقم الطلب</span>
                  <span className={`${styles.fieldValue} ${styles.ltrField}`}>
                    {toLatinDigits(applicant.reference_code || "غير محدد")}
                  </span>
                </div>

                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>تاريخ الميلاد</span>
                  <span className={`${styles.fieldValue} ${styles.ltrField}`}>
                    {applicant.birth_date ? toLatinDigits(applicant.birth_date) : "غير محدد"}
                  </span>
                </div>

                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>العمر</span>
                  <span className={styles.fieldValue}>
                    {calculatedAge !== null ? (
                      `${toLatinDigits(calculatedAge)} سنة`
                    ) : (
                      <span className="text-slate-400 font-normal">غير متاح</span>
                    )}
                    {isBirthDateInvalid && (
                      <span className="text-[11px] text-amber-400 font-normal mr-2">
                        (تاريخ غير صالح)
                      </span>
                    )}
                  </span>
                </div>

                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>الجنس</span>
                  <span className={styles.fieldValue}>
                    {getGenderLabel(applicant.gender)}
                  </span>
                </div>

                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>الحالة الحالية</span>
                  <span className={styles.fieldValue}>
                    {STATUS_LABELS[applicant.current_status] || applicant.current_status || "غير محدد"}
                    {applicant.current_status_other && ` (${applicant.current_status_other})`}
                  </span>
                </div>

                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>المدينة</span>
                  <span className={styles.fieldValue}>{applicant.city || "غير محدد"}</span>
                </div>
              </div>
            </article>

            {/* 2. الدراسة والعمل */}
            <article className={styles.profileSection}>
              <h3 className={styles.sectionHeading}>
                <span className={styles.sectionHeadingIcon}>
                  <GraduationCap size={20} />
                </span>
                <span>الدراسة والعمل</span>
              </h3>

              <div className={styles.fieldsList}>
                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>جهة الدراسة أو العمل</span>
                  <span className={styles.fieldValue}>{applicant.organization || "غير محدد"}</span>
                </div>

                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>التخصص أو المجال</span>
                  <span className={styles.fieldValue}>{applicant.specialization || "غير محدد"}</span>
                </div>

                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>المستوى المختار</span>
                  <span className={styles.fieldValue}>{levelDetails.label}</span>
                </div>

                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>وصف المستوى</span>
                  <span className={styles.fieldValue} style={{ fontSize: "14px", lineHeight: "1.7", color: "rgba(231, 237, 253, 0.78)" }}>
                    {levelDetails.desc}
                  </span>
                </div>
              </div>
            </article>

            {/* 3. بيانات التواصل */}
            <article className={styles.profileSection}>
              <h3 className={styles.sectionHeading}>
                <span className={styles.sectionHeadingIcon}>
                  <Phone size={20} />
                </span>
                <span>بيانات التواصل</span>
              </h3>

              <div className={styles.fieldsList}>
                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>رقم الجوال</span>
                  <span className={`${styles.fieldValue} ${styles.ltrField}`}>
                    {applicant.phone ? toLatinDigits(applicant.phone) : "غير محدد"}
                  </span>
                  {applicant.phone && (
                    <div className={styles.contactActionsRow}>
                      {whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noreferrer"
                          className={`${styles.contactActionBtn} ${styles.whatsappBtn}`}
                        >
                          <MessageCircle size={15} />
                          <span>WhatsApp</span>
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => copyValue(applicant.phone, "phone")}
                        className={`${styles.contactActionBtn} ${styles.copyBtn}`}
                      >
                        {copiedKey === "phone" ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                        <span>{copiedKey === "phone" ? "تم النسخ" : "نسخ الرقم"}</span>
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>البريد الإلكتروني</span>
                  <span className={`${styles.fieldValue} ${styles.ltrField}`}>
                    {applicant.email || "غير محدد"}
                  </span>
                  {applicant.email && (
                    <div className={styles.contactActionsRow}>
                      <a
                        href={`mailto:${applicant.email}`}
                        className={`${styles.contactActionBtn} ${styles.emailBtn}`}
                      >
                        <Mail size={15} />
                        <span>إرسال بريد</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => copyValue(applicant.email, "email")}
                        className={`${styles.contactActionBtn} ${styles.copyBtn}`}
                      >
                        {copiedKey === "email" ? <Check size={14} color="#34d399" /> : <Copy size={14} />}
                        <span>{copiedKey === "email" ? "تم النسخ" : "نسخ البريد"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>

            {/* 4. الإقرارات والتعهدات */}
            <article className={styles.profileSection}>
              <h3 className={styles.sectionHeading}>
                <span className={styles.sectionHeadingIcon}>
                  <ShieldCheck size={20} />
                </span>
                <span>الإقرارات والتعهدات</span>
              </h3>

              <div className={styles.fieldsList}>
                {/* Team preference */}
                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>بيئة الفريق</span>
                  <span className={styles.fieldValue}>
                    {applicant.team_environment_preference === "comfortable"
                      ? "يناسبني تمامًا العمل ضمن فريق مشترك (ذكور وإناث)"
                      : applicant.team_environment_preference === "same_gender_only"
                      ? "أفضل العمل مع فريق من نفس الجنس فقط"
                      : "غير محدد"}
                  </span>
                </div>

                {/* Attendance commitment */}
                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>الالتزام بالحضور</span>
                  <div className="flex items-center gap-2 pt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-200 text-sm font-medium">
                      أقر بالالتزام والتفرغ التام للحضور والمشاركة الفعالة
                    </span>
                  </div>
                </div>

                {/* Laptop commitment */}
                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>توفر وإحضار جهاز محمول (Laptop)</span>
                  <div className="flex items-center gap-2 pt-0.5">
                    {applicant.laptop_commitment === true ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-slate-200 text-sm font-medium">
                          أقر بتوفر جهاز محمول صالح للاستخدام والالتزام بإحضاره
                        </span>
                      </>
                    ) : applicant.laptop_commitment === false ? (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span className="text-rose-300 text-sm font-medium">
                          لم يتم الإقرار بتوفر جهاز محمول
                        </span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="text-slate-400 text-sm font-normal">
                          غير متاح (لم يكن مطلوبًا في الطلبات السابقة)
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Terms acceptance */}
                <div className={styles.profileField}>
                  <span className={styles.fieldLabel}>الموافقة على الشروط</span>
                  <div className="flex items-center gap-2 pt-0.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-slate-200 text-sm font-medium">
                      تمت الموافقة على صحة البيانات والشروط وسياسة الخصوصية
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* 5. الروابط المهنية ومعرض الأعمال (بعرض كامل) */}
          <article className={styles.fullWidthSection}>
            <h3 className={styles.sectionHeading}>
              <span className={styles.sectionHeadingIcon}>
                <Globe size={20} />
              </span>
              <span>الروابط المهنية ومعرض الأعمال</span>
            </h3>

            {/* Video preview for Advanced level if present */}
            {applicant.advanced_video_url && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  padding: "14px",
                  borderRadius: "12px",
                  background: "rgba(195, 249, 55, 0.05)",
                  border: "1px solid rgba(195, 249, 55, 0.2)",
                  marginBottom: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                  <Video size={20} color="#c3f937" />
                  <div>
                    <strong style={{ color: "#e7edfd", fontSize: "14px", display: "block" }}>
                      فيديو العرض الشخصي (المستوى المتقدم)
                    </strong>
                    <span className={styles.ltrField} style={{ fontSize: "12px", color: "#38bdf8" }}>
                      {applicant.advanced_video_url}
                    </span>
                  </div>
                </div>
                <a
                  href={applicant.advanced_video_url}
                  target="_blank"
                  rel="noreferrer"
                  className={`${styles.contactActionBtn} ${styles.primaryButton}`}
                  style={{ minHeight: "36px", padding: "0 14px", fontSize: "13px" }}
                >
                  <ExternalLink size={14} />
                  <span>فتح الفيديو</span>
                </a>
              </div>
            )}

            {links.length > 0 ? (
              <div className={styles.linksList}>
                {links.map((link, idx) => (
                  <div key={idx} className={styles.linkItemCard}>
                    <div className={styles.linkInfo}>
                      <span className={styles.linkType}>{link.name}</span>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.linkUrl}
                      >
                        {link.url}
                      </a>
                    </div>
                    <div className={styles.linkActions}>
                      <button
                        type="button"
                        onClick={() => copyValue(link.url, `link_${idx}`)}
                        className={`${styles.contactActionBtn} ${styles.copyBtn}`}
                        style={{ padding: "6px" }}
                        title="نسخ الرابط"
                      >
                        {copiedKey === `link_${idx}` ? (
                          <Check size={14} color="#34d399" />
                        ) : (
                          <Copy size={14} />
                        )}
                      </button>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`${styles.contactActionBtn} ${styles.copyBtn}`}
                        style={{ padding: "6px" }}
                        title="فتح الرابط"
                      >
                        <ExternalLink size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : !applicant.advanced_video_url ? (
              <div className={styles.emptyStateNotice}>
                لا توجد روابط مهنية أو ملفات أعمال مرفقة في هذا الطلب.
              </div>
            ) : null}
          </article>
        </div>

        {/* ── Fixed Footer ────────────────────────────────────────────── */}
        <footer className={styles.applicantFooter}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={onClose}
          >
            إغلاق
          </button>

          {onEditStatus && (
            <button
              type="button"
              className={styles.secondaryButton}
              onClick={() => {
                onClose();
                onEditStatus();
              }}
            >
              تعديل حالة الطلب
            </button>
          )}

          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => {
              onClose();
              if (onGoToReview) {
                onGoToReview();
              }
            }}
          >
            الانتقال إلى المراجعة الكاملة
          </button>
        </footer>
      </section>
    </div>,
    document.body
  );
}

export default ApplicantProfileModal;
