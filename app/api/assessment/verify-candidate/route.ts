import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

/**
 * POST /api/assessment/verify-candidate
 * Verifies candidate credentials and checks if they can start assessment
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { enrollmentId, password } = body;

    if (!enrollmentId || !password) {
      return NextResponse.json(
        { success: false, message: 'Enrollment ID and password are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    // Step 1: Find candidate by enrollment ID
    const { data: candidate, error: candidateError } = await supabase
      .from('assessment_candidates')
      .select('*')
      .eq('enrollment_id', enrollmentId)
      .single();

    if (candidateError || !candidate) {
      return NextResponse.json(
        { success: false, message: 'Invalid enrollment ID or password' },
        { status: 401 }
      );
    }

    // Step 2: Verify password
    if (candidate.password !== password) {
      return NextResponse.json(
        { success: false, message: 'Invalid enrollment ID or password' },
        { status: 401 }
      );
    }

    // Step 3: Check if candidate already has an active/completed attempt
    const { data: attempts, error: attemptsError } = await supabase
      .from('assessment_attempts')
      .select('id, status, submitted_at')
      .eq('candidate_id', candidate.id)
      .order('created_at', { ascending: false });

    if (!attemptsError && attempts && attempts.length > 0) {
      const lastAttempt = attempts[0];
      // If there's an in-progress or completed attempt, deny access
      if (lastAttempt.status === 'in-progress' || lastAttempt.status === 'completed') {
        return NextResponse.json(
          {
            success: false,
            message: 'Assessment attempt limit reached. You have already started this assessment.',
            limited: true,
            hasAttempt: true,
            attempt: lastAttempt,
          },
          { status: 403 }
        );
      }
    }

    // Step 4: Create new assessment attempt
    const { data: newAttempt, error: attemptError } = await supabase
      .from('assessment_attempts')
      .insert({
        candidate_id: candidate.id,
        enrollment_id: candidate.enrollment_id,
        status: 'in-progress',
      })
      .select()
      .single();

    if (attemptError || !newAttempt) {
      return NextResponse.json(
        { success: false, message: 'Failed to start assessment' },
        { status: 500 }
      );
    }

    // Success - return candidate and attempt info
    return NextResponse.json(
      {
        success: true,
        message: 'Candidate verified successfully',
        candidate: {
          id: candidate.id,
          fullName: candidate.full_name,
          enrollmentId: candidate.enrollment_id,
          examType: candidate.exam_type,
        },
        attempt: {
          id: newAttempt.id,
          startedAt: newAttempt.started_at,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Candidate verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
