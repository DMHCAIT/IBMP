import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Map Supabase snake_case to camelCase for the frontend invoice page
function mapInvoiceToFrontend(inv: Record<string, unknown>) {
  return {
    invoiceNumber: inv.invoice_number,
    invoiceDate: inv.created_at ? (inv.created_at as string).split('T')[0] : '',
    dueDate: '', // Not stored in DB, frontend can compute
    courseName: inv.course_name,
    courseAmount: Number(inv.admission_fee) || 0,
    discount: Number(inv.discount) || 0,
    taxRate: Number(inv.tax) || 0,
    paidAmount: 0, // Calculate from status
    dueAmount: Number(inv.total_amount) || 0,
    notes: inv.notes || '',
    studentName: inv.student_name,
    status: inv.status,
    applicationNumber: inv.application_number,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: invoice, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('application_number', params.id)
      .single();

    if (error || !invoice) {
      return NextResponse.json({
        success: false,
        message: 'Invoice not found',
      });
    }

    return NextResponse.json({
      success: true,
      invoice: mapInvoiceToFrontend(invoice),
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
    const data = await request.json();
    
    const invoiceNumber = data.invoiceNumber || `INV-${new Date().getFullYear()}-${Date.now()}`;
    
    // Map frontend camelCase fields to Supabase snake_case
    const dbData = {
      invoice_number: invoiceNumber,
      application_number: params.id,
      student_name: data.studentName || '',
      course_name: data.courseName || null,
      admission_fee: parseFloat(data.courseAmount) || 0,
      tuition_fee: 0,
      registration_fee: 0,
      other_fees: 0,
      discount: parseFloat(data.discount) || 0,
      tax: parseFloat(data.taxRate) || 0,
      total_amount: parseFloat(data.dueAmount) || 0,
      status: 'pending',
      payment_method: null,
      transaction_id: null,
      notes: data.notes || null,
    };

    // Check if an invoice already exists for this application
    const { data: existing } = await supabase
      .from('invoices')
      .select('id')
      .eq('application_number', params.id)
      .single();

    if (existing) {
      const { error } = await supabase
        .from('invoices')
        .update({ ...dbData, updated_at: new Date().toISOString() })
        .eq('application_number', params.id);

      if (error) {
        console.error('Supabase update error:', error);
        return NextResponse.json({ success: false, message: 'Error updating invoice' }, { status: 500 });
      }
    } else {
      const { error } = await supabase.from('invoices').insert(dbData);

      if (error) {
        console.error('Supabase insert error:', error);
        return NextResponse.json({ success: false, message: 'Error creating invoice' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, message: 'Invoice saved successfully' });
  } catch (error) {
    console.error('Error saving invoice:', error);
    return NextResponse.json({ success: false, message: 'Error saving invoice' }, { status: 500 });
  }
}

// Also handle PUT for updates from the invoice editor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return POST(request, { params });
}
