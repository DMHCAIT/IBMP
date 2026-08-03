import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const { id } = params;

    const result = await client.query(
      'SELECT * FROM accreditation_applications WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: result.rows[0] }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Database error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch application: ' + errorMessage },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    const { id } = params;
    const { status, notes } = await req.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    const result = await client.query(
      `UPDATE accreditation_applications 
       SET status = $1, notes = $2, reviewed_at = NOW()
       WHERE id = $3
       RETURNING *`,
      [status, notes || null, id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.rows[0] }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Database error:', err);
    return NextResponse.json(
      { error: 'Failed to update application: ' + errorMessage },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}
