import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

/**
 * GET /api/admin/assessment/results/[id]
 * Gets detailed responses for a specific attempt
 */
export async function GET(request: NextRequest, { params }: any) {
  try {
    const { id: attemptId } = params;

    if (!attemptId) {
      return NextResponse.json(
        { success: false, message: 'Attempt ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    // Get attempt details
    const { data: attempt, error: attemptError } = await supabase
      .from('assessment_attempts')
      .select(`
        *,
        assessment_candidates (
          id,
          full_name,
          enrollment_id,
          email,
          phone
        )
      `)
      .eq('id', attemptId)
      .single();

    if (attemptError || !attempt) {
      return NextResponse.json(
        { success: false, message: 'Attempt not found' },
        { status: 404 }
      );
    }

    // Get all responses for this attempt
    const { data: responses, error: responsesError } = await supabase
      .from('assessment_responses')
      .select('*')
      .eq('attempt_id', attemptId)
      .order('created_at', { ascending: true });

    if (responsesError) {
      throw responsesError;
    }

    return NextResponse.json(
      {
        success: true,
        attempt,
        responses: responses || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching response details:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch response details' },
      { status: 500 }
    );
  }
}
