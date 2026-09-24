"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { MapPin, Calendar, Copy, ArrowUp, Check } from "lucide-react";
import { EVENT_INFO, generateICS } from "../agenda-data";

export default function AgendaClosing() {
  const [copied, setCopied] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 800);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("https://buildx.tiqanah.org/agenda");
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const input = document.createElement("input");
      input.value = "https://buildx.tiqanah.org/agenda";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }, []);

  const downloadICS = useCallback(() => {
    const blob = new Blob([generateICS()], { type: "text/calendar;charset=utf-8" });
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
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-20 lg:py-28">
        <div className="relative bg-[#131720] border border-light/5 p-8 sm:p-12 lg:p-16 overflow-hidden">
          {/* Background glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-lime/4 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-pink/4 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Characters group */}
            <div className="flex items-end justify-center gap-2 sm:gap-4 mb-8">
              <Image src="/images/agenda/characters/thinking.png" alt="" width={56} height={56} className="w-10 h-10 sm:w-14 sm:h-14 object-contain image-pixelated opacity-50" />
              <Image src="/images/agenda/characters/success.png" alt="" width={72} height={72} className="w-14 h-14 sm:w-18 sm:h-18 object-contain image-pixelated opacity-70" />
              <Image src="/images/agenda/characters/building.png" alt="" width={56} height={56} className="w-10 h-10 sm:w-14 sm:h-14 object-contain image-pixelated opacity-50" />
            </div>

            {/* Quote */}
            <h2
              className="text-light font-bold mb-4 leading-tight"
              style={{
                fontFamily: "var(--font-news-almstqbl)",
                fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
              }}
            >
              نلتقي لنحتفي بما بُني… ونبدأ ما سيأتي.
            </h2>

            {/* Logos */}
            <div className="flex items-center gap-6 mb-10">
              <Image
                src="/assets/logos/logo-white-glow.png"
                alt="BUILDx"
                width={120}
                height={34}
                className="w-28 sm:w-32 h-auto object-contain opacity-60"
              />
              <span className="w-[1px] h-6 bg-light/10" />
              <Image
                src="/images/agenda/partners/t2-business-logo.png"
                alt="T2 Business"
                width={36}
                height={36}
                className="w-8 sm:w-9 h-auto object-contain opacity-40"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-3xl">
              <a
                href={EVENT_INFO.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 px-6 py-4 bg-dark border-2 border-light/10 text-light hover:border-lime hover:text-lime transition-all min-h-[56px] flex-1 cursor-pointer"
                style={{ fontFamily: "var(--font-janna-bold)", fontSize: "clamp(0.95rem, 1.1vw, 1.1rem)" }}
              >
                <MapPin className="w-5 h-5 shrink-0" />
                <span>افتح الموقع في Google Maps</span>
              </a>

              <button
                type="button"
                onClick={downloadICS}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-dark border-2 border-light/10 text-light hover:border-pink hover:text-pink transition-all min-h-[56px] flex-1 cursor-pointer"
                style={{ fontFamily: "var(--font-janna-bold)", fontSize: "clamp(0.95rem, 1.1vw, 1.1rem)" }}
              >
                <Calendar className="w-5 h-5 shrink-0" />
                <span>أضف الحفل إلى التقويم</span>
              </button>

              <button
                type="button"
                onClick={copyLink}
                className="flex items-center justify-center gap-3 px-6 py-4 bg-dark border-2 border-light/10 text-light hover:border-lime hover:text-lime transition-all min-h-[56px] flex-1 cursor-pointer"
                style={{ fontFamily: "var(--font-janna-bold)", fontSize: "clamp(0.95rem, 1.1vw, 1.1rem)" }}
              >
                {copied ? <Check className="w-5 h-5 shrink-0 text-lime" /> : <Copy className="w-5 h-5 shrink-0" />}
                <span>{copied ? "تم النسخ!" : "انسخ رابط الأجندة"}</span>
              </button>
            </div>

            {/* Back to top */}
            <button
              type="button"
              onClick={scrollToTop}
              className="mt-10 flex items-center gap-2 text-light/20 text-sm hover:text-light/50 transition-colors cursor-pointer"
              style={{ fontFamily: "var(--font-janna)" }}
            >
              <ArrowUp className="w-4 h-4" />
              <span>العودة إلى أعلى الصفحة</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 space-y-2">
          <p className="text-light/15 text-xs" style={{ fontFamily: "var(--font-arapix)" }}>
            BUILDx CLOSING CEREMONY — 2026
          </p>
          <p className="text-light/10 text-xs" style={{ fontFamily: "var(--font-janna)" }}>
            هذه الصفحة مخصصة لضيوف الحفل الختامي فقط.
          </p>
        </div>
      </section>

      {/* Fixed back to top */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-12 h-12 bg-dark/90 border border-lime/20 text-lime shadow-[3px_3px_0px_0px_#34155f] hover:bg-lime/10 hover:shadow-[0_0_12px_rgba(195,249,55,0.3)] transition-all cursor-pointer backdrop-blur-sm"
          aria-label="العودة إلى أعلى الصفحة"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
