import { NextResponse } from 'next/server';
import { supabase, getSupabaseServiceClient } from '@/lib/supabase';

// CRITICAL: Force dynamic rendering so this route is never statically cached
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getAdminClient() {
  try {
    return getSupabaseServiceClient();
  } catch {
    return supabase;
  }
}

export async function GET() {
  try {
    const db = getAdminClient();
    console.log('[Admin Applications] Fetching applications from Supabase...');
    console.log('[Admin Applications] Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING');
    console.log('[Admin Applications] Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING (using anon key)');

    const { data: applications, error } = await db
      .from('applications')
      .select('application_number, full_name, email, course_name, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Admin Applications] Supabase error:', JSON.stringify(error));
      return NextResponse.json({
        success: false,
        message: `Error fetching applications: ${error.message}`,
        debug: { code: error.code, hint: error.hint, details: error.details },
      }, { status: 500 });
    }

    console.log(`[Admin Applications] Found ${applications?.length ?? 0} applications`);

    // Map snake_case to camelCase for frontend compatibility
    const mapped = (applications || []).map(app => ({
      applicationNumber: app.application_number,
      fullName: app.full_name,
      emailId: app.email,
      courseName: app.course_name,
      status: app.status,
      submittedAt: app.created_at,
    }));

    return NextResponse.json({
      success: true,
      applications: mapped,
    });
  } catch (err) {
    console.error('[Admin Applications] Unexpected error:', err);
    return NextResponse.json({
      success: false,
      message: `Error fetching applications: ${err instanceof Error ? err.message : 'Unknown error'}`,
    }, { status: 500 });
  }
}
