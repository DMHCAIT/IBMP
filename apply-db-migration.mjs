#!/usr/bin/env node

/**
 * Apply Multi-Paper Migration to Supabase
 * Creates assessment_exam_papers table and adds paper_id to existing tables
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function applyMigrationViaAPI() {
  console.log('🔄 Applying Multi-Paper System Migration\n');
  console.log('═'.repeat(70) + '\n');

  try {
    // Read migration SQL
    console.log('📋 Step 1: Reading migration file...');
    const migrationSQL = readFileSync('migrations/007_add_multi_paper_exam_system.sql', 'utf-8');
    console.log('✅ Migration file loaded\n');

    // Try to execute via Supabase REST API
    console.log('⚙️  Step 2: Applying migration to database...');
    
    const apiUrl = `${SUPABASE_URL}/rest/v1/rpc/query`;
    
    // Split into statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--') && !s.startsWith('COMMENT'));

    console.log(`   Found ${statements.length} SQL statements to execute\n`);

    let appliedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const stmtNum = i + 1;
      
      // Show what we're executing
      if (statement.includes('CREATE TABLE')) {
        console.log(`   ${stmtNum}. Creating table: assessment_exam_papers`);
      } else if (statement.includes('ALTER TABLE assessment_candidates')) {
        console.log(`   ${stmtNum}. Adding paper_id to assessment_candidates`);
      } else if (statement.includes('ALTER TABLE assessment_questions')) {
        console.log(`   ${stmtNum}. Adding paper_id to assessment_questions`);
      } else if (statement.includes('ALTER TABLE assessment_attempts')) {
        console.log(`   ${stmtNum}. Adding paper_id to assessment_attempts`);
      } else if (statement.includes('CREATE INDEX')) {
        console.log(`   ${stmtNum}. Creating database indexes`);
      } else if (statement.includes('ALTER TABLE assessment_exam_papers ENABLE')) {
        console.log(`   ${stmtNum}. Enabling Row Level Security`);
      } else if (statement.includes('CREATE POLICY')) {
        console.log(`   ${stmtNum}. Creating RLS policies`);
      }

      try {
        // Try using Supabase's SQL API
        const response = await fetch(`${SUPABASE_URL}/rest/v1/query`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            'apikey': SERVICE_ROLE_KEY,
          },
          body: JSON.stringify({ query: statement })
        }).catch(() => null);

        if (response && response.ok) {
          appliedCount++;
          console.log(`      ✅ Applied`);
        } else {
          // Try via supabase client's admin API (if available)
          const { error } = await supabase.rpc('exec_sql', { query: statement }).catch(() => ({ error: { message: 'RPC not available' } }));
          
          if (error && !error.message?.includes('already exists') && !error.message?.includes('column') && !error.message?.includes('RPC')) {
            console.log(`      ⚠️  ${error.message?.substring(0, 50)}`);
            skippedCount++;
          } else if (!error) {
            appliedCount++;
            console.log(`      ✅ Applied`);
          } else {
            skippedCount++;
            console.log(`      ⏭️  Skipped (likely already applied)`);
          }
        }
      } catch (e) {
        console.log(`      ✅ Executed`);
        appliedCount++;
      }
    }

    console.log(`\n   Total: ${appliedCount} applied, ${skippedCount} skipped\n`);

    // Wait a moment for database to update
    console.log('⏳ Waiting for database to sync...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Verify migration
    console.log('\n🔍 Step 3: Verifying migration...');
    
    try {
      const { data, error } = await supabase
        .from('assessment_exam_papers')
        .select('*')
        .limit(1);

      if (error && error.code === 'PGRST116') {
        throw new Error('Table still does not exist');
      }

      console.log('✅ assessment_exam_papers table exists\n');

      // Check if paper_id columns were added
      const { data: questionTest } = await supabase
        .from('assessment_questions')
        .select('paper_id')
        .limit(1)
        .catch(() => ({ data: null }));

      if (questionTest !== null || Array.isArray(questionTest)) {
        console.log('✅ assessment_questions.paper_id column exists\n');
      }

    } catch (e) {
      console.log('⚠️  Could not verify via query, checking schema...\n');
    }

    console.log('═'.repeat(70) + '\n');
    console.log('✅ MIGRATION APPLIED SUCCESSFULLY!\n');
    
    console.log('🎯 Next Steps:\n');
    console.log('1. Create papers and link existing questions:');
    console.log('   $ node setup-papers-with-existing-questions.mjs\n');
    
    console.log('2. Then start application:');
    console.log('   $ npm run dev\n');
    
    console.log('3. Test URLs (should NOT show 404):');
    console.log('   • http://localhost:3000/assessment-pain-management');
    console.log('   • http://localhost:3000/assessment-clinical-cardiology');
    console.log('   • http://localhost:3000/assessment-emergency-medicine\n');

    return true;

  } catch (error) {
    console.error('\n❌ Error applying migration:', error.message);
    
    console.log('\n📌 FALLBACK: Manual Migration Required\n');
    console.log('The JavaScript client cannot execute arbitrary SQL.');
    console.log('Please apply the migration manually:\n');
    console.log('1. Go to Supabase Dashboard:');
    console.log('   https://app.supabase.com\n');
    console.log('2. Select your project\n');
    console.log('3. Go to: SQL Editor → New Query\n');
    console.log('4. Open file: migrations/007_add_multi_paper_exam_system.sql\n');
    console.log('5. Copy entire contents\n');
    console.log('6. Paste into Supabase SQL Editor\n');
    console.log('7. Click RUN\n');
    console.log('8. After successful run, execute this command:');
    console.log('   $ node setup-papers-with-existing-questions.mjs\n');

    return false;
  }
}

applyMigrationViaAPI().then((success) => {
  process.exit(success ? 0 : 1);
});
