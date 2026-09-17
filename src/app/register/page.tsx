"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useRegistrationStatus } from "@/context/RegistrationStatusContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import RegistrationForm from "@/components/registration/RegistrationForm";
import RegistrationSupport from "@/components/registration/RegistrationSupport";
import PixelDecoration from "@/components/PixelDecoration";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const { locale } = useLanguage();
  const ar = locale === "ar";
  const { isOpen, isLoading, isError, refetch } = useRegistrationStatus();

  return (
    <div className="reg-page">
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[50rem] h-[24rem] bg-primary/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[30rem] h-[18rem] bg-lime/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Header */}
      <header className="reg-page-header">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="BUILDx — العودة للرئيسية">
            <Image src="/assets/logos/logo-white-glow.png" alt="BUILDx" width={100} height={36} className="object-contain" />
          </Link>
          <Link
            href="/"
            className="reg-header-home-btn"
            title={ar ? "العودة إلى الصفحة الرئيسية" : "Back to Home"}
          >
            <span>{ar ? "← العودة للرئيسية" : "← Back to Home"}</span>
          </Link>
        </div>

        <LanguageSwitcher />
      </header>

      {/* Main content */}
      <main className="reg-page-main" id="main-content">
        {isLoading ? (
          <div className="p-8 sm:p-12 text-center bg-[#121622]/90 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl max-w-md mx-auto space-y-4 animate-pulse">
            <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto" />
            <p className="text-sm text-slate-300 font-medium">
              {ar ? "جارٍ التحقق من حالة التسجيل…" : "Checking registration status…"}
            </p>
          </div>
        ) : isError ? (
          <div className="p-8 sm:p-12 text-center bg-[#121622]/90 border border-red-500/30 rounded-3xl shadow-2xl backdrop-blur-xl max-w-md mx-auto space-y-5">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto text-xl">
              ⚠️
            </div>
            <h2 className="text-lg font-bold text-white">
              {ar ? "تعذر التحقق من حالة التسجيل" : "Failed to verify registration status"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {ar
                ? "تعذر التحقق من حالة التسجيل حاليًا. حاول مرة أخرى بعد قليل."
                : "Unable to verify registration status at this moment. Please try again shortly."}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10"
              >
                {ar ? "إعادة المحاولة" : "Retry"}
              </button>
            </div>
          </div>
        ) : isOpen === false ? (
          <div className="p-8 sm:p-12 text-center bg-[#121622]/95 border border-red-500/20 rounded-3xl shadow-2xl backdrop-blur-xl max-w-xl mx-auto space-y-6">
            <div className="relative w-36 h-36 mx-auto">
              <Image
                src="/assets/characters/thinking-closed.png"
                alt={ar ? "التسجيل مغلق" : "Registration Closed"}
                fill
                className="object-contain drop-shadow-[0_10px_25px_rgba(244,63,94,0.15)]"
                priority
              />
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-rose-500/10 border border-rose-500/25 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{ar ? "التسجيل مغلق" : "Registration Closed"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white font-bauhaus">
              {ar ? "تم إغلاق التسجيل" : "Registration is Closed"}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-md mx-auto">
              {ar
                ? "نعتذر، تم إغلاق التسجيل في معسكر BUILDx ولم يعد استقبال الطلبات متاحًا حاليًا."
                : "We apologize, registration for BUILDx camp is now closed and applications are no longer being accepted."}
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-lime text-dark-base font-bold text-sm hover:bg-lime/90 transition-all shadow-lg shadow-lime/20"
              >
                {ar ? "← العودة إلى الصفحة الرئيسية" : "← Back to Homepage"}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="reg-notice-banner" role="status" aria-live="polite">
              <span className="w-2 h-2 rounded-full bg-lime animate-ping shrink-0" aria-hidden="true" />
              <span>
                {ar
                  ? "تنويه: يُغلق باب التسجيل يوم 21 سبتمبر في تمام الساعة 6:00 مساءً"
                  : "Notice: Registration closes on September 21 at 6:00 PM"}
              </span>
            </div>
            <RegistrationForm />
          </>
        )}
        <RegistrationSupport />
      </main>

      {/* Decorations */}
      <div className="absolute top-32 left-6 hidden lg:block pointer-events-none">
        <PixelDecoration variant="3" color="volt" size={28} opacity={0.1} animate />
      </div>
      <div className="absolute bottom-32 right-6 hidden lg:block pointer-events-none">
        <PixelDecoration variant="2" color="pink" size={24} opacity={0.08} />
      </div>
    </div>
  );
}
