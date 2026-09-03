"use client";
import { useLanguage } from "@/context/LanguageContext";

interface TextareaFieldProps {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  monospace?: boolean;
  error?: string;
  rows?: number;
}

export default function TextareaField({
  id, value, onChange, placeholder, minLength = 40, maxLength = 2000, monospace = false, error, rows = 5,
}: TextareaFieldProps) {
  const { locale } = useLanguage();
  const count = value.length;
  const tooShort = count > 0 && count < minLength;
  const atLimit = count >= maxLength;

  return (
    <div className="reg-textarea-wrap">
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        rows={rows}
        placeholder={placeholder}
        className={`reg-textarea ${monospace ? "reg-textarea--mono" : ""} ${error ? "reg-textarea--error" : ""}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
      />
      <div className="reg-textarea-footer">
        {tooShort && (
          <span className="reg-textarea-min">
            {locale === "ar" ? `الحد الأدنى ${minLength} حرف` : `Minimum ${minLength} characters`}
          </span>
        )}
        <span className={`reg-char-count ${atLimit ? "reg-char-count--limit" : ""}`}>
          {count} / {maxLength}
        </span>
      </div>
      {error && <p id={`${id}-err`} className="reg-error" role="alert">{error}</p>}
    </div>
  );
}
