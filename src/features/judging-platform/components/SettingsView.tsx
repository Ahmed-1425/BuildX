// =============================================================================
// BUILDx Judging Platform - Administration & Control Center
// =============================================================================

import React, { useState, useMemo } from 'react';
import { useJudging } from '../context/JudgingContext';
import { formatScore, formatDate } from '../utils/formatters';
import {
  Settings,
  Shield,
  Lock,
  Unlock,
  Eye,
  KeyRound,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileEdit,
  History,
  Users,
  Search,
  Check,
  Database,
  RefreshCw,
  Radio,
} from 'lucide-react';
import { SupabaseModal } from './SupabaseModal';

export const SettingsView: React.FC = () => {
  const {
    currentJudge,
    teams,
    evaluations,
    settings,
    auditLogs,
    openJudging,
    closeJudging,
    lockResults,
    unlockResults,
    publishResults,
    unpublishResults,
    unlockEvaluation,
    resetJudgePin,
    unlockJudgeAccount,
    updateSettings,
    supabaseStatus,
    isSupabaseLive,
    syncNow,
  } = useJudging();

  const [supabaseModalOpen, setSupabaseModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const judgesList = [
    { id: '11111111-1111-1111-1111-111111111111', name: 'أحمد الرشيد' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'إقبال الدلامي' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'عبدالعزيز بن نشوان' },
    { id: '44444444-4444-4444-4444-444444444444', name: 'أضواء الغامدي' },
  ];

  // Selected cell for unlocking evaluation
  const [unlockTarget, setUnlockTarget] = useState<{ judgeId: string; teamId: string; judgeName: string; teamName: string } | null>(null);
  const [unlockReason, setUnlockReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Filter audit logs
  const [auditFilter, setAuditFilter] = useState('');

  // 8 Teams x 4 Judges = 32 Evaluations Matrix
  const evalMap = useMemo(() => {
    const map = new Map<string, (typeof evaluations)[0]>();
    evaluations.forEach((e) => {
      map.set(`${e.judgeId}_${e.teamId}`, e);
    });
    return map;
  }, [evaluations]);

  const totalPossible = (teams.length || 8) * 4;
  const totalCompleted = evaluations.filter((e) => e.status === 'submitted').length;
  const totalDrafts = evaluations.filter((e) => e.status === 'draft').length;
  const completionPercent = Math.round((totalCompleted / totalPossible) * 100);

  // Handle unlock evaluation
  const handleConfirmUnlock = async () => {
    if (!unlockTarget || !unlockReason.trim()) {
      setActionError('سبب فك القفل إلزامي لأغراض التدقيق وسجلات الرقابة.');
      return;
    }

    const res = await unlockEvaluation(unlockTarget.judgeId, unlockTarget.teamId, unlockReason);
    if (res.success) {
      setActionSuccess(`تم فك قفل تقييم ${unlockTarget.judgeName} بنجاح.`);
      setUnlockTarget(null);
      setUnlockReason('');
    } else {
      setActionError(res.error || 'تعذر فك القفل.');
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += 'Team Code,Project Name,Track,Judge,Raw Total,Weighted Score,Status,Submitted At\n';

    evaluations.forEach((e) => {
      const team = teams.find((t) => t.id === e.teamId);
      const judge = judgesList.find((j) => j.id === e.judgeId) || { name: 'Admin' };
      const row = [
        team?.teamCode || '',
        `"${team?.projectName || ''}"`,
        `"${team?.challengeTrack || ''}"`,
        `"${judge.name}"`,
        e.totalWeightedScore,
        e.totalWeightedScore,
        e.status,
        e.submittedAt || '',
      ].join(',');
      csvContent += row + '\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `buildx_judging_scores_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered logs
  const filteredLogs = useMemo(() => {
    if (!auditFilter.trim()) return auditLogs;
    return auditLogs.filter(
      (l) =>
        l.action.includes(auditFilter) ||
        (l.reason && l.reason.includes(auditFilter)) ||
        l.entityType.includes(auditFilter)
    );
  }, [auditLogs, auditFilter]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#c3f937]/15 text-[#c3f937] border border-[#c3f937]/30 font-tech font-bold">
            SYSTEM CONTROL & AUDIT
          </span>
          <span className="text-xs text-[#e7edfd]/60 font-arabic">
            إدارة صلاحيات التحكيم والرقابة الفورية
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#e7edfd] font-arabic">
          مركز العمليات وسجلات التدقيق
        </h1>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess(null)} className="text-emerald-400 font-bold">
            إغلاق
          </button>
        </div>
      )}
      {actionError && (
        <div className="p-4 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-red-400 font-bold">
            إغلاق
          </button>
        </div>
      )}

      {/* 8 Teams x 4 Judges Matrix Section */}
      <div className="bg-[#121826]/90 border border-[#e7edfd]/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#e7edfd] font-arabic flex items-center gap-2">
              <Users className="w-5 h-5 text-[#c3f937]" />
              <span>مصفوفة متابعة التقييم (32 تقييمًا)</span>
            </h2>
            <p className="text-xs text-[#e7edfd]/60 font-arabic mt-0.5">
              متابعة حالة تقييم كل محكم للفرق الثمانية، مع إمكانية فك القفل لإعادة التعديل
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-left font-tech text-xs">
              <span className="text-[#c3f937] font-bold text-base">{totalCompleted}</span>
              <span className="text-[#e7edfd]/50"> / {totalPossible} COMPLETED ({completionPercent}%)</span>
            </div>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#182030] hover:bg-[#1f2a40] text-xs font-semibold text-[#e7edfd] border border-[#e7edfd]/15 transition-all cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#c3f937]" />
              <span>تصدير ملف CSV</span>
            </button>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-[#e7edfd]/10 bg-[#0c1018]/60 text-xs text-[#e7edfd]/60 font-arabic">
                <th className="py-3 px-4">الفريق (الكود)</th>
                {judgesList.map((j) => (
                  <th key={j.id} className="py-3 px-4 text-center font-arabic">
                    {j.name}
                  </th>
                ))}
                <th className="py-3 px-4 text-center font-tech">المعدل</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7edfd]/5 text-xs">
              {teams.map((team) => (
                <tr key={team.id} className="hover:bg-[#151c2d]/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#e7edfd]">
                    <div className="flex items-center gap-2">
                      <span className="font-tech text-xs px-1.5 py-0.5 rounded bg-[#182030] text-[#c3f937]">
                        {team.teamCode}
                      </span>
                      <span>{team.projectName}</span>
                    </div>
                  </td>

                  {judgesList.map((judge) => {
                    const ev = evalMap.get(`${judge.id}_${team.id}`);
                    const isSubmitted = ev?.status === 'submitted';
                    const isDraft = ev?.status === 'draft';

                    return (
                      <td key={judge.id} className="py-3 px-4 text-center">
                        {isSubmitted ? (
                          <div className="inline-flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-[#c3f937]/15 text-[#c3f937] border border-[#c3f937]/30 font-tech font-bold">
                              {formatScore(ev.totalWeightedScore)}
                            </span>
                            {currentJudge?.role === 'admin' && (
                              <button
                                onClick={() =>
                                  setUnlockTarget({
                                    judgeId: judge.id,
                                    teamId: team.id,
                                    judgeName: judge.name,
                                    teamName: team.projectName,
                                  })
                                }
                                title="فك القفل لإعادة التعديل"
                                className="p-1 rounded bg-[#182030] hover:bg-amber-950/40 text-[#e7edfd]/50 hover:text-amber-300 border border-[#e7edfd]/10 transition-colors cursor-pointer"
                              >
                                <Unlock className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        ) : isDraft ? (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-400/15 text-amber-300 border border-amber-400/30 font-arabic">
                            مسودة ({formatScore(ev.totalWeightedScore)})
                          </span>
                        ) : (
                          <span className="px-2 py-1 rounded-lg bg-[#0c1018] text-[#e7edfd]/40 border border-[#e7edfd]/10 font-arabic">
                            لم يبدأ
                          </span>
                        )}
                      </td>
                    );
                  })}

                  <td className="py-3 px-4 text-center font-tech font-bold text-[#c3f937]">
                    {/* Team average */}
                    {(() => {
                      const teamEvals = evaluations.filter(
                        (e) => e.teamId === team.id && e.status === 'submitted'
                      );
                      if (teamEvals.length === 0) return '--';
                      const avg =
                        teamEvals.reduce((a, b) => a + b.totalWeightedScore, 0) /
                        teamEvals.length;
                      return formatScore(avg);
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Unlock Confirmation Modal (Audit Reason is Mandatory!) */}
      {unlockTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c1018]/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#121826] border border-[#e7edfd]/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 text-right">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto">
              <Unlock className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-[#e7edfd] text-center font-arabic">
              فك قفل التقييم للمحكم
            </h3>

            <p className="text-xs text-[#e7edfd]/75 text-center font-arabic leading-relaxed">
              أنت على وشك السماح لـ <strong className="text-[#c3f937]">{unlockTarget.judgeName}</strong> بإعادة تعديل تقييمه لفريق <strong className="text-[#c3f937]">{unlockTarget.teamName}</strong>.
            </p>

            <div>
              <label className="block text-xs font-semibold text-[#e7edfd]/80 mb-1.5 font-arabic">
                سبب فك القفل (إلزامي للرقابة والتدقيق):
              </label>
              <textarea
                value={unlockReason}
                onChange={(e) => setUnlockReason(e.target.value)}
                placeholder="اكتب سبب طلب إعادة التعديل بالتفصيل..."
                rows={3}
                className="w-full bg-[#0c1018] border border-[#e7edfd]/15 rounded-xl px-4 py-2.5 text-xs text-[#e7edfd] placeholder-[#e7edfd]/30 focus:outline-none focus:border-[#c3f937] transition-all resize-none font-arabic"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setUnlockTarget(null)}
                className="flex-1 py-3 rounded-xl bg-[#182030] text-xs font-semibold text-[#e7edfd] border border-[#e7edfd]/15 cursor-pointer"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={handleConfirmUnlock}
                className="flex-1 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-xs font-bold text-[#0c1018] cursor-pointer"
              >
                تأكيد فك القفل
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Supabase Live Realtime Card */}
      <div className="bg-[#121826]/90 border border-[#e7edfd]/15 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              supabaseStatus === 'connected'
                ? 'bg-[#c3f937]/15 border-[#c3f937]/30 text-[#c3f937]'
                : supabaseStatus === 'reconnecting'
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-[#182030] border-[#e7edfd]/10 text-[#e7edfd]/60'
            }`}>
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-[#e7edfd] font-arabic">
                  الربط السحابي المباشر مع Supabase (Realtime Multi-Device)
                </h2>
                {supabaseStatus === 'connected' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-[#c3f937]/20 text-[#c3f937] px-2.5 py-0.5 rounded-full font-tech font-bold">
                    <Radio className="w-2.5 h-2.5 animate-ping" /> LIVE CONNECTED
                  </span>
                ) : supabaseStatus === 'reconnecting' ? (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full font-arabic font-bold">
                    جارٍ المزامنة...
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-zinc-700/40 text-zinc-300 px-2.5 py-0.5 rounded-full font-arabic">
                    نمط محلي آمن
                  </span>
                )}
              </div>
              <p className="text-xs text-[#e7edfd]/60 font-arabic mt-0.5">
                مزامنة حية بين 4 لابتوبات للتحكيم — تنعكس درجات كل محكم وتصويتاته في نفس الثانية على شاشات الجميع.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={async () => {
                setIsSyncing(true);
                await syncNow();
                setIsSyncing(false);
                setActionSuccess('تم سحب وتحديث أحدث البيانات من قاعدة البيانات بنجاح.');
              }}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#182030] hover:bg-[#1f2a40] text-xs font-semibold text-[#e7edfd] border border-[#e7edfd]/15 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#c3f937] ${isSyncing ? 'animate-spin' : ''}`} />
              <span>مزامنة فورية الآن</span>
            </button>
            <button
              onClick={() => setSupabaseModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#c3f937] hover:bg-[#b0e628] text-xs font-bold text-[#0c1018] font-arabic transition-all shadow-lg shadow-[#c3f937]/20 cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>إعداد وفحص الاتصال</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Judging Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Window state */}
        <div className="p-5 rounded-2xl bg-[#121826]/80 border border-[#e7edfd]/10 flex flex-col justify-between gap-4">
          <div>
            <span className="text-xs text-[#e7edfd]/50 font-arabic">فترة التحكيم</span>
            <h3 className="text-base font-bold text-[#e7edfd] font-arabic mt-1">
              {settings.isJudgingOpen ? 'مفتوحة حالياً' : 'مقفلة'}
            </h3>
            <p className="text-xs text-[#e7edfd]/60 font-arabic mt-1">
              {settings.isJudgingOpen
                ? 'يمكن للمحكمين حفظ المسودات واعتماد التقييمات'
                : 'التحكيم متوقف ومقفل على مستوى النظام'}
            </p>
          </div>
          {currentJudge?.role === 'admin' && (
            <button
              onClick={settings.isJudgingOpen ? closeJudging : openJudging}
              className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                settings.isJudgingOpen
                  ? 'bg-red-950/40 text-red-300 border-red-500/30 hover:bg-red-950/60'
                  : 'bg-[#c3f937]/15 text-[#c3f937] border-[#c3f937]/30 hover:bg-[#c3f937]/25'
              }`}
            >
              {settings.isJudgingOpen ? 'إقفال فترة التحكيم' : 'فتح فترة التحكيم'}
            </button>
          )}
        </div>

        {/* Results Locked */}
        <div className="p-5 rounded-2xl bg-[#121826]/80 border border-[#e7edfd]/10 flex flex-col justify-between gap-4">
          <div>
            <span className="text-xs text-[#e7edfd]/50 font-arabic">حالة النتائج</span>
            <h3 className="text-base font-bold text-[#e7edfd] font-arabic mt-1">
              {settings.areResultsLocked ? 'النتائج مقفلة نهائياً' : 'النتائج قابلة للتحديث'}
            </h3>
            <p className="text-xs text-[#e7edfd]/60 font-arabic mt-1">
              قفل النتائج يثبت الترتيب النهائي ويمنع أي تغييرات إضافية
            </p>
          </div>
          {currentJudge?.role === 'admin' && (
            <button
              onClick={settings.areResultsLocked ? unlockResults : lockResults}
              className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                settings.areResultsLocked
                  ? 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                  : 'bg-[#182030] text-[#e7edfd] border-[#e7edfd]/15'
              }`}
            >
              {settings.areResultsLocked ? 'فك قفل النتائج' : 'قفل النتائج نهائيًا'}
            </button>
          )}
        </div>

        {/* Results Published */}
        <div className="p-5 rounded-2xl bg-[#121826]/80 border border-[#e7edfd]/10 flex flex-col justify-between gap-4">
          <div>
            <span className="text-xs text-[#e7edfd]/50 font-arabic">نشر النتائج</span>
            <h3 className="text-base font-bold text-[#e7edfd] font-arabic mt-1">
              {settings.areResultsPublished ? 'النتائج معلنة' : 'النتائج سرية'}
            </h3>
            <p className="text-xs text-[#e7edfd]/60 font-arabic mt-1">
              النشر يتيح عرض الفائزين والترتيب للعامة في شاشات القاعة
            </p>
          </div>
          {currentJudge?.role === 'admin' && (
            <button
              onClick={settings.areResultsPublished ? unpublishResults : publishResults}
              className={`w-full py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                settings.areResultsPublished
                  ? 'bg-[#182030] text-[#e7edfd] border-[#e7edfd]/15'
                  : 'bg-[#c3f937] text-[#0c1018]'
              }`}
            >
              {settings.areResultsPublished ? 'إلغاء النشر' : 'نشر النتائج في الشاشات'}
            </button>
          )}
        </div>
      </div>

      {/* Judge PIN & Account Recovery (Admin Only) */}
      {currentJudge?.role === 'admin' && (
        <div className="bg-[#121826]/90 border border-[#e7edfd]/15 rounded-3xl p-6 sm:p-8 space-y-4">
          <h2 className="text-lg font-bold text-[#e7edfd] font-arabic flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-[#c3f937]" />
            <span>إدارة حسابات ورموز المحكمين (PIN)</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {judgesList.map((judge) => (
              <div
                key={judge.id}
                className="p-4 rounded-2xl bg-[#0c1018] border border-[#e7edfd]/10 space-y-3"
              >
                <div>
                  <h4 className="text-sm font-bold text-[#e7edfd] font-arabic">{judge.name}</h4>
                  <span className="text-[10px] text-[#c3f937] font-tech block">JUDGE ACTIVE</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={async () => {
                      const res = await unlockJudgeAccount(judge.id);
                      if (res.success) setActionSuccess(`تم فك حظر حساب ${judge.name}`);
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-[#182030] hover:bg-[#1f2a40] text-[11px] font-arabic text-[#e7edfd] border border-[#e7edfd]/10 cursor-pointer"
                  >
                    فك حظر المحاولات
                  </button>
                  <button
                    onClick={async () => {
                      const newPin = prompt(`أدخل الرمز السري الجديد المكون من 4 أرقام للمحكم ${judge.name}:`);
                      if (newPin && newPin.length === 4) {
                        const res = await resetJudgePin(judge.id, newPin);
                        if (res.success) setActionSuccess(`تم تعيين رمز PIN جديد للمحكم ${judge.name}`);
                      }
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-[#34155f]/40 hover:bg-[#34155f] text-[11px] font-arabic text-[#a855f7] border border-[#a855f7]/30 cursor-pointer"
                  >
                    إعادة تعيين PIN
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Audit Log Section */}
      <div className="bg-[#121826]/90 border border-[#e7edfd]/15 rounded-3xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#e7edfd] font-arabic flex items-center gap-2">
              <History className="w-5 h-5 text-[#c3f937]" />
              <span>سجل التدقيق والرقابة الفورية (Audit Logs)</span>
            </h2>
            <p className="text-xs text-[#e7edfd]/60 font-arabic mt-0.5">
              توثيق دقيق ومؤرخ لجميع العمليات الحساسة وتغييرات الدرجات وفك الأقفال
            </p>
          </div>

          {/* Search/Filter */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              value={auditFilter}
              onChange={(e) => setAuditFilter(e.target.value)}
              placeholder="البحث في السجلات..."
              className="w-full bg-[#0c1018] border border-[#e7edfd]/15 rounded-xl pr-9 pl-4 py-1.5 text-xs text-[#e7edfd] placeholder-[#e7edfd]/30 focus:outline-none focus:border-[#c3f937] font-arabic"
            />
            <Search className="w-3.5 h-3.5 text-[#e7edfd]/40 absolute right-3 top-2.5" />
          </div>
        </div>

        {/* Logs Table */}
        <div className="overflow-x-auto max-h-96">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-[#e7edfd]/10 bg-[#0c1018]/60 text-[11px] text-[#e7edfd]/60 font-arabic sticky top-0">
                <th className="py-2.5 px-3">الوقت</th>
                <th className="py-2.5 px-3">المستخدم</th>
                <th className="py-2.5 px-3">العملية</th>
                <th className="py-2.5 px-3">الكيان</th>
                <th className="py-2.5 px-3">السبب / الملاحظة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e7edfd]/5 text-xs">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#151c2d]/40">
                  <td className="py-2.5 px-3 font-tech text-[11px] text-[#e7edfd]/60 whitespace-nowrap">
                    {formatDate(log.createdAt)}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-[#e7edfd] whitespace-nowrap">
                    {log.judgeName || 'النظام'}
                  </td>
                  <td className="py-2.5 px-3 font-tech text-[#c3f937] whitespace-nowrap">
                    {log.action}
                  </td>
                  <td className="py-2.5 px-3 text-[#e7edfd]/80 font-arabic whitespace-nowrap">
                    {log.entityType}
                  </td>
                  <td className="py-2.5 px-3 text-xs text-[#e7edfd]/70 font-arabic">
                    {log.reason || '--'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <SupabaseModal
        isOpen={supabaseModalOpen}
        onClose={() => setSupabaseModalOpen(false)}
      />
    </div>
  );
};
