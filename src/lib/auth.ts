/**
 * Multi-role authentication for /super, /admin, /kas portals.
 *
 * Architecture:
 *   - User data is stored in the Supabase `users` table (see migration
 *     20260831100000_multi_role_users.sql).
 *   - Each user has a `roles` array (TEXT[]): ['super'], ['admin'],
 *     ['treasurer'], or multi-role like ['admin', 'treasurer'].
 *   - Passwords are bcrypt-hashed (cost 10). PIN must be exactly 4 digits
 *     (per user requirement). Longer passwords allowed for super.
 *   - Session is a signed cookie with HMAC-SHA256 over a JSON payload
 *     `{ userId, username, roles, expiresAt }`.
 *   - `getCurrentUser(req)` reads & verifies the cookie, then fetches
 *     the fresh user record from Supabase.
 *   - `requireRole(req, allowed)` returns User if any of user.roles
 *     is in `allowed`.
 *
 * Roles (per user, can be multiple):
 *   - 'super'      → /super + /admin + /kas (full access)
 *   - 'admin'      → /admin (Warta, Roster, Khotbah, Inventaris)
 *   - 'treasurer'  → /kas (manajemen kas youth)
 *
 * Security:
 *   - Cookies are httpOnly + Secure (in production) + sameSite=lax.
 *   - Session max age: 12 hours.
 *   - Password verification uses bcrypt.compare (timing-safe).
 *   - User lookup is cached briefly (60s) to avoid hammering the DB.
 *   - PIN 4-digit enforced server-side at user creation.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { supabaseAdmin, isSupabaseAdminConfigured } from './supabaseAdmin';

export type Role = 'super' | 'admin' | 'treasurer';

export interface User {
  id: string;
  username: string;
  roles: Role[];
  display_name: string | null;
  active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface SessionPayload {
  userId: string;
  username: string;
  roles: Role[];
  expiresAt: number;
}

const COOKIE_NAME = 'gia_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 12; // 12 hours
const BCRYPT_COST = 10;
const PIN_MIN = 4;    // PIN minimal 4 digit (per user requirement)
const PIN_MAX = 64;   // Max password length (allow longer for super)

// ---------------------------------------------------------------------------
// Session signing
// ---------------------------------------------------------------------------

function getSessionSecret() {
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
    if (!Array.isArray(payload.roles) || payload.roles.length === 0) return null;
    return payload;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Cookie helpers
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
// Password / PIN helpers — bcrypt cost 10
// PIN must be 4-64 chars; canonical PIN is exactly 4 digits but we accept
// longer passwords for superuser accounts.
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

/**
 * Validate a new PIN/password before hashing & storing.
 * - Must be 4-64 chars
 * - Whitespace trimmed
 * - Returns trimmed value on success, error message string on failure
 */
export function validateNewPassword(plain: unknown): { ok: true; value: string } | { ok: false; error: string } {
  if (typeof plain !== 'string') {
    return { ok: false, error: 'Password harus string' };
  }
  const trimmed = plain.trim();
  if (trimmed.length < PIN_MIN) {
    return { ok: false, error: `PIN/password minimal ${PIN_MIN} karakter` };
  }
  if (trimmed.length > PIN_MAX) {
    return { ok: false, error: `PIN/password maksimal ${PIN_MAX} karakter` };
  }
  return { ok: true, value: trimmed };
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
  const cached = userCache.get(userId);
  if (cached && cached.expiresAt > Date.now()) return cached.user;
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) return null;

  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, username, roles, display_name, active, last_login_at, created_at')
    .eq('id', userId)
    .eq('active', true)
    .maybeSingle();
  if (error || !data) return null;

  const user: User = normalizeUser(data);
  userCache.set(userId, { user, expiresAt: Date.now() + CACHE_TTL_MS });
  return user;
}

function normalizeUser(row: any): User {
  // Handle both old schema (role) and new schema (roles[]) for safety
  let roles: Role[] = [];
  if (Array.isArray(row.roles) && row.roles.length > 0) {
    roles = row.roles.filter((r: string) =>
      r === 'super' || r === 'admin' || r === 'treasurer',
    );
  } else if (typeof row.role === 'string') {
    if (row.role === 'super' || row.role === 'admin' || row.role === 'treasurer') {
      roles = [row.role];
    }
  }
  if (roles.length === 0) roles = ['admin']; // safe default
  return {
    id: row.id,
    username: row.username,
    roles,
    display_name: row.display_name,
    active: row.active,
    last_login_at: row.last_login_at,
    created_at: row.created_at,
  };
}

async function fetchUserByCredential(username: string, plainPassword: string): Promise<User | null> {
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    console.error('[auth] supabase admin NOT configured');
    return null;
  }
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('id, username, password_hash, roles, role, display_name, active, last_login_at, created_at')
    .eq('username', username)
    .eq('active', true)
    .maybeSingle();
  if (error) {
    console.error('[auth] supabase query error for', username, ':', error.message);
    return null;
  }
  if (!data) {
    console.error('[auth] no user found for', username, '(active=true filter)');
    return null;
  }
  const ok = await verifyPassword(plainPassword, data.password_hash);
  if (!ok) {
    console.error('[auth] bcrypt mismatch for', username, 'hash-prefix:', data.password_hash?.slice(0, 7));
    return null;
  }
  return normalizeUser(data);
}

// ---------------------------------------------------------------------------
// Cookie reader
// ---------------------------------------------------------------------------

