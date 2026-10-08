import type { Metadata } from "next";
import GraduatesClient from "./GraduatesClient";
import { EDITIONS } from "@/data/graduates";

const SITE = "https://buildx.tiqanah.org";
const URL = `${SITE}/graduates`;
const TITLE = "خريجو BUILDx | النسخة الأولى";
const DESCRIPTION =
  "تعرّف على خريجي النسخة الأولى من BUILDx، الفرق المشاركة، الفائزين بالمراكز وجوائز الفئات.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: URL },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: URL,
    siteName: "BUILDx",
    type: "website",
    locale: "ar_SA",
    images: [
      {
        url: `${SITE}/assets/og-image.png`,
        width: 1200,
        height: 630,
        alt: "خريجو BUILDx — النسخة الأولى",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE}/assets/og-image.png`],
  },
};

export default function GraduatesPage() {
  const edition = EDITIONS.find((e) => e.status === "available") ?? EDITIONS[0];

  // Structured data built only from the data file (no invented facts).
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${URL}#page`,
        url: URL,
        name: TITLE,
        description: DESCRIPTION,
        inLanguage: "ar",
        isPartOf: { "@type": "WebSite", name: "BUILDx", url: SITE },
        mainEntity: {
          "@type": "ItemList",
          name: `فرق ${edition.label} من BUILDx`,
          numberOfItems: edition.teams.length,
          itemListElement: edition.teams.map((team, i) => {
            const awards = edition.awards.filter((a) => a.teamNumber === team.number).map((a) => a.title);
            return {
              "@type": "ListItem",
              position: i + 1,
              name: `الفريق ${team.number}${awards.length ? ` — ${awards.join("، ")}` : ""}`,
              url: `${URL}#team-${team.number}`,
            };
          }),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "BUILDx", item: SITE },
          { "@type": "ListItem", position: 2, name: "الخريجون", item: URL },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GraduatesClient />
    </>
  );
}
