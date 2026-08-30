import { NextRequest, NextResponse } from 'next/server';
import { requireRole, getCurrentUser } from '@/lib/auth';
import { supabaseAdmin, isSupabaseAdminConfigured } from '@/lib/supabaseAdmin';

/**
 * GET /api/youth-treasury — list transactions + aggregate balance.
 * Query params:
 *   - limit (default 200, max 1000)
 *   - type=income|expense (optional filter)
 *   - since=YYYY-MM-DD (optional filter, inclusive)
 *   - until=YYYY-MM-DD (optional filter, inclusive)
 *
 * Response: { items: [...], balance: { total_income, total_expense, balance } }
 *
 * Accessible to role 'treasurer' and 'super'.
 */
export async function GET(req: NextRequest) {
  const guard = await requireRole(req, ['super', 'treasurer']);
  if (guard instanceof Response) return guard;

  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 503 });
  }

  const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '200', 10) || 200, 1000);
  const type = req.nextUrl.searchParams.get('type');
  const since = req.nextUrl.searchParams.get('since');
  const until = req.nextUrl.searchParams.get('until');

  let query = supabaseAdmin
    .from('youth_treasury_transactions')
    .select('id, transaction_date, type, category, amount, description, created_by, created_at, updated_at')
    .order('transaction_date', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(limit);

  if (type === 'income' || type === 'expense') {
    query = query.eq('type', type);
  }
  if (since) query = query.gte('transaction_date', since);
  if (until) query = query.lte('transaction_date', until);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Aggregate balance from view (single source of truth)
  const { data: balance, error: balanceErr } = await supabaseAdmin
    .from('youth_treasury_balance')
    .select('total_income, total_expense, balance, income_count, expense_count')
    .maybeSingle();

  return NextResponse.json({
    items: data ?? [],
    balance: balance ?? {
      total_income: 0,
      total_expense: 0,
      balance: 0,
      income_count: 0,
      expense_count: 0,
    },
  });
}

/**
 * POST /api/youth-treasury — create a transaction.
 * Body: { transaction_date, type, category, amount, description? }
 * Auth: role treasurer | super
 */
export async function POST(req: NextRequest) {
  const guard = await requireRole(req, ['super', 'treasurer']);
  if (guard instanceof Response) return guard;
  if (!(guard as any).id) return new Response(JSON.stringify({ error: 'No user' }), { status: 401 });

  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 503 });
  }

  let body: {
    transaction_date?: unknown;
    type?: unknown;
    category?: unknown;
    amount?: unknown;
    description?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Body JSON tidak valid' }, { status: 400 });
  }

  const transaction_date = typeof body.transaction_date === 'string' ? body.transaction_date : '';
  const type = body.type;
  const category = typeof body.category === 'string' ? body.category.trim() : '';
  const amount = typeof body.amount === 'number' ? body.amount : Number(body.amount);
  const description = typeof body.description === 'string' ? body.description.trim() || null : null;

  // Validate
  if (!/^\d{4}-\d{2}-\d{2}$/.test(transaction_date)) {
    return NextResponse.json({ error: 'transaction_date harus format YYYY-MM-DD' }, { status: 400 });
  }
  if (!['income', 'expense'].includes(type as string)) {
    return NextResponse.json({ error: 'type harus income | expense' }, { status: 400 });
  }
  if (!category) {
    return NextResponse.json({ error: 'category wajib diisi' }, { status: 400 });
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: 'amount harus angka > 0' }, { status: 400 });
  }
  if (amount > 1_000_000_000) {
    return NextResponse.json({ error: 'amount terlalu besar (maks Rp 1 milyar)' }, { status: 400 });
  }

  const user = guard as { id: string };
  const { data, error } = await supabaseAdmin
    .from('youth_treasury_transactions')
    .insert({
      transaction_date,
      type,
      category,
      amount,
      description,
      created_by: user.id,
    })
    .select('id, transaction_date, type, category, amount, description, created_by, created_at')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true, transaction: data });
}