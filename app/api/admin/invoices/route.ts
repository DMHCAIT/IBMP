import { NextResponse } from 'next/server';
import { supabase, getSupabaseServiceClient } from '@/lib/supabase';

// Use service role client for admin operations (bypasses RLS)
function getAdminClient() {
  try {
    return getSupabaseServiceClient();
  } catch {
    return supabase;
  }
}

export async function GET() {
  try {
    const db = getAdminClient();
    const { data: invoices, error } = await db
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', JSON.stringify(error));
      return NextResponse.json({
        success: false,
        message: `Error fetching invoices: ${error.message}`,
      }, { status: 500 });
    }

    // Map to frontend expected format
    const mapped = (invoices || []).map(inv => {
      const admissionFee = Number(inv.admission_fee) || 0;
      const discount = Number(inv.discount) || 0;
      const tax = Number(inv.tax) || 0;
      const subtotal = admissionFee - discount;
      const taxAmount = (subtotal * tax) / 100;
      const totalAmount = subtotal + taxAmount;
      const paidAmount = Number(inv.paid_amount) || 0;

      return {
        applicationId: inv.application_number,
        invoiceNumber: inv.invoice_number,
        invoiceDate: inv.invoice_date || inv.created_at,
        courseName: inv.course_name || '',
        studentName: inv.student_name || '',
        totalAmount,
        paidAmount,
        dueAmount: Math.max(0, totalAmount - paidAmount),
      };
    });

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
