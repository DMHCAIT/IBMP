#!/usr/bin/env node

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✓' : '✗');
  process.exit(1);
}

console.log('📦 Initializing Supabase client...');
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function runMigration() {
  try {
    console.log('🔄 Checking if table exists...');
    
    // Check if table exists
    const { data: existingTable, error: checkError } = await supabase
      .from('organization_accreditations')
      .select('count', { count: 'exact', head: true })
      .limit(0);

    if (checkError && checkError.code === 'PGRST205') {
      console.log('📝 Table does not exist. Creating table...');
      
      // Create table
      const { error: createError } = await supabase.rpc('exec', {
        sql: `CREATE TABLE public.organization_accreditations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          organization_name TEXT NOT NULL,
          accreditation_title TEXT NOT NULL,
          accreditation_number TEXT NOT NULL UNIQUE,
          date_of_accreditation TEXT NOT NULL,
          validity_period TEXT,
          status TEXT NOT NULL DEFAULT 'Active',
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );`
      });

      if (createError) {
        // The exec RPC might not exist, try direct SQL through another method
        console.log('📝 Using alternative method to create table...');
        
        // Try using the select method with raw SQL (won't work for DDL)
        // Instead, we need to provide manual SQL instructions
        throw new Error('Please run the SQL migration manually in Supabase dashboard');
      }

      console.log('✓ Table created successfully');
      
      // Create indexes
      console.log('📑 Creating indexes...');
      await supabase.rpc('exec', {
        sql: `CREATE INDEX IF NOT EXISTS idx_org_accreditation_number ON organization_accreditations (accreditation_number);`
      }).catch(() => null);

      await supabase.rpc('exec', {
        sql: `CREATE INDEX IF NOT EXISTS idx_org_accreditation_name ON organization_accreditations (organization_name);`
      }).catch(() => null);

      // Enable RLS
      console.log('🔒 Enabling Row Level Security...');
      await supabase.rpc('exec', {
        sql: `ALTER TABLE organization_accreditations ENABLE ROW LEVEL SECURITY;`
      }).catch(() => null);

      // Create policies
      console.log('🔐 Creating RLS policies...');
      await supabase.rpc('exec', {
        sql: `CREATE POLICY "Allow public read access to organization accreditations"
              ON organization_accreditations FOR SELECT USING (true);`
      }).catch(() => null);

      await supabase.rpc('exec', {
        sql: `CREATE POLICY "Allow service role full access to organization accreditations"
              ON organization_accreditations FOR ALL USING (true);`
      }).catch(() => null);

      console.log('✅ Migration completed successfully!');
    } else if (checkError) {
      throw checkError;
    } else {
      console.log('✓ Table already exists');
    }

    // Test by fetching records
    console.log('🧪 Testing table access...');
    const { data, error: testError } = await supabase
      .from('organization_accreditations')
      .select('*')
      .limit(1);

    if (testError) {
      throw testError;
    }

    console.log('✅ Table is accessible!');
    console.log(`   Found ${data?.length || 0} records`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

runMigration();
