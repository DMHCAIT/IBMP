import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function db() {
  return getSupabaseServiceClient();
}

// GET all verification records
export async function GET() {
  try {
    const { data, error } = await db()
      .from('verification_records')
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

// POST create a new verification record
export async function POST(request: NextRequest) {
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
      .insert({
        certification_id: certification_id.trim(),
        full_name: full_name.trim(),
        fellowship_title: fellowship_title.trim(),
        award_month_year: award_month_year.trim(),
        status: status || 'Active',
      })
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
