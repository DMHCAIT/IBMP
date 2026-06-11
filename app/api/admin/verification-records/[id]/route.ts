import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function db() {
  return getSupabaseServiceClient();
}

// PUT update a verification record
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { certification_id, full_name, fellowship_title, award_month_year, status } = body;

    if (!certification_id?.trim() || !full_name?.trim() || !fellowship_title?.trim() || !award_month_year?.trim()) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await db()
      .from('verification_records')
      .update({
        certification_id: certification_id.trim(),
        full_name: full_name.trim(),
        fellowship_title: fellowship_title.trim(),
        award_month_year: award_month_year.trim(),
        status: status || 'Active',
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, message: `Certification ID "${certification_id}" already exists.` },
          { status: 409 }
        );
      }
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, record: data });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// DELETE a verification record
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await db()
      .from('verification_records')
      .delete()
      .eq('id', params.id);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
