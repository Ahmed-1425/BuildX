// ═══════════════════════════════════════════════════════════════
// BUILDx Question Registry — Central Presentation Mapping
// Maps database keys to full Arabic titles, hints, and formats.
// ═══════════════════════════════════════════════════════════════

export interface QuestionDefinition {
  key: string;
  order: number;
  level: "foundation" | "practitioner" | "advanced" | "common";
  titleAr: string;
  helperAr: string;
  answerType: "text" | "code" | "prompt" | "links" | "video";
  required: boolean;
  fallbackKeys?: string[];
}

export const PRACTITIONER_QUESTIONS: QuestionDefinition[] = [
  {
    key: "programming_experience",
    order: 1,
    level: "practitioner",
    titleAr: "ما خبرتك الحالية في البرمجة وبناء المنتجات الرقمية؟",
    helperAr: "اذكر المجالات التي لديك خبرة فيها، وما الذي تستطيع تنفيذه بنفسك حاليًا.",
    answerType: "text",
    required: true,
    fallbackKeys: ["experience", "dev_experience"],
  },
  {
    key: "tools_and_technologies",
    order: 2,
    level: "practitioner",
    titleAr: "ما الأدوات والتقنيات التي سبق لك استخدامها فعليًا؟",
    helperAr: "اذكر الأدوات أو لغات البرمجة أو منصات الذكاء الاصطناعي التي استخدمتها في مشروع أو تجربة سابقة.",
    answerType: "text",
    required: true,
    fallbackKeys: ["tools", "tech_stack", "ai_coding_tools"],
  },
  {
    key: "previous_project",
    order: 3,
    level: "practitioner",
    titleAr: "حدثنا عن مشروع رقمي واحد سبق لك العمل عليه.",
    helperAr: "ما فكرة المشروع؟ وما الجزء الذي قمت بتنفيذه بنفسك؟ وما الأدوات التي استخدمتها؟",
    answerType: "text",
    required: true,
    fallbackKeys: ["fast_mvp_experience", "project"],
  },
  {
    key: "ai_usage",
    order: 4,
    level: "practitioner",
    titleAr: "كيف تستخدم الذكاء الاصطناعي حاليًا أثناء البرمجة أو بناء المشاريع؟",
    helperAr: "اذكر أداة تستخدمها ومثالًا واضحًا على مهمة نفذتها باستخدامها.",
    answerType: "text",
    required: true,
    fallbackKeys: ["ai_in_coding", "ai_tools_usage"],
  },
  {
    key: "registration_page_prompt",
    order: 5,
    level: "practitioner",
    titleAr: "اكتب Prompt تطلب فيه من أداة ذكاء اصطناعي بناء صفحة تسجيل لموقع إلكتروني.",
    helperAr: "اكتب الطلب كما ستكتبه للأداة فعلًا، مع توضيح ما تريد أن تحتوي عليه الصفحة.",
    answerType: "prompt",
    required: true,
    fallbackKeys: ["prompt_engineering_example", "sample_prompt"],
  },
  {
    key: "debugging_approach",
    order: 6,
    level: "practitioner",
    titleAr: "طلبت من أداة ذكاء اصطناعي بناء خاصية، لكن النتيجة لم تعمل بالشكل المطلوب. ماذا ستفعل؟",
    helperAr: "وضّح كيف ستحدد المشكلة، وتعدل طلبك، وتتحقق من أن النتيجة الجديدة تعمل بشكل صحيح.",
    answerType: "text",
    required: true,
    fallbackKeys: ["debugging_with_ai", "debugging"],
  },
  {
    key: "team_contribution",
    order: 7,
    level: "practitioner",
    titleAr: "كيف ستوظّف خبرتك وتتعامل مع اختلاف مستويات أعضاء الفريق؟",
    helperAr: "وضّح كيف ستساهم في تنفيذ المشروع، وتتعاون مع العضو المتقدم، وتدعم الأعضاء المبتدئين بما يضمن مشاركة الجميع.",
    answerType: "text",
    required: true,
    fallbackKeys: ["team_role_practitioner", "team_work"],
  },
  {
    key: "growth_skill",
    order: 8,
    level: "practitioner",
    titleAr: "ما المهارة التي تحتاج إلى تطويرها حتى تنتقل من مستوى ممارس إلى مستوى متقدم؟",
    helperAr: "حدد جانبًا واضحًا ما زال يحد من قدرتك على بناء منتجات أكثر تكاملًا.",
    answerType: "text",
    required: true,
    fallbackKeys: ["skill_to_grow", "camp_commitment_practitioner"],
  },
  {
    key: "portfolio_links",
    order: 9,
    level: "practitioner",
    titleAr: "شاركنا الروابط التي تعكس أعمالك وخبراتك — إن وجدت.",
    helperAr: "يمكن إرفاق الموقع الشخصي أو GitHub أو Portfolio أو مشاريع سابقة.",
    answerType: "links",
    required: false,
    fallbackKeys: ["portfolio", "projects_links"],
  },
  {
    key: "other_links",
    order: 10,
    level: "practitioner",
    titleAr: "الروابط والحسابات المهنية الأخرى — إن وجدت.",
    helperAr: "مثل LinkedIn أو X أو أي روابط تساعدنا على التعرف على خبراتك.",
    answerType: "links",
    required: false,
    fallbackKeys: ["professional_links", "social_links"],
  },
];

