import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  console.log('[AccreditationAPI] GET /api/accreditation/applications called');
  console.log('[AccreditationAPI] DATABASE_URL exists:', !!process.env.DATABASE_URL);
  
  if (!process.env.DATABASE_URL) {
    console.error('[AccreditationAPI] DATABASE_URL is not set');
    return NextResponse.json(
      { error: 'Database connection not configured', data: [] },
      { status: 200 }
    );
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('[AccreditationAPI] Connecting to database...');
    await client.connect();
    console.log('[AccreditationAPI] Connected successfully');

    // Fetch all accreditation applications, ordered by most recent first
    console.log('[AccreditationAPI] Querying accreditation_applications table');
    const result = await client.query(
      'SELECT * FROM accreditation_applications ORDER BY COALESCE(created_at, submitted_at) DESC'
    );

    console.log('[AccreditationAPI] Query successful, found', result.rows.length, 'applications');
    return NextResponse.json({ data: result.rows }, { status: 200 });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[AccreditationAPI] Database error:', errorMessage);
    console.error('[AccreditationAPI] Full error:', err);
    return NextResponse.json(
      { error: 'Failed to fetch applications: ' + errorMessage, data: [] },
      { status: 200 }
    );
  } finally {
    try {
      await client.end();
      console.log('[AccreditationAPI] Connection closed');
    } catch (e) {
      console.error('[AccreditationAPI] Error closing connection:', e);
    }
  }
}
