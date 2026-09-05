import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

/**
 * PUT /api/admin/assessment/responses/[id]
 * Updates a response with admin score and notes
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseServiceClient();
    const { id } = params;
    const body = await request.json();

    const { marks_obtained, admin_notes, is_correct, admin_answer } = body;

    // Update the response
    const { data, error } = await supabase
      .from('assessment_responses')
      .update({
        marks_obtained: marks_obtained ?? 0,
        admin_notes: admin_notes || null,
        is_correct: is_correct ?? null,
        admin_answer: admin_answer || null,
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Error updating response:', error);
      throw error;
    }

    // Get the updated response and recalculate total score for the attempt
    if (data && data.length > 0) {
      const response = data[0];
      const attemptId = response.attempt_id;

      // Recalculate total score for this attempt
      const { data: allResponses, error: fetchError } = await supabase
        .from('assessment_responses')
        .select('marks_obtained, max_marks')
        .eq('attempt_id', attemptId);

      if (!fetchError && allResponses) {
        const totalScore = allResponses.reduce((sum: number, r: any) => sum + (r.marks_obtained || 0), 0);

        // Update attempt total score
        await supabase
          .from('assessment_attempts')
          .update({ total_score: totalScore })
          .eq('id', attemptId);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Response updated successfully',
        data: data?.[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating response:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update response' },
      { status: 500 }
    );
  }
}
