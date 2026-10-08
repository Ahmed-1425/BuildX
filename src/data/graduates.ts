/**
 * BUILDx — Graduates data.
 *
 * Full Arabic and English bilingual support for all editions, awards, teams, and members.
 * Adding a new edition: append an object to `EDITIONS`. The page UI is fully data-driven.
 */

export type MemberLinkKind = "linkedin" | "app" | "portfolio" | "website";

export type MemberLink = {
  kind: MemberLinkKind;
  url: string;
};

export type Graduate = {
  id: string;
  name: string;
  nameEn: string;
  /** التخصص أو المجال */
  field: string;
  fieldEn: string;
  /** الجامعة أو الجهة — اختياري (لا تُعرض إن لم تتوفر) */
  org?: string;
  orgEn?: string;
  link?: MemberLink;
};

export type GraduateTeam = {
  /** e.g. "team-10" — used as the DOM anchor id */
  id: string;
  number: number;
  members: Graduate[];
};

export type AwardImage = {
  /**
   * Path without extension & width suffix, under /public.
   * Files: `<basePath>-640.webp`, `<basePath>.webp` (1280w), `<basePath>-1920.webp`.
   */
  basePath: string;
  /** Accurate Arabic alt text */
  alt: string;
  altEn: string;
  /** CSS object-position, adjustable if cropping ever hides people */
  objectPosition?: string;
};

export type AwardIcon =
  | "presentation"
  | "product"
  | "impact"
  | "innovation"
  | "ai";

export type Award = {
  id: string;
  kind: "place" | "category";
  /** 1 | 2 | 3 for podium places */
  rank?: 1 | 2 | 3;
  title: string;
  titleEn: string;
  teamNumber: number;
  icon?: AwardIcon;
  image: AwardImage;
};

export type EditionCopy = {
  allGraduatesTitle: string;
  allGraduatesTitleEn: string;
  allGraduatesDescription: string;
  allGraduatesDescriptionEn: string;
  closingTitle: string;
  closingTitleEn: string;
  closingText: string;
  closingTextEn: string;
  closingEnglish: string;
};

export type BuildxEdition = {
  id: string;
  /** Section copy — required when status is "available" */
  copy?: EditionCopy;
  /** Selector label */
  label: string;
  labelEn: string;
  year: number | null;
  status: "available" | "coming_soon";
  awards: Award[];
  teams: GraduateTeam[];
};

/* ─────────────────────────────────────────────
   Image helpers
   ───────────────────────────────────────────── */

export const AWARD_IMAGE_SIZE = { width: 1280, height: 720 } as const;

export function getAwardImageSources(image: AwardImage) {
  const { basePath } = image;
  return {
    src: `${basePath}.webp`,
    srcSet: `${basePath}-640.webp 640w, ${basePath}.webp 1280w, ${basePath}-1920.webp 1920w`,
  };
}

const AWARDS_DIR = "/images/graduates/edition-1/awards";

/* ─────────────────────────────────────────────
   Edition 1 — Awards
   ───────────────────────────────────────────── */

