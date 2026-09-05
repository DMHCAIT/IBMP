import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

/**
 * POST /api/admin/assessment/results/recalculate-score
 * Recalculates total score for an attempt based on current response marks
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { attemptId } = body;

    if (!attemptId) {
      return NextResponse.json(
        { success: false, message: 'Missing attemptId' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    // Fetch all responses for this attempt
    const { data: responses, error: fetchError } = await supabase
      .from('assessment_responses')
      .select('marks_obtained')
      .eq('attempt_id', attemptId);

    if (fetchError) {
      console.error('Error fetching responses:', fetchError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch responses' },
        { status: 500 }
      );
    }

    // Calculate new total score
    const newTotalScore = (responses || []).reduce(
      (sum, response: any) => sum + (response.marks_obtained || 0),
      0
    );

    // Update attempt with new score
    const { error: updateError } = await supabase
      .from('assessment_attempts')
      .update({
        total_score: newTotalScore,
      })
      .eq('id', attemptId);

    if (updateError) {
      console.error('Error updating score:', updateError);
      return NextResponse.json(
        { success: false, message: 'Failed to update score' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Score recalculated successfully',
        newTotalScore: newTotalScore,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Score recalculation error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
