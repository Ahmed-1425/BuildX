"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRiyadhTime } from "../hooks/useRiyadhTime";
import {
  PHASES,
  AGENDA_ITEMS,
  getItemStatus,
  getEventStatus,
} from "../agenda-data";

export default function PhaseNav() {
  const now = useRiyadhTime();
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([entry]) => setIsStuck(!entry.isIntersecting),
      { threshold: 0 }
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  const eventStatus = now !== null ? getEventStatus(now) : "before";

  // Determine active phase
  const activePhaseId = (() => {
    if (now === null) return 0;
    const currentItem = AGENDA_ITEMS.find(
      (i) => getItemStatus(i, now) === "current"
    );
    if (currentItem) return currentItem.phase;
    // If before event, show phase 1; if after, show 6
    if (eventStatus === "before") return 0;
    return 6;
  })();

  const scrollToPhase = useCallback((phaseId: number) => {
    document
      .getElementById(`phase-${phaseId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <>
      {/* Sentinel for sticky detection */}
      <div ref={sentinelRef} style={{ height: "1px" }} aria-hidden />

      <nav
        ref={navRef}
        id="phase-nav"
        aria-label="مراحل البرنامج"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          width: "100%",
          boxSizing: "border-box",
          background: isStuck ? "rgba(10,13,20,0.96)" : "rgba(10,13,20,0.7)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(231,237,253,0.06)",
          transition: "background 0.25s",
        }}
      >
        <div
          style={{
            maxWidth: "1360px",
            marginInline: "auto",
            boxSizing: "border-box",
          }}
        >
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              margin: 0,
              padding: 0,
              overflowX: "auto",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
              // Scroll snap
              scrollSnapType: "x mandatory",
            }}
          >
            {PHASES.map((phase) => {
              const isActive = phase.id === activePhaseId;
              const isPast =
                now !== null &&
                AGENDA_ITEMS.filter((i) => i.phase === phase.id).every(
                  (i) => getItemStatus(i, now) === "past"
                );

              return (
                <li
                  key={phase.id}
                  style={{ flexShrink: 0, scrollSnapAlign: "start" }}
                >
                  <button
                    type="button"
                    onClick={() => scrollToPhase(phase.id)}
                    aria-current={isActive ? "step" : undefined}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "4px",
                      padding: "12px clamp(12px,1.8vw,22px)",
                      background: "transparent",
                      border: "none",
                      borderBottom: isActive
                        ? `2px solid ${phase.accentColor}`
                        : "2px solid transparent",
                      cursor: "pointer",
                      boxSizing: "border-box",
                      minHeight: "60px",
                      transition: "border-color 0.2s",
                      opacity: isPast ? 0.45 : 1,
                      minWidth: "max-content",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-arapix,sans-serif)",
                        fontSize: "10px",
                        color: isActive
                          ? phase.accentColor
                          : "rgba(231,237,253,0.3)",
                        letterSpacing: "0.05em",
                        fontWeight: 700,
                        transition: "color 0.2s",
                      }}
                    >
                      {phase.id.toString().padStart(2, "0")}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-janna,sans-serif)",
                        fontSize: "clamp(12px,1.2vw,14px)",
                        color: isActive ? "#e7edfd" : "rgba(231,237,253,0.5)",
                        fontWeight: isActive ? 700 : 400,
                        whiteSpace: "nowrap",
                        transition: "color 0.2s",
                      }}
                    >
                      {phase.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>
    </>
  );
}
