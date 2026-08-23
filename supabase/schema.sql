-- =========================================================
-- GIA DELIKSARI SEMARANG - SUPABASE DATABASE SCHEMA
-- =========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Table: Announcements (Papan Informasi & Warta Jemaat)
create table if not exists announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null check (category in ('general', 'youth', 'kidz', 'hana')),
  content text not null,
  event_date date not null,
  is_pinned boolean default false,
  is_published boolean default true,
  badge_text text,
  author text default 'Sekretariat GIA Deliksari',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Table: Servant Roster (Jadwal Petugas Pelayanan - 4 Kategori)
create table if not exists servant_rosters (
  id uuid primary key default uuid_generate_v4(),
  service_category text not null check (service_category in ('general', 'youth', 'kidz', 'hana')),
  service_date date not null,
  role text not null,
  servant_name text not null,
  phone text,
  status text not null default 'confirmed' check (status in ('confirmed', 'pending', 'replacement')),
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Table: Inventory Items (Inventaris & Checklist Kesiapan Ibadah)
create table if not exists inventory_items (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category text not null check (category in ('Sound System', 'Multimedia & Kamera', 'Alat Musik', 'Ibadah & Ruangan')),
  code text not null unique,
  quantity integer not null default 1,
  is_checked boolean default true,
  condition text not null default 'good' check (condition in ('good', 'maintenance', 'broken')),
  location text not null,
  notes text,
  last_checked_at text,
  checked_by text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table announcements enable row level security;
alter table servant_rosters enable row level security;
alter table inventory_items enable row level security;

-- Public Read Policies (Allow anon & authenticated to view published data)
create policy "Allow public read announcements" on announcements for select using (true);
create policy "Allow public read rosters" on servant_rosters for select using (true);
create policy "Allow public read inventory" on inventory_items for select using (true);

-- Authenticated / Service Role Mutation Policies (Only logged-in admins or server can mutate)
create policy "Allow authenticated insert announcements" on announcements for insert to authenticated, service_role with check (true);
create policy "Allow authenticated update announcements" on announcements for update to authenticated, service_role using (true) with check (true);
create policy "Allow authenticated delete announcements" on announcements for delete to authenticated, service_role using (true);

create policy "Allow authenticated insert rosters" on servant_rosters for insert to authenticated, service_role with check (true);
create policy "Allow authenticated update rosters" on servant_rosters for update to authenticated, service_role using (true) with check (true);
create policy "Allow authenticated delete rosters" on servant_rosters for delete to authenticated, service_role using (true);

create policy "Allow authenticated insert inventory" on inventory_items for insert to authenticated, service_role with check (true);
create policy "Allow authenticated update inventory" on inventory_items for update to authenticated, service_role using (true) with check (true);
create policy "Allow authenticated delete inventory" on inventory_items for delete to authenticated, service_role using (true);
