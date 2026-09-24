// ─── Agenda Data ──────────────────────────────────────────────────────────────
// Static data for the BUILDx closing ceremony agenda.
// All times are in Asia/Riyadh (UTC+3). No database or API required.

export type AgendaItemType =
  | "reception"
  | "prayer"
  | "anthem"
  | "welcome"
  | "quran"
  | "intro"
  | "speech"
  | "video-intro"
  | "video"
  | "judges-intro"
  | "panel"
  | "judges-thanks"
  | "projects-intro"
  | "projects"
  | "teams-thanks"
  | "break"
  | "return"
  | "honor-team"
  | "honor-sponsors"
  | "rank-3"
  | "rank-2"
  | "rank-1"
  | "category-awards"
  | "closing"
  | "photo";

export interface AgendaItem {
  id: number;
  title: string;
  startTime: string; // HH:mm format (24h)
  endTime: string;
  durationMinutes: number;
  type: AgendaItemType;
  description?: string;
  phase: number; // 1-6
  icon: string;
  characterImage?: string;
  accent?: string; // For rank items: bronze, silver, gold
}

export interface AgendaPhase {
  id: number;
  title: string;
  icon: string;
  characterImage?: string;
  accentColor: string;
}

// Event date: Tuesday, October 6, 2026
// All times in Asia/Riyadh (UTC+3)
export const EVENT_DATE = "2026-10-06";
export const EVENT_TIMEZONE = "Asia/Riyadh";

export const EVENT_INFO = {
  name: "الحفل الختامي لـBUILDx",
  date: "الثلاثاء 6 أكتوبر 2026",
  city: "الرياض",
  venue: "T2 Business",
  mapUrl: "https://maps.app.goo.gl/87DHERMV5g9QUXR17",
  startTime: "5:00 مساءً",
  endTime: "10:29 مساءً",
  heroTitle: "ليلة نحتفي فيها بما بُني",
  heroBadge: "الحفل الختامي",
  heroDescription:
    "تابع أجندة الحفل الختامي، من استقبال الضيوف وحتى لحظة إعلان الفائزين.",
  maghribTime: "5:35 مساءً",
  ishaTime: "7:05 مساءً",
};

export const PHASES: AgendaPhase[] = [
  {
    id: 1,
    title: "الوصول والافتتاح",
    icon: "🎪",
    characterImage: "/images/agenda/characters/ready.png",
    accentColor: "#823419",
  },
  {
    id: 2,
    title: "قصة BUILDx وفريق العمل",
    icon: "🎬",
    characterImage: "/images/agenda/characters/building.png",
    accentColor: "#c3f937",
  },
  {
    id: 3,
    title: "لجنة التحكيم",
    icon: "⚖️",
    characterImage: "/images/agenda/characters/thinking.png",
    accentColor: "#fb50c3",
  },
  {
    id: 4,
    title: "الصلاة وعروض المشاريع",
    icon: "🚀",
    characterImage: "/images/agenda/characters/loading.png",
    accentColor: "#34155f",
  },
  {
    id: 5,
    title: "اعتماد النتائج والتكريم",
    icon: "🏅",
    characterImage: "/images/agenda/characters/success.png",
    accentColor: "#fb50c3",
  },
  {
    id: 6,
    title: "إعلان الفائزين والختام",
    icon: "🏆",
    characterImage: "/images/agenda/characters/hollow-volt.png",
    accentColor: "#c3f937",
  },
];