const edition1Awards: Award[] = [
  {
    id: "first-place",
    kind: "place",
    rank: 1,
    title: "المركز الأول",
    titleEn: "First Place",
    teamNumber: 80,
    image: {
      basePath: `${AWARDS_DIR}/team-80-first-place`,
      alt: "صورة جماعية لأعضاء الفريق 80 الفائز بالمركز الأول في النسخة الأولى من BUILDx",
      altEn: "Group photo of Team 80, First Place winners in the first edition of BUILDx",
    },
  },
  {
    id: "second-place",
    kind: "place",
    rank: 2,
    title: "المركز الثاني",
    titleEn: "Second Place",
    teamNumber: 10,
    image: {
      basePath: `${AWARDS_DIR}/team-10-second-place`,
      alt: "صورة جماعية لأعضاء الفريق 10 الفائز بالمركز الثاني في النسخة الأولى من BUILDx",
      altEn: "Group photo of Team 10, Second Place winners in the first edition of BUILDx",
    },
  },
  {
    id: "third-place",
    kind: "place",
    rank: 3,
    title: "المركز الثالث",
    titleEn: "Third Place",
    teamNumber: 70,
    image: {
      basePath: `${AWARDS_DIR}/team-70-third-place`,
      alt: "صورة جماعية لأعضاء الفريق 70 الفائز بالمركز الثالث في النسخة الأولى من BUILDx",
      altEn: "Group photo of Team 70, Third Place winners in the first edition of BUILDx",
    },
  },
  {
    id: "best-solution-presentation",
    kind: "category",
    title: "أفضل عرض للحل",
    titleEn: "Best Solution Presentation",
    teamNumber: 20,
    icon: "presentation",
    image: {
      basePath: `${AWARDS_DIR}/team-20-best-solution-presentation`,
      alt: "صورة جماعية لأعضاء الفريق 20 الفائز بجائزة أفضل عرض للحل في النسخة الأولى من BUILDx",
      altEn: "Group photo of Team 20, Best Solution Presentation winners in BUILDx Edition 1",
    },
  },
  {
    id: "most-promising-product",
    kind: "category",
    title: "أفضل منتج واعد",
    titleEn: "Most Promising Product",
    teamNumber: 30,
    icon: "product",
    image: {
      basePath: `${AWARDS_DIR}/team-30-most-promising-product`,
      alt: "صورة جماعية لأعضاء الفريق 30 الفائز بجائزة أفضل منتج واعد في النسخة الأولى من BUILDx",
      altEn: "Group photo of Team 30, Most Promising Product winners in BUILDx Edition 1",
    },
  },
  {
    id: "exceptional-impact",
    kind: "category",
    title: "جائزة الأثر الاستثنائي",
    titleEn: "Exceptional Impact Award",
    teamNumber: 50,
    icon: "impact",
    image: {
      basePath: `${AWARDS_DIR}/team-50-exceptional-impact`,
      alt: "صورة جماعية لأعضاء الفريق 50 الفائز بجائزة الأثر الاستثنائي في النسخة الأولى من BUILDx",
      altEn: "Group photo of Team 50, Exceptional Impact Award winners in BUILDx Edition 1",
    },
  },
  {
    id: "distinguished-innovation",
    kind: "category",
    title: "جائزة الابتكار المتميز",
    titleEn: "Distinguished Innovation Award",
    teamNumber: 40,
    icon: "innovation",
    image: {
      basePath: `${AWARDS_DIR}/team-40-distinguished-innovation`,
      alt: "صورة جماعية لأعضاء الفريق 40 الفائز بجائزة الابتكار المتميز في النسخة الأولى من BUILDx",
      altEn: "Group photo of Team 40, Distinguished Innovation Award winners in BUILDx Edition 1",
    },
  },
  {
    id: "best-ai-use",
    kind: "category",
    title: "أفضل توظيف للذكاء الاصطناعي",
    titleEn: "Best Use of AI",
    teamNumber: 60,
    icon: "ai",
    image: {
      basePath: `${AWARDS_DIR}/team-60-best-ai-use`,
      alt: "صورة جماعية لأعضاء الفريق 60 الفائز بجائزة أفضل توظيف للذكاء الاصطناعي في النسخة الأولى من BUILDx",
      altEn: "Group photo of Team 60, Best Use of AI winners in BUILDx Edition 1",
    },
  },
];

/* ─────────────────────────────────────────────
   Edition 1 — Teams
   ───────────────────────────────────────────── */

const li = (url: string): MemberLink => ({ kind: "linkedin", url });

