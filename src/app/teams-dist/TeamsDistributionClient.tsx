"use client";

import { useState, useRef, useCallback } from "react";
import { TEAMS_DATA } from "@/data/teamsDistribution";
import TeamHero from "@/components/teams-dist/TeamHero";
import QuickTeamNav from "@/components/teams-dist/QuickTeamNav";
import TeamSection from "@/components/teams-dist/TeamSection";
import Image from "next/image";

/* ── Normalize Arabic text for forgiving search ── */
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[ىي]/g, "ي")
    .replace(/[\u064B-\u065F]/g, "");
}

export default function TeamsDistributionClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [highlightedMemberId, setHighlightedMemberId] = useState<string | null>(null);
  const [activeTeamId, setActiveTeamId] = useState<string>("team-10");
  const highlightTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /* ── Search Logic ── */
  const trimmed = searchQuery.trim();
  const normalizedQuery = trimmed ? normalizeText(trimmed) : "";
  let hasResults = true;
  let searchPerformed = false;

  if (normalizedQuery) {
    searchPerformed = true;
    hasResults = TEAMS_DATA.some((team) =>
      team.members.some((m) => normalizeText(m.name).includes(normalizedQuery))
    );
  }

  /* ── Handle search with auto-scroll and highlight ── */
  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);

    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }

    const q = query.trim();
    if (!q) {
      setHighlightedMemberId(null);
      return;
    }

    const normalized = normalizeText(q);
    for (const team of TEAMS_DATA) {
      const found = team.members.find((m) => normalizeText(m.name).includes(normalized));
      if (found) {
        setHighlightedMemberId(found.id);
        setActiveTeamId(team.id);

        // Wait briefly for render, then scroll
        requestAnimationFrame(() => {
          const cardEl = document.getElementById(`member-${found.id}`);
          if (cardEl) {
            cardEl.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            const teamEl = document.getElementById(team.id);
            if (teamEl) teamEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        });

        highlightTimeoutRef.current = setTimeout(() => {
          setHighlightedMemberId(null);
        }, 3500);

        return;
      }
    }
    setHighlightedMemberId(null);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    setHighlightedMemberId(null);
    if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current);
  }, []);

  const handleSelectTeam = useCallback((teamId: string) => {
    setActiveTeamId(teamId);
    const element = document.getElementById(teamId);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div
      className="min-h-screen relative selection:bg-lime/30 selection:text-white"
      style={{ backgroundColor: "var(--buildx-bg)", color: "var(--buildx-text)" }}
    >
      {/* ─── Hero ─── */}
      <TeamHero
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        hasSearchResults={hasResults}
        searchPerformed={searchPerformed}
      />

      {/* ─── Sticky Quick Nav ─── */}
      <QuickTeamNav onSelectTeam={handleSelectTeam} activeTeamId={activeTeamId} />

      {/* ─── Teams Container ─── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {TEAMS_DATA.map((team, index) => (
          <TeamSection
            key={team.id}
            team={team}
            highlightedMemberId={highlightedMemberId}
            index={index}
          />
        ))}

        {/* ─── Footer ─── */}
        <div className="mt-16 pt-10 text-center" style={{ borderTop: "1px solid var(--buildx-border)" }}>
          <Image
            src="/assets/logos/logo-white.png"
            alt="BUILDx"
            width={100}
            height={28}
            className="h-7 w-auto object-contain mx-auto mb-4 opacity-40"
          />
          <p
            className="text-xs"
            style={{ fontFamily: "var(--font-janna)", color: "rgba(231,237,253,0.3)" }}
          >
            معسكر BUILDx — من برومبت يُقال إلى منتج فعّال
          </p>
        </div>
      </main>
    </div>
  );
}
