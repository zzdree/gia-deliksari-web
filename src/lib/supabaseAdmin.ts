import { createClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client with SERVICE ROLE privileges.
 *
 * NEVER import this from a client component — the service role key bypasses
 * all Row Level Security. Used exclusively inside API routes that have already
 * verified the admin session cookie (or trusted server pipelines such as the
 * gallery upload route).
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const isSupabaseAdminConfigured = Boolean(
  url &&
    serviceKey &&
    url !== 'https://your-project.supabase.co' &&
    !url.includes('placeholder'),
);

export const supabaseAdmin = isSupabaseAdminConfigured
  ? createClient(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  : null;
