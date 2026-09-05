import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

/**
 * POST /api/admin/assessment/settings
 * Saves assessment settings to database
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { durationMinutes, totalMarks, passingMarks, passingPercentage, description, examType, examTitle } = body;

    if (!durationMinutes || totalMarks === undefined) {
      return NextResponse.json(
        { success: false, message: 'Missing required settings' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    // Store settings in assessment_config
    const { error: upsertError } = await supabase
      .from('assessment_config')
      .upsert(
        {
          id: 'default', // Single row for default config
          exam_type: examType || 'Pain Medicine',
          exam_title: examTitle || 'Pain Medicine (Set A)',
          duration_minutes: durationMinutes,
          total_marks: totalMarks,
          passing_marks: passingMarks,
          passing_percentage: passingPercentage,
          description: description,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      );

    if (upsertError) {
      console.error('Config upsert error:', upsertError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Settings saved successfully',
        settings: {
          examType: examType || 'Pain Medicine',
          examTitle: examTitle || 'Pain Medicine (Set A)',
          durationMinutes,
          totalMarks,
          passingMarks,
          passingPercentage,
          description,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Settings save error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save settings' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/assessment/settings
 * Retrieves assessment settings from database
 */
export async function GET() {
  try {
    const supabase = getSupabaseServiceClient();

    const { data, error } = await supabase
      .from('assessment_config')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned
      console.error('Error fetching settings:', error);
    }

    return NextResponse.json(
      {
        success: true,
        settings: data || {
          exam_type: 'Pain Medicine',
          exam_title: 'Pain Medicine (Set A)',
          duration_minutes: 120,
          total_marks: 80,
          passing_marks: 50,
          passing_percentage: 62.5,
          description: 'Pain Medicine specialization assessment',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}
