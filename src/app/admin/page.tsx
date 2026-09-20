"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { DashboardStats, ApplicationListItem } from "@/types/admin";
import AdminStatusBadge from "@/components/admin/StatusBadge";
import AdminKpiCard from "@/components/admin/ui/AdminKpiCard";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import AdminErrorState from "@/components/admin/AdminErrorState";
import {
  FileText,
  Search,
  Star,
  CheckCircle2,
  Clock3,
  CircleX,
  MapPin,
  TrendingUp,
  Layers,
  RefreshCw,
  Activity,
  UserCheck,
  ChevronLeft,
  Users,
  AlertTriangle,
  Award,
  Video,
  ExternalLink,
  User,
  UserRound,
  HelpCircle,
} from "lucide-react";
import {
  formatNumber,
  formatPercent,
  formatTimeArabic,
  toLatinDigits,
} from "@/lib/admin/formatters";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setLastUpdated(formatTimeArabic(new Date()));
      } else {
        setError(data.error || "تعذر جلب إحصائيات لوحة التحكم.");
      }
    } catch {
      setError("تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading && !stats) {
    return <AdminSkeleton variant="dashboard" />;
  }

  if (error || !stats) {
    return (
      <div className="admin-page" dir="rtl">
        <AdminErrorState
          title="تعذر تحميل لوحة القيادة"
          message={error || "تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى."}
          onRetry={fetchStats}
          isRetrying={loading}
        />
      </div>
    );
  }

  // 532 historical registrations documented outside the current system.
  // Display-only offset — does NOT alter the database or any other metric.
  const HREGISTRATIONS = 532;

  const total = stats.total || 0;
  const displayTotal = HREGISTRATIONS + total;
  const todayCount = stats.today || 0;

  // Level statistics
  const fnd = stats.by_level?.foundation || 0;
  const prac = stats.by_level?.practitioner || 0;
  const adv = stats.by_level?.advanced || 0;
  const fndPct = total > 0 ? Math.round((fnd / total) * 100) : 0;
  const pracPct = total > 0 ? Math.round((prac / total) * 100) : 0;
  const advPct = total > 0 ? Math.round((adv / total) * 100) : 0;

  // Gender statistics
  const maleCount = stats.by_gender?.male || 0;
  const femaleCount = stats.by_gender?.female || 0;
  const unspecifiedCount = stats.by_gender?.unspecified || 0;
  const malePct = total > 0 ? Math.round((maleCount / total) * 100) : 0;
  const femalePct = total > 0 ? Math.round((femaleCount / total) * 100) : 0;
  const unspecifiedPct = total > 0 ? Math.round((unspecifiedCount / total) * 100) : 0;

  // Pipeline funnel data
  const pipelineStages = [
    {
      id: "submitted",
      name: "طلب جديد",
      count: stats.by_status?.submitted || 0,
      color: "#38bdf8",
      href: "/admin/applications?status=submitted",
      icon: FileText,
    },
    {
      id: "under_review",
      name: "قيد المراجعة",
      count: stats.by_status?.under_review || 0,
      color: "#c084fc",
      href: "/admin/applications?status=under_review",
      icon: Search,
    },
    {
      id: "preliminary_candidate",
      name: "مرشح مبدئيًا",
      count: stats.by_status?.preliminary_candidate || 0,
      color: "#facc15",
      href: "/admin/preliminary",
      icon: Star,
    },
    {
      id: "accepted",
      name: "مقبول",
      count: stats.by_status?.accepted || 0,
      color: "#4ade80",
      href: "/admin/accepted",
      icon: CheckCircle2,
    },
    {
      id: "confirmed",
      name: "مؤكد الحضور",
      count: stats.by_status?.confirmed || 0,
      color: "#fb50c3",
      href: "/admin/applications?status=confirmed",
      icon: UserCheck,
    },
  ];

  // Action alerts count
  const unreviewedCount = stats.unreviewed_count || 0;
  const advancedNeedVideoReview = stats.recent_applications?.filter(
    (a) => a.level === "advanced" && a.has_video && a.application_status === "submitted"
  ).length || 0;

  return (
    <div className="admin-page space-y-7" dir="rtl">
      {/* ── 1. PAGE HEADER ───────────────────────────────────────── */}
      <header className="page-header pb-5 border-b border-white/[0.08]">
        <div className="page-header-copy">
          <h1 className="admin-title font-bold text-white tracking-tight">
            لوحة قيادة BUILDx
          </h1>

          <p className="body-text text-slate-300 leading-relaxed max-w-3xl">
            متابعة طلبات التسجيل، تقدم المراجعة، وقرارات القبول من مساحة واحدة.
          </p>

          {lastUpdated && (
            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Clock3 className="w-3.5 h-3.5 text-[#c3f937]" aria-hidden="true" />
              <span>
                آخر تحديث:{" "}
                <span className="numeric-value font-mono text-slate-300 font-medium">
                  {lastUpdated}
                </span>
              </span>
            </div>
          )}
        </div>

        <div className="page-header-actions">
          <button
            type="button"
            onClick={fetchStats}
            disabled={loading}
            className="btn-admin-md bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 hover:text-white transition-all cursor-pointer disabled:opacity-50"
            aria-label="تحديث البيانات"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#c3f937] ${loading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            <span>تحديث البيانات</span>
          </button>

          <Link
            href="/admin/applications"
            className="btn-admin-md bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] font-bold shadow-md shadow-[#c3f937]/20 transition-all"
          >
            <span>عرض جميع الطلبات</span>
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </header>

      {/* ── 2. KPI CARDS (3→2→1 columns) ─────────────────────────── */}
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">مؤشرات الأداء الرئيسية</h2>
        <div className="metrics-grid">
          <AdminKpiCard
            title="إجمالي الطلبات"
            value={displayTotal}
            description="العدد الكلي للطلبات المكتملة المسجلة عبر البوابة"
            icon={FileText}
            accentColor="lime"
            href="/admin/applications"
          />

          <AdminKpiCard
            title="طلبات اليوم"
            value={todayCount}
            description="الطلبات الجديدة المستلمة خلال آخر 24 ساعة"
            icon={Clock3}
            accentColor="pink"
          />

          <AdminKpiCard
            title="قيد المراجعة"
            value={stats.by_status?.under_review || 0}
            description="طلبات يقوم المحكمون بتقييمها حاليًا"
            icon={Search}
            accentColor="purple"
            href="/admin/applications?status=under_review"
          />

          <AdminKpiCard
            title="المرشحون مبدئيًا"
            value={stats.by_status?.preliminary_candidate || 0}
            description="اجتازوا الفرز الأولي وجاهزون للقبول النهائي"
            icon={Star}
            accentColor="gold"
            href="/admin/preliminary"
          />

          <AdminKpiCard
            title="المقبولون نهائيًا"
            value={stats.by_status?.accepted || 0}
            description="تم اعتماد قبولهم في المقاعد الرسمية"
            icon={CheckCircle2}
            accentColor="lime"
            href="/admin/accepted"
          />

          <AdminKpiCard
            title="مؤكدو الحضور"
            value={stats.by_status?.confirmed || 0}
            description="أكدوا التزامهم بحضور أيام المعسكر"
            icon={UserCheck}
            accentColor="cyan"
            href="/admin/applications?status=confirmed"
          />
        </div>
      </section>

      {/* ── 3. BENTO GRID ────────────────────────────────────────── */}
      <div className="dashboard-bento-grid">
        {/* Selection Pipeline (8 cols) */}
        <div className="dashboard-panel bento-card col-span-12 lg:col-span-8 flex flex-col justify-between">
            <div>
              <div className="panel-header" style={{ marginBottom: "16px" }}>
                <div>
                  <h2 className="text-[22px] font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
                    <span>مسار الاختيار والقبول</span>
                  </h2>
                  <p className="muted-text text-slate-400 mt-1">
                    تسلسل انتقال المتقدمين من الاستلام إلى تأكيد الحضور
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/[0.08] numeric-value">
                  5 مراحل
                </span>
              </div>

              {/* 5 Funnel Stages */}
              <div className="relative mb-4">
                <div className="flex sm:grid sm:grid-cols-5 gap-[12px] overflow-x-auto pb-3 sm:pb-0 scrollbar-none snap-x">
                  {pipelineStages.map((stage) => {
                    const pct = total > 0 ? Math.round((stage.count / total) * 100) : 0;
                    const Icon = stage.icon;

                    return (
                      <Link
                        key={stage.id}
                        href={stage.href}
                        className="min-w-[140px] sm:min-w-0 min-h-[124px] p-3.5 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] text-center flex flex-col justify-between items-center transition-all hover:-translate-y-0.5 group focus:outline-none snap-start"
                      >
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                          style={{ background: `${stage.color}15`, color: stage.color }}
                        >
                          <Icon className="w-4 h-4" aria-hidden="true" />
                        </div>

                        <div className="space-y-1 my-auto">
                          <span className="text-xs font-bold text-slate-200 block">
                            {stage.name}
                          </span>
                          <span
                            className="text-2xl sm:text-[28px] font-black font-mono block leading-none numeric-value"
                            style={{ color: stage.color }}
                          >
                            {formatNumber(stage.count)}
                          </span>
                        </div>

                        <span className="text-xs text-slate-400 font-mono block bg-white/[0.04] px-2.5 py-0.5 rounded-md numeric-value">
                          {pct}%
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <div className="sm:hidden text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5 pt-1">
                  <span>اسحب أفقيًا لاستعراض بقية المراحل</span>
                </div>
              </div>
            </div>

            {/* Sub-links */}
            <div className="pt-3.5 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">مسارات المراجعة الإضافية:</span>
              <div className="flex items-center gap-4">
                <Link
                  href="/admin/waitlist"
                  className="inline-flex items-center gap-1.5 text-orange-400 hover:text-orange-300 font-semibold transition-colors"
                >
                  <Clock3 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    قائمة الانتظار (<span className="numeric-value">{formatNumber(stats.by_status?.waitlisted || 0)}</span>)
                  </span>
                </Link>
                <span className="text-slate-600">|</span>
                <Link
                  href="/admin/rejected"
                  className="inline-flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-semibold transition-colors"
                >
                  <CircleX className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    غير المقبولين (<span className="numeric-value">{formatNumber(stats.by_status?.rejected || 0)}</span>)
                  </span>
                </Link>
              </div>
            </div>
          </div>

        {/* Level Distribution (4 cols) */}
        <div className="dashboard-panel bento-card col-span-12 lg:col-span-4 flex flex-col justify-between">
            <div>
              <div className="panel-header" style={{ marginBottom: "16px" }}>
                <div>
                  <h2 className="text-[22px] font-bold text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
                    <span>توزيع المستويات</span>
                  </h2>
                  <p className="muted-text text-slate-400 mt-1">
                    نسبة المتقدمين حسب المستوى المسجل
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {/* Foundation */}
                <div className="distribution-item border-b border-white/[0.05] pb-3">
                  <div className="distribution-header">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                      <span className="font-bold text-slate-100 text-sm">مبتدئ (Foundation)</span>
                    </div>
                    <span className="font-mono font-bold text-cyan-300 numeric-value text-sm">
                      {formatNumber(fnd)} ({fndPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden mt-2.5">
                    <div
                      className="h-full rounded-full bg-cyan-400 transition-all duration-700"
                      style={{ width: `${fndPct}%` }}
                    />
                  </div>
                </div>

                {/* Practitioner */}
                <div className="distribution-item border-b border-white/[0.05] pb-3">
                  <div className="distribution-header">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#c3f937]" />
                      <span className="font-bold text-slate-100 text-sm">ممارس (Practitioner)</span>
                    </div>
                    <span className="font-mono font-bold text-[#c3f937] numeric-value text-sm">
                      {formatNumber(prac)} ({pracPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden mt-2.5">
                    <div
                      className="h-full rounded-full bg-[#c3f937] transition-all duration-700"
                      style={{ width: `${pracPct}%` }}
                    />
                  </div>
                </div>

                {/* Advanced */}
                <div className="distribution-item pb-1">
                  <div className="distribution-header">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#fb50c3]" />
                      <span className="font-bold text-slate-100 text-sm">متقدم (Advanced)</span>
                    </div>
                    <span className="font-mono font-bold text-pink-300 numeric-value text-sm">
                      {formatNumber(adv)} ({advPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden mt-2.5">
                    <div
                      className="h-full rounded-full bg-[#fb50c3] transition-all duration-700"
                      style={{ width: `${advPct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-300">
              <span>تفضيل بيئة الفريق:</span>
              <div className="flex items-center gap-2 font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                  مشتركة (<span className="numeric-value">{formatNumber(stats.by_team_env?.comfortable || 0)}</span>)
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08]">
                  نفس الجنس (<span className="numeric-value">{formatNumber(stats.by_team_env?.same_gender_only || 0)}</span>)
                </span>
              </div>
            </div>
          </div>

        {/* Reviewer Progress (6 cols) */}
        <div className="dashboard-panel bento-card col-span-12 lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="panel-header" style={{ marginBottom: "16px" }}>
                <div>
                  <h2 className="text-[22px] font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
                    <span>تقدم المراجعة</span>
                  </h2>
                  <p className="muted-text text-slate-400 mt-1">
                    متابعة استكمال تقييم الطلبات
                  </p>
                </div>
                {stats.avg_score_overall !== null && (
                  <span className="text-xs font-mono font-bold text-[#c3f937] bg-[#c3f937]/10 px-3 py-1.5 rounded-xl border border-[#c3f937]/30 numeric-value">
                    المتوسط: {stats.avg_score_overall} / 5
                  </span>
                )}
              </div>

              {/* Progress stats */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-right space-y-1">
                  <span className="text-xs text-slate-400 block">تم تقييمها</span>
                  <span className="text-2xl font-black font-mono text-emerald-400 block numeric-value">
                    {formatNumber(total - unreviewedCount)}
                  </span>
                  <span className="text-xs text-slate-400 block numeric-value">
                    {total > 0 ? Math.round(((total - unreviewedCount) / total) * 100) : 0}% مكتملة
                  </span>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-right space-y-1">
                  <span className="text-xs text-slate-400 block">بانتظار التقييم</span>
                  <span className="text-2xl font-black font-mono text-yellow-400 block numeric-value">
                    {formatNumber(unreviewedCount)}
                  </span>
                  <span className="text-xs text-slate-400 block">تحتاج مراجعة</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-700"
                  style={{ width: `${total > 0 ? Math.round(((total - unreviewedCount) / total) * 100) : 0}%` }}
                />
              </div>
            </div>

            <div className="pt-3.5 border-t border-white/[0.08] flex items-center justify-between">
              <Link
                href="/admin/applications?status=submitted"
                className="text-xs font-semibold text-[#c3f937] hover:underline flex items-center gap-1"
              >
                <span>بدء مراجعة الطلبات غير المكتملة</span>
                <ChevronLeft className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Action Alerts (6 cols) */}
          <div className="dashboard-panel bento-card col-span-12 lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="panel-header" style={{ marginBottom: "16px" }}>
                <div>
                  <h2 className="text-[22px] font-bold text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" aria-hidden="true" />
                    <span>تحتاج إجراء</span>
                  </h2>
                  <p className="muted-text text-slate-400 mt-1">مهام تتطلب متابعة فورية</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {unreviewedCount > 0 && (
                  <Link
                    href="/admin/applications?status=submitted"
                    className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between hover:bg-amber-500/15 transition-all text-right"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          <span className="numeric-value">{formatNumber(unreviewedCount)}</span> طلب جديد بانتظار التقييم
                        </span>
                        <span className="text-[11px] text-amber-300/80 block mt-0.5">
                          يرجى توزيعها على المحكمين أو بدء المراجعة
                        </span>
                      </div>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-amber-400" />
                  </Link>
                )}

                {advancedNeedVideoReview > 0 && (
                  <Link
                    href="/admin/applications?level=advanced"
                    className="p-3.5 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-between hover:bg-pink-500/15 transition-all text-right"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">
                          <span className="numeric-value">{formatNumber(advancedNeedVideoReview)}</span> متقدم يتطلب فحص الفيديو
                        </span>
                        <span className="text-[11px] text-pink-300/80 block mt-0.5">
                          تأكد من صلاحية رابط الفيديو والمشروع
                        </span>
                      </div>
                    </div>
                    <ChevronLeft className="w-4 h-4 text-pink-400" />
                  </Link>
                )}

                {unreviewedCount === 0 && advancedNeedVideoReview === 0 && (
                  <div className="p-6 text-center text-xs text-slate-400 bg-white/[0.02] rounded-2xl border border-white/[0.06]">
                    <CheckCircle2 className="w-7 h-7 text-emerald-400 mx-auto mb-2" />
                    <span>لا توجد تنبيهات عاجلة حاليًا. جميع الطلبات محدثة.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3.5 border-t border-white/[0.08] text-xs text-slate-400 flex items-center justify-between">
              <span>تحديث المعسكر:</span>
              <Link
                href="/admin/team-builder"
                className="text-[#c3f937] hover:underline font-semibold"
              >
                الذهاب إلى لوحة توزيع الفرق
              </Link>
            </div>
          </div>

        {/* Gender Distribution (6 cols) */}
        <div className="dashboard-panel bento-card col-span-12 lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="panel-header" style={{ marginBottom: "16px" }}>
                <div>
                  <h2 className="text-[22px] font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
                    <span>توزيع الجنس</span>
                  </h2>
                  <p className="muted-text text-slate-400 mt-1">
                    نسب المتقدمين حسب الجنس
                  </p>
                </div>
                {total > 0 && (
                  <span className="text-xs font-semibold text-slate-400 bg-white/[0.04] px-3 py-1.5 rounded-xl border border-white/[0.08] numeric-value">
                    إجمالي {formatNumber(total)}
                  </span>
                )}
              </div>

              {total === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 bg-white/[0.02] rounded-2xl border border-white/[0.06] mb-4">
                  سيظهر توزيع المشاركين بعد استقبال طلبات التسجيل.
                </div>
              ) : (
                <div className="mb-4 space-y-3">
                  {/* Distribution bar */}
                  <div className="w-full h-3 rounded-full bg-white/[0.08] overflow-hidden flex gap-0.5 p-0.5">
                    {maleCount > 0 && (
                      <div
                        className="h-full rounded-full bg-sky-400 transition-all duration-700"
                        style={{ width: `${malePct}%` }}
                        title={`ذكر: ${malePct}%`}
                      />
                    )}
                    {femaleCount > 0 && (
                      <div
                        className="h-full rounded-full bg-purple-400 transition-all duration-700"
                        style={{ width: `${femalePct}%` }}
                        title={`أنثى: ${femalePct}%`}
                      />
                    )}
                    {unspecifiedCount > 0 && (
                      <div
                        className="h-full rounded-full bg-slate-500 transition-all duration-700"
                        style={{ width: `${unspecifiedPct}%` }}
                        title={`غير محدد: ${unspecifiedPct}%`}
                      />
                    )}
                  </div>

                  {/* Rows */}
                  <div className="space-y-2.5">
                    <div className="distribution-item border-b border-white/[0.05] pb-2.5">
                      <div className="distribution-header">
                        <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-100">
                          <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                          <User className="w-4 h-4 text-sky-400" />
                          <span>ذكر</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-mono">
                          <span className="font-bold text-white text-sm numeric-value">{formatNumber(maleCount)}</span>
                          <span className="text-sky-300 font-bold bg-sky-500/10 px-2.5 py-0.5 rounded-lg border border-sky-500/20 numeric-value">{malePct}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="distribution-item border-b border-white/[0.05] pb-2.5">
                      <div className="distribution-header">
                        <div className="flex items-center gap-2.5 text-sm font-semibold text-slate-100">
                          <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                          <UserRound className="w-4 h-4 text-purple-400" />
                          <span>أنثى</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-mono">
                          <span className="font-bold text-white text-sm numeric-value">{formatNumber(femaleCount)}</span>
                          <span className="text-purple-300 font-bold bg-purple-500/10 px-2.5 py-0.5 rounded-lg border border-purple-500/20 numeric-value">{femalePct}%</span>
                        </div>
                      </div>
                    </div>

                    {unspecifiedCount > 0 && (
                      <div className="distribution-item pb-1">
                        <div className="distribution-header">
                          <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-400">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                            <HelpCircle className="w-4 h-4 text-slate-400" />
                            <span>غير محدد (طلبات قديمة)</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-mono">
                            <span className="font-bold text-slate-300 text-sm numeric-value">{formatNumber(unspecifiedCount)}</span>
                            <span className="text-slate-400 font-bold bg-slate-500/10 px-2.5 py-0.5 rounded-lg border border-slate-500/20 numeric-value">{unspecifiedPct}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3.5 border-t border-white/[0.08] text-xs text-slate-400 flex items-center justify-between">
              <span>إجمالي المسجلين:</span>
              <span className="text-slate-300 font-mono numeric-value">
                {total > 0 ? `${formatNumber(total)} طلب` : "بانتظار التسجيل"}
              </span>
            </div>
          </div>

          {/* Top Cities (6 cols) */}
          <div className="dashboard-panel bento-card col-span-12 lg:col-span-6 flex flex-col justify-between">
            <div>
              <div className="panel-header" style={{ marginBottom: "16px" }}>
                <div>
                  <h2 className="text-[22px] font-bold text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
                    <span>توزيع المدن</span>
                  </h2>
                  <p className="muted-text text-slate-400 mt-1">التوزيع الجغرافي لأعلى المدن تسجيلًا</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                {stats.top_cities && stats.top_cities.length > 0 ? (
                  stats.top_cities.length === 1 ? (
                    // Single-city compact highlight
                    <div className="p-4 rounded-2xl bg-[#c3f937]/5 border border-[#c3f937]/15 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-5 h-5 text-[#c3f937]" />
                        <span className="text-base font-bold text-white">{stats.top_cities[0].city}</span>
                      </div>
                      <span className="font-mono font-bold text-[#c3f937] text-lg numeric-value">
                        {formatNumber(stats.top_cities[0].count)}
                      </span>
                    </div>
                  ) : (
                    stats.top_cities.map((c, i) => {
                      const pct = total > 0 ? Math.round((c.count / total) * 100) : 0;
                      return (
                        <div key={i} className="distribution-item border-b border-white/[0.05] pb-2.5 last:border-0">
                          <div className="distribution-header">
                            <span className="text-slate-100 font-semibold text-sm flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#c3f937]" />
                              <span>{c.city}</span>
                            </span>
                            <span className="font-mono text-slate-300 text-sm numeric-value">
                              {formatNumber(c.count)} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden mt-2">
                            <div
                              className="h-full rounded-full bg-[#c3f937]"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  )
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">
                    لا توجد بيانات مدن مسجلة حتى الآن.
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3.5 border-t border-white/[0.08] text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#c3f937]" />
              <span>المعسكر حضوري في مدينة الرياض</span>
            </div>
          </div>

        {/* Recent Applications (12 cols) */}
        <div className="dashboard-panel bento-card col-span-12">
          <div className="panel-header" style={{ marginBottom: "12px" }}>
            <div>
              <h2 className="text-[22px] font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
                <span>أحدث الطلبات</span>
              </h2>
              <p className="muted-text text-slate-400 mt-1">آخر المتقدمين المسجلين في المعسكر</p>
            </div>
            <Link
              href="/admin/applications"
              className="btn-admin-md bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-[#c3f937] font-semibold transition-all group"
            >
              <span>عرض جميع الطلبات</span>
              <ChevronLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.05]">
            {stats.recent_applications && stats.recent_applications.length > 0 ? (
              stats.recent_applications.slice(0, 5).map((app: ApplicationListItem) => (
                <div
                  key={app.id}
                  className="recent-application grid grid-cols-1 md:grid-cols-12 items-center gap-4 hover:bg-white/[0.02] transition-colors rounded-xl"
                >
                  {/* Applicant Info (5 cols) */}
                  <div className="md:col-span-5 space-y-1">
                    <Link
                      href={`/admin/applications/${app.id}/review`}
                      className="text-[17px] font-bold text-white hover:text-[#c3f937] transition-colors block truncate"
                    >
                      {app.full_name}
                    </Link>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                      <span className="application-id text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                        {toLatinDigits(app.reference_code)}
                      </span>
                      <span>|</span>
                      <span className="text-slate-300">{app.city || "الرياض"}</span>
                    </div>
                  </div>

                  {/* Level Badge (2 cols) */}
                  <div className="md:col-span-2">
                    <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#c3f937]">
                      {app.level === "foundation"
                        ? "مبتدئ"
                        : app.level === "practitioner"
                        ? "ممارس"
                        : "متقدم"}
                    </span>
                  </div>

                  {/* Status Badge (3 cols) */}
                  <div className="md:col-span-3">
                    <AdminStatusBadge status={app.application_status} size="sm" />
                  </div>

                  {/* Action Button (2 cols) */}
                  <div className="md:col-span-2 flex justify-end">
                    <Link
                      href={`/admin/applications/${app.id}/review`}
                      className="btn-admin-md bg-[#c3f937]/10 hover:bg-[#c3f937] text-[#c3f937] hover:text-[#0c1018] border border-[#c3f937]/30 transition-all font-bold text-xs"
                    >
                      مراجعة الطلب
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                لا توجد طلبات مسجلة بعد. ستظهر أحدث الطلبات هنا مباشرة فور تسجيلها.
              </div>
            )}
          </div>

          <div className="pt-3.5 border-t border-white/[0.06] text-xs text-slate-400 flex items-center justify-between mt-2">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>تحديث تلقائي لحظي للبيانات</span>
            </span>
            <span className="font-mono text-slate-500 numeric-value">BUILDx Admin 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
