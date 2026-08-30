import { NextRequest, NextResponse } from 'next/server';
import { requireRole, hashPassword, Role } from '@/lib/auth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

/**
 * PATCH /api/users/[id] — update user (super only).
 * Body (any subset): { roles?, display_name?, active?, password? }
 *   - roles: array of role strings (replaces existing)
 *   - password: 4-64 chars (PIN 4 digit ok)
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole(req, ['super']);
  if (guard instanceof Response) return guard;
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 503 });
  }

  const { id } = await params;

  let body: {
    roles?: unknown;
    display_name?: unknown;
    active?: unknown;
    password?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const patch: Record<string, unknown> = {};
  if (Array.isArray(body.roles)) {
    const validRoles: Role[] = ['super', 'admin', 'treasurer'];
    const roles = Array.from(
      new Set((body.roles as unknown[]).filter((r): r is Role => validRoles.includes(r as Role))),
    );
    if (roles.length === 0) {
      return NextResponse.json({ error: 'Minimal 1 role valid' }, { status: 400 });
    }
    patch.roles = roles;
  }
  if (typeof body.display_name === 'string') {
    patch.display_name = body.display_name.trim() || null;
  }
  if (typeof body.active === 'boolean') {
    patch.active = body.active;
  }
  if (typeof body.password === 'string' && body.password.length >= 4) {
    patch.password_hash = await hashPassword(body.password);
  } else if (typeof body.password === 'string' && body.password.length > 0) {
    return NextResponse.json({ error: 'PIN/password minimal 4 karakter' }, { status: 400 });
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Tidak ada field yang diupdate' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('users')
    .update(patch)
    .eq('id', id)
    .select('id, username, roles, display_name, active, last_login_at, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, user: data });
}

/**
 * DELETE /api/users/[id] — soft-deactivate (super only).
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole(req, ['super']);
  if (guard instanceof Response) return guard;
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 503 });
  }

  const { id } = await params;
  const { data, error } = await supabaseAdmin
    .from('users')
    .update({ active: false })
    .eq('id', id)
    .select('id, active')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, user: data });
}