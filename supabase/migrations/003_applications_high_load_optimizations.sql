-- ================================================================
-- BUILDx High Concurrency Optimization Migration (003)
-- Safe, additive, idempotent, and reversible.
-- DO NOT RUN ON PRODUCTION WITHOUT TESTING ON STAGING / BRANCH FIRST.
-- ================================================================

-- ── 1. Audit check: detect any historical duplicate emails or phones ──
-- Run this query manually in Supabase SQL editor first to verify zero duplicates:
/*
SELECT email, count(*) FROM public.applications GROUP BY email HAVING count(*) > 1;
SELECT phone, count(*) FROM public.applications GROUP BY phone HAVING count(*) > 1;
*/

-- ── 2. Ensure critical lookup indexes exist ────────────────────────
-- Used in duplicate prevention, status check, and reference code lookup
CREATE INDEX IF NOT EXISTS idx_applications_email ON public.applications (email);
CREATE INDEX IF NOT EXISTS idx_applications_phone ON public.applications (phone);
CREATE INDEX IF NOT EXISTS idx_applications_ref ON public.applications (reference_code);
CREATE INDEX IF NOT EXISTS idx_applications_idem ON public.applications (idempotency_key);
CREATE INDEX IF NOT EXISTS idx_applications_submitted_at ON public.applications (submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_applications_level_status ON public.applications (level, application_status);

-- ── 3. Optimized atomic application status check function ──────────
-- Returns only the status and reference code without reading unneeded heavy jsonb fields
CREATE OR REPLACE FUNCTION public.check_application_by_idempotency(p_key uuid)
RETURNS TABLE (
  reference_code text,
  application_status text,
  submitted_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT reference_code, application_status, submitted_at
  FROM public.applications
  WHERE idempotency_key = p_key
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.check_application_by_idempotency(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_application_by_idempotency(uuid) TO service_role;

-- ================================================================
-- ROLLBACK INSTRUCTIONS:
-- To reverse this migration safely, execute:
-- DROP FUNCTION IF EXISTS public.check_application_by_idempotency(uuid);
-- DROP INDEX IF EXISTS public.idx_applications_level_status;
-- DROP INDEX IF EXISTS public.idx_applications_ref;
-- ================================================================
