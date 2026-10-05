import type { Metadata, Viewport } from "next";
import TimerClient from "./TimerClient";

export const metadata: Metadata = {
  title: "مؤقت العروض | BUILDx",
  description:
    "مؤقت عروض الفرق في معسكر BUILDx — مؤقت 5 دقائق ودقيقتين بألوان واضحة وملء شاشة للعرض.",
  robots: { index: false, follow: false },
  openGraph: {
    title: "مؤقت العروض | BUILDx",
    description: "مؤقت عروض الفرق في معسكر BUILDx.",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "BUILDx Timer",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0c1018",
};

export default function TimerPage() {
  return <TimerClient />;
}
