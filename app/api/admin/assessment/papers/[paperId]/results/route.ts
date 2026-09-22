import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { persistSession: false } }
);

export async function GET(
  request: NextRequest,
  { params }: { params: { paperId: string } }
) {
  try {
    // Get attempts for this paper with candidate info
    const { data: attempts, error } = await supabase
      .from('assessment_attempts')
      .select(`
        id,
        candidate_id,
        score,
        total_marks,
        created_at,
        assessment_candidates(full_name)
      `)
      .eq('paper_id', params.paperId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Flatten the data
    const flattenedAttempts = attempts?.map((attempt: any) => ({
      id: attempt.id,
      candidate_id: attempt.candidate_id,
      score: attempt.score,
      total_marks: attempt.total_marks,
      created_at: attempt.created_at,
      full_name: attempt.assessment_candidates?.[0]?.full_name || 'Unknown',
    })) || [];

    return NextResponse.json({
      success: true,
      attempts: flattenedAttempts,
    });
  } catch (error: any) {
    console.error('Error fetching paper results:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch results',
      },
      { status: 500 }
    );
  }
}
