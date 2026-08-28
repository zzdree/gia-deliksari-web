import { NextRequest, NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

/**
 * Public read-only data endpoint.
 *
 * Serves exactly the fields a visitor is allowed to see:
 *  - announcements: only published ones
 *  - servant_rosters: WITHOUT phone numbers / notes (personal data)
 *  - sermons & gallery_items: full public content
 * ministry_requests and inventory are NEVER exposed here.
 */

const PUBLIC_TABLES = new Set(['announcements', 'servant_rosters', 'sermons', 'gallery_items']);

const ORDER_COLUMNS: Record<string, string> = {
  announcements: 'event_date',
  servant_rosters: 'service_date',
  sermons: 'created_at',
  gallery_items: 'created_at',
};

function client() {
  // Prefer service-role on the server so reads keep working even if public
  // RLS is later tightened to SELECT-only-for-anon; fall back to anon client.
  if (isSupabaseAdminConfigured && supabaseAdmin) return supabaseAdmin;
  if (isSupabaseConfigured && supabase) return supabase;
  return null;
}

function sanitize(table: string, rows: any[]): any[] {
  if (table === 'announcements') {
    return rows.filter((r) => r.is_published !== false).map((r) => ({ ...r }));
  }
  if (table === 'servant_rosters') {
    return rows.map((r) => ({
      id: r.id,
      service_category: r.service_category,
      service_date: r.service_date,
      role: r.role,
      servant_name: r.servant_name,
      status: r.status,
    }));
  }
  if (table === 'gallery_items') {
    // Cap payload size: base64-fallback images can be megabytes each
    return rows.slice(0, 60);
  }
  return rows;
}

export async function GET(req: NextRequest) {
  const table = req.nextUrl.searchParams.get('table');
  if (!table || !PUBLIC_TABLES.has(table)) {
    return NextResponse.json({ error: 'Tabel tidak dikenal' }, { status: 400 });
  }

  // Gallery-specific query params: ?random=true&limit=12
  // - random=true: order by random() dan batasi N foto (default 12)
  // - limit=N: batasi jumlah row yang dikembalikan (untuk random mode)
  const random = req.nextUrl.searchParams.get('random') === 'true';
  const limitParam = parseInt(req.nextUrl.searchParams.get('limit') || '12', 10);

  const db = client();
  if (!db) {
    return NextResponse.json({ items: [] });
  }

  // Bangun query — gallery mendukung random sampling untuk etalase,
  // tabel lain menggunakan ORDER BY tradisional.
  let query;
  if (table === 'gallery_items' && random) {
    // Pakai RPC-like via .select().order('random()').limit()
    // Supabase JS tidak support ORDER BY RANDOM() langsung, jadi kita ambil
    // semua yang published lalu shuffle+slice di-memory di sini. Aman karena
    // MAX_ACTIVE_PHOTOS = 50 (rolling buffer) sehingga dataset selalu kecil.
    const { data, error } = await db
      .from(table)
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    if (error) {
      console.error(`[public/data] ${table}:`, error.message);
      return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 });
    }
    // Fisher-Yates shuffle deterministik by date seed supaya tidak berubah tiap detik
    const shuffled = (data ?? []).slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      // pakai index seeded by date supaya refresh harian menghasilkan set berbeda
      const seed = (i * 9301 + 49297 + new Date().getDate()) % 233280;
      const j = seed % (i + 1);
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const sliced = shuffled.slice(0, Math.min(limitParam, 12));
    return NextResponse.json(
      { items: sanitize(table, sliced) },
      { headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=900' } },
    );
  }

  const orderCol = ORDER_COLUMNS[table];
  const ascending = orderCol !== 'created_at';
  query = db.from(table).select('*').order(orderCol, { ascending });
  if (table === 'gallery_items') {
    // untuk mode non-random, hanya tampilkan yang published
    query = query.eq('is_published', true);
  }
  const { data, error } = await query;
  if (error) {
    console.error(`[public/data] ${table}:`, error.message);
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 });
  }

  return NextResponse.json(
    { items: sanitize(table, data ?? []) },
    { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } },
  );
}
