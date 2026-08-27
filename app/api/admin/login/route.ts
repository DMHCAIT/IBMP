import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, message: 'Server not configured.' }, { status: 500 });
    }

    if (password === ADMIN_PASSWORD) {
      const res = NextResponse.json({ success: true });
      // set a secure, httpOnly cookie for authentication
      res.cookies.set('ibmp_admin', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24, // 1 day
      });
      console.log('[Login] Password matched, cookie set for ibmp_admin');
      return res;
    }

    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ success: false, message: 'Invalid request' }, { status: 400 });
  }
}
