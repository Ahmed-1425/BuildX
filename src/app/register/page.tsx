"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import RegistrationForm from "@/components/registration/RegistrationForm";
import RegistrationSupport from "@/components/registration/RegistrationSupport";
import PixelDecoration from "@/components/PixelDecoration";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const { locale } = useLanguage();
  const ar = locale === "ar";
  const [isOpen, setIsOpen] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/camp/status");
        const data = await res.json();
        setIsOpen(data.registration_open);
      } catch {
        setIsOpen(true);
      }
    }
    checkStatus();
  }, []);

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
        {isOpen === false ? (
          <div className="p-8 sm:p-12 text-center bg-[#121622]/90 border border-primary/30 rounded-3xl shadow-2xl backdrop-blur-xl max-w-xl mx-auto space-y-5">
            <Image
              src="/assets/characters/char-thinking.png"
              alt="Closed"
              width={100}
              height={100}
              className="mx-auto"
            />
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-red-500/10 border border-red-500/30 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>{ar ? "التسجيل مغلق حاليًا" : "Registration Closed"}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-bauhaus">
              {ar ? "تم إغلاق باب التسجيل في معسكر BUILDx" : "Registration is Now Closed"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              {ar
                ? "شكرًا لاهتمامكم وشغفكم بالانضمام. لقد اكتملت المقاعد المتاحة لهذه النسخة من المعسكر. تابعونا لمعرفة الفعاليات والمعسكرات القادمة!"
                : "Thank you for your interest and passion. Applications for this cohort are now closed. Stay tuned for upcoming cohorts and events!"}
            </p>
            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-lime text-dark-base font-bold text-xs hover:bg-lime/90 transition-all shadow-lg shadow-lime/20"
              >
                {ar ? "← العودة إلى الصفحة الرئيسية" : "← Back to Homepage"}
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-6 mx-auto max-w-xl flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-2xl bg-lime/10 border border-lime/30 text-lime text-xs sm:text-sm font-bold text-center shadow-[0_0_15px_rgba(195,249,55,0.08)]">
              <span className="w-2 h-2 rounded-full bg-lime animate-ping shrink-0" />
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
