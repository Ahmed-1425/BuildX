"use client";

import Image from "next/image";
import { EVENT_INFO } from "../agenda-data";

export default function VenueCard() {
  return (
    <section
      id="venue-card"
      className="relative max-w-4xl mx-auto px-4 sm:px-8 py-8"
    >
      <div className="relative bg-[#151a27] border border-light/8 overflow-hidden shadow-[6px_6px_0px_0px_#34155f]">
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-lime via-pink to-primary" />

        <div className="p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center">
          {/* Logo Side */}
          <div className="flex-shrink-0 flex flex-col items-center gap-3">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-dark/60 border border-light/10 p-3">
              <Image
                src="/images/agenda/partners/t2-business-logo.png"
                alt="شعار T2 بزنس"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Info Side */}
          <div className="flex-1 text-center md:text-right">
            <span
              className="text-xs text-lime/70 tracking-wider uppercase mb-1 block"
              style={{ fontFamily: "var(--font-arapix)" }}
            >
              VENUE // موقع الحفل
            </span>
            <h2
              className="text-2xl sm:text-3xl text-light font-bold mb-2"
              style={{ fontFamily: "var(--font-news-almstqbl)" }}
            >
              {EVENT_INFO.venue}
            </h2>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4 text-light/70 text-sm"
              style={{ fontFamily: "var(--font-janna)" }}
            >
              <span className="flex items-center gap-1.5">
                <Image
                  src="/assets/icons/location-white.png"
                  alt=""
                  width={14}
                  height={14}
                  className="w-3.5 h-3.5 object-contain opacity-60"
                />
                {EVENT_INFO.city}
              </span>
              <span className="text-light/20">•</span>
              <span>📅 {EVENT_INFO.date}</span>
              <span className="text-light/20">•</span>
              <span dir="ltr">
                🕐 {EVENT_INFO.startTime} – {EVENT_INFO.endTime}
              </span>
            </div>

            <a
              href={EVENT_INFO.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-lime/10 border border-lime/30 text-lime text-sm font-bold hover:bg-lime/20 hover:border-lime/50 transition-all duration-200 min-h-[44px]"
              style={{ fontFamily: "var(--font-janna-bold)" }}
            >
              <span>📍</span>
              <span>الاتجاهات عبر Google Maps</span>
              <span className="text-lime/60 text-xs" dir="ltr">↗</span>
            </a>
          </div>
        </div>

        {/* Bottom decorative */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>
    </section>
  );
}
