import { NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('[Accreditation API] Fetching applications using postgres...');
    await client.connect();
    console.log('[Accreditation API] Connected to database');
    
    const result = await client.query('SELECT * FROM accreditation_applications ORDER BY created_at DESC');
    
    console.log('[Accreditation API] Query result:', result.rows.length, 'records');
    return NextResponse.json({ success: true, applications: result.rows });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Accreditation API] Error:', errorMessage);
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  } finally {
    await client.end();
  }
}
