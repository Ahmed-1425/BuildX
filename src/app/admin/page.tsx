"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import type { DashboardStats, ApplicationListItem } from "@/types/admin";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import AdminEmptyState from "@/components/admin/AdminEmptyState";
import AdminStatusBadge from "@/components/admin/StatusBadge";
import {
  Files,
  FileText,
  Search,
  Star,
  CircleCheckBig,
  Clock3,
  CircleX,
  MapPin,
  TrendingUp,
  Layers,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Users,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
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
    return (
      <div className="space-y-8 animate-pulse" dir="rtl">
        <div className="h-16 bg-white/[0.03] rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-6 h-52 bg-white/[0.03] rounded-3xl" />
          <div className="col-span-12 lg:col-span-6 grid grid-cols-2 gap-4">
            <div className="h-24 bg-white/[0.03] rounded-2xl" />
            <div className="h-24 bg-white/[0.03] rounded-2xl" />
            <div className="h-24 bg-white/[0.03] rounded-2xl" />
            <div className="h-24 bg-white/[0.03] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-8 text-center bento-card text-rose-300 max-w-xl mx-auto my-12 space-y-4" dir="rtl">
        <h2 className="text-xl font-bold text-white">تعذر تحميل لوحة التحكم</h2>
        <p className="text-sm">{error}</p>
        <button
          type="button"
          onClick={fetchStats}
          className="px-5 py-2.5 rounded-xl bg-[#c3f937] text-[#0c1018] font-bold text-xs hover:bg-[#c3f937]/90 transition-all cursor-pointer"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const total = stats.total || 0;
  const todayCount = stats.today || 0;
  const isZeroApplications = total === 0;

  // Level percentages
  const fnd = stats.by_level?.foundation || 0;
  const prac = stats.by_level?.practitioner || 0;
  const adv = stats.by_level?.advanced || 0;
  const fndPct = total > 0 ? Math.round((fnd / total) * 100) : 0;
  const pracPct = total > 0 ? Math.round((prac / total) * 100) : 0;
  const advPct = total > 0 ? Math.round((adv / total) * 100) : 0;

  // Pipeline stages
  const pipelineStages = [
    {
      id: "submitted",
      name: "طلب جديد",
      count: stats.by_status?.submitted || 0,
      color: "#e7edfd",
      barColor: "bg-slate-300",
      href: "/admin/applications?status=submitted",
    },
    {
      id: "under_review",
      name: "قيد المراجعة",
      count: stats.by_status?.under_review || 0,
      color: "#a855f7",
      barColor: "bg-purple-400",
      href: "/admin/applications?status=under_review",
    },
    {
      id: "preliminary_candidate",
      name: "مرشح مبدئي",
      count: stats.by_status?.preliminary_candidate || 0,
      color: "#facc15",
      barColor: "bg-yellow-400",
      href: "/admin/preliminary",
    },
    {
      id: "accepted",
      name: "مقبول",
      count: stats.by_status?.accepted || 0,
      color: "#c3f937",
      barColor: "bg-[#c3f937]",
      href: "/admin/accepted",
    },
    {
      id: "confirmed",
      name: "تأكيد القبول",
      count: stats.by_status?.confirmed || 0,
      color: "#38bdf8",
      barColor: "bg-sky-400",
      href: "/admin/applications?status=confirmed",
    },
  ];

  return (
    <div className="space-y-8" dir="rtl">
      {/* ── Dashboard Header ─────────────────────────── */}
      <AdminPageHeader
        title="لوحة مؤشرات BUILDx"
        subtitle="متابعة التسجيلات، مراجعة الطلبات، وإدارة مراحل القبول والفرق."
        onRefresh={fetchStats}
        isRefreshing={loading}
      />

      {/* ── Bento Grid Row 1: Primary Total Card + 4 Mini Stat Cards ──────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Large Featured Card: Total Applications (6 cols) */}
        <div className="col-span-12 lg:col-span-6">
          <div className="bento-card p-6 sm:p-7 flex flex-col justify-between h-full relative overflow-hidden group">
            {/* Top green glow accent */}
            <div className="absolute top-0 right-0 left-0 h-[2px] bg-gradient-to-r from-transparent via-[#c3f937]/50 to-transparent pointer-events-none" />
            <div
              className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none bg-[#c3f937]/15 opacity-70"
              aria-hidden="true"
            />

            {/* Top Bar */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#c3f937]/10 border border-[#c3f937]/25 flex items-center justify-center text-[#c3f937]">
                  <Files className="w-6 h-6" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">إجمالي الطلبات المسجلة</h3>
                  <span className="text-xs text-slate-400 font-mono">ALL APPLICATIONS</span>
                </div>
              </div>

              <Link
                href="/admin/applications"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                <span>القائمة</span>
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            {/* Big Figure & Micro Sparkline */}
            <div className="my-6 relative z-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-5xl sm:text-6xl font-bold font-mono text-[#c3f937] tracking-tight block">
                  {total.toLocaleString()}
                </span>
                <div className="flex items-center gap-2 mt-1 text-xs text-slate-300">
                  <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                    <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>+{todayCount} اليوم</span>
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">
                    آخر 7 أيام: <strong className="text-white font-mono">{stats.last_7_days || 0}</strong>
                  </span>
                </div>
              </div>

              {/* Decorative Micro Trendline SVG */}
              <div className="w-36 h-12 opacity-70 pointer-events-none shrink-0" aria-hidden="true">
                <svg viewBox="0 0 140 45" fill="none" className="w-full h-full">
                  <path
                    d="M0 40 Q 25 35, 50 25 T 100 18 T 140 5"
                    stroke="#c3f937"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M0 40 Q 25 35, 50 25 T 100 18 T 140 5 L 140 45 L 0 45 Z"
                    fill="url(#sparkline-grad)"
                    opacity="0.2"
                  />
                  <defs>
                    <linearGradient id="sparkline-grad" x1="0" y1="0" x2="0" y2="45" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#c3f937" stopOpacity="0.8" />
                      <stop offset="1" stopColor="#c3f937" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400 relative z-10">
              <span>نسبة إنجاز المراجعات</span>
              <span className="font-mono text-[#c3f937] font-semibold">
                {total - (stats.unreviewed_count || 0)} من {total} مُراجع
              </span>
            </div>
          </div>
        </div>

        {/* 4 Smaller Stat Cards (2x2 grid, 6 cols) */}
        <div className="col-span-12 lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. New / Submitted */}
          <Link href="/admin/applications?status=submitted" className="focus:outline-none block">
            <div className="bento-card p-5 h-full flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/25 text-purple-300 flex items-center justify-center">
                  <FileText className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-md">
                  NEW
                </span>
              </div>
              <div className="mt-3">
                <span className="text-xs font-semibold text-slate-300 block">طلبات جديدة</span>
                <span className="text-3xl font-bold font-mono text-purple-300 tracking-tight block mt-0.5">
                  {stats.by_status?.submitted || 0}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">بانتظار بدء المراجعة</span>
              </div>
            </div>
          </Link>

          {/* 2. Under Review */}
          <Link href="/admin/applications?status=under_review" className="focus:outline-none block">
            <div className="bento-card p-5 h-full flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 flex items-center justify-center">
                  <Search className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-md">
                  REVIEW
                </span>
              </div>
              <div className="mt-3">
                <span className="text-xs font-semibold text-slate-300 block">قيد المراجعة</span>
                <span className="text-3xl font-bold font-mono text-cyan-300 tracking-tight block mt-0.5">
                  {stats.by_status?.under_review || 0}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">يجري تقييم إجاباتهم</span>
              </div>
            </div>
          </Link>

          {/* 3. Preliminary Candidate */}
          <Link href="/admin/preliminary" className="focus:outline-none block">
            <div className="bento-card p-5 h-full flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/25 text-yellow-300 flex items-center justify-center">
                  <Star className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-md">
                  STAGE 1
                </span>
              </div>
              <div className="mt-3">
                <span className="text-xs font-semibold text-slate-300 block">مرشحون مبدئيًا</span>
                <span className="text-3xl font-bold font-mono text-yellow-300 tracking-tight block mt-0.5">
                  {stats.by_status?.preliminary_candidate || 0}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">مؤهلون للمفاضلة النهائية</span>
              </div>
            </div>
          </Link>

          {/* 4. Accepted */}
          <Link href="/admin/accepted" className="focus:outline-none block">
            <div className="bento-card p-5 h-full flex flex-col justify-between group">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#c3f937]/10 border border-[#c3f937]/25 text-[#c3f937] flex items-center justify-center">
                  <CircleCheckBig className="w-5 h-5" strokeWidth={1.8} aria-hidden="true" />
                </div>
                <span className="text-[11px] font-mono text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded-md">
                  FINAL
                </span>
              </div>
              <div className="mt-3">
                <span className="text-xs font-semibold text-slate-300 block">المقبولون نهائيًا</span>
                <span className="text-3xl font-bold font-mono text-[#c3f937] tracking-tight block mt-0.5">
                  {stats.by_status?.accepted || 0}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">جاهزون لتوزيع الفرق (32 مقعد)</span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* ── If 0 applications, show the beautiful Empty State ─── */}
      {isZeroApplications && (
        <AdminEmptyState onRefresh={fetchStats} isRefreshing={loading} />
      )}

      {/* ── Bento Grid Row 2: Levels Distribution & Selection Funnel ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Level Distribution (5 cols) */}
        <div className="col-span-12 lg:col-span-5">
          <div className="bento-card p-6 h-full flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#c3f937]" aria-hidden="true" />
                  <span>توزيع المستويات</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">3 TRACKS</span>
              </div>
              <p className="text-xs text-slate-400">توزيع المتقدمين عبر مسارات المعسكر الثلاثة</p>
            </div>

            {/* 3 Tracks Bars */}
            <div className="space-y-4 my-4">
              {/* Foundation */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">
                    مبتدئ <span className="text-slate-400 text-[11px]">· Foundation</span>
                  </span>
                  <span className="font-mono text-slate-300">
                    {fnd} ({fndPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${fndPct}%`,
                      background: "linear-gradient(90deg, #823419, #c35c39)",
                    }}
                  />
                </div>
              </div>

              {/* Practitioner */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">
                    ممارس <span className="text-slate-400 text-[11px]">· Practitioner</span>
                  </span>
                  <span className="font-mono text-[#c3f937]">
                    {prac} ({pracPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#c3f937] transition-all duration-500 shadow-[0_0_10px_rgba(195,249,55,0.4)]"
                    style={{ width: `${pracPct}%` }}
                  />
                </div>
              </div>

              {/* Advanced */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-200">
                    متقدم <span className="text-slate-400 text-[11px]">· Advanced</span>
                  </span>
                  <span className="font-mono text-[#fb50c3]">
                    {adv} ({advPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/[0.05] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#fb50c3] transition-all duration-500 shadow-[0_0_10px_rgba(251,80,195,0.4)]"
                    style={{ width: `${advPct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Team Environment Preference summary */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
              <span>تفضيل بيئة الفريق:</span>
              <span className="text-slate-200">
                مشتركة ({stats.by_team_env?.comfortable || 0}) • نفس الجنس ({stats.by_team_env?.same_gender_only || 0})
              </span>
            </div>
          </div>
        </div>

        {/* Selection Funnel Pipeline (7 cols) */}
        <div className="col-span-12 lg:col-span-7">
          <div className="bento-card p-6 h-full flex flex-col justify-between">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#c3f937]" aria-hidden="true" />
                  <span>مسار مراحل الاختيار والقبول</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">FUNNEL PIPELINE</span>
              </div>
              <p className="text-xs text-slate-400">تسلسل انتقال المرشحين من التقديم وحتى تأكيد المقعد</p>
            </div>

            {/* Visual Funnel Blocks */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 my-4">
              {pipelineStages.map((stage) => {
                const pct = total > 0 ? Math.round((stage.count / total) * 100) : 0;

                return (
                  <Link
                    key={stage.id}
                    href={stage.href}
                    className="p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-center space-y-1.5 transition-colors focus:outline-none"
                  >
                    <span className="text-[11px] font-semibold text-slate-300 block truncate">
                      {stage.name}
                    </span>
                    <span
                      className="text-2xl font-bold font-mono block"
                      style={{ color: stage.color }}
                    >
                      {stage.count}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {pct}%
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Secondary Statuses Summary Bar */}
            <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-slate-400">حالات إضافية:</span>
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/waitlist"
                  className="inline-flex items-center gap-1.5 text-orange-400 hover:underline"
                >
                  <Clock3 className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>قائمة الانتظار ({stats.by_status?.waitlisted || 0})</span>
                </Link>
                <span className="text-slate-600">•</span>
                <Link
                  href="/admin/rejected"
                  className="inline-flex items-center gap-1.5 text-rose-400 hover:underline"
                >
                  <CircleX className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>غير المقبولين ({stats.by_status?.rejected || 0})</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bento Grid Row 3: Top Cities + Recent Applications ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Top Cities (4 cols) */}
        <div className="col-span-12 lg:col-span-4">
          <div className="bento-card p-6 h-full flex flex-col justify-between">
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#c3f937]" aria-hidden="true" />
                <span>أعلى المدن تسجيلاً</span>
              </h3>
              <p className="text-xs text-slate-400">التوزيع الجغرافي للمتقدمين</p>
            </div>

            <div className="space-y-3 my-4">
              {stats.top_cities && stats.top_cities.length > 0 ? (
                stats.top_cities.map((c, i) => {
                  const pct = total > 0 ? Math.round((c.count / total) * 100) : 0;
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-200 font-semibold">{c.city}</span>
                        <span className="font-mono text-slate-300">
                          {c.count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-slate-300 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 py-4 text-center">لا توجد بيانات مدن مسجلة.</p>
              )}
            </div>

            <div className="pt-3 border-t border-white/[0.06] text-[11px] text-slate-400 text-center">
              المعسكر حضوري في مدينة الرياض
            </div>
          </div>
        </div>

        {/* Recent Applications (8 cols) */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bento-card p-6 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-white">أحدث الطلبات المستلمة</h3>
                <p className="text-xs text-slate-400">آخر المتقدمين للمعسكر</p>
              </div>
              <Link
                href="/admin/applications"
                className="inline-flex items-center gap-1.5 text-xs text-[#c3f937] hover:underline font-semibold"
              >
                <span>مشاهدة الكل</span>
                <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            {/* List / Table */}
            <div className="divide-y divide-white/[0.04] my-2">
              {stats.recent_applications && stats.recent_applications.length > 0 ? (
                stats.recent_applications.slice(0, 5).map((app: ApplicationListItem) => (
                  <div
                    key={app.id}
                    className="py-3 flex flex-wrap items-center justify-between gap-3 hover:bg-white/[0.02] transition-colors rounded-xl px-2"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="text-sm font-bold text-white hover:text-[#c3f937] transition-colors block truncate"
                      >
                        {app.full_name}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-mono text-[11px]">{app.reference_code}</span>
                        <span>•</span>
                        <span>{app.city}</span>
                        <span>•</span>
                        <span className="text-[#c3f937] text-[11px]">
                          {app.level === "foundation"
                            ? "مبتدئ"
                            : app.level === "practitioner"
                            ? "ممارس"
                            : "متقدم"}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <AdminStatusBadge status={app.application_status} size="sm" />
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/10 text-slate-200 text-xs font-semibold transition-colors"
                      >
                        عرض الملف
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-xs text-slate-500">
                  لا توجد طلبات مستلمة بعد. ستظهر أحدث الطلبات هنا مباشرة.
                </div>
              )}
            </div>

            {/* Footer hint */}
            <div className="pt-2 text-[11px] text-slate-500 text-right">
              يتم تحديث الطلبات لحظيًا عبر Supabase Realtime
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
