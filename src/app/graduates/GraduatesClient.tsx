"use client";

import { useCallback, useEffect, useState } from "react";
import { Medal, Users } from "lucide-react";
import Header from "@/components/Header";
import MobileHeader, { MobileBottomNavigation } from "@/components/MobileNavigation";
import Footer from "@/components/Footer";
import { DEFAULT_EDITION_ID, EDITIONS, type BuildxEdition } from "@/data/graduates";
import GraduatesHero from "@/components/graduates/GraduatesHero";
import EditionSelector from "@/components/graduates/EditionSelector";
import WinnersSection from "@/components/graduates/WinnersSection";
import AllGraduatesSection from "@/components/graduates/AllGraduatesSection";
import GraduatesClosing from "@/components/graduates/GraduatesClosing";
import { scrollToId, setHash } from "@/components/graduates/utils";
import { useLanguage } from "@/context/LanguageContext";
import "@/components/graduates/graduates.css";

type SectionKey = "winners" | "all-graduates";

export default function GraduatesClient() {
  const { t, locale, dir } = useLanguage();
  const [editionId, setEditionId] = useState(DEFAULT_EDITION_ID);
  const [peekId, setPeekId] = useState<string | null>(null);
  const [section, setSection] = useState<SectionKey>("winners");
  const [query, setQuery] = useState("");
  const edition = EDITIONS.find((e) => e.id === editionId) ?? EDITIONS[0];
  const [activeTeamId, setActiveTeamId] = useState(edition.teams[0]?.id ?? "");
  const [flashTeamId, setFlashTeamId] = useState<string | null>(null);

  const handleSelectEdition = useCallback((next: BuildxEdition) => {
    if (next.status === "coming_soon") {
      setPeekId(next.id);
      return;
    }
    setPeekId(null);
    setEditionId(next.id);
    setActiveTeamId(next.teams[0]?.id ?? "");
    setQuery("");
  }, []);

  const goToSection = useCallback((key: SectionKey) => {
    setSection(key);
    setHash(key);
    scrollToId(key, { focus: true });
  }, []);

  const goToTeam = useCallback((teamId: string) => {
    setActiveTeamId(teamId);
    setSection("all-graduates");
    setHash(teamId);
    scrollToId(teamId, { focus: true });
    setFlashTeamId(teamId);
    window.setTimeout(() => setFlashTeamId((cur) => (cur === teamId ? null : cur)), 2200);
  }, []);

  const meetTeam = useCallback(
    (teamNumber: number) => goToTeam(`team-${teamNumber}`),
    [goToTeam]
  );

  // Deep links: /graduates#winners, #all-graduates, #team-80
  useEffect(() => {
    const apply = () => {
      const id = decodeURIComponent(window.location.hash.replace("#", ""));
      if (!id) return;
      if (id === "winners" || id === "all-graduates") {
        setSection(id);
        scrollToId(id);
      } else if (/^team-\d+$/.test(id)) {
        setActiveTeamId(id);
        setSection("all-graduates");
        scrollToId(id);
      }
    };
    const tTimer = window.setTimeout(apply, 350);
    window.addEventListener("hashchange", apply);
    return () => {
      window.clearTimeout(tTimer);
      window.removeEventListener("hashchange", apply);
    };
  }, []);

  // Keep the segmented control in sync with scroll position.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = document.getElementById("all-graduates");
        if (!el) return;
        const reached = el.getBoundingClientRect().top <= window.innerHeight * 0.4;
        setSection(reached ? "all-graduates" : "winners");
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <Header />
      <MobileHeader />

      <main className="gr-page" dir={dir} lang={locale}>
        <GraduatesHero edition={edition} />

        <EditionSelector
          editions={EDITIONS}
          selectedId={editionId}
          peekId={peekId}
          onSelect={handleSelectEdition}
        />

        <div className="gr-container">
          <nav
            className="gr-tabs"
            aria-label={locale === "ar" ? "أقسام صفحة الخريجين" : "Graduates page sections"}
          >
            <a
              href="#winners"
              className={`gr-tabs__btn ${section === "winners" ? "is-active" : ""}`}
              aria-current={section === "winners" ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                goToSection("winners");
              }}
            >
              <Medal size={20} aria-hidden="true" /> {t.graduatesPage.tabs.winners}
            </a>
            <a
              href="#all-graduates"
              className={`gr-tabs__btn ${section === "all-graduates" ? "is-active" : ""}`}
              aria-current={section === "all-graduates" ? "true" : undefined}
              onClick={(e) => {
                e.preventDefault();
                goToSection("all-graduates");
              }}
            >
              <Users size={20} aria-hidden="true" /> {t.graduatesPage.tabs.allGraduates}
            </a>
          </nav>
        </div>

        <WinnersSection key={`w-${edition.id}`} edition={edition} onMeetTeam={meetTeam} />

        <AllGraduatesSection
          key={`a-${edition.id}`}
          edition={edition}
          query={query}
          onQueryChange={setQuery}
          activeTeamId={activeTeamId}
          onActiveTeamChange={setActiveTeamId}
          onSelectTeam={goToTeam}
          flashTeamId={flashTeamId}
        />

        <GraduatesClosing edition={edition} />
      </main>

      <Footer />
      <div className="gr-bottom-safe" aria-hidden="true" />

      <MobileBottomNavigation />
    </>
  );
}
