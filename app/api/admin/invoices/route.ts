import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data: invoices, error } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({
        success: false,
        message: 'Error fetching invoices',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      invoices: invoices || [],
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: 'Error fetching invoices',
    }, { status: 500 });
  }
}
