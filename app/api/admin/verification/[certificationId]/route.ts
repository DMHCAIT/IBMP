import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient, supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { certificationId: string } }
) {
  try {
    const certificationId = decodeURIComponent(params.certificationId || '').trim();
    if (!certificationId) {
      return NextResponse.json(
        { success: false, message: 'certificationId is required.' },
        { status: 400 }
      );
    }

    const db = getAdminClient();
    const { error } = await db
      .from('verification_registry')
      .delete()
      .eq('certification_id', certificationId);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to delete record: ${error.message}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Record deleted successfully.',
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
