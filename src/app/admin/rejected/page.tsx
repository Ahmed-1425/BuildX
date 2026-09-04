import StatusFilteredApplicationsView from "@/components/admin/StatusFilteredApplicationsView";

export const metadata = {
  title: "غير المقبولين | BUILDx Admin",
};

export default function RejectedCandidatesPage() {
  return (
    <StatusFilteredApplicationsView
      title="غير المقبولين"
      subtitle="قائمة الطلبات التي لم تستوفِ متطلبات المعسكر، مع إمكانية مراجعتها أو نقلها إذا دعت الحاجة."
      targetStatus="rejected"
    />
  );
}
