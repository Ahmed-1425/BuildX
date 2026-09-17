"use client";

import { useLanguage } from "@/context/LanguageContext";
import { useRegistrationStatus } from "@/context/RegistrationStatusContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import RegistrationForm from "@/components/registration/RegistrationForm";
import RegistrationSupport from "@/components/registration/RegistrationSupport";
import ClosedRegistrationExperience from "@/components/registration/ClosedRegistrationExperience";
import PixelDecoration from "@/components/PixelDecoration";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const { locale } = useLanguage();
  const ar = locale === "ar";
  const { isOpen, isLoading, isError, refetch } = useRegistrationStatus();

  return (
    <div className={`reg-page ${isOpen === false ? "is-closed-view" : ""}`}>
      {/* Background tech grid overlay */}
      <div className="absolute inset-0 grid-bg opacity-5 pointer-events-none" />

      {/* Header */}
      <header className="reg-page-header">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/" className="flex items-center gap-2" aria-label="BUILDx — العودة للرئيسية">
            <Image
              src="/assets/logos/logo-white-glow.png"
              alt="BUILDx"
              width={105}
              height={34}
              className="object-contain"
              priority
            />
          </Link>
          <Link
            href="/"
            className="reg-header-home-btn"
            title={ar ? "العودة إلى الصفحة الرئيسية" : "Back to Home"}
          >
            <span>{ar ? "← العودة للرئيسية" : "← Back to Home"}</span>
          </Link>
        </div>

        <LanguageSwitcher variant="subtle" />
      </header>

      {/* Main Content Area */}
      {isLoading ? (
        <main className="reg-page-main flex items-center justify-center min-h-[60vh]" id="main-content">
          <div className="p-8 sm:p-12 text-center bg-[#121622]/90 border border-white/10 rounded-3xl shadow-2xl backdrop-blur-xl max-w-md mx-auto space-y-4 animate-pulse">
            <div className="w-12 h-12 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto" />
            <p className="text-sm text-slate-300 font-medium">
              {ar ? "جارٍ التحقق من حالة التسجيل…" : "Checking registration status…"}
            </p>
          </div>
        </main>
      ) : isError ? (
        <main className="reg-page-main flex items-center justify-center min-h-[60vh]" id="main-content">
          <div className="p-8 sm:p-12 text-center bg-[#121622]/90 border border-red-500/30 rounded-3xl shadow-2xl backdrop-blur-xl max-w-md mx-auto space-y-5">
            <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto text-xl font-bold">
              !
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
        </main>
      ) : isOpen === false ? (
        /* Redesigned Full-Screen Status Experience */
        <main id="main-content">
          <ClosedRegistrationExperience />
        </main>
      ) : (
        /* Standard Open Registration Form */
        <main className="reg-page-main" id="main-content">
          <div className="reg-notice-banner" role="status" aria-live="polite">
            <span className="w-2 h-2 rounded-full bg-lime animate-ping shrink-0" aria-hidden="true" />
            <span>
              {ar
                ? "تنويه: يُغلق باب التسجيل يوم 21 سبتمبر في تمام الساعة 6:00 مساءً"
                : "Notice: Registration closes on September 21 at 6:00 PM"}
            </span>
          </div>
          <RegistrationForm />
          <RegistrationSupport />
        </main>
      )}

      {/* Subtle corner decorations (only when open form is active, avoided in closed state) */}
      {isOpen === true && (
        <>
          <div className="absolute top-32 left-6 hidden lg:block pointer-events-none">
            <PixelDecoration variant="3" color="volt" size={28} opacity={0.08} animate />
          </div>
          <div className="absolute bottom-32 right-6 hidden lg:block pointer-events-none">
            <PixelDecoration variant="2" color="pink" size={24} opacity={0.06} />
          </div>
        </>
      )}
    </div>
  );
}