const edition1Teams: GraduateTeam[] = [
  {
    id: "team-10",
    number: 10,
    members: [
      {
        id: "t10-jana",
        name: "جنا محمد السعيد",
        nameEn: "Jana AlSaeed",
        field: "نظم المعلومات",
        fieldEn: "Information Systems",
        org: "جامعة الملك سعود",
        orgEn: "King Saud University",
        link: li("https://www.linkedin.com/in/%D8%AC%D9%8E%D9%80%D9%86%D8%A7-%D8%A7%D9%84%D8%B3%D8%B9%D9%8A%D9%80%D8%AF-jana-alsaeed-b26583340"),
      },
      {
        id: "t10-aseel",
        name: "أسيل محمد الحربي",
        nameEn: "Aseel AlHarbi",
        field: "علوم الحاسب",
        fieldEn: "Computer Science",
        org: "جامعة الأميرة نورة بنت عبدالرحمن",
        orgEn: "Princess Nourah bint Abdulrahman University",
        link: li("https://www.linkedin.com/in/aseelalharbi-cs"),
      },
      {
        id: "t10-fatima",
        name: "فاطمة عبدالرحمن السقاف",
        nameEn: "Fatima AlSaggaf",
        field: "هندسة البرمجيات",
        fieldEn: "Software Engineering",
        org: "جامعة الملك سعود",
        orgEn: "King Saud University",
        link: li("https://www.linkedin.com/in/fatima-alsaggaf"),
      },
      {
        id: "t10-raghad",
        name: "رغد محمد الربيلي",
        nameEn: "Raghad AlRobaili",
        field: "تقنية المعلومات",
        fieldEn: "Information Technology",
        org: "جامعة الأمير مساعد بن عبدالرحمن",
        orgEn: "Prince Mosaed bin Abdulrahman University",
        link: li("https://linkedin.com/in/raghadalrobaili24"),
      },
    ],
  },
  {
    id: "team-20",
    number: 20,
    members: [
      {
        id: "t20-nayef",
        name: "نايف فهد العتيبي",
        nameEn: "Nayef AlOtaibi",
        field: "علوم اللغات",
        fieldEn: "Linguistics",
        org: "جامعة الملك سعود",
        orgEn: "King Saud University",
        link: { kind: "app", url: "https://na8el.vercel.app/app" },
      },
      {
        id: "t20-khalid",
        name: "خالد عبدالعزيز اللحيدان",
        nameEn: "Khalid AlLuhaydan",
        field: "علوم الحاسب",
        fieldEn: "Computer Science",
        org: "جامعة الإمام محمد بن سعود الإسلامية",
        orgEn: "Imam Mohammad Ibn Saud Islamic University",
        link: li("https://www.linkedin.com/in/khalid-alluhaydan/"),
      },
      {
        id: "t20-nasser",
        name: "ناصر حمود الدوسري",
        nameEn: "Nasser AlDawasri",
        field: "علوم الحاسب",
        fieldEn: "Computer Science",
        org: "جامعة شقراء",
        orgEn: "Shaqra University",
        link: li("https://www.linkedin.com/in/nasser-aldawasri/"),
      },
      {
        id: "t20-bandar",
        name: "بندر عبدالعزيز الشهراني",
        nameEn: "Bandar AlShahrani",
        field: "علم وإدارة البيانات",
        fieldEn: "Data Science & Management",
        org: "جامعة الملك سعود",
        orgEn: "King Saud University",
        link: li("https://www.linkedin.com/in/bandar-alshahrani-bb412440a"),
      },
    ],
  },
  {
    id: "team-30",
    number: 30,
    members: [
      {
        id: "t30-ghaida",
        name: "غيداء أحمد المطيري",
        nameEn: "Ghaida AlMutairi",
        field: "نظم المعلومات الإدارية",
        fieldEn: "Management Information Systems",
        org: "جامعة الملك سعود",
        orgEn: "King Saud University",
        link: li("https://www.linkedin.com/in/ghaidaalmutairi"),
      },
      {
        id: "t30-rahaf",
        name: "رهف حمدان الشيباني",
        nameEn: "Rahaf AlShaibani",
        field: "الأمن السيبراني",
        fieldEn: "Cybersecurity",
        org: "جامعة الإمام محمد بن سعود الإسلامية",
        orgEn: "Imam Mohammad Ibn Saud Islamic University",
        link: li("https://www.linkedin.com/in/rahaf-alshaibani-bb3001329"),
      },
      {
        id: "t30-hadeel",
        name: "هديل أحمد الأنصاري",
        nameEn: "Hadeel AlAnsari",
        field: "iOS Developer",
        fieldEn: "iOS Developer",
        org: "أكاديمية مطوري Apple",
        orgEn: "Apple Developer Academy",
        link: li("https://www.linkedin.com/in/hadeel-alansari-7a89a631b"),
      },
      {
        id: "t30-bashayer",
        name: "بشاير أحمد مكرمي",
        nameEn: "Bashayer Makrami",
        field: "تقنية المعلومات",
        fieldEn: "Information Technology",
        org: "Riyadh Schools Group",
        orgEn: "Riyadh Schools Group",
        link: li("https://www.linkedin.com/in/bashayer-a-805235214"),
      },
    ],
  },
  {
    id: "team-40",
    number: 40,
    members: [
      {
        id: "t40-fahad",
        name: "فهد عبدالرحمن الشثري",
        nameEn: "Fahad AlShathri",
        field: "نظم المعلومات الإدارية",
        fieldEn: "Management Information Systems",
        org: "جامعة الملك سعود",
        orgEn: "King Saud University",
        link: li("https://www.linkedin.com/in/fahad-alshathri-278b323a8/"),
      },
      {
        id: "t40-usama",
        name: "أسامة محمد حسن",
        nameEn: "Usama Hassan",
        field: "نظم المعلومات",
        fieldEn: "Information Systems",
        org: "جامعة الملك سعود",
        orgEn: "King Saud University",
        link: li("https://www.linkedin.com/in/usama-hassan1/"),
      },
      {
        id: "t40-abubakr",
        name: "أبو بكر أحمد العيدروس",
        nameEn: "Abubakr AlAydarous",
        field: "UX/UI Designer",
        fieldEn: "UX/UI Designer",
        org: "Entropy",
        orgEn: "Entropy",
        link: li("https://www.linkedin.com/in/abubakr-alaydarous-b9b6951b8/"),
      },
      {
        id: "t40-abdullah",
        name: "عبدالله ناصر الزوعري",
        nameEn: "Abdullah AlZaoari",
        field: "علوم الحاسب",
        fieldEn: "Computer Science",
        org: "الجامعة الإسلامية",
        orgEn: "Islamic University of Madinah",
        link: li("https://linkedin.com/in/abdullah-alzaoari"),
      },
    ],
  },
  {
    id: "team-50",
    number: 50,
    members: [
      {
        id: "t50-fatima",
        name: "فاطمة محمد الدحيم",
        nameEn: "Fatima AlDuhaim",
        field: "التصميم الجرافيكي",
        fieldEn: "Graphic Design",
        org: "جامعة الأمير سطام",
        orgEn: "Prince Sattam bin Abdulaziz University",
        link: {
          kind: "portfolio",
          url: "https://la-multimedia.my.canva.site/yellow-and-blue-scrapbook-graphic-design-creative-portfolio-presentation",
        },
      },
      {
        id: "t50-maysa",
        name: "ميساء سامي القليش",
        nameEn: "Maysa AlGlish",
        field: "التجارة الإلكترونية",
        fieldEn: "E-Commerce",
        org: "الجامعة السعودية الإلكترونية",
        orgEn: "Saudi Electronic University",
        link: li("https://www.linkedin.com/in/maysa-alglish-a4b928281"),
      },
      {
        id: "t50-ruba",
        name: "ربى فايز محفوظ",
        nameEn: "Ruba Fayez",
        field: "هندسة البرمجيات",
        fieldEn: "Software Engineering",
        org: "جامعة الملك سعود",
        orgEn: "King Saud University",
        link: li("https://www.linkedin.com/in/rubafayez"),
      },
      {
        id: "t50-lamya",
        name: "لمياء مطلق العتيبي",
        nameEn: "Lamyaa AlOtaibi",
        field: "هندسة البرمجيات",
        fieldEn: "Software Engineering",
        org: "جامعة الملك سعود",
        orgEn: "King Saud University",
        link: li("https://www.linkedin.com/in/lamyaaalotaibi"),
      },
    ],
  },
  {
    id: "team-60",
    number: 60,
    members: [
      {
        id: "t60-alshaimaa",
        name: "الشيماء محمود الشهري",
        nameEn: "AlShaimaa AlShehri",
        field: "التصميم الجرافيكي",
        fieldEn: "Graphic Design",
        org: "جامعة جدة",
        orgEn: "University of Jeddah",
        link: { kind: "website", url: "https://alshaimaa.sa/" },
      },
      {
        id: "t60-maram",
        name: "مرام صالح عمر",
        nameEn: "Maram Saleh",
        field: "تقنية المعلومات",
        fieldEn: "Information Technology",
        org: "جامعة حضرموت",
        orgEn: "Hadhramout University",
        link: li("https://www.linkedin.com/in/maram-saleh-a90569334"),
      },
      {
        id: "t60-ruba",
        name: "ربى أحمد دوغان",
        nameEn: "Rouba Doghan",
        field: "علوم الحاسب",
        fieldEn: "Computer Science",
        org: "الجامعة العربية المفتوحة",
        orgEn: "Arab Open University",
        link: li("https://www.linkedin.com/in/desrouba/"),
      },
      {
        id: "t60-sara",
        name: "سارة أحمد الموكلي",
        nameEn: "Sara AlMawkili",
        field: "علم البيانات والذكاء الاصطناعي",
        fieldEn: "Data Science & AI",
        org: "جامعة الملك سعود",
        orgEn: "King Saud University",
        link: li("https://www.linkedin.com/in/sara-almawkili-170365381"),
      },
    ],
  },
  {
    id: "team-70",
    number: 70,
    members: [
      {
        id: "t70-noura",
        name: "نوره سعود الدوسري",
        nameEn: "Nourah AlDosari",
        field: "علوم الحاسب",
        fieldEn: "Computer Science",
        org: "جامعة الأمير سطام",
        orgEn: "Prince Sattam bin Abdulaziz University",
        link: li("https://www.linkedin.com/in/nourah-aldosari"),
      },
      {
        id: "t70-asma",
        name: "أسماء عبدالله سليمان",
        nameEn: "Asma Suliman",
        field: "البرمجة",
        fieldEn: "Programming",
        // No org
        link: li("https://www.linkedin.com/in/asma-suliman-0aa985247"),
      },
      {
        id: "t70-manar",
        name: "منار محسن السبيعي",
        nameEn: "Manar AlSubaie",
        field: "نظم المعلومات",
        fieldEn: "Information Systems",
        org: "جامعة الملك سعود",
        orgEn: "King Saud University",
        link: li("https://www.linkedin.com/in/manar-alsubaie-3155b3399"),
      },
      {
        id: "t70-haneen",
        name: "حنين ناصر الداود",
        nameEn: "Haneen AlDawood",
        field: "علوم الحاسب",
        fieldEn: "Computer Science",
        org: "جامعة الأميرة نورة بنت عبدالرحمن",
        orgEn: "Princess Nourah bint Abdulrahman University",
        link: li("https://www.linkedin.com/in/haneen-aldawood-069778353"),
      },
    ],
  },
  {
    id: "team-80",
    number: 80,
    members: [
      {
        id: "t80-muqrin",
        name: "مقرن محسن الأسمري",
        nameEn: "Muqrin AlAsmari",
        field: "الهندسة الكهربائية",
        fieldEn: "Electrical Engineering",
        org: "جامعة الملك سعود",
        orgEn: "King Saud University",
        link: li("https://www.linkedin.com/in/muqrin-alasmari"),
      },
      {
        id: "t80-talal",
        name: "طلال مرداس القريني",
        nameEn: "Talal AlKerini",
        field: "أنظمة المعلومات",
        fieldEn: "Information Systems",
        org: "TCS",
        orgEn: "TCS",
        link: li("https://www.linkedin.com/in/talal-m-alkerini"),
      },
      {
        id: "t80-osama",
        name: "أسامة عبدالله الغيلان",
        nameEn: "Osama Abdullah",
        field: "علوم الحاسب",
        fieldEn: "Computer Science",
        org: "جامعة شقراء",
        orgEn: "Shaqra University",
        link: li("https://www.linkedin.com/in/osama-abdullah-37b44b336"),
      },
      {
        id: "t80-abdulilah",
        name: "عبدالإله مشبب الشهري",
        nameEn: "Abdalalh AlShehri",
        field: "تقنية المعلومات",
        fieldEn: "Information Technology",
        org: "جامعة الإمام محمد بن سعود الإسلامية",
        orgEn: "Imam Mohammad Ibn Saud Islamic University",
        link: li("https://www.linkedin.com/in/abdalalh"),
      },
    ],
  },
];

