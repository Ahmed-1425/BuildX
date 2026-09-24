"use client";

import { useState, useCallback, useEffect } from "react";
import { EVENT_INFO, generateICS } from "../agenda-data";

export default function AgendaActions() {
  const [copied, setCopied] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("https://buildx.tiqanah.org/agenda");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = "https://buildx.tiqanah.org/agenda";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const downloadICS = useCallback(() => {
    const icsContent = generateICS();
    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "buildx-closing-ceremony.ics";
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      {/* Action buttons bar */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8 py-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/* Copy Link */}
          <button
            type="button"
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#151a27] border border-light/8 text-light/70 text-sm hover:border-lime/30 hover:text-lime transition-all duration-200 min-h-[44px] cursor-pointer"
            style={{ fontFamily: "var(--font-janna-bold)" }}
          >
            <span>{copied ? "✓" : "🔗"}</span>
            <span>{copied ? "تم النسخ!" : "نسخ رابط الأجندة"}</span>
          </button>

          {/* Add to Calendar */}
          <button
            type="button"
            onClick={downloadICS}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#151a27] border border-light/8 text-light/70 text-sm hover:border-pink/30 hover:text-pink transition-all duration-200 min-h-[44px] cursor-pointer"
            style={{ fontFamily: "var(--font-janna-bold)" }}
          >
            <span>📅</span>
            <span>أضف إلى التقويم</span>
          </button>

          {/* Google Maps */}
          <a
            href={EVENT_INFO.mapUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#151a27] border border-light/8 text-light/70 text-sm hover:border-lime/30 hover:text-lime transition-all duration-200 min-h-[44px]"
            style={{ fontFamily: "var(--font-janna-bold)" }}
          >
            <span>📍</span>
            <span>افتح الموقع في Google Maps</span>
          </a>
        </div>
      </section>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-12 h-12 bg-dark/90 border border-lime/30 text-lime text-lg shadow-[3px_3px_0px_0px_#34155f] hover:bg-lime/10 hover:shadow-[0_0_15px_rgba(195,249,55,0.3)] transition-all duration-200 cursor-pointer backdrop-blur-sm"
          aria-label="العودة إلى أعلى الصفحة"
          style={{ fontFamily: "var(--font-arapix)" }}
        >
          ▲
        </button>
      )}
    </>
  );
}
