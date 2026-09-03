"use client";

interface Option {
  value: string;
  label: string;
  description?: string;
  badge?: string;
  badgeColor?: string;
}

interface RadioCardsProps {
  name: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  error?: string;
  vertical?: boolean;
}

export default function RadioCards({ value, options, onChange, error, vertical = false }: RadioCardsProps) {
  return (
    <div className={`reg-radio-group ${vertical ? "reg-radio-group--vertical" : ""}`} role="radiogroup">
      {options.map((opt) => {
        const checked = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={checked}
            onClick={() => onChange(opt.value)}
            className={`reg-radio-card ${checked ? "reg-radio-card--selected" : ""}`}
            style={checked && opt.badgeColor ? { borderColor: opt.badgeColor, boxShadow: `0 0 18px -4px ${opt.badgeColor}44` } : undefined}
          >
            <div className="reg-radio-card__inner">
              <div className="reg-radio-card__header">
                {opt.badge && (
                  <span className="reg-radio-card__badge" style={opt.badgeColor ? { background: opt.badgeColor, color: "#0c1018" } : undefined}>
                    {opt.badge}
                  </span>
                )}
                <span className="reg-radio-card__dot" aria-hidden="true" />
              </div>
              <span className="reg-radio-card__label">{opt.label}</span>
              {opt.description && <span className="reg-radio-card__desc">{opt.description}</span>}
            </div>
          </button>
        );
      })}
      {error && <p className="reg-error" role="alert">{error}</p>}
    </div>
  );
}
