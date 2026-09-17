"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { ArrowLeft, ArrowRight, MessageCircle, Mail, Headphones } from "lucide-react";

export default function ClosedRegistrationExperience() {
  const { locale } = useLanguage();
  const ar = locale === "ar";

  const waLink = `https://wa.me/966554573554?text=${encodeURIComponent(
    ar
      ? "مرحبًا فريق BUILDx، لدي استفسار بخصوص معسكر BUILDx."
      : "Hello BUILDx team, I have an inquiry regarding the BUILDx camp."
  )}`;

  const emailLink = `mailto:buildx.info0@gmail.com?subject=${encodeURIComponent(
    ar ? "استفسار بخصوص معسكر BUILDx" : "Inquiry regarding BUILDx Camp"
  )}`;

  function handleScrollToSupport() {
    const el = document.getElementById("closed-support-bar");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return (
    <div className="closed-registration-page">
      <div className="closed-registration-container">
        {/* Main Hero Surface */}
        <div className="closed-registration-hero-surface">
          <div className="closed-registration-hero">
            {/* Core Message Content (Right in RTL, Left in LTR) */}
            <div className="closed-registration-content">
              {/* Badge */}
              <div className="closed-registration-badge" role="status">
                <span className="closed-status-dot" aria-hidden="true" />
                <span>{ar ? "التسجيل مغلق حاليًا" : "Registration is currently closed"}</span>
              </div>

              {/* Title */}
              <h1 className="closed-registration-title font-bauhaus">
                {ar ? "اكتملت مقاعد هذه النسخة من BUILDx" : "All seats for this BUILDx edition have been filled"}
              </h1>

              {/* Description */}
              <p className="closed-registration-desc">
                {ar
                  ? "شكرًا لاهتمامكم ورغبتكم في الانضمام. تم إغلاق التسجيل بعد اكتمال المقاعد المتاحة، ونتطلع للقائكم في تجارب BUILDx القادمة."
                  : "Thank you for your interest in joining us. Registration is now closed after all available seats were filled. We look forward to seeing you in future BUILDx experiences."}
              </p>

              {/* Action Buttons */}
              <div className="closed-registration-actions">
                <Link
                  href="/"
                  className="closed-btn-primary group"
                  aria-label={ar ? "العودة إلى الصفحة الرئيسية" : "Back to Home"}
                >
                  <span>{ar ? "العودة إلى الصفحة الرئيسية" : "Back to Home"}</span>
                  {ar ? (
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                  )}
                </Link>

                <button
                  type="button"
                  onClick={handleScrollToSupport}
                  className="closed-btn-secondary"
                  aria-label={ar ? "تواصل معنا" : "Contact Us"}
                >
                  <Headphones className="w-4 h-4 text-slate-300 shrink-0" aria-hidden="true" />
                  <span>{ar ? "تواصل معنا" : "Contact Us"}</span>
                </button>
              </div>

              {/* Compact Integrated Status Bar */}
              <div className="closed-registration-status-bar" aria-label={ar ? "بيانات حالة التسجيل" : "Registration status summary"}>
                <div className="closed-status-item">
                  <span className="closed-status-label">{ar ? "حالة التسجيل" : "Registration Status"}</span>
                  <span className="closed-status-val text-rose-400 font-bold">{ar ? "مغلق" : "Closed"}</span>
                </div>

                <div className="closed-status-divider" aria-hidden="true" />

                <div className="closed-status-item">
                  <span className="closed-status-label">{ar ? "المقاعد المتاحة" : "Available Seats"}</span>
                  <span className="closed-status-val text-slate-200 font-semibold">{ar ? "اكتملت" : "Filled"}</span>
                </div>

                <div className="closed-status-divider" aria-hidden="true" />

                <div className="closed-status-item">
                  <span className="closed-status-label">{ar ? "الإجراء المتاح" : "Next Step"}</span>
                  <span className="closed-status-val text-[#c3f937] font-semibold">{ar ? "متابعة الإعلانات القادمة" : "Follow Announcements"}</span>
                </div>
              </div>
            </div>

            {/* Visual Stage (Left in RTL, Right in LTR) */}
            <div className="closed-registration-visual" aria-hidden="true">
              {/* Technical Backdrop Frame */}
              <div className="closed-visual-stage-frame">
                <div className="closed-visual-bracket top-left" />
                <div className="closed-visual-bracket top-right" />
                <div className="closed-visual-bracket bottom-left" />
                <div className="closed-visual-bracket bottom-right" />
                <div className="closed-visual-scanlines" />
                <div className="closed-visual-watermark">
                  <span>REGISTRATION_STATUS</span>
                  <span>CLOSED</span>
                </div>
              </div>

              {/* Full Floating Pixel Character */}
              <div className="closed-character-wrapper">
                <Image
                  src="/assets/characters/thinking-closed.png"
                  alt=""
                  width={380}
                  height={380}
                  priority
                  className="closed-character-img"
                />
              </div>
            </div>
          </div>

          {/* Integrated Wide Support Bar directly below Hero */}
          <div id="closed-support-bar" className="closed-registration-support">
            <div className="closed-support-text">
              <h3 className="closed-support-title">
                {ar ? "هل لديك استفسار؟" : "Have a question?"}
              </h3>
              <p className="closed-support-subtitle">
                {ar ? "فريق BUILDx متاح لمساعدتك." : "The BUILDx team is available to help."}
              </p>
            </div>

            <div className="closed-support-actions">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="closed-support-btn closed-support-btn--wa"
                aria-label={ar ? "محادثة عبر واتساب" : "Chat on WhatsApp"}
              >
                <MessageCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="font-bold">{ar ? "محادثة عبر WhatsApp" : "Chat on WhatsApp"}</span>
                <span className="closed-support-val" dir="ltr">055 457 3554</span>
              </a>

              <a
                href={emailLink}
                className="closed-support-btn closed-support-btn--email"
                aria-label={ar ? "إرسال بريد إلكتروني" : "Send Email"}
              >
                <Mail className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="font-bold">{ar ? "إرسال بريد إلكتروني" : "Send Email"}</span>
                <span className="closed-support-val" dir="ltr">buildx.info0@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
