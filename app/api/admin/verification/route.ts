import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient, supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type VerificationPayload = {
  board?: string;
  certificationId?: string;
  fullName?: string;
  fellowshipAwardedTitle?: string;
  monthsYearOfAward?: string;
  currentStatus?: string;
};

function getAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!serviceRoleKey || serviceRoleKey === 'REPLACE_WITH_YOUR_ACTUAL_SERVICE_ROLE_KEY') {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is missing. Configure it in deployment environment variables.');
  }

  try {
    return getSupabaseServiceClient();
  } catch {
    return supabase;
  }
}

function normalizeStatus(status: string | undefined) {
  const normalized = (status || 'Active').trim().toLowerCase();
  return normalized === 'inactive' ? 'Inactive' : 'Active';
}

function normalizeRecord(record: VerificationPayload) {
  return {
    board_name: (record.board || 'FIBMP').trim(),
    certification_id: (record.certificationId || '').trim(),
    full_name: (record.fullName || '').trim(),
    fellowship_awarded_title: (record.fellowshipAwardedTitle || '').trim(),
    award_month_year: (record.monthsYearOfAward || '').trim(),
    current_status: normalizeStatus(record.currentStatus),
  };
}

function mapRecord(record: Record<string, unknown>) {
  return {
    id: record.id,
    board: record.board_name,
    certificationId: record.certification_id,
    fullName: record.full_name,
    fellowshipAwardedTitle: record.fellowship_awarded_title,
    monthsYearOfAward: record.award_month_year,
    currentStatus: record.current_status,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

function validateRecord(record: ReturnType<typeof normalizeRecord>) {
  const missingFields: string[] = [];
  if (!record.certification_id) missingFields.push('certificationId');
  if (!record.full_name) missingFields.push('fullName');
  if (!record.fellowship_awarded_title) missingFields.push('fellowshipAwardedTitle');
  if (!record.award_month_year) missingFields.push('monthsYearOfAward');
  if (!record.current_status) missingFields.push('currentStatus');
  return missingFields;
}

export async function GET() {
  try {
    const db = getAdminClient();
    const { data, error } = await db
      .from('verification_registry')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Admin Verification] Fetch error:', error);
      return NextResponse.json(
        {
          success: false,
          message: `Failed to load verification records: ${error.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      records: (data || []).map(mapRecord),
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const incomingRecords: VerificationPayload[] = Array.isArray(body?.records)
      ? (body.records as VerificationPayload[])
      : body?.record
        ? [body.record as VerificationPayload]
        : [];

    if (incomingRecords.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Please provide at least one verification record.',
        },
        { status: 400 }
      );
    }

    const normalizedRecords = incomingRecords.map((record: VerificationPayload) => normalizeRecord(record));
    const invalidRecord = normalizedRecords.find((record: ReturnType<typeof normalizeRecord>) => validateRecord(record).length > 0);

    if (invalidRecord) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${validateRecord(invalidRecord).join(', ')}`,
        },
        { status: 400 }
      );
    }

    const db = getAdminClient();
    const { data, error } = await db
      .from('verification_registry')
      .upsert(normalizedRecords, { onConflict: 'certification_id' })
      .select('*');

    if (error) {
      console.error('[Admin Verification] Upsert error:', error);
      return NextResponse.json(
        {
          success: false,
          message: `Failed to save verification records: ${error.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `${normalizedRecords.length} verification record(s) saved successfully.`,
      records: (data || []).map(mapRecord),
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
