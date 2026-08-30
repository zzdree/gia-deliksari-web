import { NextRequest, NextResponse } from 'next/server';
import {
  login,
  setSessionCookie,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from '@/lib/auth';

/**
 * POST /api/auth/login — multi-role login.
 *
 * Body: { username, password }
 * Returns: { success, user: { username, role, display_name }, message }
 * Sets cookie: gia_session (httpOnly, secure in prod, sameSite=lax, 12h).
 *
 * NOTE: /admin's legacy PIN-based login (/api/auth/login with { password }) is
 * still supported for backward-compat until Phase 3 completes. After Phase 3,
 * only username + password login will be accepted.
 */
export async function POST(req: NextRequest) {
  let body: { username?: unknown; password?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: 'Body tidak valid' }, { status: 400 });
  }

  const username = typeof body.username === 'string' ? body.username.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!username || !password) {
    return NextResponse.json(
      { success: false, error: 'Username dan password wajib diisi' },
      { status: 400 },
    );
  }

  const result = await login(username, password);
  if (!result) {
    return NextResponse.json(
      { success: false, error: 'Username atau password salah' },
      { status: 401 },
    );
  }

  const { user, token } = result;
  const res = NextResponse.json({
    success: true,
    message: `Login berhasil. Selamat datang, ${user.display_name || user.username}!`,
    user: { username: user.username, role: user.role, display_name: user.display_name },
  });
  setSessionCookie(res, token);
  return res;
}

/**
 * POST /api/auth/logout — clears the session cookie.
 */
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE_NAME, '', { path: '/', maxAge: 0 });
  return res;
}

export const SESSION_MAX_AGE = SESSION_MAX_AGE_SECONDS;