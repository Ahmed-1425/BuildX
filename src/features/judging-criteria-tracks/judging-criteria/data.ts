import {
  Target,
  Lightbulb,
  Code2,
  PackageCheck,
  PanelsTopLeft,
  BrainCircuit,
  ChartNoAxesCombined,
  BriefcaseBusiness,
  Presentation,
  UsersRound,
  CalendarCheck2,
} from 'lucide-react';
import type { JudgingCriterion, JudgingStage } from './types';

export const JUDGING_CRITERIA_LIST: JudgingCriterion[] = [
  // Stage 1
  {
    id: 1,
    stageId: 1,
    stageNumberStr: '01',
    criterionNumberStr: '01',
    weight: 10,
    accent: 'lime',
    icon: Target,
    translations: {
      ar: {
        title: 'فهم التحدي والارتباط بالمسار',
        stageLabel: 'المرحلة 01: فهم الفكرة',
        description:
          'مدى دقة تعريف الفريق للمشكلة، وفهمه لسؤال المسار والفئة المستفيدة والأسباب الفعلية للتحدي.',
        checkpointsTitle: 'ما الذي يبحث عنه المحكم؟',
        checkpoints: [
          'تعريف دقيق للمشكلة.',
          'ارتباط واضح بسؤال المسار.',
          'تحديد الفئة المستفيدة.',
          'فهم أسباب التحدي.',
        ],
      },
      en: {
        title: 'Challenge Understanding & Track Alignment',
        stageLabel: 'Stage 01: Problem Discovery',
        description:
          'Precision in problem definition, track question comprehension, target audience mapping, and root cause analysis.',
        checkpointsTitle: 'What are the judges looking for?',
        checkpoints: [
          'Precise definition of the core problem.',
          'Clear alignment with the track challenge.',
          'Accurate identification of target beneficiaries.',
          'Solid understanding of underlying root causes.',
        ],
      },
    },
  },
  {
    id: 2,
    stageId: 1,
    stageNumberStr: '01',
    criterionNumberStr: '02',
    weight: 10,
    accent: 'lime',
    icon: Lightbulb,
    translations: {
      ar: {
        title: 'الابتكار',
        stageLabel: 'المرحلة 01: فهم الفكرة',
        description:
          'مدى جِدة الفكرة وتميّزها عن الحلول المعتادة، ووجود عنصر ابتكاري واضح في طريقة معالجة المشكلة.',
        checkpointsTitle: 'ما الذي يبحث عنه المحكم؟',
        checkpoints: [
          'جدة الفكرة.',
          'اختلافها عن الحلول المعتادة.',
          'وجود عنصر ابتكاري واضح.',
          'معالجة متميزة للمشكلة.',
        ],
      },
      en: {
        title: 'Innovation & Novelty',
        stageLabel: 'Stage 01: Problem Discovery',
        description:
          'Novelty and differentiation from existing solutions, demonstrating a distinct innovative angle in problem-solving.',
        checkpointsTitle: 'What are the judges looking for?',
        checkpoints: [
          'Fresh and novel perspective.',
          'Clear differentiation from standard approaches.',
          'Evident innovative element in execution.',
          'Distinctive methodology in solving the issue.',
        ],
      },
    },
  },

  // Stage 2
  {
    id: 3,
    stageId: 2,
    stageNumberStr: '02',
    criterionNumberStr: '03',
    weight: 10,
    accent: 'violet',
    icon: Code2,
    translations: {
      ar: {
        title: 'جودة التنفيذ التقني',
        stageLabel: 'المرحلة 02: بناء المنتج',
        description:
          'استقرار المنتج، وسلامة عمل خصائصه، وسرعة استجابته، وخلوّه من الأعطال والمشكلات التقنية المؤثرة.',
        checkpointsTitle: 'ما الذي يبحث عنه المحكم؟',
        checkpoints: [
          'استقرار المنتج.',
          'سلامة عمل الخصائص.',
          'سرعة الاستجابة.',
          'عدم وجود أعطال مؤثرة.',
        ],
      },
      en: {
        title: 'Technical Execution Quality',
        stageLabel: 'Stage 02: Product Build',
        description:
          'Product stability, flawless feature operation, responsiveness, and freedom from breaking technical bugs.',
        checkpointsTitle: 'What are the judges looking for?',
        checkpoints: [
          'Architectural and runtime stability.',
          'Flawless operation of core features.',
          'Fast response times and performance.',
          'Zero critical or blocking bugs.',
        ],
      },
    },
  },
  {
    id: 4,
    stageId: 2,
    stageNumberStr: '02',
    criterionNumberStr: '04',
    weight: 5,
    accent: 'violet',
    icon: PackageCheck,
    translations: {
      ar: {
        title: 'اكتمال المنتج الأولي MVP',
        stageLabel: 'المرحلة 02: بناء المنتج',
        description:
          'وجود منتج قابل للاستخدام ينفذ رحلة أساسية متكاملة من البداية إلى النتيجة، وليس مجرد واجهات أو نموذج تصوري Prototype.',
        checkpointsTitle: 'ما الذي يبحث عنه المحكم؟',
        checkpoints: [
          'منتج قابل للاستخدام.',
          'رحلة أساسية متكاملة.',
          'الوصول إلى نتيجة فعلية.',
          'ليس مجرد واجهات أو Prototype.',
        ],
      },
      en: {
        title: 'MVP Completeness',
        stageLabel: 'Stage 02: Product Build',
        description:
          'A usable product executing an end-to-end user flow from start to outcome, beyond static mockups or prototypes.',
        checkpointsTitle: 'What are the judges looking for?',
        checkpoints: [
          'Real interactive, working software.',
          'Seamless end-to-end primary user flow.',
          'Delivery of real functional outcomes.',
          'Beyond superficial mockups or wireframes.',
        ],
      },
    },
  },
  {
    id: 5,
    stageId: 2,
    stageNumberStr: '02',
    criterionNumberStr: '05',
    weight: 10,
    accent: 'violet',
    icon: PanelsTopLeft,
    translations: {
      ar: {
        title: 'جودة التصميم وتجربة المستخدم',
        stageLabel: 'المرحلة 02: بناء المنتج',
        description:
          'وضوح الواجهات، وسهولة التنقل، وتناسق التصميم، وقدرة المستخدم على إنجاز المطلوب دون تعقيد.',
        checkpointsTitle: 'ما الذي يبحث عنه المحكم؟',
        checkpoints: [
          'وضوح الواجهات.',
          'سهولة التنقل.',
          'تناسق التصميم.',
          'إنجاز المهمة دون تعقيد.',
        ],
      },
      en: {
        title: 'Design Quality & UX',
        stageLabel: 'Stage 02: Product Build',
        description:
          'Intuitive interface, seamless navigation, visual coherence, and empowering users to achieve goals effortlessly.',
        checkpointsTitle: 'What are the judges looking for?',
        checkpoints: [
          'Clarity and optical balance of UI.',
          'Effortless navigation hierarchy.',
          'Visual consistency and token usage.',
          'Frictionless goal completion for users.',
        ],
      },
    },
  },
  {
    id: 6,
    stageId: 2,
    stageNumberStr: '02',
    criterionNumberStr: '06',
    weight: 5,
    accent: 'violet',
    icon: BrainCircuit,
    translations: {
      ar: {
        title: 'فعالية دمج الذكاء الاصطناعي',
        stageLabel: 'المرحلة 02: بناء المنتج',
        description:
          'وجود دور حقيقي وضروري للذكاء الاصطناعي في الحل، ومدى جودة مخرجاته ودقته في معالجة تحدي المسار.',
        checkpointsTitle: 'ما الذي يبحث عنه المحكم؟',
        checkpoints: [
          'دور حقيقي للذكاء الاصطناعي.',
          'ارتباطه الأساسي بالحل.',
          'جودة المخرجات.',
          'دقة معالجة التحدي.',
        ],
      },
      en: {
        title: 'AI Integration Effectiveness',
        stageLabel: 'Stage 02: Product Build',
        description:
          'A substantive, indispensable role for AI in the solution, with high output quality and precision for the challenge.',
        checkpointsTitle: 'What are the judges looking for?',
        checkpoints: [
          'Genuine, non-gimmick AI functionality.',
          'Integral synergy with the core solution.',
          'High accuracy and output quality.',
          'Direct problem resolution effectiveness.',
        ],
      },
    },
  },

  // Stage 3
  {
    id: 7,
    stageId: 3,
    stageNumberStr: '03',
    criterionNumberStr: '07',
    weight: 10,
    accent: 'pink',
    icon: ChartNoAxesCombined,
    translations: {
      ar: {
        title: 'الأثر التشغيلي القابل للقياس',
        stageLabel: 'المرحلة 03: صناعة القيمة',
        description:
          'قدرة الحل على تحقيق نتيجة عملية يمكن قياسها، مثل توفير الوقت، أو خفض التكلفة، أو تقليل الأخطاء، أو رفع الكفاءة، أو تحسين القرارات.',
        checkpointsTitle: 'ما الذي يبحث عنه المحكم؟',
        checkpoints: [
          'نتيجة عملية واضحة.',
          'إمكانية قياس الأثر.',
          'توفير الوقت أو التكلفة.',
          'رفع الكفاءة أو تحسين القرارات.',
        ],
      },
      en: {
        title: 'Measurable Operational Impact',
        stageLabel: 'Stage 03: Value Creation',
        description:
          'Demonstrated ability to produce quantifiable outcomes: saving time, reducing costs, minimizing errors, boosting efficiency, or enhancing decisions.',
        checkpointsTitle: 'What are the judges looking for?',
        checkpoints: [
          'Tangible, practical outcome.',
          'Clear metrics to measure success.',
          'Time or cost optimization.',
          'Efficiency gains or enhanced decisions.',
        ],
      },
    },
  },
  {
    id: 8,
    stageId: 3,
    stageNumberStr: '03',
    criterionNumberStr: '08',
    weight: 10,
    accent: 'pink',
    icon: BriefcaseBusiness,
    translations: {
      ar: {
        title: 'الجدوى والقيمة التجارية',
        stageLabel: 'المرحلة 03: صناعة القيمة',
        description:
          'وضوح العميل أو الجهة المستفيدة، ووجود حاجة سوقية للحل، وإمكانية تبنيه واستمراره وتحويله إلى منتج ذي قيمة تجارية.',
        checkpointsTitle: 'ما الذي يبحث عنه المحكم؟',
        checkpoints: [
          'وضوح العميل أو الجهة المستفيدة.',
          'وجود حاجة سوقية.',
          'إمكانية تبني الحل.',
          'إمكانية الاستمرار وتقديم قيمة تجارية.',
        ],
      },
      en: {
        title: 'Commercial Viability & Value',
        stageLabel: 'Stage 03: Value Creation',
        description:
          'Clear target beneficiary, validated market demand, adoption feasibility, and potential for sustainable commercial value.',
        checkpointsTitle: 'What are the judges looking for?',
        checkpoints: [
          'Well-identified customer segment.',
          'Genuine market need and demand.',
          'High adoption feasibility.',
          'Long-term viability and commercialization.',
        ],
      },
    },
  },

  // Stage 4
  {
    id: 9,
    stageId: 4,
    stageNumberStr: '04',
    criterionNumberStr: '09',
    weight: 10,
    accent: 'orange',
    icon: Presentation,
    translations: {
      ar: {
        title: 'جودة العرض والإقناع',
        stageLabel: 'المرحلة 04: تقديم المشروع والفريق',
        description:
          'وضوح تقديم المشكلة والحل، وتسلسل القصة، وجودة العرض الحي، والقدرة على الدفاع عن القرارات والإجابة عن أسئلة الحكام.',
        checkpointsTitle: 'ما الذي يبحث عنه المحكم؟',
        checkpoints: [
          'وضوح المشكلة والحل.',
          'تسلسل قصة العرض.',
          'جودة العرض الحي.',
          'الدفاع عن القرارات والإجابة عن الأسئلة.',
        ],
      },
      en: {
        title: 'Pitch Quality & Persuasion',
        stageLabel: 'Stage 04: Pitch & Team',
        description:
          'Articulate problem-solution narrative, storytelling flow, dynamic live demo, and confidence defending choices under Q&A.',
        checkpointsTitle: 'What are the judges looking for?',
        checkpoints: [
          'Crisp framing of problem and solution.',
          'Compelling storytelling trajectory.',
          'Live product demo delivery.',
          'Sound defense of technical & design decisions.',
        ],
      },
    },
  },
  {
    id: 10,
    stageId: 4,
    stageNumberStr: '04',
    criterionNumberStr: '10',
    weight: 10,
    accent: 'orange',
    icon: UsersRound,
    translations: {
      ar: {
        title: 'العمل الجماعي وتوازن المساهمات',
        stageLabel: 'المرحلة 04: تقديم المشروع والفريق',
        description:
          'عدالة توزيع العمل، ووضوح مساهمة كل عضو، وتكامل الأدوار وعدم اعتماد المشروع على شخص واحد.',
        checkpointsTitle: 'ما الذي يبحث عنه المحكم؟',
        checkpoints: [
          'عدالة توزيع العمل.',
          'وضوح مساهمة كل عضو.',
          'تكامل الأدوار.',
          'عدم اعتماد المشروع على شخص واحد.',
        ],
      },
      en: {
        title: 'Teamwork & Balanced Contribution',
        stageLabel: 'Stage 04: Pitch & Team',
        description:
          'Equitable workload distribution, evident contributions from every member, complementary roles, and no single-person dependency.',
        checkpointsTitle: 'What are the judges looking for?',
        checkpoints: [
          'Balanced workload distribution.',
          'Clear, distinct role contributions.',
          'Cross-functional role synergy.',
          'Absence of single-person dependency.',
        ],
      },
    },
  },

  // Stage 5
  {
    id: 11,
    stageId: 5,
    stageNumberStr: '05',
    criterionNumberStr: '11',
    weight: 10,
    accent: 'lime',
    icon: CalendarCheck2,
    translations: {
      ar: {
        title: 'الالتزام والمشاركة أثناء المعسكر',
        stageLabel: 'المرحلة 05: الالتزام',
        description:
          'الحضور والانضباط الزمني، والتفاعل في الجلسات، وتنفيذ المهام، والاستفادة من الإرشاد والتوجيه طوال أيام المعسكر.',
        checkpointsTitle: 'ما الذي يبحث عنه المحكم؟',
        checkpoints: [
          'الحضور.',
          'الانضباط الزمني.',
          'التفاعل والمشاركة.',
          'تنفيذ المهام.',
          'الاستفادة من الإرشاد والتوجيه.',
        ],
      },
      en: {
        title: 'Commitment & Camp Engagement',
        stageLabel: 'Stage 05: Commitment',
        description:
          'Attendance, time discipline, active session participation, milestone delivery, and receptive engagement with mentors.',
        checkpointsTitle: 'What are the judges looking for?',
        checkpoints: [
          'Punctual attendance across sessions.',
          'Strict discipline with project timelines.',
          'Active engagement in boot camp workshops.',
          'Execution of interim milestones.',
          'Proactive utilization of mentor guidance.',
        ],
      },
    },
  },
];

