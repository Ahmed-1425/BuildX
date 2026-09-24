"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, ChevronDown, Calendar, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import {
  EVENT_INFO,
  getRiyadhNow,
  getEventDateTime,
  getEventStatus,
  getEventProgress,
  AGENDA_ITEMS,
  getItemStatus,
} from "../agenda-data";

/* ─── Countdown display ─────────────────────────────────────────────── */
function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "4px",
        padding: "10px 14px",
        background: "rgba(195,249,55,0.06)",
        border: "1px solid rgba(195,249,55,0.15)",
        minWidth: "64px",
        boxSizing: "border-box",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-bauhaus, monospace)",
          fontSize: "clamp(1.5rem, 3.5vw, 2.4rem)",
          fontWeight: 700,
          color: "#c3f937",
          lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(value).padStart(2, "0")}
      </span>
      <span
        style={{
          fontFamily: "var(--font-janna, sans-serif)",
          fontSize: "11px",
          color: "rgba(231,237,253,0.45)",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ─── Hero ──────────────────────────────────────────────────────────── */
export default function AgendaHero() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setNow(getRiyadhNow()), 10);
    const iv = setInterval(() => setNow(getRiyadhNow()), 1000);
    return () => {
      clearTimeout(t);
      clearInterval(iv);
    };
  }, []);

  const status = now !== null ? getEventStatus(now) : "before";
  const eventStart = getEventDateTime("17:00").getTime();

  let countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  if (now !== null && status === "before") {
    const diff = Math.max(0, eventStart - now);
    countdown = {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  }

  const progress =
    now !== null && status === "during" ? getEventProgress(now) : 0;
  const currentItem =
    now !== null
      ? AGENDA_ITEMS.find((i) => getItemStatus(i, now) === "current")
      : null;

  const scrollToAgenda = () => {
    document
      .getElementById("agenda-schedule")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      aria-label="أجندة الحفل الختامي"
      style={{
        position: "relative",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        background: "#0a0d14",
        paddingTop: "clamp(72px, 10vw, 96px)",
        paddingBottom: "clamp(64px, 8vw, 80px)",
      }}
    >
      {/* Background grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(195,249,55,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(195,249,55,0.04) 1px,transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at center,black 30%,transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at center,black 30%,transparent 100%)",
        }}
      />
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-10%",
          right: "-5%",
          width: "50%",
          maxWidth: "480px",
          aspectRatio: "1",
          background: "radial-gradient(circle,rgba(52,21,95,0.5) 0%,transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Container ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: "1440px",
          marginInline: "auto",
          paddingInline: "clamp(16px, 4vw, 48px)",
          boxSizing: "border-box",
        }}
      >
        {/* ── Desktop Grid: 58% text / 42% visual ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12,minmax(0,1fr))",
            gap: "clamp(24px,3vw,48px)",
            alignItems: "center",
          }}
        >
          {/* ── Text Column ── */}
          <div
            style={{
              gridColumn: "1 / -1",
              // Desktop override via media-query workaround using inline style on the element container
            }}
            className="hero-text-col"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                background: "rgba(251,80,195,0.08)",
                border: "1px solid rgba(251,80,195,0.25)",
                marginBottom: "clamp(16px,2vw,24px)",
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#fb50c3",
                  animation: "pulse 2s infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-arapix,sans-serif)",
                  fontSize: "13px",
                  color: "#fb50c3",
                  fontWeight: 700,
                }}
              >
                {EVENT_INFO.heroBadge}
              </span>
            </motion.div>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.1 }}
              style={{ marginBottom: "clamp(12px,1.5vw,20px)" }}
            >
              <Image
                src="/assets/logos/logo-white-glow.png"
                alt="BUILDx"
                width={1151}
                height={328}
                priority
                style={{
                  width: "clamp(140px,22vw,240px)",
                  height: "auto",
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 20px rgba(195,249,55,0.2))",
                  maxWidth: "100%",
                }}
              />
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.18 }}
              style={{
                fontFamily: "var(--font-news-almstqbl,serif)",
                fontSize: "clamp(2.35rem,5.5vw,6rem)",
                lineHeight: 1.1,
                color: "#e7edfd",
                margin: 0,
                marginBottom: "clamp(12px,1.5vw,20px)",
              }}
            >
              {EVENT_INFO.heroTitle}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.25 }}
              style={{
                fontFamily: "var(--font-janna,sans-serif)",
                fontSize: "clamp(1rem,1.4vw,1.2rem)",
                color: "rgba(231,237,253,0.65)",
                margin: 0,
                marginBottom: "clamp(20px,2.5vw,32px)",
                maxWidth: "540px",
                lineHeight: 1.7,
                overflowWrap: "anywhere",
              }}
            >
              {EVENT_INFO.heroDescription}
            </motion.p>

            {/* Info chips */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginBottom: "clamp(20px,2.5vw,32px)",
              }}
            >
              {[
                { icon: <Calendar style={{ width: 15, height: 15, flexShrink: 0 }} />, text: EVENT_INFO.date },
                {
                  icon: <Clock style={{ width: 15, height: 15, flexShrink: 0 }} />,
                  text: `${EVENT_INFO.startTime} – ${EVENT_INFO.endTime}`,
                  ltr: true,
                },
                {
                  icon: <MapPin style={{ width: 15, height: 15, flexShrink: 0 }} />,
                  text: `${EVENT_INFO.venue} — ${EVENT_INFO.city}`,
                },
              ].map((chip, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "9px 16px",
                    background: "rgba(231,237,253,0.04)",
                    border: "1px solid rgba(231,237,253,0.08)",
                    fontFamily: "var(--font-janna,sans-serif)",
                    fontSize: "clamp(0.88rem,1vw,1rem)",
                    color: "rgba(231,237,253,0.8)",
                    boxSizing: "border-box",
                  }}
                  dir={chip.ltr ? "ltr" : undefined}
                >
                  <span style={{ color: "rgba(195,249,55,0.6)" }}>{chip.icon}</span>
                  {chip.text}
                </div>
              ))}
            </motion.div>

            {/* Status / Countdown */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.36 }}
              style={{ marginBottom: "clamp(24px,3vw,36px)" }}
            >
              {status === "before" && now !== null && (
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-janna,sans-serif)",
                      fontSize: "13px",
                      color: "rgba(195,249,55,0.7)",
                      marginBottom: "12px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "#c3f937",
                        animation: "pulse 2s infinite",
                        flexShrink: 0,
                      }}
                    />
                    يبدأ الحفل قريبًا
                  </p>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }} dir="ltr">
                    {countdown.days > 0 && (
                      <CountdownUnit value={countdown.days} label="يوم" />
                    )}
                    <CountdownUnit value={countdown.hours} label="ساعة" />
                    <CountdownUnit value={countdown.minutes} label="دقيقة" />
                    <CountdownUnit value={countdown.seconds} label="ثانية" />
                  </div>
                </div>
              )}

              {status === "during" && now !== null && (
                <div
                  style={{
                    padding: "16px 20px",
                    background: "rgba(195,249,55,0.05)",
                    border: "1px solid rgba(195,249,55,0.2)",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        background: "#c3f937",
                        animation: "pulse 1.5s infinite",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-janna,sans-serif)",
                        fontWeight: 700,
                        color: "#c3f937",
                        fontSize: "15px",
                      }}
                    >
                      الحفل قائم الآن
                    </span>
                    {currentItem && (
                      <span
                        style={{
                          fontFamily: "var(--font-janna,sans-serif)",
                          fontSize: "14px",
                          color: "rgba(231,237,253,0.5)",
                          overflowWrap: "anywhere",
                        }}
                      >
                        — {currentItem.title}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: "4px",
                      background: "rgba(195,249,55,0.12)",
                      borderRadius: "2px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${progress}%`,
                        background: "linear-gradient(90deg,#c3f937,#fb50c3)",
                        borderRadius: "2px",
                        transition: "width 1s linear",
                      }}
                    />
                  </div>
                </div>
              )}

              {status === "after" && (
                <div
                  style={{
                    padding: "14px 20px",
                    background: "rgba(251,80,195,0.05)",
                    border: "1px solid rgba(251,80,195,0.15)",
                    fontFamily: "var(--font-janna,sans-serif)",
                    fontSize: "15px",
                    color: "#fb50c3",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "#fb50c3",
                      flexShrink: 0,
                    }}
                  />
                  اختُتم الحفل، شكرًا لكونكم جزءًا من BUILDx.
                </div>
              )}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.42 }}
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                onClick={scrollToAgenda}
                className="hero-btn-primary"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  background: "#c3f937",
                  color: "#0a0d14",
                  border: "2px solid #c3f937",
                  boxShadow: "4px 4px 0 #34155f",
                  fontFamily: "var(--font-janna,sans-serif)",
                  fontWeight: 700,
                  fontSize: "clamp(0.95rem,1.2vw,1.1rem)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  minHeight: "52px",
                  boxSizing: "border-box",
                  transition: "box-shadow 0.15s,transform 0.15s",
                }}
              >
                <ChevronDown style={{ width: 18, height: 18, flexShrink: 0 }} />
                استعرض الأجندة
              </button>
              <a
                href={EVENT_INFO.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "14px 28px",
                  background: "transparent",
                  color: "rgba(231,237,253,0.85)",
                  border: "2px solid rgba(231,237,253,0.15)",
                  boxShadow: "4px 4px 0 rgba(52,21,95,0.6)",
                  fontFamily: "var(--font-janna,sans-serif)",
                  fontWeight: 700,
                  fontSize: "clamp(0.95rem,1.2vw,1.1rem)",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  minHeight: "52px",
                  boxSizing: "border-box",
                  textDecoration: "none",
                  transition: "border-color 0.15s,color 0.15s",
                }}
              >
                <MapPin style={{ width: 18, height: 18, flexShrink: 0 }} />
                الموقع على الخريطة
              </a>
            </motion.div>
          </div>

          {/* ── Visual Column ── (hidden on mobile, shown desktop via CSS class) */}
          <div className="hero-visual-col" aria-hidden>
            {/* Character */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center" }}
            >
              {/* Glow behind character */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "radial-gradient(circle,rgba(195,249,55,0.08) 0%,transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <Image
                  src="/images/agenda/characters/ready.png"
                  alt="شخصية BUILDx"
                  width={220}
                  height={220}
                  priority
                  style={{
                    width: "clamp(140px,18vw,220px)",
                    height: "auto",
                    objectFit: "contain",
                    imageRendering: "pixelated",
                    maxWidth: "100%",
                    filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.6))",
                  }}
                />
              </motion.div>

              {/* T2 badge */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginTop: "16px",
                  padding: "12px 16px",
                  background: "rgba(10,13,20,0.9)",
                  border: "1px solid rgba(231,237,253,0.08)",
                  boxShadow: "4px 4px 0 rgba(52,21,95,0.5)",
                  backdropFilter: "blur(8px)",
                  boxSizing: "border-box",
                }}
              >
                <Image
                  src="/images/agenda/partners/t2-business-logo.png"
                  alt="T2 Business"
                  width={36}
                  height={36}
                  style={{ width: 36, height: 36, objectFit: "contain", flexShrink: 0 }}
                />
                <div>
                  <p
                    style={{
                      fontFamily: "var(--font-arapix,sans-serif)",
                      fontSize: "10px",
                      color: "rgba(231,237,253,0.3)",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      margin: 0,
                    }}
                  >
                    VENUE
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-janna,sans-serif)",
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "rgba(231,237,253,0.9)",
                      margin: 0,
                    }}
                  >
                    {EVENT_INFO.venue}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--font-janna,sans-serif)",
                      fontSize: "12px",
                      color: "rgba(231,237,253,0.35)",
                      margin: 0,
                    }}
                  >
                    {EVENT_INFO.city}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Keyframes for pulse animation */}
      <style>{`
        @keyframes pulse {
          0%,100%{opacity:1}50%{opacity:0.4}
        }
        @media(min-width:1024px){
          .hero-text-col{grid-column:1/8 !important;}
          .hero-visual-col{
            grid-column:8/13 !important;
            display:flex !important;
            justify-content:center;
          }
        }
        @media(max-width:1023px){
          .hero-visual-col{display:none !important;}
          .hero-text-col{grid-column:1/-1 !important; text-align:center;}
          .hero-text-col > *{margin-inline:auto;}
        }
      `}</style>
    </section>
  );
}
