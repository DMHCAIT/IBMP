import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data: application, error } = await supabase
      .from('applications')
      .select('*')
      .eq('application_number', params.id)
      .single();
    
    if (error || !application) {
      return NextResponse.json({
        success: false,
        message: 'Application not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({
      success: false,
      message: 'Error fetching application',
    }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updates = await request.json();
    
    const { data: application, error } = await supabase
      .from('applications')
      .update(updates)
      .eq('application_number', params.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({
        success: false,
        message: 'Error updating application',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      application,
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({
      success: false,
      message: 'Error updating application',
    }, { status: 500 });
  }
}
