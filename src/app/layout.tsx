import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "BUILDx | معسكر Vibe Coding — Vibe Coding Camp",
  description:
    "تجربة تدريبية تطبيقية مكثفة تحوّل الأفكار والبرومبتات إلى منتجات رقمية فعّالة باستخدام الذكاء الاصطناعي. An intensive hands-on experience that transforms ideas and prompts into functional AI-powered digital products.",
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
  ],
  openGraph: {
    title: "BUILDx | Vibe Coding Camp",
    description:
      "An intensive hands-on experience that transforms ideas and prompts into functional AI-powered digital products.",
    images: [
      {
        url: "/assets/logos/logo-white-slogan.png",
        width: 1200,
        height: 630,
        alt: "BUILDx - From a prompt you say to a product that works",
      },
    ],
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
    siteName: "BUILDx",
  },
  twitter: {
    card: "summary_large_image",
    title: "BUILDx | Vibe Coding Camp",
    description:
      "An intensive hands-on experience that transforms ideas and prompts into functional AI-powered digital products.",
    images: ["/assets/logos/logo-white-slogan.png"],
  },
  icons: {
    icon: "/assets/characters/ready.png",
    apple: "/assets/characters/ready.png",
  },
  other: {
    "theme-color": "#0c1018",
  },
};

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
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
