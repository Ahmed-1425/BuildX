// =============================================================================
// BUILDx Hackathon Judging Platform - Supabase Live Connection Modal
// Quick setup, connection testing, and 1-click SQL copy for all 4 laptops
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useJudging } from '../context/JudgingContext';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check,
  X,
  Radio,
  Server,
  Key,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const {
    supabaseStatus,
    supabaseCredentials,
    saveSupabaseSettings,
    clearSupabaseSettings,
    testConnection,
    syncNow,
    evaluations,
  } = useJudging();

  const [urlInput, setUrlInput] = useState(supabaseCredentials.url || '');
  const [anonKeyInput, setAnonKeyInput] = useState(supabaseCredentials.anonKey || '');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string; tableCounts?: any } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [sqlLoading, setSqlLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUrlInput(supabaseCredentials.url || '');
      setAnonKeyInput(supabaseCredentials.anonKey || '');
      setTestResult(null);
    }
  }, [isOpen, supabaseCredentials]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTesting(true);
    setTestResult(null);

    const saveRes = saveSupabaseSettings(urlInput, anonKeyInput);
    if (!saveRes.success) {
      setTesting(false);
      setTestResult({ ok: false, message: saveRes.error || 'فشل حفظ الإعدادات' });
      return;
    }

    const testRes = await testConnection();
    setTestResult(testRes);
    setTesting(false);

    if (testRes.ok) {
      await syncNow();
    }
  };

  const handleCopySql = async () => {
    setSqlLoading(true);
    try {
      // Fetch the master SQL script
      const res = await fetch('/supabase/full_setup_run_once.sql');
      let text = '';
      if (res.ok) {
        text = await res.text();
      }
      if (!text || text.includes('<!DOCTYPE html>')) {
        // Fallback to bundled schema text
        text = MASTER_SQL_FALLBACK;
      }
      await navigator.clipboard.writeText(text);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
    } catch {
      await navigator.clipboard.writeText(MASTER_SQL_FALLBACK);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 3000);
    } finally {
      setSqlLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-[#0e1422] border border-[#e7edfd]/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e7edfd]/10 bg-[#121829]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#c3f937]/10 text-[#c3f937] border border-[#c3f937]/20">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#e7edfd] font-arabic">
                ربط منصة التحكيم بقاعدة بيانات Supabase (Realtime Live)
              </h2>
              <p className="text-xs text-[#e7edfd]/60 font-arabic">
                مزامنة فورية حية بين 4 لابتوبات للتحكيم دون أي تأخير أو فقدان بيانات
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#e7edfd]/50 hover:text-[#e7edfd] hover:bg-[#e7edfd]/10 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Status Banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3.5 ${
            supabaseStatus === 'connected'
              ? 'bg-[#c3f937]/10 border-[#c3f937]/30 text-[#e7edfd]'
              : supabaseStatus === 'reconnecting'
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
              : 'bg-[#121829] border-[#e7edfd]/10 text-[#e7edfd]'
          }`}>
            <div className="mt-0.5">
              {supabaseStatus === 'connected' ? (
                <CheckCircle2 className="w-5 h-5 text-[#c3f937]" />
              ) : supabaseStatus === 'reconnecting' ? (
                <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              )}
            </div>
            <div className="flex-1 text-sm font-arabic">
              <div className="font-bold mb-0.5 flex items-center gap-2">
                <span>
                  {supabaseStatus === 'connected'
                    ? 'متصل مباشرة بسوبربيس (Supabase Realtime Live)'
                    : supabaseStatus === 'reconnecting'
                    ? 'جارٍ الاتصال ومزامنة القنوات...'
                    : 'سوبربيس غير مهيأ حاليًا — يعمل بنمط الحفظ المحلي الآمن'}
                </span>
                {supabaseStatus === 'connected' && (
                  <span className="inline-flex items-center gap-1 text-[10px] bg-[#c3f937]/20 text-[#c3f937] px-2 py-0.5 rounded-full font-tech font-bold">
                    <Radio className="w-2.5 h-2.5 animate-ping" /> LIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-[#e7edfd]/70 leading-relaxed">
                {supabaseStatus === 'connected'
                  ? `القاعدة متصلة بالكامل. تم تسجيل ${evaluations.length} تقييم حتى الآن. أي تعديل أو تصويت من أي لابتوب ينعكس فورًا على الشاشات الأخرى!`
                  : 'لربط اللابتوبات الأربعة في نفس الوقت، أدخل بيانات مشروعك في Supabase أدناه واضغط فحص وحفظ.'}
              </p>
            </div>
          </div>

          {/* Quick 1-Click Master SQL Setup */}
          <div className="p-4 rounded-xl bg-[#151c2e] border border-[#a855f7]/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#a855f7]" />
                <span className="text-sm font-bold text-[#e7edfd] font-arabic">
                  الخطوة 1: تجهيز قاعدة البيانات في Supabase (كود SQL الشامل)
                </span>
              </div>
              <button
                type="button"
                onClick={handleCopySql}
                disabled={sqlLoading}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#a855f7] hover:bg-[#a855f7]/80 text-white text-xs font-bold transition-all cursor-pointer"
              >
                {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSql ? 'تم نسخ الكود!' : 'نسخ كود SQL الكامل'}</span>
              </button>
            </div>
            <p className="text-xs text-[#e7edfd]/70 font-arabic leading-relaxed">
              هذا الكود ينشئ الجداول (الفرق، المعايير، التقييمات، الجوائز)، ويُفعّل Realtime Broadcast للجداول وصلاحيات الحكام تلقائياً دون أي خطأ.
              <br />
              <strong className="text-[#a855f7]">طريقة التشغيل:</strong> افتح لوحة Supabase ⭠ <strong>SQL Editor</strong> ⭠ الصق الكود ⭠ اضغط <strong>Run</strong>.
            </p>
          </div>

          {/* Connection Form */}
          <form onSubmit={handleTestAndSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#e7edfd] font-arabic flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-[#c3f937]" />
                رابط المشروع (Supabase Project URL)
              </label>
              <input
                type="url"
                required
                dir="ltr"
                placeholder="https://your-project.supabase.co"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0e17] border border-[#e7edfd]/15 text-sm text-[#e7edfd] font-mono focus:border-[#c3f937] focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#e7edfd] font-arabic flex items-center gap-2">
                <Key className="w-3.5 h-3.5 text-[#fb50c3]" />
                المفتاح العام (Supabase Anon Key)
              </label>
              <input
                type="password"
                required
                dir="ltr"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                value={anonKeyInput}
                onChange={(e) => setAnonKeyInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#0a0e17] border border-[#e7edfd]/15 text-sm text-[#e7edfd] font-mono focus:border-[#c3f937] focus:outline-none"
              />
            </div>

            {testResult && (
              <div className={`p-3.5 rounded-xl text-xs font-arabic border flex items-start gap-2.5 ${
                testResult.ok
                  ? 'bg-[#c3f937]/10 border-[#c3f937]/30 text-[#c3f937]'
                  : 'bg-red-500/10 border-red-500/30 text-red-200'
              }`}>
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-bold">{testResult.message}</p>
                  {testResult.tableCounts && (
                    <p className="mt-1 text-[11px] opacity-80">
                      تم التحقق: {testResult.tableCounts.teams} فرق، {testResult.tableCounts.judges} حكام، {testResult.tableCounts.evaluations} تقييمات سابقة.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={testing}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#c3f937] hover:bg-[#b0e628] text-[#0c1018] font-bold text-sm font-arabic transition-all shadow-lg shadow-[#c3f937]/20 cursor-pointer disabled:opacity-50"
              >
                {testing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>جارٍ فحص الاتصال وتأكيد الجداول...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>فحص وحفظ الاتصال فوراً</span>
                  </>
                )}
              </button>

              {supabaseCredentials.source === 'storage' && (
                <button
                  type="button"
                  onClick={() => {
                    clearSupabaseSettings();
                    setUrlInput('');
                    setAnonKeyInput('');
                    setTestResult(null);
                  }}
                  className="px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold font-arabic transition-all cursor-pointer"
                >
                  مسح الإعدادات
                </button>
              )}
            </div>
          </form>

          {/* Tips for 4 Laptops */}
          <div className="p-3.5 rounded-xl bg-[#0a0e17] border border-[#e7edfd]/10 text-xs text-[#e7edfd]/70 space-y-1.5 font-arabic">
            <div className="font-bold text-[#e7edfd] flex items-center gap-1.5">
              <span>💡 كيف يربط الحكام الأربعة في نفس الوقت؟</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-[#e7edfd]/60">
              <li>افتح نفس رابط المنصة على كل لابتوب من اللابتوبات الأربعة.</li>
              <li>كل محكم يختار اسمه ويدخل الرمز السري الخاص به.</li>
              <li>بمجرد إدخال إعدادات Supabase، سيتصل الجميع بنفس قاعدة البيانات الحية، وستظهر تقييمات كل محكم مباشرة للجميع!</li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#e7edfd]/10 bg-[#121829] flex items-center justify-between">
          <span className="text-xs text-[#e7edfd]/50 font-arabic">
            BUILDx Hackathon Platform &copy; 2026
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#e7edfd]/10 hover:bg-[#e7edfd]/15 text-xs font-bold text-[#e7edfd] font-arabic transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};

// Bundled fallback of the full SQL script
const MASTER_SQL_FALLBACK = `-- =============================================================================
-- BUILDx Hackathon Master Setup Script
-- Copy & Run in Supabase SQL Editor
-- =============================================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS judges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'judge' CHECK (role IN ('judge', 'admin')),
    pin_hash TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_locked BOOLEAN NOT NULL DEFAULT false,
    failed_attempts INT NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    must_change_pin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_code TEXT UNIQUE NOT NULL,
    team_name TEXT NOT NULL,
    project_name TEXT NOT NULL,
    challenge_track TEXT NOT NULL,
    description TEXT,
    team_members JSONB NOT NULL DEFAULT '[]'::jsonb,
    presentation_order INT NOT NULL DEFAULT 1,
    presentation_url TEXT,
    demo_url TEXT,
    github_url TEXT,
    notes TEXT,
    mascot_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ready' CHECK (status IN ('pending', 'ready', 'presented', 'evaluation_complete')),
    accent_color TEXT NOT NULL DEFAULT '#c3f937',
    is_locked BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS judging_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_num INT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    weight NUMERIC(5, 2) NOT NULL CHECK (weight > 0 AND weight <= 100),
    description TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judge_id UUID NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'needs_revision', 'locked')),
    strengths TEXT DEFAULT '',
    improvements TEXT DEFAULT '',
    final_recommendation TEXT DEFAULT '',
    total_weighted_score NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    version INT NOT NULL DEFAULT 1,
    submitted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(judge_id, team_id)
);

