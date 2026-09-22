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

// Resolve the canonical slug and tolerate older URLs that omitted stop words
// such as "and" from a paper name.
async function getPaperIdBySlug(slug: string): Promise<string | null> {
  const { data } = await supabase
    .from('assessment_exam_papers')
    .select('id')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (data?.id) return data.id;

  const compactSlug = slug.replace(/-(and|the|of)-/g, '-');
  const { data: papers } = await supabase
    .from('assessment_exam_papers')
    .select('id, slug')
    .eq('is_active', true);

  return papers?.find((paper) => paper.slug.replace(/-(and|the|of)-/g, '-') === compactSlug)?.id || null;
}

export async function POST(
  request: NextRequest,
  { params }: { params: { paperSlug: string } }
) {
  try {
    const paperSlug = params.paperSlug;
    const { fullName, enrollmentId, password } = await request.json();
    const normalizedName = String(fullName || '').trim();
    const normalizedEnrollmentId = String(enrollmentId || '').trim();

    // Validate input
    if (!normalizedName || !normalizedEnrollmentId || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: fullName, enrollmentId, password' },
        { status: 400 }
      );
    }

    // Get paper ID from slug
    const paperId = await getPaperIdBySlug(paperSlug);
    if (!paperId) {
      return NextResponse.json(
        { error: `Paper not found: ${paperSlug}` },
        { status: 404 }
      );
    }

    // Verify candidate exists and has access to this paper
    const { data: candidate, error: candidateError } = await supabase
      .from('assessment_candidates')
      .select('id, full_name, enrollment_id, password, paper_id')
      .eq('enrollment_id', normalizedEnrollmentId)
      .eq('paper_id', paperId)
      .eq('status', 'active')
      .single();

    if (candidateError || !candidate) {
      return NextResponse.json(
        { error: 'Candidate not found or does not have access to this paper' },
        { status: 401 }
      );
    }

    // Verify password
    if (candidate.password !== password) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Verify name
    if (candidate.full_name.trim().toLowerCase() !== normalizedName.toLowerCase()) {
      return NextResponse.json(
        { error: 'Name does not match' },
        { status: 401 }
      );
    }

    // Check if candidate has already attempted this paper
    const { data: existingAttempt, error: attemptError } = await supabase
      .from('assessment_attempts')
      .select('id, status')
      .eq('candidate_id', candidate.id)
      .eq('paper_id', paperId)
      .maybeSingle();

    if (attemptError) {
      console.error('Error checking existing attempt:', attemptError);
      return NextResponse.json(
        { error: 'Unable to verify whether an attempt already exists' },
        { status: 500 }
      );
    }

    if (existingAttempt && existingAttempt.status !== 'in-progress') {
      return NextResponse.json(
        {
          error: existingAttempt.status === 'submitted'
            ? 'You have already completed this assessment. Only one attempt is allowed per paper.'
            : 'You already have an attempt for this paper. Only one attempt is allowed per paper.',
          attemptId: existingAttempt.id,
          attemptStatus: existingAttempt.status,
        },
        { status: 403 }
      );
    }

    // Get paper settings
    const { data: paper, error: paperError } = await supabase
      .from('assessment_exam_papers')
      .select('*')
      .eq('id', paperId)
      .single();

    if (paperError || !paper) {
      return NextResponse.json(
        { error: 'Paper configuration not found' },
        { status: 500 }
      );
    }

    // Create or update attempt
    let attemptId = existingAttempt?.id;
    
    if (!existingAttempt) {
      const { data: newAttempt, error: insertError } = await supabase
        .from('assessment_attempts')
        .insert({
          candidate_id: candidate.id,
          enrollment_id: normalizedEnrollmentId,
          paper_id: paperId,
          status: 'in-progress',
          passing_score: paper.passing_marks,
        })
        .select()
        .single();

      if (insertError) {
        if (insertError.code === '23505') {
          return NextResponse.json(
            { error: 'Only one attempt is allowed per candidate for this paper.' },
            { status: 403 }
          );
        }
        return NextResponse.json(
          { error: 'Failed to create attempt' },
          { status: 500 }
        );
      }

      attemptId = newAttempt.id;
    } else {
      attemptId = existingAttempt.id;
    }

    return NextResponse.json({
      success: true,
      candidateInfo: {
        id: candidate.id,
        fullName: candidate.full_name,
        enrollmentId: candidate.enrollment_id,
      },
      attemptId,
      paper: {
        id: paper.id,
        name: paper.name,
        slug: paper.slug,
        durationMinutes: paper.duration_minutes,
        totalQuestions: paper.total_questions,
        totalMarks: paper.total_marks,
        passingMarks: paper.passing_marks,
      }
    });

  } catch (err: unknown) {
    console.error('Error verifying candidate:', err);
    return NextResponse.json(
      { error: 'Failed to verify candidate' },
      { status: 500 }
    );
  }
}
