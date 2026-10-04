"use client";

import { useState, useCallback, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  ExternalLink,
  X,
  Check,
  Copy,
  Download,
  ChevronDown,
  AlertTriangle,
  Layers,
  Sparkles,
  Smartphone,
  Globe,
} from "lucide-react";
import confetti from "canvas-confetti";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  bg: "#0a0d14",
  surface: "#131720",
  surfaceRaised: "#1b1f2e",
  surfaceCard: "#161b26",
  lime: "#c3f937",
  pink: "#fb50c3",
  purple: "#34155f",
  purpleLight: "#5c2b9e",
  text: "#e7edfd",
  muted: "rgba(231,237,253,0.55)",
  border: "rgba(231,237,253,0.08)",
  borderHover: "rgba(231,237,253,0.18)",
};

// ─── Calendar event data ───────────────────────────────────────────────────────
export interface CalEvent {
  id: string;
  uid: string;
  title: string;
  titleEn: string;
  dateLabel: string;
  dayNum: string;
  cardTitle: string;
  cardSubtitle?: string;
  description: string;
  startLocal: string; // YYYYMMDDTHHMMSS (local Riyadh)
  endLocal: string;
  startDisplay: string;
  endDisplay: string;
  venue: string;
  venueMapUrl: string;
  character: string;
  accentColor: string;
  phase: 1 | 2 | 3;
  isBreak?: boolean;
  isDeadline?: boolean;
}

const ZID_MAP = "https://maps.app.goo.gl/CvWvjuE1xJ1R7abAA";
const T2_MAP = "https://maps.app.goo.gl/ttXkJJx1nrmr12g86?g_st=iw";
const BUILDX_URL = "https://buildx.tiqanah.org";

const CHARS = {
  ready: "/images/agenda/characters/ready.png",
  building: "/images/agenda/characters/building.png",
  thinking: "/images/agenda/characters/thinking.png",
  loading: "/images/agenda/characters/loading.png",
  success: "/images/agenda/characters/success.png",
  glass: "/images/agenda/characters/glass-characters.png",
  trophy: "/images/agenda/characters/trophy_465320.png",
  hollowVolt: "/images/agenda/characters/hollow-volt.png",
  hollowPink: "/images/agenda/characters/hollow-pink.png",
};

