import { NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getSupabaseServiceClient();

    // Check if the table exists by trying to query it
    const { error } = await db
      .from('organization_accreditations')
      .select('count', { count: 'exact', head: true })
      .limit(0);

    if (error && error.code === 'PGRST205') {
      // Table doesn't exist - provide SQL instructions
      const sqlCode = `CREATE TABLE IF NOT EXISTS organization_accreditations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_name TEXT NOT NULL,
  accreditation_title TEXT NOT NULL,
  accreditation_number TEXT NOT NULL UNIQUE,
  date_of_accreditation TEXT NOT NULL,
  validity_period TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_org_accreditation_number ON organization_accreditations (accreditation_number);
CREATE INDEX IF NOT EXISTS idx_org_accreditation_name ON organization_accreditations (organization_name);

ALTER TABLE organization_accreditations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to organization accreditations"
  ON organization_accreditations FOR SELECT
  USING (true);

CREATE POLICY "Allow service role full access to organization accreditations"
  ON organization_accreditations FOR ALL
  USING (true);`;

      return NextResponse.json({
        success: false,
        tableExists: false,
        message: 'Table organization_accreditations does not exist. Please run the SQL migration in your Supabase dashboard.',
        instructions: {
          step1: 'Go to your Supabase project dashboard',
          step2: 'Navigate to SQL Editor',
          step3: 'Click "New Query"',
          step4: 'Copy and paste the SQL code below',
          step5: 'Click "Run"'
        },
        sqlMigration: sqlCode
      });
    }

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Error checking table status',
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      tableExists: true,
      message: 'Table organization_accreditations exists and is ready to use'
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, message: 'Error checking migration status', error: String(err) },
      { status: 500 }
    );
  }
}