export const FOUNDATION_QUESTIONS: QuestionDefinition[] = [
  {
    key: "technical_experience",
    order: 1,
    level: "foundation",
    titleAr: "ما تجربتك الحالية مع التقنية والذكاء الاصطناعي؟",
    helperAr: "اذكر ما سبق لك تعلمه أو تجربته، حتى لو كانت خبرتك محدودة أو بسيطة.",
    answerType: "text",
    required: true,
  },
  {
    key: "vibe_coding_understanding",
    order: 2,
    level: "foundation",
    titleAr: "ماذا تعرف عن مفهوم Vibe Coding؟",
    helperAr: "اشرح المفهوم كما تفهمه بأسلوبك الخاص، ولا يشترط أن تكون لديك تجربة سابقة فيه.",
    answerType: "text",
    required: true,
  },
  {
    key: "motivation",
    order: 3,
    level: "foundation",
    titleAr: "ما الذي دفعك للتقديم على BUILDx، وما الذي ترغب في اكتسابه من هذه التجربة؟",
    helperAr: "وضّح ما الذي جذبك للمعسكر والمهارات التي تطمح إلى تطويرها.",
    answerType: "text",
    required: true,
  },
  {
    key: "problem_and_solution",
    order: 4,
    level: "foundation",
    titleAr: "اختر مشكلة حقيقية تواجهك أو تلاحظها من حولك. لو أردت حلها بمنتج رقمي، ماذا ستبني؟",
    helperAr: "وضّح المشكلة، ومن يعاني منها، وفكرة الحل بشكل مختصر.",
    answerType: "text",
    required: true,
  },
  {
    key: "self_learning",
    order: 5,
    level: "foundation",
    titleAr: "اذكر شيئًا تعلمته بنفسك مؤخرًا. كيف بدأت، وما الذي فعلته عندما واجهتك صعوبة؟",
    helperAr: "يمكن أن تكون التجربة تقنية أو غير تقنية؛ نهتم بطريقة تعلّمك وتعاملك مع التحديات.",
    answerType: "text",
    required: true,
  },
  {
    key: "team_contribution",
    order: 6,
    level: "foundation",
    titleAr: "ما الذي تستطيع إضافته للفريق والمساهمة به في بناء المشروع؟",
    helperAr: "ستعمل ضمن فريق يضم عضوًا متقدمًا وممارسًا ومبتدئين. وضّح الدور والمساهمة التي تستطيع تقديمها.",
    answerType: "text",
    required: true,
  },
  {
    key: "portfolio_links",
    order: 7,
    level: "foundation",
    titleAr: "شاركنا الروابط التي تعكس أعمالك وخبراتك — إن وجدت.",
    helperAr: "يمكنك إرفاق رابط موقعك الشخصي، أو GitHub، أو Portfolio.",
    answerType: "links",
    required: false,
  },
  {
    key: "other_links",
    order: 8,
    level: "foundation",
    titleAr: "الروابط والحسابات المهنية الأخرى — إن وجدت.",
    helperAr: "مثل LinkedIn أو X أو أي روابط أخرى تساعدنا في التعرف على اهتماماتك.",
    answerType: "links",
    required: false,
    fallbackKeys: ["professional_links"],
  },
];

