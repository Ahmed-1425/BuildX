export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/[ىي]/g, "ي")
    .replace(/ـ/g, "")
    .replace(/[\u064B-\u065F\u0670]/g, "");
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Smoothly scrolls to an element id (scroll-margin handles the sticky header offset). */
export function scrollToId(id: string, options: { focus?: boolean } = {}): boolean {
  if (typeof document === "undefined") return false;
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start",
  });
  if (options.focus) {
    window.setTimeout(() => el.focus({ preventScroll: true }), 50);
  }
  return true;
}

export function setHash(hash: string) {
  if (typeof window === "undefined") return;
  const url = `${window.location.pathname}${window.location.search}#${hash}`;
  window.history.replaceState(null, "", url);
}
