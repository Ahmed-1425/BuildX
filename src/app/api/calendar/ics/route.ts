import { NextRequest, NextResponse } from "next/server";

interface CalEventData {
  id: string;
  uid: string;
  title: string;
  cardTitle: string;
  description: string;
  startLocal: string;
  endLocal: string;
  venue: string;
  venueMapUrl: string;
}

const EVENTS: CalEventData[] = [
  {
    id: "day-1",
    uid: "buildx-2026-day1@buildx.tiqanah.org",
    title: "BUILDx — اليوم الأول: الانطلاقة وأساسيات Vibe Coding",
    cardTitle: "الانطلاقة وأساسيات Vibe Coding",
    description: "التعرف على مفهوم Vibe Coding، أدواته، وطريقة تحويل الفكرة الأولى إلى نموذج رقمي قابل للتجربة.",
    startLocal: "20260927T170000",
    endLocal: "20260927T210000",
    venue: "Zid — زد، الرياض",
    venueMapUrl: "https://maps.app.goo.gl/CvWvjuE1xJ1R7abAA",
  },
  {
    id: "day-2",
    uid: "buildx-2026-day2@buildx.tiqanah.org",
    title: "BUILDx — اليوم الثاني: FIRST BUILD ≠ FINAL BUILD",
    cardTitle: "FIRST BUILD ≠ FINAL BUILD",
    description: "نبدأ بالنموذج الأولي، نختبره ونكتشف مشكلاته، ثم نطوّر البرومبت والمنتج خطوة بعد خطوة حتى نصل إلى نسخة أكثر وضوحًا وجودة وجاهزية.",
    startLocal: "20260928T170000",
    endLocal: "20260928T210000",
    venue: "Zid — زد، الرياض",
    venueMapUrl: "https://maps.app.goo.gl/CvWvjuE1xJ1R7abAA",
  },
  {
    id: "day-3",
    uid: "buildx-2026-day3@buildx.tiqanah.org",
    title: "BUILDx — اليوم الثالث: ربط المنتج بقاعدة البيانات باستخدام Supabase",
    cardTitle: "من واجهة ثابتة إلى منتج متصل",
    description: "تحويل النموذج من واجهة ثابتة إلى منتج متصل بالبيانات، وإنشاء قاعدة البيانات وربطها بالواجهات باستخدام Supabase.",
    startLocal: "20260929T170000",
    endLocal: "20260929T210000",
    venue: "Zid — زد، الرياض",
    venueMapUrl: "https://maps.app.goo.gl/CvWvjuE1xJ1R7abAA",
  },
  {
    id: "day-4",
    uid: "buildx-2026-day4@buildx.tiqanah.org",
    title: "BUILDx — اليوم الرابع: دمج الذكاء الاصطناعي ونشر المنتج",
    cardTitle: "MAKE IT SMART. MAKE IT LIVE.",
    description: "إضافة وظائف الذكاء الاصطناعي إلى المنتج، اختبارها، ثم تجهيز المشروع ونشره على Netlify ليصبح متاحًا عبر رابط فعلي.",
    startLocal: "20260930T170000",
    endLocal: "20260930T210000",
    venue: "Zid — زد، الرياض",
    venueMapUrl: "https://maps.app.goo.gl/CvWvjuE1xJ1R7abAA",
  },
  {
    id: "day-5",
    uid: "buildx-2026-day5@buildx.tiqanah.org",
    title: "BUILDx — اليوم الخامس: من الفكرة إلى منتج قابل للتبني",
    cardTitle: "من الفكرة إلى منتج قابل للتبني",
    description: "ثلاث ورش عملية تساعد المشاركين على صناعة الفكرة، بناء نموذج العمل، وتقديم المنتج بقصة مقنعة، يليها شرح الهاكاثون ومعايير التحكيم.",
    startLocal: "20261001T170000",
    endLocal: "20261001T210000",
    venue: "Zid — زد، الرياض",
    venueMapUrl: "https://maps.app.goo.gl/CvWvjuE1xJ1R7abAA",
  },
  {
    id: "hackathon-1",
    uid: "buildx-2026-hack1@buildx.tiqanah.org",
    title: "BUILDx Hackathon — اليوم الأول: انطلاق التحدي الجماعي",
    cardTitle: "انطلاق التحدي الجماعي",
    description: "إعلان التحديات، تكوين الفرق، اختيار المسارات، توزيع الأدوار وبدء بناء المنتجات الرقمية.",
    startLocal: "20261004T170000",
    endLocal: "20261004T210000",
    venue: "Zid — زد، الرياض",
    venueMapUrl: "https://maps.app.goo.gl/CvWvjuE1xJ1R7abAA",
  },
  {
    id: "hackathon-2",
    uid: "buildx-2026-hack2@buildx.tiqanah.org",
    title: "BUILDx Hackathon — اليوم الثاني: إكمال المنتج والاستعداد للعرض",
    cardTitle: "إكمال المنتج والاستعداد للعرض",
    description: "استكمال المنتج الأولي، اختبار الحل، معالجة المشكلات، وتجهيز العرض النهائي أمام لجنة التحكيم.",
    startLocal: "20261005T170000",
    endLocal: "20261005T210000",
    venue: "Zid — زد، الرياض",
    venueMapUrl: "https://maps.app.goo.gl/CvWvjuE1xJ1R7abAA",
  },
  {
    id: "deadline",
    uid: "buildx-2026-deadline@buildx.tiqanah.org",
    title: "BUILDx — الموعد النهائي لتسليم المشاريع",
    cardTitle: "الموعد النهائي لتسليم المشاريع",
    description: "آخر موعد معتمد لتسليم النسخة النهائية من المشروع والمواد المطلوبة.",
    startLocal: "20261006T090000",
    endLocal: "20261006T091500",
    venue: "موعد نهائي لتسليم المشاريع",
    venueMapUrl: "",
  },
  {
    id: "closing",
    uid: "buildx-2026-closing@buildx.tiqanah.org",
    title: "BUILDx — الحفل الختامي وعرض المشاريع وإعلان النتائج",
    cardTitle: "عرض المشاريع وإعلان النتائج",
    description: "الحفل الختامي لـBUILDx، ويشمل استقبال الضيوف، عرض المنتجات الرقمية، إعلان النتائج، تكريم المشاريع الفائزة، والصورة الجماعية الختامية.",
    startLocal: "20261006T170000",
    endLocal: "20261006T222900",
    venue: "T2 Business — تي تو بزنس، الرياض",
    venueMapUrl: "https://maps.app.goo.gl/ttXkJJx1nrmr12g86?g_st=iw",
  }
];

