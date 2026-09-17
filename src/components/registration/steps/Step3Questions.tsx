"use client";
import { useLanguage } from "@/context/LanguageContext";
import type { LevelData, FoundationAnswers, PractitionerAnswers, AdvancedAnswers } from "@/types/registration";
import FormField from "../fields/FormField";
import TextareaField from "../fields/TextareaField";
import LinksField from "../fields/LinksField";
import Image from "next/image";

interface Props {
  levelData: LevelData;
  portfolioLinks: string[];
  professionalLinks: string[];
  onLevelDataChange: (ld: LevelData) => void;
  onPortfolioChange: (links: string[]) => void;
  onProfessionalChange: (links: string[]) => void;
  errors: Record<string, string>;
}

// ── Foundation ─────────────────────────────────────────────────
function FoundationQuestions({ answers, onChange, portfolioLinks, professionalLinks, onPortfolioChange, onProfessionalChange, errors }: {
  answers: FoundationAnswers;
  onChange: (a: FoundationAnswers) => void;
  portfolioLinks: string[];
  professionalLinks: string[];
  onPortfolioChange: (l: string[]) => void;
  onProfessionalChange: (l: string[]) => void;
  errors: Record<string, string>;
}) {
  const { locale } = useLanguage();
  const ar = locale === "ar";
  function set(k: keyof FoundationAnswers, v: string) { onChange({ ...answers, [k]: v }); }

  const qs = ar ? [
    { key: "technical_experience" as const, q: "ما تجربتك الحالية مع التقنية والذكاء الاصطناعي؟", hint: "اذكر ما سبق لك تعلمه أو تجربته، حتى لو كانت خبرتك محدودة أو بسيطة." },
    { key: "vibe_coding_understanding" as const, q: "ماذا تعرف عن مفهوم Vibe Coding؟", hint: "اشرح المفهوم كما تفهمه بأسلوبك الخاص، ولا يشترط أن تكون لديك تجربة سابقة فيه." },
    { key: "motivation" as const, q: "ما الذي دفعك للتقديم على BUILDx، وما الذي ترغب في اكتسابه من هذه التجربة؟", hint: "وضّح ما الذي جذبك للمعسكر والمهارات التي تطمح إلى تطويرها." },
    { key: "problem_and_solution" as const, q: "اختر مشكلة حقيقية تواجهك أو تلاحظها من حولك. لو أردت حلها بمنتج رقمي، ماذا ستبني؟", hint: "وضّح المشكلة، ومن يعاني منها، وفكرة الحل بشكل مختصر." },
    { key: "self_learning" as const, q: "اذكر شيئًا تعلمته بنفسك مؤخرًا. كيف بدأت، وما الذي فعلته عندما واجهتك صعوبة؟", hint: "يمكن أن تكون التجربة تقنية أو غير تقنية؛ نهتم بطريقة تعلّمك وتعاملك مع التحديات." },
    { key: "team_contribution" as const, q: "ستعمل خلال BUILDx ضمن فريق يضم عضوًا متقدمًا، وعضوًا ممارسًا، وعضوين مبتدئين. بصفتك أحد الأعضاء المبتدئين، ما الذي تستطيع إضافته للفريق والمساهمة به في بناء المشروع؟", hint: "لا يشترط أن تكون مساهمتك تقنية؛ وضّح الدور الذي تستطيع القيام به." },
  ] : [
    { key: "technical_experience" as const, q: "What is your current experience with technology and AI?", hint: "Mention what you've learned or experimented with, even if your experience is limited." },
    { key: "vibe_coding_understanding" as const, q: "What do you know about the concept of Vibe Coding?", hint: "Explain the concept in your own words; prior experience is not required." },
    { key: "motivation" as const, q: "What motivated you to apply for BUILDx, and what do you hope to gain from this experience?", hint: "Describe what drew you to the camp and the skills you aspire to develop." },
    { key: "problem_and_solution" as const, q: "Choose a real problem you face or observe. If you wanted to solve it with a digital product, what would you build?", hint: "Describe the problem, who it affects, and your solution idea briefly." },
    { key: "self_learning" as const, q: "Mention something you recently taught yourself. How did you start, and what did you do when you faced a challenge?", hint: "It can be technical or non-technical; we care about your learning process." },
    { key: "team_contribution" as const, q: "During BUILDx you'll work in a team with one advanced member, one practitioner, and two beginners. As one of the beginners, what can you contribute to the team?", hint: "Your contribution doesn't have to be technical; describe the role you can play." },
  ];

  return (
    <div className="reg-questions">
      {qs.map((q, i) => (
        <FormField key={q.key} label={`${i + 1}. ${q.q}`} required hint={q.hint} error={errors[q.key]} htmlFor={q.key}>
          <TextareaField id={q.key} value={answers[q.key]} onChange={(v) => set(q.key, v)} error={errors[q.key]} />
        </FormField>
      ))}

      <FormField label={ar ? "7. شاركنا الروابط التي تعكس أعمالك وخبراتك — إن وجدت." : "7. Share links that reflect your work and experience — optional."} hint={ar ? "يمكنك إرفاق رابط موقعك الشخصي، أو GitHub، أو Portfolio." : "You can include your personal website, GitHub, or Portfolio."}>
        <LinksField values={portfolioLinks} onChange={onPortfolioChange} />
      </FormField>

      <FormField label={ar ? "8. شاركنا حساباتك المهنية أو أي روابط أخرى — إن وجدت." : "8. Share your professional accounts or any other links — optional."} hint={ar ? "يمكنك إضافة LinkedIn أو X أو أي روابط أخرى." : "You can add LinkedIn, X, or any other relevant links."}>
        <LinksField values={professionalLinks} onChange={onProfessionalChange} />
      </FormField>
    </div>
  );
}

