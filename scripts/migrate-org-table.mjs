import { Pool } from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: `${__dirname}/../.env.local` });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ DATABASE_URL not found in .env.local');
  process.exit(1);
}

console.log('📦 Connecting to Supabase database...');

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

async function runMigration() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Running migration...\n');

    // Create table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.organization_accreditations (
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
    `);
    console.log('✓ Table created');

    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_org_accreditation_number 
      ON public.organization_accreditations (accreditation_number);
    `);
    console.log('✓ Index on accreditation_number created');

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_org_accreditation_name 
      ON public.organization_accreditations (organization_name);
    `);
    console.log('✓ Index on organization_name created');

    // Enable RLS
    await client.query(`
      ALTER TABLE public.organization_accreditations ENABLE ROW LEVEL SECURITY;
    `);
    console.log('✓ Row Level Security enabled');

    // Drop existing policies if they exist
    await client.query(`
      DROP POLICY IF EXISTS "Allow public read access to organization accreditations" 
      ON public.organization_accreditations;
    `).catch(() => null);

    await client.query(`
      DROP POLICY IF EXISTS "Allow service role full access to organization accreditations" 
      ON public.organization_accreditations;
    `).catch(() => null);

    // Create RLS policies
    await client.query(`
      CREATE POLICY "Allow public read access to organization accreditations"
        ON public.organization_accreditations FOR SELECT
        USING (true);
    `);
    console.log('✓ RLS policy for public read created');

    await client.query(`
      CREATE POLICY "Allow service role full access to organization accreditations"
        ON public.organization_accreditations FOR ALL
        USING (true);
    `);
    console.log('✓ RLS policy for service role created');

    // Insert sample data
    console.log('\n📝 Inserting sample data...');
    await client.query(`
      INSERT INTO public.organization_accreditations (
        organization_name,
        accreditation_title,
        accreditation_number,
        date_of_accreditation,
        validity_period,
        status
      ) VALUES
        ('Apex Global Medical University (Dummy)', 'Fellowship', 'IBMP-23173IN', '2025-01-15', '5 Years (2025 - 2030)', 'Active'),
        ('Metro Care Research Hospital (Dummy)', 'CME/CPD', 'IBMP-244001IN', '2024-08-20', '3 Years (2024 - 2027)', 'Active')
      ON CONFLICT (accreditation_number) DO NOTHING;
    `);
    console.log('✓ Sample data inserted');

    // Verify data
    const result = await client.query(`
      SELECT COUNT(*) as count FROM public.organization_accreditations;
    `);
    const recordCount = result.rows[0].count;
    console.log(`\n✅ Migration completed successfully!`);
    console.log(`📊 Total records in table: ${recordCount}`);

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
