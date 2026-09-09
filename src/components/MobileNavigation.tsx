"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

export default function MobileHeader() {
  const { locale } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const isOnTeamPage = pathname === "/team";
  const isRTL = locale === "ar";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`mobile-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0c1018]/95 backdrop-blur-md border-b border-[#c3f937]/20"
          : "bg-[#0c1018]/60 backdrop-blur-sm"
      }`}
      style={{
        height: "var(--mobile-header-height, 84px)",
        alignItems: "center",
        justifyContent: "space-between",
        paddingInline: "16px",
        display: "flex",
      }}
    >
      <Link
        href="/"
        onClick={(e) => {
          if (pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
        className="flex items-center"
      >
        <Image
          src="/assets/logos/logo-white-glow.png"
          alt="BUILDx"
          width={130}
          height={38}
          className="object-contain"
          priority
        />
      </Link>

      <div className="flex items-center gap-2">
        {isOnTeamPage ? (
          <>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined" && window.history.length > 1) {
                  router.back();
                } else {
                  router.push("/");
                }
              }}
              className="mobile-header-back-btn"
              aria-label={isRTL ? "رجوع للصفحة السابقة" : "Back to previous page"}
            >
              <svg
                width="15"
                height="15"
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
              <span>{isRTL ? "رجوع" : "Back"}</span>
            </button>

            <Link
              href="/"
              className="mobile-header-home-btn"
              aria-label={isRTL ? "الرئيسية" : "Home"}
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
          </>
        ) : (
          <Link
            href="/team"
            className="mobile-team-link"
            aria-label={locale === "ar" ? "فريق العمل" : "Team"}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              color: "#e7edfd",
              opacity: 0.8,
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </Link>
        )}
        <LanguageSwitcher />
      </div>
    </header>
  );
}

const CHARACTER_IMAGES: Record<string, string> = {
  ready: "/assets/navigation-states/ready.png",
  thinking: "/assets/navigation-states/thinking.png",
  building: "/assets/navigation-states/building.png",
  loading: "/assets/navigation-states/loading.png",
  success: "/assets/navigation-states/success.png",
};

function getNavigationCharacter(progress: number): "ready" | "thinking" | "building" | "loading" | "success" {
  if (progress >= 0.94) return "success";
  if (progress >= 0.70) return "loading";
  if (progress >= 0.38) return "building";
  if (progress >= 0.15) return "thinking";
  return "ready";
}

