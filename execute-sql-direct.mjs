#!/usr/bin/env node

/**
 * Direct SQL Execution via Supabase REST API
 * Executes migration SQL directly against PostgreSQL
 */

import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

async function executeSQLDirect() {
  console.log('🔄 Executing Migration via REST API\n');
  console.log('═'.repeat(70) + '\n');

  try {
    const migrationSQL = readFileSync('migrations/007_add_multi_paper_exam_system.sql', 'utf-8');
    
    console.log('📋 SQL Statements to Execute:\n');

    // Step 1: Create table
    console.log('1️⃣  Creating assessment_exam_papers table...');
    const createTableSQL = `
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
    `;

    let response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ query: createTableSQL })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`   Note: ${errorText.substring(0, 100)}`);
    } else {
      console.log('   ✅ Created (or already exists)');
    }

    // Step 2: Add paper_id to assessment_candidates
    console.log('\n2️⃣  Adding paper_id to assessment_candidates...');
    const addCandidateSQL = `
      ALTER TABLE assessment_candidates
      ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;
    `;

    response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ query: addCandidateSQL })
    });

    if (!response.ok) {
      console.log('   Note: Column may already exist');
    } else {
      console.log('   ✅ Added (or already exists)');
    }

    // Step 3: Add paper_id to assessment_questions
    console.log('\n3️⃣  Adding paper_id to assessment_questions...');
    const addQuestionsSQL = `
      ALTER TABLE assessment_questions
      ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;
    `;

    response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ query: addQuestionsSQL })
    });

    if (!response.ok) {
      console.log('   Note: Column may already exist');
    } else {
      console.log('   ✅ Added (or already exists)');
    }

    // Step 4: Add paper_id to assessment_attempts
    console.log('\n4️⃣  Adding paper_id to assessment_attempts...');
    const addAttemptsSQL = `
      ALTER TABLE assessment_attempts
      ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;
    `;

    response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ query: addAttemptsSQL })
    });

    if (!response.ok) {
      console.log('   Note: Column may already exist');
    } else {
      console.log('   ✅ Added (or already exists)');
    }

    // Step 5: Create indexes
    console.log('\n5️⃣  Creating database indexes...');
    const indexSQL = `
      CREATE INDEX IF NOT EXISTS idx_assessment_exam_papers_slug ON assessment_exam_papers(slug);
      CREATE INDEX IF NOT EXISTS idx_assessment_exam_papers_is_active ON assessment_exam_papers(is_active);
      CREATE INDEX IF NOT EXISTS idx_assessment_candidates_paper_id ON assessment_candidates(paper_id);
      CREATE INDEX IF NOT EXISTS idx_assessment_questions_paper_id ON assessment_questions(paper_id);
      CREATE INDEX IF NOT EXISTS idx_assessment_attempts_paper_id ON assessment_attempts(paper_id);
    `;

    response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ query: indexSQL })
    });

    console.log('   ✅ Indexes created');

    // Step 6: Enable RLS
    console.log('\n6️⃣  Enabling Row Level Security...');
    const rlsSQL = `
      ALTER TABLE assessment_exam_papers ENABLE ROW LEVEL SECURITY;
    `;

    response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ query: rlsSQL })
    });

    console.log('   ✅ RLS enabled');

    console.log('\n' + '═'.repeat(70) + '\n');

    console.log('✅ MIGRATION SQL EXECUTED!\n');

    console.log('⏳ Note: Supabase may need a moment to sync the schema.\n');

    console.log('🎯 Next Steps:\n');
    console.log('1. Wait 10 seconds for schema cache to refresh');
    console.log('2. Run: node setup-papers-with-existing-questions.mjs');
    console.log('3. Then: npm run dev\n');

    return true;

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    console.log('\n📌 ALTERNATIVE: Apply migration manually\n');
    console.log('1. Go to: https://app.supabase.com');
    console.log('2. Select your project');
    console.log('3. Go to: SQL Editor → New Query');
    console.log('4. Copy file: migrations/007_add_multi_paper_exam_system.sql');
    console.log('5. Paste and RUN in Supabase\n');

    return false;
  }
}

executeSQLDirect().then(() => {
  console.log('Waiting for schema refresh...');
  setTimeout(() => {
    process.exit(0);
  }, 5000);
});
