import type { Metadata } from "next";
import TeamPageClient from "./TeamPageClient";

export const metadata: Metadata = {
  title: "فريق العمل | BUILDx",
  description:
    "تعرّف على فريق BUILDx في إدارة المشروع والتنفيذ والإعلام والعلاقات العامة والإرشاد والتيسير والتحكيم.",
  openGraph: {
    title: "BUILDx Team",
    description:
      "Meet the BUILDx team across project management, execution, media, public relations, mentorship, facilitation, and judging.",
    images: [
      {
        url: "/assets/logos/logo-white-slogan.png",
        width: 1200,
        height: 630,
        alt: "BUILDx Team",
      },
    ],
  },
};

export default function TeamPage() {
  return <TeamPageClient />;
}
