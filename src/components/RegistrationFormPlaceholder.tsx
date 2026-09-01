"use client";

import { useLanguage } from "@/context/LanguageContext";
import CharacterState from "./CharacterState";

/**
 * RegistrationFormPlaceholder
 *
 * This component is a placeholder for the actual registration form.
 * When the registration form is ready, replace the content of this component
 * with the actual form fields and logic. The surrounding page layout
 * will not need any modifications.
 */
export default function RegistrationFormPlaceholder() {
  const { t, locale } = useLanguage();

  return (
    <div className="pixel-card p-8 sm:p-12 text-center max-w-lg mx-auto">
      {/* Character */}
      <div className="mb-6">
        <CharacterState
          state="loading"
          size={80}
          alt={locale === "ar" ? "في انتظار التسجيل" : "Registration coming soon"}
          className="mx-auto"
        />
      </div>

      {/* Message */}
      <p
        className="text-lg text-light/70 mb-2"
        style={{ fontFamily: "var(--font-janna-bold)" }}
      >
        {t.register.subtitle}
      </p>

      <p
        className="text-sm text-light/50"
        style={{ fontFamily: "var(--font-janna)" }}
      >
        {t.register.description}
      </p>

      {/* Visual placeholder area for future form */}
      <div className="mt-8 border-2 border-dashed border-primary/30 p-6 opacity-30">
        <div className="space-y-3">
          <div className="h-10 bg-primary/10 w-full" />
          <div className="h-10 bg-primary/10 w-full" />
          <div className="h-10 bg-primary/10 w-3/4" />
          <div className="h-12 bg-lime/10 w-1/2 mx-auto mt-4" />
        </div>
      </div>
    </div>
  );
}
