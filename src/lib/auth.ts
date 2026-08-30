/**
 * Multi-role authentication for /super, /admin, /kas portals.
 *
 * Architecture:
 *   - All user data is stored in the Supabase `users` table (see migration
 *     20260831_create_users_table.sql).
 *   - Passwords are bcrypt-hashed (cost 10). Plaintext NEVER touches disk.
 *   - Session is a signed cookie with HMAC-SHA256 over a JSON payload
 *     `{ userId, username, role, expiresAt }`.
 *   - `getCurrentUser(req)` reads & verifies the cookie, then fetches the
 *     fresh user record from Supabase (cheap single SELECT).
 *   - `requireRole(req, allowed)` is the route-guard used by /api/* routes.
 *
 * Roles:
 *   - 'super'      → /super only
 *   - 'admin'      → /super (admin-only views), /admin, /api/admin/*
 *   - 'treasurer'  → /super (admin-only views), /kas, /api/youth-treasury/*
 *
 * Security:
 *   - Cookies are httpOnly + Secure (in production) + sameSite=lax.
 *   - Session max age: 12 hours (matches ADMIN_SESSION_MAX_AGE legacy).
 *   - Password verification uses timing-safe bcrypt.compare.
 *   - User lookup is cached briefly to avoid hammering the DB on every API call.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { supabaseAdmin, isSupabaseAdminConfigured } from './supabaseAdmin';

export type Role = 'super' | 'admin' | 'treasurer';

export interface User {
  id: string;
  username: string;
  role: Role;
  display_name: string | null;
  active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface SessionPayload {
  userId: string;
  username: string;
  role: Role;
  expiresAt: number;
}

const COOKIE_NAME = 'gia_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 12; // 12 hours
const BCRYPT_COST = 10;

// ---------------------------------------------------------------------------
// Session signing — keep compatible with the legacy admin-session.ts format
// (HMAC-SHA256 over a base64url JSON payload). Distinct cookie name so old
// `gia_admin_session` cookies don't bleed into the new auth system.
// ---------------------------------------------------------------------------

function getSessionSecret() {
  // Per-environment secret. Falls back to a stable dev-only string if the
  // env var is missing (production MUST set ADMIN_SESSION_SECRET).
  return process.env.ADMIN_SESSION_SECRET || 'gia-deliksari-semarang-secret-key-2026';
}

function sign(value: string) {
  return createHmac('sha256', getSessionSecret()).update(value).digest('base64url');
}

export function encodeSession(payload: SessionPayload): string {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encoded}.${sign(encoded)}`;
}

export function decodeSession(token: string | undefined | null): SessionPayload | null {
  if (!token) return null;
  const [encoded, provided, ...rest] = token.split('.');
  if (!encoded || !provided || rest.length > 0) return null;
  const expected = sign(encoded);
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as SessionPayload;
    if (typeof payload.expiresAt !== 'number' || payload.expiresAt <= Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Cookie helpers — used by /api/auth/* route handlers.
// ---------------------------------------------------------------------------

export function setSessionCookie(res: { cookies: { set(name: string, value: string, opts: any): void } }, token: string) {
  res.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export function clearSessionCookie(res: { cookies: { set(name: string, value: string, opts: any): void } }) {
  res.cookies.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
}

// ---------------------------------------------------------------------------
// Password helpers — bcrypt cost 10. Never log plaintext passwords.
// ---------------------------------------------------------------------------

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_COST);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  try {
    return await bcrypt.compare(plain, hash);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// User lookup
// ---------------------------------------------------------------------------

interface UserCacheEntry {
  user: User;
  expiresAt: number;
}
const userCache = new Map<string, UserCacheEntry>();
const CACHE_TTL_MS = 60_000; // 1 minute

async function fetchUserById(userId: string): Promise<User | null> {
  // Cache hit
  const cached = userCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) return cached.user;
  if (!isSupabaseAdminConfigured || !supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, username, role, display_name, active, last_login_at, created_at')
    .eq('id', userId)
    .eq('active', true)
    .maybeSingle();
  if (error || !data) return null;

  const user: User = {
    id: data.id,
    username: data.username,
    role: data.role as Role,
    display_name: data.display_name,
    active: data.active,
    last_login_at: data.last_login_at,
    created_at: data.created_at,
  };
  userCache.set(userId, { user, expiresAt: Date.now() + CACHE_TTL_MS });
  return user;
}

async function fetchUserByUsername(username: string): Promise<User | null> {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, username, role, display_name, active, last_login_at, created_at')
    .eq('username', username)
    .eq('active', true)
    .maybeSingle();
  if (error || !data) return null;
  return {
    id: data.id,
    username: data.username,
    role: data.role as Role,
    display_name: data.display_name,
    active: data.active,
    last_login_at: data.last_login_at,
    created_at: data.created_at,
  };
}

async function fetchUserByCredential(username: string, plainPassword: string): Promise<User | null> {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) return null;
  // We need password_hash to verify. Allow direct column select for service role.
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, username, password_hash, role, display_name, active, last_login_at, created_at')
    .eq('username', username)
    .eq('active', true)
    .maybeSingle();
  if (error || !data) return null;
  const ok = await verifyPassword(plainPassword, data.password_hash);
  if (!ok) return null;
  return {
    id: data.id,
    username: data.username,
    role: data.role as Role,
    display_name: data.display_name,
    active: data.active,
    last_login_at: data.last_login_at,
    created_at: data.created_at,
  };
}

// ---------------------------------------------------------------------------
// Cookie reader — parses incoming request cookies and returns fresh User.
// ---------------------------------------------------------------------------

export function readSessionFromCookie(req: { cookies: { get(name: string): { value: string } | undefined } }): SessionPayload | null {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  return decodeSession(cookie);
}

/**
 * Returns the authenticated User from a request, or null if not authenticated.
 * Caches by userId for 60s.
 */