CREATE TABLE IF NOT EXISTS evaluation_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    evaluation_id UUID NOT NULL REFERENCES evaluations(id) ON DELETE CASCADE,
    criterion_id UUID NOT NULL REFERENCES judging_criteria(id) ON DELETE CASCADE,
    raw_score NUMERIC(4, 2) NOT NULL CHECK (raw_score >= 0 AND raw_score <= 10),
    weighted_points NUMERIC(5, 2) NOT NULL,
    justification TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(evaluation_id, criterion_id)
);

CREATE TABLE IF NOT EXISTS award_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_num INT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    related_criterion_id UUID REFERENCES judging_criteria(id),
    related_criterion_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS award_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    judge_id UUID NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
    award_category_id UUID NOT NULL REFERENCES award_categories(id) ON DELETE CASCADE,
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'needs_revote')),
    revote_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(judge_id, award_category_id)
);

CREATE TABLE IF NOT EXISTS judging_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    is_judging_open BOOLEAN NOT NULL DEFAULT true,
    are_results_locked BOOLEAN NOT NULL DEFAULT false,
    are_results_published BOOLEAN NOT NULL DEFAULT false,
    allow_repeat_category_winners BOOLEAN NOT NULL DEFAULT true,
    allow_sub_four_calculation BOOLEAN NOT NULL DEFAULT false,
    sub_four_reason TEXT,
    tie_break_priority JSONB NOT NULL DEFAULT '["operational_impact", "innovation", "tech_execution", "admin"]'::jsonb,
    min_justification_length INT NOT NULL DEFAULT 15,
    published_reveal_stage INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Seed Judges
