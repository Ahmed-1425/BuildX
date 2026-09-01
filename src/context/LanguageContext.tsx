"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ar } from "@/i18n/ar";
import { en } from "@/i18n/en";

type Locale = "ar" | "en";
type Translations = typeof ar;

interface LanguageContextType {
  locale: Locale;
  t: Translations;
  dir: "rtl" | "ltr";
  toggleLocale: () => void;
  setLocale: (locale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Locale, Translations> = { ar, en };

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ar");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("buildx-locale") as Locale | null;
    if (saved && (saved === "ar" || saved === "en")) {
      setLocaleState(saved);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    document.documentElement.dir = dir;
    localStorage.setItem("buildx-locale", locale);
  }, [locale, mounted]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === "ar" ? "en" : "ar"));
  }, []);

  const t = translations[locale];
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ locale, t, dir, toggleLocale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
