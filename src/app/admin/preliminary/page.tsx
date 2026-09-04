import StatusFilteredApplicationsView from "@/components/admin/StatusFilteredApplicationsView";

export const metadata = {
  title: "المرشحون مبدئيًا | BUILDx Admin",
};

export default function PreliminaryCandidatesPage() {
  return (
    <StatusFilteredApplicationsView
      title="المرشحون مبدئيًا"
      subtitle="قائمة المتقدمين الذين تم فرزهم وترشيحهم للمرحلة التالية قبل اعتماد القبول النهائي."
      targetStatus="preliminary_candidate"
    />
  );
}
