"use client";
import { useLanguage } from "@/context/LanguageContext";

export default function RegistrationSupport() {
  const { locale } = useLanguage();
  const ar = locale === "ar";

  const waLink = `https://wa.me/966554573554?text=${encodeURIComponent(
    ar
      ? "مرحبًا فريق BUILDx، أواجه صعوبة في التسجيل وأحتاج إلى مساعدة."
      : "Hello BUILDx team, I need assistance with the registration form."
  )}`;

  const emailLink = `mailto:buildx.info@gmail.com?subject=${encodeURIComponent(
    ar ? "مساعدة في تسجيل معسكر BUILDx" : "BUILDx Camp Registration Assistance"
  )}`;

  return (
    <div className="reg-support-card">
      <div className="reg-support-header">
        <div className="reg-support-badge">
          <span className="reg-support-dot" aria-hidden="true" />
          <span>{ar ? "الدعم والمساعدة المباشرة" : "Live Support & Help"}</span>
        </div>
        <h3 className="reg-support-title">
          {ar ? "واجهت صعوبة أو لديك استفسار؟" : "Having trouble or have a question?"}
        </h3>
        <p className="reg-support-subtitle">
          {ar
            ? "فريق BUILDx متاح لمساعدتك خطوة بخطوة وضمان إتمام طلبك بسلاسة."
            : "The BUILDx team is ready to assist you step-by-step to complete your application smoothly."}
        </p>
      </div>

      <div className="reg-support-grid">
        {/* WhatsApp */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="reg-support-item reg-support-item--wa group"
          aria-label={ar ? "تواصل مع فريق BUILDx عبر واتساب" : "Chat with BUILDx team on WhatsApp"}
        >
          <div className="reg-support-icon reg-support-icon--wa">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.09 19.75 7.81 19L7.5 18.82L4.38 19.64L5.22 16.6L5.02 16.29C4.19 14.97 3.75 13.46 3.75 11.91C3.75 7.34 7.47 3.62 12.05 3.62C14.27 3.62 16.35 4.49 17.92 6.06C19.49 7.63 20.35 9.71 20.35 11.93C20.34 16.5 16.62 20.15 12.05 20.15ZM16.61 14.41C16.36 14.28 15.13 13.68 14.9 13.6C14.67 13.51 14.51 13.47 14.34 13.72C14.17 13.97 13.7 14.54 13.56 14.71C13.41 14.88 13.27 14.9 13.02 14.77C12.77 14.65 11.97 14.39 11.02 13.54C10.28 12.88 9.78 12.06 9.64 11.81C9.5 11.56 9.62 11.43 9.75 11.3C9.86 11.19 10 11.03 10.12 10.89C10.24 10.74 10.28 10.64 10.37 10.47C10.45 10.3 10.41 10.16 10.35 10.03C10.28 9.91 9.8 8.72 9.6 8.23C9.4 7.75 9.2 7.82 9.05 7.81C8.91 7.8 8.75 7.8 8.58 7.8C8.42 7.8 8.15 7.86 7.92 8.11C7.7 8.36 7.07 8.95 7.07 10.15C7.07 11.35 7.95 12.51 8.07 12.67C8.19 12.84 9.79 15.31 12.24 16.37C12.83 16.62 13.28 16.77 13.64 16.89C14.23 17.07 14.76 17.05 15.19 16.98C15.67 16.91 16.66 16.38 16.87 15.79C17.07 15.2 17.07 14.7 17.01 14.59C16.96 14.49 16.85 14.45 16.61 14.41Z" />
            </svg>
          </div>
          <div className="reg-support-info">
            <span className="reg-support-channel">{ar ? "واتساب المباشر" : "WhatsApp Chat"}</span>
            <span className="reg-support-val" dir="ltr">055 457 3554</span>
            <span className="reg-support-action">{ar ? "اضغط للمحادثة الفورية ←" : "Tap to chat instantly →"}</span>
          </div>
        </a>

        {/* Email */}
        <a
          href={emailLink}
          className="reg-support-item reg-support-item--email group"
          aria-label={ar ? "إرسال بريد إلكتروني لفريق BUILDx" : "Send email to BUILDx team"}
        >
          <div className="reg-support-icon reg-support-icon--email">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
            </svg>
          </div>
          <div className="reg-support-info">
            <span className="reg-support-channel">{ar ? "البريد الإلكتروني" : "Direct Email"}</span>
            <span className="reg-support-val" dir="ltr">buildx.info@gmail.com</span>
            <span className="reg-support-action">{ar ? "اضغط لمراسلتنا الآن ←" : "Tap to send an email →"}</span>
          </div>
        </a>
      </div>
    </div>
  );
}
