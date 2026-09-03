"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";

interface Props { referenceCode: string; }

export default function SuccessScreen({ referenceCode }: Props) {
  const { locale } = useLanguage();
  const ar = locale === "ar";
  const [copied, setCopied] = useState(false);

  function copyCode() {
    navigator.clipboard.writeText(referenceCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }

  return (
    <div className="reg-success">
      <div className="reg-success__glow" aria-hidden="true" />

      <div className="reg-success__char-wrap">
        <Image
          src="/assets/characters/char-success.png"
          alt=""
          width={160}
          height={160}
          className="reg-success__char"
        />
        <Image
          src="/assets/characters/loader.gif"
          alt=""
          width={64}
          height={64}
          className="reg-success__sparkle"
          unoptimized
        />
      </div>

      <div className="reg-success__content">
        <div className="reg-success__badge">
          <span className="w-2 h-2 bg-lime rounded-full animate-pulse inline-block" />
          {ar ? "تم الاستلام بنجاح" : "Successfully Received"}
        </div>

        <h1 className="reg-success__title">
          {ar ? "تم استلام طلبك بنجاح 🎉" : "Your application was received! 🎉"}
        </h1>

        <p className="reg-success__message">
          {ar
            ? "شكرًا لتقديمك على معسكر BUILDx. احتفظ برقم الطلب، وسيتم التواصل معك عبر البريد الإلكتروني أو WhatsApp عند تحديث حالة طلبك."
            : "Thank you for applying to BUILDx camp. Keep your application number; we'll contact you via email or WhatsApp when your application status is updated."}
        </p>

        {/* Reference code */}
        <div className="reg-success__ref-wrap">
          <span className="reg-success__ref-label">{ar ? "رقم طلبك" : "Application Number"}</span>
          <div className="reg-success__ref-box">
            <span className="reg-success__ref-code" dir="ltr">{referenceCode}</span>
            <button type="button" onClick={copyCode} className="reg-success__copy-btn" aria-label={ar ? "نسخ رقم الطلب" : "Copy application number"}>
              {copied ? (ar ? "تم النسخ ✓" : "Copied ✓") : (ar ? "نسخ" : "Copy")}
            </button>
          </div>
        </div>

        <Link href="/" className="reg-success__home-btn">
          {ar ? "العودة إلى الرئيسية" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
}
