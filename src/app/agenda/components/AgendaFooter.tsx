"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { MapPin, Calendar, Copy, Check, ArrowUp } from "lucide-react";
import { EVENT_INFO, generateICS } from "../agenda-data";

export default function AgendaFooter() {
  const [copied, setCopied] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText("https://buildx.tiqanah.org/agenda");
    } catch {
      const inp = document.createElement("input");
      inp.value = "https://buildx.tiqanah.org/agenda";
      document.body.appendChild(inp);
      inp.select();
      document.execCommand("copy");
      document.body.removeChild(inp);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }, []);

  const downloadICS = useCallback(() => {
    const blob = new Blob([generateICS()], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "buildx-closing-ceremony.ics";
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const scrollTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const btnBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "14px 24px",
    background: "rgba(231,237,253,0.04)",
    border: "1px solid rgba(231,237,253,0.1)",
    color: "rgba(231,237,253,0.8)",
    fontFamily: "var(--font-janna,sans-serif)",
    fontWeight: 700,
    fontSize: "clamp(0.9rem,1.1vw,1rem)",
    cursor: "pointer",
    minHeight: "52px",
    boxSizing: "border-box",
    flex: "1 1 200px",
    transition: "border-color 0.2s,color 0.2s",
    textDecoration: "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
  };

  return (
    <>
      <footer
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "#0c0f18",
          borderTop: "1px solid rgba(231,237,253,0.06)",
          paddingTop: "clamp(48px,6vw,72px)",
          paddingBottom: "clamp(32px,4vw,48px)",
        }}
      >
        <div
          style={{
            maxWidth: "1360px",
            marginInline: "auto",
            paddingInline: "clamp(16px,4vw,48px)",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: "clamp(24px,3vw,36px)",
          }}
        >
          {/* Characters trio */}
          <div
            aria-hidden
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              gap: "clamp(8px,1.5vw,16px)",
            }}
          >
            {[
              { src: "/images/agenda/characters/thinking.png", size: 52 },
              { src: "/images/agenda/characters/success.png", size: 64 },
              { src: "/images/agenda/characters/building.png", size: 52 },
            ].map(({ src, size }) => (
              <Image
                key={src}
                src={src}
                alt=""
                width={size}
                height={size}
                style={{
                  width: `clamp(${size * 0.7}px,${size * 0.08}vw,${size}px)`,
                  height: "auto",
                  objectFit: "contain",
                  imageRendering: "pixelated",
                  opacity: size === 64 ? 0.75 : 0.45,
                  maxWidth: "100%",
                }}
                loading="lazy"
              />
            ))}
          </div>

          {/* Closing quote */}
          <h2
            style={{
              fontFamily: "var(--font-news-almstqbl,serif)",
              fontSize: "clamp(1.5rem,3vw,2.4rem)",
              color: "#e7edfd",
              margin: 0,
              maxWidth: "680px",
              lineHeight: 1.3,
              overflowWrap: "anywhere",
            }}
          >
            نلتقي لنحتفي بما بُني… ونبدأ ما سيأتي.
          </h2>

          {/* Logos */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "clamp(16px,3vw,32px)",
              flexWrap: "wrap",
            }}
          >
            <Image
              src="/assets/logos/logo-white-glow.png"
              alt="BUILDx"
              width={120}
              height={34}
              style={{
                width: "clamp(96px,14vw,140px)",
                height: "auto",
                objectFit: "contain",
                opacity: 0.55,
                maxWidth: "100%",
              }}
              loading="lazy"
            />
            <div
              style={{
                width: "1px",
                height: "28px",
                background: "rgba(231,237,253,0.1)",
                flexShrink: 0,
              }}
            />
            <Image
              src="/images/agenda/partners/t2-business-logo.png"
              alt="T2 Business"
              width={36}
              height={36}
              style={{
                width: "clamp(28px,4vw,40px)",
                height: "auto",
                objectFit: "contain",
                opacity: 0.4,
                maxWidth: "100%",
              }}
              loading="lazy"
            />
          </div>

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
              width: "100%",
              maxWidth: "780px",
              boxSizing: "border-box",
            }}
          >
            <a
              href={EVENT_INFO.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={btnBase}
            >
              <MapPin style={{ width: 18, height: 18, flexShrink: 0 }} />
              الموقع في Google Maps
            </a>
            <button
              type="button"
              onClick={downloadICS}
              style={{ ...btnBase, background: "rgba(231,237,253,0.04)" } as React.CSSProperties}
            >
              <Calendar style={{ width: 18, height: 18, flexShrink: 0 }} />
              أضف إلى التقويم
            </button>
            <button
              type="button"
              onClick={copyLink}
              style={{ ...btnBase, background: "rgba(231,237,253,0.04)" } as React.CSSProperties}
            >
              {copied
                ? <Check style={{ width: 18, height: 18, flexShrink: 0, color: "#c3f937" }} />
                : <Copy style={{ width: 18, height: 18, flexShrink: 0 }} />
              }
              {copied ? "تم النسخ!" : "انسخ رابط الأجندة"}
            </button>
          </div>

          {/* Back to top */}
          <button
            type="button"
            onClick={scrollTop}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "transparent",
              border: "none",
              color: "rgba(231,237,253,0.25)",
              fontFamily: "var(--font-janna,sans-serif)",
              fontSize: "13px",
              cursor: "pointer",
              padding: "8px 12px",
              minHeight: "40px",
              transition: "color 0.2s",
            }}
          >
            <ArrowUp style={{ width: 14, height: 14, flexShrink: 0 }} />
            العودة إلى أعلى الصفحة
          </button>

          {/* Footer text */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              borderTop: "1px solid rgba(231,237,253,0.04)",
              paddingTop: "24px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-arapix,sans-serif)",
                fontSize: "11px",
                color: "rgba(231,237,253,0.12)",
                margin: 0,
              }}
            >
              BUILDX CLOSING CEREMONY — 2026
            </p>
            <p
              style={{
                fontFamily: "var(--font-janna,sans-serif)",
                fontSize: "12px",
                color: "rgba(231,237,253,0.1)",
                margin: 0,
              }}
            >
              هذه الصفحة مخصصة لضيوف الحفل الختامي فقط.
            </p>
          </div>
        </div>
      </footer>

      {/* Fixed back-to-top — small and safe */}
      {showTop && (
        <button
          type="button"
          onClick={scrollTop}
          aria-label="العودة إلى أعلى الصفحة"
          style={{
            position: "fixed",
            bottom: "24px",
            left: "24px",
            zIndex: 50,
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(10,13,20,0.92)",
            border: "1px solid rgba(195,249,55,0.2)",
            color: "rgba(195,249,55,0.8)",
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
        >
          <ArrowUp style={{ width: 16, height: 16 }} />
        </button>
      )}
    </>
  );
}
