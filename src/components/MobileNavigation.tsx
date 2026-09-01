"use client";

import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

export default function MobileHeader() {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${
        scrolled
          ? "bg-dark/95 backdrop-blur-sm pixel-border-b"
          : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-4 h-14">
        <Link href="/">
          <Image
            src="/assets/logos/logo-white-glow.png"
            alt="BUILDx"
            width={80}
            height={28}
            className="object-contain"
            priority
          />
        </Link>
        <LanguageSwitcher />
      </div>
    </header>
  );
}

export function MobileBottomNavigation() {
  const { t, locale } = useLanguage();
  const [visible, setVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const lastScrollY = useRef(0);
  const [nearBottom, setNearBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const atNearBottom = currentScrollY > docHeight - 200;

      setNearBottom(atNearBottom);

      if (atNearBottom) {
        setVisible(true);
      } else if (currentScrollY < 100) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current + 10) {
        setVisible(false);
      } else if (currentScrollY < lastScrollY.current - 10) {
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;

      // Active section detection
      const sections = ["about", "journey", "register"];
      let found = false;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sections[i] === "about" ? "about" : sections[i]);
            found = true;
            break;
          }
        }
      }
      if (!found) setActiveSection("home");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const items = [
    {
      key: "home",
      label: t.nav.home,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path d="M2 8L10 2L18 8V18H13V12H7V18H2V8Z" />
        </svg>
      ),
    },
    {
      key: "about",
      label: t.nav.aboutCamp,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <rect x="3" y="3" width="14" height="14" rx="0" />
          <rect x="6" y="7" width="8" height="2" fill="#0c1018" />
          <rect x="6" y="11" width="5" height="2" fill="#0c1018" />
        </svg>
      ),
    },
    {
      key: "journey",
      label: t.nav.journey,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <rect x="2" y="4" width="4" height="4" />
          <rect x="8" y="8" width="4" height="4" />
          <rect x="14" y="12" width="4" height="4" />
          <rect x="5" y="7" width="4" height="2" />
          <rect x="11" y="11" width="4" height="2" />
        </svg>
      ),
    },
    {
      key: "register",
      label: t.nav.register,
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <rect x="3" y="2" width="14" height="16" rx="0" />
          <rect x="6" y="5" width="8" height="2" fill="#0c1018" />
          <rect x="6" y="9" width="6" height="2" fill="#0c1018" />
          <rect x="6" y="13" width="4" height="2" fill="#0c1018" />
        </svg>
      ),
      isRegister: true,
    },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 safe-area-bottom ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="bg-dark/95 backdrop-blur-sm border-t-3 border-primary/40">
        <div className="flex items-center justify-around py-2 px-2">
          {items.map((item) => {
            const isActive = activeSection === item.key;
            const isReg = item.isRegister;

            return (
              <button
                key={item.key}
                onClick={() =>
                  isReg
                    ? (window.location.href = "/register")
                    : scrollTo(item.key)
                }
                className={`flex flex-col items-center justify-center py-1 px-3 min-w-[60px] transition-colors cursor-pointer ${
                  isReg
                    ? "text-dark"
                    : isActive
                    ? "text-lime"
                    : "text-light/50"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <div
                  className={`p-1.5 rounded-none ${
                    isReg
                      ? "bg-lime border-2 border-lime shadow-[2px_2px_0px_0px_rgba(52,21,95,0.8)]"
                      : ""
                  }`}
                >
                  {item.icon}
                </div>
                <span
                  className={`text-[10px] mt-0.5 ${
                    isReg ? "text-lime font-bold" : ""
                  }`}
                  style={{ fontFamily: "var(--font-janna-bold)" }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
