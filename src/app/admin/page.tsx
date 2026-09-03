"use client";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { DashboardStats, ApplicationListItem } from "@/types/admin";
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
  RefreshCw,
  Activity,
  UserCheck,
  ChevronLeft,
} from "lucide-react";

// ── Animated Number Counter Component ────────────────────────────────
function AnimatedCounter({ value }: { value: number }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // ms
    const startTime = performance.now();

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Smooth ease out expo curve
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.floor(ease * (value - start) + start);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setDisplayValue(value);
      }
    }

    requestAnimationFrame(update);
  }, [value]);

  return <span>{displayValue.toLocaleString()}</span>;
}

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
      <div className="space-y-10 animate-pulse" dir="rtl">
        <div className="h-24 bg-white/[0.03] rounded-3xl" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-44 bg-white/[0.03] rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-5 h-80 bg-white/[0.03] rounded-3xl" />
          <div className="col-span-12 lg:col-span-7 h-80 bg-white/[0.03] rounded-3xl" />
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="p-10 text-center bento-card text-rose-300 max-w-xl mx-auto my-14 space-y-5" dir="rtl">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
          <CircleX className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">تعذر تحميل لوحة التحكم</h2>
        <p className="text-sm text-slate-300">{error}</p>
        <button
          type="button"
          onClick={fetchStats}
          className="px-6 py-2.5 rounded-xl bg-[#c3f937] text-[#0c1018] font-bold text-xs hover:bg-[#c3f937]/90 transition-all cursor-pointer shadow-lg shadow-[#c3f937]/20"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const total = stats.total || 0;
  const todayCount = stats.today || 0;
  const isZeroApplications = total === 0;

  // Level statistics
  const fnd = stats.by_level?.foundation || 0;
  const prac = stats.by_level?.practitioner || 0;
  const adv = stats.by_level?.advanced || 0;
  const fndPct = total > 0 ? Math.round((fnd / total) * 100) : 0;
  const pracPct = total > 0 ? Math.round((prac / total) * 100) : 0;
  const advPct = total > 0 ? Math.round((adv / total) * 100) : 0;

  // Pipeline funnel data
  const pipelineStages = [
    {
      id: "submitted",
      name: "طلب جديد",
      count: stats.by_status?.submitted || 0,
      color: "#38bdf8",
      href: "/admin/applications?status=submitted",
      icon: FileText,
      needsAttention: (stats.by_status?.submitted || 0) > 0,
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
      name: "مرشح مبدئي",
      count: stats.by_status?.preliminary_candidate || 0,
      color: "#facc15",
      href: "/admin/preliminary",
      icon: Star,
    },
    {
      id: "accepted",
      name: "مقبول",
      count: stats.by_status?.accepted || 0,
      color: "#c3f937",
      href: "/admin/accepted",
      icon: CircleCheckBig,
    },
    {
      id: "confirmed",
      name: "تأكيد القبول",
      count: stats.by_status?.confirmed || 0,
      color: "#4ade80",
      href: "/admin/applications?status=confirmed",
      icon: UserCheck,
    },
  ];

  return (
    <div className="space-y-10 pb-14 select-none font-janna" dir="rtl">
      
      {/* ── 1. WELCOMING HEADER ──────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 p-6 sm:p-7 rounded-[26px] relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(26, 32, 50, 0.88) 0%, rgba(14, 18, 28, 0.96) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 20px 48px rgba(0, 0, 0, 0.35)",
        }}
      >
        {/* Subtle Ambient Radial Light */}
        <div
          className="absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20 bg-[#c3f937]"
          aria-hidden="true"
        />

        <div className="flex items-center gap-4 sm:gap-5 relative z-10">
          {/* Floating Mascot Avatar */}
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-14 h-14 rounded-2xl bg-[#c3f937]/10 border border-[#c3f937]/25 flex items-center justify-center relative shadow-[0_0_20px_rgba(195,249,55,0.18)] shrink-0"
          >
            <Image
              src="/assets/characters/ready.png"
              alt="Avatar"
              width={40}
              height={40}
              className="w-10 h-10 object-contain image-pixelated drop-shadow-[0_2px_8px_rgba(195,249,55,0.4)]"
              priority
            />
            <span className="absolute -bottom-1 w-8 h-1 bg-[#c3f937] rounded-full blur-xs opacity-75" />
          </motion.div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                مرحبًا أحمد 👋
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#c3f937]/10 text-[#c3f937] border border-[#c3f937]/25">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c3f937] animate-ping" />
                <span>متصل بالخادم · تحديث لحظي</span>
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300/90 leading-relaxed">
              إليك نظرة سريعة على حالة المتقدمين والطلبات اليوم في معسكر BUILDx.
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="button"
            onClick={fetchStats}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 h-11 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-[#c3f937]/30 text-xs font-bold text-slate-200 hover:text-white transition-all duration-150 disabled:opacity-50 cursor-pointer shadow-sm"
            aria-label="تحديث البيانات"
          >
            <RefreshCw
              className={`w-4 h-4 text-[#c3f937] ${loading ? "animate-spin" : ""}`}
              strokeWidth={2.2}
              aria-hidden="true"
            />
            <span>تحديث البيانات</span>
          </motion.button>
        </div>
      </motion.div>

      {/* ── 2. KPI METRIC CARDS (5 Balanced Spaced Metric Cards) ─────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-6">
        
        {/* 1. Total Applications */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          whileHover={{ y: -3, scale: 1.015 }}
        >
          <Link href="/admin/applications" className="block h-full group focus:outline-none">
            <div
              className="p-6 sm:p-7 rounded-[22px] h-full flex flex-col justify-between transition-all duration-200 relative overflow-hidden"
              style={{
                background: "linear-gradient(155deg, rgba(28, 34, 52, 0.82) 0%, rgba(14, 18, 28, 0.94) 100%)",
                border: "1px solid rgba(195, 249, 55, 0.16)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 14px 32px rgba(0, 0, 0, 0.35)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-[#c3f937]/10 border border-[#c3f937]/20 text-[#c3f937] flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                  <Files className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <span className="text-[10px] font-mono font-bold text-[#c3f937]/90 bg-[#c3f937]/10 border border-[#c3f937]/20 px-2.5 py-0.5 rounded-md">
                  +{todayCount} اليوم
                </span>
              </div>
              <div className="mt-5 space-y-1.5 text-right">
                <span className="text-xs font-semibold text-slate-300 block">إجمالي الطلبات</span>
                <span className="text-4xl sm:text-5xl font-black font-mono text-[#c3f937] tracking-tight block leading-none">
                  <AnimatedCounter value={total} />
                </span>
                <span className="text-[11px] text-slate-400 block pt-1 leading-relaxed">
                  آخر 7 أيام: <strong className="text-white font-mono font-bold">{stats.last_7_days || 0}</strong>
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* 2. New / Submitted (Pulse Highlight for Attention) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          whileHover={{ y: -3, scale: 1.015 }}
        >
          <Link href="/admin/applications?status=submitted" className="block h-full group focus:outline-none">
            <div
              className="p-6 sm:p-7 rounded-[22px] h-full flex flex-col justify-between transition-all duration-200 relative overflow-hidden"
              style={{
                background: "linear-gradient(155deg, rgba(28, 34, 52, 0.82) 0%, rgba(14, 18, 28, 0.94) 100%)",
                border: "1px solid rgba(56, 189, 248, 0.16)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 14px 32px rgba(0, 0, 0, 0.35)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="relative">
                  <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                    <FileText className="w-5 h-5" strokeWidth={2.2} />
                  </div>
                  {(stats.by_status?.submitted || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-sky-400 animate-ping opacity-75" />
                  )}
                </div>
                <span className="text-[10px] font-mono tracking-wider text-slate-400/80 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md">
                  NEW
                </span>
              </div>
              <div className="mt-5 space-y-1.5 text-right">
                <span className="text-xs font-semibold text-slate-300 block">طلبات جديدة</span>
                <span className="text-4xl sm:text-5xl font-black font-mono text-sky-400 tracking-tight block leading-none">
                  <AnimatedCounter value={stats.by_status?.submitted || 0} />
                </span>
                <span className="text-[11px] text-slate-400 block pt-1 leading-relaxed">بانتظار بدء الفرز</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* 3. Under Review */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          whileHover={{ y: -3, scale: 1.015 }}
        >
          <Link href="/admin/applications?status=under_review" className="block h-full group focus:outline-none">
            <div
              className="p-6 sm:p-7 rounded-[22px] h-full flex flex-col justify-between transition-all duration-200 relative overflow-hidden"
              style={{
                background: "linear-gradient(155deg, rgba(28, 34, 52, 0.82) 0%, rgba(14, 18, 28, 0.94) 100%)",
                border: "1px solid rgba(192, 132, 252, 0.16)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 14px 32px rgba(0, 0, 0, 0.35)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                  <Search className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <span className="text-[10px] font-mono tracking-wider text-slate-400/80 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md">
                  REVIEW
                </span>
              </div>
              <div className="mt-5 space-y-1.5 text-right">
                <span className="text-xs font-semibold text-slate-300 block">قيد المراجعة</span>
                <span className="text-4xl sm:text-5xl font-black font-mono text-purple-400 tracking-tight block leading-none">
                  <AnimatedCounter value={stats.by_status?.under_review || 0} />
                </span>
                <span className="text-[11px] text-slate-400 block pt-1 leading-relaxed">يجري تقييم إجاباتهم</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* 4. Preliminary Candidate */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          whileHover={{ y: -3, scale: 1.015 }}
        >
          <Link href="/admin/preliminary" className="block h-full group focus:outline-none">
            <div
              className="p-6 sm:p-7 rounded-[22px] h-full flex flex-col justify-between transition-all duration-200 relative overflow-hidden"
              style={{
                background: "linear-gradient(155deg, rgba(28, 34, 52, 0.82) 0%, rgba(14, 18, 28, 0.94) 100%)",
                border: "1px solid rgba(250, 204, 21, 0.16)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 14px 32px rgba(0, 0, 0, 0.35)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                  <Star className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <span className="text-[10px] font-mono tracking-wider text-slate-400/80 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md">
                  STAGE 1
                </span>
              </div>
              <div className="mt-5 space-y-1.5 text-right">
                <span className="text-xs font-semibold text-slate-300 block">مرشحون مبدئيًا</span>
                <span className="text-4xl sm:text-5xl font-black font-mono text-yellow-400 tracking-tight block leading-none">
                  <AnimatedCounter value={stats.by_status?.preliminary_candidate || 0} />
                </span>
                <span className="text-[11px] text-slate-400 block pt-1 leading-relaxed">مؤهلون للمفاضلة</span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* 5. Accepted */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          whileHover={{ y: -3, scale: 1.015 }}
        >
          <Link href="/admin/accepted" className="block h-full group focus:outline-none">
            <div
              className="p-6 sm:p-7 rounded-[22px] h-full flex flex-col justify-between transition-all duration-200 relative overflow-hidden"
              style={{
                background: "linear-gradient(155deg, rgba(28, 34, 52, 0.82) 0%, rgba(14, 18, 28, 0.94) 100%)",
                border: "1px solid rgba(74, 222, 128, 0.2)",
                boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.06), 0 14px 32px rgba(0, 0, 0, 0.35)",
              }}
            >
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center transition-transform duration-200 group-hover:scale-110">
                  <CircleCheckBig className="w-5 h-5" strokeWidth={2.2} />
                </div>
                <span className="text-[10px] font-mono tracking-wider text-slate-400/80 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-md">
                  32 مقعد
                </span>
              </div>
              <div className="mt-5 space-y-1.5 text-right">
                <span className="text-xs font-semibold text-slate-300 block">المقبولون نهائيًا</span>
                <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tight block leading-none">
                  <AnimatedCounter value={stats.by_status?.accepted || 0} />
                </span>
                <span className="text-[11px] text-slate-400 block pt-1 leading-relaxed">جاهزون لتوزيع الفرق</span>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* ── If 0 applications, show Empty State ──────────────────────── */}
      {isZeroApplications && (
        <AdminEmptyState onRefresh={fetchStats} isRefreshing={loading} />
      )}

      {/* ── 3. VISUAL TRACKS / LEVELS + ADMISSION FUNNEL ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Visual Level Distribution (5 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="col-span-12 lg:col-span-5"
        >
          <div
            className="p-6 sm:p-7 rounded-[26px] h-full flex flex-col justify-between"
            style={{
              background: "linear-gradient(155deg, rgba(26, 32, 50, 0.88) 0%, rgba(14, 18, 28, 0.96) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 20px 48px rgba(0, 0, 0, 0.35)",
            }}
          >
            <div className="space-y-1 text-right">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
                  <span>توزيع المستويات والمسارات</span>
                </h3>
                <span className="text-[11px] font-mono font-bold text-[#c3f937]/90 bg-[#c3f937]/10 px-2.5 py-0.5 rounded-full border border-[#c3f937]/20">
                  3 TRACKS
                </span>
              </div>
              <p className="text-xs text-slate-300/85">نسبة المتقدمين عبر مسارات المعسكر</p>
            </div>

            {/* 3 Tracks Cards with Animated Smooth Progress */}
            <div className="space-y-4 my-6">
              {/* Foundation */}
              <div
                className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] space-y-2.5 hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#823419] shadow-[0_0_8px_#823419]" />
                    <span className="font-bold text-slate-100 text-sm">مبتدئ (Foundation)</span>
                  </div>
                  <span className="font-mono font-bold text-orange-200">
                    {fnd} متقدم ({fndPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${fndPct}%` }}
                    transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ background: "linear-gradient(90deg, #823419, #c35c39)" }}
                  />
                </div>
              </div>

              {/* Practitioner */}
              <div
                className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] space-y-2.5 hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#c3f937] shadow-[0_0_8px_#c3f937]" />
                    <span className="font-bold text-slate-100 text-sm">ممارس (Practitioner)</span>
                  </div>
                  <span className="font-mono font-bold text-[#c3f937]">
                    {prac} متقدم ({pracPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pracPct}%` }}
                    transition={{ duration: 1.1, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-[#c3f937] shadow-[0_0_12px_rgba(195,249,55,0.6)]"
                  />
                </div>
              </div>

              {/* Advanced */}
              <div
                className="p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06] space-y-2.5 hover:bg-white/[0.05] transition-colors"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fb50c3] shadow-[0_0_8px_#fb50c3]" />
                    <span className="font-bold text-slate-100 text-sm">متقدم (Advanced)</span>
                  </div>
                  <span className="font-mono font-bold text-pink-200">
                    {adv} متقدم ({advPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${advPct}%` }}
                    transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full bg-[#fb50c3] shadow-[0_0_12px_rgba(251,80,195,0.6)]"
                  />
                </div>
              </div>
            </div>

            {/* Team Environment Summary */}
            <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs text-slate-300">
              <span>تفضيل بيئة العمل:</span>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] font-medium">
                  مشتركة ({stats.by_team_env?.comfortable || 0})
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] font-medium">
                  نفس الجنس ({stats.by_team_env?.same_gender_only || 0})
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Funnel Pipeline (7 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="col-span-12 lg:col-span-7"
        >
          <div
            className="p-6 sm:p-7 rounded-[26px] h-full flex flex-col justify-between"
            style={{
              background: "linear-gradient(155deg, rgba(26, 32, 50, 0.88) 0%, rgba(14, 18, 28, 0.96) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 20px 48px rgba(0, 0, 0, 0.35)",
            }}
          >
            <div className="space-y-1 text-right">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
                  <span>مسار مراحل الاختيار والقبول</span>
                </h3>
                <span className="text-[11px] font-mono font-bold text-slate-300/80 bg-white/[0.04] px-2.5 py-0.5 rounded-full border border-white/[0.08]">
                  PIPELINE
                </span>
              </div>
              <p className="text-xs text-slate-300/85">تسلسل انتقال المرشحين من التقديم وحتى اعتماد المقعد</p>
            </div>

            {/* Visual Funnel Cards with Breathing Padding */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 my-6">
              {pipelineStages.map((stage) => {
                const pct = total > 0 ? Math.round((stage.count / total) * 100) : 0;
                const Icon = stage.icon;

                return (
                  <Link
                    key={stage.id}
                    href={stage.href}
                    className="p-4 rounded-2xl bg-white/[0.025] hover:bg-white/[0.06] border border-white/[0.06] text-center flex flex-col justify-between gap-2.5 transition-all duration-200 hover:translate-y-[-2px] group focus:outline-none"
                  >
                    <Icon
                      className="w-5 h-5 mx-auto transition-transform duration-200 group-hover:scale-110"
                      style={{ color: stage.color }}
                      aria-hidden="true"
                    />
                    <div>
                      <span className="text-[11px] font-bold text-slate-200 block truncate">
                        {stage.name}
                      </span>
                      <span
                        className="text-2xl sm:text-3xl font-black font-mono block mt-1 leading-none"
                        style={{ color: stage.color }}
                      >
                        {stage.count}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono block bg-white/[0.04] py-0.5 rounded-md">
                      {pct}%
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Secondary Statuses Summary Bar */}
            <div className="pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">حالات إضافية:</span>
              <div className="flex items-center gap-4">
                <Link
                  href="/admin/waitlist"
                  className="inline-flex items-center gap-1.5 text-orange-400/90 hover:text-orange-300 font-bold transition-colors"
                >
                  <Clock3 className="w-4 h-4" aria-hidden="true" />
                  <span>قائمة الانتظار ({stats.by_status?.waitlisted || 0})</span>
                </Link>
                <span className="text-slate-600">•</span>
                <Link
                  href="/admin/rejected"
                  className="inline-flex items-center gap-1.5 text-rose-400/90 hover:text-rose-300 font-bold transition-colors"
                >
                  <CircleX className="w-4 h-4" aria-hidden="true" />
                  <span>غير المقبولين ({stats.by_status?.rejected || 0})</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── 4. TOP CITIES & RECENT APPLICATIONS TABLE ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Cities (4 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="col-span-12 lg:col-span-4"
        >
          <div
            className="p-6 sm:p-7 rounded-[26px] h-full flex flex-col justify-between"
            style={{
              background: "linear-gradient(155deg, rgba(26, 32, 50, 0.88) 0%, rgba(14, 18, 28, 0.96) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 20px 48px rgba(0, 0, 0, 0.35)",
            }}
          >
            <div className="space-y-1 text-right">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
                <span>أعلى المدن تسجيلاً</span>
              </h3>
              <p className="text-xs text-slate-300/85">التوزيع الجغرافي للمتقدمين</p>
            </div>

            <div className="space-y-4 my-6">
              {stats.top_cities && stats.top_cities.length > 0 ? (
                stats.top_cities.map((c, i) => {
                  const pct = total > 0 ? Math.round((c.count / total) * 100) : 0;
                  return (
                    <div key={i} className="space-y-1.5 text-right">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-100 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c3f937]" />
                          <span>{c.city}</span>
                        </span>
                        <span className="font-mono text-slate-300">
                          {c.count} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full rounded-full bg-gradient-to-l from-[#c3f937] to-emerald-400"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-500 py-6 text-center">لا توجد بيانات مدن مسجلة حتى الآن.</p>
              )}
            </div>

            <div className="pt-4 border-t border-white/[0.08] text-xs text-slate-400 text-center font-medium">
              📍 المعسكر حضوري في مدينة الرياض
            </div>
          </div>
        </motion.div>

        {/* Recent Applications Modern Table (8 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="col-span-12 lg:col-span-8"
        >
          <div
            className="p-6 sm:p-7 rounded-[26px] h-full flex flex-col justify-between"
            style={{
              background: "linear-gradient(155deg, rgba(26, 32, 50, 0.88) 0%, rgba(14, 18, 28, 0.96) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 20px 48px rgba(0, 0, 0, 0.35)",
            }}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
              <div className="space-y-0.5 text-right">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
                  <span>أحدث الطلبات المستلمة</span>
                </h3>
                <p className="text-xs text-slate-300/85">قائمة آخر المتقدمين لحظيًا</p>
              </div>
              <Link
                href="/admin/applications"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs text-[#c3f937] hover:text-[#c3f937] font-bold transition-all group"
              >
                <span>مشاهدة الكل</span>
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
              </Link>
            </div>

            {/* List / Table */}
            <div className="divide-y divide-white/[0.05] my-2">
              {stats.recent_applications && stats.recent_applications.length > 0 ? (
                stats.recent_applications.slice(0, 5).map((app: ApplicationListItem) => (
                  <motion.div
                    key={app.id}
                    whileHover={{ x: -3, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                    transition={{ duration: 0.15 }}
                    className="py-3.5 px-3 flex flex-wrap items-center justify-between gap-3 rounded-xl transition-all"
                  >
                    <div className="min-w-0 space-y-1 text-right">
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="text-sm font-bold text-white hover:text-[#c3f937] transition-colors block truncate"
                      >
                        {app.full_name}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <span className="font-mono text-[11px] text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]">
                          {app.reference_code}
                        </span>
                        <span>•</span>
                        <span>{app.city || "الرياض"}</span>
                        <span>•</span>
                        <span className="text-[#c3f937] font-bold text-[11px]">
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
                        className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-[#c3f937] hover:text-[#0c1018] text-slate-200 text-xs font-bold transition-all cursor-pointer"
                      >
                        عرض الملف
                      </Link>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-10 text-center text-xs text-slate-400">
                  لا توجد طلبات مستلمة بعد. ستظهر أحدث الطلبات هنا مباشرة فور تسجيلها.
                </div>
              )}
            </div>

            {/* Footer Status Hint */}
            <div className="pt-3.5 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/[0.06]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>يتم التحديث المباشر فور تسجيل أي متقدم جديد</span>
              </span>
              <span className="font-mono text-slate-500">BUILDx OS // v2.0</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
