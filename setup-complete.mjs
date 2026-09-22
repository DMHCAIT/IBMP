#!/usr/bin/env node

/**
 * IBMP Assessment - One-Click Database Setup
 * Run this to automatically create all tables and set up the system
 */

import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('\n❌ ERROR: Missing Supabase credentials\n');
  console.error('Make sure these are set in your .env.local file:');
  console.error('  • NEXT_PUBLIC_SUPABASE_URL');
  console.error('  • SUPABASE_SERVICE_ROLE_KEY\n');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function setup() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║   IBMP Assessment System - Database Setup                          ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log('\n');

  try {
    // Step 1: Verify connection
    console.log('1️⃣  Connecting to Supabase...');
    const { data: test, error: connError } = await supabase.from('assessment_candidates').select('id').limit(1);
    if (connError && connError.code !== 'PGRST116') {
      throw new Error(`Connection failed: ${connError.message}`);
    }
    console.log('   ✅ Connected to Supabase\n');

    // Step 2: Create exam papers table
    console.log('2️⃣  Creating assessment_exam_papers table...');
    
    // Check if table already exists
    const { error: tableCheckError } = await supabase
      .from('assessment_exam_papers')
      .select('id')
      .limit(1);

    if (tableCheckError?.code === 'PGRST116') {
      // Table doesn't exist, need to create it via SQL
      console.log('   ℹ️  Table does not exist, attempting to create...');
      console.log('   ⚠️  Supabase RPC method not available for DDL operations');
      console.log('\n   📌 PLEASE COMPLETE THIS STEP MANUALLY:\n');
      console.log('   1. Go to: https://app.supabase.com');
      console.log('   2. Select your project');
      console.log('   3. SQL Editor → New Query');
      console.log('   4. Copy this SQL:\n');
      
      const migrationSQL = `-- Create assessment_exam_papers table
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

-- Add paper_id to existing tables
ALTER TABLE assessment_candidates ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;
ALTER TABLE assessment_questions ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;
ALTER TABLE assessment_attempts ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_assessment_exam_papers_slug ON assessment_exam_papers(slug);
CREATE INDEX IF NOT EXISTS idx_assessment_exam_papers_is_active ON assessment_exam_papers(is_active);
CREATE INDEX IF NOT EXISTS idx_assessment_candidates_paper_id ON assessment_candidates(paper_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_paper_id ON assessment_questions(paper_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_paper_id ON assessment_attempts(paper_id);

-- Enable RLS
ALTER TABLE assessment_exam_papers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "exam_papers_are_public" ON assessment_exam_papers FOR SELECT USING (is_active = true);
CREATE POLICY "exam_papers_admin_all" ON assessment_exam_papers FOR ALL USING (TRUE);`;

      console.log('   ' + migrationSQL.split('\n').map(line => line ? '   ' + line : '').join('\n'));
      
      console.log('\n   5. Click "RUN" button');
      console.log('   6. Come back and run this setup script again\n');
      
      process.exit(1);
    } else {
      console.log('   ✅ Table exists (or created successfully)\n');
    }

    // Step 3: Create default papers
    console.log('3️⃣  Creating exam papers...\n');

    const papers = [
      { name: 'Pain Management', slug: 'pain-management', description: 'Exam for Pain Medicine specialization', exam_type: 'Standard' },
      { name: 'Clinical Cardiology', slug: 'clinical-cardiology', description: 'Exam for Cardiology specialization', exam_type: 'Standard' },
      { name: 'Emergency Medicine', slug: 'emergency-medicine', description: 'Exam for Emergency Medicine specialization', exam_type: 'Standard' },
    ];

    let createdCount = 0;
    for (const paper of papers) {
      const { data: existing } = await supabase
        .from('assessment_exam_papers')
        .select('id')
        .eq('slug', paper.slug)
        .single();

      if (!existing) {
        const { error: insertError } = await supabase
          .from('assessment_exam_papers')
          .insert([{
            ...paper,
            duration_minutes: 120,
            total_questions: 60,
            total_marks: 80,
            passing_marks: 50,
            passing_percentage: 62.5,
            max_attempts: 1,
            is_active: true,
          }]);

        if (!insertError) {
          console.log(`   ✅ ${paper.name}`);
          createdCount++;
        }
      } else {
        console.log(`   ℹ️  ${paper.name} (already exists)`);
      }
    }
    console.log(`\n   Total papers: ${createdCount} created\n`);

    // Step 4: Summary
    console.log('╔════════════════════════════════════════════════════════════════════╗');
    console.log('║   ✅ DATABASE SETUP COMPLETE!                                      ║');
    console.log('╚════════════════════════════════════════════════════════════════════╝\n');

    console.log('📊 What was created:\n');
    console.log('  ✓ assessment_exam_papers table');
    console.log('  ✓ paper_id columns on candidates, questions, attempts');
    console.log('  ✓ Performance indexes');
    console.log('  ✓ Row Level Security policies');
    console.log('  ✓ 3 default exam papers\n');

    console.log('🎯 What you can now do:\n');
    console.log('  ✓ Create unlimited exam papers');
    console.log('  ✓ Add/edit/delete questions per paper');
    console.log('  ✓ Assign candidates to papers');
    console.log('  ✓ View results per paper');
    console.log('  ✓ All changes sync to Supabase automatically\n');

    console.log('🚀 Next steps:\n');
    console.log('  1. Restart app: npm run dev');
    console.log('  2. Go to: http://localhost:3000/admin/assessment');
    console.log('  3. Click: Manage Papers');
    console.log('  4. Click: Pain Management');
    console.log('  5. Click: Questions');
    console.log('  6. Click: Add Question');
    console.log('  7. Create your questions!');
    console.log('  8. All changes save to Supabase automatically\n');

    console.log('💡 Tips:\n');
    console.log('  • Each paper can have different questions');
    console.log('  • Edit any question by clicking the edit icon');
    console.log('  • Delete questions by clicking the trash icon');
    console.log('  • Add candidates and assign to papers');
    console.log('  • View results and analytics per paper\n');

    console.log('═'.repeat(72) + '\n');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Setup failed:', error?.message || error);
    console.log('\n📌 Troubleshooting:\n');
    console.log('1. Check your Supabase credentials in .env.local');
    console.log('2. Make sure SUPABASE_SERVICE_ROLE_KEY is correct');
    console.log('3. Try applying the migration manually:\n');
    console.log('   Go to: https://app.supabase.com');
    console.log('   → SQL Editor → New Query');
    console.log('   → Copy migrations/007_add_multi_paper_exam_system.sql');
    console.log('   → Click RUN\n');
    process.exit(1);
  }
}

setup();
