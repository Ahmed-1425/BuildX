"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import MobileHeader, {
  MobileBottomNavigation,
} from "@/components/MobileNavigation";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import VibeCodingSection from "@/components/VibeCodingSection";
import VisionMissionSection from "@/components/VisionMissionSection";
import ObjectivesSection from "@/components/ObjectivesSection";
import OutcomesSection from "@/components/OutcomesSection";
import TargetAudienceSection from "@/components/TargetAudienceSection";
import TrainerSection from "@/components/TrainerSection";
import CampTimeline from "@/components/CampTimeline";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import ProgressBar from "@/components/ProgressBar";

const SplashScreen = dynamic(() => import("@/components/SplashScreen"), {
  ssr: false,
});

export default function HomePage() {
  const [splashDone, setSplashDone] = useState(false);

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

            <div className="section-divider" />

            <TargetAudienceSection />

            <div className="section-divider" />

            <TrainerSection />

            <div className="section-divider" />

            <CampTimeline />

            <div className="section-divider" />

            <FinalCTA />
          </main>

          <Footer />

          <MobileBottomNavigation />

          {/* Bottom spacer for mobile nav */}
          <div className="h-16 lg:hidden" />
        </>
      )}
    </>
  );
}
