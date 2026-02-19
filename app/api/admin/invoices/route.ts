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

    // Map to frontend expected format
    const mapped = (invoices || []).map(inv => ({
      applicationId: inv.application_number,
      invoiceNumber: inv.invoice_number,
      invoiceDate: inv.created_at,
      courseName: inv.course_name,
      studentName: inv.student_name,
      totalAmount: Number(inv.total_amount) || 0,
      paidAmount: 0,
      dueAmount: Number(inv.total_amount) || 0,
    }));

    return NextResponse.json({
      success: true,
      invoices: mapped,
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: 'Error fetching invoices',
    }, { status: 500 });
  }
}