export async function getCurrentUser(req: {
  cookies: { get(name: string): { value: string } | undefined };
}): Promise<User | null> {
  const session = readSessionFromCookie(req);
  if (!session) return null;
  return fetchUserById(session.userId);
}

/**
 * Route guard — returns the User if their role is in `allowed`, otherwise
 * returns a 401/403 NextResponse. Use as:
 *
 *   const guard = await requireRole(req, ['super', 'admin']);
 *   if (guard instanceof NextResponse) return guard;
 *   const user = guard;
 */
export async function requireRole(
  req: { cookies: { get(name: string): { value: string } | undefined } },
  allowed: Role[],
): Promise<User | Response> {
  const user = await getCurrentUser(req);
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
  if (!allowed.includes(user.role)) {
    return new Response(
      JSON.stringify({
        error: `Forbidden — role '${user.role}' not allowed (need one of: ${allowed.join(', ')})`,
      }),
      { status: 403, headers: { 'Content-Type': 'application/json' } },
    );
  }
  return user;
}

// ---------------------------------------------------------------------------
// Login — verify credentials and return User + session token.
// ---------------------------------------------------------------------------

export async function login(username: string, password: string): Promise<{ user: User; token: string } | null> {
  const user = await fetchUserByCredential(username, password);
  if (!user) return null;
  const payload: SessionPayload = {
    userId: user.id,
    username: user.username,
    role: user.role,
    expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1_000,
  };
  const token = encodeSession(payload);

  // Update last_login_at (best-effort)
  if (isSupabaseAdminConfigured() && supabaseAdmin) {
    await supabaseAdmin
      .from('users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', user.id);
    userCache.delete(user.id);
  }

  return { user, token };
}

// ---------------------------------------------------------------------------
// Cookie name export (for logout / check routes)
// ---------------------------------------------------------------------------

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE_SECONDS = SESSION_DURATION_SECONDS;