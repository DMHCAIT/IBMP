import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { questionId: string } }
) {
  try {
    const questionId = params.questionId;

    const { data, error } = await supabase
      .from('assessment_questions')
      .select('*')
      .eq('id', questionId)
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { questionId: string } }
) {
  try {
    const questionId = params.questionId;
    const body = await request.json();

    const {
      question_number,
      type,
      module,
      stem,
      marks,
      options,
      correct_answer,
      image_url,
      description,
      question_data,
      paper_id,
    } = body;

    if (!paper_id) {
      return NextResponse.json(
        { error: 'paper_id is required' },
        { status: 400 }
      );
    }

    let currentQuestion = await supabase
      .from('assessment_questions')
      .select('question_data')
      .eq('id', questionId)
      .eq('paper_id', paper_id)
      .maybeSingle();
    if (!currentQuestion.data && question_number) {
      currentQuestion = await supabase
        .from('assessment_questions')
        .select('question_data')
        .eq('question_number', question_number)
        .eq('paper_id', paper_id)
        .maybeSingle();
    }
    const existingQuestionData = currentQuestion.data?.question_data || {};
    const existingOptions = Array.isArray(existingQuestionData.options) ? existingQuestionData.options : [];
    const normalizedOptions = Array.isArray(options)
      ? options.map((option: string, index: number) => {
          const existingOption = existingOptions[index];
          return typeof existingOption === 'object' && existingOption !== null
            ? { ...existingOption, text: option }
            : { id: `option-${index + 1}`, text: option };
        })
      : existingQuestionData.options;
    const correctOptionId = normalizedOptions?.find(
      (option: any) => option.text === correct_answer
    )?.id || existingQuestionData.scoring?.correctOptionId;
    const synchronizedQuestionData = {
      ...existingQuestionData,
      stem: stem !== undefined ? stem : existingQuestionData.stem,
      type: type !== undefined ? type : existingQuestionData.type,
      maxUnits: marks !== undefined ? marks : existingQuestionData.maxUnits,
      options: normalizedOptions,
      asset: image_url
        ? { ...(existingQuestionData.asset || {}), file: image_url }
        : existingQuestionData.asset,
      scoring: {
        ...(existingQuestionData.scoring || {}),
        correctOptionId,
      },
    };
    const submittedQuestionData = question_data || {};
    const mergedScoring = {
      ...(synchronizedQuestionData.scoring || {}),
      ...(submittedQuestionData.scoring || {}),
      correctOptionId: correctOptionId || submittedQuestionData.scoring?.correctOptionId,
    };
    const mergedQuestionData = {
      ...synchronizedQuestionData,
      ...submittedQuestionData,
      stem: stem !== undefined ? stem : synchronizedQuestionData.stem,
      type: type !== undefined ? type : synchronizedQuestionData.type,
      options: normalizedOptions,
      scoring: mergedScoring,
    };
    const updateData = {
      question_number: question_number || undefined,
      type: type || undefined,
      module: module || undefined,
      stem: stem || undefined,
      marks: marks !== undefined ? marks : undefined,
      options: options || undefined,
      correct_answer: correct_answer || undefined,
      image_url: image_url || undefined,
      description: description || undefined,
      question_data: mergedQuestionData,
      updated_at: new Date().toISOString(),
    };

    let { data, error } = await supabase
      .from('assessment_questions')
      .update(updateData)
      .eq('id', questionId)
      .eq('paper_id', paper_id)
      .select()
      .maybeSingle();

    // A reseed can replace UUIDs while an admin page is still open. Recover
    // using the stable paper_id + question_number identity in that case.
    if (!error && !data && question_number) {
      ({ data, error } = await supabase
        .from('assessment_questions')
        .update(updateData)
        .eq('paper_id', paper_id)
        .eq('question_number', question_number)
        .select()
        .maybeSingle());
    }

    if (!error && !data) {
      return NextResponse.json(
        { error: 'Question was not found in this paper. Reload the page and try again.' },
        { status: 404 }
      );
    }

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { questionId: string } }
) {
  try {
    const questionId = params.questionId;
    const paperId = new URL(request.url).searchParams.get('paperId');

    if (!paperId) {
      return NextResponse.json(
        { error: 'paperId is required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('assessment_questions')
      .delete()
      .eq('id', questionId)
      .eq('paper_id', paperId);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