export const AGENDA_ITEMS: AgendaItem[] = [
  {
    id: 1,
    title: "استقبال الضيوف والمستفيدين",
    startTime: "17:00",
    endTime: "17:35",
    durationMinutes: 35,
    type: "reception",
    description: "استقبال الضيوف والمستفيدين وإتمام التسجيل والدخول.",
    phase: 1,
    icon: "👋",
  },
  {
    id: 2,
    title: "استراحة صلاة المغرب",
    startTime: "17:35",
    endTime: "17:55",
    durationMinutes: 20,
    type: "prayer",
    description: "أذان المغرب في الرياض الساعة 5:35 مساءً.",
    phase: 1,
    icon: "🕌",
  },
  {
    id: 3,
    title: "النشيد الوطني",
    startTime: "17:55",
    endTime: "17:58",
    durationMinutes: 3,
    type: "anthem",
    phase: 1,
    icon: "🇸🇦",
  },
  {
    id: 4,
    title: "السلام والترحيب بالحضور",
    startTime: "17:58",
    endTime: "18:01",
    durationMinutes: 3,
    type: "welcome",
    phase: 1,
    icon: "🎤",
  },
  {
    id: 5,
    title: "تلاوة القرآن الكريم",
    startTime: "18:01",
    endTime: "18:06",
    durationMinutes: 5,
    type: "quran",
    phase: 1,
    icon: "📖",
  },
  {
    id: 6,
    title: "مقدمة الحفل والتعريف بـBUILDx",
    startTime: "18:06",
    endTime: "18:11",
    durationMinutes: 5,
    type: "intro",
    phase: 1,
    icon: "💡",
  },
  {
    id: 7,
    title: "كلمة قادة المشروع",
    startTime: "18:11",
    endTime: "18:23",
    durationMinutes: 12,
    type: "speech",
    description: "أحمد ← هياء ← يسرى",
    phase: 2,
    icon: "🎙️",
  },
  {
    id: 8,
    title: "مقدمة وتمهيد لفيديو فريق العمل",
    startTime: "18:23",
    endTime: "18:25",
    durationMinutes: 2,
    type: "video-intro",
    phase: 2,
    icon: "🎬",
  },
  {
    id: 9,
    title: "فيديو فريق العمل",
    startTime: "18:25",
    endTime: "18:30",
    durationMinutes: 5,
    type: "video",
    phase: 2,
    icon: "🎥",
  },
  {
    id: 10,
    title: "تقديم أعضاء لجنة التحكيم",
    startTime: "18:30",
    endTime: "18:36",
    durationMinutes: 6,
    type: "judges-intro",
    phase: 3,
    icon: "👨‍⚖️",
  },
  {
    id: 11,
    title: "الجلسة الحوارية مع لجنة التحكيم",
    startTime: "18:36",
    endTime: "19:01",
    durationMinutes: 25,
    type: "panel",
    phase: 3,
    icon: "💬",
  },
  {
    id: 12,
    title: "شكر لجنة التحكيم وختام الجلسة",
    startTime: "19:01",
    endTime: "19:04",
    durationMinutes: 3,
    type: "judges-thanks",
    phase: 3,
    icon: "🤝",
  },
  {
    id: 13,
    title: "استراحة صلاة العشاء",
    startTime: "19:04",
    endTime: "19:25",
    durationMinutes: 21,
    type: "prayer",
    description: "أذان العشاء في الرياض الساعة 7:05 مساءً.",
    phase: 4,
    icon: "🕌",
  },
  {
    id: 14,
    title: "مقدمة وتمهيد لعروض المشاريع",
    startTime: "19:25",
    endTime: "19:30",
    durationMinutes: 5,
    type: "projects-intro",
    phase: 4,
    icon: "🔧",
  },
  {
    id: 15,
    title: "عروض المشاريع الثمانية والانتقالات",
    startTime: "19:30",
    endTime: "20:40",
    durationMinutes: 70,
    type: "projects",
    description: "استعراض مشاريع فرق BUILDx الثمانية مع الانتقالات بينها.",
    phase: 4,
    icon: "🚀",
  },
  {
    id: 16,
    title: "كلمة شكر لجميع الفرق والإشادة بالمشاريع",
    startTime: "20:40",
    endTime: "20:44",
    durationMinutes: 4,
    type: "teams-thanks",
    phase: 4,
    icon: "👏",
  },
  {
    id: 17,
    title: "استراحة واعتماد النتائج من لجنة التحكيم",
    startTime: "20:44",
    endTime: "21:04",
    durationMinutes: 20,
    type: "break",
    phase: 5,
    icon: "⏳",
  },
  {
    id: 18,
    title: "العودة من الاستراحة ومقدمة فقرة التكريم",
    startTime: "21:04",
    endTime: "21:08",
    durationMinutes: 4,
    type: "return",
    phase: 5,
    icon: "🎯",
  },
  {
    id: 19,
    title: "تكريم فريق عمل BUILDx",
    startTime: "21:08",
    endTime: "21:23",
    durationMinutes: 15,
    type: "honor-team",
    phase: 5,
    icon: "🏅",
  },
  {
    id: 20,
    title: "تكريم الرعاة والشركاء",
    startTime: "21:23",
    endTime: "21:33",
    durationMinutes: 10,
    type: "honor-sponsors",
    phase: 5,
    icon: "🤝",
  },
  {
    id: 21,
    title: "إعلان المركز الثالث",
    startTime: "21:33",
    endTime: "21:39",
    durationMinutes: 6,
    type: "rank-3",
    description: "إعلان الفائز بالمركز الثالث، والتكريم والتصوير.",
    phase: 6,
    icon: "🥉",
    accent: "bronze",
  },
  {
    id: 22,
    title: "إعلان المركز الثاني",
    startTime: "21:39",
    endTime: "21:45",
    durationMinutes: 6,
    type: "rank-2",
    description: "إعلان الفائز بالمركز الثاني، والتكريم والتصوير.",
    phase: 6,
    icon: "🥈",
    accent: "silver",
  },
  {
    id: 23,
    title: "إعلان المركز الأول",
    startTime: "21:45",
    endTime: "21:52",
    durationMinutes: 7,
    type: "rank-1",
    description: "إعلان الفائز بالمركز الأول، والتكريم والتصوير.",
    phase: 6,
    icon: "🥇",
    accent: "gold",
  },
  {
    id: 24,
    title: "إعلان الفائزين بجوائز الفئات الخمس",
    startTime: "21:52",
    endTime: "22:07",
    durationMinutes: 15,
    type: "category-awards",
    description: "إعلان الفائزين بجوائز الفئات الخمس وتكريمهم.",
    phase: 6,
    icon: "🎖️",
  },
  {
    id: 25,
    title: "كلمة ختام BUILDx",
    startTime: "22:07",
    endTime: "22:14",
    durationMinutes: 7,
    type: "closing",
    phase: 6,
    icon: "✨",
  },
  {
    id: 26,
    title: "الصورة الجماعية والتصوير الختامي",
    startTime: "22:14",
    endTime: "22:29",
    durationMinutes: 15,
    type: "photo",
    phase: 6,
    icon: "📸",
    characterImage: "/images/agenda/characters/glass-characters.png",
  },
];

