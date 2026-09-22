import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { persistSession: false } }
);

export async function GET(
  request: NextRequest,
  { params }: { params: { paperId: string } }
) {
  try {
    // Get candidates for this paper
    const { data: candidates, error } = await supabase
      .from('assessment_candidates')
      .select('*')
      .eq('paper_id', params.paperId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      success: true,
      candidates: candidates || [],
    });
  } catch (error: any) {
    console.error('Error fetching paper candidates:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch candidates',
      },
      { status: 500 }
    );
  }
}
