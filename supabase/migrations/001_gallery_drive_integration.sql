-- =========================================================
-- 4. Table: Gallery Items (Dokumentasi Foto Jemaat - Hybrid Drive + Supabase)
-- =========================================================
create table if not exists gallery_items (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null check (category in ('ibadah', 'worship', 'youth', 'komunitas', 'umum')),
  image text not null,                              -- legacy data URL / public Supabase URL
  thumb_url text,                                   -- NEW: URL thumbnail kompres via Supabase Image Transform
  drive_file_id text,                               -- NEW: ID file di Google Drive (untuk sync)
  drive_web_view_link text,                         -- NEW: link "Buka di Drive" jemaat
  uploader_name text,                               -- NEW: nama jemaat (untuk kredit)
  date text,
  is_published boolean default true,                -- NEW: flag tampil di galeri publik
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexes untuk performa random query & filter kategori
create index if not exists idx_gallery_items_published on gallery_items(is_published);
create index if not exists idx_gallery_items_drive_file_id on gallery_items(drive_file_id);
create index if not exists idx_gallery_items_created_at on gallery_items(created_at desc);

-- RLS untuk gallery_items
alter table gallery_items enable row level security;

-- Public: hanya yang is_published = true
create policy "Allow public read published gallery" on gallery_items for select using (is_published = true);

-- Anon: boleh insert (untuk jemaat upload tanpa login)
-- (kolom drive_file_id dan drive_web_view_link di-set server-side via service role,
--  jadi anon insert tanpa kolom tsb akan menghasilkan row yang masih tanpa link Drive.
--  Server-side API route akan update kolom tsb setelah upload Drive berhasil.)
create policy "Allow public insert gallery" on gallery_items for insert to anon, authenticated with check (true);

-- Authenticated / Service Role: full access
create policy "Allow authenticated update gallery" on gallery_items for update to authenticated, service_role using (true) with check (true);
create policy "Allow authenticated delete gallery" on gallery_items for delete to authenticated, service_role using (true);
