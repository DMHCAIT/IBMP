import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase credentials');
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

// GET: Get single paper with stats
export async function GET(
  request: NextRequest,
  { params }: { params: { paperId: string } }
) {
  try {
    const paperId = params.paperId;

    // Get paper details
    const { data: paper, error: paperError } = await supabase
      .from('assessment_exam_papers')
      .select('*')
      .eq('id', paperId)
      .single();

    if (paperError) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }

    // Get question count
    const { count: questionCount, error: _questionsError } = await supabase
      .from('assessment_questions')
      .select('*', { count: 'exact' })
      .eq('paper_id', paperId);

    // Get attempt count
    const { count: attemptCount, error: _attemptsError } = await supabase
      .from('assessment_attempts')
      .select('*', { count: 'exact' })
      .eq('paper_id', paperId);

    // Get candidate count
    const { count: candidateCount, error: _candidatesError } = await supabase
      .from('assessment_candidates')
      .select('*', { count: 'exact' })
      .eq('paper_id', paperId);

    return NextResponse.json({
      paper,
      stats: {
        questionCount: questionCount || 0,
        attemptCount: attemptCount || 0,
        candidateCount: candidateCount || 0,
      }
    });

  } catch (err: unknown) {
    console.error('Error fetching paper:', err);
    return NextResponse.json(
      { error: 'Failed to fetch paper' },
      { status: 500 }
    );
  }
}

// PUT: Update paper
export async function PUT(
  request: NextRequest,
  { params }: { params: { paperId: string } }
) {
  try {
    const paperId = params.paperId;
    const body = await request.json();
    const { name, description, duration_minutes, total_marks, passing_marks, exam_type, is_active, max_attempts } = body;

    // Calculate passing percentage if marks are provided
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (name) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (duration_minutes) updateData.duration_minutes = duration_minutes;
    if (total_marks) updateData.total_marks = total_marks;
    if (passing_marks) updateData.passing_marks = passing_marks;
    if (exam_type) updateData.exam_type = exam_type;
    if (is_active !== undefined) updateData.is_active = is_active;
    if (max_attempts) updateData.max_attempts = max_attempts;

    // Calculate passing percentage if total_marks is provided
    if (total_marks && passing_marks) {
      updateData.passing_percentage = (passing_marks / total_marks) * 100;
    }

    const { data, error } = await supabase
      .from('assessment_exam_papers')
      .update(updateData)
      .eq('id', paperId)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update paper' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Paper updated successfully',
      paper: data
    });

  } catch (err: unknown) {
    console.error('Error updating paper:', err);
    return NextResponse.json(
      { error: 'Failed to update paper' },
      { status: 500 }
    );
  }
}

// DELETE: Delete paper
export async function DELETE(
  request: NextRequest,
  { params }: { params: { paperId: string } }
) {
  try {
    const paperId = params.paperId;

    // Check if paper has any attempts
    const { count: attemptCount } = await supabase
      .from('assessment_attempts')
      .select('*', { count: 'exact' })
      .eq('paper_id', paperId);

    if (attemptCount && attemptCount > 0) {
      return NextResponse.json(
        { error: `Cannot delete paper with ${attemptCount} attempt(s). Archive instead.` },
        { status: 400 }
      );
    }

    // Delete questions associated with this paper
    await supabase
      .from('assessment_questions')
      .delete()
      .eq('paper_id', paperId);

    // Delete candidates assigned to this paper
    await supabase
      .from('assessment_candidates')
      .update({ paper_id: null })
      .eq('paper_id', paperId);

    // Delete the paper
    const { error } = await supabase
      .from('assessment_exam_papers')
      .delete()
      .eq('id', paperId);

    if (error) {
      return NextResponse.json(
        { error: 'Failed to delete paper' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Paper deleted successfully'
    });

  } catch (err: unknown) {
    console.error('Error deleting paper:', err);
    return NextResponse.json(
      { error: 'Failed to delete paper' },
      { status: 500 }
    );
  }
}
