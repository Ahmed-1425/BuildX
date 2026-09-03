import StatusFilteredApplicationsView from "@/components/admin/StatusFilteredApplicationsView";

export default function PreliminaryCandidatesPage() {
  return (
    <StatusFilteredApplicationsView
      title="المرشحون مبدئيًا (Preliminary Candidates)"
      subtitle="قائمة المتقدمين الذين تم فرزهم وترشيحهم للمرحلة التالية قبل اعتماد القبول النهائي."
      targetStatus="preliminary_candidate"
    />
  );
}