export const ADVANCED_QUESTIONS: QuestionDefinition[] = [
  {
    key: "strongest_product",
    order: 1,
    level: "advanced",
    titleAr: "حدثنا عن أقوى منتج رقمي سبق لك بناؤه أو تطويره.",
    helperAr: "وضّح فكرة المنتج، ودورك الفعلي فيه، وما الذي قمت بتنفيذه بنفسك، والتقنيات المستخدمة.",
    answerType: "text",
    required: true,
  },
  {
    key: "idea_to_mvp",
    order: 2,
    level: "advanced",
    titleAr: "إذا بدأت اليوم بفكرة منتج جديدة، كيف تنتقل بها من الفكرة إلى MVP قابل للتجربة؟",
    helperAr: "وضّح المراحل التي تتبعها، وكيف تحدد ما يجب أن تتضمنه النسخة الأولى خلال 48 ساعة.",
    answerType: "text",
    required: true,
  },
  {
    key: "vibe_coding_workflow",
    order: 3,
    level: "advanced",
    titleAr: "كيف توظّف Vibe Coding في عملية بناء منتجاتك؟",
    helperAr: "وضّح الأدوات التي تستخدمها، وكيف تعتمد على الذكاء الاصطناعي أثناء كتابة وهندسة البرمجيات.",
    answerType: "text",
    required: true,
  },
  {
    key: "advanced_prompt_example",
    order: 4,
    level: "advanced",
    titleAr: "شاركنا Prompt ترى أنه يعكس مستواك في Vibe Coding.",
    helperAr: "يمكن أن يكون Prompt سبق لك استخدامه أو نموذج لأتمتة عملية برمجية معقدة مع النتيجة المحققة.",
    answerType: "prompt",
    required: true,
  },
  {
    key: "hardest_problem",
    order: 5,
    level: "advanced",
    titleAr: "اذكر أصعب مشكلة واجهتك أثناء بناء مشروع رقمي، وكيف وصلت إلى حل لها.",
    helperAr: "استخدم موقفًا حقيقيًا، ووضّح كيف حددت المشكلة المعمارية أو البرمجية، وما الذي جربته وتجاوزته.",
    answerType: "text",
    required: true,
  },
  {
    key: "team_leadership",
    order: 6,
    level: "advanced",
    titleAr: "بصفتك العضو المتقدم في الفريق، كيف ستتعامل مع اختلاف المستويات وتوزّع العمل؟",
    helperAr: "وضّح كيف ستوزع المسؤوليات، وتدعم الأعضاء الأقل خبرة، وتضمن سرعة الإنجاز دون أن تنفرد بالعمل وحدك.",
    answerType: "text",
    required: true,
  },
  {
    key: "mvp_prioritization",
    order: 7,
    level: "advanced",
    titleAr: "لديك 48 ساعة فقط لبناء MVP، وأدركت ضيق الوقت، كيف تحدد ما تنفذه وما تستبعده؟",
    helperAr: "وضّح المعايير التي ستعتمد عليها في ترتيب الأولويات واستبعاد الميزات غير الأساسية.",
    answerType: "text",
    required: true,
  },
  {
    key: "independent_capability",
    order: 8,
    level: "advanced",
    titleAr: "ما هي قدرتك على تسليم منتج رقمي متكامل من الصفر وحتى النشر السحابي بمفردك؟",
    helperAr: "اشرح جاهزيتك لإطلاق المنتج كاملاً ومستوى استقلاليتك التقنية.",
    answerType: "text",
    required: true,
  },
  {
    key: "video_url",
    order: 9,
    level: "advanced",
    titleAr: "فيديو العرض الخاص بالمتقدم (إلزامي للمستوى المتقدم)",
    helperAr: "رابط فيديو مسجل لشرح مشروع أو فكرة المتقدم.",
    answerType: "video",
    required: true,
    fallbackKeys: ["advanced_video_url"],
  },
  {
    key: "portfolio_links",
    order: 10,
    level: "advanced",
    titleAr: "شاركنا الروابط التي تعكس أعمالك وخبراتك — إن وجدت.",
    helperAr: "الموقع الشخصي، مستودعات GitHub، أو Portfolio سابق.",
    answerType: "links",
    required: false,
  },
  {
    key: "other_links",
    order: 11,
    level: "advanced",
    titleAr: "الروابط والحسابات المهنية الأخرى — إن وجدت.",
    helperAr: "مثل LinkedIn أو X أو غيرها.",
    answerType: "links",
    required: false,
    fallbackKeys: ["professional_links"],
  },
];

/**
 * Returns the canonical question registry for a given applicant level.
 */
export function getQuestionsForLevel(level: string): QuestionDefinition[] {
  switch (level) {
    case "practitioner":
      return PRACTITIONER_QUESTIONS;
    case "advanced":
      return ADVANCED_QUESTIONS;
    case "foundation":
    default:
      return FOUNDATION_QUESTIONS;
  }
}

/**
 * Safely extracts an answer value from the applicant data object, checking both
 * level_answers and top-level fields (e.g. portfolio_links, advanced_video_url).
 */