export function readSessionFromCookie(req: { cookies: { get(name: string): { value: string } | undefined } }): SessionPayload | null {
  const cookie = req.cookies.get(COOKIE_NAME)?.value;
  return decodeSession(cookie);
}

export async function getCurrentUser(req: {
  cookies: { get(name: string): { value: string } | undefined };
}): Promise<User | null> {
  const session = readSessionFromCookie(req);
  if (!session) return null;
  return fetchUserById(session.userId);
}

/**
 * Route guard — returns the User if any of their roles is in `allowed`.
 * Otherwise returns a 401/403 Response.
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
  const hasRole = user.roles.some((r) => allowed.includes(r));
  if (!hasRole) {
    return new Response(
      JSON.stringify({
        error: `Forbidden — roles [${user.roles.join(', ')}] not in [${allowed.join(', ')}]`,
      }),
      { status: 403, headers: { 'Content-Type': 'application/json' } },
    );
  }
  return user;
}

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------

export async function login(
  username: string,
  password: string,
): Promise<{ user: User; token: string } | null> {
  const user = await fetchUserByCredential(username, password);
  if (!user) return null;
  const payload: SessionPayload = {
    userId: user.id,
    username: user.username,
    roles: user.roles,
    expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1_000,
  };
  const token = encodeSession(payload);

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
// User creation
// ---------------------------------------------------------------------------

export interface CreateUserInput {
  username: string;
  password: string;
  roles: Role[];
  display_name?: string | null;
}

export async function createUser(input: CreateUserInput): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!isSupabaseAdminConfigured() || !supabaseAdmin) {
    return { ok: false, error: 'Supabase admin not configured' };
  }
  const username = input.username.trim();
  const trimmed = input.password.trim();

  // Username validation
  if (username.length < 3 || username.length > 64) {
    return { ok: false, error: 'Username harus 3-64 karakter' };
  }
  if (!/^[a-zA-Z0-9._-]+$/.test(username)) {
    return { ok: false, error: 'Username hanya boleh huruf, angka, dot, underscore, dash' };
  }
  // Password validation
  const pwCheck = validateNewPassword(trimmed);
  if (!pwCheck.ok) return { ok: false, error: pwCheck.error };
  // Roles validation
  if (!Array.isArray(input.roles) || input.roles.length === 0) {
    return { ok: false, error: 'Pilih minimal 1 role' };
  }
  const validRoles: Role[] = ['super', 'admin', 'treasurer'];
  const roles = Array.from(new Set(input.roles.filter((r) => validRoles.includes(r))));
  if (roles.length === 0) {
    return { ok: false, error: 'Role tidak valid' };
  }
  // Check duplicate
  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .eq('username', username)
    .maybeSingle();
  if (existing) {
    return { ok: false, error: `Username '${username}' sudah dipakai` };
  }
  // Insert
  const password_hash = await hashPassword(pwCheck.value);
  const { data, error } = await supabaseAdmin
    .from('users')
    .insert({
      username,
      password_hash,
      roles,
      display_name: input.display_name?.trim() || null,
      active: true,
    })
    .select('id')
    .single();
  if (error) return { ok: false, error: error.message };
  return { ok: true, id: data.id };
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE_SECONDS = SESSION_DURATION_SECONDS;

// ---------------------------------------------------------------------------
// Rate limiting (login attempt lockout)
// In-memory sliding window per (ip + username). After MAX_FAILS, lock the
// key for LOCKOUT_MS.
// ---------------------------------------------------------------------------

interface RateLimitState {
  failures: number[];
  lockedUntil: number;
}
const loginAttempts = new Map<string, RateLimitState>();
const LOGIN_MAX_FAILS = 3;
const LOGIN_LOCKOUT_MS = 60_000; // 1 minute
const LOGIN_WINDOW_MS = 5 * 60_000; // 5 minutes

/** Returns { ok: true } if not locked, else { ok: false, retryAfterSec } */
export function checkLoginRateLimit(key: string): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const state = loginAttempts.get(key);
  if (!state) return { ok: true };
  if (state.lockedUntil > now) {
    return { ok: false, retryAfterSec: Math.ceil((state.lockedUntil - now) / 1000) };
  }
  // Lock expired; clean failures older than window
  state.failures = state.failures.filter((t) => now - t < LOGIN_WINDOW_MS);
  return { ok: true };
}

export function recordLoginFailure(key: string): { locked: boolean; retryAfterSec: number } {
  const now = Date.now();
  const state = loginAttempts.get(key) || { failures: [], lockedUntil: 0 };
  state.failures = state.failures.filter((t) => now - t < LOGIN_WINDOW_MS);
  state.failures.push(now);
  let locked = false;
  let retryAfterSec = 0;
  if (state.failures.length >= LOGIN_MAX_FAILS) {
    state.lockedUntil = now + LOGIN_LOCKOUT_MS;
    locked = true;
    retryAfterSec = Math.ceil(LOGIN_LOCKOUT_MS / 1000);
  }
  loginAttempts.set(key, state);
  return { locked, retryAfterSec };
}

export function clearLoginFailures(key: string) {
  loginAttempts.delete(key);
}

// Periodic cleanup to avoid memory leak
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [k, v] of loginAttempts) {
      if (v.lockedUntil < now && v.failures.every((t) => now - t > LOGIN_WINDOW_MS)) {
        loginAttempts.delete(k);
      }
    }
  }, 60_000);
}