"use client";

import Image from "next/image";
import { Clock, ArrowLeft } from "lucide-react";
import { useRiyadhTime } from "../hooks/useRiyadhTime";
import {
  AGENDA_ITEMS,
  PHASES,
  getEventStatus,
  getItemStatus,
  getItemProgress,
  formatTime12h,
  formatDuration,
  getEventDateTime,
} from "../agenda-data";

export default function LiveAgendaStatus() {
  const now = useRiyadhTime();

  if (now === null) {
    return (
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-6">
        <div className="bg-[#151a27] border border-light/6 p-8 lg:p-10 animate-pulse shadow-[6px_6px_0px_0px_#34155f]">
          <div className="h-8 w-56 bg-light/5 mb-6" />
          <div className="h-24 bg-light/5" />
        </div>
      </section>
    );
  }

  const status = getEventStatus(now);
  const currentItem = AGENDA_ITEMS.find((item) => getItemStatus(item, now) === "current");
  const currentIndex = currentItem ? AGENDA_ITEMS.indexOf(currentItem) : -1;
  const nextItem =
    currentIndex >= 0 && currentIndex < AGENDA_ITEMS.length - 1
      ? AGENDA_ITEMS[currentIndex + 1]
      : status === "before"
        ? AGENDA_ITEMS[0]
        : null;

  const currentPhase = currentItem ? PHASES[currentItem.phase - 1] : null;

  // Before event
  if (status === "before") {
    const eventStart = getEventDateTime("17:00").getTime();
    const diff = eventStart - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return (
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-6">
        <div className="bg-[#151a27] border border-lime/10 p-6 sm:p-8 lg:p-10 shadow-[6px_6px_0px_0px_#34155f] relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-[3px] bg-gradient-to-r from-lime via-lime/60 to-transparent" />
          <div className="absolute top-0 left-0 w-48 h-48 bg-lime/3 rounded-full blur-[80px] pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6 lg:gap-10">
            {/* Icon & Title */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center bg-lime/8 border border-lime/15">
                <Clock className="w-7 h-7 lg:w-8 lg:h-8 text-lime/60" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl text-light font-bold" style={{ fontFamily: "var(--font-news-almstqbl)" }}>
                  الآن في BUILDx
                </h2>
                <p className="text-light/40 text-sm mt-0.5" style={{ fontFamily: "var(--font-janna)" }}>
                  في انتظار بدء الحفل
                </p>
              </div>
            </div>

            {/* Next up info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 px-5 py-4 bg-dark/60 border border-lime/8">
                <Image
                  src="/images/agenda/characters/ready.png"
                  alt=""
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain image-pixelated shrink-0 hidden sm:block"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-light text-lg font-bold" style={{ fontFamily: "var(--font-janna-bold)" }}>
                    موعد استقبال الضيوف
                  </p>
                  <p className="text-light/40 text-sm mt-1" style={{ fontFamily: "var(--font-janna)" }}>
                    يبدأ بعد {hours > 0 ? `${hours} ساعة و` : ""}{minutes} دقيقة تقريبًا
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // After event
  if (status === "after") {
    return (
      <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-6">
        <div className="bg-[#151a27] border border-pink/10 p-6 sm:p-8 lg:p-10 shadow-[6px_6px_0px_0px_#34155f] relative overflow-hidden">
          <div className="absolute top-0 right-0 left-0 h-[3px] bg-gradient-to-r from-pink via-pink/60 to-transparent" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className="w-14 h-14 flex items-center justify-center bg-pink/8 border border-pink/15">
              <Image src="/images/agenda/characters/success.png" alt="" width={40} height={40} className="w-10 h-10 object-contain image-pixelated" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl text-light font-bold mb-1" style={{ fontFamily: "var(--font-news-almstqbl)" }}>
                الآن في BUILDx
              </h2>
              <p className="text-light/60 text-lg" style={{ fontFamily: "var(--font-janna-bold)" }}>
                اختُتم الحفل، شكرًا لكونكم جزءًا من BUILDx.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // During event
  if (!currentItem) return null;

  const progress = getItemProgress(currentItem, now);
  const endTime = getEventDateTime(currentItem.endTime).getTime();
  const remainingMs = Math.max(0, endTime - now);
  const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));

  const phaseAccentColor = currentPhase?.accentColor || "#c3f937";

  return (
    <section className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-16 py-6">
      <div
        className="bg-[#151a27] border p-6 sm:p-8 lg:p-10 shadow-[6px_6px_0px_0px_#34155f] relative overflow-hidden"
        style={{ borderColor: `${phaseAccentColor}25` }}
      >
        {/* Top accent line */}
        <div className="absolute top-0 right-0 left-0 h-[3px]" style={{ background: `linear-gradient(to left, ${phaseAccentColor}, ${phaseAccentColor}80, transparent)` }} />
        <div className="absolute top-0 left-0 w-60 h-60 rounded-full blur-[100px] pointer-events-none" style={{ background: `${phaseAccentColor}06` }} />

        <div className="relative z-10">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: phaseAccentColor }} />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5" style={{ backgroundColor: phaseAccentColor }} />
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-light font-bold" style={{ fontFamily: "var(--font-news-almstqbl)" }}>
                الآن في BUILDx
              </h2>
            </div>
            <span
              className="px-3 py-1.5 text-xs font-bold border animate-pulse"
              style={{
                fontFamily: "var(--font-arapix)",
                color: phaseAccentColor,
                backgroundColor: `${phaseAccentColor}12`,
                borderColor: `${phaseAccentColor}30`,
              }}
              aria-current="step"
            >
              الآن
            </span>
          </div>

          {/* Main current item */}
          <div className="flex flex-col lg:flex-row items-start gap-6 mb-6">
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl text-light font-bold mb-3" style={{ fontFamily: "var(--font-janna-bold)" }}>
                {currentItem.title}
              </h3>
              <div className="flex flex-wrap items-center gap-4 text-light/50 mb-2" style={{ fontFamily: "var(--font-janna)", fontSize: "clamp(0.9rem, 1vw, 1.1rem)" }}>
                <time dateTime={`2026-10-06T${currentItem.startTime}:00+03:00`} className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {formatTime12h(currentItem.startTime)} – {formatTime12h(currentItem.endTime)}
                </time>
                <span className="text-light/15">|</span>
                <span>{formatDuration(currentItem.durationMinutes)}</span>
                <span className="text-light/15">|</span>
                <span style={{ color: phaseAccentColor }}>
                  متبقي {remainingMinutes > 0 ? `${remainingMinutes} دقيقة` : "أقل من دقيقة"}
                </span>
              </div>
              {currentItem.description && (
                <p className="text-light/35 text-base mt-2" style={{ fontFamily: "var(--font-janna)" }}>
                  {currentItem.description}
                </p>
              )}
            </div>

            <Image
              src={
                currentItem.type === "prayer" ? "/images/agenda/characters/thinking.png"
                : currentItem.type === "projects" ? "/images/agenda/characters/building.png"
                : "/images/agenda/characters/success.png"
              }
              alt=""
              width={80}
              height={80}
              className="w-16 h-16 lg:w-20 lg:h-20 object-contain image-pixelated shrink-0 hidden sm:block opacity-50"
            />
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="w-full h-2.5 bg-dark rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%`, background: `linear-gradient(to left, ${phaseAccentColor}, ${phaseAccentColor}cc)` }}
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`تقدم الفقرة الحالية: ${Math.round(progress)}%`}
              />
            </div>
          </div>

          {/* Next item */}
          {nextItem && (
            <div className="pt-5 border-t border-light/5 flex items-center gap-4">
              <ArrowLeft className="w-4 h-4 text-light/20 shrink-0" />
              <span className="text-light/25 text-sm" style={{ fontFamily: "var(--font-janna)" }}>التالي:</span>
              <span className="text-light/50 text-base font-bold" style={{ fontFamily: "var(--font-janna-bold)" }}>
                {nextItem.title}
              </span>
              <span className="text-light/25 text-sm mr-auto" style={{ fontFamily: "var(--font-janna)" }}>
                {formatTime12h(nextItem.startTime)}
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
