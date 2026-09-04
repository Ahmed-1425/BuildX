import React from "react";
import CandidateReviewWorkstation from "@/components/admin/CandidateReviewWorkstation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export const metadata = {
  title: "مراجعة طلب المتقدم | BUILDx Admin",
};

export default async function ApplicationReviewPage({ params }: PageProps) {
  const { id } = await params;
  return <CandidateReviewWorkstation id={id} />;
}
