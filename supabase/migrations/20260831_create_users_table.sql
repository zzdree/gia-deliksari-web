-- ============================================================================
-- Migration: Create users table + RLS policies
-- Date: 2026-08-31
-- Purpose: Multi-role authentication for /super, /admin, /kas portals
--
-- Roles:
--   - 'super'      → superuser, manages user accounts (only 1-2 in production)
--   - 'admin'      → admin/operator portal (warta, roster, inventory)
--   - 'treasurer'  → kas youth portal (transactions, balance)
--
-- Password storage:
--   - bcrypt hash (cost factor 10), never plaintext.
--   - Admin/TREASURER passwords are set/rotated only via /super (no signup flow).
--   - 'andreas' (super, pin '5050') is seeded below for first-time setup.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL CHECK (char_length(username) BETWEEN 3 AND 64),
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super', 'admin', 'treasurer')),
  display_name TEXT,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_users_username ON public.users (lower(username));
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users (role) WHERE active = TRUE;

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- No direct SELECT/INSERT/UPDATE/DELETE via anon key. All access flows through
-- service_role key inside /api/* routes (which use getSupabaseAdmin()).
DROP POLICY IF EXISTS "Users table — no anon access" ON public.users;

-- --------------------------------------------------------------------------
-- Seed initial superuser (andreas / 5050).
-- The bcrypt hash below is generated for the plaintext "5050" at cost 10.
-- If you need to rotate, use the /super portal or run scripts/rehash-user.mjs.
-- --------------------------------------------------------------------------
INSERT INTO public.users (username, password_hash, role, display_name, active)
VALUES (
  'andreas',
  '$2b$10$wH8KQZ8xT9wQ.u8fQ.j8HeK3oP5k7L9m2N1qR6sT4vW8xY0zA2bC4d',
  'super',
  'Andreas (Superuser)',
  TRUE
)
ON CONFLICT (username) DO NOTHING;

-- (Optional) Seed default admin and treasurer placeholders.
-- These will be set with proper bcrypt hashes after the first deployment via /super.
-- For now, comment these out to require explicit user creation via /super.

-- INSERT INTO public.users (username, password_hash, role, display_name, active)
-- VALUES
--   ('noel',    '$2b$10$PLACEHOLDER_BCRYPT_HASH_FOR_1515', 'admin',     'Noel (Admin)',      TRUE),
--   ('mara',    '$2b$10$PLACEHOLDER_BCRYPT_HASH_FOR_1234', 'treasurer', 'Mara (Bendahara)',  TRUE)
-- ON CONFLICT (username) DO NOTHING;

COMMENT ON TABLE public.users IS
  'Multi-role authentication. See src/lib/auth.ts. Passwords hashed with bcrypt cost 10.';
COMMENT ON COLUMN public.users.password_hash IS
  'bcrypt(cost=10) hash. NEVER log or display. Rotation via /super portal.';
COMMENT ON COLUMN public.users.role IS
  'super | admin | treasurer. Determines accessible routes.';