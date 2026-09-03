import StatusFilteredApplicationsView from "@/components/admin/StatusFilteredApplicationsView";

export default function RejectedCandidatesPage() {
  return (
    <StatusFilteredApplicationsView
      title="غير المقبولين (Rejected)"
      subtitle="قائمة الطلبات التي لم تستوفِ متطلبات المعسكر، مع إمكانية مراجعتها أو نقلها إذا دعت الحاجة."
      targetStatus="rejected"
    />
  );
}
