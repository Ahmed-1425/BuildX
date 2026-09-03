"use client";
import { useLanguage } from "@/context/LanguageContext";

interface LinksFieldProps {
  values: string[];
  onChange: (links: string[]) => void;
  maxLinks?: number;
  label?: string;
  error?: string;
}

export default function LinksField({ values, onChange, maxLinks = 5, error }: LinksFieldProps) {
  const { locale } = useLanguage();
  const ar = locale === "ar";

  function update(idx: number, val: string) {
    const next = [...values];
    next[idx] = val;
    onChange(next);
  }

  function add() {
    if (values.length < maxLinks) onChange([...values, ""]);
  }

  function remove(idx: number) {
    onChange(values.filter((_, i) => i !== idx));
  }

  return (
    <div className="reg-links-wrap">
      {values.map((v, idx) => (
        <div key={idx} className="reg-link-row">
          <input
            type="url"
            value={v}
            onChange={(e) => update(idx, e.target.value)}
            placeholder="https://"
            className="reg-input reg-link-input"
            inputMode="url"
            autoComplete="url"
          />
          <button type="button" onClick={() => remove(idx)} className="reg-link-remove" aria-label={ar ? "حذف الرابط" : "Remove link"}>
            ✕
          </button>
        </div>
      ))}
      {values.length < maxLinks && (
        <button type="button" onClick={add} className="reg-link-add">
          + {ar ? "إضافة رابط" : "Add link"}
        </button>
      )}
      {error && <p className="reg-error" role="alert">{error}</p>}
    </div>
  );
}
