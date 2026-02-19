import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try to find by application_number (since admin panel passes application ID)
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('application_number', params.id)
      .single();

    if (error || !invoice) {
      // Invoice doesn't exist yet for this application
      return NextResponse.json({
        success: false,
        message: 'Invoice not found',
      });
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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceData = await request.json();
    
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Date.now()}`;

    // First, check if an invoice already exists for this application
    const { data: existing } = await supabase
      .from('invoices')
      .select('id')
      .eq('application_number', params.id)
      .single();

    if (existing) {
      // Update existing invoice
      const { error } = await supabase
        .from('invoices')
        .update({
          student_name: invoiceData.studentName || invoiceData.student_name || '',
          course_name: invoiceData.courseName || invoiceData.course_name || null,
          admission_fee: parseFloat(invoiceData.admissionFee || invoiceData.admission_fee || invoiceData.courseAmount) || 0,
          tuition_fee: parseFloat(invoiceData.tuitionFee || invoiceData.tuition_fee) || 0,
          registration_fee: parseFloat(invoiceData.registrationFee || invoiceData.registration_fee) || 0,
          other_fees: parseFloat(invoiceData.otherFees || invoiceData.other_fees) || 0,
          discount: parseFloat(invoiceData.discount) || 0,
          tax: parseFloat(invoiceData.tax || invoiceData.taxRate) || 0,
          total_amount: parseFloat(invoiceData.totalAmount || invoiceData.total_amount) || 0,
          status: invoiceData.status || 'pending',
          payment_method: invoiceData.paymentMethod || invoiceData.payment_method || null,
          transaction_id: invoiceData.transactionId || invoiceData.transaction_id || null,
          notes: invoiceData.notes || null,
          updated_at: new Date().toISOString(),
        })
        .eq('application_number', params.id);

      if (error) {
        console.error('Supabase update error:', error);
        return NextResponse.json({
          success: false,
          message: 'Error updating invoice',
        }, { status: 500 });
      }
    } else {
      // Create new invoice
      const { error } = await supabase.from('invoices').insert({
        invoice_number: invoiceData.invoiceNumber || invoiceNumber,
        application_number: params.id,
        student_name: invoiceData.studentName || invoiceData.student_name || '',
        course_name: invoiceData.courseName || invoiceData.course_name || null,
        admission_fee: parseFloat(invoiceData.admissionFee || invoiceData.admission_fee || invoiceData.courseAmount) || 0,
        tuition_fee: parseFloat(invoiceData.tuitionFee || invoiceData.tuition_fee) || 0,
        registration_fee: parseFloat(invoiceData.registrationFee || invoiceData.registration_fee) || 0,
        other_fees: parseFloat(invoiceData.otherFees || invoiceData.other_fees) || 0,
        discount: parseFloat(invoiceData.discount) || 0,
        tax: parseFloat(invoiceData.tax || invoiceData.taxRate) || 0,
        total_amount: parseFloat(invoiceData.totalAmount || invoiceData.total_amount) || 0,
        status: invoiceData.status || 'pending',
        payment_method: invoiceData.paymentMethod || invoiceData.payment_method || null,
        transaction_id: invoiceData.transactionId || invoiceData.transaction_id || null,
        notes: invoiceData.notes || null,
      });

      if (error) {
        console.error('Supabase insert error:', error);
        return NextResponse.json({
          success: false,
          message: 'Error creating invoice',
        }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Invoice saved successfully',
    });
  } catch (error) {
    console.error('Error saving invoice:', error);
    return NextResponse.json({
      success: false,
      message: 'Error saving invoice',
    }, { status: 500 });
  }
}
