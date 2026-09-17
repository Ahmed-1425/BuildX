import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  metadataBase: new URL("https://bulidx.tiqanah.org"),
  title: "BUILDx | معسكر الـ Vibe Coding الأول — من برومبت يُقال إلى منتج فعّال",
  description:
    "معسكر تدريبي تطبيقي وهاكاثون مكثف في الرياض يحوّل أفكارك وبرومبتاتك إلى منتجات رقمية متكاملة بالذكاء الاصطناعي. التسجيل متاح الآن — انضم وابدأ رحلة البناء!",
  keywords: [
    "BUILDx",
    "Vibe Coding",
    "معسكر",
    "camp",
    "AI",
    "ذكاء اصطناعي",
    "hackathon",
    "هاكاثون",
    "digital products",
    "منتجات رقمية",
    "تقانة",
    "Riyadh",
    "الرياض",
  ],
  openGraph: {
    title: "BUILDx | معسكر الـ Vibe Coding الأول — من برومبت يُقال إلى منتج فعّال",
    description:
      "معسكر تدريبي تطبيقي وهاكاثون مكثف في الرياض يحوّل أفكارك وبرومبتاتك إلى منتجات رقمية متكاملة بالذكاء الاصطناعي. التسجيل متاح الآن — انضم وابدأ رحلة البناء!",
    url: "https://bulidx.tiqanah.org",
    siteName: "BUILDx",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "BUILDx - من برومبت يُقال... إلى منتج فعّال",
      },
    ],
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BUILDx | معسكر الـ Vibe Coding الأول — من برومبت يُقال إلى منتج فعّال",
    description:
      "معسكر تدريبي تطبيقي وهاكاثون مكثف في الرياض يحوّل أفكارك وبرومبتاتك إلى منتجات رقمية متكاملة بالذكاء الاصطناعي. التسجيل متاح الآن — انضم وابدأ رحلة البناء!",
    images: ["/assets/og-image.png"],
  },
  icons: {
    icon: "/assets/characters/ready.png",
    apple: "/assets/characters/ready.png",
  },
  other: {
    "theme-color": "#0c1018",
  },
};

import GamingCursor from "@/components/GamingCursor";
import { RegistrationStatusProvider } from "@/context/RegistrationStatusContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0c1018" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Event",
              name: "BUILDx Vibe Coding Camp",
              description:
                "An intensive hands-on Vibe Coding camp designed to take participants from an initial idea to a functional AI-powered digital product.",
              startDate: "2026-09-27",
              endDate: "2026-10-06",
              eventStatus: "https://schema.org/EventScheduled",
              eventAttendanceMode:
                "https://schema.org/OfflineEventAttendanceMode",
              organizer: {
                "@type": "Organization",
                name: "BUILDx",
              },
              offers: {
                "@type": "Offer",
                availability: "https://schema.org/InStock",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-dark text-light antialiased">
        <GamingCursor />
        <LanguageProvider>
          <RegistrationStatusProvider>{children}</RegistrationStatusProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
