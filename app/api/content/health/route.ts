import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const checks = {
    supabase_connected: false,
    table_exists: false,
    can_read: false,
    can_write: false,
    errors: [] as string[],
  };

  try {
    const supabase = getSupabaseServiceClient();

    // Check 1: Can we query the table?
    try {
      const { error } = await supabase
        .from('site_content')
        .select('id')
        .eq('id', 'main')
        .single();

      if (error && error.code === 'PGRST116') {
        // Table exists but record doesn't exist yet - that's ok
        checks.table_exists = true;
        checks.can_read = true;
        checks.supabase_connected = true;
      } else if (error) {
        checks.errors.push(`Read error: ${error.message}`);
      } else {
        checks.table_exists = true;
        checks.can_read = true;
        checks.supabase_connected = true;
      }
    } catch (readError) {
      checks.errors.push(`Read exception: ${readError instanceof Error ? readError.message : String(readError)}`);
    }

    // Check 2: Can we write to the table?
    try {
      const testContent = { test: 'health_check', timestamp: new Date().toISOString() };
      const { error: writeError } = await supabase
        .from('site_content')
        .upsert({ id: 'health-check-test', content: testContent })
        .select();

      if (writeError) {
        checks.errors.push(`Write error: ${writeError.message}`);
      } else {
        checks.can_write = true;
        // Clean up test record
        await supabase.from('site_content').delete().eq('id', 'health-check-test');
      }
    } catch (writeError) {
      checks.errors.push(`Write exception: ${writeError instanceof Error ? writeError.message : String(writeError)}`);
    }
  } catch (error) {
    checks.errors.push(`Connection exception: ${error instanceof Error ? error.message : String(error)}`);
  }

  const allHealthy = checks.supabase_connected && checks.table_exists && checks.can_read && checks.can_write;

  return NextResponse.json(
    {
      healthy: allHealthy,
      checks,
      ...(allHealthy && { message: 'All systems operational' }),
      ...(!allHealthy && { 
        message: 'Supabase content storage is not properly configured',
        nextSteps: [
          'Ensure the site_content table exists in Supabase',
          'Run the migration: migrations/001_create_site_content_table.sql',
          'Verify SUPABASE_SERVICE_ROLE_KEY is set in environment variables',
          'Check Supabase RLS policies are correct',
        ]
      }),
    },
    { status: allHealthy ? 200 : 503 }
  );
}
