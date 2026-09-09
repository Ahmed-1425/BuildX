import { UsersRound, Waypoints, ChartNoAxesCombined } from 'lucide-react';
import type { ChallengeTrack } from './types';

export const CHALLENGE_TRACKS: ChallengeTrack[] = [
  {
    id: 'mahara',
    number: '01',
    name: 'مهارة',
    subtitle: 'ذكاء القوى العاملة',
    description:
      'يركّز مسار مهارة على توظيف الذكاء الاصطناعي في تطوير رأس المال البشري، من خلال بناء حلول تساعد المنشآت على فهم مهارات موظفيها، واكتشاف فجوات المهارات، وتطوير الكفاءات، وتحسين قرارات التوظيف وتكوين فرق العمل.',
    challengeQuestion:
      'كيف نحوّل بيانات الموظفين وخبراتهم وأداءهم إلى قرارات أدق في التوظيف والتدريب وتكوين فرق العمل؟',
    expectedOutput:
      'حل يساعد على اتخاذ قرار واضح: من نُوظّف؟ من نُطوّر؟ ومن الأنسب للمشروع؟',
    beneficiaries: [
      'إدارات الموارد البشرية.',
      'شركات التوظيف.',
      'الشركات الكبرى.',
      'الجهات التدريبية.',
      'الجامعات.',
      'منشآت القطاع الخاص.',
    ],
    accent: '#fb50c3',
    secondaryAccent: '#34155f',
    icon: UsersRound,
    logoSrc: '/assets/judging-criteria-tracks/الشعار /شعار المسارات/شعار مسار مهارة - متوهج.png',
    translations: {
      ar: {
        name: 'مهارة',
        subtitle: 'ذكاء القوى العاملة',
        trackBadge: 'مسار تحدٍ',
        description:
          'يركّز مسار مهارة على توظيف الذكاء الاصطناعي في تطوير رأس المال البشري، من خلال بناء حلول تساعد المنشآت على فهم مهارات موظفيها، واكتشاف فجوات المهارات، وتطوير الكفاءات، وتحسين قرارات التوظيف وتكوين فرق العمل.',
        challengeQuestionLabel: 'سؤال المسار',
        challengeQuestion:
          'كيف نحوّل بيانات الموظفين وخبراتهم وأداءهم إلى قرارات أدق في التوظيف والتدريب وتكوين فرق العمل؟',
        expectedOutputLabel: 'مخرج المسار',
        expectedOutput:
          'حل يساعد على اتخاذ قرار واضح: من نُوظّف؟ من نُطوّر؟ ومن الأنسب للمشروع؟',
        beneficiariesLabel: 'الجهات المستفيدة',
        beneficiaries: [
          'إدارات الموارد البشرية.',
          'شركات التوظيف.',
          'الشركات الكبرى.',
          'الجهات التدريبية.',
          'الجامعات.',
          'منشآت القطاع الخاص.',
        ],
      },
      en: {
        name: 'Mahara',
        subtitle: 'Workforce Intelligence',
        trackBadge: 'CHALLENGE TRACK',
        description:
          'Mahara focuses on deploying artificial intelligence to develop human capital, building solutions that help enterprises comprehend employee skills, discover skill gaps, nurture capabilities, and optimize recruitment and team-formation decisions.',
        challengeQuestionLabel: 'Track Challenge',
        challengeQuestion:
          'How do we turn employee data, experience, and performance metrics into sharper decisions in hiring, training, and team building?',
        expectedOutputLabel: 'Expected Output',
        expectedOutput:
          'A solution enabling decisive clarity: Who do we hire? Who do we upskill? And who is the best fit for the project?',
        beneficiariesLabel: 'Key Beneficiaries',
        beneficiaries: [
          'Human Resources Departments',
          'Recruitment Firms',
          'Enterprise Corporations',
          'Training Organizations',
          'Universities & Academic Institutions',
          'Private Sector Enterprises',
        ],
      },
    },
  },
  {
    id: 'silsilah',
    number: '02',
    name: 'سلسلة',
    subtitle: 'ذكاء التوريد والمشتريات',
    description:
      'يركّز مسار سلسلة على توظيف الذكاء الاصطناعي في تطوير عمليات المشتريات وسلاسل الإمداد، لبناء حلول تساعد المنشآت على خفض التكلفة، وتسريع العمليات، وتحسين اختيار الموردين، والتنبؤ بالمخاطر قبل وقوعها.',
    challengeQuestion:
      'كيف نساعد الشركات على اختيار المورد الأنسب، ومقارنة العروض، والتنبؤ بالتأخير والمخاطر قبل وقوعها؟',
    expectedOutput:
      'حل يساعد المنشأة على اتخاذ قرار أوضح: ممن نشتري؟ بأي تكلفة؟ ومتى نتحرك لتفادي المخاطر؟',
    beneficiaries: [
      'إدارات المشتريات.',
      'المصانع.',
      'شركات المقاولات.',
      'شركات التجزئة.',
      'المطاعم والفنادق.',
      'الشركات اللوجستية.',
      'المنشآت الصغيرة والمتوسطة.',
    ],
    accent: '#8234f9',
    secondaryAccent: '#a855f7',
    icon: Waypoints,
    logoSrc: '/assets/judging-criteria-tracks/الشعار /شعار المسارات/شعار مسار سلسلة - متوهج.png',
    translations: {
      ar: {
        name: 'سلسلة',
        subtitle: 'ذكاء التوريد والمشتريات',
        trackBadge: 'مسار تحدٍ',
        description:
          'يركّز مسار سلسلة على توظيف الذكاء الاصطناعي في تطوير عمليات المشتريات وسلاسل الإمداد، لبناء حلول تساعد المنشآت على خفض التكلفة، وتسريع العمليات، وتحسين اختيار الموردين، والتنبؤ بالمخاطر قبل وقوعها.',
        challengeQuestionLabel: 'سؤال المسار',
        challengeQuestion:
          'كيف نساعد الشركات على اختيار المورد الأنسب، ومقارنة العروض، والتنبؤ بالتأخير والمخاطر قبل وقوعها؟',
        expectedOutputLabel: 'مخرج المسار',
        expectedOutput:
          'حل يساعد المنشأة على اتخاذ قرار أوضح: ممن نشتري؟ بأي تكلفة؟ ومتى نتحرك لتفادي المخاطر؟',
        beneficiariesLabel: 'الجهات المستفيدة',
        beneficiaries: [
          'إدارات المشتريات.',
          'المصانع.',
          'شركات المقاولات.',
          'شركات التجزئة.',
          'المطاعم والفنادق.',
          'الشركات اللوجستية.',
          'المنشآت الصغيرة والمتوسطة.',
        ],
      },
      en: {
        name: 'Silsilah',
        subtitle: 'Procurement & Supply Chain Intelligence',
        trackBadge: 'CHALLENGE TRACK',
        description:
          'Silsilah focuses on deploying artificial intelligence across procurement and supply chain operations, creating solutions that assist organizations in curbing costs, accelerating workflows, optimizing vendor selection, and forecasting risks before they occur.',
        challengeQuestionLabel: 'Track Challenge',
        challengeQuestion:
          'How do we empower companies to select the optimal supplier, benchmark vendor bids, and predict delays and operational risks beforehand?',
        expectedOutputLabel: 'Expected Output',
        expectedOutput:
          'A solution giving organizations definitive clarity: Who do we buy from? At what cost? And when do we act to prevent disruptions?',
        beneficiariesLabel: 'Key Beneficiaries',
        beneficiaries: [
          'Procurement Departments',
          'Manufacturing Plants',
          'Contracting & Construction Companies',
          'Retail Businesses',
          'Restaurants & Hospitality',
          'Logistics & Freight Companies',
          'Small & Medium Enterprises (SMEs)',
        ],
      },
    },
  },
  {
    id: 'nama',
    number: '03',
    name: 'نماء',
    subtitle: 'ذكاء الأعمال للمنشآت',
    description:
      'يركّز مسار نماء على تمكين المنشآت من الاستفادة من بياناتها بصورة أذكى، من خلال بناء حلول تحوّل بيانات المبيعات والمصروفات والعملاء والمخزون من أرقام متفرقة إلى قرارات وتوصيات تدعم النمو.',
    challengeQuestion:
      'كيف نحوّل بيانات المبيعات والمصروفات والعملاء والمخزون إلى قرارات عملية تساعد المنشأة على النمو؟',
    expectedOutput:
      'منتج رقمي ذكي يحوّل بيانات المنشأة إلى قرارات تساعدها على تحسين أدائها واكتشاف فرص نموها.',
    beneficiaries: [
      'المنشآت الصغيرة والمتوسطة.',
      'المتاجر الإلكترونية.',
      'المطاعم والمقاهي.',
      'شركات التجزئة.',
      'رواد الأعمال.',
      'حاضنات ومسرعات الأعمال.',
      'شركات المحاسبة والاستشارات.',
    ],
    accent: '#c3f937',
    secondaryAccent: '#10b981',
    icon: ChartNoAxesCombined,
    logoSrc: '/assets/judging-criteria-tracks/الشعار /شعار المسارات/شعار مسار نماء - متوهج.png',
    translations: {
      ar: {
        name: 'نماء',
        subtitle: 'ذكاء الأعمال للمنشآت',
        trackBadge: 'مسار تحدٍ',
        description:
          'يركّز مسار نماء على تمكين المنشآت من الاستفادة من بياناتها بصورة أذكى، من خلال بناء حلول تحوّل بيانات المبيعات والمصروفات والعملاء والمخزون من أرقام متفرقة إلى قرارات وتوصيات تدعم النمو.',
        challengeQuestionLabel: 'سؤال المسار',
        challengeQuestion:
          'كيف نحوّل بيانات المبيعات والمصروفات والعملاء والمخزون إلى قرارات عملية تساعد المنشأة على النمو؟',
        expectedOutputLabel: 'مخرج المسار',
        expectedOutput:
          'منتج رقمي ذكي يحوّل بيانات المنشأة إلى قرارات تساعدها على تحسين أدائها واكتشاف فرص نموها.',
        beneficiariesLabel: 'الجهات المستفيدة',
        beneficiaries: [
          'المنشآت الصغيرة والمتوسطة.',
          'المتاجر الإلكترونية.',
          'المطاعم والمقاهي.',
          'شركات التجزئة.',
          'رواد الأعمال.',
          'حاضنات ومسرعات الأعمال.',
          'شركات المحاسبة والاستشارات.',
        ],
      },
      en: {
        name: 'Nama',
        subtitle: 'Business Intelligence for Enterprises',
        trackBadge: 'CHALLENGE TRACK',
        description:
          'Nama empowers businesses to unlock their data intelligently, engineering solutions that transform sales, expenses, customer metrics, and inventory records from disparate numbers into actionable insights and high-growth recommendations.',
        challengeQuestionLabel: 'Track Challenge',
        challengeQuestion:
          'How do we turn sales, expenses, customer, and inventory data into actionable decisions that propel organizational growth?',
        expectedOutputLabel: 'Expected Output',
        expectedOutput:
          'An intelligent digital product that converts enterprise data into decisive moves to boost performance and discover untapped growth frontiers.',
        beneficiariesLabel: 'Key Beneficiaries',
        beneficiaries: [
          'Small & Medium Enterprises (SMEs)',
          'E-Commerce Stores',
          'Restaurants & Cafes',
          'Retail Companies',
          'Entrepreneurs & Founders',
          'Business Incubators & Accelerators',
          'Accounting & Consultancy Firms',
        ],
      },
    },
  },
];
