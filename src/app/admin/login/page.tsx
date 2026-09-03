"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  AlertCircle,
  KeyRound,
  X,
  CheckCircle2,
  Cpu,
} from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "بيانات الدخول غير صحيحة أو غير مصرح لك بالوصول.");
        setLoading(false);
        return;
      }

      // Successful login -> Redirect to admin dashboard with full reload
      window.location.href = "/admin";
    } catch {
      setError("تعذر الاتصال بالخادم. تحقق من اتصالك بالإنترنت وحاول مرة أخرى.");
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!forgotEmail.trim()) return;

    setForgotLoading(true);
    setResetError("");
    setResetSuccess(false);

    try {
      const res = await fetch("/api/admin/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });

      const data = await res.json();
      if (data.success) {
        setResetSuccess(true);
      } else {
        setResetError(data.error || "تعذر إرسال رابط الاستعادة.");
      }
    } catch {
      setResetError("حدث خطأ في الاتصال بالخادم.");
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div
      className="admin-bg min-h-[100dvh] w-full flex flex-col justify-center items-center relative overflow-x-hidden select-none font-janna"
      style={{ padding: "48px 24px" }}
      dir="rtl"
    >
      {/* ── CINEMATIC AMBIENT FLOATING LIGHTS & PARTICLES ───────────── */}
      {/* Animated Floating Neon Blob 1: Lime */}
      <motion.div
        animate={{
          x: [0, 45, -30, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.18, 0.95, 1],
          opacity: [0.18, 0.32, 0.18],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[5%] left-[8%] w-[480px] h-[480px] rounded-full blur-[140px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(195, 249, 55, 0.55) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Animated Floating Neon Blob 2: Pink */}
      <motion.div
        animate={{
          x: [0, -40, 30, 0],
          y: [0, 40, -45, 0],
          scale: [1, 0.92, 1.15, 1],
          opacity: [0.16, 0.28, 0.16],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[5%] right-[8%] w-[520px] h-[520px] rounded-full blur-[160px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(251, 80, 195, 0.45) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Animated Center Deep Ambient Glow: Violet */}
      <motion.div
        animate={{
          scale: [1, 1.14, 1],
          opacity: [0.14, 0.26, 0.14],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[680px] h-[480px] rounded-full blur-[180px] pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(52, 21, 95, 0.95) 0%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle Floating Stardust / Tech Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ y: [0, -40, 0], opacity: [0.15, 0.5, 0.15], scale: [1, 1.3, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[18%] left-[20%] w-2 h-2 rounded-full bg-[#c3f937] shadow-[0_0_10px_#c3f937]"
        />
        <motion.div
          animate={{ y: [0, 35, 0], opacity: [0.12, 0.45, 0.12], scale: [1, 1.25, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-[24%] left-[16%] w-2.5 h-2.5 rounded-full bg-[#fb50c3] shadow-[0_0_12px_#fb50c3]"
        />
        <motion.div
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.55, 0.2] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
          className="absolute top-[35%] right-[22%] w-1.5 h-1.5 rounded-full bg-[#c3f937] shadow-[0_0_8px_#c3f937]"
        />
        <motion.div
          animate={{ y: [0, 28, 0], opacity: [0.15, 0.4, 0.15] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          className="absolute bottom-[35%] right-[18%] w-2 h-2 rounded-full bg-[#38bdf8] shadow-[0_0_10px_#38bdf8]"
        />
      </div>

      {/* ── MAIN RESPONSIVE GATEWAY CONTAINER ────────────────────────── */}
      <main className="w-full max-w-[1160px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(400px,480px)] gap-10 lg:gap-14 items-center relative z-10">
        
        {/* ── RIGHT COLUMN (in RTL): BUILDx Gaming Command Deck Showcase (Desktop Only) ─ */}
        <motion.section
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="hidden lg:flex flex-col items-start"
          style={{ gap: "28px" }}
        >
          {/* Logo with Breathing Ambient Glow */}
          <Link
            href="/"
            className="inline-block group focus:outline-none focus:ring-2 focus:ring-[#c3f937] rounded-2xl transition-transform duration-300 hover:scale-[1.025]"
            aria-label="العودة للصفحة الرئيسية"
          >
            <div className="relative">
              <motion.div
                animate={{
                  opacity: [0.25, 0.55, 0.25],
                  scale: [0.98, 1.05, 0.98],
                }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-[#c3f937]/20 blur-2xl rounded-full pointer-events-none"
              />
              <Image
                src="/assets/logos/logo-white-glow.png"
                alt="BUILDx"
                width={250}
                height={86}
                priority
                className="w-[230px] xl:w-[260px] h-auto object-contain relative z-10 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
              />
            </div>
          </Link>

          {/* Futuristic Status Badge Pill with Pulse */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center text-xs font-bold tracking-wide uppercase"
            style={{
              gap: "10px",
              padding: "8px 18px",
              borderRadius: "999px",
              background: "rgba(195, 249, 55, 0.1)",
              color: "#c3f937",
              border: "1px solid rgba(195, 249, 55, 0.35)",
              boxShadow: "0 0 20px rgba(195, 249, 55, 0.15)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[#c3f937] animate-ping" />
            <ShieldCheck className="w-4 h-4 text-[#c3f937]" aria-hidden="true" />
            <span>بوابة التحكم المركزية // COMMAND DECK</span>
          </motion.div>

          {/* Headline & Welcoming Subtitle with Generous Breathing Room */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "520px" }}
          >
            <h1
              className="font-extrabold text-white tracking-tight"
              style={{ fontSize: "34px", lineHeight: "1.35", margin: 0 }}
            >
              مرحبًا بك في لوحة تحكّم{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-[#c3f937] via-[#e2fc73] to-white">
                BUILDx
              </span>
            </h1>
            <p
              className="text-slate-300"
              style={{ fontSize: "15px", lineHeight: "1.7", margin: 0 }}
            >
              المساحة المركزية لإدارة المعسكر، استعراض المتقدمين، متابعة التقييمات، وتوزيع الفرق في بيئة عمل سريعة ومتصلة لحظيًا.
            </p>
          </motion.div>

          {/* Holographic Anime/Gaming Control Room Showcase Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="w-full relative overflow-hidden group"
            style={{
              maxWidth: "480px",
              padding: "24px",
              borderRadius: "24px",
              background: "linear-gradient(135deg, rgba(26, 31, 48, 0.75) 0%, rgba(16, 20, 31, 0.88) 100%)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 20px 45px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
            }}
          >
            {/* Pulsing Anime-tech Corner Brackets */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 border-[#c3f937]"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 border-[#fb50c3]"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 border-[#c3f937]"
            />
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 border-[#fb50c3]"
            />

            <div
              className="relative z-10 flex items-center"
              style={{ gap: "20px" }}
            >
              {/* Floating Pixel Character on Holographic Light Pedestal */}
              <motion.div
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="relative shrink-0"
              >
                <div
                  className="rounded-2xl flex items-center justify-center relative"
                  style={{
                    width: "76px",
                    height: "76px",
                    background: "rgba(195, 249, 55, 0.1)",
                    border: "1px solid rgba(195, 249, 55, 0.35)",
                    boxShadow: "0 0 24px rgba(195, 249, 55, 0.25)",
                  }}
                >
                  <Image
                    src="/assets/characters/ready.png"
                    alt="BUILDx Mascot"
                    width={64}
                    height={64}
                    className="w-14 h-14 object-contain image-pixelated drop-shadow-[0_4px_14px_rgba(195,249,55,0.5)]"
                    priority
                  />
                  <motion.div
                    animate={{ opacity: [0.5, 0.9, 0.5], scale: [0.95, 1.05, 0.95] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-1.5 w-12 h-1.5 bg-[#c3f937] rounded-full blur-xs"
                  />
                </div>
              </motion.div>

              {/* Status Details (Cleaned - No REALTIME badge, No level tags) */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
                <span
                  className="font-mono font-bold text-[#c3f937] tracking-wider uppercase flex items-center"
                  style={{ gap: "8px", fontSize: "13px" }}
                >
                  <Activity className="w-4 h-4 text-[#c3f937]" />
                  <span>SYSTEM ONLINE</span>
                </span>
                <p className="font-bold text-white text-base leading-snug" style={{ margin: 0 }}>
                  معسكر Vibe Coding — النسخة الأولى
                </p>
                <p className="text-xs text-slate-400" style={{ margin: 0 }}>
                  متابعة شاملة لإدارة المسارات والفرق وقرارات القبول
                </p>
              </div>
            </div>
          </motion.div>

          {/* 3 Gaming Feature Badges with Hover Micro-animations (Cleaned - No English labels) */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="w-full"
            style={{
              maxWidth: "480px",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "14px",
            }}
          >
            <motion.div
              whileHover={{ y: -4, borderColor: "rgba(195, 249, 55, 0.4)", backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              transition={{ duration: 0.2 }}
              className="text-center group cursor-default"
              style={{
                padding: "18px 14px",
                borderRadius: "18px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Zap className="w-5 h-5 text-[#c3f937] transition-transform duration-200 group-hover:scale-115" aria-hidden="true" />
              <span className="text-xs font-bold text-slate-200 block">تحديث فوري</span>
            </motion.div>
            <motion.div
              whileHover={{ y: -4, borderColor: "rgba(251, 80, 195, 0.4)", backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              transition={{ duration: 0.2 }}
              className="text-center group cursor-default"
              style={{
                padding: "18px 14px",
                borderRadius: "18px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Layers className="w-5 h-5 text-[#fb50c3] transition-transform duration-200 group-hover:scale-115" aria-hidden="true" />
              <span className="text-xs font-bold text-slate-200 block">فرز منظم</span>
            </motion.div>
            <motion.div
              whileHover={{ y: -4, borderColor: "rgba(56, 189, 248, 0.4)", backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              transition={{ duration: 0.2 }}
              className="text-center group cursor-default"
              style={{
                padding: "18px 14px",
                borderRadius: "18px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <Cpu className="w-5 h-5 text-cyan-400 transition-transform duration-200 group-hover:scale-115" aria-hidden="true" />
              <span className="text-xs font-bold text-slate-200 block">أمان تام</span>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* ── MOBILE BRAND HEADER (<1024px) ─────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="lg:hidden flex flex-col items-center text-center"
          style={{ gap: "16px", marginBottom: "16px" }}
        >
          <Link href="/" className="inline-block" aria-label="العودة للصفحة الرئيسية">
            <Image
              src="/assets/logos/logo-white-glow.png"
              alt="BUILDx"
              width={180}
              height={62}
              priority
              className="w-[170px] sm:w-[190px] h-auto object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)]"
            />
          </Link>
          <div
            className="inline-flex items-center text-xs font-bold"
            style={{
              gap: "8px",
              padding: "6px 16px",
              borderRadius: "999px",
              background: "rgba(195, 249, 55, 0.1)",
              color: "#c3f937",
              border: "1px solid rgba(195, 249, 55, 0.3)",
            }}
          >
            <span className="w-2 h-2 rounded-full bg-[#c3f937] animate-ping" />
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>بوابة لوحة الإدارة</span>
          </div>
        </motion.div>

        {/* ── LEFT COLUMN (in RTL): Premium Gaming Glass Login Card ─── */}
        <motion.section
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="w-full flex justify-center lg:justify-end"
        >
          <div
            className="w-full relative overflow-hidden transition-all duration-300"
            style={{
              maxWidth: "480px",
              padding: "clamp(28px, 6vw, 44px) clamp(22px, 5vw, 38px)",
              borderRadius: "32px",
              background: "linear-gradient(160deg, rgba(25, 30, 48, 0.92) 0%, rgba(14, 18, 28, 0.97) 100%)",
              backdropFilter: "blur(28px)",
              WebkitBackdropFilter: "blur(28px)",
              border: "1px solid rgba(231, 237, 253, 0.14)",
              boxShadow:
                "0 30px 70px -10px rgba(0, 0, 0, 0.6), 0 0 40px -10px rgba(195, 249, 55, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(22px, 3.5vw, 30px)",
            }}
          >
            {/* Top Multi-Color Neon Power Bar with Light Wave */}
            <div
              className="absolute top-0 left-0 right-0 h-[3.5px] pointer-events-none"
              style={{
                background: "linear-gradient(90deg, #c3f937 0%, #fb50c3 50%, #823419 100%)",
              }}
              aria-hidden="true"
            />

            {/* Subtle Animated Inner Ambient Glow */}
            <motion.div
              animate={{ opacity: [0.2, 0.35, 0.2], scale: [1, 1.08, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none"
              style={{ background: "#c3f937" }}
              aria-hidden="true"
            />

            {/* ── Card Header with Generous Breathing Room ── */}
            <div
              className="text-right"
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="rounded-2xl flex items-center justify-center"
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "rgba(195, 249, 55, 0.1)",
                    border: "1px solid rgba(195, 249, 55, 0.35)",
                    boxShadow: "0 0 18px rgba(195, 249, 55, 0.2)",
                  }}
                >
                  <Lock className="w-6 h-6 text-[#c3f937]" aria-hidden="true" />
                </div>
                <span
                  className="font-mono font-bold text-slate-300"
                  style={{
                    fontSize: "11px",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    padding: "4px 12px",
                    borderRadius: "8px",
                  }}
                >
                  ADMIN // AUTH
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", paddingTop: "4px" }}>
                <h2
                  className="font-extrabold text-white tracking-tight leading-tight"
                  style={{ fontSize: "28px", margin: 0 }}
                >
                  تسجيل دخول الإدارة
                </h2>
                <p
                  className="text-slate-300 leading-relaxed"
                  style={{ fontSize: "14px", margin: 0 }}
                >
                  أدخل بيانات الحساب المصرح به للوصول إلى لوحة التحكم.
                </p>
              </div>
            </div>

            {/* ── Error Alert ── */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.98 }}
                  role="alert"
                  className="rounded-2xl bg-rose-500/10 border border-rose-500/35 text-rose-300 text-sm flex items-start gap-3 shadow-lg shadow-rose-950/20"
                  style={{ padding: "14px 16px" }}
                >
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400 mt-0.5" aria-hidden="true" />
                  <span className="leading-relaxed font-medium">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Login Form with Explicit Gap Spacing ── */}
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {/* Email Input Group with Clear Spacing */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label
                  htmlFor="admin-email"
                  className="text-sm font-bold text-slate-200 text-right flex items-center justify-between"
                  style={{ margin: 0 }}
                >
                  <span>البريد الإلكتروني</span>
                  <span
                    className="font-mono text-[#c3f937]"
                    style={{
                      fontSize: "10px",
                      background: "rgba(195, 249, 55, 0.1)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      border: "1px solid rgba(195, 249, 55, 0.25)",
                    }}
                  >
                    REQUIRED
                  </span>
                </label>
                <div className="relative group">
                  <input
                    id="admin-email"
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    dir="ltr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{
                      height: "56px",
                      width: "100%",
                      borderRadius: "14px",
                      paddingLeft: "48px",
                      paddingRight: "18px",
                      background: "rgba(231, 237, 253, 0.05)",
                      border: "1px solid rgba(231, 237, 253, 0.14)",
                      fontSize: "15px",
                      color: "#ffffff",
                    }}
                    className="transition-all duration-200 focus:outline-none focus:border-[#c3f937] focus:bg-[#121624] focus:ring-4 focus:ring-[#c3f937]/20 group-hover:border-white/25 placeholder:text-slate-500"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-[#c3f937]">
                    <Mail className="w-5 h-5" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Password Input Group with Clear Spacing */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label
                  htmlFor="admin-password"
                  className="text-sm font-bold text-slate-200 text-right flex items-center justify-between"
                  style={{ margin: 0 }}
                >
                  <span>كلمة المرور</span>
                  <span
                    className="font-mono text-slate-400"
                    style={{
                      fontSize: "10px",
                      background: "rgba(255, 255, 255, 0.06)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    PASSWORD
                  </span>
                </label>
                <div className="relative group">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    dir="ltr"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة المرور"
                    style={{
                      height: "56px",
                      width: "100%",
                      borderRadius: "14px",
                      paddingLeft: "48px",
                      paddingRight: "18px",
                      background: "rgba(231, 237, 253, 0.05)",
                      border: "1px solid rgba(231, 237, 253, 0.14)",
                      fontSize: "15px",
                      color: "#ffffff",
                    }}
                    className="transition-all duration-200 focus:outline-none focus:border-[#c3f937] focus:bg-[#121624] focus:ring-4 focus:ring-[#c3f937]/20 group-hover:border-white/25 placeholder:text-slate-500"
                  />
                  {/* Eye Toggle Inside Field on left */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors focus:outline-none focus:text-[#c3f937] cursor-pointer"
                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                    aria-pressed={showPassword}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Eye className="w-5 h-5" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </div>

              {/* ── Dynamic Action Button with Shimmer Sweep ── */}
              <div style={{ paddingTop: "8px" }}>
                <motion.button
                  whileHover={{ scale: 1.018, filter: "brightness(1.06)" }}
                  whileTap={{ scale: 0.982 }}
                  type="submit"
                  disabled={loading}
                  style={{
                    height: "58px",
                    width: "100%",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #c3f937 0%, #a8e520 100%)",
                    color: "#0c1018",
                    boxShadow: "0 12px 28px -6px rgba(52, 21, 95, 0.4), 0 0 24px rgba(195, 249, 55, 0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "12px",
                    fontSize: "16px",
                    fontWeight: "800",
                    cursor: "pointer",
                    border: "none",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  className="transition-all duration-200 hover:shadow-[0_0_36px_rgba(195,249,55,0.55)] disabled:opacity-50 disabled:pointer-events-none group"
                >
                  {/* Subtle Light Sweep Effect across button on hover */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

                  {loading ? (
                    <>
                      <span className="w-5 h-5 border-2.5 border-[#0c1018] border-t-transparent rounded-full animate-spin" />
                      <span>جارٍ التحقق والدخول...</span>
                    </>
                  ) : (
                    <>
                      <span>الدخول إلى لوحة التحكم</span>
                      <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1.5" aria-hidden="true" />
                    </>
                  )}
                </motion.button>
              </div>
            </form>

            {/* ── Card Footer with Clean Separator and Comfortable Spacing ── */}
            <div
              className="flex flex-col sm:flex-row items-center justify-between text-xs"
              style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                paddingTop: "24px",
                gap: "16px",
              }}
            >
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-slate-400 hover:text-[#c3f937] transition-colors focus:outline-none font-semibold cursor-pointer"
                style={{ background: "none", border: "none", padding: 0 }}
              >
                نسيت كلمة المرور؟
              </button>

              <Link
                href="/"
                className="text-slate-400 hover:text-white transition-colors inline-flex items-center font-medium group"
                style={{ gap: "6px" }}
              >
                <span>العودة إلى الموقع الرئيسي</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </motion.section>
      </main>

      {/* ── FORGOT PASSWORD MODAL (MATCHING GAMING AESTHETIC) ─────────── */}
      <AnimatePresence>
        {showForgotModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
            style={{ padding: "20px" }}
            dir="rtl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.25 }}
              className="w-full relative overflow-hidden"
              style={{
                maxWidth: "460px",
                padding: "36px 32px",
                borderRadius: "28px",
                background: "linear-gradient(155deg, rgba(25, 29, 45, 0.98) 0%, rgba(14, 18, 28, 0.98) 100%)",
                border: "1px solid rgba(231, 237, 253, 0.16)",
                boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.75), 0 0 30px rgba(195, 249, 55, 0.15)",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
              }}
            >
              {/* Modal Top Bar */}
              <div
                className="flex items-center justify-between"
                style={{
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                  paddingBottom: "16px",
                }}
              >
                <div className="flex items-center" style={{ gap: "10px" }}>
                  <div
                    className="rounded-xl flex items-center justify-center"
                    style={{
                      width: "36px",
                      height: "36px",
                      background: "rgba(195, 249, 55, 0.15)",
                      border: "1px solid rgba(195, 249, 55, 0.3)",
                    }}
                  >
                    <KeyRound className="w-4.5 h-4.5 text-[#c3f937]" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-white" style={{ margin: 0 }}>استعادة كلمة المرور</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="إغلاق"
                >
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>

              {resetSuccess ? (
                <div
                  className="rounded-2xl text-right"
                  style={{
                    padding: "20px",
                    background: "rgba(195, 249, 55, 0.1)",
                    border: "1px solid rgba(195, 249, 55, 0.35)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <div className="flex items-center text-[#c3f937] font-bold text-sm" style={{ gap: "8px" }}>
                    <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
                    <span>تم إرسال رابط الاستعادة بنجاح!</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed" style={{ margin: 0 }}>
                    إذا كان البريد مسجلاً بحساب إداري مصرح، ستصلك رسالة تحتوي على رابط آمن لإعادة تعيين كلمة المرور.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotModal(false);
                      setResetSuccess(false);
                    }}
                    className="w-full text-white text-xs font-bold transition-colors cursor-pointer"
                    style={{
                      marginTop: "12px",
                      padding: "12px",
                      borderRadius: "12px",
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "none",
                    }}
                  >
                    إغلاق
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleForgotPassword}
                  style={{ display: "flex", flexDirection: "column", gap: "20px" }}
                >
                  <p className="text-sm text-slate-300 leading-relaxed text-right" style={{ margin: 0 }}>
                    أدخل بريدك الإلكتروني المسجل في لوحة الإدارة وسنرسل لك رابطًا آمنًا لإعادة تعيين كلمة المرور:
                  </p>

                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    style={{
                      width: "100%",
                      height: "52px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "12px",
                      padding: "0 16px",
                      fontSize: "14px",
                      color: "#ffffff",
                    }}
                    className="focus:outline-none focus:border-[#c3f937] focus:ring-2 focus:ring-[#c3f937]/15 placeholder:text-slate-500"
                  />

                  {resetError && (
                    <div
                      className="rounded-xl text-rose-300 text-xs flex items-center"
                      style={{
                        padding: "12px",
                        background: "rgba(244, 63, 94, 0.1)",
                        border: "1px solid rgba(244, 63, 94, 0.3)",
                        gap: "8px",
                      }}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{resetError}</span>
                    </div>
                  )}

                  <div
                    className="flex justify-end"
                    style={{
                      gap: "12px",
                      paddingTop: "12px",
                      borderTop: "1px solid rgba(255, 255, 255, 0.1)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      disabled={forgotLoading}
                      className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
                      style={{ padding: "10px 16px", background: "none", border: "none" }}
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="text-xs font-bold text-[#0c1018] rounded-xl transition-all shadow-md shadow-[#c3f937]/20 disabled:opacity-50 cursor-pointer"
                      style={{
                        padding: "10px 20px",
                        background: "#c3f937",
                        border: "none",
                      }}
                    >
                      {forgotLoading ? "جارٍ الإرسال..." : "إرسال الرابط"}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
