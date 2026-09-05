import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

/**
 * Helper function: Check if candidate answer matches expected answer
 * Matches if ANY single word in expected answer appears in candidate answer (case-insensitive)
 */
function checkAnswerMatch(candidateAnswer: string, expectedAnswer: string): boolean {
  if (!candidateAnswer || !expectedAnswer) return false;
  
  const candidateLower = candidateAnswer.toLowerCase().trim();
  const expectedWords = expectedAnswer
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 0);
  
  // Check if any word from expected answer appears in candidate answer
  return expectedWords.some(word => candidateLower.includes(word));
}

/**
 * POST /api/assessment/submit
 * Submits all assessment responses and calculates score with auto-scoring for Q41-Q60
 * Handles both regular JSON requests and navigator.sendBeacon requests (which send plain text)
 */
export async function POST(request: NextRequest) {
  try {
    let body;
    const contentType = request.headers.get('content-type') || '';
    
    // Handle both JSON and text/plain (from sendBeacon)
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else {
      // For sendBeacon, the data is sent as text/plain
      const text = await request.text();
      body = JSON.parse(text);
    }
    
    const { attemptId, candidateId, mcqAnswers, textAnswers, flaggedQuestions, examData } = body;

    if (!attemptId || !candidateId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    // Step 1: Mark attempt as completed
    const { error: updateAttemptError } = await supabase
      .from('assessment_attempts')
      .update({
        status: 'completed',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', attemptId);

    if (updateAttemptError) {
      console.error('Error updating attempt:', updateAttemptError);
      return NextResponse.json(
        { success: false, message: 'Failed to submit assessment' },
        { status: 500 }
      );
    }

    // Step 2: Store all responses with auto-scoring for Q41-Q60
    const questions = examData?.questions || [];
    let totalScore = 0;
    let totalMarks = 0;

    const responsesToInsert: Record<string, any>[] = [];

    questions.forEach((question: Record<string, any>) => {
      const qId = question.id;
      const qNum = question.number;
      
      // Calculate maxMarks based on question number
      let maxMarks = 1; // Default for Q1-Q40, Q51-Q60
      if (qNum >= 41 && qNum <= 50) {
        maxMarks = 3; // Q41-Q50 have 3 marks (3 parts x 1 mark each)
      }
      
      totalMarks += maxMarks;

      if (question.type === 'mcq') {
        // MCQ response - find option text for display
        const selectedOptionId = mcqAnswers[qId];
        // Use correctOptionId if available (from question_data), fallback to correctOption
        const correctId = question.correctOptionId || question.correctOption;
        const isCorrect = selectedOptionId === correctId;
        const marksObtained = isCorrect ? maxMarks : 0;
        totalScore += marksObtained;

        // Find the selected option text from options array
        let selectedOptionText = selectedOptionId || '';
        if (question.options && Array.isArray(question.options)) {
          const optionWithText = question.options.find((opt: any) => 
            (typeof opt === 'object' && opt.id === selectedOptionId) || 
            (typeof opt === 'string' && opt === selectedOptionId)
          );
          if (optionWithText && typeof optionWithText === 'object') {
            selectedOptionText = optionWithText.text || optionWithText.label || selectedOptionId;
          }
        }

        responsesToInsert.push({
          attempt_id: attemptId,
          candidate_id: candidateId,
          question_id: qId,
          question_type: 'mcq',
          response_text: selectedOptionText || null,
          is_correct: isCorrect,
          marks_obtained: marksObtained,
          max_marks: maxMarks,
          is_flagged: flaggedQuestions[qId] || false,
          response_json: {
            selectedOptionId: selectedOptionId,
            selectedOptionText: selectedOptionText,
          }
        });
      } else if (question.type === 'image') {
        // Image-based response - AUTO-SCORE based on word matching
        const parts = question.parts || [];
        const rubric = question.scoring?.rubric || [];
        
        parts.forEach((part: Record<string, any>) => {
          const partId = part.id;
          const responseKey = `${qId}.${partId}`;
          const responseText = textAnswers[responseKey];
          
          const rubricItem = rubric.find((r: any) => r.partId === partId);
          const expectedAnswer = rubricItem?.answer || '';
          const partMaxUnits = rubricItem?.maxUnits || part.maxUnits || 2;
          
          // Auto-score: check if answer matches any word in expected answer
          const isCorrect = checkAnswerMatch(responseText, expectedAnswer);
          const marksForThisPart = isCorrect ? partMaxUnits : 0;
          totalScore += marksForThisPart;
          
          responsesToInsert.push({
            attempt_id: attemptId,
            candidate_id: candidateId,
            question_id: responseKey,
            question_type: 'image',
            response_text: responseText || null,
            expected_answer: expectedAnswer,
            response_json: { 
              parentQuestion: qId,
              partId: partId,
              partPrompt: part.prompt,
              rubricId: rubricItem?.id,
            },
            is_correct: isCorrect,
            marks_obtained: marksForThisPart,
            max_marks: partMaxUnits,
            is_flagged: flaggedQuestions[qId] || false,
          });
        });
      } else if (question.type === 'short') {
        // Short answer response - AUTO-SCORE based on word matching
        const responseText = textAnswers[qId];
        const rubric = question.scoring?.rubric || [];
        const rubricItem = rubric[0];
        const expectedAnswer = rubricItem?.answer || '';
        
        // Auto-score: check if answer matches any word in expected answer
        const isCorrect = checkAnswerMatch(responseText, expectedAnswer);
        const marksForThisQuestion = isCorrect ? maxMarks : 0;
        totalScore += marksForThisQuestion;
        
        responsesToInsert.push({
          attempt_id: attemptId,
          candidate_id: candidateId,
          question_id: qId,
          question_type: 'short',
          response_text: responseText || null,
          expected_answer: expectedAnswer,
          response_json: {
            rubricId: rubricItem?.id,
            rubricAllowedUnits: rubricItem?.allowedUnits,
          },
          is_correct: isCorrect,
          marks_obtained: marksForThisQuestion,
          max_marks: maxMarks,
          is_flagged: flaggedQuestions[qId] || false,
        });
      }
    });

    // Insert all responses
    if (responsesToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('assessment_responses')
        .insert(responsesToInsert);

      if (insertError) {
        console.error('Error inserting responses:', insertError);
        return NextResponse.json(
          { success: false, message: 'Failed to store responses' },
          { status: 500 }
        );
      }
    }

    // Step 3: Update attempt with calculated score (for auto-scored questions only)
    const { error: scoreError } = await supabase
      .from('assessment_attempts')
      .update({
        total_score: totalScore,
      })
      .eq('id', attemptId);

    if (scoreError) {
      console.error('Error updating score:', scoreError);
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Assessment submitted successfully',
        score: {
          obtained: totalScore,
          total: totalMarks,
          percentage: totalMarks > 0 ? (totalScore / totalMarks) * 100 : 0,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Assessment submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
