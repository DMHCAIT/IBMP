import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const { status } = await request.json();

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({ success: false, message: 'Invalid status' }, { status: 400 });
    }

    await client.connect();

    const result = await client.query(
      `UPDATE accreditation_applications 
       SET status = $1, updated_at = NOW() 
       WHERE id = $2 
       RETURNING *`,
      [status, params.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, application: result.rows[0] });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error:', err);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  } finally {
    await client.end();
  }
}