function escapeICS(str: string) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function generateICS(events: CalEventData[]): string {
  const dtstamp = "20260925T160000Z";
  const buildxUrl = "https://buildx.tiqanah.org";

  const vtimezones = [
    "BEGIN:VTIMEZONE",
    "TZID:Asia/Riyadh",
    "X-LIC-LOCATION:Asia/Riyadh",
    "BEGIN:STANDARD",
    "TZOFFSETFROM:+0300",
    "TZOFFSETTO:+0300",
    "TZNAME:+03",
    "DTSTART:19700101T000000",
    "END:STANDARD",
    "END:VTIMEZONE"
  ].join("\r\n");

  const vevents = events.map(ev => {
    return [
      "BEGIN:VEVENT",
      `UID:${ev.uid}`,
      `DTSTAMP:${dtstamp}`,
      `DTSTART;TZID=Asia/Riyadh:${ev.startLocal}`,
      `DTEND;TZID=Asia/Riyadh:${ev.endLocal}`,
      `SUMMARY:${escapeICS(ev.title)}`,
      `DESCRIPTION:${escapeICS(ev.description + "\n\n" + buildxUrl)}`,
      `LOCATION:${escapeICS(ev.venue)}`,
      ...(ev.venueMapUrl ? [`URL:${ev.venueMapUrl}`] : []),
      "STATUS:CONFIRMED",
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeICS("تذكير: " + ev.cardTitle + " — غدًا")}`,
      "END:VALARM",
      "BEGIN:VALARM",
      "TRIGGER:-PT1H",
      "ACTION:DISPLAY",
      `DESCRIPTION:${escapeICS("تذكير: " + ev.cardTitle + " — بعد ساعة")}`,
      "END:VALARM",
      "END:VEVENT"
    ].join("\r\n");
  }).join("\r\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//BUILDx//BUILDx 2026 Calendar//AR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:برنامج BUILDx 2026",
    "X-WR-TIMEZONE:Asia/Riyadh",
    "X-WR-CALDESC:مواعيد وفعاليات معسكر BUILDx 2026 بالرياض",
    vtimezones,
    vevents,
    "END:VCALENDAR"
  ].join("\r\n");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const eventId = searchParams.get("id");

  let targetEvents = EVENTS;
  let filename = "buildx-2026-program.ics";

  if (eventId) {
    const single = EVENTS.find(e => e.id === eventId);
    if (single) {
      targetEvents = [single];
      filename = `buildx-2026-${single.id}.ics`;
    }
  }

  const icsBody = generateICS(targetEvents);

  return new NextResponse(icsBody, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
