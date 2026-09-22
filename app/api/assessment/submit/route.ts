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
  const expectedWords = normalize(expectedAnswer)
    .split(/\s+/)
    .filter(word => word.length >= 3 && !ignoredWords.has(word));

  return expectedWords.some(word => candidateWords.has(word));
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
    
    const { attemptId, candidateId, mcqAnswers = {}, textAnswers = {}, flaggedQuestions = {} } = body;

    if (!attemptId || !candidateId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    // Always score against the questions belonging to this attempt's paper.
    // Client-provided exam data is only a display concern and must not select
    // another paper's answer key.
    const { data: attempt, error: attemptLookupError } = await supabase
      .from('assessment_attempts')
      .select('id, candidate_id, paper_id, status')
      .eq('id', attemptId)
      .eq('candidate_id', candidateId)
      .single();

    if (attemptLookupError || !attempt?.paper_id) {
      return NextResponse.json(
        { success: false, message: 'Assessment attempt or paper not found' },
        { status: 404 }
      );
    }

    if (attempt.status === 'completed' || attempt.status === 'submitted') {
      return NextResponse.json(
        { success: false, message: 'This assessment has already been submitted' },
        { status: 409 }
      );
    }

    const { data: paperQuestions, error: questionsError } = await supabase
      .from('assessment_questions')
      .select('question_number, type, stem, marks, options, correct_answer, question_data, image_url, parts')
      .eq('paper_id', attempt.paper_id)
      .order('sort_order', { ascending: true });

    if (questionsError || !paperQuestions?.length) {
      return NextResponse.json(
        { success: false, message: 'No questions configured for this paper' },
        { status: 422 }
      );
    }

    // Store all responses with auto-scoring for this paper.
    const questions = paperQuestions.map((question: Record<string, any>) => {
      const data = question.question_data || {};
      return {
        ...data,
        id: data.id || question.question_number,
        number: data.number || parseInt(String(question.question_number).replace(/\D/g, ''), 10),
        type: question.type || data.type,
        stem: question.stem || data.stem,
        marks: question.marks || data.marks || data.maxUnits || 1,
        maxUnits: question.marks || data.maxUnits || data.marks || 1,
        options: question.options || data.options || [],
        correctOptionId: data.scoring?.correctOptionId,
        correctOption: question.correct_answer || data.correctOption,
        correct_answer: question.correct_answer,
        parts: data.parts || question.parts || [],
        scoring: data.scoring || { marks: question.marks || 1 },
      };
    });
    let totalScore = 0;
    let totalMarks = 0;

    const responsesToInsert: Record<string, any>[] = [];

    questions.forEach((question: Record<string, any>) => {
      const qId = question.id;
      const _qNum = question.number;
      
      // Use the paper's stored marks and rubric instead of a global question
      // number convention, since every paper can define its own structure.
      const rubric = question.scoring?.rubric || [];
      const maxMarks = question.type === 'image' && rubric.length > 0
        ? rubric.reduce((sum: number, item: Record<string, any>) => sum + (item.maxUnits || 0), 0)
        : question.marks || question.maxUnits || 1;
      
      totalMarks += maxMarks;

      if (question.type === 'mcq') {
        // MCQ response - find option text for display
        const selectedOptionId = mcqAnswers[qId];
        // Use correctOptionId if available (from question_data), fallback to correctOption
        const correctId = question.correctOptionId || question.scoring?.correctOptionId || question.correctOption;
        const selectedOption = question.options?.find((option: any) =>
          (typeof option === 'object' && option.id === selectedOptionId) || option === selectedOptionId
        );
        const selectedText = typeof selectedOption === 'object'
          ? selectedOption.text || selectedOption.label || ''
          : selectedOption || selectedOptionId;
        const correctText = question.options?.find((option: any) =>
          typeof option === 'object' && option.id === question.correctOptionId
        )?.text || question.correct_answer;
        const hasSelectedAnswer = typeof selectedOptionId === 'string' && selectedOptionId.trim().length > 0;
        const isCorrect = hasSelectedAnswer && (
          selectedOptionId === correctId || selectedText === correctText
        );
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

    // A resumed attempt may have partial rows from an interrupted request.
    // Replace them so retrying submission cannot duplicate the result.
    const { error: clearResponsesError } = await supabase
      .from('assessment_responses')
      .delete()
      .eq('attempt_id', attemptId);

    if (clearResponsesError) {
      console.error('Error clearing previous responses:', clearResponsesError);
      return NextResponse.json(
        { success: false, message: 'Failed to prepare assessment submission' },
        { status: 500 }
      );
    }

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
      return NextResponse.json(
        { success: false, message: 'Failed to save assessment score' },
        { status: 500 }
      );
    }

    // Complete the attempt only after responses and score are persisted. This
    // leaves interrupted submissions resumable instead of falsely completed.
    const { error: updateAttemptError } = await supabase
      .from('assessment_attempts')
      .update({
        status: 'completed',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', attemptId)
      .eq('status', 'in-progress');

    if (updateAttemptError) {
      console.error('Error completing attempt:', updateAttemptError);
      return NextResponse.json(
        { success: false, message: 'Failed to complete assessment attempt' },
        { status: 500 }
      );
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
