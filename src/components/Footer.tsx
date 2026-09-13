"use client";

import { useLanguage } from "@/context/LanguageContext";
import Image from "next/image";
import { partners } from "@/data/team";

export default function Footer() {
  const { t, locale } = useLanguage();
  const year = 2026;
  const isRTL = locale === "ar";

  return (
    <footer className="site-footer">
      {/* Gradient highlight line at top */}
      {/* (handled by ::before pseudo-element in CSS) */}

      {/* Pixel decorations */}
      <div className="footer-pixel footer-pixel--green" />
      <div className="footer-pixel footer-pixel--pink" />

      <div className="footer-inner">
        {/* ======================================================== */}
        {/* 1. Brand Logos Row: BUILDx | Tiqanah                     */}
        {/* ======================================================== */}
          <div className="footer-brands">
          <Image
            src="/assets/logos/logo-white-slogan.png"
            alt="BUILDx"
            width={420}
            height={110}
            className="footer-buildx-logo"
            priority={false}
          />
          <span className="footer-brand-divider" />
          <Image
            src="/assets/logos/tiqanah.png"
            alt="تقانة - Tiqanah"
            width={210}
            height={70}
            className="footer-tiqanah-logo"
          />
          <span className="footer-brand-divider" />
          <Image
            src="/assets/logos/partnership-logo.png"
            alt={isRTL ? "شعار الشراكة — أنماء وشراكة" : "Partnership Logo"}
            width={140}
            height={154}
            className="footer-partner-logo"
          />
        </div>

        {/* ======================================================== */}
        {/* 2. Contact Section Title                                 */}
        {/* ======================================================== */}
        <h3
          className="footer-contact-title"
          style={{ fontFamily: isRTL ? "var(--font-janna-bold)" : "var(--font-bauhaus)" }}
        >
          {t.footer.contactTeam}
        </h3>

        {/* ======================================================== */}
        {/* 3. Contact Cards (WhatsApp & Email)                      */}
        {/* ======================================================== */}
        <div className="footer-contact-links">
          {/* WhatsApp Card */}
          <a
            href={t.footer.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-card footer-contact-whatsapp group"
            aria-label={isRTL ? "التواصل مع BUILDx عبر واتساب" : "Contact BUILDx via WhatsApp"}
          >
            <div className="footer-contact-card__icon text-lime group-hover:scale-110 transition-transform">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.09 19.75 7.81 19L7.5 18.82L4.38 19.64L5.22 16.6L5.02 16.29C4.19 14.97 3.75 13.46 3.75 11.91C3.75 7.34 7.47 3.62 12.05 3.62C14.27 3.62 16.35 4.49 17.92 6.06C19.49 7.63 20.35 9.71 20.35 11.93C20.34 16.5 16.62 20.15 12.05 20.15ZM16.61 14.41C16.36 14.28 15.13 13.68 14.9 13.6C14.67 13.51 14.51 13.47 14.34 13.72C14.17 13.97 13.7 14.54 13.56 14.71C13.41 14.88 13.27 14.9 13.02 14.77C12.77 14.65 11.97 14.39 11.02 13.54C10.28 12.88 9.78 12.06 9.64 11.81C9.5 11.56 9.62 11.43 9.75 11.3C9.86 11.19 10 11.03 10.12 10.89C10.24 10.74 10.28 10.64 10.37 10.47C10.45 10.3 10.41 10.16 10.35 10.03C10.28 9.91 9.8 8.72 9.6 8.23C9.4 7.75 9.2 7.82 9.05 7.81C8.91 7.8 8.75 7.8 8.58 7.8C8.42 7.8 8.15 7.86 7.92 8.11C7.7 8.36 7.07 8.95 7.07 10.15C7.07 11.35 7.95 12.51 8.07 12.67C8.19 12.84 9.79 15.31 12.24 16.37C12.83 16.62 13.28 16.77 13.64 16.89C14.23 17.07 14.76 17.05 15.19 16.98C15.67 16.91 16.66 16.38 16.87 15.79C17.07 15.2 17.07 14.7 17.01 14.59C16.96 14.49 16.85 14.45 16.61 14.41Z" />
              </svg>
            </div>
            <div className="footer-contact-card__info">
              <span className="footer-contact-card__label font-arapix">
                {t.footer.whatsapp.label}
              </span>
              <span className="footer-contact-card__val font-mono" dir="ltr">
                {t.footer.whatsapp.number}
              </span>
              <span className="footer-contact-card__action">
                {t.footer.whatsapp.action}
              </span>
            </div>
          </a>

          {/* Email Card */}
          <a
            href={t.footer.email.link}
            className="footer-contact-card footer-contact-email group"
            aria-label={isRTL ? "إرسال بريد إلكتروني إلى BUILDx" : "Send email to BUILDx"}
          >
            <div className="footer-contact-card__icon text-pink group-hover:scale-110 transition-transform">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <div className="footer-contact-card__info">
              <span className="footer-contact-card__label font-arapix">
                {t.footer.email.label}
              </span>
              <span className="footer-contact-card__val font-mono" dir="ltr">
                {t.footer.email.address}
              </span>
              <span className="footer-contact-card__action">
                {t.footer.email.action}
              </span>
            </div>
          </a>
        </div>

        {/* ======================================================== */}
        {/* 4. Partners                                              */}
        {/* ======================================================== */}
        <div className="footer-partners">
          <h4
            className="footer-partners-title font-arapix"
          >
            {t.footer.partners.title}
          </h4>
          <div className="footer-partners-logos">
            {partners.map((partner) => (
              <Image
                key={partner.id}
                src={partner.logoSrc}
                alt={isRTL ? partner.nameAr : partner.nameEn}
                width={100}
                height={40}
                className="footer-partner-logo"
                sizes="100px"
              />
            ))}
          </div>
        </div>

        {/* ======================================================== */}
        {/* 5. Copyright                                             */}
        {/* ======================================================== */}
        <div className="footer-bottom">
          <p className="text-xs text-light/40 font-arapix tracking-wider">
            © {year} BUILDx
          </p>
          <p className="text-xs text-light/35 font-arapix tracking-wider mt-1">
            {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
