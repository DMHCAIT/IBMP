import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    // Extract form fields
    const data: Record<string, string> = {};
    const files: Record<string, string> = {};
    
    formData.forEach((value, key) => {
      if (value instanceof File && value.size > 0) {
        files[key] = value.name;
      } else if (typeof value === 'string') {
        data[key] = value;
      }
    });

    // Validate required fields
    const requiredFields = ['fullName', 'emailId', 'mobileNumber', 'courseName', 'courseType'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.emailId)) {
      return NextResponse.json({
        success: false,
        message: 'Please provide a valid email address.',
      }, { status: 400 });
    }

    // Generate application number
    const applicationNumber = `IBMP-${new Date().getFullYear()}-${Date.now()}`;

    // Insert directly into Supabase — using actual snake_case column names
    const { error } = await supabase.from('applications').insert({
      application_number: applicationNumber,
      status: 'pending',
      
      // Personal Information
      full_name: data.fullName || '',
      dob: data.dob || null,
      gender: data.gender || null,
      nationality: data.nationality || null,
      
      // Referral
      referral_source: data.referralSource || null,
      referral_details: data.referralDetails || data.otherReferralSource || null,
      
      // Contact Information
      email: data.emailId || data.email || '',
      phone: data.mobileNumber || data.phone || '',
      alternate_phone: data.alternatePhone || data.phoneNumber || null,
      
      // Permanent Address
      permanent_address: data.permanentAddress || null,
      permanent_city: data.permanentCity || null,
      permanent_state: data.permanentState || null,
      permanent_pincode: data.permanentPincode || null,
      
      // Communication Address
      communication_address: data.communicationAddress || data.correspondenceAddress || null,
      communication_city: data.communicationCity || null,
      communication_state: data.communicationState || null,
      communication_pincode: data.communicationPincode || null,
      
      // Family Information
      father_name: data.fatherName || data.parentName || null,
      father_occupation: data.fatherOccupation || data.parentOccupation || null,
      mother_name: data.motherName || null,
      mother_occupation: data.motherOccupation || null,
      spouse_name: data.spouseName || null,
      spouse_occupation: data.spouseOccupation || null,
      
      // Course Details
      course_type: data.courseType || null,
      course_name: data.courseName || null,
      specialization: data.specialization || null,
      
      // 10th Details
      tenth_board: data.tenthBoard || null,
      tenth_school: data.tenthSchool || data.school10th || null,
      tenth_year: data.tenthYear || data.year10th || null,
      tenth_percentage: data.tenthPercentage || data.percentage10th || null,
      
      // 12th Details
      twelfth_board: data.twelfthBoard || null,
      twelfth_school: data.twelfthSchool || data.school12th || null,
      twelfth_year: data.twelfthYear || data.year12th || null,
      twelfth_percentage: data.twelfthPercentage || data.percentage12th || null,
      
      // UG Details
      ug_degree: data.ugDegree || null,
      ug_university: data.ugUniversity || null,
      ug_college: data.ugCollege || data.collegeUG || null,
      ug_year: data.ugYear || data.yearUG || null,
      ug_percentage: data.ugPercentage || data.percentageUG || null,
      
      // PG Details
      pg_degree: data.pgDegree || null,
      pg_university: data.pgUniversity || null,
      pg_college: data.pgCollege || data.collegePG || null,
      pg_year: data.pgYear || data.yearPG || null,
      pg_percentage: data.pgPercentage || data.percentagePG || null,
      
      // Payment
      payment_method: data.paymentMethod || data.paymentOption || null,
      transaction_id: data.transactionId || null,
      
      // Documents (stored as JSONB)
      documents: Object.keys(files).length > 0 ? files : null,
      
      // Declaration
      declaration: data.declaration === '1' || data.declaration === 'true',
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to save application. Please try again.',
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully!',
      applicationNumber,
    });

  } catch (error) {
    console.error('Application submission error:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while submitting your application. Please try again.',
    }, { status: 500 });
  }
}
