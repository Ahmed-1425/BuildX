// ============================================================================
// BUILDx Team — Centralised Data Registry
// ============================================================================
// Every person is defined ONCE.  Sections reference by `memberId`.
// To swap a temporary image, update `imageSrc` in the member record only.

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SocialLinks = {
  website?: string;
  linkedin?: string;
  x?: string;
};

export type TeamMember = {
  id: string;
  nameAr: string;
  nameEn: string;
  imageSrc: string;
  imageIsTemporary?: boolean;
  links: SocialLinks;
};

export type TeamSectionMember = {
  memberId: string;
  roleAr?: string;
  roleEn?: string;
  order: number;
};

export type TeamSection = {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr?: string;
  descriptionEn?: string;
  members: TeamSectionMember[];
  layout: "leadership" | "spotlight" | "grid";
};

export type Partner = {
  id: string;
  nameAr: string;
  nameEn: string;
  typeAr: string;
  typeEn: string;
  logoSrc: string;
};

// ---------------------------------------------------------------------------
// Member Registry
// ---------------------------------------------------------------------------

export const teamMembers: TeamMember[] = [
  {
    id: "ahmed-alrashid",
    nameAr: "أحمد الرشيد",
    nameEn: "Ahmed Alrashid",
    imageSrc: "/assets/team/ahmed-alrashid.png",
    links: {
      website: "https://ahmedalrasheed.com",
      linkedin: "https://www.linkedin.com/in/akalrashid/",
      x: "https://x.com/akalrashid",
    },
  },
  {
    id: "yusra-zuhd",
    nameAr: "يسرى زهد",
    nameEn: "Yusra Zuhd",
    imageSrc: "/assets/team/female-placeholder.png",
    imageIsTemporary: true,
    links: {
      linkedin: "https://www.linkedin.com/in/yusra-zuhd-9a7147346",
      x: "https://x.com/yusraz2005",
    },
  },
  {
    id: "haya-alshowaish",
    nameAr: "هياء الشويش",
    nameEn: "Haya Alshowaish",
    imageSrc: "/assets/team/female-placeholder.png",
    imageIsTemporary: true,
    links: {},
  },
  {
    id: "abdulrazaq-aldawsaeri",
    nameAr: "عبدالرزاق الدوسري",
    nameEn: "Abdulrazaq Aldawsaeri",
    imageSrc: "/assets/team/abdulrazaq-aldawsaeri.png",
    links: {
      website: "https://abdalrazaq.com",
      linkedin: "https://www.linkedin.com/in/abdulrazaq-h-aldawsari",
      x: "https://x.com/Raz__Com",
    },
  },
  {
    id: "alanood-alsaaid",
    nameAr: "العنود السعيّد",
    nameEn: "AlAnood Alsaaid",
    imageSrc: "/assets/team/female-placeholder.png",
    imageIsTemporary: true,
    links: {
      linkedin: "https://www.linkedin.com/in/alanood-alsaaid-456092345",
    },
  },
  {
    id: "mohammed-alziyad",
    nameAr: "محمد الزياد",
    nameEn: "Mohammed Alziyad",
    imageSrc: "/assets/team/mohammed-alziyad.png",
    links: {
      linkedin: "https://www.linkedin.com/in/moalziyad/",
    },
  },
  {
    id: "abdulaziz-bin-nashwan",
    nameAr: "عبدالعزيز بن نشوان",
    nameEn: "Abdulaziz Bin Nashwan",
    imageSrc: "/assets/team/abdulaziz-bin-nashwan.png",
    links: {
      linkedin: "https://www.linkedin.com/in/abdulaziz-binnashwan/",
    },
  },
  {
    id: "iqbal-aldulami",
    nameAr: "إقبال الدلامي",
    nameEn: "Iqbal Aldulami",
    imageSrc: "/assets/team/female-placeholder.png",
    imageIsTemporary: true,
    links: {
      linkedin: "https://www.linkedin.com/in/iqbal-aldulami-17967537a/",
    },
  },
  {
    id: "mohammed-alsudais",
    nameAr: "محمد السديس",
    nameEn: "Mohammed Alsudais",
    imageSrc: "/assets/team/mohammed-alsudais.png",
    links: {
      linkedin: "https://www.linkedin.com/in/mohammed-alsudais-6b893529b",
      x: "https://x.com/m8aalvv",
    },
  },
  {
    id: "saud-bin-tuays",
    nameAr: "سعود بن طعيس",
    nameEn: "Saud Bin Tuays",
    imageSrc: "/assets/team/saud-bin-tuays.png",
    links: {
      linkedin: "https://www.linkedin.com/in/saud-bin-tuays-481a96314",
    },
  },
  {
    id: "noura-alarfaj",
    nameAr: "نورة آل عرفج",
    nameEn: "Noura Alarfaj",
    imageSrc: "/assets/team/female-placeholder.png",
    imageIsTemporary: true,
    links: {
      linkedin: "https://www.linkedin.com/in/noura-al-arfaj-069572390",
    },
  },
  {
    id: "khaled-alotaibi",
    nameAr: "خالد العتيبي",
    nameEn: "Khaled Alotaibi",
    imageSrc: "/assets/team/khaled-alotaibi.png",
    links: {
      linkedin: "https://www.linkedin.com/in/khaled-saud-95264129a",
    },
  },
  {
    id: "asma-abdullghani",
    nameAr: "أسماء عبدالغني",
    nameEn: "Asma Abdullghani",
    imageSrc: "/assets/team/female-placeholder.png",
    imageIsTemporary: true,
    links: {
      linkedin: "https://www.linkedin.com/in/asma2028",
    },
  },
  {
    id: "mansour-alahmad",
    nameAr: "منصور الأحمد",
    nameEn: "Mansour Alahmad",
    imageSrc: "/assets/team/mansour-alahmed.png",
    links: {
      linkedin: "https://www.linkedin.com/in/mansour-alahmad-282892214",
    },
  },
  {
    id: "osama-alanazi",
    nameAr: "أسامة العنزي",
    nameEn: "Osama Alanazi",
    imageSrc: "/assets/team/osama-alenzi.png",
    links: {
      linkedin: "https://www.linkedin.com/in/osama-i-al-anazi-8bba6b375/",
    },
  },
  {
    id: "abdulmajeed-alshammari",
    nameAr: "عبدالمجيد الشمري",
    nameEn: "Abdulmajeed Alshammari",
    imageSrc: "/assets/team/abdulmajeed-alshammari.png",
    links: {},
  },
  {
    id: "rayana-al-arfaj",
    nameAr: "رايانا آل عرفج",
    nameEn: "Rayana Al-Arfaj",
    imageSrc: "/assets/team/female-placeholder.png",
    imageIsTemporary: true,
    links: {
      linkedin: "https://www.linkedin.com/in/rayana-al-arfaj-39a812420",
    },
  },
  {
    id: "lara-haggy",
    nameAr: "لارا حقي",
    nameEn: "Lara Haggy",
    imageSrc: "/assets/team/female-placeholder.png",
    imageIsTemporary: true,
    links: {
      x: "https://x.com/alway3her",
    },
  },
  {
    id: "mshari-alqahtani",
    nameAr: "مشاري القحطاني",
    nameEn: "Mshari Al-Qahtani",
    imageSrc: "/assets/team/mshari-alqahtani.png",
    links: {
      linkedin: "https://www.linkedin.com/in/mshari-al-qahtani-0a6b95410",
    },
  },
  {
    id: "joud-alwehaib",
    nameAr: "جود الوهيب",
    nameEn: "Joud Alwehaib",
    imageSrc: "/assets/team/female-placeholder.png",
    imageIsTemporary: true,
    links: {
      linkedin: "https://www.linkedin.com/in/joud-alwehaib-562464407",
    },
  },
  {
    id: "ghala-al-kaltham",
    nameAr: "غلا آل كلثم",
    nameEn: "Ghala Al Kaltham",
    imageSrc: "/assets/team/female-placeholder.png",
    imageIsTemporary: true,
    links: {
      linkedin: "https://www.linkedin.com/in/ghala-al-kaltham-565a60360",
    },
  },
  {
    id: "reema-alhussain",
    nameAr: "ريما الحسين",
    nameEn: "Reema Alhussain",
    imageSrc: "/assets/team/female-placeholder.png",
    imageIsTemporary: true,
    links: {
      linkedin: "https://www.linkedin.com/in/reema-alhussain-68680a3a5",
    },
  },
  {
    id: "lujain-altamimi",
    nameAr: "لجين التميمي",
    nameEn: "Lujain Altamimi",
    imageSrc: "/assets/team/female-placeholder.png",
    imageIsTemporary: true,
    links: {
      linkedin: "https://www.linkedin.com/in/lujain-al-tamimi-424275278",
    },
  },
  {
    id: "turki-alreshidi",
    nameAr: "تركي الرشيدي",
    nameEn: "Turki Alreshidi",
    imageSrc: "/assets/team/turki-alreshidi.png",
    links: {
      linkedin: "https://www.linkedin.com/in/turki-alreshidi-95914b316",
    },
  },
  {
    id: "asayel-alraqqas",
    nameAr: "أصايل الرقاص",
    nameEn: "Asayel Alraqqas",
    imageSrc: "/assets/team/female-placeholder.png",
    imageIsTemporary: true,
    links: {
      linkedin: "https://www.linkedin.com/in/asayel-alraqqas-a46890255",
    },
  },
  {
    id: "aldanah-althenyan",
    nameAr: "الدانة آل ثنيان",
    nameEn: "Aldanah Althenyan",
    imageSrc: "/assets/team/female-placeholder.png",
    imageIsTemporary: true,
    links: {
      linkedin: "https://www.linkedin.com/in/aldanah-althunayan-8b4985319",
    },
  },
  {
    id: "sami-almutairi",
    nameAr: "سامي المطيري",
    nameEn: "Sami Almutairi",
    imageSrc: "/assets/team/sami-almutairi.png",
    links: {
      linkedin: "https://www.linkedin.com/in/سامي-المطيري-058824355?utm_source=share_via&utm_content=profile&utm_medium=member_ios",
    },
  },
];

