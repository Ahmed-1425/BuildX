"use client";

import { useRiyadhTime } from "../hooks/useRiyadhTime";
import {
  AGENDA_ITEMS,
  getEventStatus,
  getEventProgress,
  getItemStatus,
  getEventDateTime,
} from "../agenda-data";

export function LiveEventIndicator() {
  const now = useRiyadhTime();

  if (now === null) {
    // Server/loading state — render placeholder to avoid hydration mismatch
    return (
      <div className="mb-4 h-12 flex items-center gap-2 px-4 py-2 bg-dark-secondary/20 border border-light/10 animate-pulse">
        <span className="w-2.5 h-2.5 bg-light/20 rounded-full" />
        <span
          className="text-light/30 text-sm"
          style={{ fontFamily: "var(--font-janna)" }}
        >
          جارِ التحميل...
        </span>
      </div>
    );
  }

  const status = getEventStatus(now);
  const currentItem = AGENDA_ITEMS.find(
    (item) => getItemStatus(item, now) === "current"
  );

  if (status === "before") {
    // Countdown
    const eventStart = getEventDateTime("17:00").getTime();
    const diff = eventStart - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return (
      <div className="mb-4 flex flex-col sm:flex-row items-center gap-3 px-4 py-3 bg-dark-secondary/20 border border-lime/20">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-lime rounded-full animate-pulse" />
          <span
            className="text-lime text-sm font-bold"
            style={{ fontFamily: "var(--font-janna-bold)" }}
          >
            يبدأ الحفل قريبًا
          </span>
        </div>
        <div
          className="flex items-center gap-2 text-light/80 text-sm"
          dir="ltr"
          style={{ fontFamily: "var(--font-arapix)" }}
        >
          {days > 0 && (
            <span className="px-2 py-1 bg-dark border border-lime/20 text-lime min-w-[3rem] text-center">
              {days}d
            </span>
          )}
          <span className="px-2 py-1 bg-dark border border-lime/20 text-lime min-w-[3rem] text-center">
            {hours.toString().padStart(2, "0")}h
          </span>
          <span className="text-lime/40">:</span>
          <span className="px-2 py-1 bg-dark border border-lime/20 text-lime min-w-[3rem] text-center">
            {minutes.toString().padStart(2, "0")}m
          </span>
          <span className="text-lime/40">:</span>
          <span className="px-2 py-1 bg-dark border border-lime/20 text-lime min-w-[3rem] text-center">
            {seconds.toString().padStart(2, "0")}s
          </span>
        </div>
      </div>
    );
  }

  if (status === "during") {
    const progress = getEventProgress(now);

    return (
      <div className="mb-4 flex flex-col gap-2 px-4 py-3 bg-dark-secondary/20 border border-lime/30">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-lime" />
          </span>
          <span
            className="text-lime text-sm font-bold"
            style={{ fontFamily: "var(--font-janna-bold)" }}
          >
            الحفل قائم الآن
          </span>
          {currentItem && (
            <span
              className="text-light/60 text-xs mr-2"
              style={{ fontFamily: "var(--font-janna)" }}
            >
              — {currentItem.title}
            </span>
          )}
        </div>
        <div className="w-full h-1.5 bg-dark rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-lime to-pink rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span
          className="text-light/40 text-xs"
          style={{ fontFamily: "var(--font-arapix)" }}
          dir="ltr"
        >
          {Math.round(progress)}% COMPLETE
        </span>
      </div>
    );
  }

  // After event
  return (
    <div className="mb-4 flex items-center gap-2 px-4 py-3 bg-dark-secondary/20 border border-pink/20">
      <span className="w-2.5 h-2.5 bg-pink rounded-full" />
      <span
        className="text-pink text-sm font-bold"
        style={{ fontFamily: "var(--font-janna-bold)" }}
      >
        اختُتم الحفل
      </span>
    </div>
  );
}
