import http from 'k6/http';
import { check, sleep } from 'k6';

// ── Configuration for k6 load test ─────────────────────────────
// WARNING: Run ONLY against a Staging environment or Supabase Branch.
// NEVER run load tests against the production database.
// ───────────────────────────────────────────────────────────────

export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Stage 1: Warmup & baseline (50 VUs)
    { duration: '1m', target: 100 },   // Stage 2: Steady moderate load (100 VUs)
    { duration: '1m', target: 250 },   // Stage 3: High registration spike (250 VUs)
    { duration: '1m', target: 500 },   // Stage 4: Stress threshold (500 VUs)
    { duration: '1m', target: 1000 },  // Stage 5: Peak concurrency test (1000 VUs)
    { duration: '30s', target: 0 },    // Ramp-down to 0
  ],
  thresholds: {
    // Auto-abort or fail if error rate exceeds 5%
    http_req_failed: ['rate<0.05'],
    // 95% of requests must complete under 3.5 seconds
    http_req_duration: ['p(95)<3500'],
  },
};

const BASE_URL = __ENV.TARGET_URL || 'http://localhost:3000';

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function () {
  const vuId = __VU;
  const iterId = __ITER;
  const uniqueSuffix = `${Date.now()}_${vuId}_${iterId}`;

  // Unique recognizable test data
  const testEmail = `loadtest_${uniqueSuffix}@staging-buildx.internal`;
  const randomPhoneDigits = String(Math.floor(10000000 + Math.random() * 90000000));
  const testPhone = `+9665${randomPhoneDigits}`;
  const idemKey = generateUUID();

  // 1. Browsing form page & status check (simulating realistic user navigation)
  const statusRes = http.get(`${BASE_URL}/api/camp/status`);
  check(statusRes, {
    'camp status responded 200': (r) => r.status === 200,
  });

  sleep(Math.random() * 2 + 1); // User reading and filling step 1-4

  // 2. Realistic application submission payload
  const payload = JSON.stringify({
    full_name: `مختبر ضغط ${vuId} ${iterId}`,
    birth_date: '1998-05-15',
    gender: vuId % 2 === 0 ? 'female' : 'male',
    phone: testPhone,
    email: testEmail,
    city: 'الرياض',
    organization: 'جامعة الملك سعود للتقنية',
    specialization: 'علوم الحاسب والذكاء الاصطناعي',
    current_status: 'graduate',
    level: 'practitioner',
    level_answers: {
      programming_experience: 'خبرة برمجية تفوق 3 سنوات في تطوير تطبيقات الويب والنظم الموزعة باستخدام تقنيات حديثة.',
      tools_and_technologies: 'أعمل مع React وNext.js وTypeScript وقواعد بيانات PostgreSQL وSupabase وDocker.',
      previous_project: 'بناء منصة حجز خدمات رقمية سحابية تخدم آلاف المستخدمين مع نظام دفع إلكتروني متكامل.',
      ai_usage: 'استخدام نماذج الذكاء الاصطناعي لتسريع كتابة الكود وفحص الثغرات وتحليل البيانات وتوليد الواجهات.',
      registration_page_prompt: 'قم ببناء واجهة تسجيل احترافية تدعم اللغة العربية والتحقق الفوري من صحة الحقول والمسودات.',
      debugging_approach: 'تتبع السجلات وفحص شبكة الاتصال واستخدام أدوات المراقبة Profiler لمعالجة الاختناقات.',
      growth_skill: 'تطوير معماريات الأنظمة عالية الاستيعاب وتوظيف الذكاء الاصطناعي التوليدي في حل المشاكل.',
      team_contribution: 'القيادة التقنية وتوجيه الفريق وكتابة بنية الكود الأساسية وضمان جودة المخرجات والتسليم.',
    },
    portfolio_links: ['https://github.com/loadtest-account'],
    professional_links: ['https://linkedin.com/in/loadtest-account'],
    team_environment_preference: 'comfortable',
    declaration_information_accurate: true,
    declaration_full_attendance: true,
    declaration_application_not_acceptance: true,
    declaration_data_processing: true,
    laptop_commitment: true,
    idempotency_key: idemKey,
    honeypot: '',
    submitted_at_client: Date.now(),
  });

  const headers = { 'Content-Type': 'application/json' };
  const res = http.post(`${BASE_URL}/api/applications`, payload, { headers });

  check(res, {
    'submission succeeded (200)': (r) => r.status === 200,
    'has reference_code': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true && typeof body.reference_code === 'string';
      } catch {
        return false;
      }
    },
  });

  sleep(1);
}
