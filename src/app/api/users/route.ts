import { NextRequest, NextResponse } from 'next/server';
import { requireRole, hashPassword } from '@/lib/auth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

/**
 * GET /api/users — list all users (super only).
 */
export async function GET(req: NextRequest) {
  const guard = await requireRole(req, ['super']);
  if (guard instanceof Response) return guard;
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 503 });
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, username, role, display_name, active, last_login_at, created_at')
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

/**
 * POST /api/users — create a new user (super only).
 *
 * Body: { username, password, role, display_name? }
 *   - username: 3–64 chars, must be unique
 *   - password: ≥4 chars (enforced server-side)
 *   - role: 'super' | 'admin' | 'treasurer'
 *   - display_name: optional
 */
export async function POST(req: NextRequest) {
  const guard = await requireRole(req, ['super']);
  if (guard instanceof Response) return guard;
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 503 });
  }

  let body: { username?: unknown; password?: unknown; role?: unknown; display_name?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const role = body.role;
  const display_name = typeof body.display_name === 'string' ? body.display_name.trim() : null;

  if (!username || username.length < 3 || username.length > 64) {
    return NextResponse.json({ error: 'Username harus 3–64 karakter' }, { status: 400 });
  }
  if (!password || password.length < 4) {
    return NextResponse.json({ error: 'Password minimal 4 karakter' }, { status: 400 });
  }
  if (!['super', 'admin', 'treasurer'].includes(role as string)) {
    return NextResponse.json({ error: 'Role harus super | admin | treasurer' }, { status: 400 });
  }

  // Check duplicate
  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('username', username)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ error: `Username '${username}' sudah dipakai` }, { status: 409 });
  }

  const password_hash = await hashPassword(password);
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({ username, password_hash, role, display_name, active: true })
    .select('id, username, role, display_name, active, created_at')
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, user: data });
}