INSERT INTO judges (id, name, role, pin_hash, is_active)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'أحمد الرشيد', 'judge', crypt('2004', gen_salt('bf', 8)), true),
  ('22222222-2222-2222-2222-222222222222', 'إقبال الدلامي', 'judge', crypt('1122', gen_salt('bf', 8)), true),
  ('33333333-3333-3333-3333-333333333333', 'عبدالعزيز بن نشوان', 'judge', crypt('3344', gen_salt('bf', 8)), true),
  ('44444444-4444-4444-4444-444444444444', 'أضواء الغامدي', 'judge', crypt('6767', gen_salt('bf', 8)), true),
  ('99999999-9999-9999-9999-999999999999', 'إدارة التحكيم (Admin)', 'admin', crypt('9900', gen_salt('bf', 8)), true)
ON CONFLICT (id) DO UPDATE SET is_active = true;

-- Seed Teams
INSERT INTO teams (id, team_code, team_name, project_name, challenge_track, description, mascot_url, accent_color, presentation_order, status)
VALUES
  ('a1000000-0000-0000-0000-000000000010', '10', 'الفريق 10', 'الفريق 10', 'الذكاء الاصطناعي التوليدي', 'كود الفريق: 10', '/assets/judging-platform/mascots/ready.png', '#c3f937', 1, 'ready'),
  ('a2000000-0000-0000-0000-000000000020', '20', 'الفريق 20', 'الفريق 20', 'حلول الاستدامة المؤسسية', 'كود الفريق: 20', '/assets/judging-platform/mascots/thinking.png', '#fb50c3', 2, 'ready'),
  ('a3000000-0000-0000-0000-000000000030', '30', 'الفريق 30', 'الفريق 30', 'التقنية المالية (FinTech)', 'كود الفريق: 30', '/assets/judging-platform/mascots/building.png', '#a855f7', 3, 'ready'),
  ('a4000000-0000-0000-0000-000000000040', '40', 'الفريق 40', 'الفريق 40', 'تقنيات الاتصالات وتدفق البيانات', 'كود الفريق: 40', '/assets/judging-platform/mascots/loading.png', '#e05d2b', 4, 'ready'),
  ('a5000000-0000-0000-0000-000000000050', '50', 'الفريق 50', 'الفريق 50', 'التقنيات الصحية', 'كود الفريق: 50', '/assets/judging-platform/mascots/success.png', '#c3f937', 5, 'ready'),
  ('a6000000-0000-0000-0000-000000000060', '60', 'الفريق 60', 'الفريق 60', 'اللوجستيات والنقل الذكي', 'كود الفريق: 60', '/assets/judging-platform/mascots/error.png', '#fb50c3', 6, 'ready'),
  ('a7000000-0000-0000-0000-000000000070', '70', 'الفريق 70', 'الفريق 70', 'الأمن السيبراني والامتثال', 'كود الفريق: 70', '/assets/judging-platform/mascots/building.png', '#a855f7', 7, 'ready'),
  ('a8000000-0000-0000-0000-000000000080', '80', 'الفريق 80', 'الفريق 80', 'تقنيات التعليم والتأهيل', 'كود الفريق: 80', '/assets/judging-platform/mascots/success.png', '#e05d2b', 8, 'ready')
