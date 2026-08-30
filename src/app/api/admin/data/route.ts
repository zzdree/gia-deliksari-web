import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { getSupabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

/**
 * Server-side mutation gateway for the admin portal.
 *
 * Multi-role auth (Phase 3): requires session cookie with role in
 * ['super', 'admin']. Uses the new gia_session cookie + bcrypt user table
 * (see src/lib/auth.ts). Legacy ADMIN_SESSION_COOKIE cookie is no longer
 * accepted.
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

function getClientOrError(): { client: ReturnType<typeof getSupabaseAdmin>; error?: NextResponse } {
  if (!isSupabaseAdminConfigured()) {
    return {
      client: null,
      error: NextResponse.json(
        {
          error:
            'Supabase service role not configured di server. ' +
            'Pastikan NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY sudah di-set di Vercel env (Production).',
        },
        { status: 503 },
      ),
    };
  }
  const client = getSupabaseAdmin();
  if (!client) {
    return {
      client: null,
      error: NextResponse.json({ error: 'Supabase admin client gagal diinisialisasi' }, { status: 503 }),
    };
  }
  return { client };
}

export async function GET(req: NextRequest) {
  const guard = await requireRole(req, ['super', 'admin']);
  if (guard instanceof Response) return guard;

  const { client, error } = getClientOrError();
  if (error || !client) return error!;

  const table = req.nextUrl.searchParams.get('table');
  if (!isValidTable(table)) {
    return NextResponse.json({ error: 'Tabel tidak dikenal' }, { status: 400 });
  }

  const { data, error: dbError } = await client.from(table).select('*');
  if (dbError) {
    console.error(`[admin/data] GET ${table} failed:`, dbError.message, dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ table, items: data ?? [] });
}

export async function POST(req: NextRequest) {
  const guard = await requireRole(req, ['super', 'admin']);
  if (guard instanceof Response) return guard;

  const { client, error } = getClientOrError();
  if (error || !client) return error!;

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
  if (items.some((it) => typeof it !== 'object' || it === null || Array.isArray(it))) {
    return NextResponse.json({ error: 'Setiap item harus objek' }, { status: 400 });
  }

  const { error: dbError } = await client.from(table).upsert(items);
  if (dbError) {
    console.error(`[admin/data] POST ${table} failed:`, dbError.message, dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, table, count: items.length });
}

export async function DELETE(req: NextRequest) {
  const guard = await requireRole(req, ['super', 'admin']);
  if (guard instanceof Response) return guard;

  const { client, error } = getClientOrError();
  if (error || !client) return error!;

  const table = req.nextUrl.searchParams.get('table');
  const id = req.nextUrl.searchParams.get('id');

  if (!isValidTable(table)) {
    return NextResponse.json({ error: 'Tabel tidak dikenal' }, { status: 400 });
  }
  if (!id) {
    return NextResponse.json({ error: 'ID wajib diisi' }, { status: 400 });
  }

  const { error: dbError } = await client.from(table).delete().eq('id', id);
  if (dbError) {
    console.error(`[admin/data] DELETE ${table} failed:`, dbError.message, dbError);
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, table, id });
}
