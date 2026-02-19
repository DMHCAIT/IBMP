import { NextResponse, NextRequest } from 'next/server';
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
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching invoices',
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const invoiceData = await request.json();
    
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now()}`;
    
    const { data: invoice, error } = await supabase
      .from('invoices')
      .insert({
        invoice_number: invoiceNumber,
        application_number: invoiceData.applicationNumber || '',
        student_name: invoiceData.studentName || '',
        course_name: invoiceData.courseName || null,
        admission_fee: parseFloat(invoiceData.admissionFee) || 0,
        tuition_fee: parseFloat(invoiceData.tuitionFee) || 0,
        registration_fee: parseFloat(invoiceData.registrationFee) || 0,
        other_fees: parseFloat(invoiceData.otherFees) || 0,
        discount: parseFloat(invoiceData.discount) || 0,
        tax: parseFloat(invoiceData.tax) || 0,
        total_amount: parseFloat(invoiceData.totalAmount) || 0,
        status: invoiceData.status || 'pending',
        payment_method: invoiceData.paymentMethod || null,
        transaction_id: invoiceData.transactionId || null,
        notes: invoiceData.notes || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({
        success: false,
        message: 'Error creating invoice',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({
      success: false,
      message: 'Error creating invoice',
    }, { status: 500 });
  }
}