ON CONFLICT (id) DO NOTHING;

-- Seed Criteria
INSERT INTO judging_criteria (id, order_num, title, weight, description, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 1, 'فهم التحدي والارتباط بالمسار', 10.00, 'مدى دقة تعريف المشكلة وفهم سؤال المسار.', true),
  ('c1000000-0000-0000-0000-000000000002', 2, 'الابتكار', 10.00, 'مدى جِدة الفكرة وتميزها عن الحلول المعتادة.', true),
  ('c1000000-0000-0000-0000-000000000003', 3, 'جودة التنفيذ التقني', 10.00, 'استقرار المنتج وخلوه من الأعطال.', true),
  ('c1000000-0000-0000-0000-000000000004', 4, 'اكتمال المنتج الأولي MVP', 5.00, 'وجود منتج قابل للاستخدام برحلة كاملة.', true),
  ('c1000000-0000-0000-0000-000000000005', 5, 'جودة التصميم وتجربة المستخدم', 10.00, 'وضوح وسهولة واجهات المستخدم.', true),
  ('c1000000-0000-0000-0000-000000000006', 6, 'فعالية دمج الذكاء الاصطناعي', 5.00, 'دور حقيقي وضروري للذكاء الاصطناعي.', true),
  ('c1000000-0000-0000-0000-000000000007', 7, 'الأثر التشغيلي القابل للقياس', 10.00, 'توفير الوقت أو التكلفة أو رفع الكفاءة.', true),
  ('c1000000-0000-0000-0000-000000000008', 8, 'الجدوى والقيمة التجارية', 10.00, 'وضوح السوق واستدامة نموذج العمل.', true),
  ('c1000000-0000-0000-0000-000000000009', 9, 'جودة العرض والإقناع', 10.00, 'تسلسل العرض والإجابة عن الأسئلة.', true),
  ('c1000000-0000-0000-0000-000000000010', 10, 'العمل الجماعي وتوازن المساهمات', 10.00, 'عدالة توزيع العمل بين أعضاء الفريق.', true),
  ('c1000000-0000-0000-0000-000000000011', 11, 'الالتزام والمشاركة أثناء المعسكر', 10.00, 'الحضور والانضباط والاستفادة من الإرشاد.', true)
