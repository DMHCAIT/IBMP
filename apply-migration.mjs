#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

// Load .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const [key, value] = line.split('=');
    if (key && value && !process.env[key]) {
      process.env[key] = value.trim();
    }
  }
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function applyMigration() {
  console.log('\n╔════════════════════════════════════════════════════════════════╗');
  console.log('║   IBMP Assessment System - Create Tables                         ║');
  console.log('╚════════════════════════════════════════════════════════════════╝\n');

  try {
    console.log('1️⃣  Checking if assessment_exam_papers table exists...');
    
    const { error: tableError } = await supabase
      .from('assessment_exam_papers')
      .select('id')
      .limit(1);

    if (!tableError || !tableError.message.includes('Could not find the table')) {
      console.log('   ✅ Table already exists\n');
    } else {
      console.log('   ❌ Table does not exist\n');
      console.log('\n   📌 FIX: You must manually create the table in Supabase\n');
      console.log('   Go to: https://app.supabase.com');
      console.log('   → Select your IBMP project');
      console.log('   → SQL Editor (left sidebar)');
      console.log('   → New Query (top right)\n');
      console.log('   Paste this SQL:\n');
      console.log('═'.repeat(70));
      
      const createSQL = `
CREATE TABLE IF NOT EXISTS public.assessment_exam_papers (
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

ALTER TABLE assessment_exam_papers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exam_papers_are_public" ON assessment_exam_papers
  FOR SELECT USING (is_active = true);

CREATE POLICY "exam_papers_admin_all" ON assessment_exam_papers
  FOR ALL USING (TRUE);

CREATE INDEX IF NOT EXISTS idx_assessment_exam_papers_slug ON assessment_exam_papers(slug);
CREATE INDEX IF NOT EXISTS idx_assessment_exam_papers_is_active ON assessment_exam_papers(is_active);

ALTER TABLE assessment_candidates ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;
ALTER TABLE assessment_questions ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;
ALTER TABLE assessment_attempts ADD COLUMN IF NOT EXISTS paper_id UUID REFERENCES assessment_exam_papers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_assessment_candidates_paper_id ON assessment_candidates(paper_id);
CREATE INDEX IF NOT EXISTS idx_assessment_questions_paper_id ON assessment_questions(paper_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_paper_id ON assessment_attempts(paper_id);
`;
      
      console.log(createSQL);
      console.log('═'.repeat(70));
      console.log('\n   Then:\n');
      console.log('   1. Click the RUN button (blue play icon)');
      console.log('   2. Wait for "Success" message');
      console.log('   3. Run this command: node apply-migration.mjs\n');
      
      process.exit(1);
    }

    console.log('2️⃣  Creating default exam papers...');
    
    const papers = [
      { name: 'Pain Management', slug: 'pain-management', description: 'Comprehensive pain management assessment' },
      { name: 'Clinical Cardiology', slug: 'clinical-cardiology', description: 'Advanced cardiology assessment' },
      { name: 'Emergency Medicine', slug: 'emergency-medicine', description: 'Emergency medicine assessment' }
    ];

    let createdCount = 0;
    for (const paper of papers) {
      const { error } = await supabase
        .from('assessment_exam_papers')
        .insert({
          ...paper,
          duration_minutes: 120,
          total_questions: 60,
          total_marks: 80,
          passing_marks: 50,
          passing_percentage: 62.5,
          exam_type: 'Standard',
          max_attempts: 1,
          is_active: true,
        });

      if (!error) {
        console.log(`   ✅ ${paper.name}`);
        createdCount++;
      } else if (error.message.includes('unique constraint')) {
        console.log(`   ℹ️  ${paper.name} (already exists)`);
      } else {
        console.log(`   ⚠️  ${paper.name}: ${error.message}`);
      }
    }

    console.log(`\n3️⃣  Migration status: ${createdCount} papers created\n`);

    console.log('╔════════════════════════════════════════════════════════════════╗');
    console.log('║   ✅ COMPLETE!                                                  ║');
    console.log('╚════════════════════════════════════════════════════════════════╝\n');

    console.log('🚀 Now you can:\n');
    console.log('   1. Start the app:');
    console.log('      npm run dev\n');
    console.log('   2. Go to admin panel:');
    console.log('      http://localhost:3000/admin/assessment/papers\n');
    console.log('   3. Create exam papers and manage questions\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message, '\n');
    process.exit(1);
  }
}

applyMigration();
