import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function db() {
  return getSupabaseServiceClient();
}

// GET all organization accreditation records
export async function GET() {
  try {
    const { data, error } = await db()
      .from('organization_accreditations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, records: data || [] });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

// POST create a new organization accreditation record
export async function POST(request: NextRequest) {
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
      .insert({
        organization_name: organization_name.trim(),
        accreditation_title: accreditation_title.trim(),
        accreditation_number: accreditation_number.trim(),
        date_of_accreditation: date_of_accreditation.trim(),
        validity_period: validity_period?.trim() || null,
        status: status || 'Active',
      })
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