export function resolveApplicantAnswer(
  q: QuestionDefinition,
  candidate: {
    level_answers?: Record<string, unknown>;
    portfolio_links?: string[];
    professional_links?: string[];
    advanced_video_url?: string | null;
  }
): { value: unknown; hasValue: boolean } {
  // 1. Check special fields
  if (q.key === "portfolio_links") {
    const links = candidate.portfolio_links || (candidate.level_answers?.portfolio_links as string[] | undefined);
    const hasValue = Array.isArray(links) && links.filter(Boolean).length > 0;
    return { value: links || [], hasValue };
  }

  if (q.key === "other_links" || q.key === "professional_links") {
    const links =
      candidate.professional_links ||
      (candidate.level_answers?.professional_links as string[] | undefined) ||
      (candidate.level_answers?.other_links as string[] | undefined);
    const hasValue = Array.isArray(links) && links.filter(Boolean).length > 0;
    return { value: links || [], hasValue };
  }

  if (q.key === "video_url" || q.key === "advanced_video_url") {
    const v =
      candidate.advanced_video_url ||
      (candidate.level_answers?.video_url as string | undefined) ||
      (candidate.level_answers?.advanced_video_url as string | undefined);
    return { value: v || "", hasValue: Boolean(v && typeof v === "string" && v.trim()) };
  }

  // 2. Check main key in level_answers
  const answers = candidate.level_answers || {};
  if (answers[q.key] !== undefined && answers[q.key] !== null && answers[q.key] !== "") {
    return { value: answers[q.key], hasValue: true };
  }

  // 3. Check fallbacks
  if (q.fallbackKeys) {
    for (const fb of q.fallbackKeys) {
      if (answers[fb] !== undefined && answers[fb] !== null && answers[fb] !== "") {
        return { value: answers[fb], hasValue: true };
      }
    }
  }

  return { value: "", hasValue: false };
}

export interface ParsedLinkItem {
  url: string;
  platform: "github" | "linkedin" | "x" | "drive" | "portfolio" | "other";
  name: string;
  domain: string;
}

export function parseApplicantLink(url: string): ParsedLinkItem {
  const trimmed = (url || "").trim();
  const fullUrl = trimmed.startsWith("http://") || trimmed.startsWith("https://") ? trimmed : `https://${trimmed}`;
  let domain = "";
  try {
    domain = new URL(fullUrl).hostname.replace(/^www\./, "");
  } catch {
    domain = trimmed;
  }

  const d = domain.toLowerCase();
  if (d.includes("github.com")) {
    return { url: fullUrl, platform: "github", name: "GitHub", domain };
  }
  if (d.includes("linkedin.com")) {
    return { url: fullUrl, platform: "linkedin", name: "LinkedIn", domain };
  }
  if (d.includes("twitter.com") || d.includes("x.com")) {
    return { url: fullUrl, platform: "x", name: "منصة X", domain };
  }
  if (d.includes("drive.google.com") || d.includes("docs.google.com")) {
    return { url: fullUrl, platform: "drive", name: "Google Drive", domain };
  }
  if (d.includes("behance.net") || d.includes("dribbble.com") || d.includes("portfolio")) {
    return { url: fullUrl, platform: "portfolio", name: "معرض الأعمال (Portfolio)", domain };
  }
  return { url: fullUrl, platform: "other", name: domain || "رابط أعمال", domain };
}

/**
 * Extracts and deduplicates all links provided across candidate fields.
 */
export function extractCandidateLinks(candidate: {
  portfolio_links?: string[] | null;
  professional_links?: string[] | null;
  level_answers?: Record<string, unknown> | null;
}): ParsedLinkItem[] {
  const collected: string[] = [];

  const add = (items: unknown) => {
    if (!items) return;
    if (Array.isArray(items)) {
      items.forEach((it: unknown) => {
        if (typeof it === "string" && it.trim()) collected.push(it.trim());
      });
    } else if (typeof items === "string" && items.trim()) {
      // Might be comma or newline separated
      items
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean)
        .forEach((s) => collected.push(s));
    }
  };

  add(candidate.portfolio_links);
  add(candidate.professional_links);
  add(candidate.level_answers?.portfolio_links);
  add(candidate.level_answers?.other_links);
  add(candidate.level_answers?.professional_links);

  // Deduplicate by normalized URL
  const seen = new Set<string>();
  const results: ParsedLinkItem[] = [];

  for (const raw of collected) {
    const parsed = parseApplicantLink(raw);
    const key = parsed.url.toLowerCase().replace(/\/$/, "");
    if (!seen.has(key)) {
      seen.add(key);
      results.push(parsed);
    }
  }

  return results;
}