// ---------------------------------------------------------------------------
// Sections (ordered 01 → 08)
// ---------------------------------------------------------------------------

export const teamSections: TeamSection[] = [
  {
    id: "buildx-management",
    titleAr: "إدارة مشروع BUILDx",
    titleEn: "BUILDx Project Management",
    members: [
      {
        memberId: "ahmed-alrashid",
        roleAr: "إدارة مشروع BUILDx",
        roleEn: "BUILDx Project Management",
        order: 1,
      },
      {
        memberId: "yusra-zuhd",
        roleAr: "إدارة مشروع BUILDx",
        roleEn: "BUILDx Project Management",
        order: 2,
      },
      {
        memberId: "haya-alshowaish",
        roleAr: "إدارة مشروع BUILDx",
        roleEn: "BUILDx Project Management",
        order: 3,
      },
    ],
    layout: "leadership",
  },
  {
    id: "tiqanah-management",
    titleAr: "إدارة مبادرة تقانة",
    titleEn: "Tiqanah Initiative Management",
    members: [
      {
        memberId: "mohammed-alsudais",
        roleAr: "إدارة مبادرة تقانة",
        roleEn: "Tiqanah Initiative Management",
        order: 1,
      },
      {
        memberId: "aldanah-althenyan",
        roleAr: "إدارة مبادرة تقانة",
        roleEn: "Tiqanah Initiative Management",
        order: 2,
      },
    ],
    layout: "grid",
  },
  {
    id: "executive-management",
    titleAr: "الإدارة التنفيذية",
    titleEn: "Executive Management",
    members: [
      {
        memberId: "saud-bin-tuays",
        roleAr: "الإدارة التنفيذية",
        roleEn: "Executive Management",
        order: 1,
      },
      {
        memberId: "noura-alarfaj",
        roleAr: "الإدارة التنفيذية",
        roleEn: "Executive Management",
        order: 2,
      },
      {
        memberId: "khaled-alotaibi",
        roleAr: "الإدارة التنفيذية",
        roleEn: "Executive Management",
        order: 3,
      },
      {
        memberId: "asma-abdullghani",
        roleAr: "الإدارة التنفيذية",
        roleEn: "Executive Management",
        order: 4,
      },
    ],
    layout: "grid",
  },
  {
    id: "media-management",
    titleAr: "الإدارة الإعلامية",
    titleEn: "Media Management",
    members: [
      {
        memberId: "mansour-alahmad",
        roleAr: "الإدارة الإعلامية",
        roleEn: "Media Management",
        order: 1,
      },
      {
        memberId: "osama-alanazi",
        roleAr: "الإدارة الإعلامية",
        roleEn: "Media Management",
        order: 2,
      },
      {
        memberId: "abdulmajeed-alshammari",
        roleAr: "الإدارة الإعلامية",
        roleEn: "Media Management",
        order: 3,
      },
      {
        memberId: "rayana-al-arfaj",
        roleAr: "الإدارة الإعلامية",
        roleEn: "Media Management",
        order: 4,
      },
      {
        memberId: "lara-haggy",
        roleAr: "الإدارة الإعلامية",
        roleEn: "Media Management",
        order: 5,
      },
    ],
    layout: "grid",
  },
  {
    id: "public-relations",
    titleAr: "إدارة العلاقات العامة",
    titleEn: "Public Relations Management",
    members: [
      {
        memberId: "turki-alreshidi",
        roleAr: "إدارة العلاقات العامة",
        roleEn: "Public Relations Management",
        order: 1,
      },
      {
        memberId: "lujain-altamimi",
        roleAr: "إدارة العلاقات العامة",
        roleEn: "Public Relations Management",
        order: 2,
      },
      {
        memberId: "mshari-alqahtani",
        roleAr: "إدارة العلاقات العامة",
        roleEn: "Public Relations Management",
        order: 3,
      },
      {
        memberId: "joud-alwehaib",
        roleAr: "إدارة العلاقات العامة",
        roleEn: "Public Relations Management",
        order: 4,
      },
      {
        memberId: "asayel-alraqqas",
        roleAr: "إدارة العلاقات العامة",
        roleEn: "Public Relations Management",
        order: 5,
      },
      {
        memberId: "ghala-al-kaltham",
        roleAr: "إدارة العلاقات العامة",
        roleEn: "Public Relations Management",
        order: 6,
      },
      {
        memberId: "reema-alhussain",
        roleAr: "إدارة العلاقات العامة",
        roleEn: "Public Relations Management",
        order: 7,
      },
      {
        memberId: "sami-almutairi",
        roleAr: "إدارة العلاقات العامة",
        roleEn: "Public Relations Management",
        order: 8,
      },
    ],
    layout: "grid",
  },
  {
    id: "trainer-and-assistant",
    titleAr: "المدرب ومساعد التدريس",
    titleEn: "Trainer & Teaching Assistant",
    members: [
      {
        memberId: "ahmed-alrashid",
        roleAr: "المدرب",
        roleEn: "Trainer",
        order: 1,
      },
      {
        memberId: "abdulrazaq-aldawsaeri",
        roleAr: "مساعد تدريس",
        roleEn: "Teaching Assistant",
        order: 2,
      },
    ],
    layout: "grid",
  },
  {
    id: "mentorship",
    titleAr: "المرشدين والميسر",
    titleEn: "Mentors & Facilitator",
    members: [
      {
        memberId: "ahmed-alrashid",
        roleAr: "مرشد",
        roleEn: "Mentor",
        order: 1,
      },
      {
        memberId: "haya-alshowaish",
        roleAr: "مرشد",
        roleEn: "Mentor",
        order: 2,
      },
      {
        memberId: "abdulrazaq-aldawsaeri",
        roleAr: "مرشد",
        roleEn: "Mentor",
        order: 3,
      },
      {
        memberId: "alanood-alsaaid",
        roleAr: "مرشد",
        roleEn: "Mentor",
        order: 4,
      },
      {
        memberId: "yusra-zuhd",
        roleAr: "ميسر",
        roleEn: "Facilitator",
        order: 5,
      },
    ],
    layout: "grid",
  },
  {
    id: "judging-committee",
    titleAr: "لجنة التحكيم",
    titleEn: "Judging Committee",
    members: [
      {
        memberId: "ahmed-alrashid",
        roleAr: "محكّم",
        roleEn: "Judge",
        order: 1,
      },
      {
        memberId: "mohammed-alziyad",
        roleAr: "محكّم",
        roleEn: "Judge",
        order: 2,
      },
      {
        memberId: "abdulaziz-bin-nashwan",
        roleAr: "محكّم",
        roleEn: "Judge",
        order: 3,
      },
      {
        memberId: "iqbal-aldulami",
        roleAr: "محكّم",
        roleEn: "Judge",
        order: 4,
      },
    ],
    layout: "grid",
  },
];

