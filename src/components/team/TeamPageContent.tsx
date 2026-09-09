"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import { teamSections, getMemberById } from "@/data/team";
import TeamMemberCard from "./TeamMemberCard";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

// ---------------------------------------------------------------------------
// Floating Quick-Return Bar
// ---------------------------------------------------------------------------

function FloatingReturnBar() {
  const { locale } = useLanguage();
  const router = useRouter();
  const isRTL = locale === "ar";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <aside
      className="team-floating-return-bar"
      aria-label={isRTL ? "شريط العودة السريعة" : "Quick return bar"}
    >
      <button
        type="button"
        onClick={() => {
          if (typeof window !== "undefined" && window.history.length > 1) {
            router.back();
          } else {
            router.push("/");
          }
        }}
        className="team-floating-btn primary font-janna"
        title={isRTL ? "الرجوع للصفحة السابقة" : "Back to previous page"}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transform: isRTL ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        <span>{isRTL ? "رجوع للي كنت فيه" : "Back"}</span>
      </button>

      <Link
        href="/"
        className="team-floating-btn secondary font-janna"
        title={isRTL ? "العودة للرئيسية" : "Return to Homepage"}
      >
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
        </svg>
        <span>{isRTL ? "الرئيسية" : "Home"}</span>
      </Link>

      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="team-floating-btn icon-only"
        aria-label={isRTL ? "العودة للأعلى" : "Scroll to top"}
        title={isRTL ? "للأعلى" : "Top"}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// Section Index (Anchor Navigation)
// ---------------------------------------------------------------------------

function SectionIndex() {
  const { locale } = useLanguage();
  const isRTL = locale === "ar";

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="team-section-index"
      aria-label={isRTL ? "فهرس الأقسام" : "Section Index"}
    >
      <div className="team-section-index-scroll">
        {teamSections.map((section, i) => (
          <button
            key={section.id}
            type="button"
            onClick={() => handleClick(section.id)}
            className="team-index-chip"
          >
            <span className="team-index-chip-num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span>{isRTL ? section.titleAr : section.titleEn}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// ---------------------------------------------------------------------------
// Section Header
// ---------------------------------------------------------------------------

function SectionHeader({
  index,
  section,
}: {
  index: number;
  section: (typeof teamSections)[0];
}) {
  const { locale } = useLanguage();
  const isRTL = locale === "ar";
  const title = isRTL ? section.titleAr : section.titleEn;
  const memberCount = section.members.length;
  const memberLabel = isRTL
    ? memberCount === 1
      ? "عضو"
      : "أعضاء"
    : memberCount === 1
      ? "Member"
      : "Members";

  return (
    <div className="team-section-header">
      <div className="team-section-header-top">
        <span className="team-section-num font-arapix">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h2
          className="team-section-title"
          id={`${section.id}-title`}
          style={{
            fontFamily: isRTL
              ? "var(--font-news-almstqbl)"
              : "var(--font-bauhaus)",
          }}
        >
          {title}
        </h2>
      </div>
      <div className="team-section-meta">
        <span className="team-section-accent" />
        <span className="team-section-count font-arapix">
          {memberCount} {memberLabel}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Grid Layouts
// ---------------------------------------------------------------------------

function renderMembers(
  section: (typeof teamSections)[0],
  locale: string,
  sectionIdx: number,
) {
  const sorted = [...section.members].sort((a, b) => a.order - b.order);

  return sorted.map((sm, i) => {
    const member = getMemberById(sm.memberId);
    if (!member) return null;
    return (
      <TeamMemberCard
        key={`${section.id}-${sm.memberId}`}
        member={member}
        roleAr={sm.roleAr}
        roleEn={sm.roleEn}
        priority={sectionIdx < 2 && i < 3}
      />
    );
  });
}

// ---------------------------------------------------------------------------
// Team Page Content
// ---------------------------------------------------------------------------

export default function TeamPageContent() {
  const { t, locale } = useLanguage();
  const router = useRouter();
  const isRTL = locale === "ar";
  const { ref: heroRef, hasBeenInView: heroVisible } = useInView();

  return (
    <div className="team-page">
      {/* ================================================================ */}
      {/* HERO                                                             */}
      {/* ================================================================ */}
      <section className="team-hero" ref={heroRef}>
        <div className="team-container">
          <motion.div
            className="team-hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={heroVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="team-hero-nav-actions">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && window.history.length > 1) {
                    router.back();
                  } else {
                    router.push("/");
                  }
                }}
                className="team-back-button font-janna"
                aria-label={isRTL ? "رجوع للصفحة السابقة" : "Back to previous page"}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transform: isRTL ? "rotate(180deg)" : "rotate(0deg)" }}
                  aria-hidden="true"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>{isRTL ? "رجوع للي كنت فيه" : "Back"}</span>
              </button>

              <Link
                href="/"
                className="team-home-pill font-janna"
                aria-label={isRTL ? "الصفحة الرئيسية" : "Homepage"}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
                </svg>
                <span>{isRTL ? "الرئيسية" : "Home"}</span>
              </Link>
            </div>
            <span
              className="team-hero-badge font-arapix"
            >
              {t.teamPage.badge}
            </span>
            <h1
              className="team-hero-title"
              style={{
                fontFamily: isRTL
                  ? "var(--font-news-almstqbl)"
                  : "var(--font-bauhaus)",
              }}
            >
              {t.teamPage.heroTitle}
            </h1>
            <p
              className="team-hero-description"
              style={{ fontFamily: "var(--font-janna)" }}
            >
              {t.teamPage.heroDescription}
            </p>
          </motion.div>

          {/* Visual: Character collage */}
          <motion.div
            className="team-hero-visual"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={heroVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <div className="team-hero-characters">
              <Image
                src="/assets/characters/char-ready.png"
                alt=""
                width={72}
                height={72}
                className="team-hero-char team-hero-char-1"
                aria-hidden="true"
              />
              <Image
                src="/assets/characters/char-building.png"
                alt=""
                width={64}
                height={64}
                className="team-hero-char team-hero-char-2"
                aria-hidden="true"
              />
              <Image
                src="/assets/characters/char-success.png"
                alt=""
                width={72}
                height={72}
                className="team-hero-char team-hero-char-3"
                aria-hidden="true"
              />
              <Image
                src="/assets/characters/char-thinking.png"
                alt=""
                width={56}
                height={56}
                className="team-hero-char team-hero-char-4"
                aria-hidden="true"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================================================================ */}
      {/* SECTION INDEX                                                    */}
      {/* ================================================================ */}
      <div className="team-container">
        <SectionIndex />
      </div>

      {/* ================================================================ */}
      {/* TEAM SECTIONS                                                    */}
      {/* ================================================================ */}
      {teamSections.map((section, idx) => (
        <section
          key={section.id}
          id={section.id}
          className={`team-section team-section-alt-${idx % 2 === 0 ? "a" : "b"}`}
          aria-labelledby={`${section.id}-title`}
        >
          <div className="team-container">
            <SectionHeader index={idx} section={section} />
            <div className="team-grid">
              {renderMembers(section, locale, idx)}
            </div>
          </div>
        </section>
      ))}

      {/* Floating Quick-Return Bar */}
      <FloatingReturnBar />
    </div>
  );
}
