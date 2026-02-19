import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: applications, error } = await supabase
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

    return NextResponse.json({
      success: true,
      applications: applications || [],
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching applications',
    }, { status: 500 });
  }
}
