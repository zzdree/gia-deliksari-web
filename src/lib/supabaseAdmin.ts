import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client with SERVICE ROLE privileges.
 *
 * NEVER import this from a client component — the service role key bypasses
 * all Row Level Security. Used exclusively inside API routes that have already
 * verified the admin session cookie (or trusted server pipelines such as the
 * gallery upload route).
 *
 * Lazy initialization: we resolve env vars PER REQUEST rather than at module
 * load time. Vercel serverless functions cache module state across requests,
 * but env vars are only guaranteed to be present at runtime — not at build.
 * Resolving per-call ensures we always pick up the latest values.
 */
let _client: SupabaseClient | null = null;

function getUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ''
  );
}

function getServiceKey(): string {
  return (
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_KEY ||
    ''
  );
}

export function isSupabaseAdminConfigured(): boolean {
  const url = getUrl();
  const key = getServiceKey();
  return Boolean(
    url &&
      key &&
      url !== 'https://your-project.supabase.co' &&
      !url.includes('placeholder'),
  );
}

/**
 * Returns a singleton admin client. We hold the client across requests so we
 * don't pay the connection-pool cost on every call, but we lazily resolve env
 * on first call (which happens at runtime in the serverless function).
 *
 * Emits a single one-shot warning when the env is missing, so misconfigured
 * deployments show up clearly in Vercel function logs instead of silently
 * returning null to every caller.
 */
let _warnedMissingEnv = false;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (_client) return _client;
  if (!isSupabaseAdminConfigured()) {
    if (!_warnedMissingEnv) {
      _warnedMissingEnv = true;
      console.error(
        '[supabaseAdmin] FATAL: Supabase admin env vars not configured. ' +
          'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel. ' +
          'All server-side DB operations will fail until this is fixed.',
      );
    }
    return null;
  }
  _client = createClient(getUrl(), getServiceKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}

/** @deprecated kept for callers that import the eager client; prefer getSupabaseAdmin(). */
export const supabaseAdmin = getSupabaseAdmin();
