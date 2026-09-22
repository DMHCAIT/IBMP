import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

/**
 * Helper function: Check if candidate answer matches expected answer
 * Matches if any meaningful word from the expected answer appears in the candidate answer.
 */
function checkAnswerMatch(candidateAnswer: string, expectedAnswer: string): boolean {
  if (!candidateAnswer || !expectedAnswer) return false;
  
  const normalize = (value: string) => value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  const candidateWords = new Set(normalize(candidateAnswer).split(/\s+/));
  const ignoredWords = new Set([
    'a', 'an', 'and', 'answer', 'any', 'before', 'by', 'example', 'for',
    'from', 'give', 'in', 'is', 'name', 'one', 'or', 'state', 'the', 'to',
    'used', 'way', 'with', 'would',
  ]);
  return normalize(expectedAnswer)
    .split(/\s+/)
    .filter(word => word.length >= 3 && !ignoredWords.has(word))
    .some(word => candidateWords.has(word));
}

/**
 * POST /api/admin/assessment/questions/recalculate-attempts
 * Recalculates scores for all attempts when question expected answer is updated
 * Only recalculates for Q41-Q60 (image and short answer questions)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { questionId, expectedAnswer, maxMarks } = body;

    if (!questionId) {
      return NextResponse.json(
        { success: false, message: 'Missing questionId' },
        { status: 400 }
      );
    }

    // Only recalculate for Q41-Q60
    const qNum = questionId.replace(/[^\d]/g, '');
    const questionNum = parseInt(qNum);
    if (isNaN(questionNum) || questionNum < 41 || questionNum > 60) {
      // MCQ (Q1-Q40) scoring doesn't change with expected answer updates
      return NextResponse.json(
        { success: true, message: 'MCQ questions do not require recalculation' },
        { status: 200 }
      );
    }

    const supabase = getSupabaseServiceClient();

    // Fetch all responses for this question
    const { data: responses, error: fetchError } = await supabase
      .from('assessment_responses')
      .select('id, attempt_id, response_text, marks_obtained, max_marks')
      .ilike('question_id', `${questionId}%`); // Match Q51 and Q51.a, Q51.b, etc.

    if (fetchError) {
      console.error('Error fetching responses:', fetchError);
      return NextResponse.json(
        { success: false, message: 'Failed to fetch responses' },
        { status: 500 }
      );
    }

    // Recalculate marks for each response
    const updatePromises: any[] = [];
    const affectedAttempts = new Set<string>();

    (responses || []).forEach((response: any) => {
      const isCorrect = checkAnswerMatch(response.response_text, expectedAnswer);
      const newMarks = isCorrect ? (maxMarks || response.max_marks || 0) : 0;

      if (response.attempt_id) {
        affectedAttempts.add(response.attempt_id);
      }

      if (newMarks !== response.marks_obtained) {
        updatePromises.push(
          supabase
            .from('assessment_responses')
            .update({
              is_correct: isCorrect,
              marks_obtained: newMarks,
              expected_answer: expectedAnswer,
            })
            .eq('id', response.id)
        );
      }
    });

    // Execute all updates
    if (updatePromises.length > 0) {
      const results = await Promise.all(updatePromises);
      for (const { error } of results) {
        if (error) {
          console.error('Error updating response:', error);
        }
      }
    }

    // Recalculate total_score for all affected attempts
    for (const attemptId of Array.from(affectedAttempts)) {
      const { data: attemptResponses, error: calcError } = await supabase
        .from('assessment_responses')
        .select('marks_obtained')
        .eq('attempt_id', attemptId);

      if (calcError) {
        console.error('Error calculating score for attempt:', calcError);
        continue;
      }

      const newTotalScore = (attemptResponses || []).reduce(
        (sum, r: any) => sum + (r.marks_obtained || 0),
        0
      );

      await supabase
        .from('assessment_attempts')
        .update({ total_score: newTotalScore })
        .eq('id', attemptId);
    }

    return NextResponse.json(
      {
        success: true,
        message: `Recalculated scores for ${affectedAttempts.size} attempt(s)`,
        affectedAttempts: affectedAttempts.size,
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