// ── Practitioner ───────────────────────────────────────────────
function PractitionerQuestions({ answers, onChange, portfolioLinks, professionalLinks, onPortfolioChange, onProfessionalChange, errors }: {
  answers: PractitionerAnswers;
  onChange: (a: PractitionerAnswers) => void;
  portfolioLinks: string[];
  professionalLinks: string[];
  onPortfolioChange: (l: string[]) => void;
  onProfessionalChange: (l: string[]) => void;
  errors: Record<string, string>;
}) {
  const { locale } = useLanguage();
  const ar = locale === "ar";
  function set(k: keyof PractitionerAnswers, v: string) { onChange({ ...answers, [k]: v }); }

  const qs = ar ? [
    { key: "programming_experience" as const, q: "ما خبرتك الحالية في البرمجة وبناء المنتجات الرقمية؟", hint: "اذكر المجالات التي لديك خبرة فيها، وما الذي تستطيع تنفيذه بنفسك حاليًا.", mono: false },
    { key: "tools_and_technologies" as const, q: "ما الأدوات والتقنيات التي سبق لك استخدامها فعليًا؟", hint: "اذكر الأدوات أو لغات البرمجة أو منصات الذكاء الاصطناعي التي استخدمتها.", mono: false },
    { key: "previous_project" as const, q: "حدثنا عن مشروع رقمي واحد سبق لك العمل عليه.", hint: "ما فكرة المشروع؟ وما الجزء الذي قمت بتنفيذه بنفسك؟ وما الأدوات التي استخدمتها؟", mono: false },
    { key: "ai_usage" as const, q: "كيف تستخدم الذكاء الاصطناعي حاليًا أثناء البرمجة أو بناء المشاريع؟", hint: "اذكر أداة تستخدمها ومثالًا واضحًا على مهمة نفذتها باستخدامها.", mono: false },
    { key: "registration_page_prompt" as const, q: "اكتب Prompt تطلب فيه من أداة ذكاء اصطناعي بناء صفحة تسجيل لموقع إلكتروني.", hint: "اكتب الطلب كما ستكتبه للأداة فعلًا، مع توضيح ما تريد أن تحتوي عليه الصفحة.", mono: true },
    { key: "debugging_approach" as const, q: "طلبت من أداة ذكاء اصطناعي بناء خاصية في مشروعك، لكن النتيجة لم تعمل بالشكل المطلوب. ماذا ستفعل؟", hint: "وضّح كيف ستحدد المشكلة، وتعدّل طلبك، وتتحقق من أن النتيجة الجديدة تعمل بشكل صحيح.", mono: false },
    { key: "team_contribution" as const, q: "ستعمل خلال BUILDx ضمن فريق يضم عضوًا متقدمًا، وعضوًا ممارسًا، وعضوين مبتدئين. بصفتك في مستوى الممارس، كيف ستوظّف خبرتك وتتعامل مع اختلاف مستويات أعضاء الفريق؟", hint: "وضّح كيف ستساهم في تنفيذ المشروع، وتتعاون مع العضو المتقدم، وتدعم الأعضاء المبتدئين.", mono: false },
    { key: "growth_skill" as const, q: "ما المهارة التي تحتاج إلى تطويرها حاليًا حتى تنتقل من مستوى ممارس إلى مستوى متقدم؟", hint: "حدد جانبًا واضحًا تشعر أنه ما زال يحد من قدرتك على بناء منتجات أكثر تكاملًا.", mono: false },
  ] : [
    { key: "programming_experience" as const, q: "What is your current experience in programming and building digital products?", hint: "Mention your areas of expertise and what you can implement independently.", mono: false },
    { key: "tools_and_technologies" as const, q: "What tools and technologies have you actually used?", hint: "List tools, programming languages, or AI platforms you've used in a project.", mono: false },
    { key: "previous_project" as const, q: "Tell us about one digital project you've worked on.", hint: "What was the idea? What part did you implement yourself? What tools did you use?", mono: false },
    { key: "ai_usage" as const, q: "How do you currently use AI during programming or project building?", hint: "Mention a tool you use and a clear example of a task you completed using it.", mono: false },
    { key: "registration_page_prompt" as const, q: "Write a Prompt asking an AI tool to build a registration page for a website.", hint: "Write the request exactly as you would to the tool, specifying what the page should contain.", mono: true },
    { key: "debugging_approach" as const, q: "You asked an AI tool to build a feature in your project, but the result didn't work as expected. What would you do?", hint: "Explain how you'd identify the problem, refine your prompt, and verify the new result works correctly.", mono: false },
    { key: "team_contribution" as const, q: "During BUILDx you'll work in a team with one advanced member, one practitioner, and two beginners. As a practitioner, how will you leverage your experience and handle different skill levels?", hint: "Explain how you'll contribute, collaborate with the advanced member, and support beginners.", mono: false },
    { key: "growth_skill" as const, q: "What skill do you need to develop right now to advance from practitioner to advanced level?", hint: "Identify a clear aspect that still limits your ability to build more complete products.", mono: false },
  ];

  return (
    <div className="reg-questions">
      {qs.map((q, i) => (
        <FormField key={q.key} label={`${i + 1}. ${q.q}`} required hint={q.hint} error={errors[q.key]} htmlFor={q.key}>
          <TextareaField id={q.key} value={answers[q.key]} onChange={(v) => set(q.key, v)} error={errors[q.key]} />
        </FormField>
      ))}
      <FormField label={ar ? "9. شاركنا الروابط التي تعكس أعمالك وخبراتك — إن وجدت." : "9. Share links that reflect your work — optional."}>
        <LinksField values={portfolioLinks} onChange={onPortfolioChange} />
      </FormField>
      <FormField label={ar ? "10. أضف حساباتك المهنية — إن وجدت." : "10. Add your professional accounts — optional."}>
        <LinksField values={professionalLinks} onChange={onProfessionalChange} />
      </FormField>
    </div>
  );
}

