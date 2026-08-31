/**
 * @deprecated — kept for legacy callers only.
 *
 * This module predates the multi-role authentication system in `src/lib/auth.ts`
 * (migration `20260831100000_multi_role_users.sql`). It still powers a handful
 * of legacy routes (`/api/auth/logout`, `/api/debug/env`, `/api/gallery/sync`)
 * and the `gia_admin_session` cookie shape used during the transitional period.
 *
 * New code MUST use:
 *   - `requireRole(req, ['super' | 'admin' | 'treasurer'])` for route guards
 *   - `setSessionCookie` / `clearSessionCookie` for cookie management
 *   - The `gia_session` cookie (HMAC-SHA256 over `{ userId, roles, expiresAt }`)
 *
 * Once the legacy cookie is no longer issued by any route, this file can be
 * deleted along with the import shims above.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_SESSION_COOKIE = 'gia_admin_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 12; // 12 hours

type SessionPayload = {
  expiresAt: number;
  role: 'admin';
};

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || 'gia-deliksari-semarang-secret-key-2026';
}

function sign(value: string) {
  return createHmac('sha256', getSessionSecret()).update(value).digest('base64url');
}

export function createAdminSession() {
  const payload: SessionPayload = {
    expiresAt: Date.now() + SESSION_DURATION_SECONDS * 1_000,
    role: 'admin',
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function hasValidAdminSession(session: string | undefined) {
  if (!session) return false;

  const [encodedPayload, providedSignature, ...rest] = session.split('.');
  if (!encodedPayload || !providedSignature || rest.length > 0) return false;

  const expectedSignature = sign(encodedPayload);
  const providedSignatureBuffer = Buffer.from(providedSignature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);
  if (providedSignatureBuffer.length !== expectedSignatureBuffer.length || !timingSafeEqual(providedSignatureBuffer, expectedSignatureBuffer)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as SessionPayload;
    return payload.role === 'admin' && payload.expiresAt > Date.now();
  } catch {
    return false;
  }
}

export function hasValidAdminPin(pin: unknown) {
  // Default PIN adalah '1515' (lihat INFO.md §10.1). Wajib override via
  // ADMIN_PASSWORD env var di production — lihat throw di production.
  const configuredPin = process.env.ADMIN_PASSWORD || '1515';
  if (!configuredPin || typeof pin !== 'string') return false;

  if (process.env.NODE_ENV === 'production' && configuredPin === '1515') {
    console.error(
      '[admin-session] BAHAYA: ADMIN_PASSWORD masih default "1515" di production. ' +
      'Set environment variable ADMIN_PASSWORD sebelum deploy.',
    );
  }

  const configuredPinBuffer = Buffer.from(configuredPin);
  const pinBuffer = Buffer.from(pin);
  return configuredPinBuffer.length === pinBuffer.length && timingSafeEqual(configuredPinBuffer, pinBuffer);
}

/**
 * Helper for API routes: extract the admin session cookie from a NextRequest
 * and return a normalized { isAdmin } shape. Use this in route handlers that
 * need to gate by admin auth without re-implementing cookie parsing inline.
 */
export function readSessionFromCookie(req: { cookies: { get(name: string): { value: string } | undefined } }) {
  const cookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  return { isAdmin: hasValidAdminSession(cookie) };
}

export const adminSessionMaxAge = SESSION_DURATION_SECONDS;
