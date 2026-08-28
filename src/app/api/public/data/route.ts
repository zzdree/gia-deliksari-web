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

// Regex yang lebih agresif untuk catch semua variant error PostgREST/Postgres
// ketika kolom is_published belum ada di schema production (schema drift).
const COLUMN_MISSING_RE =
  /is_published|column|schema cache|does not exist|could not find|invalid column/i;

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
  // - random=true: shuffle & slice in-memory (dataset kecil, MAX_ACTIVE_PHOTOS=50)
  // - limit=N: batasi jumlah row random (default 12)
  const random = req.nextUrl.searchParams.get('random') === 'true';
  const limitParam = parseInt(req.nextUrl.searchParams.get('limit') || '12', 10);

  const db = client();
  if (!db) {
    return NextResponse.json({ items: [] });
  }

  // Gallery random mode
  if (table === 'gallery_items' && random) {
    let result = await db
      .from(table)
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    // Fallback: kalau kolom is_published gak ada, retry tanpa filter
    if (result.error && COLUMN_MISSING_RE.test(result.error.message)) {
      console.warn(
        `[public/data] ${table}: is_published missing, retrying without filter:`,
        result.error.message,
      );
      result = await db
        .from(table)
        .select('*')
        .order('created_at', { ascending: false });
    }

    const { data, error } = result;
    if (error) {
      console.error(`[public/data] ${table}:`, error.message);
      return NextResponse.json(
        { error: 'Gagal memuat data', detail: error.message },
        { status: 500 },
      );
    }

    // Fisher-Yates shuffle deterministik by date seed
    const shuffled = (data ?? []).slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
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

  // Tabel lain (atau gallery non-random)
  const orderCol = ORDER_COLUMNS[table];
  const ascending = orderCol !== 'created_at';
  let query = db.from(table).select('*').order(orderCol, { ascending });
  if (table === 'gallery_items') {
    query = query.eq('is_published', true);
  }

  let { data, error } = await query;
  // Fallback untuk gallery non-random kalau kolom is_published missing
  if (error && table === 'gallery_items' && COLUMN_MISSING_RE.test(error.message)) {
    console.warn(
      `[public/data] ${table}: is_published missing, retrying without filter:`,
      error.message,
    );
    const retry = await db
      .from(table)
      .select('*')
      .order(orderCol, { ascending });
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    console.error(`[public/data] ${table}:`, error.message);
    return NextResponse.json(
      { error: 'Gagal memuat data', detail: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { items: sanitize(table, data ?? []) },
    { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } },
  );
}