export const EVENTS: CalEvent[] = [
  {
    id: "day-1",
    uid: "buildx-2026-day1@buildx.tiqanah.org",
    title: "BUILDx — اليوم الأول: الانطلاقة وأساسيات Vibe Coding",
    titleEn: "BUILDx — Day 1: Kickoff & Vibe Coding Basics",
    dateLabel: "الأحد، 27 سبتمبر 2026",
    dayNum: "01",
    cardTitle: "الانطلاقة وأساسيات Vibe Coding",
    description:
      "التعرف على مفهوم Vibe Coding، أدواته، وطريقة تحويل الفكرة الأولى إلى نموذج رقمي قابل للتجربة.",
    startLocal: "20260927T170000",
    endLocal: "20260927T210000",
    startDisplay: "5:00 مساءً",
    endDisplay: "9:00 مساءً",
    venue: "Zid — زد",
    venueMapUrl: ZID_MAP,
    character: CHARS.ready,
    accentColor: C.lime,
    phase: 1,
  },
  {
    id: "day-2",
    uid: "buildx-2026-day2@buildx.tiqanah.org",
    title: "BUILDx — اليوم الثاني: FIRST BUILD ≠ FINAL BUILD",
    titleEn: "BUILDx — Day 2: FIRST BUILD ≠ FINAL BUILD",
    dateLabel: "الاثنين، 28 سبتمبر 2026",
    dayNum: "02",
    cardTitle: "FIRST BUILD ≠ FINAL BUILD",
    cardSubtitle: "من البناء الأول إلى منتج أفضل",
    description:
      "نبدأ بالنموذج الأولي، نختبره ونكتشف مشكلاته، ثم نطوّر البرومبت والمنتج خطوة بعد خطوة حتى نصل إلى نسخة أكثر وضوحًا وجودة وجاهزية.",
    startLocal: "20260928T170000",
    endLocal: "20260928T210000",
    startDisplay: "5:00 مساءً",
    endDisplay: "9:00 مساءً",
    venue: "Zid — زد",
    venueMapUrl: ZID_MAP,
    character: CHARS.building,
    accentColor: C.lime,
    phase: 1,
  },
  {
    id: "day-3",
    uid: "buildx-2026-day3@buildx.tiqanah.org",
    title: "BUILDx — اليوم الثالث: ربط المنتج بقاعدة البيانات باستخدام Supabase",
    titleEn: "BUILDx — Day 3: Connect to Database with Supabase",
    dateLabel: "الثلاثاء، 29 سبتمبر 2026",
    dayNum: "03",
    cardTitle: "من واجهة ثابتة إلى منتج متصل",
    cardSubtitle: "ربط قاعدة البيانات باستخدام Supabase",
    description:
      "تحويل النموذج من واجهة ثابتة إلى منتج متصل بالبيانات، وإنشاء قاعدة البيانات وربطها بالواجهات باستخدام Supabase.",
    startLocal: "20260929T170000",
    endLocal: "20260929T210000",
    startDisplay: "5:00 مساءً",
    endDisplay: "9:00 مساءً",
    venue: "Zid — زد",
    venueMapUrl: ZID_MAP,
    character: CHARS.thinking,
    accentColor: C.lime,
    phase: 1,
  },
  {
    id: "day-4",
    uid: "buildx-2026-day4@buildx.tiqanah.org",
    title: "BUILDx — اليوم الرابع: دمج الذكاء الاصطناعي ونشر المنتج",
    titleEn: "BUILDx — Day 4: AI Integration & Deploy",
    dateLabel: "الأربعاء، 30 سبتمبر 2026",
    dayNum: "04",
    cardTitle: "MAKE IT SMART. MAKE IT LIVE.",
    cardSubtitle: "وظائف الذكاء الاصطناعي والنشر على Netlify",
    description:
      "إضافة وظائف الذكاء الاصطناعي إلى المنتج، اختبارها، ثم تجهيز المشروع ونشره على Netlify ليصبح متاحًا عبر رابط فعلي.",
    startLocal: "20260930T170000",
    endLocal: "20260930T210000",
    startDisplay: "5:00 مساءً",
    endDisplay: "9:00 مساءً",
    venue: "Zid — زد",
    venueMapUrl: ZID_MAP,
    character: CHARS.loading,
    accentColor: C.lime,
    phase: 1,
  },
  {
    id: "day-5",
    uid: "buildx-2026-day5@buildx.tiqanah.org",
    title: "BUILDx — اليوم الخامس: من الفكرة إلى منتج قابل للتبني",
    titleEn: "BUILDx — Day 5: From Idea to Adoptable Product",
    dateLabel: "الخميس، 1 أكتوبر 2026",
    dayNum: "05",
    cardTitle: "من الفكرة إلى منتج قابل للتبني",
    description:
      "ثلاث ورش عملية تساعد المشاركين على صناعة الفكرة، بناء نموذج العمل، وتقديم المنتج بقصة مقنعة، يليها شرح الهاكاثون ومعايير التحكيم.",
    startLocal: "20261001T170000",
    endLocal: "20261001T210000",
    startDisplay: "5:00 مساءً",
    endDisplay: "9:00 مساءً",
    venue: "Zid — زد",
    venueMapUrl: ZID_MAP,
    character: CHARS.success,
    accentColor: C.lime,
    phase: 1,
  },
  {
    id: "hackathon-1",
    uid: "buildx-2026-hack1@buildx.tiqanah.org",
    title: "BUILDx Hackathon — اليوم الأول: انطلاق التحدي الجماعي",
    titleEn: "BUILDx Hackathon — Day 1: Team Challenge Kickoff",
    dateLabel: "الأحد، 4 أكتوبر 2026",
    dayNum: "01",
    cardTitle: "انطلاق التحدي الجماعي",
    description:
      "إعلان التحديات، تكوين الفرق، اختيار المسارات، توزيع الأدوار وبدء بناء المنتجات الرقمية.",
    startLocal: "20261004T170000",
    endLocal: "20261004T210000",
    startDisplay: "5:00 مساءً",
    endDisplay: "9:00 مساءً",
    venue: "Zid — زد",
    venueMapUrl: ZID_MAP,
    character: CHARS.hollowVolt,
    accentColor: C.pink,
    phase: 2,
  },
  {
    id: "hackathon-2",
    uid: "buildx-2026-hack2@buildx.tiqanah.org",
    title: "BUILDx Hackathon — اليوم الثاني: إكمال المنتج والاستعداد للعرض",
    titleEn: "BUILDx Hackathon — Day 2: Finalize & Prepare",
    dateLabel: "الاثنين، 5 أكتوبر 2026",
    dayNum: "02",
    cardTitle: "إكمال المنتج والاستعداد للعرض",
    description:
      "استكمال المنتج الأولي، اختبار الحل، معالجة المشكلات، وتجهيز العرض النهائي أمام لجنة التحكيم.",
    startLocal: "20261005T170000",
    endLocal: "20261005T210000",
    startDisplay: "5:00 مساءً",
    endDisplay: "9:00 مساءً",
    venue: "Zid — زد",
    venueMapUrl: ZID_MAP,
    character: CHARS.building,
    accentColor: C.pink,
    phase: 2,
  },
  {
    id: "deadline",
    uid: "buildx-2026-deadline@buildx.tiqanah.org",
    title: "BUILDx — الموعد النهائي لتسليم المشاريع",
    titleEn: "BUILDx — Project Submission Deadline",
    dateLabel: "الثلاثاء، 6 أكتوبر 2026",
    dayNum: "⏰",
    cardTitle: "الموعد النهائي لتسليم المشاريع",
    description:
      "آخر موعد معتمد لتسليم النسخة النهائية من المشروع والمواد المطلوبة.",
    startLocal: "20261006T090000",
    endLocal: "20261006T091500",
    startDisplay: "9:00 صباحًا",
    endDisplay: "9:15 صباحًا",
    venue: "موعد نهائي للتسليم",
    venueMapUrl: "",
    character: CHARS.thinking,
    accentColor: "#f97316",
    phase: 3,
    isDeadline: true,
  },
  {
    id: "closing",
    uid: "buildx-2026-closing@buildx.tiqanah.org",
    title: "BUILDx — الحفل الختامي وعرض المشاريع وإعلان النتائج",
    titleEn: "BUILDx — Closing Ceremony & Winners Announcement",
    dateLabel: "الثلاثاء، 6 أكتوبر 2026",
    dayNum: "🏆",
    cardTitle: "عرض المشاريع وإعلان النتائج",
    description:
      "الحفل الختامي لـBUILDx، ويشمل استقبال الضيوف، عرض المنتجات الرقمية، إعلان النتائج، تكريم المشاريع الفائزة، والصورة الجماعية الختامية.",
    startLocal: "20261006T170000",
    endLocal: "20261006T222900",
    startDisplay: "5:00 مساءً",
    endDisplay: "10:29 مساءً",
    venue: "T2 Business — تي تو بزنس",
    venueMapUrl: T2_MAP,
    character: CHARS.trophy,
    accentColor: C.lime,
    phase: 3,
  },
];

const PROGRAM_EVENTS = EVENTS;

// ─── Helpers: Timezone Conversions ─────────────────────────────────────────────
// Riyadh is UTC+3 (no DST). Subtract 3 hours for UTC.
function toGoogleDate(localICS: string): string {
  const year = parseInt(localICS.slice(0, 4));
  const month = parseInt(localICS.slice(4, 6)) - 1;
  const day = parseInt(localICS.slice(6, 8));
  const hour = parseInt(localICS.slice(9, 11));
  const min = parseInt(localICS.slice(11, 13));
  const utcHour = hour - 3;
  return `${year}${String(month + 1).padStart(2, "0")}${String(day).padStart(2, "0")}T${String(utcHour).padStart(2, "0")}${String(min).padStart(2, "0")}00Z`;
}

function toIsoUtcDate(localICS: string): string {
  const year = localICS.slice(0, 4);
  const month = localICS.slice(4, 6);
  const day = localICS.slice(6, 8);
  const hour = parseInt(localICS.slice(9, 11));
  const min = localICS.slice(11, 13);
  const utcHour = hour - 3;
  return `${year}-${month}-${day}T${String(utcHour).padStart(2, "0")}:${min}:00Z`;
}

export function googleCalUrl(ev: CalEvent): string {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: ev.title,
    dates: `${toGoogleDate(ev.startLocal)}/${toGoogleDate(ev.endLocal)}`,
    details: `${ev.description}\n\n📍 المكان: ${ev.venue}\n🌐 موقع البرنامج: ${BUILDX_URL}`,
    location: ev.venue + (ev.venueMapUrl ? ` (${ev.venueMapUrl})` : ""),
    ctz: "Asia/Riyadh",
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

export function outlookUrl(ev: CalEvent): string {
  const p = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: ev.title,
    startdt: toIsoUtcDate(ev.startLocal),
    enddt: toIsoUtcDate(ev.endLocal),
    body: `${ev.description}\n\nالمكان: ${ev.venue}\n${BUILDX_URL}`,
    location: ev.venue,
  });
  return `https://outlook.live.com/calendar/0/action/compose?${p.toString()}`;
}

