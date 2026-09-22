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
        paper_id,
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
    let paper = null;
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

    if (attempts?.[0]?.paper_id) {
      const { data: paperData } = await supabase
        .from('assessment_exam_papers')
        .select('id, total_questions, total_marks')
        .eq('id', attempts[0].paper_id)
        .maybeSingle();
      paper = paperData;
    }

    return NextResponse.json(
      {
        success: true,
        attempts: attempts || [],
        responses: responses,
        paper,
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
