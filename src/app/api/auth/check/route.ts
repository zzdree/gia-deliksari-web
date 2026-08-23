import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, hasValidAdminSession } from '@/lib/admin-session';

export async function GET(req: NextRequest) {
  const session = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = hasValidAdminSession(session);
  return NextResponse.json({ authenticated: isAuthenticated });
}
