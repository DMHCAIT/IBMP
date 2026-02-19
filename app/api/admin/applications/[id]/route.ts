import { NextRequest, NextResponse } from 'next/server';
import { supabase, getSupabaseServiceClient } from '@/lib/supabase';

// CRITICAL: Force dynamic rendering so this route is never statically cached
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function getAdminClient() {
  try {
    return getSupabaseServiceClient();
  } catch {
    return supabase;
  }
}

// Map Supabase snake_case columns to camelCase for frontend
function mapApplicationToFrontend(app: Record<string, unknown>) {
  return {
    applicationNumber: app.application_number,
    fullName: app.full_name,
    emailId: app.email,
    mobileNumber: app.phone,
    phoneNumber: app.alternate_phone,
    dateOfBirth: app.dob,
    gender: app.gender,
    nationality: app.nationality,
    referralSource: app.referral_source,
    otherReferralSource: app.referral_details,
    
    // Addresses
    permanentAddress: app.permanent_address,
    permanentCity: app.permanent_city,
    permanentState: app.permanent_state,
    permanentPincode: app.permanent_pincode,
    correspondenceAddress: app.communication_address,
    communicationCity: app.communication_city,
    communicationState: app.communication_state,
    communicationPincode: app.communication_pincode,
    
    // Family
    parentName: app.father_name,
    parentOccupation: app.father_occupation,
    motherName: app.mother_name,
    motherOccupation: app.mother_occupation,
    spouseName: app.spouse_name,
    spouseOccupation: app.spouse_occupation,
    
    // Course
    courseType: app.course_type,
    courseName: app.course_name,
    specialization: app.specialization,
    
    // 10th
    school10th: app.tenth_school,
    year10th: app.tenth_year,
    percentage10th: app.tenth_percentage,
    tenthBoard: app.tenth_board,
    
    // 12th
    school12th: app.twelfth_school,
    year12th: app.twelfth_year,
    percentage12th: app.twelfth_percentage,
    twelfthBoard: app.twelfth_board,
    
    // UG
    collegeUG: app.ug_college,
    yearUG: app.ug_year,
    percentageUG: app.ug_percentage,
    ugDegree: app.ug_degree,
    ugUniversity: app.ug_university,
    
    // PG
    collegePG: app.pg_college,
    yearPG: app.pg_year,
    percentagePG: app.pg_percentage,
    pgDegree: app.pg_degree,
    pgUniversity: app.pg_university,
    
    // Payment
    paymentOption: app.payment_method,
    transactionId: app.transaction_id,
    
    // Documents & status
    files: app.documents,
    declaration: app.declaration,
    status: app.status,
    submittedAt: app.created_at,
    updatedAt: app.updated_at,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const db = getAdminClient();
    const { data: application, error } = await db
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
      application: mapApplicationToFrontend(application),
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({
      success: false,
      message: 'Application not found',
    }, { status: 404 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    
    const status = body.status;
    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({
        success: false,
        message: 'Invalid status',
      }, { status: 400 });
    }

    const db = getAdminClient();
    const { error } = await db
      .from('applications')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('application_number', params.id);

    if (error) {
      console.error('Supabase update error:', error);
      return NextResponse.json({
        success: false,
        message: 'Error updating application',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json({
      success: false,
      message: 'Error updating application',
    }, { status: 500 });
  }
}
