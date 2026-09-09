// =============================================================================
// Centralized Latin Digit Formatters (English Numerals for RTL Arabic UI)
// =============================================================================

export const scoreFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false,
});

export const integerFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
  useGrouping: false,
});

export const percentFormatter = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

export const arabicDateFormatter = new Intl.DateTimeFormat("ar-SA-u-nu-latn", {
  dateStyle: "medium",
  timeStyle: "short",
});

export const arabicTimeFormatter = new Intl.DateTimeFormat("ar-SA-u-nu-latn", {
  timeStyle: "medium",
});

/**
 * Ensures any number is cleanly displayed in Latin digits.
 */
export function formatScore(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return "--.--";
  return scoreFormatter.format(num);
}

export function formatInteger(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return "0";
  return integerFormatter.format(num);
}

export function formatPercent(num: number | null | undefined): string {
  if (num === null || num === undefined || isNaN(num)) return "0%";
  return `${percentFormatter.format(num)}%`;
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "--";
  try {
    return arabicDateFormatter.format(new Date(dateString));
  } catch {
    return dateString;
  }
}

export function formatTime(dateString: string | null | undefined): string {
  if (!dateString) return "--";
  try {
    return arabicTimeFormatter.format(new Date(dateString));
  } catch {
    return dateString;
  }
}
