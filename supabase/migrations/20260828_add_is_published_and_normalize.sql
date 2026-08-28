-- ============================================================================
-- Migration 4: Add is_published + missing columns, normalize data
-- Date: 2026-08-28
-- Purpose: Fix 4 production blockers from verify-live.log
--   1. gallery random HTTP 500 (is_published column missing)
--   2. Upload sukses tapi verify-e2e tidak muncul (silent insert failure)
--   3. sermons items=0 (no rows, is_published missing)
--   4. Data upload sebelumnya lenyap (schema drift between migrations)
-- ============================================================================

-- 1. sermons: add is_published default true
ALTER TABLE public.sermons
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

-- 2. gallery_items: ensure all Drive integration columns exist
ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS thumb_url TEXT;

ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS drive_file_id TEXT;

ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS drive_web_view_link TEXT;

ALTER TABLE public.gallery_items
  ADD COLUMN IF NOT EXISTS uploader_name TEXT;

-- 3. Backfill any NULL is_published -> TRUE (heal legacy data)
UPDATE public.sermons SET is_published = TRUE WHERE is_published IS NULL;
UPDATE public.gallery_items SET is_published = TRUE WHERE is_published IS NULL;

-- 4. Ensure public SELECT policies are in place for both tables
-- (drop & recreate to be idempotent and override earlier permissive grants)
DROP POLICY IF EXISTS "Public read published sermons" ON public.sermons;
CREATE POLICY "Public read published sermons"
  ON public.sermons
  FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE);

DROP POLICY IF EXISTS "Public read published gallery" ON public.gallery_items;
CREATE POLICY "Public read published gallery"
  ON public.gallery_items
  FOR SELECT
  TO anon, authenticated
  USING (is_published = TRUE);

-- 5. Service-role bypass: ensure admin (service_role) can do all CRUD
-- (supabaseAdmin uses service_role which bypasses RLS by default, but be explicit)
DROP POLICY IF EXISTS "Service role full access sermons" ON public.sermons;
CREATE POLICY "Service role full access sermons"
  ON public.sermons
  FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

DROP POLICY IF EXISTS "Service role full access gallery" ON public.gallery_items;
CREATE POLICY "Service role full access gallery"
  ON public.gallery_items
  FOR ALL
  TO service_role
  USING (TRUE)
  WITH CHECK (TRUE);

-- 6. Verify counts (read-only, just for sanity check after migration)
DO $$
DECLARE
  sermons_count INT;
  gallery_count INT;
BEGIN
  SELECT COUNT(*) INTO sermons_count FROM public.sermons;
  SELECT COUNT(*) INTO gallery_count FROM public.gallery_items;
  RAISE NOTICE 'sermons rows: %, gallery_items rows: %', sermons_count, gallery_count;
END $$;
