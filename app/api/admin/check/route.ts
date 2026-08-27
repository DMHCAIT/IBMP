import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('ibmp_admin');
    console.log('[Check] ibmp_admin cookie:', authCookie);
    if (authCookie && authCookie.value) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false }, { status: 401 });
  } catch (err) {
    console.error('[Check] Error:', err);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
