import { NextRequest, NextResponse } from 'next/server';
import { supabase, getSupabaseServiceClient } from '@/lib/supabase';

// CRITICAL: Force dynamic rendering so this route is never statically cached
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Use service role client for admin operations (bypasses RLS)
function getAdminClient() {
  try {
    return getSupabaseServiceClient();
  } catch {
    // Fall back to anon client if service role key not available
    return supabase;
  }
}

// Map Supabase snake_case to camelCase for the frontend invoice page
function mapInvoiceToFrontend(inv: Record<string, unknown>) {
  const admissionFee = Number(inv.admission_fee) || 0;
  const discount = Number(inv.discount) || 0;
  const tax = Number(inv.tax) || 0;
  const subtotal = admissionFee - discount;
  const taxAmount = (subtotal * tax) / 100;
  const totalAmount = subtotal + taxAmount;
  const paidAmount = Number(inv.paid_amount) || 0;

  // Invoice date — use stored invoice_date, or fall back to created_at
  const rawDate = (inv.invoice_date as string) || (inv.created_at as string) || '';
  const invoiceDate = rawDate ? rawDate.split('T')[0] : new Date().toISOString().split('T')[0];

  // Due date — use stored due_date, or compute as invoice date + 30 days
  let dueDate = (inv.due_date as string) || '';
  if (!dueDate && invoiceDate) {
    const d = new Date(invoiceDate);
    d.setDate(d.getDate() + 30);
    dueDate = d.toISOString().split('T')[0];
  }

  return {
    invoiceNumber: inv.invoice_number || '',
    invoiceDate,
    dueDate,
    courseName: inv.course_name || '',
    courseAmount: admissionFee,
    discount,
    taxRate: tax,
    paidAmount,
    dueAmount: Math.max(0, totalAmount - paidAmount),
    notes: inv.notes || '',
    studentName: inv.student_name || '',
    status: inv.status || 'pending',
    applicationNumber: inv.application_number || '',
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getAdminClient();
    const { data: invoice, error } = await db
      .from('invoices')
      .select('*')
      .eq('application_number', params.id)
      .single();

    if (error || !invoice) {
      return NextResponse.json({
        success: false,
        message: 'Invoice not found',
        error: error?.message,
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
    const db = getAdminClient();
    
    const invoiceNumber = data.invoiceNumber || `INV-${new Date().getFullYear()}-${Date.now()}`;

    // Calculate the actual total amount properly
    const courseAmount = parseFloat(data.courseAmount) || 0;
    const discount = parseFloat(data.discount) || 0;
    const taxRate = parseFloat(data.taxRate) || 0;
    const subtotal = courseAmount - discount;
    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + taxAmount;
    const paidAmount = parseFloat(data.paidAmount) || 0;
    
    // Map frontend camelCase fields to Supabase snake_case
    const dbData: Record<string, unknown> = {
      invoice_number: invoiceNumber,
      application_number: params.id,
      student_name: data.studentName || '',
      course_name: data.courseName || null,
      admission_fee: courseAmount,
      tuition_fee: 0,
      registration_fee: 0,
      other_fees: 0,
      discount: discount,
      tax: taxRate,
      total_amount: totalAmount,
      status: paidAmount >= totalAmount && totalAmount > 0 ? 'paid' : 'pending',
      payment_method: null,
      transaction_id: null,
      notes: data.notes || null,
    };

    // Check if an invoice already exists for this application
    const { data: existing } = await db
      .from('invoices')
      .select('invoice_number')
      .eq('application_number', params.id)
      .maybeSingle();

    let result;
    if (existing) {
      // Update existing invoice
      const { data: updated, error } = await db
        .from('invoices')
        .update({ ...dbData, updated_at: new Date().toISOString() })
        .eq('application_number', params.id)
        .select();

      if (error) {
        console.error('Supabase update error:', JSON.stringify(error));
        return NextResponse.json({
          success: false,
          message: `Error updating invoice: ${error.message}`,
          error: error,
        }, { status: 500 });
      }
      result = updated;
    } else {
      // Insert new invoice
      const { data: inserted, error } = await db
        .from('invoices')
        .insert(dbData)
        .select();

      if (error) {
        console.error('Supabase insert error:', JSON.stringify(error));
        
        // If the error is about unknown columns, try with minimal fields
        if (error.message?.includes('column') || error.code === 'PGRST204') {
          console.log('Retrying with minimal fields...');
          const minimalData: Record<string, unknown> = {
            invoice_number: invoiceNumber,
            application_number: params.id,
            student_name: data.studentName || '',
            admission_fee: courseAmount,
            discount: discount,
            tax: taxRate,
            total_amount: totalAmount,
            status: 'pending',
            notes: data.notes || null,
          };
          const { data: retryInserted, error: retryError } = await db
            .from('invoices')
            .insert(minimalData)
            .select();
          
          if (retryError) {
            console.error('Retry insert error:', JSON.stringify(retryError));
            return NextResponse.json({
              success: false,
              message: `Error creating invoice: ${retryError.message}`,
              error: retryError,
            }, { status: 500 });
          }
          result = retryInserted;
        } else {
          return NextResponse.json({
            success: false,
            message: `Error creating invoice: ${error.message}`,
            error: error,
          }, { status: 500 });
        }
      } else {
        result = inserted;
      }
    }

    // Verify the invoice was actually created/updated
    if (!result || result.length === 0) {
      // The insert may have been silently blocked by RLS
      console.error('Invoice insert returned no data — possible RLS issue');
      return NextResponse.json({
        success: false,
        message: 'Invoice could not be saved. Database permissions may need to be updated. Please check Supabase RLS policies for the invoices table.',
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Invoice saved successfully', invoice: result[0] });
  } catch (error) {
    console.error('Error saving invoice:', error);
    return NextResponse.json({
      success: false,
      message: `Error saving invoice: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }, { status: 500 });
  }
}

// Handle PUT for updates from the invoice editor
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  return POST(request, { params });
}

// Handle DELETE for removing invoices
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getAdminClient();
    const { error } = await db
      .from('invoices')
      .delete()
      .eq('application_number', params.id);

    if (error) {
      console.error('Supabase delete error:', JSON.stringify(error));
      return NextResponse.json({
        success: false,
        message: `Error deleting invoice: ${error.message}`,
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    return NextResponse.json({
      success: false,
      message: 'Error deleting invoice',
    }, { status: 500 });
  }
}
