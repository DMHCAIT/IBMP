import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function POST(req: Request) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const body = await req.json();
    const {
      application_type,
      organization_name,
      address,
      contact_number,
      mobile,
      email,
      website,
      proprietor_name,
      proprietor_address,
      proprietor_pin,
      proprietor_mobile,
      courses_submitted,
      org_types,
      photo_id,
      photo_id_file,
      proprietor_photo_file,
      infrastructure_file,
    } = body;

    if (!organization_name || !email) {
      return NextResponse.json({ success: false, message: 'Organization name and email are required' }, { status: 400 });
    }

    await client.connect();

    // Handle org_types - ensure it's a comma-separated string
    let orgTypesString = '';
    if (Array.isArray(org_types)) {
      orgTypesString = org_types.join(',');
    } else if (typeof org_types === 'string') {
      orgTypesString = org_types;
    }

    const result = await client.query(
      `INSERT INTO accreditation_applications (
        application_type,
        organization_name,
        address,
        contact_number,
        mobile,
        email,
        website,
        proprietor_name,
        proprietor_address,
        proprietor_pin,
        proprietor_mobile,
        courses_submitted,
        org_types,
        photo_id,
        photo_id_file,
        proprietor_photo_file,
        infrastructure_file,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING *`,
      [
        application_type,
        organization_name,
        address,
        contact_number,
        mobile,
        email,
        website,
        proprietor_name,
        proprietor_address,
        proprietor_pin,
        proprietor_mobile,
        courses_submitted,
        orgTypesString,
        photo_id,
        photo_id_file || '',
        proprietor_photo_file || '',
        infrastructure_file || '',
        'pending',
      ]
    );

    const application = result.rows[0];

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error:', err);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  } finally {
    await client.end();
  }
}