ON CONFLICT (id) DO NOTHING;

-- Seed Awards
INSERT INTO award_categories (id, order_num, title, description, related_criterion_id, related_criterion_name)
VALUES
  ('b1000000-0000-0000-0000-000000000001', 1, 'جائزة الأثر الاستثنائي', 'أثر ملموس وقيمة تشغيلية عالية.', 'c1000000-0000-0000-0000-000000000007', 'الأثر التشغيلي القابل للقياس'),
  ('b1000000-0000-0000-0000-000000000002', 2, 'جائزة الابتكار المتميّز', 'معالجة مبتكرة وغير تقليدية.', 'c1000000-0000-0000-0000-000000000002', 'الابتكار'),
  ('b1000000-0000-0000-0000-000000000003', 3, 'جائزة أفضل عرض للحل', 'التميز في عرض المشروع والإقناع.', 'c1000000-0000-0000-0000-000000000009', 'جودة العرض والإقناع'),
  ('b1000000-0000-0000-0000-000000000004', 4, 'جائزة أفضل توظيف للذكاء الاصطناعي', 'توظيف ذكاء اصطناعي فعّال.', 'c1000000-0000-0000-0000-000000000006', 'فعالية دمج الذكاء الاصطناعي')
ON CONFLICT (id) DO NOTHING;

-- Seed Settings
INSERT INTO judging_settings (id, is_judging_open, are_results_locked, are_results_published)
VALUES ('default', true, false, false)
ON CONFLICT (id) DO NOTHING;

-- Realtime Full Identity
ALTER TABLE evaluations REPLICA IDENTITY FULL;
ALTER TABLE evaluation_scores REPLICA IDENTITY FULL;
ALTER TABLE award_votes REPLICA IDENTITY FULL;
ALTER TABLE judging_settings REPLICA IDENTITY FULL;
ALTER TABLE teams REPLICA IDENTITY FULL;

-- Permissions & RLS
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;

ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE award_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE judging_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE judges ENABLE ROW LEVEL SECURITY;
ALTER TABLE judging_criteria ENABLE ROW LEVEL SECURITY;
ALTER TABLE award_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public all evaluations" ON evaluations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public all evaluation_scores" ON evaluation_scores FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public all award_votes" ON award_votes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public select teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public select judges" ON judges FOR SELECT USING (true);
CREATE POLICY "Public select criteria" ON judging_criteria FOR SELECT USING (true);
CREATE POLICY "Public select award_categories" ON award_categories FOR SELECT USING (true);
CREATE POLICY "Public all settings" ON judging_settings FOR ALL USING (true) WITH CHECK (true);
`;
