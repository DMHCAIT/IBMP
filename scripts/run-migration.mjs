import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runMigration() {
  console.log('Running migration: Create organization_accreditations table...');

  const migrationSQL = `
CREATE TABLE IF NOT EXISTS organization_accreditations (
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

CREATE POLICY IF NOT EXISTS "Allow public read access to organization accreditations"
  ON organization_accreditations FOR SELECT
  USING (true);

CREATE POLICY IF NOT EXISTS "Allow service role full access to organization accreditations"
  ON organization_accreditations FOR ALL
  USING (true);
  `;

  try {
    const { error } = await supabase.rpc('exec', { sql: migrationSQL });
    
    if (error) {
      console.error('Migration failed:', error);
      process.exit(1);
    }

    console.log('✓ Migration completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error running migration:', err);
    process.exit(1);
  }
}

runMigration();