// ─── Trigger File Download ───────────────────────────────────────────────────
function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// ─── Copy text ───────────────────────────────────────────────────────────────
function buildCopyText(): string {
  return `مواعيد BUILDx 2026 🗓️

📍 مرحلة التأسيس — Zid (5:00–9:00 م):
• الأحد 27 سبتمبر — الانطلاقة وأساسيات Vibe Coding
• الاثنين 28 سبتمبر — FIRST BUILD ≠ FINAL BUILD
• الثلاثاء 29 سبتمبر — ربط المنتج بقاعدة البيانات (Supabase)
• الأربعاء 30 سبتمبر — MAKE IT SMART. MAKE IT LIVE. (AI + Netlify)
• الخميس 1 أكتوبر — من الفكرة إلى منتج قابل للتبني

📍 مرحلة الهاكاثون — Zid (5:00–9:00 م):
• الأحد 4 أكتوبر — انطلاق التحدي الجماعي
• الاثنين 5 أكتوبر — إكمال المنتج والاستعداد للعرض

⏰ الثلاثاء 6 أكتوبر، 9:00 ص — آخر موعد لتسليم المشاريع

🏆 الثلاثاء 6 أكتوبر، 5:00–10:29 م — الحفل الختامي في T2 Business

رابط التقويم الكامل:
${BUILDX_URL}/calendar`;
}

