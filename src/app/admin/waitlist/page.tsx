import StatusFilteredApplicationsView from "@/components/admin/StatusFilteredApplicationsView";

export default function WaitlistCandidatesPage() {
  return (
    <StatusFilteredApplicationsView
      title="قائمة الانتظار (Waitlist)"
      subtitle="قائمة المتقدمين المؤهلين على دكة الاحتياط لترقيتهم إلى مقبولين في حال اعتذار أي مشارك."
      targetStatus="waitlisted"
    />
  );
}
