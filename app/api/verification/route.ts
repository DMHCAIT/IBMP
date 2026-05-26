import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim();

  if (!query || query.length < 2) {
    return NextResponse.json(
      { success: false, message: 'Please enter at least 2 characters to search.' },
      { status: 400 }
    );
  }

  try {
    const db = getSupabaseServiceClient();

    // Search by certification_id OR full_name (case-insensitive)
    const { data, error } = await db
      .from('verification_records')
      .select('certification_id, full_name, fellowship_title, award_month_year, status')
      .or(`certification_id.ilike.%${query}%,full_name.ilike.%${query}%`)
      .limit(10);

    if (error) {
      console.error('[Verification] Supabase error:', error);
      return NextResponse.json(
        { success: false, message: 'Error searching records. Please try again.' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ success: true, results: [], found: false });
    }

    const results = data.map((rec) => ({
      certificationId: rec.certification_id,
      fullName: rec.full_name,
      fellowshipTitle: rec.fellowship_title,
      awardMonthYear: rec.award_month_year,
      status: rec.status,
    }));

    return NextResponse.json({ success: true, results, found: true });
  } catch (err) {
    console.error('[Verification] Unexpected error:', err);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
