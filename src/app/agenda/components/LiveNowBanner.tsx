"use client";

import { useRef, useCallback } from "react";
import { ArrowDown } from "lucide-react";
import { useRiyadhTime } from "../hooks/useRiyadhTime";
import {
  AGENDA_ITEMS,
  PHASES,
  getItemStatus,
  getItemProgress,
  getEventStatus,
  formatTime12h,
  formatDuration,
  getEventDateTime,
} from "../agenda-data";

export default function LiveNowBanner() {
  const now = useRiyadhTime();

  const scrollToCurrent = useCallback((itemId: number) => {
    document
      .getElementById(`item-${itemId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  if (now === null) return null;

  const status = getEventStatus(now);
  if (status === "after") return null;

  const currentItem = AGENDA_ITEMS.find(
    (item) => getItemStatus(item, now) === "current"
  );
  const currentIndex = currentItem ? AGENDA_ITEMS.indexOf(currentItem) : -1;
  const nextItem =
    currentIndex >= 0 && currentIndex < AGENDA_ITEMS.length - 1
      ? AGENDA_ITEMS[currentIndex + 1]
      : status === "before"
        ? AGENDA_ITEMS[0]
        : null;

  const currentPhase = currentItem
    ? PHASES.find((p) => p.id === currentItem.phase)
    : null;
  const accentColor = currentPhase?.accentColor ?? "#c3f937";

  // Before event — show brief teaser
  if (status === "before") {
    const eventStart = getEventDateTime("17:00").getTime();
    const diffMs = Math.max(0, eventStart - now);
    const hours = Math.floor(diffMs / 3600000);
    const mins = Math.floor((diffMs % 3600000) / 60000);

    return (
      <div
        style={{
          width: "100%",
          boxSizing: "border-box",
          background: "rgba(10,13,20,0.8)",
          borderTop: "1px solid rgba(195,249,55,0.08)",
          borderBottom: "1px solid rgba(195,249,55,0.08)",
        }}
      >
        <div
          style={{
            maxWidth: "1360px",
            marginInline: "auto",
            padding: "14px clamp(16px,4vw,48px)",
            boxSizing: "border-box",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#c3f937",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-janna,sans-serif)",
              fontSize: "14px",
              color: "rgba(231,237,253,0.7)",
            }}
          >
            الحفل يبدأ بعد{" "}
            <strong style={{ color: "#c3f937" }}>
              {hours > 0 ? `${hours} ساعة و` : ""}
              {mins} دقيقة
            </strong>
            {nextItem && ` — أول فقرة: ${nextItem.title}`}
          </span>
        </div>
      </div>
    );
  }

  // During event — full live card
  if (!currentItem) return null;

  const progress = getItemProgress(currentItem, now);
  const endTime = getEventDateTime(currentItem.endTime).getTime();
  const remainingMs = Math.max(0, endTime - now);
  const remainingMins = Math.ceil(remainingMs / 60000);

  return (
    <div
      id="live-now-banner"
      style={{
        width: "100%",
        boxSizing: "border-box",
        background: "#0c0f18",
        borderTop: `2px solid ${accentColor}`,
        borderBottom: "1px solid rgba(231,237,253,0.05)",
      }}
    >
      <div
        style={{
          maxWidth: "1360px",
          marginInline: "auto",
          padding: "clamp(16px,2.5vw,28px) clamp(16px,4vw,48px)",
          boxSizing: "border-box",
        }}
      >
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "14px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "10px" }}
          >
            {/* Live dot */}
            <span
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                background: accentColor,
                flexShrink: 0,
                animation: "liveGlow 1.5s ease-in-out infinite",
              }}
            />
            <h2
              style={{
                fontFamily: "var(--font-news-almstqbl,serif)",
                fontSize: "clamp(1.15rem,1.8vw,1.5rem)",
                color: "#e7edfd",
                margin: 0,
                fontWeight: 700,
              }}
            >
              الآن في BUILDx
            </h2>
            <span
              style={{
                padding: "3px 10px",
                background: `${accentColor}18`,
                border: `1px solid ${accentColor}30`,
                fontFamily: "var(--font-arapix,sans-serif)",
                fontSize: "11px",
                color: accentColor,
                fontWeight: 700,
              }}
            >
              مباشر
            </span>
          </div>

          {/* Jump button */}
          <button
            type="button"
            onClick={() => scrollToCurrent(currentItem.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: `${accentColor}12`,
              border: `1px solid ${accentColor}25`,
              color: accentColor,
              fontFamily: "var(--font-janna,sans-serif)",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              minHeight: "40px",
              boxSizing: "border-box",
              whiteSpace: "nowrap",
            }}
          >
            <ArrowDown style={{ width: 14, height: 14, flexShrink: 0 }} />
            انتقل إلى الفقرة الحالية
          </button>
        </div>

        {/* Current item info */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            marginBottom: "12px",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--font-janna,sans-serif)",
              fontSize: "clamp(1.1rem,1.6vw,1.4rem)",
              fontWeight: 700,
              color: "#e7edfd",
              margin: 0,
              overflowWrap: "anywhere",
            }}
          >
            {currentItem.title}
          </h3>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "16px",
              fontFamily: "var(--font-janna,sans-serif)",
              fontSize: "13px",
              color: "rgba(231,237,253,0.5)",
            }}
          >
            <span>
              {formatTime12h(currentItem.startTime)} –{" "}
              {formatTime12h(currentItem.endTime)}
            </span>
            <span>|</span>
            <span>{formatDuration(currentItem.durationMinutes)}</span>
            <span>|</span>
            <span style={{ color: accentColor }}>
              متبقي {remainingMins > 0 ? `${remainingMins} دقيقة` : "أقل من دقيقة"}
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: "100%",
            height: "4px",
            background: "rgba(231,237,253,0.06)",
            borderRadius: "2px",
            overflow: "hidden",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: `linear-gradient(90deg,${accentColor},${accentColor}bb)`,
              borderRadius: "2px",
              transition: "width 1s linear",
            }}
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        {/* Next item */}
        {nextItem && (
          <div
            style={{
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid rgba(231,237,253,0.05)",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "var(--font-janna,sans-serif)",
              fontSize: "13px",
              flexWrap: "wrap",
            }}
          >
            <span style={{ color: "rgba(231,237,253,0.25)" }}>التالي:</span>
            <span style={{ color: "rgba(231,237,253,0.6)", fontWeight: 700 }}>
              {nextItem.title}
            </span>
            <span style={{ color: "rgba(231,237,253,0.25)", marginRight: "auto" }}>
              {formatTime12h(nextItem.startTime)}
            </span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes liveGlow {
          0%,100%{box-shadow:0 0 0 0 currentColor;}
          50%{box-shadow:0 0 6px 2px currentColor;opacity:0.7;}
        }
      `}</style>
    </div>
  );
}