// ── Advanced ───────────────────────────────────────────────────
function AdvancedQuestions({ answers, onChange, portfolioLinks, professionalLinks, onPortfolioChange, onProfessionalChange, errors }: {
  answers: AdvancedAnswers;
  onChange: (a: AdvancedAnswers) => void;
  portfolioLinks: string[];
  professionalLinks: string[];
  onPortfolioChange: (l: string[]) => void;
  onProfessionalChange: (l: string[]) => void;
  errors: Record<string, string>;
}) {
  const { locale } = useLanguage();
  const ar = locale === "ar";
  function set(k: keyof AdvancedAnswers, v: string | boolean) { onChange({ ...answers, [k]: v }); }

  const qs = ar ? [
    { key: "strongest_product" as const, q: "حدثنا عن أقوى منتج رقمي سبق لك بناؤه أو تطويره.", hint: "وضّح فكرة المنتج، ودورك الفعلي فيه، وما الذي قمت بتنفيذه بنفسك." },
    { key: "idea_to_mvp" as const, q: "إذا بدأت اليوم بفكرة منتج جديدة، كيف تنتقل بها من الفكرة إلى MVP قابل للتجربة؟", hint: "وضّح المراحل التي تتبعها، وكيف تحدد ما يجب أن تتضمنه النسخة الأولى." },
    { key: "vibe_coding_workflow" as const, q: "كيف توظّف Vibe Coding في عملية بناء منتجاتك؟", hint: "وضّح الأدوات التي تستخدمها، وكيف تعتمد على الذكاء الاصطناعي أثناء البناء." },
    { key: "advanced_prompt_example" as const, q: "شاركنا Prompt ترى أنه يعكس مستواك في Vibe Coding.", hint: "يمكن أن يكون Prompt سبق لك استخدامه أو مثالًا من مشروع حقيقي، مع توضيح النتيجة التي كنت تريد الوصول إليها." },
    { key: "hardest_problem" as const, q: "اذكر أصعب مشكلة واجهتك أثناء بناء مشروع رقمي، وكيف وصلت إلى حل لها.", hint: "استخدم موقفًا حقيقيًا، ووضّح كيف حددت المشكلة، وما الذي جربته، وكيف تحققت من الحل." },
    { key: "team_leadership" as const, q: "في BUILDx ستعمل ضمن فريق يضم عضوًا متقدمًا، وعضوًا ممارسًا، وعضوين مبتدئين. بصفتك العضو المتقدم في الفريق، كيف ستتعامل مع اختلاف المستويات وتوزّع العمل بحيث يشارك الجميع بفعالية دون أن تتحمل تنفيذ المشروع وحدك؟", hint: "وضّح كيف ستوزع المسؤوليات، وتدعم الأعضاء الأقل خبرة، وتحافظ على جودة المنتج وسرعة الإنجاز." },
    { key: "mvp_prioritization" as const, q: "لديك 48 ساعة فقط لبناء MVP، وأدركت أن الوقت لن يسمح بتنفيذ جميع الـ Features المخطط لها. كيف ستحدد ما الذي ستنفذه وما الذي ستستبعده؟", hint: "وضّح المعايير التي ستعتمد عليها في ترتيب الأولويات والوصول إلى منتج قابل للتجربة ضمن الوقت المتاح." },
    { key: "independent_capability" as const, q: "ما الذي تستطيع تنفيذه اليوم بشكل مستقل ويثبت أنك مناسب للمستوى المتقدم في BUILDx؟", hint: "استند إلى قدرات ومشاريع وتجارب فعلية، وليس إلى أسماء الأدوات أو تقييمك الشخصي لمستواك." },
  ] : [
    { key: "strongest_product" as const, q: "Tell us about the strongest digital product you've built or developed.", hint: "Explain the product idea, your actual role, and what you implemented yourself." },
    { key: "idea_to_mvp" as const, q: "If you started with a new product idea today, how would you go from idea to a testable MVP?", hint: "Describe the stages you follow and how you decide what the first version should include." },
    { key: "vibe_coding_workflow" as const, q: "How do you apply Vibe Coding in your product-building process?", hint: "Describe the tools you use and how you leverage AI during the build." },
    { key: "advanced_prompt_example" as const, q: "Share a Prompt that you feel reflects your Vibe Coding level.", hint: "It can be a prompt you've used before or an example from a real project, with the outcome you aimed for." },
    { key: "hardest_problem" as const, q: "Describe the hardest problem you've faced while building a digital project and how you solved it.", hint: "Use a real situation; explain how you identified the problem, what you tried, and how you verified the solution." },
    { key: "team_leadership" as const, q: "In BUILDx you'll work in a team with one advanced member, one practitioner, and two beginners. As the advanced member, how will you handle different skill levels and distribute work so everyone participates effectively?", hint: "Explain how you'll assign responsibilities, support less-experienced members, while maintaining product quality and pace." },
    { key: "mvp_prioritization" as const, q: "You have only 48 hours to build an MVP and realize time won't allow all planned features. How do you decide what to implement and what to cut?", hint: "Describe the criteria you'll use to prioritize and deliver a testable product within the time available." },
    { key: "independent_capability" as const, q: "What can you independently implement today that proves you're suited for the Advanced level in BUILDx?", hint: "Reference actual capabilities, projects, and experiences — not tool names or your self-assessment." },
  ];

  return (
    <div className="reg-questions">
      {qs.map((q, i) => (
        <FormField key={q.key} label={`${i + 1}. ${q.q}`} required hint={q.hint} error={errors[q.key]} htmlFor={q.key}>
          <TextareaField id={q.key} value={answers[q.key]} onChange={(v) => set(q.key, v)} error={errors[q.key]} />
        </FormField>
      ))}

      {/* Video */}
      <FormField
        label={ar ? "9. فيديو استعراض مشروع سابق *" : "9. Project showcase video *"}
        required
        hint={ar
          ? "أرفق رابط فيديو لا تتجاوز مدته 100 ثانية، تستعرض فيه أحد مشاريعك السابقة. ارفع الفيديو على Google Drive واجعل صلاحية الرابط: أي شخص لديه الرابط يمكنه العرض."
          : "Attach a link to a video no longer than 100 seconds showcasing one of your previous projects. Upload to Google Drive with 'Anyone with the link can view' permission."}
        error={errors.video_url}
        htmlFor="video_url"
      >
        <input
          id="video_url"
          type="url"
          value={answers.video_url}
          onChange={(e) => set("video_url", e.target.value)}
          placeholder="https://drive.google.com/..."
          className={`reg-input ${errors.video_url ? "reg-input--error" : ""}`}
          dir="ltr"
        />
        <label className={`reg-checkbox-row mt-3 ${errors.video_access_confirmed ? "reg-checkbox-row--error" : ""}`}>
          <input
            type="checkbox"
            checked={answers.video_access_confirmed}
            onChange={(e) => set("video_access_confirmed", e.target.checked)}
            className="reg-checkbox"
          />
          <span className="reg-checkbox-label">
            {ar
              ? "أؤكد أن رابط الفيديو يعمل، وأن صلاحية المشاهدة متاحة لأي شخص لديه الرابط."
              : "I confirm the video link works and is accessible to anyone with the link."}
          </span>
        </label>
        {errors.video_access_confirmed && <p className="reg-error">{errors.video_access_confirmed}</p>}
      </FormField>

      <FormField label={ar ? "10. شاركنا الروابط التي تعكس أعمالك وخبراتك — إن وجدت." : "10. Share links that reflect your work — optional."}>
        <LinksField values={portfolioLinks} onChange={onPortfolioChange} />
      </FormField>
      <FormField label={ar ? "11. حسابات مهنية وروابط أخرى — إن وجدت." : "11. Professional accounts & other links — optional."}>
        <LinksField values={professionalLinks} onChange={onProfessionalChange} />
      </FormField>
    </div>
  );
}

