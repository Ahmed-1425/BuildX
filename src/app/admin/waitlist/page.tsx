import StatusFilteredApplicationsView from "@/components/admin/StatusFilteredApplicationsView";

export const metadata = {
  title: "قائمة الانتظار | BUILDx Admin",
};

export default function WaitlistCandidatesPage() {
  return (
    <StatusFilteredApplicationsView
      title="قائمة الانتظار"
      subtitle="قائمة المتقدمين المؤهلين على دكة الاحتياط لترقيتهم في حال اعتذار أي مشارك."
      targetStatus="waitlisted"
    />
  );
}
