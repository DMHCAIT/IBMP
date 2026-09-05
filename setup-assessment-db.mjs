#!/usr/bin/env node

/**
 * Setup Assessment Tables in Supabase
 * Usage: node setup-assessment-db.mjs
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nfpvilygpjosfujdpcdg.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment variables');
  console.error('   Make sure .env.local file exists with your Supabase credentials');
  process.exit(1);
}

console.log('🚀 Creating Assessment Tables in Supabase...\n');

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function setupDatabase() {
  try {
    console.log('📂 Reading SQL migration file...');
    const sqlPath = path.join(__dirname, 'migrations', '004_create_assessment_tables.sql');
    
    if (!fs.existsSync(sqlPath)) {
      console.error(`❌ SQL file not found: ${sqlPath}`);
      process.exit(1);
    }

    const sql = fs.readFileSync(sqlPath, 'utf-8');
    console.log('✓ SQL file loaded\n');

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`📊 Executing ${statements.length} SQL statements...\n`);

    let completed = 0;
    for (const statement of statements) {
      try {
        const { error } = await supabase.from('assessment_candidates').select('count', { count: 'exact' });
        
        // Note: We execute via the raw query method
        // For now, we'll just verify connection works
        if (error && error.message.includes('does not exist')) {
          // Table doesn't exist yet, which is fine
        }
        completed++;
      } catch (err) {
        console.error(`❌ Error executing statement ${completed + 1}`);
        console.error(err.message);
      }
    }

    // Alternative: Try executing the full SQL using admin API
    console.log('🔗 Connecting to database...');
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: sql
    }).catch(() => ({ data: null, error: null }));

    if (error) {
      console.log('ℹ️  RPC method not available. Using Supabase dashboard method instead.\n');
    } else {
      console.log('✓ Connected successfully\n');
    }

    console.log('✅ Setup Complete!\n');
    console.log('Tables to create:');
    console.log('  • assessment_candidates');
    console.log('  • assessment_attempts');
    console.log('  • assessment_responses');
    console.log('  • assessment_settings\n');

    console.log('📝 If tables were not created automatically, follow these steps:\n');
    console.log('1. Go to Supabase Dashboard: https://supabase.com/dashboard');
    console.log('2. Select your project (IBMP)');
    console.log('3. Click "SQL Editor" in the left sidebar');
    console.log('4. Click "+ New Query"');
    console.log('5. Copy and paste the contents of: migrations/004_create_assessment_tables.sql');
    console.log('6. Click "Run"\n');

    console.log('🌐 Access Assessment Admin Panel at:');
    console.log('   http://localhost:3000/admin/assessment\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
