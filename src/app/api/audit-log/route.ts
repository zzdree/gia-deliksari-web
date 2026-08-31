import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

/**
 * GET /api/audit-log — read paginated audit entries (super only).
 *
 * Query params:
 *   - limit: default 50, max 200
 *   - offset: default 0
 *   - actor_username: filter exact match
 *   - action: filter exact match (e.g. 'warta.create')
 *   - since: YYYY-MM-DD inclusive
 *   - until: YYYY-MM-DD inclusive
 *
 * Returns: { items: AuditEntry[], total: number }
 *
 * The DB-side RLS already restricts this table to role 'super', but we still
 * go through requireRole so unauthenticated callers get 401 immediately.
 */
export async function GET(req: NextRequest) {
  const guard = await requireRole(req, ['super']);
  if (guard instanceof Response) return guard;
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 503 });
  }

  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '50', 10) || 50, 200);
  const offset = Math.max(parseInt(req.nextUrl.searchParams.get('offset') || '0', 10) || 0, 0);
  const actor = req.nextUrl.searchParams.get('actor_username')?.trim();
  const action = req.nextUrl.searchParams.get('action')?.trim();
  const since = req.nextUrl.searchParams.get('since')?.trim();
  const until = req.nextUrl.searchParams.get('until')?.trim();

  let query = supabaseAdmin
    .from('audit_log')
    .select(
      'id, actor_id, actor_username, actor_roles, action, target_table, target_id, summary, meta, ip, user_agent, source, created_at',
      { count: 'exact' },
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (actor) query = query.eq('actor_username', actor);
  if (action) query = query.eq('action', action);
  if (since) query = query.gte('created_at', `${since}T00:00:00Z`);
  if (until) query = query.lte('created_at', `${until}T23:59:59.999Z`);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    items: data ?? [],
    total: count ?? 0,
    limit,
    offset,
  });
}