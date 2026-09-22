import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const questionNumber = searchParams.get('questionNumber');
    const questionId = searchParams.get('questionId');

    let query = supabase
      .from('assessment_questions')
      .select('*')
      .order('sort_order', { ascending: true });

    if (questionId) {
      query = query.eq('id', questionId);
    } else if (questionNumber) {
      query = query.eq('question_number', questionNumber);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    // Return database questions as-is (no fallback to seed data)
    return NextResponse.json(data || []);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Validate required fields
    if (!question_number || !stem) {
      return NextResponse.json(
        { error: 'Question number and stem are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('assessment_questions')
      .insert([
        {
          question_number,
          type: type || 'mcq',
          module: module || 'Module 1',
          stem,
          marks: marks || 1,
          options: options && options.length > 0 ? options : null,
          correct_answer: correct_answer || null,
          image_url: image_url || null,
          description: description || null,
          question_data: question_data || null,
          sort_order: parseInt(question_number.replace(/\D/g, '')) || 0,
          paper_id: paper_id || null,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    // Handle question_data - keep as is (should be object/JSONB)
    // Supabase will automatically convert to JSONB

    const { data, error } = await supabase
      .from('assessment_questions')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data[0]);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    // Delete associated images first
    await supabase
      .from('assessment_question_images')
      .delete()
      .eq('question_id', id);

    const { error } = await supabase
      .from('assessment_questions')
      .delete()
      .eq('id', id);

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
