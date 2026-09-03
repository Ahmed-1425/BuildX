"use client";
import { useEffect, useState } from "react";
import TeamBuilderBoard from "@/components/admin/TeamBuilderBoard";
import type { TeamItem } from "@/types/admin";

export default function TeamBuilderPage() {
  const [teams, setTeams] = useState<TeamItem[]>([]);
  const [unassigned, setUnassigned] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTeams() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/teams");
      const data = await res.json();
      if (data.success) {
        setTeams(data.teams);
        setUnassigned(data.unassigned);
      } else {
        setError(data.error || "تعذر تحميل الفرق.");
      }
    } catch {
      setError("حدث خطأ أثناء الاتصال بالخادم.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTeams();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-[#0c1018]/50 rounded-2xl border border-primary/20 animate-pulse">
        جارٍ تجهيز لوحة تكوين الفرق...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center bg-[#121622] border border-red-500/20 rounded-2xl text-red-400">
        <p className="font-bold mb-2">تعذر تحميل بيانات الفرق</p>
        <p className="text-xs text-slate-400 mb-4">{error}</p>
        <button
          type="button"
          onClick={loadTeams}
          className="px-4 py-2 text-xs font-bold bg-lime text-dark-base rounded-xl"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  return (
    <TeamBuilderBoard
      initialTeams={teams}
      unassignedCandidates={unassigned}
      canEdit={true}
    />
  );
}
