"use client";
import { useState, useRef, useEffect, useId } from "react";
import { useLanguage } from "@/context/LanguageContext";

interface SearchableSelectProps {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  error?: string;
  id?: string;
}

export default function SearchableSelect({ value, onChange, options, placeholder, error, id: propId }: SearchableSelectProps) {
  const { locale } = useLanguage();
  const genId = useId();
  const id = propId ?? genId;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = options.filter((o) => o.toLowerCase().includes(query.toLowerCase())).slice(0, 20);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const displayValue = value || "";

  return (
    <div className={`reg-select-wrap ${open ? "z-50" : ""}`} ref={containerRef}>
      <button
        type="button"
        id={id}
        className={`reg-select-trigger ${error ? "reg-select-trigger--error" : ""} ${open ? "reg-select-trigger--open" : ""}`}
        onClick={() => { setOpen(!open); setTimeout(() => inputRef.current?.focus(), 50); }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className={displayValue ? "reg-select-value" : "reg-select-placeholder"}>
          {displayValue || placeholder || (locale === "ar" ? "اختر..." : "Select...")}
        </span>
        <span className="reg-select-chevron" aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className="reg-select-dropdown" role="listbox">
          <div className="reg-select-search-wrap">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={locale === "ar" ? "بحث..." : "Search..."}
              className="reg-select-search"
            />
          </div>
          <div className="reg-select-options">
            {filtered.length === 0 ? (
              <div className="reg-select-empty">{locale === "ar" ? "لا توجد نتائج" : "No results"}</div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  role="option"
                  aria-selected={value === opt}
                  className={`reg-select-option ${value === opt ? "reg-select-option--selected" : ""}`}
                  onClick={() => { onChange(opt); setOpen(false); setQuery(""); }}
                >
                  {opt}
                </button>
              ))
            )}
          </div>
        </div>
      )}
      {error && <p className="reg-error" role="alert">{error}</p>}
    </div>
  );
}
