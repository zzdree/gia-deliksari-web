import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, hasValidAdminSession } from '@/lib/admin-session';
import { isSupabaseAdminConfigured, getSupabaseAdmin } from '@/lib/supabaseAdmin';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

/**
 * DEBUG endpoint — returns env-var diagnostic info.
 *
 * Requires admin session so anonymous visitors can't enumerate our config.
 * Used for diagnosing "Invalid API key" errors on production.
 *
 * SECURITY: only available in non-production, OR with admin session.
 * Returns masked values (length + first/last chars only) — never the raw key.
 */
export async function GET(req: NextRequest) {
  // Always require admin session for this debug endpoint
  const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isAdmin = hasValidAdminSession(session);

  if (process.env.NODE_ENV === 'production' && !isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const mask = (v: string | undefined) => {
    if (!v) return { present: false, length: 0 };
    return {
      present: true,
      length: v.length,
      prefix: v.slice(0, 6),
      suffix: v.slice(-4),
    };
  };

  const env = {
    NEXT_PUBLIC_SUPABASE_URL: mask(process.env.NEXT_PUBLIC_SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: mask(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    SUPABASE_SERVICE_ROLE_KEY: mask(process.env.SUPABASE_SERVICE_ROLE_KEY),
    SUPABASE_SERVICE_KEY: mask(process.env.SUPABASE_SERVICE_KEY),
    SUPABASE_URL: mask(process.env.SUPABASE_URL),
    NODE_ENV: process.env.NODE_ENV || 'unknown',
    VERCEL_ENV: process.env.VERCEL_ENV || 'unknown',
    VERCEL_REGION: process.env.VERCEL_REGION || 'unknown',
  };

  // Try to actually use the admin client (suppress the error)
  let adminTest: { ok: boolean; error?: string } = { ok: false };
  try {
    const c = getSupabaseAdmin();
    if (c) {
      const { error } = await c.from('announcements').select('id', { count: 'exact', head: true });
      adminTest = { ok: !error, error: error?.message };
    }
  } catch (e: any) {
    adminTest = { ok: false, error: e?.message || String(e) };
  }

  let anonTest: { ok: boolean; error?: string } = { ok: false };
  try {
    if (supabase) {
      const { error } = await supabase.from('announcements').select('id', { count: 'exact', head: true });
      anonTest = { ok: !error, error: error?.message };
    }
  } catch (e: any) {
    anonTest = { ok: false, error: e?.message || String(e) };
  }

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    isAdmin,
    env,
    isSupabaseConfigured: isSupabaseConfigured,
    isSupabaseAdminConfigured: isSupabaseAdminConfigured(),
    anonTest,
    adminTest,
  });
}