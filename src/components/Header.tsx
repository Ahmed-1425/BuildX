"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Image from "next/image";
import Link from "next/link";

const NAV_SECTIONS = [
  { key: "about", id: "about" },
  { key: "objectives", id: "objectives" },
  { key: "outcomes", id: "outcomes" },
  { key: "trainer", id: "trainer" },
  { key: "journey", id: "journey" },
] as const;

export default function Header() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      const sections = NAV_SECTIONS.map((s) => s.id);
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150) {
            setActiveSection(sections[i]);
            return;
          }
        }
      }
      setActiveSection("");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:block ${
        scrolled
          ? "bg-dark/95 backdrop-blur-sm pixel-border-b"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/assets/logos/logo-white-glow.png"
            alt="BUILDx"
            width={100}
            height={36}
            className="object-contain"
            priority
          />
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1" role="navigation" aria-label="Main navigation">
          {NAV_SECTIONS.map((section) => (
            <button
              key={section.key}
              onClick={() => scrollToSection(section.id)}
              className={`px-3 py-2 text-sm transition-colors duration-200 cursor-pointer border-b-2 ${
                activeSection === section.id
                  ? "text-lime border-lime"
                  : "text-light/70 border-transparent hover:text-light hover:border-primary/40"
              }`}
              style={{ fontFamily: "var(--font-janna-bold)" }}
            >
              {t.nav[section.key as keyof typeof t.nav]}
            </button>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link
            href="/register"
            className="pixel-btn pixel-btn-primary text-sm py-2 px-5"
          >
            {t.nav.register}
          </Link>
        </div>
      </div>
    </header>
  );
}
