import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_SESSION_COOKIE, adminSessionMaxAge, createAdminSession, hasValidAdminPin } from '@/lib/admin-session';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { password } = body;

    if (!hasValidAdminPin(password)) {
      return NextResponse.json({ success: false, error: 'Password / PIN Admin salah.' }, { status: 401 });
    }

    const session = createAdminSession();
    const response = NextResponse.json({ success: true, message: 'Autentikasi berhasil.' });
    response.cookies.set(ADMIN_SESSION_COOKIE, session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: adminSessionMaxAge,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
