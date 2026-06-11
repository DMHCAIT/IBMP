import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('invoice_number', params.id)
      .single();
    
    if (error || !invoice) {
      return NextResponse.json({
        success: false,
        message: 'Invoice not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error('Error fetching invoice:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching invoice',
    }, { status: 500 });
  }
}
