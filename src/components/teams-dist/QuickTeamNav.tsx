"use client";

import { useEffect, useState, useCallback } from "react";
import { TEAMS_DATA } from "@/data/teamsDistribution";

interface QuickTeamNavProps {
  onSelectTeam: (teamId: string) => void;
  activeTeamId?: string;
}

export default function QuickTeamNav({ onSelectTeam, activeTeamId }: QuickTeamNavProps) {
  const [currentActive, setCurrentActive] = useState<string>(activeTeamId || "team-10");

  useEffect(() => {
    if (activeTeamId) setCurrentActive(activeTeamId);
  }, [activeTeamId]);

  // ScrollSpy: track which section is in view
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const team of TEAMS_DATA) {
        const el = document.getElementById(team.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setCurrentActive(team.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClick = useCallback((teamId: string) => {
    setCurrentActive(teamId);
    onSelectTeam(teamId);
  }, [onSelectTeam]);

  return (
    <div className="sticky top-0 z-40 w-full mb-16">
      {/* Frosted glass bar */}
      <div
        className="backdrop-blur-xl"
        style={{
          backgroundColor: "rgba(12,16,24,0.85)",
          borderBottom: "1px solid var(--buildx-border)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-start sm:justify-center gap-0 overflow-x-auto no-scrollbar py-1">
            {TEAMS_DATA.map((team) => {
              const isActive = currentActive === team.id;
              return (
                <button
                  key={team.id}
                  onClick={() => handleClick(team.id)}
                  className="group relative shrink-0 px-4 sm:px-5 py-3.5 text-sm transition-colors duration-200 cursor-pointer select-none"
                  style={{ fontFamily: "var(--font-arapix)" }}
                >
                  <span
                    className="relative z-10 transition-colors duration-200"
                    style={{ color: isActive ? "var(--buildx-lime)" : "rgba(231,237,253,0.5)" }}
                  >
                    فريق {team.number}
                  </span>

                  {/* Active indicator bar */}
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-300"
                    style={{
                      width: isActive ? "60%" : "0%",
                      background: isActive
                        ? "linear-gradient(90deg, transparent, var(--buildx-lime), transparent)"
                        : "transparent",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
