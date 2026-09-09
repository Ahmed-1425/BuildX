"use client";

import Header from "@/components/Header";
import MobileHeader, {
  MobileBottomNavigation,
} from "@/components/MobileNavigation";
import Footer from "@/components/Footer";
import TeamPageContent from "@/components/team/TeamPageContent";

export default function TeamPageClient() {
  return (
    <>
      <Header />
      <MobileHeader />

      <main>
        <TeamPageContent />
      </main>

      <Footer />

      <MobileBottomNavigation />
    </>
  );
}
