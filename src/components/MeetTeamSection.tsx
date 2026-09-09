"use client";

import { useLanguage } from "@/context/LanguageContext";
import { teamMembers } from "@/data/team";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";

// Pick 5 distinct members for the collage (first few with actual photos)
const collageMembers = [
  teamMembers.find((m) => m.id === "ahmed-alrashid")!,
  teamMembers.find((m) => m.id === "abdulrazaq-aldawsaeri")!,
  teamMembers.find((m) => m.id === "saud-bin-tuays")!,
  teamMembers.find((m) => m.id === "khaled-alotaibi")!,
  teamMembers.find((m) => m.id === "mohammed-alziyad")!,
];

export default function MeetTeamSection() {
  const { t, locale } = useLanguage();
  const isRTL = locale === "ar";
  const { ref, hasBeenInView } = useInView();

  const departments = isRTL
    ? [
        "إدارة المشروع",
        "الإدارة التنفيذية",
        "الإعلام",
        "العلاقات العامة",
        "المرشدين والميسر",
        "التحكيم",
      ]
    : [
        "Project Management",
        "Executive",
        "Media",
        "Public Relations",
        "Mentors & Facilitator",
        "Judging",
      ];

  return (
    <section
      className="meet-team-section"
      aria-labelledby="meet-team-title"
      ref={ref}
    >
      <div className="meet-team-container">
        <motion.div
          className="meet-team-content"
          initial={{ opacity: 0, y: 30 }}
          animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2
            id="meet-team-title"
            className="meet-team-title"
            style={{
              fontFamily: isRTL
                ? "var(--font-news-almstqbl)"
                : "var(--font-bauhaus)",
            }}
          >
            {t.meetTeam.title}
          </h2>
          <p
            className="meet-team-description"
            style={{ fontFamily: "var(--font-janna)" }}
          >
            {t.meetTeam.description}
          </p>

          {/* Department chips */}
          <div className="meet-team-departments">
            {departments.map((dept) => (
              <span key={dept} className="meet-team-dept-chip font-arapix">
                {dept}
              </span>
            ))}
          </div>

          <Link
            href="/team"
            className="meet-team-button"
            style={{ fontFamily: "var(--font-janna-bold)" }}
          >
            <span className="w-2 h-2 bg-dark rotate-45 shrink-0" />
            <span>{t.meetTeam.button}</span>
          </Link>
        </motion.div>

        {/* Collage */}
        <motion.div
          className="meet-team-collage"
          initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
          animate={hasBeenInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {collageMembers.map((member, i) => (
            <div
              key={member.id}
              className={`meet-team-collage-item meet-team-collage-item-${i + 1}`}
            >
              <Image
                src={member.imageSrc}
                alt={isRTL ? member.nameAr : member.nameEn}
                width={120}
                height={150}
                className="meet-team-collage-img"
                sizes="120px"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
