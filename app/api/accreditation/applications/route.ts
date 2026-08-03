import { getSupabaseServiceClient } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Extract form fields
    const applicationData = {
      application_type: formData.get('applicationType') as string,
      organization_name: formData.get('organizationName') as string,
      address: formData.get('address') as string,
      contact_number: formData.get('contactNumber') as string,
      mobile: formData.get('mobile') as string,
      email: formData.get('email') as string,
      website: formData.get('website') as string || null,
      proprietor_name: formData.get('proprietorName') as string,
      proprietor_address: formData.get('proprietorAddress') as string,
      proprietor_pin: formData.get('proprietorPin') as string,
      proprietor_mobile: formData.get('proprietorMobile') as string,
      courses_submitted: formData.get('coursesSubmitted') as string,
      org_types: formData.get('orgTypes') as string || '[]',
      photo_id: formData.get('photoId') as string,
      status: 'pending',
    };

    // Validate required fields
    const requiredFields = [
      'application_type',
      'organization_name',
      'address',
      'contact_number',
      'mobile',
      'email',
      'proprietor_name',
      'proprietor_address',
      'proprietor_pin',
      'proprietor_mobile',
      'courses_submitted',
    ];

    for (const field of requiredFields) {
      if (!applicationData[field as keyof typeof applicationData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Get service client for database operations
    const supabase = getSupabaseServiceClient();

    // Insert application data
    const { data, error } = await supabase
      .from('accreditation_applications')
      .insert([applicationData])
      .select();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to submit application: ' + error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully',
        applicationId: data?.[0]?.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseServiceClient();

    // Fetch all accreditation applications
    const { data, error } = await supabase
      .from('accreditation_applications')
      .select('*')
      .order('submitted_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