// ── Main Step3 ─────────────────────────────────────────────────
export default function Step3Questions({ levelData, portfolioLinks, professionalLinks, onLevelDataChange, onPortfolioChange, onProfessionalChange, errors }: Props) {
  const { locale } = useLanguage();
  const ar = locale === "ar";

  const charMap: Record<string, string> = {
    foundation: "/assets/characters/char-building.png",
    practitioner: "/assets/characters/char-building.png",
    advanced: "/assets/characters/char-building.png",
  };

  const titleMap = ar
    ? { foundation: "أسئلة المبتدئ | Foundation", practitioner: "أسئلة الممارس | Practitioner", advanced: "أسئلة المتقدم | Advanced" }
    : { foundation: "Foundation Questions", practitioner: "Practitioner Questions", advanced: "Advanced Questions" };

  return (
    <div className="reg-step">
      <div className="reg-step-header">
        <Image src={charMap[levelData.level]} alt="" width={72} height={72} className="reg-step-char" />
        <div>
          <h2 className="reg-step-title">{titleMap[levelData.level]}</h2>
          <p className="reg-step-subtitle">{ar ? "أجب على الأسئلة التالية بصدق وبتفصيل كافٍ." : "Answer the following questions honestly and in sufficient detail."}</p>
        </div>
      </div>

      {levelData.level === "foundation" && (
        <FoundationQuestions answers={levelData.answers} onChange={(a) => onLevelDataChange({ level: "foundation", answers: a })} portfolioLinks={portfolioLinks} professionalLinks={professionalLinks} onPortfolioChange={onPortfolioChange} onProfessionalChange={onProfessionalChange} errors={errors} />
      )}
      {levelData.level === "practitioner" && (
        <PractitionerQuestions answers={levelData.answers} onChange={(a) => onLevelDataChange({ level: "practitioner", answers: a })} portfolioLinks={portfolioLinks} professionalLinks={professionalLinks} onPortfolioChange={onPortfolioChange} onProfessionalChange={onProfessionalChange} errors={errors} />
      )}
      {levelData.level === "advanced" && (
        <AdvancedQuestions answers={levelData.answers} onChange={(a) => onLevelDataChange({ level: "advanced", answers: a })} portfolioLinks={portfolioLinks} professionalLinks={professionalLinks} onPortfolioChange={onPortfolioChange} onProfessionalChange={onProfessionalChange} errors={errors} />
      )}
    </div>
  );
}
