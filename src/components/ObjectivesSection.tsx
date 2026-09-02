"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useInView } from "@/hooks/useInView";
import Image from "next/image";

interface ObjectiveItem {
  id: string;
  num: string;
  titleAr: string;
  titleEn: string;
  descAr: string;
  descEn: string;
  icon: string;
  iconAlt: string;
}

const OBJECTIVES_DATA: ObjectiveItem[] = [
  {
    id: "obj-1",
    num: "01",
    titleAr: "تمكين المواهب",
    titleEn: "Empower Talent",
    descAr: "تمكين المشاركين من توظيف الذكاء الاصطناعي في بناء منتجات رقمية قابلة للتجربة والتطوير.",
    descEn: "Enable participants to use AI to build digital products that can be tested and improved.",
    icon: "/assets/icons/people-light.png",
    iconAlt: "Empower Talent Icon",
  },
  {
    id: "obj-2",
    num: "02",
    titleAr: "تطوير المهارات",
    titleEn: "Develop Skills",
    descAr: "تنمية مهارات Vibe Coding وهندسة الأوامر، إلى جانب التفكير التحليلي وحل المشكلات.",
    descEn: "Build capabilities in Vibe Coding, prompt engineering, analytical thinking, and problem-solving.",
    icon: "/assets/icons/development-light.png",
    iconAlt: "Develop Skills Icon",
  },
  {
    id: "obj-3",
    num: "03",
    titleAr: "تحويل الأفكار إلى منتجات",
    titleEn: "Transform Ideas into Products",
    descAr: "تمكين المشاركين من الانتقال من الفكرة إلى منتج رقمي عملي خلال تجربة تطبيقية متكاملة.",
    descEn: "Help participants move from an idea to a working digital product through an integrated practical experience.",
    icon: "/assets/icons/product-light.png",
    iconAlt: "Product Icon",
  },
  {
    id: "obj-4",
    num: "04",
    titleAr: "ربط المواهب بالتحديات",
    titleEn: "Connect Talent with Challenges",
    descAr: "إشراك المشاركين في تحديات واقعية مرتبطة باحتياجات قطاع الأعمال وتطوير حلول لها.",
    descEn: "Engage participants with real business challenges and enable them to develop relevant solutions.",
    icon: "/assets/icons/challenge-light.png",
    iconAlt: "Challenge Icon",
  },
  {
    id: "obj-5",
    num: "05",
    titleAr: "تعزيز الابتكار والتعاون",
    titleEn: "Strengthen Innovation & Collaboration",
    descAr: "تنمية مهارات الابتكار والعمل الجماعي وإدارة المهام من خلال تجربة الهاكاثون.",
    descEn: "Develop innovation, teamwork, and task-management skills through the hackathon experience.",
    icon: "/assets/icons/lamp-light.png",
    iconAlt: "Innovation Icon",
  },
  {
    id: "obj-6",
    num: "06",
    titleAr: "اكتشاف المشاريع الواعدة",
    titleEn: "Discover Promising Projects",
    descAr: "إبراز الحلول والمواهب المتميزة وفتح المجال أمامها للاستمرار والتطوير بعد المعسكر.",
    descEn: "Showcase outstanding talent and solutions and support their potential continuation beyond the camp.",
    icon: "/assets/icons/diamond-light.png",
    iconAlt: "Diamond Icon",
  },
];

