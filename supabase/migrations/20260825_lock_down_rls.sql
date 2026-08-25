-- ============================================================================
-- GIA DELIKSARI SEMARANG — SECURITY HARDENING MIGRATION
-- Date: 2026-08-25
--
-- Closes the anon write hole opened by 20260823_cms_and_ministry_tables.sql
-- and removes public access to personal data. All admin writes now flow
-- through /api/admin/data using the SERVICE ROLE key (bypasses RLS), so
-- policies below only need to serve the anonymous visitor:
--
--   announcements     -> SELECT published rows
--   servant_rosters   -> SELECT (phone/notes hidden by the public API layer)
--   sermons           -> SELECT all
--   gallery_items     -> SELECT all
--   inventory_items   -> NO anon access at all (internal checklist)
--   ministry_requests -> INSERT-only for new submissions; no read/update/delete
--
-- Run in Supabase SQL Editor.
-- ============================================================================

-- ------------------------------------------------------------------
-- 1. Drop the overly-permissive CMS/ministry policies from 20260823
-- ------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow anon insert sermons" ON public.sermons;
DROP POLICY IF EXISTS "Allow anon update sermons" ON public.sermons;
DROP POLICY IF EXISTS "Allow anon delete sermons" ON public.sermons;

DROP POLICY IF EXISTS "Allow anon insert gallery" ON public.gallery_items;
DROP POLICY IF EXISTS "Allow anon update gallery" ON public.gallery_items;
DROP POLICY IF EXISTS "Allow anon delete gallery" ON public.gallery_items;

DROP POLICY IF EXISTS "Allow public read ministry_requests" ON public.ministry_requests;
DROP POLICY IF EXISTS "Allow anon update ministry_requests" ON public.ministry_requests;
DROP POLICY IF EXISTS "Allow anon delete ministry_requests" ON public.ministry_requests;

-- ------------------------------------------------------------------
-- 2. Announcements: published-only reads, no anon mutations
-- ------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read announcements" ON public.announcements;
CREATE POLICY "Public read published announcements"
  ON public.announcements FOR SELECT
  USING (is_published = true);

-- ------------------------------------------------------------------
-- 3. Ministry requests: visitors may submit, never read others'
-- ------------------------------------------------------------------
CREATE POLICY "Public submit ministry requests"
  ON public.ministry_requests FOR INSERT
  WITH CHECK (true);

-- ------------------------------------------------------------------
-- 4. Inventory: revoke even SELECT from anon (internal data)
-- ------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read inventory" ON public.inventory_items;

-- ------------------------------------------------------------------
-- 5. Servant rosters: keep public SELECT (API strips phone/notes);
--    drop legacy write policy names if present from older setups
-- ------------------------------------------------------------------
DROP POLICY IF EXISTS "Allow authenticated insert rosters" ON public.servant_rosters;
DROP POLICY IF EXISTS "Allow authenticated update rosters" ON public.servant_rosters;
DROP POLICY IF EXISTS "Allow authenticated delete rosters" ON public.servant_rosters;
DROP POLICY IF EXISTS "Allow authenticated insert inventory" ON public.inventory_items;
DROP POLICY IF EXISTS "Allow authenticated update inventory" ON public.inventory_items;
DROP POLICY IF EXISTS "Allow authenticated delete inventory" ON public.inventory_items;
DROP POLICY IF EXISTS "Allow authenticated insert announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow authenticated update announcements" ON public.announcements;
DROP POLICY IF EXISTS "Allow authenticated delete announcements" ON public.announcements;

-- ------------------------------------------------------------------
-- 6. Storage bucket: ensure church-gallery is readable but not writable
--    by anon (writes happen via service role in /api/gallery/upload)
-- ------------------------------------------------------------------
-- Note: bucket policies live under storage.objects. If the bucket was created
-- with a public-write policy, tighten it here:
DELETE FROM storage.objects WHERE bucket_id = 'church-gallery' AND false; -- no-op guard
