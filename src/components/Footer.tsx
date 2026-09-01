"use client";

import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import PixelDecoration from "./PixelDecoration";

export default function Footer() {
  const { t, locale } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="relative py-12 overflow-hidden border-t-3 border-primary/20">
      <div className="absolute inset-0 bg-gradient-to-t from-dark-secondary/20 to-dark" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <Image
            src="/assets/logos/logo-white-slogan.png"
            alt="BUILDx"
            width={180}
            height={50}
            className="object-contain mb-4"
          />

          {/* Slogan */}
          <p
            className="text-sm text-light/50 mb-6"
            style={{ fontFamily: "var(--font-janna)" }}
          >
            {t.footer.slogan}
          </p>

          {/* Divider */}
          <div className="section-divider w-48 mb-6" />

          {/* Copyright */}
          <p
            className="text-xs text-light/30"
            style={{ fontFamily: "var(--font-janna)" }}
          >
            © {year} BUILDx. {t.footer.rights}.
          </p>
        </div>

        {/* Pixel decorations */}
        <div className="absolute bottom-4 left-4">
          <PixelDecoration variant="1" color="volt" size={16} opacity={0.1} />
        </div>
        <div className="absolute bottom-4 right-4">
          <PixelDecoration variant="2" color="pink" size={16} opacity={0.08} />
        </div>
      </div>
    </footer>
  );
}
