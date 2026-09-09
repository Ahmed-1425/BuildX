"use client";

import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { TeamMember, SocialLinks } from "@/data/team";

// ---------------------------------------------------------------------------
// SVG Brand Icons (LinkedIn, X) + Globe2 from Lucide
// ---------------------------------------------------------------------------

function Globe2Icon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Social Link Item
// ---------------------------------------------------------------------------

type SocialLinkProps = {
  href: string;
  label: string;
  platform: "website" | "linkedin" | "x";
};

const platformColors: Record<string, string> = {
  website: "#c3f937",
  linkedin: "#0A66C2",
  x: "#e7edfd",
};

function SocialLinkItem({ href, label, platform }: SocialLinkProps) {
  const icon =
    platform === "website" ? (
      <Globe2Icon />
    ) : platform === "linkedin" ? (
      <LinkedInIcon />
    ) : (
      <XIcon />
    );

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="team-social-link"
      aria-label={label}
      title={label}
      style={
        { "--hover-color": platformColors[platform] } as React.CSSProperties
      }
    >
      {icon}
    </a>
  );
}

// ---------------------------------------------------------------------------
// TeamMemberCard
// ---------------------------------------------------------------------------

type TeamMemberCardProps = {
  member: TeamMember;
  roleAr?: string;
  roleEn?: string;
  priority?: boolean;
};

export default function TeamMemberCard({
  member,
  roleAr,
  roleEn,
  priority = false,
}: TeamMemberCardProps) {
  const { locale } = useLanguage();
  const isRTL = locale === "ar";

  const name = isRTL ? member.nameAr : member.nameEn;
  const role = isRTL ? roleAr : roleEn;

  // Collect available social links
  const socialLinks: SocialLinkProps[] = [];
  const links: SocialLinks = member.links;

  if (links.website) {
    socialLinks.push({
      href: links.website,
      label: isRTL ? `الموقع الشخصي - ${name}` : `Website - ${name}`,
      platform: "website",
    });
  }
  if (links.linkedin) {
    socialLinks.push({
      href: links.linkedin,
      label: `LinkedIn - ${name}`,
      platform: "linkedin",
    });
  }
  if (links.x) {
    socialLinks.push({
      href: links.x,
      label: `X - ${name}`,
      platform: "x",
    });
  }

  return (
    <article className="team-member-card">
      <div className="team-member-image-wrap">
        <Image
          src={member.imageSrc}
          alt={name}
          width={400}
          height={500}
          className="team-member-image"
          sizes="(max-width: 430px) 90vw, (max-width: 768px) 45vw, (max-width: 1024px) 30vw, 280px"
          priority={priority}
        />
      </div>
      <div className="team-member-info">
        <h3
          className="team-member-name"
          style={{
            fontFamily: isRTL
              ? "var(--font-janna-bold)"
              : "var(--font-bauhaus)",
          }}
        >
          {name}
        </h3>
        {role && (
          <p
            className="team-member-role"
            style={{ fontFamily: "var(--font-janna)" }}
          >
            {role}
          </p>
        )}
        {socialLinks.length > 0 && (
          <div className="team-social-links">
            {socialLinks.map((sl) => (
              <SocialLinkItem key={sl.platform} {...sl} />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
