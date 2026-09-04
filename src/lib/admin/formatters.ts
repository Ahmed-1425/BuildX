// ═══════════════════════════════════════════════════════════════
// BUILDx Admin Dashboard — Central Number & Date Formatters
// Enforces Latin Digits (0-9) everywhere across the Admin interface
// ═══════════════════════════════════════════════════════════════

export const numberFormatter = new Intl.NumberFormat("en-US", {
  useGrouping: true,
});

export const percentFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  maximumFractionDigits: 0,
});

export function formatNumber(value: number | string | null | undefined): string {
  if (value === null || value === undefined || value === "") return "0";
  const num = typeof value === "number" ? value : Number(value);
  if (isNaN(num)) return toLatinDigits(String(value));
  return numberFormatter.format(num);
}

export function formatPercent(value: number | null | undefined, isFraction = false): string {
  if (value === null || value === undefined) return "0%";
  const pct = isFraction ? value : value / 100;
  return percentFormatter.format(pct);
}

export const arabicDateFormatter = new Intl.DateTimeFormat(
  "ar-SA-u-nu-latn",
  {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Riyadh",
  }
);

export const arabicDateShortFormatter = new Intl.DateTimeFormat(
  "ar-SA-u-nu-latn",
  {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Riyadh",
  }
);

export const arabicTimeFormatter = new Intl.DateTimeFormat(
  "ar-SA-u-nu-latn",
  {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Riyadh",
  }
);

export const arabicTimeWithSecondsFormatter = new Intl.DateTimeFormat(
  "ar-SA-u-nu-latn",
  {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "Asia/Riyadh",
  }
);

export const arabicDateTimeFormatter = new Intl.DateTimeFormat(
  "ar-SA-u-nu-latn",
  {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Riyadh",
  }
);

export function toLatinDigits(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)));
}

export function formatDateArabic(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "—";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return toLatinDigits(String(dateInput));
    return arabicDateFormatter.format(d);
  } catch {
    return toLatinDigits(String(dateInput));
  }
}

export function formatTimeArabic(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "—";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return toLatinDigits(String(dateInput));
    return arabicTimeFormatter.format(d);
  } catch {
    return toLatinDigits(String(dateInput));
  }
}

export function formatDateTimeArabic(dateInput: string | Date | null | undefined): string {
  if (!dateInput) return "—";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) return toLatinDigits(String(dateInput));
    return arabicDateTimeFormatter.format(d);
  } catch {
    return toLatinDigits(String(dateInput));
  }
}
