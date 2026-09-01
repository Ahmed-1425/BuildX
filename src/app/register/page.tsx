"use client";

import { useLanguage } from "@/context/LanguageContext";
import RegistrationFormPlaceholder from "@/components/RegistrationFormPlaceholder";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import PixelDecoration from "@/components/PixelDecoration";
import Image from "next/image";
import Link from "next/link";

export default function RegisterPage() {
  const { t, locale } = useLanguage();

  return (
    <div className="min-h-screen bg-dark relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-4">
        <Link href="/">
          <Image
            src="/assets/logos/logo-white-glow.png"
            alt="BUILDx"
            width={100}
            height={36}
            className="object-contain"
          />
        </Link>
        <LanguageSwitcher />
      </header>

      {/* Content */}
      <main className="relative z-10 flex flex-col items-center justify-center px-4 py-12 min-h-[calc(100vh-80px)]">
        <h1
          className="text-3xl sm:text-4xl text-light text-center mb-8"
          style={{ fontFamily: locale === "ar" ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
        >
          {t.register.title}
        </h1>

        <RegistrationFormPlaceholder />

        <Link
          href="/"
          className="pixel-btn pixel-btn-secondary text-sm py-2 px-6 mt-8"
        >
          {t.register.backHome}
        </Link>
      </main>

      {/* Pixel decorations */}
      <div className="absolute top-20 left-8 hidden sm:block">
        <PixelDecoration variant="3" color="volt" size={32} opacity={0.12} animate />
      </div>
      <div className="absolute bottom-20 right-8 hidden sm:block">
        <PixelDecoration variant="2" color="pink" size={28} opacity={0.1} />
      </div>
      <div className="absolute top-1/2 right-4 hidden lg:block">
        <PixelDecoration variant="1" color="volt" size={20} opacity={0.08} />
      </div>
    </div>
  );
}