// ─── Toast Component ─────────────────────────────────────────────────────────
function Toast({ msg, visible }: { msg: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          style={{
            position: "fixed",
            bottom: "clamp(24px, 5vw, 40px)",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "13px 22px",
            background: "#0c1018",
            border: `1px solid ${C.lime}50`,
            boxShadow: `0 8px 32px rgba(0,0,0,0.8), 0 0 0 1px ${C.lime}20`,
            color: C.lime,
            fontFamily: "var(--font-janna-bold, sans-serif)",
            fontSize: 14,
            fontWeight: 700,
            whiteSpace: "nowrap",
            pointerEvents: "none",
          }}
        >
          <Check size={17} />
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Add to Calendar Modal ────────────────────────────────────────────────────
type ModalMode = "single" | "all" | null;

interface ModalProps {
  event: CalEvent | null;
  mode: ModalMode;
  onClose: () => void;
  onAction: (provider: string, event: CalEvent | null) => void;
  onSingleGoogleClick: (ev: CalEvent) => void;
}

function CalendarModal({
  event,
  mode,
  onClose,
  onAction,
  onSingleGoogleClick,
}: ModalProps) {
  const [showGoogleList, setShowGoogleList] = useState(false);
  const isOpen = mode !== null;
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const isAll = mode === "all";
  const title = isAll
    ? "أضف برنامج BUILDx كاملًا إلى تقويمك"
    : `أضف: ${event?.cardTitle ?? ""}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              zIndex: 8000,
              backdropFilter: "blur(6px)",
            }}
          />

          {/* Sheet / Modal */}
          <motion.div
            key="modal"
            initial={{
              opacity: 0,
              y: isMobile ? 80 : 20,
              scale: isMobile ? 1 : 0.96,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: isMobile ? 80 : 20,
              scale: isMobile ? 1 : 0.96,
            }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            style={{
              position: "fixed",
              zIndex: 8001,
              ...(isMobile
                ? {
                    bottom: 0,
                    left: 0,
                    right: 0,
                    maxHeight: "88vh",
                    overflowY: "auto",
                    borderRadius: "20px 20px 0 0",
                  }
                : {
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "min(480px, calc(100vw - 32px))",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    borderRadius: 0,
                  }),
              background: C.surface,
              border: `1px solid ${C.borderHover}`,
              boxShadow: `0 24px 70px rgba(0,0,0,0.85), 0 0 0 1px ${C.lime}20`,
              padding: "28px 24px 32px",
              boxSizing: "border-box",
            }}
          >
            {/* Drag handle on mobile */}
            {isMobile && (
              <div
                aria-hidden
                style={{
                  width: 44,
                  height: 4,
                  background: "rgba(231,237,253,0.2)",
                  borderRadius: 2,
                  margin: "0 auto 18px",
                }}
              />
            )}

            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "var(--font-arapix, monospace)",
                    fontSize: 11,
                    color: C.lime,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  {isAll ? "البرنامج كاملًا (9 فعاليات)" : "إضافة موعد للتقويم"}
                </p>
                <h2
                  style={{
                    fontFamily: "var(--font-news-almstqbl, serif)",
                    fontSize: "clamp(1.1rem, 4vw, 1.35rem)",
                    color: C.text,
                    lineHeight: 1.3,
                    margin: 0,
                  }}
                >
                  {title}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="إغلاق"
                style={{
                  background: "rgba(231,237,253,0.06)",
                  border: `1px solid ${C.border}`,
                  color: C.muted,
                  cursor: "pointer",
                  padding: 8,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: 38,
                  minHeight: 38,
                  transition: "background 0.15s",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Options for ALL Program vs SINGLE Day */}
            {isAll ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* 1. Primary Full Program ICS (Universal: Apple, iPhone, Mac, Outlook, etc.) */}
                <button
                  onClick={() => onAction("ics-full", null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "16px 18px",
                    background: `${C.lime}10`,
                    border: `1px solid ${C.lime}50`,
                    borderRadius: 0,
                    cursor: "pointer",
                    textAlign: "right",
                    color: C.lime,
                    fontFamily: "var(--font-janna-bold, sans-serif)",
                    fontSize: 15,
                    fontWeight: 700,
                    width: "100%",
                    minHeight: 56,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = `${C.lime}20`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = `${C.lime}10`;
                  }}
                >
                  <Download size={22} style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1, textAlign: "right" }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: C.lime }}>
                      تحميل ملف التقويم الشامل (.ics)
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "rgba(231,237,253,0.7)",
                        fontWeight: 400,
                        marginTop: 2,
                      }}
                    >
                      موصى به لـ Apple و iPhone و Outlook وكل الأجهزة (يضيف 9 فعاليات دفعة واحدة)
                    </div>
                  </div>
                  <Check size={16} style={{ opacity: 0.7, flexShrink: 0 }} />
                </button>

                {/* 2. Apple Calendar Direct */}
                <button
                  onClick={() => onAction("apple", null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 18px",
                    background: C.surfaceRaised,
                    border: `1px solid ${C.border}`,
                    borderRadius: 0,
                    cursor: "pointer",
                    textAlign: "right",
                    color: C.text,
                    fontFamily: "var(--font-janna, sans-serif)",
                    fontSize: 14,
                    fontWeight: 700,
                    width: "100%",
                    minHeight: 52,
                    transition: "border-color 0.15s, background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = C.borderHover;
                    (e.currentTarget as HTMLButtonElement).style.background = C.surfaceCard;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = C.border;
                    (e.currentTarget as HTMLButtonElement).style.background = C.surfaceRaised;
                  }}
                >
                  <Smartphone size={20} style={{ color: "#e7edfd", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div>إضافة إلى Apple Calendar / iOS</div>
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}>
                      يفتح تطبيق التقويم لإضافة البرنامج كاملًا
                    </div>
                  </div>
                  <ExternalLink size={14} style={{ opacity: 0.4, flexShrink: 0 }} />
                </button>

                {/* 3. Google Calendar Section (Import All OR Pick Days) */}
                <div
                  style={{
                    background: C.surfaceRaised,
                    border: `1px solid ${C.border}`,
                    padding: "14px 16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Globe size={18} style={{ color: "#4285f4", flexShrink: 0 }} />
                      <span
                        style={{
                          fontFamily: "var(--font-janna-bold, sans-serif)",
                          fontSize: 14,
                          fontWeight: 700,
                          color: C.text,
                        }}
                      >
                        Google Calendar
                      </span>
                    </div>
                    <button
                      onClick={() => onAction("google-import-guide", null)}
                      style={{
                        background: "#4285f418",
                        border: "1px solid #4285f440",
                        color: "#4285f4",
                        fontSize: 12,
                        fontFamily: "var(--font-janna-bold, sans-serif)",
                        padding: "4px 10px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      <Download size={12} />
                      استيراد الكل في Google
                    </button>
                  </div>

                  <p
                    style={{
                      fontFamily: "var(--font-janna, sans-serif)",
                      fontSize: 12,
                      color: C.muted,
                      lineHeight: 1.5,
                      margin: "0 0 10px 0",
                    }}
                  >
                    تقويم قوقل يستورد البرنامج كاملًا عبر ملف التقويم، أو يمكنك إضافة الأيام يومًا بيوم عبر الروابط المباشرة أدناه:
                  </p>

                  {/* Toggle button to show direct links for all days */}
                  <button
                    onClick={() => setShowGoogleList(!showGoogleList)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: C.lime,
                      fontFamily: "var(--font-janna, sans-serif)",
                      fontSize: 12,
                      cursor: "pointer",
                      padding: 0,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontWeight: 700,
                    }}
                  >
                    <ChevronDown
                      size={14}
                      style={{
                        transform: showGoogleList ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                      }}
                    />
                    {showGoogleList ? "إخفاء قائمة الأيام" : "عرض روابط إضافة كل يوم لتقويم قوقل"}
                  </button>

                  {/* Expandable list of days for direct Google Calendar addition */}
                  <AnimatePresence>
                    {showGoogleList && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{
                          overflow: "hidden",
                          marginTop: 12,
                          display: "flex",
                          flexDirection: "column",
                          gap: 6,
                          borderTop: `1px solid ${C.border}`,
                          paddingTop: 10,
                        }}
                      >
                        {PROGRAM_EVENTS.map((ev) => (
                          <button
                            key={ev.id}
                            onClick={() => onSingleGoogleClick(ev)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "8px 12px",
                              background: C.surface,
                              border: `1px solid ${C.border}`,
                              color: C.text,
                              fontFamily: "var(--font-janna, sans-serif)",
                              fontSize: 12,
                              cursor: "pointer",
                              textAlign: "right",
                              transition: "border-color 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.borderColor =
                                `${ev.accentColor}60`;
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLButtonElement).style.borderColor = C.border;
                            }}
                          >
                            <span style={{ color: ev.accentColor, fontWeight: 700 }}>
                              {ev.dateLabel.split("،")[0]} ({ev.cardTitle.slice(0, 24)}...)
                            </span>
                            <span style={{ fontSize: 11, color: "#4285f4", display: "flex", alignItems: "center", gap: 4 }}>
                              أضف لـ Google <ExternalLink size={10} />
                            </span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 4. Outlook */}
                <button
                  onClick={() => onAction("ics-full", null)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 18px",
                    background: C.surfaceRaised,
                    border: `1px solid ${C.border}`,
                    borderRadius: 0,
                    cursor: "pointer",
                    textAlign: "right",
                    color: C.text,
                    fontFamily: "var(--font-janna, sans-serif)",
                    fontSize: 14,
                    fontWeight: 700,
                    width: "100%",
                    minHeight: 52,
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = C.borderHover;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = C.border;
                  }}
                >
                  <span style={{ fontSize: 18, flexShrink: 0 }}>📧</span>
                  <div style={{ flex: 1 }}>
                    <div>Outlook & تقويم مايكروسوفت</div>
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}>
                      تحميل ملف .ics المتوافق مع كافة إصدارات Outlook
                    </div>
                  </div>
                  <Download size={14} style={{ opacity: 0.5, flexShrink: 0 }} />
                </button>
              </div>
            ) : (
              /* Single Day Options */
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {/* Google Calendar Direct */}
                <button
                  onClick={() => onAction("google-single", event)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 18px",
                    background: "#4285f412",
                    border: "1px solid #4285f440",
                    borderRadius: 0,
                    cursor: "pointer",
                    textAlign: "right",
                    color: "#e7edfd",
                    fontFamily: "var(--font-janna-bold, sans-serif)",
                    fontSize: 15,
                    fontWeight: 700,
                    width: "100%",
                    minHeight: 52,
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#4285f422";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "#4285f412";
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0 }}>🗓️</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: "#4285f4" }}>إضافة إلى Google Calendar</div>
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}>
                      يفتح صفحة إضافة الحدث مباشرة في تقويم قوقل
                    </div>
                  </div>
                  <ExternalLink size={14} style={{ opacity: 0.6, color: "#4285f4" }} />
                </button>

                {/* Apple Calendar / ICS */}
                <button
                  onClick={() => onAction("ics-single", event)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 18px",
                    background: C.surfaceRaised,
                    border: `1px solid ${C.border}`,
                    borderRadius: 0,
                    cursor: "pointer",
                    textAlign: "right",
                    color: C.text,
                    fontFamily: "var(--font-janna, sans-serif)",
                    fontSize: 14,
                    fontWeight: 700,
                    width: "100%",
                    minHeight: 52,
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = C.borderHover;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = C.border;
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0 }}>🍎</span>
                  <div style={{ flex: 1 }}>
                    <div>إضافة إلى Apple Calendar / iOS</div>
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}>
                      تنزيل ملف .ics الخاص بهذا اليوم
                    </div>
                  </div>
                  <Download size={14} style={{ opacity: 0.5 }} />
                </button>

                {/* Outlook Web Direct */}
                <button
                  onClick={() => onAction("outlook-single", event)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 18px",
                    background: C.surfaceRaised,
                    border: `1px solid ${C.border}`,
                    borderRadius: 0,
                    cursor: "pointer",
                    textAlign: "right",
                    color: C.text,
                    fontFamily: "var(--font-janna, sans-serif)",
                    fontSize: 14,
                    fontWeight: 700,
                    width: "100%",
                    minHeight: 52,
                    transition: "border-color 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = C.borderHover;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.borderColor = C.border;
                  }}
                >
                  <span style={{ fontSize: 20, flexShrink: 0 }}>📧</span>
                  <div style={{ flex: 1 }}>
                    <div>إضافة إلى Outlook Live</div>
                    <div style={{ fontSize: 11, color: C.muted, fontWeight: 400 }}>
                      يفتح صفحة إضافة الحدث في تقويم Outlook
                    </div>
                  </div>
                  <ExternalLink size={14} style={{ opacity: 0.5 }} />
                </button>
              </div>
            )}

            <p
              style={{
                marginTop: 18,
                fontFamily: "var(--font-janna, sans-serif)",
                fontSize: 12,
                color: C.muted,
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              جميع المواعيد بتوقيت الرياض (UTC+3) ومجهزة بتنبيهات مسبقة.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Event Card ────────────────────────────────────────────────────────────────
function EventCard({
  ev,
  onAdd,
  addedIds,
}: {
  ev: CalEvent;
  onAdd: (event: CalEvent) => void;
  addedIds: Set<string>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isAdded = addedIds.has(ev.id);
  const isEnglishTitle = /^[A-Z]/.test(ev.cardTitle) && ev.cardTitle.length < 40;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderTop: `2px solid ${ev.accentColor}`,
        boxSizing: "border-box",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 0,
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
      whileHover={{
        borderColor: `${ev.accentColor}40`,
        transition: { duration: 0.15 },
      }}
    >
      {/* Accent glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 120,
          height: 120,
          background: `radial-gradient(circle at top right, ${ev.accentColor}12, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Row 1: date tag + character */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 8,
          marginBottom: 14,
        }}
      >
        {/* Day badge */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!ev.isDeadline && !isNaN(Number(ev.dayNum)) && (
            <span
              style={{
                fontFamily: "var(--font-bauhaus, monospace)",
                fontSize: 11,
                color: ev.accentColor,
                background: `${ev.accentColor}15`,
                border: `1px solid ${ev.accentColor}30`,
                padding: "2px 8px",
                letterSpacing: "0.06em",
                flexShrink: 0,
              }}
            >
              {ev.phase === 2 ? `هاكاثون ${ev.dayNum}` : `اليوم ${ev.dayNum}`}
            </span>
          )}
          {ev.isDeadline && (
            <span
              style={{
                fontFamily: "var(--font-arapix, monospace)",
                fontSize: 11,
                color: "#f97316",
                background: "rgba(249,115,22,0.12)",
                border: "1px solid rgba(249,115,22,0.3)",
                padding: "2px 8px",
                letterSpacing: "0.06em",
                flexShrink: 0,
              }}
            >
              DEADLINE
            </span>
          )}
        </div>

        {/* Character */}
        <Image
          src={ev.character}
          alt=""
          aria-hidden
          width={48}
          height={48}
          loading="lazy"
          style={{
            width: 48,
            height: 48,
            objectFit: "contain",
            imageRendering: "pixelated",
            flexShrink: 0,
            filter:
              ev.character === CHARS.trophy
                ? "drop-shadow(0 0 8px rgba(195,249,55,0.4))"
                : "none",
          }}
        />
      </div>

      {/* Date label */}
      <p
        style={{
          fontFamily: "var(--font-arapix, monospace)",
          fontSize: 11,
          color: C.muted,
          letterSpacing: "0.04em",
          marginBottom: 6,
        }}
      >
        {ev.dateLabel}
      </p>

      {/* Card title */}
      <h3
        style={{
          fontFamily: isEnglishTitle
            ? "var(--font-bauhaus, monospace)"
            : "var(--font-news-almstqbl, serif)",
          fontSize: isEnglishTitle
            ? "clamp(1rem, 3.5vw, 1.35rem)"
            : "clamp(1.05rem, 3.5vw, 1.4rem)",
          color: C.text,
          lineHeight: 1.25,
          margin: 0,
          marginBottom: ev.cardSubtitle ? 4 : 10,
          wordBreak: "break-word",
          overflowWrap: "anywhere",
        }}
      >
        {ev.cardTitle}
      </h3>

      {/* Subtitle */}
      {ev.cardSubtitle && (
        <p
          style={{
            fontFamily: "var(--font-janna, sans-serif)",
            fontSize: 13,
            color: ev.accentColor,
            marginBottom: 10,
            lineHeight: 1.4,
          }}
        >
          {ev.cardSubtitle}
        </p>
      )}

      {/* Description */}
      <p
        style={{
          fontFamily: "var(--font-janna, sans-serif)",
          fontSize: 13,
          color: C.muted,
          lineHeight: 1.6,
          marginBottom: 16,
          flex: 1,
        }}
      >
        {ev.description}
      </p>

      {/* Meta row: time + venue */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 16px",
          marginBottom: 16,
        }}
      >
        {/* Time */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: C.muted,
            fontFamily: "var(--font-janna, sans-serif)",
          }}
        >
          <Clock size={13} style={{ color: ev.accentColor, flexShrink: 0 }} />
          <span>
            {ev.startDisplay} – {ev.endDisplay}
          </span>
        </div>

        {/* Venue */}
        {!ev.isDeadline ? (
          <a
            href={ev.venueMapUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: C.muted,
              fontFamily: "var(--font-janna, sans-serif)",
              textDecoration: "none",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = ev.accentColor)
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLAnchorElement).style.color = C.muted)
            }
            aria-label={`افتح موقع ${ev.venue} على الخريطة`}
          >
            <MapPin size={13} style={{ color: ev.accentColor, flexShrink: 0 }} />
            <span style={{ whiteSpace: "nowrap" }}>{ev.venue}</span>
            <ExternalLink size={10} style={{ opacity: 0.5, flexShrink: 0 }} />
          </a>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              color: "#f97316",
              fontFamily: "var(--font-janna, sans-serif)",
            }}
          >
            <AlertTriangle size={13} style={{ flexShrink: 0 }} />
            <span>{ev.venue}</span>
          </div>
        )}
      </div>

      {/* Add button */}
      <button
        onClick={() => onAdd(ev)}
        aria-label={`أضف "${ev.cardTitle}" إلى تقويمك`}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "11px 16px",
          background: isAdded ? `${C.lime}15` : C.surfaceRaised,
          border: `1px solid ${isAdded ? C.lime : C.border}`,
          color: isAdded ? C.lime : C.text,
          fontFamily: "var(--font-janna-bold, sans-serif)",
          fontSize: 13,
          fontWeight: 700,
          cursor: "pointer",
          width: "100%",
          minHeight: 44,
          transition: "all 0.2s",
        }}
      >
        {isAdded ? (
          <>
            <Check size={14} />
            تم تجهيز الموعد ✓
          </>
        ) : (
          <>
            <Calendar size={14} />
            أضف هذا اليوم
          </>
        )}
      </button>
    </motion.div>
  );
}