export default function ObjectivesSection() {
  const { locale } = useLanguage();
  const { ref, hasBeenInView } = useInView();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const isRTL = locale === "ar";

  // Grouping for the 3-column desktop layout:
  // Column 1 (Right in RTL): 01, 03, 05
  // Column 2 (Center): Core
  // Column 3 (Left in RTL): 02, 04, 06
  const colRight = [OBJECTIVES_DATA[0], OBJECTIVES_DATA[2], OBJECTIVES_DATA[4]];
  const colLeft = [OBJECTIVES_DATA[1], OBJECTIVES_DATA[3], OBJECTIVES_DATA[5]];

  return (
    <section id="objectives" className="objectives-section scroll-mt-20">
      {/* Background Image: صناع الأثر */}
      <div className="objectives-background" aria-hidden="true">
        <img
          src="/assets/backgrounds/impact-makers.png"
          alt=""
        />
      </div>

      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[44rem] h-[26rem] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-12 right-1/4 w-[32rem] h-[20rem] bg-lime/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-12 left-1/4 w-[28rem] h-[18rem] bg-pink/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-10 pointer-events-none" />

      {/* Subtle Ghost Watermark Character */}
      <div className="absolute -top-10 left-10 w-72 h-72 opacity-[0.03] pointer-events-none select-none">
        <Image
          src="/assets/characters/hollow-volt.png"
          alt=""
          width={300}
          height={300}
          className="object-contain"
        />
      </div>

      <div ref={ref} className="relative z-10 w-full">
        {/* ======================================================== */}
        {/* Section Heading                                          */}
        {/* ======================================================== */}
        <div className="objectives-heading px-4 flex flex-col items-center justify-center text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-lime/10 border border-lime/30 text-lime text-xs font-bold mb-3 font-arapix tracking-wider">
            <span className="w-1.5 h-1.5 bg-lime inline-block animate-pulse" />
            <span>{isRTL ? "مهام المعسكر" : "CAMP MISSIONS"}</span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={hasBeenInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="section-title text-center w-full"
            style={{ fontFamily: isRTL ? "var(--font-news-almstqbl)" : "var(--font-bauhaus)" }}
          >
            {isRTL ? "أهداف المعسكر" : "Camp Objectives"}
          </motion.h2>

          <p
            className="text-base sm:text-lg lg:text-xl text-light/75 max-w-2xl mx-auto mt-4 leading-relaxed text-center"
            style={{ fontFamily: "var(--font-janna)", textAlign: "center" }}
          >
            {isRTL
              ? "ست مهام تقود المشاركين من اكتساب المهارة إلى صناعة منتج رقمي فعّال."
              : "Six missions that take participants from developing skills to creating a functional digital product."}
          </p>

          <div className="objectives-heading-accent" />
        </div>

        {/* ======================================================== */}
        {/* Mission Map (Desktop: Staggered Orbit / Mobile: Vertical) */}
        {/* ======================================================== */}
        <div className="objectives-map">
          
          {/* Column 1: Objectives 01, 03, 05 (Right in RTL, Left in LTR) */}
          <div className="flex flex-col gap-6 sm:gap-8 justify-between z-10">
            {colRight.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
                animate={hasBeenInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + idx * 0.12 }}
                onMouseEnter={() => setHoveredNode(item.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`objective-node group ${
                  idx === 1 ? "lg:translate-x-4 rtl:lg:-translate-x-4" : ""
                }`}
              >
                {/* Node Header: Number + Icon */}
                <div className="flex items-center justify-between gap-3 relative z-10">
                  <span className="objective-number">
                    {item.num} //
                  </span>
                  <div className="p-2 bg-[#0c1018]/80 border border-light/15 rounded-lg group-hover:border-lime/50 transition-colors shrink-0">
                    <Image
                      src={item.icon}
                      alt={item.iconAlt}
                      width={22}
                      height={22}
                      className="object-contain drop-shadow-[0_0_6px_rgba(231,237,253,0.4)]"
                    />
                  </div>
                </div>

                <h3
                  className="objective-title group-hover:text-lime transition-colors"
                  style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
                >
                  {isRTL ? item.titleAr : item.titleEn}
                </h3>

                <p
                  className="objective-description"
                  style={{ fontFamily: "var(--font-janna)" }}
                >
                  {isRTL ? item.descAr : item.descEn}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Column 2: Central Puzzle / Energy Core */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={hasBeenInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="objectives-core"
          >
            {/* Ambient Pulse Ring */}
            <div className="absolute inset-0 rounded-[28px] border border-lime/30 pointer-events-none opacity-60" />

            {/* Orbiting mission nodes points */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-lime rounded-full shadow-[0_0_8px_#c3f937]" />
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-2 h-2 bg-pink rounded-full shadow-[0_0_8px_#fb50c3]" />
            <div className="absolute top-1/3 -right-2 w-2 h-2 bg-lime rounded-full shadow-[0_0_8px_#c3f937]" />
            <div className="absolute bottom-1/3 -right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_#823419]" />
            <div className="absolute top-1/3 -left-2 w-2 h-2 bg-pink rounded-full shadow-[0_0_8px_#fb50c3]" />
            <div className="absolute bottom-1/3 -left-2 w-2 h-2 bg-lime rounded-full shadow-[0_0_8px_#c3f937]" />

            {/* Character Icon inside Core */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 mb-2 flex items-center justify-center">
              <Image
                src="/assets/characters/building.png"
                alt="BUILDx Core Character"
                width={90}
                height={90}
                className="object-contain drop-shadow-[0_0_16px_rgba(195,249,55,0.4)] hover:scale-105 transition-transform"
              />
            </div>

            {/* Core Label */}
            <span
              className="text-xl sm:text-2xl font-bold text-light tracking-wide"
              style={{ fontFamily: "var(--font-arapix)" }}
            >
              BUILD<span className="text-lime">x</span>
            </span>

            <span
              className="text-xs sm:text-sm text-lime/90 font-bold mt-1 tracking-wider"
              style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
            >
              {isRTL ? "من الفكرة إلى المنتج" : "From Idea to Product"}
            </span>
          </motion.div>

          {/* Column 3: Objectives 02, 04, 06 (Left in RTL, Right in LTR) */}
          <div className="flex flex-col gap-6 sm:gap-8 justify-between z-10">
            {colLeft.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
                animate={hasBeenInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.25 + idx * 0.12 }}
                onMouseEnter={() => setHoveredNode(item.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`objective-node group ${
                  idx === 1 ? "lg:-translate-x-4 rtl:lg:translate-x-4" : ""
                }`}
              >
                {/* Node Header: Number + Icon */}
                <div className="flex items-center justify-between gap-3 relative z-10">
                  <span className="objective-number">
                    {item.num} //
                  </span>
                  <div className="p-2 bg-[#0c1018]/80 border border-light/15 rounded-lg group-hover:border-lime/50 transition-colors shrink-0">
                    <Image
                      src={item.icon}
                      alt={item.iconAlt}
                      width={22}
                      height={22}
                      className="object-contain drop-shadow-[0_0_6px_rgba(231,237,253,0.4)]"
                    />
                  </div>
                </div>

                <h3
                  className="objective-title group-hover:text-lime transition-colors"
                  style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
                >
                  {isRTL ? item.titleAr : item.titleEn}
                </h3>

                <p
                  className="objective-description"
                  style={{ fontFamily: "var(--font-janna)" }}
                >
                  {isRTL ? item.descAr : item.descEn}
                </p>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
