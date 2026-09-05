import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

/**
 * GET /api/admin/assessment/results
 * Gets assessment attempts and results
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const searchParams = request.nextUrl.searchParams;
    const candidateId = searchParams.get('candidateId');
    const attemptId = searchParams.get('attemptId');
    const includeResponses = searchParams.get('includeResponses') === 'true';

    let query = supabase
      .from('assessment_attempts')
      .select(
        `
        id,
        candidate_id,
        enrollment_id,
        started_at,
        submitted_at,
        status,
        total_score,
        passing_score,
        result,
        assessment_candidates (
          full_name,
          enrollment_id,
          email
        )
      `
      )
      .order('created_at', { ascending: false });

    if (candidateId) {
      query = query.eq('candidate_id', candidateId);
    }

    if (attemptId) {
      query = query.eq('id', attemptId);
    }

    const { data: attempts, error } = await query;

    if (error) {
      throw error;
    }

    let responses = [];
    if (includeResponses && attemptId) {
      const { data: respData, error: respError } = await supabase
        .from('assessment_responses')
        .select('*')
        .eq('attempt_id', attemptId)
        .order('created_at', { ascending: true });

      if (respError) {
        console.error('Error fetching responses:', respError);
      } else {
        responses = respData || [];
      }
    }

    return NextResponse.json(
      {
        success: true,
        attempts: attempts || [],
        responses: responses,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching attempts:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch attempts' },
      { status: 500 }
    );
  }
}
