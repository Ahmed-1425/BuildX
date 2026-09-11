"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import MobileHeader, {
  MobileBottomNavigation,
} from "@/components/MobileNavigation";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import VibeCodingSection from "@/components/VibeCodingSection";
import ProgressBar from "@/components/ProgressBar";

// Lazy-load below-fold sections to reduce initial JS bundle and mount cost
const VisionMissionSection = dynamic(() => import("@/components/VisionMissionSection"));
const ObjectivesSection = dynamic(() => import("@/components/ObjectivesSection"));
const OutcomesSection = dynamic(() => import("@/components/OutcomesSection"));
const TargetAudienceSection = dynamic(() => import("@/components/TargetAudienceSection"));
const TrainerSection = dynamic(() => import("@/components/TrainerSection"));
const CampTimeline = dynamic(() => import("@/components/CampTimeline"));
const FinalCTA = dynamic(() => import("@/components/FinalCTA"));
const Footer = dynamic(() => import("@/components/Footer"));
const PartnersMarquee = dynamic(() => import("@/components/PartnersMarquee"));
const MeetTeamSection = dynamic(() => import("@/components/MeetTeamSection"));

const SplashScreen = dynamic(() => import("@/components/SplashScreen"), {
  ssr: false,
});

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("buildx-splash-seen") === "true";
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const scrollToHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (hash) {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    if (splashDone) {
      const t1 = setTimeout(scrollToHash, 80);
      const t2 = setTimeout(scrollToHash, 350);
      window.addEventListener("hashchange", scrollToHash);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        window.removeEventListener("hashchange", scrollToHash);
      };
    }
  }, [splashDone]);

  return (
    <>
      <SplashScreen onComplete={() => setSplashDone(true)} />

      {splashDone && (
        <>
          <ProgressBar />
          <Header />
          <MobileHeader />

          <main>
            <HeroSection />

            {/* Section divider */}
            <div className="section-divider" />

            <VibeCodingSection />

            <div className="section-divider" />

            <StatsSection />

            <div className="section-divider" />

            <ObjectivesSection />

            {/* Visual Pixel Transition between Objectives and Target Audience */}
            <div className="relative py-8 md:py-14 flex items-center justify-center gap-3 select-none pointer-events-none opacity-80">
              <span className="w-2.5 h-2.5 bg-lime shadow-[0_0_8px_#c3f937]" />
              <span className="w-2 h-2 bg-pink/80" />
              <span className="w-24 sm:w-48 h-[2px] bg-gradient-to-r from-lime via-pink to-primary" />
              <span className="w-2 h-2 bg-primary/80" />
              <span className="w-2.5 h-2.5 bg-pink shadow-[0_0_8px_#fb50c3]" />
            </div>

            <TargetAudienceSection />

            <div className="section-divider" />

            <PartnersMarquee />

            <div className="section-divider" />

            <TrainerSection />

            <div className="section-divider" />

            <MeetTeamSection />

            <div className="section-divider" />

            <CampTimeline />

            <div className="section-divider" />

            <FinalCTA />
          </main>

          <Footer />

          <MobileBottomNavigation />
        </>
      )}
    </>
  );
}
