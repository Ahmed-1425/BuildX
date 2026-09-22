import type { Metadata } from "next";
import TeamsDistributionClient from "./TeamsDistributionClient";

export const metadata: Metadata = {
  title: "توزيع الفرق | BUILDx",
  description:
    "توزيع فرق ومشاركي معسكر BUILDx — تعرّف على أعضاء فريقك وابدؤوا رحلة البناء معًا.",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "توزيع الفرق | BUILDx",
    description:
      "توزيع فرق ومشاركي معسكر BUILDx — تعرّف على أعضاء فريقك وابدؤوا رحلة البناء معًا.",
    images: [
      {
        url: "/assets/og-image.png",
        width: 1200,
        height: 630,
        alt: "BUILDx Teams Distribution",
      },
    ],
  },
};

export default function TeamsDistributionPage() {
  return <TeamsDistributionClient />;
}
