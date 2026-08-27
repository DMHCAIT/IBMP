import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

function db() {
  return getSupabaseServiceClient();
}

// PUT update an organization accreditation record
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const {
      organization_name,
      accreditation_title,
      accreditation_number,
      date_of_accreditation,
      validity_period,
      status,
    } = body;

    if (
      !organization_name?.trim() ||
      !accreditation_title?.trim() ||
      !accreditation_number?.trim() ||
      !date_of_accreditation?.trim()
    ) {
      return NextResponse.json(
        { success: false, message: 'Organization name, title, accreditation number, and date are required.' },
        { status: 400 }
      );
    }

    const { data, error } = await db()
      .from('organization_accreditations')
      .update({
        organization_name: organization_name.trim(),
        accreditation_title: accreditation_title.trim(),
        accreditation_number: accreditation_number.trim(),
        date_of_accreditation: date_of_accreditation.trim(),
        validity_period: validity_period?.trim() || null,
        status: status || 'Active',
        updated_at: new Date().toISOString(),
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { success: false, message: `Accreditation number "${accreditation_number}" already exists.` },
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

// DELETE an organization accreditation record
export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await db()
      .from('organization_accreditations')
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
