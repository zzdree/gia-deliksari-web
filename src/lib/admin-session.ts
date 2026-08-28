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
  const configuredPin = process.env.ADMIN_PASSWORD || '9900';
  if (!configuredPin || typeof pin !== 'string') return false;

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
