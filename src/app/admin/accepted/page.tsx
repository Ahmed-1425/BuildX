import StatusFilteredApplicationsView from "@/components/admin/StatusFilteredApplicationsView";

export default function AcceptedCandidatesPage() {
  return (
    <StatusFilteredApplicationsView
      title="المقبولون في المعسكر (Accepted)"
      subtitle="قائمة المتقدمين المقبولين والمؤكد حضورهم لتوزيعهم على الفرق وتجهيزهم للهاكاثون."
      targetStatus="accepted"
      showWhatsAppButton
    />
  );
}
