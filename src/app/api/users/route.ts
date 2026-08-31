import { NextRequest, NextResponse } from 'next/server';
import { requireRole, createUser, Role, type User } from '@/lib/auth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';
import { logAudit, auditContextFromRequest } from '@/lib/auditLog';

/**
 * GET /api/users — list all users (super only).
 * Returns: { items: User[] } where User.roles is an array.
 */
export async function GET(req: NextRequest) {
  const guard = await requireRole(req, ['super']);
  if (guard instanceof Response) return guard;
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 503 });
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, username, roles, display_name, active, last_login_at, created_at')
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}

/**
 * POST /api/users — create a new user (super only).
 *
 * Body: { username, password, roles: Role[], display_name? }
 *   - username: 3-64 chars, unique, alphanumeric + . _ -
 *   - password: 4-64 chars (PIN 4 digit for operators; longer ok for super)
 *   - roles: at least one of 'super' | 'admin' | 'treasurer'
 *   - display_name: optional
 *
 * Examples:
 *   - Operator (admin + kas): { roles: ['admin', 'treasurer'] }
 *   - Pure admin: { roles: ['admin'] }
 *   - Treasurer only: { roles: ['treasurer'] }
 *   - Superuser: { roles: ['super'] }
 */
export async function POST(req: NextRequest) {
  const guard = await requireRole(req, ['super']);
  if (guard instanceof Response) return guard;
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 503 });
  }

  let body: { username?: unknown; password?: unknown; roles?: unknown; display_name?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const rolesRaw = Array.isArray(body.roles) ? body.roles : [];
  const roles = rolesRaw.filter(
    (r): r is Role => r === 'super' || r === 'admin' || r === 'treasurer',
  );
  const display_name = typeof body.display_name === 'string' ? body.display_name.trim() || null : null;

  const result = await createUser({ username, password, roles, display_name });
  if (!result.ok) {
    // 400 for validation, 409 for duplicate, 500 for db errors
    const status = result.error.includes('sudah dipakai') ? 409 : 400;
    return NextResponse.json({ error: result.error }, { status });
  }

  await logAudit({
    actor: { id: guard.id, username: guard.username, roles: guard.roles },
    action: 'user.create',
    target: { table: 'users', id: result.id, label: username },
    summary: `Membuat user '${username}' dengan roles [${roles.join(', ')}]`,
    meta: { roles, display_name },
    ctx: auditContextFromRequest(req),
  });

  return NextResponse.json({ success: true, id: result.id });
}