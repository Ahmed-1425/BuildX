-- ================================================================
-- Staging Cleanup Script for Load Test Records
-- ONLY run this on Staging / Branch databases after running k6 tests.
-- NEVER run on Production.
-- ================================================================

BEGIN;

-- 1. Check how many test records exist
SELECT count(*) AS test_records_count
FROM public.applications
WHERE email LIKE '%@staging-buildx.internal';

-- 2. Delete test records
DELETE FROM public.applications
WHERE email LIKE '%@staging-buildx.internal';

-- 3. Confirm deletion
SELECT count(*) AS remaining_test_records
FROM public.applications
WHERE email LIKE '%@staging-buildx.internal';

COMMIT;
