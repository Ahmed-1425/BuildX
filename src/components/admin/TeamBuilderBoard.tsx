"use client";
import React, { useState, useMemo } from "react";
import type { TeamItem, TeamMemberItem } from "@/types/admin";
import { getGenderLabel } from "@/types/admin";
import { generateSuggestedTeams, type CandidateForTeam } from "@/lib/admin/teamSuggestions";
import {
  Wand2,
  Save,
  Users,
  AlertTriangle,
  CheckCircle2,
  X,
  Plus,
  ShieldCheck,
  UserCheck,
  Clock,
  Layers,
  MapPin,
} from "lucide-react";

interface Props {
  initialTeams: TeamItem[];
  unassignedCandidates: CandidateForTeam[];
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

  // Compute duplicates across teams
  const duplicateAppIds = useMemo(() => {
    const seen = new Set<string>();
    const dupes = new Set<string>();
    for (const team of teams) {
      for (const m of team.members) {
        if (seen.has(m.application_id)) {
          dupes.add(m.application_id);
        }
        seen.add(m.application_id);
      }
    }
    return dupes;
  }, [teams]);

  // Auto-suggest distribution
  function handleAutoSuggest() {
    if (!confirm("هل ترغب في توليد توزيع مقترح تلقائي للفرق بناءً على المستويات وتفضيلات بيئة الفريق؟")) {
      return;
    }

    const allPool: CandidateForTeam[] = [...unassigned];
    teams.forEach((t) => {
      t.members.forEach((m) => {
        allPool.push({
          id: m.application_id,
          full_name: m.full_name,
          level: m.level,
          gender: m.gender,
          city: m.city,
          specialization: m.specialization,
          team_env: m.team_env,
          application_status: m.application_status,
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
        specialization: member.specialization,
        team_env: member.team_env,
        application_status: member.application_status,
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
      specialization: candidate.specialization,
      team_env: candidate.team_env,
      application_status: candidate.application_status,
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
    if (duplicateAppIds.size > 0) {
      alert("يوجد أعضاء مكررون في أكثر من فريق! يرجى إزالة التكرار أولاً.");
      return;
    }

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
      <div className="bento-card p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#c3f937]" aria-hidden="true" />
            <span>لوحة توزيع الفرق (<span className="numeric-value">8</span> فرق • <span className="numeric-value">32</span> مقعد)</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            التركيبة المستهدفة لكل فريق: (<span className="numeric-value">1</span> متقدم + <span className="numeric-value">1</span> ممارس + <span className="numeric-value">2</span> مبتدئين).
          </p>
        </div>

        {canEdit && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleAutoSuggest}
              className="inline-flex items-center gap-2 px-4 h-11 text-xs sm:text-sm font-bold rounded-xl border border-white/15 text-slate-200 hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            >
              <Wand2 className="w-4 h-4 text-[#c3f937]" aria-hidden="true" />
              <span>توليد توزيع مقترح تلقائي</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 h-11 text-xs sm:text-sm font-bold rounded-xl bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] shadow-md shadow-[#c3f937]/20 transition-all disabled:opacity-50 cursor-pointer"
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
            <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" aria-hidden="true" />
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
          const isFull = team.members.length === 4;
          const isBalanced = advCount === 1 && pracCount === 1 && fndCount === 2;

          // Compute specific team warnings
          const warnings: string[] = [];
          if (advCount === 0) warnings.push("الفريق لا يحتوي عضوًا متقدمًا");
          if (advCount > 1) warnings.push("يوجد أكثر من عضو متقدم في الفريق");
          if (pracCount === 0) warnings.push("الفريق لا يحتوي عضوًا ممارسًا");
          if (pracCount > 1) warnings.push("يوجد أكثر من عضو ممارس في الفريق");
          if (fndCount !== 2) warnings.push(`عدد المبتدئين (${fndCount}) غير صحيح (المطلوب 2)`);

          const hasDuplicatesInTeam = team.members.some((m) => duplicateAppIds.has(m.application_id));
          if (hasDuplicatesInTeam) warnings.push("عضو مكرر في فريقين");

          const unconfirmedMember = team.members.find((m) => m.application_status !== "confirmed");
          if (unconfirmedMember) warnings.push(`العضو (${unconfirmedMember.full_name}) لم يؤكد الحضور`);

          return (
            <div
              key={team.id}
              className={`bento-card p-5 flex flex-col justify-between transition-all ${
                isBalanced
                  ? "border-[#c3f937]/35 shadow-[0_0_20px_rgba(195,249,55,0.06)]"
                  : warnings.length > 0 && isFull
                  ? "border-amber-500/35"
                  : "border-white/10"
              }`}
            >
              <div>
                {/* Team Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white text-base">{team.name}</h3>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-lg font-mono font-bold numeric-value ${
                      isFull
                        ? "bg-[#c3f937]/15 text-[#c3f937] border border-[#c3f937]/30"
                        : "bg-white/5 text-slate-400"
                    }`}
                  >
                    {team.members.length} / 4
                  </span>
                </div>

                {/* Completeness / Balance Indicator */}
                <div className="flex items-center justify-between text-[11px] mb-3 pb-2 border-b border-white/5">
                  <span className="text-slate-400">اكتمال التركيبة:</span>
                  {isBalanced ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>متوازن ومكتمل</span>
                    </span>
                  ) : (
                    <span className="text-amber-400 font-semibold">
                      {isFull ? "غير متوازن" : "قيد التكوين"}
                    </span>
                  )}
                </div>

                {/* Warnings List */}
                {warnings.length > 0 && (
                  <div className="mb-3 space-y-1 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                    {warnings.map((w, wi) => (
                      <div key={wi} className="flex items-center gap-1.5">
                        <AlertTriangle className="w-3 h-3 shrink-0 text-amber-400" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 4 Member Slots */}
                <div className="space-y-2 min-h-[180px]">
                  {team.members.map((m) => {
                    const isDup = duplicateAppIds.has(m.application_id);
                    const isConfirmed = m.application_status === "confirmed";

                    return (
                      <div
                        key={m.id}
                        className={`p-2.5 rounded-xl border text-xs space-y-1 transition-all ${
                          isDup
                            ? "bg-rose-500/10 border-rose-500/30"
                            : "bg-white/[0.03] border-white/5"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white truncate">{m.full_name}</span>
                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => handleRemoveMember(team.id, m)}
                              className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition-colors"
                              title="إزالة من الفريق"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                          <span
                            className={`font-semibold ${
                              m.level === "advanced"
                                ? "text-pink-400"
                                : m.level === "practitioner"
                                ? "text-[#c3f937]"
                                : "text-cyan-400"
                            }`}
                          >
                            {m.level === "advanced"
                              ? "متقدم"
                              : m.level === "practitioner"
                              ? "ممارس"
                              : "مبتدئ"}
                          </span>

                          <span className="text-slate-600">•</span>

                          <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300 font-medium text-[10px]">
                            {getGenderLabel(m.gender)}
                          </span>

                          <span className="text-slate-600">•</span>

                          <span className="text-slate-400 truncate max-w-[90px]" title={m.specialization || m.city}>
                            {m.specialization || m.city}
                          </span>

                          <span
                            className={`ms-auto px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                              isConfirmed
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-amber-500/15 text-amber-400"
                            }`}
                          >
                            {isConfirmed ? "مؤكد الحضور" : "لم يؤكد بعد"}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Empty Slots */}
                  {Array.from({ length: 4 - team.members.length }).map((_, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-dashed border-white/10 text-center text-xs text-slate-500"
                    >
                      مقعد شاغر ({team.members.length + idx + 1})
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick assign selector */}
              {canEdit && team.members.length < 4 && unassigned.length > 0 && (
                <div className="mt-4 pt-3 border-t border-white/5">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAssignCandidate(e.target.value, team.id);
                        e.target.value = "";
                      }
                    }}
                    defaultValue=""
                    className="w-full h-9 bg-black/40 border border-white/10 rounded-xl px-2.5 text-xs text-slate-300 focus:outline-none focus:border-[#c3f937]"
                  >
                    <option value="" disabled>
                      + إضافة عضو للفريق...
                    </option>
                    {unassigned.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.full_name} (
                        {c.level === "advanced"
                          ? "متقدم"
                          : c.level === "practitioner"
                          ? "ممارس"
                          : "مبتدئ"}
                        )
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Unassigned Pool Drawer / Card */}
      <div className="bento-card p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
            <h3 className="text-base font-bold text-white">
              المقبولون غير المسندين لفرق (<span className="numeric-value">{unassigned.length}</span> مرشح)
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            اختر فريقًا لإسناد المرشح مباشرة
          </span>
        </div>

        {unassigned.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400 bg-white/[0.02] rounded-2xl border border-white/5">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
            <span>تم توزيع جميع المقبولين بنجاح على الفرق! لا يوجد مرشحون غير مسندين.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {unassigned.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white truncate">{c.full_name}</span>
                  <span
                    className={`font-semibold text-[11px] ${
                      c.level === "advanced"
                        ? "text-pink-400"
                        : c.level === "practitioner"
                        ? "text-[#c3f937]"
                        : "text-cyan-400"
                    }`}
                  >
                    {c.level === "advanced"
                      ? "متقدم"
                      : c.level === "practitioner"
                      ? "ممارس"
                      : "مبتدئ"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300 text-[10px]">
                    {getGenderLabel(c.gender)}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="truncate">{c.city}</span>
                  <span className="text-slate-600">•</span>
                  <span className="truncate">{c.specialization || "تقنية"}</span>
                </div>

                {canEdit && (
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAssignCandidate(c.id, e.target.value);
                      }
                    }}
                    defaultValue=""
                    className="w-full h-8 bg-black/40 border border-white/10 rounded-lg px-2 text-[11px] text-slate-300 focus:outline-none focus:border-[#c3f937]"
                  >
                    <option value="" disabled>
                      إسناد إلى فريق...
                    </option>
                    {teams
                      .filter((t) => t.members.length < 4)
                      .map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} ({t.members.length}/4)
                        </option>
                      ))}
                  </select>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