// ---------------------------------------------------------------------------
// Partners
// ---------------------------------------------------------------------------

export const partners: Partner[] = [
  {
    id: "zid",
    nameAr: "شركة زد",
    nameEn: "Zid",
    typeAr: "الشريك الاستراتيجي",
    typeEn: "Strategic Partner",
    logoSrc: "/assets/partners/zid.png",
  },
  {
    id: "t2-business",
    nameAr: "T2 Business",
    nameEn: "T2 Business",
    typeAr: "شريك نجاح",
    typeEn: "Success Partner",
    logoSrc: "/assets/partners/t2-business.png",
  },
  {
    id: "jal-alwadi",
    nameAr: "جال الوادي",
    nameEn: "Jal Alwadi",
    typeAr: "راعي الضيافة الذهبي",
    typeEn: "Golden Hospitality Sponsor",
    logoSrc: "/assets/partners/jal-alwadi.png",
  },
  {
    id: "dawar-alsaada",
    nameAr: "دوار السعادة",
    nameEn: "Dawar Al Saada",
    typeAr: "راعي ضيافة",
    typeEn: "Hospitality Sponsor",
    logoSrc: "/assets/partners/dawar-alsaada.png",
  },
  {
    id: "moreine",
    nameAr: "مورين",
    nameEn: "Moreine",
    typeAr: "راعي ضيافة",
    typeEn: "Hospitality Sponsor",
    logoSrc: "/assets/partners/moreine.png",
  },
  {
    id: "meta-cafe",
    nameAr: "ميتا كافيه",
    nameEn: "Meta Cafe",
    typeAr: "راعي ضيافة",
    typeEn: "Hospitality Sponsor",
    logoSrc: "/assets/partners/meta-cafe.png",
  },
];

// ---------------------------------------------------------------------------
// Helper: look up a member by id
// ---------------------------------------------------------------------------

export function getMemberById(id: string): TeamMember | undefined {
  return teamMembers.find((m) => m.id === id);
}
