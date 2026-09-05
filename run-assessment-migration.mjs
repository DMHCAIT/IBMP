#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const SUPABASE_URL = 'https://nfpvilygpjosfujdpcdg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcHZpbHlncGpvc2Z1amRwY2RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA2ODUzMCwiZXhwIjoyMDg2NjQ0NTMwfQ.WAQ_uSiQFMUK9LPh39dfGhFWJBdFz4B4oFHDfg_-Z-8';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

console.log('\n🚀 Running Assessment Database Migration\n');

// SQL statements to execute
const sqlStatements = [
  `CREATE TABLE IF NOT EXISTS assessment_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    enrollment_id TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    exam_type TEXT DEFAULT 'Pain Medicine',
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
  );`,

  `CREATE TABLE IF NOT EXISTS assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES assessment_candidates(id) ON DELETE CASCADE,
    enrollment_id TEXT NOT NULL,
    started_at TIMESTAMP DEFAULT now(),
    submitted_at TIMESTAMP,
    status TEXT DEFAULT 'in-progress',
    total_score FLOAT,
    passing_score FLOAT DEFAULT 50,
    result TEXT,
    created_at TIMESTAMP DEFAULT now()
  );`,

  `CREATE TABLE IF NOT EXISTS assessment_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES assessment_candidates(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    question_type TEXT,
    question_text TEXT,
    response_text TEXT,
    response_json JSONB,
    is_correct BOOLEAN,
    marks_obtained FLOAT DEFAULT 0,
    max_marks FLOAT DEFAULT 1,
    is_flagged BOOLEAN DEFAULT FALSE,
    reviewer_notes TEXT,
    created_at TIMESTAMP DEFAULT now()
  );`,

  `CREATE TABLE IF NOT EXISTS assessment_question_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    image_path VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(50),
    uploaded_by VARCHAR(255),
    image_title TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
  );`,

  `CREATE TABLE IF NOT EXISTS assessment_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_type TEXT NOT NULL UNIQUE,
    duration_minutes INTEGER DEFAULT 120,
    total_questions INTEGER DEFAULT 60,
    total_marks FLOAT DEFAULT 80,
    passing_marks FLOAT DEFAULT 50,
    passing_percentage FLOAT DEFAULT 62.5,
    description TEXT,
    max_attempts INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT now(),
    updated_at TIMESTAMP DEFAULT now()
  );`,

  `CREATE INDEX IF NOT EXISTS idx_assessment_candidates_enrollment_id ON assessment_candidates(enrollment_id);`,
  `CREATE INDEX IF NOT EXISTS idx_assessment_attempts_candidate_id ON assessment_attempts(candidate_id);`,
  `CREATE INDEX IF NOT EXISTS idx_assessment_attempts_status ON assessment_attempts(status);`,
  `CREATE INDEX IF NOT EXISTS idx_assessment_responses_attempt_id ON assessment_responses(attempt_id);`,
  `CREATE INDEX IF NOT EXISTS idx_assessment_responses_candidate_id ON assessment_responses(candidate_id);`,
  `CREATE INDEX IF NOT EXISTS idx_assessment_question_images_question_id ON assessment_question_images(question_id);`,

  `ALTER TABLE assessment_candidates ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE assessment_question_images ENABLE ROW LEVEL SECURITY;`,
  `ALTER TABLE assessment_settings ENABLE ROW LEVEL SECURITY;`,

  `CREATE POLICY "assessment_candidates_all" ON assessment_candidates FOR ALL USING (true);`,
  `CREATE POLICY "assessment_attempts_all" ON assessment_attempts FOR ALL USING (true);`,
  `CREATE POLICY "assessment_responses_all" ON assessment_responses FOR ALL USING (true);`,
  `CREATE POLICY "assessment_question_images_all" ON assessment_question_images FOR ALL USING (true);`,
  `CREATE POLICY "assessment_settings_all" ON assessment_settings FOR ALL USING (true);`,

  `INSERT INTO assessment_settings (exam_type, duration_minutes, total_questions, total_marks, passing_marks, passing_percentage, description)
   VALUES ('Pain Medicine', 120, 60, 80, 50, 62.5, 'Comprehensive Pain Medicine Assessment - 60 questions, 120 minutes')
   ON CONFLICT (exam_type) DO NOTHING;`
];

async function runMigration() {
  try {
    console.log('📋 Executing SQL statements...\n');

    for (const sql of sqlStatements) {
      const { error } = await supabase.rpc('query_result', { sql });
      
      if (error && !error.message?.includes('already exists')) {
        console.log(`❌ Error: ${error.message}`);
      }
    }

    // Verify tables were created
    console.log('\n✅ Checking if tables exist...\n');

    const tables = [
      'assessment_candidates',
      'assessment_attempts',
      'assessment_responses',
      'assessment_question_images',
      'assessment_settings'
    ];

    for (const table of tables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .limit(1);

        if (!error) {
          console.log(`✅ ${table} - Created successfully`);
        } else if (error.code === 'PGRST204' || error.message?.includes('does not exist')) {
          console.log(`⚠️  ${table} - Not found`);
        }
      } catch (e) {
        console.log(`⚠️  ${table} - Check status`);
      }
    }

    console.log('\n✨ Migration check complete!\n');
    console.log('Next steps:');
    console.log('  1. Refresh Supabase dashboard (F5)');
    console.log('  2. Go to Tables section');
    console.log('  3. All 5 assessment tables should be visible\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

runMigration();
