import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

/**
 * PATCH /api/youth-treasury/[id] — update a transaction.
 * Body (subset): { transaction_date?, type?, category?, amount?, description? }
 * Auth: treasurer | super
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole(req, ['super', 'treasurer']);
  if (guard instanceof Response) return guard;
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 503 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.transaction_date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.transaction_date)) {
    patch.transaction_date = body.transaction_date;
  }
  if (typeof body.type === 'string' && ['income', 'expense'].includes(body.type)) {
    patch.type = body.type;
  }
  if (typeof body.category === 'string' && body.category.trim()) {
    patch.category = body.category.trim();
  }
  if (typeof body.amount === 'number' && body.amount > 0 && body.amount <= 1_000_000_000) {
    patch.amount = body.amount;
  }
  if (typeof body.description === 'string') {
    patch.description = body.description.trim() || null;
  }

  if (Object.keys(patch).length === 1) {
    return NextResponse.json({ error: 'Tidak ada field yang diupdate' }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from('youth_treasury_transactions')
    .update(patch)
    .eq('id', id)
    .select('id, transaction_date, type, category, amount, description, created_by, created_at, updated_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, transaction: data });
}

/**
 * DELETE /api/youth-treasury/[id] — hard-delete a transaction.
 *
 * Treasury transactions are reversible corrections, not audit records —
 * hard delete is the right semantics here. (Unlike users which we
 * soft-deactivate for audit trail.)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await requireRole(req, ['super', 'treasurer']);
  if (guard instanceof Response) return guard;
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 503 });
  }

  const { id } = await params;
  const { error } = await supabaseAdmin
    .from('youth_treasury_transactions')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, id });
}