export function MobileBottomNavigation() {
  const { t, locale } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const [navMode, setNavMode] = useState<"expanded" | "compact">("expanded");
  const [characterState, setCharacterState] = useState<"ready" | "thinking" | "building" | "loading" | "success">("ready");
  const [activeSection, setActiveSection] = useState(() => {
    if (typeof window !== "undefined") {
      if (window.location.pathname === "/register") return "register";
      if (window.location.pathname === "/team") return "team";
    }
    return "home";
  });
  const lastScrollY = useRef(0);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keepExpandedUntil = useRef(0);
  const lastCharSwitch = useRef(0);

  useEffect(() => {
    if (pathname === "/team") {
      setActiveSection("team");
      setNavMode("expanded");
    } else if (pathname === "/register") {
      setActiveSection("register");
    } else if (pathname === "/") {
      if (window.scrollY < 180) {
        setActiveSection("home");
      }
    }
  }, [pathname]);

  useEffect(() => {
    const checkHash = () => {
      if (typeof window !== "undefined") {
        const hash = window.location.hash;
        if (hash === "#compact" || hash.startsWith("#compact-")) {
          setNavMode("compact");
          if (hash === "#compact-ready") setCharacterState("ready");
          if (hash === "#compact-thinking") setCharacterState("thinking");
          if (hash === "#compact-building") setCharacterState("building");
          if (hash === "#compact-loading") setCharacterState("loading");
          if (hash === "#compact-success") setCharacterState("success");
        }
      }
    };

    checkHash();
    window.addEventListener("hashchange", checkHash);
    return () => window.removeEventListener("hashchange", checkHash);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // 1. If on /team, keep bottom nav always expanded and active
      if (pathname === "/team") {
        setActiveSection("team");
        setNavMode("expanded");
        return;
      }

      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // Active section detection on homepage / subpages
      if (pathname === "/register") {
        setActiveSection("register");
      } else {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;

        if (currentY + clientHeight >= scrollHeight - 90) {
          setActiveSection("register");
        } else if (currentY < 180) {
          setActiveSection("home");
        } else {
          const journeyEl = document.getElementById("journey");
          const aboutEl = document.getElementById("about");

          if (journeyEl && journeyEl.getBoundingClientRect().top <= 320) {
            setActiveSection("journey");
          } else if (aboutEl && aboutEl.getBoundingClientRect().top <= 320) {
            setActiveSection("about");
          }
        }
      }

      // 2. Character state based on scroll progress
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.max(0, Math.min(1, currentY / maxScroll)) : 0;

      const now = Date.now();
      if (now - lastCharSwitch.current > 120) {
        setCharacterState(getNavigationCharacter(progress));
        lastCharSwitch.current = now;
      }

      // Ignore micro jitters (< 6px)
      if (Math.abs(delta) < 6) return;

      const nearTop = currentY <= 30;
      const nearBottom = progress >= 0.94;
      const scrollingDown = delta > 6;
      const scrollingUp = delta < -6;

      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }

      // If clicked a link, keep expanded for 1 second
      if (now < keepExpandedUntil.current) {
        setNavMode("expanded");
        lastScrollY.current = currentY;
        return;
      }

      if (nearTop || scrollingUp) {
        setNavMode("expanded");
      } else if (scrollingDown) {
        setNavMode("compact");
      }

      // Re-expand after scrolling stops: 450ms near bottom, 280ms otherwise
      idleTimer.current = setTimeout(() => {
        if (typeof window !== "undefined" && window.location.hash.startsWith("#compact")) return;
        setNavMode("expanded");
      }, nearBottom ? 450 : 280);

      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
      }
    };
  }, [pathname]);

  const handleItemClick = (e: React.MouseEvent, key: string, href: string) => {
    setNavMode("expanded");
    keepExpandedUntil.current = Date.now() + 1000;

    if (pathname === "/") {
      if (key === "home") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection("home");
        return;
      }
      if (key !== "register" && key !== "team") {
        e.preventDefault();
        const targetEl = document.getElementById(key);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: "smooth" });
          setActiveSection(key);
        }
      }
    } else {
      if (key === "team" && pathname === "/team") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      if (key === "home") {
        e.preventDefault();
        router.push("/");
        return;
      }
    }
  };

  const navItems = [
    {
      key: "home",
      label: t.nav.home,
      href: "/",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3 10.5L12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <rect x="10" y="15" width="4" height="6" fill="currentColor" opacity="0.4" />
        </svg>
      ),
    },
    {
      key: "about",
      label: t.nav.aboutCamp,
      href: "/#about",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            x="4"
            y="4"
            width="16"
            height="16"
            rx="2"
            stroke="currentColor"
            strokeWidth="2"
          />
          <line x1="8" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="8" y1="13" x2="14" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="8" cy="17" r="1" fill="currentColor" />
        </svg>
      ),
    },
    {
      key: "journey",
      label: t.nav.journey,
      href: "/#journey",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 19L9 13.5L14 17L20 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="6" r="2.5" fill="currentColor" />
          <circle cx="4" cy="19" r="2" fill="currentColor" opacity="0.6" />
        </svg>
      ),
    },
    {
      key: "register",
      label: t.nav.register,
      href: "/register",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M10 17l5-5-5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: "team",
      label: locale === "ar" ? "فريق العمل" : "Team",
      href: "/team",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
          <path
            d="M22 21v-2a4 4 0 0 0-3-3.87"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 3.13a4 4 0 0 1 0 7.75"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="mobile-nav-stage">
      <nav
        className={`game-bottom-nav ${
          navMode === "compact" ? "is-compact" : "is-expanded"
        }`}
        aria-label={locale === "ar" ? "التنقل الرئيسي" : "Main Navigation"}
      >
        {navMode === "expanded" ? (
          <div className="expanded-navigation">
            {navItems.map((item) => {
              const isActive = activeSection === item.key;

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={(e) => handleItemClick(e, item.key, item.href)}
                  className={`game-nav-item ${isActive ? "is-active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setNavMode("expanded")}
            className="compact-character"
            aria-label={locale === "ar" ? "فتح قائمة التنقل" : "Open Navigation"}
          >
            <Image
              src={CHARACTER_IMAGES[characterState] || CHARACTER_IMAGES.ready}
              alt={characterState}
              width={52}
              height={52}
              className="object-contain"
              priority
            />
          </button>
        )}
      </nav>
    </div>
  );
}
