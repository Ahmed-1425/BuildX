"use client";

import { useEffect, useMemo, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Search, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import {
  getGraduatesCount,
  getLinkLabel,
  type BuildxEdition,
  type Graduate,
  type GraduateTeam,
} from "@/data/graduates";
import { AwardGlyph, FacelessCharacterIcon, LinkKindIcon } from "./icons";
import { normalizeText } from "./utils";

type Props = {
  edition: BuildxEdition;
  query: string;
  onQueryChange: (q: string) => void;
  activeTeamId: string;
  onActiveTeamChange: (id: string) => void;
  onSelectTeam: (teamId: string) => void;
  flashTeamId: string | null;
};

const AVATAR_TONES = ["lime", "pink", "warm", "light"] as const;

function haystack(team: GraduateTeam, m: Graduate): string {
  return normalizeText(
    [
      m.name,
      m.nameEn,
      m.field,
      m.fieldEn,
      m.org ?? "",
      m.orgEn ?? "",
      `team ${team.number}`,
      `فريق ${team.number}`,
      String(team.number),
    ].join(" ")
  );
}

export default function AllGraduatesSection({
  edition,
  query,
  onQueryChange,
  activeTeamId,
  onActiveTeamChange,
  onSelectTeam,
  flashTeamId,
}: Props) {
  const { t, locale } = useLanguage();
  const aTrans = t.graduatesPage.allGraduates;
  const isEn = locale === "en";
  const reduce = useReducedMotion();
  const navRef = useRef<HTMLDivElement>(null);

  const tokens = useMemo(
    () => normalizeText(query).split(/\s+/).filter(Boolean),
    [query]
  );
  const searching = tokens.length > 0;

  const matchIds = useMemo(() => {
    const ids = new Set<string>();
    if (!searching) return ids;
    for (const team of edition.teams) {
      for (const m of team.members) {
        const h = haystack(team, m);
        if (tokens.every((t) => h.includes(t))) ids.add(m.id);
      }
    }
    return ids;
  }, [edition, tokens, searching]);

  const total = getGraduatesCount(edition);

  // Scroll-spy for the quick team navigation.
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const probe = 190;
        let current = "";
        for (const team of edition.teams) {
          const el = document.getElementById(team.id);
          if (el && el.getBoundingClientRect().top <= probe) current = team.id;
        }
        if (current) onActiveTeamChange(current);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [edition, onActiveTeamChange]);

  const reveal = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 40 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.1 },
        transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
      };

  const sectionTitle = isEn
    ? edition.copy?.allGraduatesTitleEn ?? "All Graduates"
    : edition.copy?.allGraduatesTitle ?? "كل الخريجين";
  const sectionDesc = isEn
    ? edition.copy?.allGraduatesDescriptionEn
    : edition.copy?.allGraduatesDescription;

  const getResultsCountText = () => {
    if (!searching) {
      if (isEn) {
        return `${total} ${aTrans.totalInTeams} ${edition.teams.length} ${aTrans.teamsLabel}`;
      }
      return `${total} ${aTrans.totalInTeams} ${edition.teams.length} ${aTrans.teamsLabel}`;
    }
    if (matchIds.size === 0) {
      return aTrans.noResults;
    }
    if (isEn) {
      return `${matchIds.size} of ${total} ${aTrans.matchingCount}`;
    }
    return `${matchIds.size} من ${total} ${aTrans.matchingCount}`;
  };

  return (
    <section id="all-graduates" className="gr-all" aria-labelledby="gr-all-title" tabIndex={-1}>
      <div className="gr-container">
        <div className="gr-section-head">
          <p className="gr-eyebrow" dir="ltr">{aTrans.eyebrow}</p>
          <h2 id="gr-all-title" className="gr-section-title">
            {sectionTitle}
          </h2>
          <p className="gr-section-desc">{sectionDesc}</p>
        </div>

        {/* Search */}
        <div className="gr-search" role="search">
          <label htmlFor="gr-search-input" className="gr-sr-only">
            {aTrans.searchPlaceholder}
          </label>
          <span className="gr-search__icon" aria-hidden="true">
            <Search size={20} />
          </span>
          <input
            id="gr-search-input"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder={aTrans.searchPlaceholder}
            autoComplete="off"
            enterKeyHint="search"
          />
          {searching && (
            <button type="button" className="gr-search__clear" onClick={() => onQueryChange("")}>
              <X size={16} aria-hidden="true" /> {aTrans.clearSearch}
            </button>
          )}
        </div>
        <p className="gr-search__count" role="status" aria-live="polite">
          {getResultsCountText()}
        </p>

        {/* Quick team navigation */}
        <nav
          className="gr-teamnav"
          aria-label={isEn ? "Quick team navigation" : "التنقل السريع بين الفرق"}
          ref={navRef}
        >
          <ul>
            {edition.teams.map((team) => {
              const active = activeTeamId === team.id;
              return (
                <li key={team.id}>
                  <button
                    type="button"
                    className={`gr-teamnav__btn ${active ? "is-active" : ""}`}
                    aria-current={active ? "true" : undefined}
                    aria-label={`${aTrans.jumpToTeam} ${team.number}`}
                    onClick={() => onSelectTeam(team.id)}
                  >
                    {team.number}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="gr-teams">
          {edition.teams.map((team) => {
            const awards = edition.awards.filter((a) => a.teamNumber === team.number);
            const teamMatches = team.members.filter((m) => matchIds.has(m.id)).length;
            const dimTeam = searching && teamMatches === 0;
            const teamTitle = isEn ? `Team ${team.number}` : `الفريق ${team.number}`;

            return (
              <motion.section
                key={team.id}
                id={team.id}
                tabIndex={-1}
                aria-labelledby={`${team.id}-title`}
                className={`gr-team ${flashTeamId === team.id ? "is-flash" : ""} ${dimTeam ? "is-dim" : ""}`}
                {...reveal}
              >
                <header className="gr-team__head">
                  <div>
                    <p className="gr-team__label" dir="ltr">TEAM {team.number}</p>
                    <h3 id={`${team.id}-title`} className="gr-team__title">
                      {teamTitle}
                    </h3>
                  </div>
                  {awards.length > 0 && (
                    <ul
                      className="gr-team__awards"
                      aria-label={isEn ? `Awards for Team ${team.number}` : `جوائز الفريق ${team.number}`}
                    >
                      {awards.map((a) => {
                        const awardTitle = isEn ? a.titleEn : a.title;
                        return (
                          <li key={a.id} className="gr-chip">
                            <AwardGlyph icon={a.icon} size={16} />
                            {awardTitle}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </header>

                <ul className="gr-members">
                  {team.members.map((m, i) => (
                    <MemberCard
                      key={m.id}
                      member={m}
                      tone={AVATAR_TONES[i % AVATAR_TONES.length]}
                      state={!searching ? "idle" : matchIds.has(m.id) ? "match" : "dim"}
                      locale={locale}
                    />
                  ))}
                </ul>
              </motion.section>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MemberCard({
  member,
  tone,
  state,
  locale,
}: {
  member: Graduate;
  tone: (typeof AVATAR_TONES)[number];
  state: "idle" | "match" | "dim";
  locale: "ar" | "en";
}) {
  const isEn = locale === "en";
  const name = isEn ? member.nameEn || member.name : member.name;
  const field = isEn ? member.fieldEn || member.field : member.field;
  const org = isEn ? member.orgEn || member.org : member.org;
  const link = member.link;
  const label = link ? getLinkLabel(link.kind, locale) : "";

  return (
    <li className={`gr-member ${state === "match" ? "is-match" : ""} ${state === "dim" ? "is-dim" : ""}`}>
      {/* Faceless BUILDx mascot character icon — replaces previous initials */}
      <div className={`gr-avatar gr-avatar--${tone}`} aria-hidden="true">
        <FacelessCharacterIcon size={34} />
      </div>

      <h4 className="gr-member__name">{name}</h4>
      <p className="gr-member__field">{field}</p>
      {org && <p className="gr-member__org">{org}</p>}
      {link && (
        <a
          className={`gr-link gr-link--${link.kind}`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={
            link.kind === "linkedin"
              ? isEn
                ? `LinkedIn profile of ${name} (opens in new tab)`
                : `LinkedIn — ${name} (يفتح في تبويب جديد)`
              : isEn
                ? `${label} for ${name} (opens in new tab)`
                : `${label} — ${name} (يفتح في تبويب جديد)`
          }
        >
          <LinkKindIcon kind={link.kind} />
          <span>{label}</span>
          <ExternalLink size={14} aria-hidden="true" className="gr-link__ext" />
        </a>
      )}
    </li>
  );
}
