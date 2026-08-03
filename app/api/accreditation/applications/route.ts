import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();

    // Fetch all accreditation applications, ordered by most recent first
    const result = await client.query(
      'SELECT * FROM accreditation_applications ORDER BY created_at DESC, submitted_at DESC'
    );

    return NextResponse.json({ data: result.rows }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('Database error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch applications: ' + errorMessage },
      { status: 500 }
    );
  } finally {
    await client.end();
  }
}
