"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  X,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

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

      // Successful login -> Redirect to admin dashboard
      router.push("/admin");
      router.refresh();
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
      className="admin-bg min-h-[100dvh] w-full flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative select-none font-janna"
      dir="rtl"
    >
      {/* Centered Gateway Container */}
      <main className="w-full max-w-[1120px] my-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(390px,460px)] items-center gap-8 lg:gap-14 relative z-10">
        
        {/* ── RIGHT COLUMN (in RTL): Visual Brand & Perks ───────── */}
        <section className="hidden lg:flex flex-col items-start space-y-6 transition-all duration-300">
          {/* Brand Logo */}
          <Link
            href="/"
            className="inline-block hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#c3f937] rounded-2xl"
            aria-label="العودة للصفحة الرئيسية"
          >
            <Image
              src="/assets/logos/logo-white-glow.png"
              alt="BUILDx"
              width={240}
              height={82}
              priority
              className="w-[220px] xl:w-[250px] h-auto object-contain"
            />
          </Link>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase bg-[#c3f937]/10 text-[#c3f937] border border-[#c3f937]/30 shadow-[0_0_15px_rgba(195,249,55,0.12)]">
            <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" />
            <span>بوابة الإدارة</span>
          </div>

          {/* Title & Description */}
          <div className="space-y-3">
            <h1 className="text-3xl xl:text-4xl font-bold text-white tracking-tight leading-snug">
              مركز قيادة BUILDx
            </h1>
            <p className="text-base text-slate-300 max-w-lg leading-relaxed">
              أدر طلبات التسجيل، راجع المتقدمين، واتخذ قرارات القبول من مساحة واحدة.
            </p>
          </div>

          {/* Pixel Character with Ambient Glow */}
          <div className="relative pt-2 pb-1 flex items-center justify-start">
            {/* Multi-color ambient aura */}
            <div
              className="absolute w-56 h-36 -right-4 top-2 rounded-full blur-3xl pointer-events-none opacity-40"
              style={{
                background:
                  "radial-gradient(circle, rgba(195,249,55,0.3) 0%, rgba(251,80,195,0.25) 50%, rgba(52,21,95,0.4) 100%)",
              }}
              aria-hidden="true"
            />
            <div className="relative z-10 flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md">
              <Image
                src="/assets/characters/char-ready.png"
                alt="BUILDx Character"
                width={72}
                height={72}
                className="w-16 h-16 object-contain image-pixelated drop-shadow-[0_0_12px_rgba(195,249,55,0.35)]"
                priority
              />
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-[#c3f937] uppercase tracking-wider block">
                  COMMAND READY
                </span>
                <span className="text-xs text-slate-300">
                  لوحة تفاعلية متصلة لحظيًا
                </span>
              </div>
            </div>
          </div>

          {/* 3 Concise Feature Pills */}
          <div className="grid grid-cols-3 gap-3 w-full max-w-md pt-2">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-center space-y-1">
              <ShieldCheck className="w-4 h-4 text-[#c3f937] mx-auto" aria-hidden="true" />
              <span className="text-xs font-bold text-slate-200 block">إدارة آمنة</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-center space-y-1">
              <RefreshCw className="w-4 h-4 text-[#fb50c3] mx-auto" aria-hidden="true" />
              <span className="text-xs font-bold text-slate-200 block">تحديث مباشر</span>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 text-center space-y-1">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 mx-auto" aria-hidden="true" />
              <span className="text-xs font-bold text-slate-200 block">مراجعة منظمة</span>
            </div>
          </div>
        </section>

        {/* ── MOBILE HEADER (<1024px) ───────── */}
        <div className="lg:hidden flex flex-col items-center text-center space-y-3 mb-2">
          <Link href="/" className="inline-block" aria-label="العودة للصفحة الرئيسية">
            <Image
              src="/assets/logos/logo-white-glow.png"
              alt="BUILDx"
              width={170}
              height={58}
              priority
              className="w-[160px] sm:w-[180px] h-auto object-contain"
            />
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-[#c3f937]/10 text-[#c3f937] border border-[#c3f937]/30">
            <ShieldCheck className="w-3 h-3" aria-hidden="true" />
            <span>بوابة الإدارة</span>
          </span>
        </div>

        {/* ── LEFT COLUMN (in RTL): Premium Glass Login Card ──────── */}
        <section className="w-full flex justify-center lg:justify-end">
          <div
            className="w-full max-w-[460px] p-6 sm:p-9 rounded-[28px] relative overflow-hidden transition-all duration-300"
            style={{
              background: "rgba(20, 22, 34, 0.74)",
              backdropFilter: "blur(22px)",
              WebkitBackdropFilter: "blur(22px)",
              border: "1px solid rgba(231, 237, 253, 0.12)",
              boxShadow: "0 24px 60px rgba(0, 0, 0, 0.35)",
            }}
          >
            {/* Top Highlight Gradient: أخضر ← وردي ← بنفسجي */}
            <div
              className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none"
              style={{
                background: "linear-gradient(90deg, #c3f937 0%, #fb50c3 50%, #34155f 100%)",
              }}
              aria-hidden="true"
            />

            {/* Card Header */}
            <div className="mb-6 space-y-2 text-right">
              <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-3">
                <Lock className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                تسجيل دخول الإدارة
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                أدخل بيانات حسابك المصرح للوصول إلى لوحة التحكم.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div
                role="alert"
                className="mb-5 p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" aria-hidden="true" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="admin-email"
                  className="block text-xs sm:text-sm font-semibold text-slate-200 text-right mb-2"
                >
                  البريد الإلكتروني
                </label>
                <div className="relative">
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
                      borderRadius: "14px",
                      paddingLeft: "48px",
                      paddingRight: "16px",
                      background: "rgba(231, 237, 253, 0.055)",
                      border: "1px solid rgba(231, 237, 253, 0.13)",
                      fontSize: "16px",
                    }}
                    className="w-full text-white placeholder:text-slate-500 transition-all focus:outline-none focus:border-[#c3f937] focus:ring-4 focus:ring-[#c3f937]/10"
                  />
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                    <Mail className="w-5 h-5" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="admin-password"
                  className="block text-xs sm:text-sm font-semibold text-slate-200 text-right mb-2"
                >
                  كلمة المرور
                </label>
                <div className="relative">
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
                      borderRadius: "14px",
                      paddingLeft: "48px",
                      paddingRight: "16px",
                      background: "rgba(231, 237, 253, 0.055)",
                      border: "1px solid rgba(231, 237, 253, 0.13)",
                      fontSize: "16px",
                    }}
                    className="w-full text-white placeholder:text-slate-500 transition-all focus:outline-none focus:border-[#c3f937] focus:ring-4 focus:ring-[#c3f937]/10"
                  />
                  {/* Eye Toggle Inside Field on left */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white transition-colors focus:outline-none focus:text-[#c3f937]"
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  height: "56px",
                  borderRadius: "14px",
                  background: "#c3f937",
                  color: "#0c1018",
                  fontWeight: 800,
                  boxShadow: "0 10px 25px -5px rgba(52, 21, 95, 0.4), 0 0 15px rgba(195, 249, 55, 0.25)",
                }}
                className="w-full text-base transition-all duration-150 active:translate-y-0.5 hover:brightness-105 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-6 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-5 h-5 border-2 border-[#0c1018] border-t-transparent rounded-full animate-spin" />
                    <span>جارٍ تسجيل الدخول...</span>
                  </>
                ) : (
                  <span>الدخول إلى لوحة التحكم</span>
                )}
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-slate-400 hover:text-[#c3f937] transition-colors focus:outline-none"
              >
                نسيت كلمة المرور؟
              </button>
              <Link
                href="/"
                className="text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
              >
                <span>العودة إلى الموقع الرئيسي</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          dir="rtl"
        >
          <div
            className="w-full max-w-md p-6 sm:p-8 rounded-3xl space-y-5 relative"
            style={{
              background: "rgba(20, 22, 34, 0.95)",
              border: "1px solid rgba(231, 237, 253, 0.15)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
            }}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#c3f937]" aria-hidden="true" />
                <h3 className="text-lg font-bold text-white">استعادة كلمة المرور</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            {resetSuccess ? (
              <div className="p-4 rounded-2xl bg-[#c3f937]/10 border border-[#c3f937]/30 text-right space-y-2">
                <div className="flex items-center gap-2 text-[#c3f937] font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  <span>تم إرسال الرابط بنجاح!</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  إذا كان البريد مسجلاً بحساب إداري، ستصلك رسالة تحتوي على رابط آمن لإعادة تعيين كلمة المرور.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setResetSuccess(false);
                  }}
                  className="mt-3 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-colors"
                >
                  إغلاق
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <p className="text-xs text-slate-300 leading-relaxed text-right">
                  أدخل بريدك الإلكتروني المسجل في لوحة الإدارة وسنرسل لك رابطًا لاستعادة كلمة المرور عبر Supabase Auth:
                </p>

                <div>
                  <input
                    type="email"
                    required
                    dir="ltr"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-12 bg-white/[0.04] border border-white/15 rounded-xl px-4 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c3f937]"
                  />
                </div>

                {resetError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                    <span>{resetError}</span>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    disabled={forgotLoading}
                    className="px-4 py-2.5 text-xs text-slate-400 hover:text-white transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-5 py-2.5 text-xs font-bold bg-[#c3f937] hover:bg-[#c3f937]/90 text-[#0c1018] rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    {forgotLoading ? "جارٍ الإرسال..." : "إرسال رابط الاستعادة"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
