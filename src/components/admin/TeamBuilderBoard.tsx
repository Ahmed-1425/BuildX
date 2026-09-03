"use client";
import React, { useState } from "react";
import type { TeamItem, TeamMemberItem } from "@/types/admin";
import { generateSuggestedTeams } from "@/lib/admin/teamSuggestions";
import { Wand2, Save, Users, AlertCircle, CheckCircle2, X, Plus } from "lucide-react";

interface Props {
  initialTeams: TeamItem[];
  unassignedCandidates: any[];
  canEdit: boolean;
}

export default function TeamBuilderBoard({
  initialTeams,
  unassignedCandidates,
  canEdit,
}: Props) {
  const [teams, setTeams] = useState<TeamItem[]>(initialTeams);
  const [unassigned, setUnassigned] = useState(unassignedCandidates);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Auto-suggest distribution
  function handleAutoSuggest() {
    if (!confirm("هل ترغب في توليد توزيع مقترح تلقائي للفرق بناءً على المستويات وتفضيلات بيئة الفريق؟")) {
      return;
    }

    const allPool: any[] = [...unassigned];
    teams.forEach((t) => {
      t.members.forEach((m) => {
        allPool.push({
          id: m.application_id,
          full_name: m.full_name,
          level: m.level,
          city: m.city,
          team_env: m.team_env,
        });
      });
    });

    const newTeams = generateSuggestedTeams(allPool, teams);
    setTeams(newTeams);

    const assignedIds = new Set<string>();
    newTeams.forEach((t) => t.members.forEach((m) => assignedIds.add(m.application_id)));
    setUnassigned(allPool.filter((c) => !assignedIds.has(c.id)));
    setMessage({ text: "تم توليد توزيع مقترح متوازن. يمكنك التعديل يدويًا ثم الضغط على «حفظ التوزيع النهائي».", type: "success" });
  }

  // Remove member from team to unassigned pool
  function handleRemoveMember(teamId: string, member: TeamMemberItem) {
    if (!canEdit) return;
    setTeams((prev) =>
      prev.map((t) => (t.id === teamId ? { ...t, members: t.members.filter((m) => m.id !== member.id) } : t))
    );
    setUnassigned((prev) => [
      ...prev,
      {
        id: member.application_id,
        full_name: member.full_name,
        level: member.level,
        city: member.city,
        team_env: member.team_env,
      },
    ]);
  }

  // Assign candidate to team
  function handleAssignCandidate(candidateId: string, targetTeamId: string) {
    if (!canEdit) return;
    const candidate = unassigned.find((c) => c.id === candidateId);
    if (!candidate) return;

    const team = teams.find((t) => t.id === targetTeamId);
    if (!team) return;

    if (team.members.length >= 4) {
      alert("هذا الفريق مكتمل بالفعل (4 أعضاء).");
      return;
    }

    const newMember: TeamMemberItem = {
      id: `m-${candidate.id}`,
      team_id: targetTeamId,
      application_id: candidate.id,
      full_name: candidate.full_name,
      level: candidate.level,
      city: candidate.city,
      team_env: candidate.team_env,
      role_in_team:
        candidate.level === "advanced"
          ? "متقدم"
          : candidate.level === "practitioner"
          ? "ممارس"
          : "مبتدئ",
    };

    setTeams((prev) =>
      prev.map((t) => (t.id === targetTeamId ? { ...t, members: [...t.members, newMember] } : t))
    );
    setUnassigned((prev) => prev.filter((c) => c.id !== candidateId));
  }

  // Save to database
  async function handleSave() {
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teams }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage({ text: data.message || "تم حفظ الفرق بنجاح!", type: "success" });
      } else {
        setMessage({ text: data.error || "تعذر حفظ الفرق.", type: "error" });
      }
    } catch {
      setMessage({ text: "حدث خطأ أثناء الاتصال بالخادم.", type: "error" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-[rgba(24,29,40,0.78)] border border-white/10 rounded-3xl backdrop-blur-md shadow-xl">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
            <span>لوحة توزيع الفرق (8 فرق • 32 مقعد)</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            التركيبة المستهدفة لكل فريق: (1 متقدم + 1 ممارس + 2 مبتدئين).
          </p>
        </div>

        {canEdit && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAutoSuggest}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-bold rounded-xl border border-white/15 text-slate-200 hover:text-white hover:bg-white/5 transition-all"
            >
              <Wand2 className="w-4 h-4 text-[#c3f937]" aria-hidden="true" />
              <span>إنشاء توزيع مقترح تلقائي</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] shadow-lg shadow-[#c3f937]/20 transition-all disabled:opacity-50"
            >
              <Save className="w-4 h-4" aria-hidden="true" />
              <span>{saving ? "جارٍ الحفظ..." : "حفظ التوزيع النهائي"}</span>
            </button>
          </div>
        )}
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs sm:text-sm font-bold flex items-center gap-2.5 ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" aria-hidden="true" />
          ) : (
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" aria-hidden="true" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Grid of 8 Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {teams.map((team) => {
          const advCount = team.members.filter((m) => m.level === "advanced").length;
          const pracCount = team.members.filter((m) => m.level === "practitioner").length;
          const fndCount = team.members.filter((m) => m.level === "foundation").length;
          const isBalanced = advCount === 1 && pracCount === 1 && fndCount === 2;

          return (
            <div
              key={team.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between transition-all backdrop-blur-md shadow-lg ${
                isBalanced
                  ? "bg-[rgba(24,29,40,0.85)] border-[#c3f937]/35 shadow-[0_0_20px_rgba(195,249,55,0.06)]"
                  : "bg-[rgba(24,29,40,0.7)] border-white/10"
              }`}
            >
              <div>
                {/* Team header */}
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold text-white text-base">{team.name}</h4>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold ${
                      team.members.length === 4
                        ? "bg-[#c3f937]/15 text-[#c3f937] border border-[#c3f937]/30"
                        : "bg-white/5 text-slate-400"
                    }`}
                  >
                    {team.members.length} / 4
                  </span>
                </div>

                {/* Composition badges */}
                <div className="flex gap-1.5 text-[11px] font-semibold mb-4">
                  <span
                    className={`px-2 py-0.5 rounded-lg ${
                      advCount === 1 ? "bg-pink-500/20 text-pink-300" : "bg-rose-500/15 text-rose-400"
                    }`}
                  >
                    متقدم: {advCount}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-lg ${
                      pracCount === 1 ? "bg-[#c3f937]/20 text-[#c3f937]" : "bg-rose-500/15 text-rose-400"
                    }`}
                  >
                    ممارس: {pracCount}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-lg ${
                      fndCount === 2 ? "bg-amber-500/20 text-amber-300" : "bg-rose-500/15 text-rose-400"
                    }`}
                  >
                    مبتدئ: {fndCount}/2
                  </span>
                </div>

                {/* Member slots */}
                <div className="space-y-2.5 min-h-[170px]">
                  {team.members.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs"
                    >
                      <div className="min-w-0 pr-1">
                        <span className="font-bold text-white block truncate text-sm">{m.full_name}</span>
                        <span className="text-[11px] text-slate-400">
                          {m.level === "advanced" ? "متقدم" : m.level === "practitioner" ? "ممارس" : "مبتدئ"} • {m.city}
                        </span>
                      </div>
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(team.id, m)}
                          className="text-slate-400 hover:text-rose-400 p-1 rounded"
                          title="إزالة من الفريق"
                          aria-label="إزالة من الفريق"
                        >
                          <X className="w-4 h-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Empty slots placeholders */}
                  {Array.from({ length: 4 - team.members.length }).map((_, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-2xl border border-dashed border-white/10 text-center text-xs text-slate-500"
                    >
                      مقعد شاغر ({team.members.length + idx + 1})
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick assign selector */}
              {canEdit && team.members.length < 4 && unassigned.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAssignCandidate(e.target.value, team.id);
                        e.target.value = "";
                      }
                    }}
                    defaultValue=""
                    className="w-full bg-[#0c1018] border border-white/15 rounded-xl p-2 text-xs text-slate-300 focus:outline-none focus:border-[#c3f937]"
                  >
                    <option value="" disabled>
                      + إضافة مرشح متاح...
                    </option>
                    {unassigned.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.full_name} ({c.level === "advanced" ? "متقدم" : c.level === "practitioner" ? "ممارس" : "مبتدئ"})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Unassigned Pool Drawer / Section */}
      <div className="p-6 bg-[rgba(24,29,40,0.78)] border border-white/10 rounded-3xl">
        <h4 className="font-bold text-white text-base mb-3">
          المرشحون المقبولون غير الموزعين على فرق ({unassigned.length}):
        </h4>
        {unassigned.length === 0 ? (
          <p className="text-xs sm:text-sm text-slate-400">جميع المتقدمين المقبولين موزعين على الفرق حالياً.</p>
        ) : (
          <div className="flex flex-wrap gap-2.5">
            {unassigned.map((c) => (
              <div
                key={c.id}
                className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs flex items-center gap-2"
              >
                <span className="font-bold text-white text-sm">{c.full_name}</span>
                <span className="text-xs text-[#c3f937]">
                  ({c.level === "advanced" ? "متقدم" : c.level === "practitioner" ? "ممارس" : "مبتدئ"})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
