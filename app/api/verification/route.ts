import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function mapRecord(record: Record<string, unknown>) {
  return {
    board: record.board_name,
    certificationId: record.certification_id,
    fullName: record.full_name,
    fellowshipAwardedTitle: record.fellowship_awarded_title,
    monthsYearOfAward: record.award_month_year,
    currentStatus: record.current_status,
  };
}

export async function GET(request: NextRequest) {
  try {
    const certificationId = request.nextUrl.searchParams.get('certificationId')?.trim() || '';

    if (!certificationId) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please enter a Certification ID.',
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('verification_registry')
      .select('*')
      .ilike('certification_id', certificationId)
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to verify record: ${error.message}`,
        },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: 'No record found for this Certification ID.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      record: mapRecord(data),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: `Unexpected server error: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 500 }
    );
  }
}
