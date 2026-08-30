-- ============================================================================
-- Migration: Create youth_treasury_transactions table for /kas portal
-- Date: 2026-08-31
-- Purpose: Track income (pemasukan) and expense (pengeluaran) for Grow
-- Generation Youth treasury. Access is restricted to role='treasurer' or
-- role='super' (via src/lib/auth.ts requireRole).
--
-- Categories are free-text but we recommend:
--   'iuran_anggota'    — weekly/monthly member dues
--   'sumbangan'         — external donations
--   'konsumsi'          — food/drinks for events
--   'transportasi'      — travel costs
--   'alat'              — equipment purchases
--   'acara'             — event costs (retreat, etc)
--   'lainnya'           — uncategorized
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.youth_treasury_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  category TEXT NOT NULL,
  amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_youth_treasury_date
  ON public.youth_treasury_transactions (transaction_date DESC);
CREATE INDEX IF NOT EXISTS idx_youth_treasury_type
  ON public.youth_treasury_transactions (type);
CREATE INDEX IF NOT EXISTS idx_youth_treasury_created_by
  ON public.youth_treasury_transactions (created_by);

ALTER TABLE public.youth_treasury_transactions ENABLE ROW LEVEL SECURITY;

-- No anon access. All flows through service_role in /api/youth-treasury/* routes.
DROP POLICY IF EXISTS "Youth treasury — no anon access" ON public.youth_treasury_transactions;

-- Rekap view for quick balance/total queries.
CREATE OR REPLACE VIEW public.youth_treasury_balance AS
SELECT
  COALESCE(SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END), 0)::numeric(14, 2) AS total_income,
  COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0)::numeric(14, 2) AS total_expense,
  COALESCE(SUM(CASE WHEN type = 'income'  THEN amount
                    WHEN type = 'expense' THEN -amount
                    ELSE 0 END), 0)::numeric(14, 2) AS balance,
  COUNT(*) FILTER (WHERE type = 'income')  AS income_count,
  COUNT(*) FILTER (WHERE type = 'expense') AS expense_count
FROM public.youth_treasury_transactions;

COMMENT ON VIEW public.youth_treasury_balance IS
  'Aggregate balance for Grow Generation youth treasury. Returns income/expense totals and net balance.';

COMMENT ON TABLE public.youth_treasury_transactions IS
  'Income and expense ledger for Grow Generation Youth. See /kas portal.';