/* ─────────────────────────────────────────────
   Editions registry
   ───────────────────────────────────────────── */

export const EDITIONS: BuildxEdition[] = [
  {
    id: "edition-1",
    label: "النسخة الأولى",
    labelEn: "First Edition",
    year: 2026,
    status: "available",
    copy: {
      allGraduatesTitle: "كل خريجي النسخة الأولى",
      allGraduatesTitleEn: "All Edition 1 Graduates",
      allGraduatesDescription:
        "ثمانية فرق، واثنان وثلاثون خريجًا جمعهم البناء والتجربة وصناعة المنتجات الرقمية.",
      allGraduatesDescriptionEn:
        "Eight teams and thirty-two graduates united by building, testing, and crafting digital products.",
      closingTitle: "انتهت النسخة الأولى… ومن هنا يبدأ أثرهم",
      closingTitleEn: "The First Edition Ends… and Their Impact Begins",
      closingText:
        "اثنان وثلاثون خريجًا، ثمانية فرق، وتجربة واحدة فتحت الطريق لما هو أكبر.",
      closingTextEn:
        "Thirty-two graduates, eight teams, and a single journey that paved the way for something greater.",
      closingEnglish: "THE FIRST EDITION ENDS. THEIR IMPACT BEGINS.",
    },
    awards: edition1Awards,
    teams: edition1Teams,
  },
  {
    id: "edition-2",
    label: "النسخة الثانية",
    labelEn: "Second Edition",
    year: null,
    status: "coming_soon",
    awards: [],
    teams: [],
  },
  {
    id: "edition-3",
    label: "النسخة الثالثة",
    labelEn: "Third Edition",
    year: null,
    status: "coming_soon",
    awards: [],
    teams: [],
  },
];

export const DEFAULT_EDITION_ID = "edition-1";

export function getGraduatesCount(edition: BuildxEdition): number {
  return edition.teams.reduce((sum, team) => sum + team.members.length, 0);
}

export function getLinkLabel(kind: MemberLinkKind, locale: "ar" | "en" = "ar"): string {
  if (locale === "en") {
    switch (kind) {
      case "linkedin":
        return "LinkedIn";
      case "app":
        return "View App";
      case "portfolio":
        return "Portfolio";
      case "website":
        return "Website";
    }
  }

  switch (kind) {
    case "linkedin":
      return "LinkedIn";
    case "app":
      return "عرض التطبيق";
    case "portfolio":
      return "معرض الأعمال";
    case "website":
      return "الموقع الشخصي";
  }
}
