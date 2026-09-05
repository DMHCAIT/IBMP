import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

/**
 * GET /api/admin/assessment/candidates
 * Lists all assessment candidates or gets a single candidate by id
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServiceClient();
    const id = request.nextUrl.searchParams.get('id');

    // If id is provided, get single candidate
    if (id) {
      const { data: candidate, error } = await supabase
        .from('assessment_candidates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return NextResponse.json(
            { success: false, message: 'Candidate not found' },
            { status: 404 }
          );
        }
        throw error;
      }

      return NextResponse.json(
        {
          success: true,
          candidate,
        },
        { status: 200 }
      );
    }

    // Otherwise, get all candidates
    const { data: candidates, error } = await supabase
      .from('assessment_candidates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        candidates: candidates || [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch candidates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/assessment/candidates
 * Creates a new assessment candidate
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, enrollmentId, password, email, phone, examType } = body;

    // Validation
    if (!fullName || !enrollmentId || !password) {
      return NextResponse.json(
        { success: false, message: 'Full name, enrollment ID, and password are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    // Check if enrollment ID already exists
    const { data: existing } = await supabase
      .from('assessment_candidates')
      .select('id')
      .eq('enrollment_id', enrollmentId)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, message: 'Enrollment ID already exists' },
        { status: 409 }
      );
    }

    // Create new candidate
    const { data: newCandidate, error } = await supabase
      .from('assessment_candidates')
      .insert({
        full_name: fullName,
        enrollment_id: enrollmentId,
        password,
        email,
        phone,
        exam_type: examType || 'Pain Medicine (Set A)',
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Candidate created successfully',
        candidate: newCandidate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating candidate:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create candidate' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/assessment/candidates?id=...
 * Updates a candidate's information
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = request.nextUrl.searchParams.get('id');
    const { fullName, enrollmentId, password, email, phone, examType, status } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Candidate ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    const updateData: Record<string, any> = {};
    if (fullName) updateData.full_name = fullName;
    if (enrollmentId) updateData.enrollment_id = enrollmentId;
    if (password) updateData.password = password;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (examType) updateData.exam_type = examType;
    if (status) updateData.status = status;
    updateData.updated_at = new Date().toISOString();

    const { data: updated, error } = await supabase
      .from('assessment_candidates')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Candidate updated successfully',
        candidate: updated,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating candidate:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update candidate' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/assessment/candidates?id=...
 * Deletes a candidate
 */
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Candidate ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServiceClient();

    const { error } = await supabase
      .from('assessment_candidates')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { success: true, message: 'Candidate deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete candidate' },
      { status: 500 }
    );
  }
}
