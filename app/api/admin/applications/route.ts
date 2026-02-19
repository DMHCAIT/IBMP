import { NextResponse } from 'next/server';
import { supabase, getSupabaseServiceClient } from '@/lib/supabase';

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
    const { data: applications, error } = await db
      .from('applications')
      .select('application_number, full_name, email, course_name, status, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({
        success: false,
        message: 'Error fetching applications',
      }, { status: 500 });
    }

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
  } catch {
    return NextResponse.json({
      success: false,
      message: 'Error fetching applications',
    }, { status: 500 });
  }
}
