import { getSupabaseServiceClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const { status, notes } = await req.json();

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    const supabase = getSupabaseServiceClient();

    const { data, error } = await supabase
      .from('accreditation_applications')
      .update({
        status,
        notes,
        reviewed_at: new Date().toISOString(),
        reviewed_by: 'admin', // You can replace with actual admin user from auth
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
    }

    return NextResponse.json(
      { success: true, data: data?.[0] },
      { status: 200 }
    );
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const supabase = getSupabaseServiceClient();

    const { data, error } = await supabase
      .from('accreditation_applications')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
