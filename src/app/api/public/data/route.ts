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

  const db = client();
  if (!db) {
    return NextResponse.json({ items: [] });
  }

  const { data, error } = await db.from(table).select('*').order(ORDER_COLUMNS[table], { ascending: ORDER_COLUMNS[table] !== 'created_at' });
  if (error) {
    console.error(`[public/data] ${table}:`, error.message);
    return NextResponse.json({ error: 'Gagal memuat data' }, { status: 500 });
  }

  return NextResponse.json(
    { items: sanitize(table, data ?? []) },
    { headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' } },
  );
}