export const JUDGING_STAGES: JudgingStage[] = [
  {
    id: 1,
    stageNumberStr: '01',
    weight: 20,
    accent: 'lime',
    translations: {
      ar: {
        title: 'فهم الفكرة',
        shortTitle: 'الفكرة والفهم',
        ordinal: 'المرحلة الأولى',
        subtitle: 'تحديد الإشكالية الحقيقية، والارتباط بالمسار، وتوليد فكرة نوعية قابلة للتطبيق.',
        weightLabel: '20% من التقييم',
      },
      en: {
        title: 'Problem Discovery',
        shortTitle: 'Idea & Discovery',
        ordinal: 'Stage One',
        subtitle: 'Pinpointing the real challenge, track alignment, and forming an innovative concept.',
        weightLabel: '20% of Score',
      },
    },
    criteria: JUDGING_CRITERIA_LIST.filter((c) => c.stageId === 1),
  },
  {
    id: 2,
    stageNumberStr: '02',
    weight: 30,
    accent: 'violet',
    translations: {
      ar: {
        title: 'بناء المنتج',
        shortTitle: 'المنتج والتنفيذ',
        ordinal: 'المرحلة الثانية',
        subtitle: 'التنفيذ البرمجي السليم، تكامل تجربة المستخدم، واكتمال MVP مع توظيف حقيقي للذكاء الاصطناعي.',
        weightLabel: '30% من التقييم',
      },
      en: {
        title: 'Product Build',
        shortTitle: 'Product & Build',
        ordinal: 'Stage Two',
        subtitle: 'Robust technical implementation, refined UX, MVP readiness, and meaningful AI leverage.',
        weightLabel: '30% of Score',
      },
    },
    criteria: JUDGING_CRITERIA_LIST.filter((c) => c.stageId === 2),
  },
  {
    id: 3,
    stageNumberStr: '03',
    weight: 20,
    accent: 'pink',
    translations: {
      ar: {
        title: 'صناعة القيمة',
        shortTitle: 'الأثر والقيمة',
        ordinal: 'المرحلة الثالثة',
        subtitle: 'قياس الأثر التشغيلي، الجدوى التجارية، والقدرة على الاستمرار في بيئة الأعمال الحقيقية.',
        weightLabel: '20% من التقييم',
      },
      en: {
        title: 'Value Creation',
        shortTitle: 'Impact & Value',
        ordinal: 'Stage Three',
        subtitle: 'Measuring operational ROI, business viability, and real-world market adoption.',
        weightLabel: '20% of Score',
      },
    },
    criteria: JUDGING_CRITERIA_LIST.filter((c) => c.stageId === 3),
  },
  {
    id: 4,
    stageNumberStr: '04',
    weight: 20,
    accent: 'orange',
    translations: {
      ar: {
        title: 'تقديم المشروع والفريق',
        shortTitle: 'العرض والفريق',
        ordinal: 'المرحلة الرابعة',
        subtitle: 'مهارة الإلقاء والإقناع، الديمو الحي، وتناغم أعضاء الفريق وتكامل أدوارهم.',
        weightLabel: '20% من التقييم',
      },
      en: {
        title: 'Pitch & Team',
        shortTitle: 'Pitch & Team',
        ordinal: 'Stage Four',
        subtitle: 'Persuasive storytelling, dynamic live demo, and harmonious multidisciplinary collaboration.',
        weightLabel: '20% of Score',
      },
    },
    criteria: JUDGING_CRITERIA_LIST.filter((c) => c.stageId === 4),
  },
  {
    id: 5,
    stageNumberStr: '05',
    weight: 10,
    accent: 'lime',
    translations: {
      ar: {
        title: 'الالتزام',
        shortTitle: 'الالتزام والمشاركة',
        ordinal: 'المرحلة الخامسة',
        subtitle: 'الحضور والتفاعل المنتظم، استيعاب التوجيه، والوفاء بالمخرجات في مواعيدها.',
        weightLabel: '10% من التقييم',
      },
      en: {
        title: 'Commitment',
        shortTitle: 'Commitment & Camp',
        ordinal: 'Stage Five',
        subtitle: 'Active attendance, timely milestone submissions, and proactive mentor collaboration.',
        weightLabel: '10% of Score',
      },
    },
    criteria: JUDGING_CRITERIA_LIST.filter((c) => c.stageId === 5),
  },
];

// Programmatic verification of weights and count
export const TOTAL_CRITERIA_COUNT = JUDGING_CRITERIA_LIST.length; // must be 11
export const TOTAL_STAGES_COUNT = JUDGING_STAGES.length; // must be 5

export const TOTAL_CRITERIA_WEIGHT = JUDGING_CRITERIA_LIST.reduce(
  (sum, c) => sum + c.weight,
  0
); // must be 100

export const TOTAL_STAGES_WEIGHT = JUDGING_STAGES.reduce(
  (sum, s) => sum + s.weight,
  0
); // must be 100

if (TOTAL_CRITERIA_COUNT !== 11) {
  console.error(`Invalid criteria count: expected 11, got ${TOTAL_CRITERIA_COUNT}`);
}
if (TOTAL_CRITERIA_WEIGHT !== 100) {
  console.error(`Invalid criteria weight: expected 100, got ${TOTAL_CRITERIA_WEIGHT}`);
}
if (TOTAL_STAGES_WEIGHT !== 100) {
  console.error(`Invalid stages weight: expected 100, got ${TOTAL_STAGES_WEIGHT}`);
}