// ─── Time utilities ───────────────────────────────────────────────────────────

/**
 * Convert HH:mm to a Date on the event day in Asia/Riyadh timezone.
 * Uses fixed UTC+3 offset to avoid timezone-related hydration mismatches.
 */
export function getEventDateTime(time: string): Date {
  const [hours, minutes] = time.split(":").map(Number);
  // Create date in UTC, adjusted for Riyadh (UTC+3)
  const utcDate = new Date(
    Date.UTC(2026, 9, 6, hours - 3, minutes, 0, 0)
  );
  return utcDate;
}

/**
 * Get current time in Riyadh timezone as a comparable value.
 * Returns milliseconds since epoch.
 */
export function getRiyadhNow(): number {
  return Date.now();
}

/**
 * Format time from 24h to Arabic-friendly 12h format.
 */
export function formatTime12h(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "مساءً" : "صباحًا";
  const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

/**
 * Get item status based on current Riyadh time.
 */
export function getItemStatus(
  item: AgendaItem,
  nowMs: number
): "past" | "current" | "upcoming" {
  const start = getEventDateTime(item.startTime).getTime();
  const end = getEventDateTime(item.endTime).getTime();

  if (nowMs >= end) return "past";
  if (nowMs >= start && nowMs < end) return "current";
  return "upcoming";
}

/**
 * Get the progress percentage of the current item.
 */
export function getItemProgress(item: AgendaItem, nowMs: number): number {
  const start = getEventDateTime(item.startTime).getTime();
  const end = getEventDateTime(item.endTime).getTime();
  const total = end - start;
  const elapsed = nowMs - start;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

/**
 * Format duration in Arabic.
 */
export function formatDuration(minutes: number): string {
  if (minutes === 1) return "دقيقة واحدة";
  if (minutes === 2) return "دقيقتان";
  if (minutes <= 10) return `${minutes} دقائق`;
  return `${minutes} دقيقة`;
}

/**
 * Get overall event status.
 */
export function getEventStatus(
  nowMs: number
): "before" | "during" | "after" {
  const eventStart = getEventDateTime("17:00").getTime();
  const eventEnd = getEventDateTime("22:29").getTime();

  if (nowMs < eventStart) return "before";
  if (nowMs > eventEnd) return "after";
  return "during";
}

/**
 * Get overall event progress percentage.
 */
export function getEventProgress(nowMs: number): number {
  const eventStart = getEventDateTime("17:00").getTime();
  const eventEnd = getEventDateTime("22:29").getTime();
  const total = eventEnd - eventStart;
  const elapsed = nowMs - eventStart;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

/**
 * Generate an ICS calendar file content.
 */
export function generateICS(): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BUILDx//Closing Ceremony//AR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "DTSTART:20261006T140000Z",
    "DTEND:20261006T192900Z",
    "SUMMARY:الحفل الختامي لـBUILDx",
    "DESCRIPTION:الحفل الختامي لمعسكر BUILDx — من استقبال الضيوف وحتى إعلان الفائزين.",
    "LOCATION:T2 Business — الرياض",
    "URL:https://maps.app.goo.gl/87DHERMV5g9QUXR17",
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}