// ─── Phase Section ────────────────────────────────────────────────────────────
function PhaseSection({
  phaseLabel,
  phaseColor,
  events,
  onAdd,
  addedIds,
}: {
  phaseLabel: string;
  phaseColor: string;
  events: CalEvent[];
  onAdd: (event: CalEvent) => void;
  addedIds: Set<string>;
}) {
  return (
    <section aria-label={phaseLabel} style={{ marginBottom: "clamp(40px, 6vw, 64px)" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: "clamp(20px, 3vw, 32px)",
          paddingBottom: 16,
          borderBottom: `1px solid ${phaseColor}20`,
        }}
      >
        <div
          aria-hidden
          style={{
            width: 4,
            height: 28,
            background: phaseColor,
            flexShrink: 0,
          }}
        />
        <h2
          style={{
            fontFamily: "var(--font-news-almstqbl, serif)",
            fontSize: "clamp(1.25rem, 4vw, 1.6rem)",
            color: C.text,
            margin: 0,
          }}
        >
          {phaseLabel}
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
          gap: 16,
        }}
      >
        {events.map((ev) => (
          <EventCard key={ev.id} ev={ev} onAdd={onAdd} addedIds={addedIds} />
        ))}
      </div>
    </section>
  );
}

// ─── Break Divider ────────────────────────────────────────────────────────────
function BreakDivider() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "clamp(20px, 4vw, 32px)",
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRight: "3px solid rgba(231,237,253,0.15)",
        marginBottom: "clamp(32px, 5vw, 48px)",
        boxSizing: "border-box",
        flexWrap: "wrap",
        gap: 16,
      }}
    >
      <Image
        src={CHARS.thinking}
        alt=""
        aria-hidden
        width={56}
        height={56}
        loading="lazy"
        style={{
          width: 56,
          height: 56,
          objectFit: "contain",
          imageRendering: "pixelated",
          flexShrink: 0,
          opacity: 0.7,
        }}
      />
      <div style={{ flex: 1, minWidth: 180 }}>
        <p
          style={{
            fontFamily: "var(--font-arapix, monospace)",
            fontSize: 11,
            color: "rgba(231,237,253,0.3)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          2 – 3 أكتوبر 2026
        </p>
        <h3
          style={{
            fontFamily: "var(--font-news-almstqbl, serif)",
            fontSize: "clamp(1rem, 3.5vw, 1.25rem)",
            color: "rgba(231,237,253,0.6)",
            margin: 0,
            marginBottom: 4,
          }}
        >
          استراحة واستعداد
        </h3>
        <p
          style={{
            fontFamily: "var(--font-janna, sans-serif)",
            fontSize: 13,
            color: "rgba(231,237,253,0.35)",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          يومان للاستعداد، مراجعة المهارات، ترتيب الأفكار وإعادة شحن الطاقة قبل انطلاق الهاكاثون.
        </p>
      </div>
    </motion.div>
  );
}

// ─── Venue Card ───────────────────────────────────────────────────────────────
function VenueCard({
  name,
  sub,
  dates,
  mapUrl,
  logoSrc,
  color,
}: {
  name: string;
  sub: string;
  dates: string;
  mapUrl: string;
  logoSrc?: string;
  color: string;
}) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderTop: `2px solid ${color}`,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxSizing: "border-box",
      }}
    >
      {logoSrc && (
        <Image
          src={logoSrc}
          alt={name}
          width={80}
          height={40}
          loading="lazy"
          style={{ width: "auto", height: 32, objectFit: "contain" }}
        />
      )}
      <div>
        <p
          style={{
            fontFamily: "var(--font-news-almstqbl, serif)",
            fontSize: "clamp(1.1rem, 3.5vw, 1.3rem)",
            color: C.text,
            margin: 0,
            marginBottom: 4,
          }}
        >
          {name}
        </p>
        <p
          style={{
            fontFamily: "var(--font-janna, sans-serif)",
            fontSize: 13,
            color: C.muted,
            margin: 0,
            marginBottom: 4,
          }}
        >
          {sub}
        </p>
        <p
          style={{
            fontFamily: "var(--font-arapix, monospace)",
            fontSize: 11,
            color: color,
            letterSpacing: "0.05em",
            margin: 0,
          }}
        >
          {dates}
        </p>
      </div>
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`افتح موقع ${name} على الخريطة`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 16px",
          background: C.surfaceRaised,
          border: `1px solid ${color}30`,
          color: color,
          fontFamily: "var(--font-janna-bold, sans-serif)",
          fontSize: 13,
          fontWeight: 700,
          textDecoration: "none",
          transition: "border-color 0.15s",
          minHeight: 44,
          alignSelf: "flex-start",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.borderColor = color)
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.borderColor = `${color}30`)
        }
      >
        <MapPin size={13} />
        افتح الموقع على الخريطة
        <ExternalLink size={11} style={{ opacity: 0.6 }} />
      </a>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function CalendarClient() {
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [modalEvent, setModalEvent] = useState<CalEvent | null>(null);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [toastMsg, setToastMsg] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const [isAllAdded, setIsAllAdded] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastVisible(false), 3500);
  }, []);

  const handleOpenModal = useCallback((event: CalEvent) => {
    setModalEvent(event);
    setModalMode("single");
  }, []);

  const handleOpenAllModal = useCallback(() => {
    setModalEvent(null);
    setModalMode("all");
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalMode(null);
    setModalEvent(null);
  }, []);

  const handleSingleGoogleClick = useCallback((ev: CalEvent) => {
    window.open(googleCalUrl(ev), "_blank", "noopener,noreferrer");
    setAddedIds((prev) => new Set([...prev, ev.id]));
    showToast(`تم فتح ${ev.cardTitle} في تقويم Google ✓`);
  }, [showToast]);

  const handleAction = useCallback(
    (provider: string, event: CalEvent | null) => {
      if (provider === "ics-full" || provider === "apple") {
        // Universal full calendar file download
        triggerDownload("/buildx-2026-program.ics", "buildx-2026-program.ics");
        const allIds = new Set(PROGRAM_EVENTS.map((e) => e.id));
        setAddedIds(allIds);
        setIsAllAdded(true);
        showToast("تم تنزيل ملف برنامج BUILDx كاملًا (9 فعاليات) ✓");

        if (typeof window !== "undefined") {
          setTimeout(() => {
            confetti({
              particleCount: 60,
              spread: 55,
              origin: { y: 0.55 },
              colors: ["#c3f937", "#fb50c3", "#e7edfd", "#34155f"],
              disableForReducedMotion: true,
              shapes: ["square"],
            });
          }, 200);
        }
      } else if (provider === "google-import-guide") {
        // Download ICS file first, then open Google Calendar settings for import
        triggerDownload("/buildx-2026-program.ics", "buildx-2026-program.ics");
        setTimeout(() => {
          window.open(
            "https://calendar.google.com/calendar/u/0/r/settings/export",
            "_blank",
            "noopener,noreferrer"
          );
        }, 500);
        const allIds = new Set(PROGRAM_EVENTS.map((e) => e.id));
        setAddedIds(allIds);
        setIsAllAdded(true);
        showToast("تم تنزيل ملف البرنامج وفتح صفحة الاستيراد في Google ✓");
      } else if (provider === "google-single" && event) {
        window.open(googleCalUrl(event), "_blank", "noopener,noreferrer");
        setAddedIds((prev) => new Set([...prev, event.id]));
        showToast("تم فتح التقويم لإكمال الإضافة ✓");
      } else if (provider === "outlook-single" && event) {
        window.open(outlookUrl(event), "_blank", "noopener,noreferrer");
        setAddedIds((prev) => new Set([...prev, event.id]));
        showToast("تم فتح التقويم لإكمال الإضافة ✓");
      } else if (provider === "ics-single" && event) {
        triggerDownload(`/api/calendar/ics?id=${event.id}`, `buildx-2026-${event.id}.ics`);
        setAddedIds((prev) => new Set([...prev, event.id]));
        showToast("تم تنزيل موعد الفعالية ✓");
      }

      handleCloseModal();
    },
    [handleCloseModal, showToast]
  );

  const handleCopy = useCallback(() => {
    navigator.clipboard
      .writeText(buildCopyText())
      .then(() => showToast("تم نسخ مواعيد BUILDx ✓"))
      .catch(() => showToast("تعذّر النسخ، يرجى المحاولة مرة أخرى"));
  }, [showToast]);

  // Phase groupings
  const phase1Events = EVENTS.filter((e) => e.phase === 1);
  const phase2Events = EVENTS.filter((e) => e.phase === 2);
  const phase3Events = EVENTS.filter((e) => e.phase === 3);

  return (
    <>
      {/* Robots meta */}
      <meta name="robots" content="noindex,nofollow" />

      {/* ── Page ── */}
      <div
        dir="rtl"
        style={{
          minHeight: "100vh",
          background: C.bg,
          color: C.text,
          overflowX: "clip",
        }}
      >
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section
          aria-label="موعدنا صار أقرب"
          style={{
            position: "relative",
            overflow: "hidden",
            paddingTop: "clamp(56px, 10vw, 96px)",
            paddingBottom: "clamp(48px, 8vw, 80px)",
            paddingInline: "clamp(16px, 4vw, 48px)",
            boxSizing: "border-box",
          }}
        >
          {/* Grid bg */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "linear-gradient(rgba(195,249,55,0.035) 1px,transparent 1px),linear-gradient(90deg,rgba(195,249,55,0.035) 1px,transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage:
                "radial-gradient(ellipse 80% 90% at 50% 0%,black 30%,transparent 100%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 80% 90% at 50% 0%,black 30%,transparent 100%)",
            }}
          />
          {/* Glow */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "-15%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "60%",
              maxWidth: 500,
              aspectRatio: "1",
              background:
                "radial-gradient(circle,rgba(52,21,95,0.45) 0%,transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
              maxWidth: 900,
              marginInline: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "clamp(16px, 2.5vw, 24px)",
            }}
          >
            {/* Logo + character row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "clamp(16px, 3vw, 32px)",
                flexWrap: "wrap",
              }}
            >
              <Image
                src="/assets/logos/logo-white-glow.png"
                alt="BUILDx"
                width={1151}
                height={328}
                priority
                style={{
                  width: "clamp(120px, 20vw, 200px)",
                  height: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 18px rgba(195,249,55,0.2))",
                }}
              />
              <Image
                src={CHARS.ready}
                alt=""
                aria-hidden
                width={72}
                height={72}
                priority
                style={{
                  width: "clamp(52px, 8vw, 72px)",
                  height: "auto",
                  objectFit: "contain",
                  imageRendering: "pixelated",
                }}
              />
            </motion.div>

            {/* Pixel label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              style={{
                fontFamily: "var(--font-arapix, monospace)",
                fontSize: "clamp(9px, 1.5vw, 12px)",
                color: C.lime,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
              }}
            >
              SAVE THE DATES — BUILD. TEST. LAUNCH.
            </motion.p>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              style={{
                fontFamily: "var(--font-news-almstqbl, serif)",
                fontSize: "clamp(2rem, 6vw, 4rem)",
                lineHeight: 1.1,
                color: C.text,
                margin: 0,
              }}
            >
              موعدنا صار أقرب
            </motion.h1>

            {/* Sub heading */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.22 }}
              style={{
                fontFamily: "var(--font-janna, sans-serif)",
                fontSize: "clamp(14px, 2.5vw, 18px)",
                color: C.muted,
                lineHeight: 1.7,
                maxWidth: 580,
                margin: 0,
              }}
            >
              أضف أيام BUILDx إلى تقويمك، وخلك حاضرًا في كل مرحلة من أول
              بناء إلى لحظة إعلان الفائزين.
            </motion.p>

            {/* Summary chips */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                justifyContent: "center",
              }}
            >
              {[
                { icon: <Calendar size={13} />, text: "27 سبتمبر – 6 أكتوبر 2026" },
                { icon: <Clock size={13} />, text: "توقيت الرياض" },
                { icon: <MapPin size={13} />, text: "Zid وT2 Business" },
              ].map((chip, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "6px 12px",
                    background: "rgba(231,237,253,0.05)",
                    border: `1px solid ${C.border}`,
                    fontSize: 13,
                    color: C.muted,
                    fontFamily: "var(--font-janna, sans-serif)",
                  }}
                >
                  <span style={{ color: C.lime }}>{chip.icon}</span>
                  {chip.text}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.38 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 12,
                justifyContent: "center",
                width: "100%",
              }}
            >
              {/* Primary button */}
              <motion.button
                onClick={handleOpenAllModal}
                animate={
                  isAllAdded
                    ? {}
                    : {
                        boxShadow: [
                          `0 0 0 0 ${C.lime}40`,
                          `0 0 0 8px ${C.lime}00`,
                          `0 0 0 0 ${C.lime}40`,
                        ],
                      }
                }
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "clamp(13px, 2vw, 16px) clamp(20px, 3vw, 28px)",
                  background: isAllAdded ? `${C.lime}15` : C.lime,
                  border: `1px solid ${isAllAdded ? C.lime : C.lime}`,
                  color: isAllAdded ? C.lime : "#0a0d14",
                  fontFamily: "var(--font-janna-bold, sans-serif)",
                  fontSize: "clamp(14px, 2.5vw, 16px)",
                  fontWeight: 700,
                  cursor: "pointer",
                  minHeight: 52,
                  whiteSpace: "nowrap",
                  borderRadius: 0,
                }}
              >
                {isAllAdded ? (
                  <>
                    <Check size={16} />
                    جاهز للإضافة ✓
                  </>
                ) : (
                  <>
                    <Calendar size={16} />
                    أضف برنامج BUILDx كاملًا
                  </>
                )}
              </motion.button>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                aria-label="نسخ مواعيد البرنامج"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "clamp(13px, 2vw, 16px) clamp(20px, 3vw, 28px)",
                  background: "transparent",
                  border: `1px solid ${C.border}`,
                  color: C.muted,
                  fontFamily: "var(--font-janna, sans-serif)",
                  fontSize: "clamp(13px, 2vw, 15px)",
                  cursor: "pointer",
                  minHeight: 52,
                  whiteSpace: "nowrap",
                  borderRadius: 0,
                  transition: "border-color 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = C.borderHover;
                  (e.currentTarget as HTMLButtonElement).style.color = C.text;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = C.border;
                  (e.currentTarget as HTMLButtonElement).style.color = C.muted;
                }}
              >
                <Copy size={14} />
                نسخ مواعيد البرنامج
              </button>
            </motion.div>
          </div>
        </section>

        {/* ── Phases ──────────────────────────────────────────────────── */}
        <main
          id="calendar-main"
          style={{
            maxWidth: 900,
            marginInline: "auto",
            paddingInline: "clamp(16px, 4vw, 48px)",
            paddingBottom: "clamp(48px, 8vw, 80px)",
            boxSizing: "border-box",
          }}
        >
          {/* Phase 1: Foundation */}
          <PhaseSection
            phaseLabel="مرحلة التأسيس"
            phaseColor={C.lime}
            events={phase1Events}
            onAdd={handleOpenModal}
            addedIds={addedIds}
          />

          {/* Break divider */}
          <BreakDivider />

          {/* Phase 2: Hackathon */}
          <PhaseSection
            phaseLabel="مرحلة الهاكاثون"
            phaseColor={C.pink}
            events={phase2Events}
            onAdd={handleOpenModal}
            addedIds={addedIds}
          />

          {/* Phase 3: Closing */}
          <PhaseSection
            phaseLabel="لحظة الختام"
            phaseColor={C.lime}
            events={phase3Events}
            onAdd={handleOpenModal}
            addedIds={addedIds}
          />

          {/* ── Venues ────────────────────────────────────────────────── */}
          <section aria-label="وين نلتقي؟" style={{ marginTop: "clamp(32px, 5vw, 56px)" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: "clamp(20px, 3vw, 28px)",
              }}
            >
              <div
                aria-hidden
                style={{ width: 4, height: 28, background: C.lime, flexShrink: 0 }}
              />
              <h2
                style={{
                  fontFamily: "var(--font-news-almstqbl, serif)",
                  fontSize: "clamp(1.25rem, 4vw, 1.6rem)",
                  color: C.text,
                  margin: 0,
                }}
              >
                وين نلتقي؟
              </h2>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 280px), 1fr))",
                gap: 16,
              }}
            >
              <VenueCard
                name="Zid — زد"
                sub="أيام التدريب والهاكاثون"
                dates="27 سبتمبر – 5 أكتوبر 2026"
                mapUrl={ZID_MAP}
                logoSrc="/assets/partners/zid.png"
                color={C.lime}
              />
              <VenueCard
                name="T2 Business — تي تو بزنس"
                sub="الحفل الختامي وعرض المشاريع"
                dates="6 أكتوبر 2026"
                mapUrl={T2_MAP}
                logoSrc="/images/agenda/partners/t2-business-logo.png"
                color={C.pink}
              />
            </div>
          </section>

          {/* ── Footer note ─────────────────────────────────────────── */}
          <div
            style={{
              marginTop: "clamp(40px, 6vw, 64px)",
              paddingTop: "clamp(24px, 3vw, 32px)",
              borderTop: `1px solid ${C.border}`,
              textAlign: "center",
            }}
          >
            <Image
              src={CHARS.success}
              alt=""
              aria-hidden
              width={48}
              height={48}
              loading="lazy"
              style={{
                width: 48,
                height: 48,
                objectFit: "contain",
                imageRendering: "pixelated",
                margin: "0 auto 12px",
                display: "block",
              }}
            />
            <p
              style={{
                fontFamily: "var(--font-janna, sans-serif)",
                fontSize: 13,
                color: C.muted,
                lineHeight: 1.6,
              }}
            >
              جميع المواعيد بتوقيت الرياض (UTC+3).
              <br />
              احفظ الموعد وخلنا نبني معًا. 🚀
            </p>
          </div>
        </main>
      </div>

      {/* ── Modal ─────────────────────────────────────────────────────── */}
      <CalendarModal
        event={modalEvent}
        mode={modalMode}
        onClose={handleCloseModal}
        onAction={handleAction}
        onSingleGoogleClick={handleSingleGoogleClick}
      />

      {/* ── Toast ─────────────────────────────────────────────────────── */}
      <Toast msg={toastMsg} visible={toastVisible} />

      {/* ── Reduced motion ────────────────────────────────────────────── */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          *,*::before,*::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}
