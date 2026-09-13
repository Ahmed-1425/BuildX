"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import Image from "next/image";
import Link from "next/link";

const NAV_SECTIONS = [
  { key: "home", id: "home", href: "/" },
  { key: "about", id: "about", href: "/#about" },
  { key: "objectives", id: "objectives", href: "/#objectives" },
  { key: "trainer", id: "trainer", href: "/#trainer" },
  { key: "journey", id: "journey", href: "/#journey" },
] as const;

export default function Header() {
  const { t, locale } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const isTeamPage = pathname === "/team";
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== "undefined" && window.location.pathname === "/team") {
      return "team";
    }
    return "";
  });

  useEffect(() => {
    if (pathname === "/team") {
      setActiveSection("team");
      return;
    }

    const handleScroll = () => {
      const sections = ["about", "objectives", "trainer", "journey"];
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            setActiveSection(sections[i]);
            return;
          }
        }
      }
      if (window.scrollY < 200) {
        setActiveSection("home");
      } else {
        setActiveSection("");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    if (typeof window === "undefined") return;
    if (pathname === "/") {
      e.preventDefault();
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection("home");
        return;
      }
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setActiveSection(id);
      }
    }
  };

  return (
    <>
      <style jsx global>{`
        .site-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: rgba(12, 16, 24, 0.94);
          border-bottom: 1px solid rgba(195, 249, 55, 0.18);
          backdrop-filter: blur(14px);
        }

        .header-inner {
          width: min(calc(100% - 64px), 1480px);
          min-height: 88px;
          margin-inline: auto;
          display: grid;
          grid-template-columns: minmax(170px, auto) 1fr auto;
          align-items: center;
          column-gap: clamp(24px, 3vw, 56px);
        }

        .header-brand {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          padding-inline: 12px;
        }

        .header-logo {
          display: block;
          width: clamp(150px, 12vw, 205px);
          height: auto;
          object-fit: contain;
        }

        .desktop-navigation {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(20px, 2vw, 40px);
          white-space: nowrap;
        }

        .nav-link {
          position: relative;
          display: inline-flex;
          align-items: center;
          min-height: 44px;
          padding: 8px 0;
          color: #e7edfd;
          font-size: clamp(14px, 1.02vw, 18px);
          font-weight: 700;
          line-height: 1;
          text-decoration: none;
          opacity: 0.82;
          background: transparent;
          border: 0;
          cursor: pointer;
          transition:
            color 180ms ease,
            opacity 180ms ease,
            transform 180ms ease;
          font-family: var(--font-janna-bold), sans-serif;
        }

        .nav-link:hover,
        .nav-link.active {
          color: #c3f937;
          opacity: 1;
          transform: translateY(-1px);
        }

        .nav-link::after {
          content: "";
          position: absolute;
          right: 50%;
          bottom: 2px;
          width: 0;
          height: 3px;
          background: #c3f937;
          transform: translateX(50%);
          transition: width 180ms ease;
        }

        .nav-link:hover::after,
        .nav-link.active::after {
          width: 100%;
        }

        .header-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: clamp(12px, 1.4vw, 20px);
          white-space: nowrap;
        }

        .language-switch {
          position: relative;
          display: inline-grid;
          grid-template-columns: 1fr 1fr;
          width: 112px;
          height: 46px;
          padding: 4px;
          background: #0c1018;
          border: 2px solid #823419;
          box-shadow: 4px 4px 0 #34155f;
          overflow: hidden;
        }

        .language-option {
          position: relative;
          z-index: 1;
          display: grid;
          place-items: center;
          border: 0;
          background: transparent;
          color: #e7edfd;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: color 150ms ease;
        }

        .language-option.active {
          color: #0c1018;
        }

        .header-register-button {
          min-width: 142px;
          height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding-inline: 24px;
          background: #c3f937;
          color: #0c1018;
          border: 2px solid #c3f937;
          box-shadow: 5px 5px 0 #823419;
          font-size: 17px;
          font-weight: 800;
          text-decoration: none;
          font-family: var(--font-janna-bold), sans-serif;
          transition:
            transform 150ms ease,
            box-shadow 150ms ease,
            background-color 150ms ease;
        }

        .header-register-button:hover {
          background: #fb50c3;
          border-color: #fb50c3;
          transform: translate(-2px, -2px);
          box-shadow: 7px 7px 0 #823419;
        }

        .header-register-button:active {
          transform: translate(3px, 3px);
          box-shadow: 2px 2px 0 #823419;
        }

        .header-partner-divider {
          width: 1px;
          height: 34px;
          background: rgba(231, 237, 253, 0.18);
          margin-inline: 2px;
          flex-shrink: 0;
        }

        .header-partner-badge {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          cursor: pointer;
          transition:
            transform 200ms cubic-bezier(0.16, 1, 0.3, 1),
            filter 200ms ease;
        }

        .header-partner-badge:hover {
          transform: translateY(-2px) scale(1.06);
          filter: drop-shadow(0 0 14px rgba(195, 249, 55, 0.45));
        }

        .header-partner-img {
          display: block;
          width: auto;
          height: 50px;
          max-width: 52px;
          object-fit: contain;
        }

        /* Desktop responsiveness (1024px to 1200px) */
        @media (min-width: 1024px) and (max-width: 1200px) {
          .header-inner {
            width: min(100% - 32px, 1160px);
            grid-template-columns: auto 1fr auto;
            gap: 16px;
          }

          .desktop-navigation {
            gap: 14px;
          }

          .nav-link {
            font-size: 14px;
          }

          .header-logo {
            width: 140px;
          }

          .language-switch {
            width: 92px;
            height: 42px;
          }

          .header-register-button {
            min-width: 110px;
            height: 44px;
            padding-inline: 16px;
            font-size: 14px;
          }

          .header-partner-img {
            height: 42px;
          }
        }

        /* Mobile vs Desktop Display Rules */
        @media (min-width: 1024px) {
          .desktop-header {
            display: block !important;
          }
          .mobile-header {
            display: none !important;
          }
          .mobile-bottom-navigation,
          .mobile-nav-shell,
          .mobile-bottom-nav,
          .mobile-nav-stage,
          .game-bottom-nav {
            display: none !important;
          }
        }

        @media (max-width: 1023px) {
          .desktop-header {
            display: none !important;
          }
          .mobile-header {
            display: flex !important;
          }
          .mobile-bottom-navigation {
            display: flex !important;
          }
        }
      `}</style>

      <header className="site-header desktop-header">
        <div className="header-inner">
          {/* Brand Logo */}
          <div className="header-brand">
            <Link
              href="/"
              onClick={(e) => {
                if (window.location.pathname === "/") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              <Image
                src="/assets/logos/logo-white-glow.png"
                alt="BUILDx"
                width={190}
                height={54}
                className="header-logo"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav
            className="desktop-navigation"
            role="navigation"
            aria-label="Main navigation"
          >
            {NAV_SECTIONS.map((section) => (
              <Link
                key={section.key}
                href={section.href}
                onClick={(e) => handleNavClick(e, section.id)}
                className={`nav-link ${
                  activeSection === section.id ? "active" : ""
                }`}
              >
                {t.nav[section.key as keyof typeof t.nav]}
              </Link>
            ))}
            <Link
              href="/team"
              className={`nav-link ${activeSection === "team" ? "active" : ""}`}
            >
              {t.nav.team}
            </Link>
          </nav>

          {/* Header Actions (Language switch + Register button) */}
          <div className="header-actions">
            {isTeamPage && (
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined" && window.history.length > 1) {
                    router.back();
                  } else {
                    router.push("/");
                  }
                }}
                className="header-team-back-button"
                aria-label={locale === "ar" ? "رجوع للصفحة السابقة" : "Back to previous page"}
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
                  style={{
                    transform: locale === "ar" ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                <span>{locale === "ar" ? "رجوع" : "Back"}</span>
              </button>
            )}
            <LanguageSwitcher />
            <Link href="/register" className="header-register-button">
              {t.nav.register}
            </Link>
            <div className="header-partner-divider" aria-hidden="true" />
            <div
              className="header-partner-badge"
              title={locale === "ar" ? "شعار الشراكة — أنماء وشراكة" : "Partnership Logo — Inmaa wa Sharaka"}
            >
              <Image
                src="/assets/logos/partnership-logo.png"
                alt={locale === "ar" ? "شعار الشراكة — أنماء وشراكة" : "Partnership Logo — Inmaa wa Sharaka"}
                width={50}
                height={55}
                className="header-partner-img"
                priority
              />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
