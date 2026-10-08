import {
  AppWindow,
  Cpu,
  Globe,
  HeartHandshake,
  Lightbulb,
  Presentation,
  Rocket,
  Trophy,
} from "lucide-react";
import type { AwardIcon, MemberLinkKind } from "@/data/graduates";

export function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
    </svg>
  );
}

export function LinkKindIcon({ kind, size = 18 }: { kind: MemberLinkKind; size?: number }) {
  if (kind === "linkedin") return <LinkedInIcon size={size} />;
  if (kind === "app") return <AppWindow size={size} aria-hidden="true" />;
  return <Globe size={size} aria-hidden="true" />;
}

export function AwardGlyph({ icon, size = 22 }: { icon?: AwardIcon; size?: number }) {
  const props = { size, "aria-hidden": true, strokeWidth: 2.2 } as const;
  switch (icon) {
    case "presentation":
      return <Presentation {...props} />;
    case "product":
      return <Rocket {...props} />;
    case "impact":
      return <HeartHandshake {...props} />;
    case "innovation":
      return <Lightbulb {...props} />;
    case "ai":
      return <Cpu {...props} />;
    default:
      return <Trophy {...props} />;
  }
}

/**
 * The official BUILDx mascot character silhouette without facial features (no eyes, no mouth).
 * Pixel-perfect stepped 8-bit silhouette.
 */
export function FacelessCharacterIcon({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 968 1005"
      width={size}
      height={size}
      fill="currentColor"
      shapeRendering="crispEdges"
      aria-hidden="true"
      className={className}
    >
      <path d="M445 0 H725 V242 H968 V523 H857 V725 H968 V1005 H202 V892 H96 V765 H0 V485 H201 V243 H320 V121 H445 Z" />
    </svg>
  );
}


