import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, hasValidAdminSession } from '@/lib/admin-session';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

/**
 * Server-side mutation gateway for the admin portal.
 *
 * The browser NEVER talks to Supabase with elevated privileges: all writes
 * (and reads of non-public tables) flow through here so the signed admin
 * session cookie is enforced on every operation. Uses the SERVICE ROLE key
 * server-side; Row Level Security stays enabled for everyone else.
 */

const TABLE_WHITELIST = [
  'announcements',
  'servant_rosters',
  'inventory_items',
  'sermons',
  'gallery_items',
  'ministry_requests',
] as const;

type TableName = (typeof TABLE_WHITELIST)[number];

const MAX_ITEMS_PER_SAVE = 500;

function isValidTable(value: unknown): value is TableName {
  return typeof value === 'string' && (TABLE_WHITELIST as readonly string[]).includes(value);
}

export async function GET(req: NextRequest) {
  const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!hasValidAdminSession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase service role not configured' }, { status: 503 });
  }

  const table = req.nextUrl.searchParams.get('table');
  if (!isValidTable(table)) {
    return NextResponse.json({ error: 'Tabel tidak dikenal' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin.from(table).select('*');
  if (error) {
    console.error(`[admin/data] GET ${table} failed:`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ table, items: data ?? [] });
}

export async function POST(req: NextRequest) {
  const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!hasValidAdminSession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase service role not configured' }, { status: 503 });
  }

  let body: { table?: unknown; items?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const { table, items } = body;
  if (!isValidTable(table)) {
    return NextResponse.json({ error: 'Tabel tidak dikenal' }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0 || items.length > MAX_ITEMS_PER_SAVE) {
    return NextResponse.json(
      { error: `items harus array berisi 1-${MAX_ITEMS_PER_SAVE} baris` },
      { status: 400 },
    );
  }
  // Basic row sanity: every item must be a plain object
  if (items.some((it) => typeof it !== 'object' || it === null || Array.isArray(it))) {
    return NextResponse.json({ error: 'Setiap item harus objek' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from(table).upsert(items);
  if (error) {
    console.error(`[admin/data] POST ${table} failed:`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, table, count: items.length });
}

export async function DELETE(req: NextRequest) {
  const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!hasValidAdminSession(session)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase service role not configured' }, { status: 503 });
  }

  const table = req.nextUrl.searchParams.get('table');
  const id = req.nextUrl.searchParams.get('id');

  if (!isValidTable(table)) {
    return NextResponse.json({ error: 'Tabel tidak dikenal' }, { status: 400 });
  }
  if (!id) {
    return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from(table).delete().eq('id', id);
  if (error) {
    console.error(`[admin/data] DELETE ${table} failed:`, error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, table, id });
}
