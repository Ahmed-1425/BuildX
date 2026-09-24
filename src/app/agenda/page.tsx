import type { Metadata } from "next";
import AgendaClient from "./AgendaClient";

export const metadata: Metadata = {
  title: "أجندة الحفل الختامي | BUILDx",
  description:
    "تابع أجندة الحفل الختامي لـBUILDx لحظة بلحظة، من استقبال الضيوف وحتى إعلان الفائزين.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "أجندة الحفل الختامي | BUILDx",
    description:
      "تابع أجندة الحفل الختامي لـBUILDx — الثلاثاء 6 أكتوبر 2026 في T2 Business، الرياض.",
    type: "website",
    locale: "ar_SA",
  },
};

export default function AgendaPage() {
  return <AgendaClient />;
}
