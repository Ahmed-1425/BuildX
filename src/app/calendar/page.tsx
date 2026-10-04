import type { Metadata } from "next";
import CalendarClient from "./CalendarClient";

export const metadata: Metadata = {
  title: "احفظ الموعد | BUILDx",
  description:
    "أضف أيام BUILDx إلى تقويمك — من أول بناء إلى لحظة إعلان الفائزين. 27 سبتمبر – 6 أكتوبر 2026.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "احفظ الموعد | BUILDx",
    description:
      "أضف أيام BUILDx إلى تقويمك. 27 سبتمبر – 6 أكتوبر 2026 بالرياض.",
    type: "website",
    locale: "ar_SA",
  },
};

export default function CalendarPage() {
  return <CalendarClient />;
}
