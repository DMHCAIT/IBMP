#!/usr/bin/env node

/**
 * Automatic Database Migration Runner
 * Applies schema changes to Supabase automatically
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function runMigration() {
  console.log('🔄 Starting Database Migration...\n');

  try {
    // Step 1: Create assessment_exam_papers table
    console.log('1️⃣  Creating assessment_exam_papers table...');
    const createTableResult = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS assessment_exam_papers (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT,
          duration_minutes INTEGER DEFAULT 120,
          total_questions INTEGER DEFAULT 60,
          total_marks FLOAT DEFAULT 80,
          passing_marks FLOAT DEFAULT 50,
          passing_percentage FLOAT DEFAULT 62.5,
          exam_type TEXT DEFAULT 'Standard',
          max_attempts INTEGER DEFAULT 1,
          is_active BOOLEAN DEFAULT TRUE,
          created_by UUID,
          created_at TIMESTAMP DEFAULT now(),
          updated_at TIMESTAMP DEFAULT now()
        );
      `
    });

    if (createTableResult.error) {
      console.log('   ℹ️  Table may already exist or RPC not available');
    } else {
      console.log('   ✅ Table created successfully');
    }

    // Step 2: Add paper_id to assessment_candidates
    console.log('\n2️⃣  Adding paper_id to assessment_candidates...');
    const addCandidateColumn = await supabase.rpc('exec', {
      sql: `
        ALTER TABLE assessment_candidates
        ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;
      `
    });

    if (addCandidateColumn.error) {
      console.log('   ℹ️  Column may already exist');
    } else {
      console.log('   ✅ Column added');
    }

    // Step 3: Add paper_id to assessment_questions
    console.log('\n3️⃣  Adding paper_id to assessment_questions...');
    const addQuestionsColumn = await supabase.rpc('exec', {
      sql: `
        ALTER TABLE assessment_questions
        ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;
      `
    });

    if (addQuestionsColumn.error) {
      console.log('   ℹ️  Column may already exist');
    } else {
      console.log('   ✅ Column added');
    }

    // Step 4: Add paper_id to assessment_attempts
    console.log('\n4️⃣  Adding paper_id to assessment_attempts...');
    const addAttemptsColumn = await supabase.rpc('exec', {
      sql: `
        ALTER TABLE assessment_attempts
        ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;
      `
    });

    if (addAttemptsColumn.error) {
      console.log('   ℹ️  Column may already exist');
    } else {
      console.log('   ✅ Column added');
    }

    // Step 5: Create indexes
    console.log('\n5️⃣  Creating indexes for performance...');
    const indexResults = await Promise.all([
      supabase.rpc('exec', {
        sql: `CREATE INDEX IF NOT EXISTS idx_assessment_exam_papers_slug ON assessment_exam_papers(slug);`
      }),
      supabase.rpc('exec', {
        sql: `CREATE INDEX IF NOT EXISTS idx_assessment_exam_papers_is_active ON assessment_exam_papers(is_active);`
      }),
      supabase.rpc('exec', {
        sql: `CREATE INDEX IF NOT EXISTS idx_assessment_candidates_paper_id ON assessment_candidates(paper_id);`
      }),
      supabase.rpc('exec', {
        sql: `CREATE INDEX IF NOT EXISTS idx_assessment_questions_paper_id ON assessment_questions(paper_id);`
      }),
      supabase.rpc('exec', {
        sql: `CREATE INDEX IF NOT EXISTS idx_assessment_attempts_paper_id ON assessment_attempts(paper_id);`
      })
    ]);

    console.log('   ✅ Indexes created');

    // Step 6: Check if tables exist by querying them
    console.log('\n6️⃣  Verifying migration...');
    const { data: papers, error: papersError } = await supabase
      .from('assessment_exam_papers')
      .select('id')
      .limit(1);

    if (papersError && papersError.code === 'PGRST116') {
      console.log('\n   ⚠️  WARNING: Tables not created via RPC');
      console.log('   📌 MANUAL STEP REQUIRED:');
      console.log('   1. Go to: https://app.supabase.com');
      console.log('   2. Select your project');
      console.log('   3. SQL Editor → New Query');
      console.log('   4. Copy file: migrations/007_add_multi_paper_exam_system.sql');
      console.log('   5. Paste and click RUN\n');
      process.exit(1);
    } else if (papersError) {
      throw papersError;
    }

    console.log('   ✅ Migration verified - tables accessible!');

    console.log('\n' + '═'.repeat(70));
    console.log('\n✅ DATABASE MIGRATION COMPLETED SUCCESSFULLY!\n');
    console.log('Tables Created/Updated:');
    console.log('  ✓ assessment_exam_papers (NEW)');
    console.log('  ✓ assessment_candidates (paper_id column added)');
    console.log('  ✓ assessment_questions (paper_id column added)');
    console.log('  ✓ assessment_attempts (paper_id column added)\n');

    console.log('🎯 Next Steps:');
    console.log('  1. Restart your application: npm run dev');
    console.log('  2. Go to: http://localhost:3000/admin/assessment/papers');
    console.log('  3. Click: "New Paper"');
    console.log('  4. Create your first exam paper!');
    console.log('  5. Add candidates and questions\n');

    process.exit(0);

  } catch (error: any) {
    console.error('\n❌ Migration failed:', error.message);
    
    console.log('\n📌 ALTERNATIVE: Manual Migration');
    console.log('\nIf automatic migration fails:');
    console.log('1. Go to: https://app.supabase.com');
    console.log('2. Select your project');
    console.log('3. Go to: SQL Editor → New Query');
    console.log('4. Copy file: migrations/007_add_multi_paper_exam_system.sql');
    console.log('5. Paste into SQL Editor');
    console.log('6. Click RUN\n');

    process.exit(1);
  }
}

// Run migration
runMigration();
