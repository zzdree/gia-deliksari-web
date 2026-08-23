-- ============================================================================
-- GIA DELIKSARI SEMARANG — DATABASE SCHEMA MIGRATIONS
-- Tables: sermons, gallery_items, ministry_requests
-- ============================================================================

-- 1. Tabel Khotbah & Arsip Audio-Visual (Sermons)
CREATE TABLE IF NOT EXISTS public.sermons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    speaker TEXT NOT NULL,
    passage TEXT NOT NULL,
    date TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    thumbnail TEXT,
    category TEXT DEFAULT 'Ibadah Raya',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabel Galeri Momen & Dokumentasi Kegiatan (Gallery)
CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'ibadah', -- 'ibadah' | 'worship' | 'youth' | 'komunitas'
    image TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabel Permohonan Layanan Jemaat (Ministry Requests)
-- Termasuk: Doa/Konseling, Sakramen Baptisan, Komsel Ekklesia, Volunteer
CREATE TABLE IF NOT EXISTS public.ministry_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- 'prayer' | 'sacrament' | 'komsel' | 'volunteer'
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    sub_type TEXT,
    message TEXT,
    need_pastoral_visit BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'new', -- 'new' | 'in_progress' | 'completed'
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Memungkinkan website publik membaca konten dan mengirim permohonan,
-- serta portal admin mengelola seluruh data.
-- ============================================================================

ALTER TABLE public.sermons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ministry_requests ENABLE ROW LEVEL SECURITY;

-- Policy Sermons: Publik bisa melihat, Anon/Admin bisa mengelola
CREATE POLICY "Allow public read sermons" ON public.sermons FOR SELECT USING (true);
CREATE POLICY "Allow anon insert sermons" ON public.sermons FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update sermons" ON public.sermons FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete sermons" ON public.sermons FOR DELETE USING (true);

-- Policy Gallery: Publik bisa melihat, Anon/Admin bisa mengelola
CREATE POLICY "Allow public read gallery" ON public.gallery_items FOR SELECT USING (true);
CREATE POLICY "Allow anon insert gallery" ON public.gallery_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update gallery" ON public.gallery_items FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete gallery" ON public.gallery_items FOR DELETE USING (true);

-- Policy Ministry Requests: Publik bisa insert (kirim form), Admin bisa select/update/delete
CREATE POLICY "Allow public read ministry_requests" ON public.ministry_requests FOR SELECT USING (true);
CREATE POLICY "Allow anon insert ministry_requests" ON public.ministry_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update ministry_requests" ON public.ministry_requests FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete ministry_requests" ON public.ministry_requests FOR DELETE USING (true);
