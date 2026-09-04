import StatusFilteredApplicationsView from "@/components/admin/StatusFilteredApplicationsView";

export const metadata = {
  title: "المقبولون | BUILDx Admin",
};

export default function AcceptedCandidatesPage() {
  return (
    <StatusFilteredApplicationsView
      title="المقبولون"
      subtitle="قائمة المتقدمين المقبولين لتوزيعهم على الفرق وتجهيزهم للهاكاثون."
      targetStatus="accepted"
    />
  );
}
