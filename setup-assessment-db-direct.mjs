#!/usr/bin/env node

import pkg from 'pg';
const { Client } = pkg;
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Missing DATABASE_URL in .env.local');
  process.exit(1);
}

const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  step: (msg) => console.log(`\n📋 ${msg}`),
};

const client = new Client({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const createTablesSql = `
  -- Drop existing tables if needed (comment out if you want to preserve data)
  -- DROP TABLE IF EXISTS assessment_responses CASCADE;
  -- DROP TABLE IF EXISTS assessment_attempts CASCADE;
  -- DROP TABLE IF EXISTS assessment_question_images CASCADE;
  -- DROP TABLE IF EXISTS assessment_candidates CASCADE;
  -- DROP TABLE IF EXISTS assessment_settings CASCADE;

  -- Create assessment_candidates table
  CREATE TABLE IF NOT EXISTS assessment_candidates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(255) NOT NULL,
    enrollment_id VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    exam_type VARCHAR(100) DEFAULT 'Pain Medicine',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_assessment_candidates_enrollment_id 
    ON assessment_candidates(enrollment_id);
  CREATE INDEX IF NOT EXISTS idx_assessment_candidates_status 
    ON assessment_candidates(status);

  -- Create assessment_attempts table
  CREATE TABLE IF NOT EXISTS assessment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id UUID NOT NULL REFERENCES assessment_candidates(id) ON DELETE CASCADE,
    enrollment_id VARCHAR(50) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'in-progress',
    total_score DECIMAL(5, 2),
    passing_score DECIMAL(5, 2) DEFAULT 50,
    result VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_assessment_attempts_candidate_id 
    ON assessment_attempts(candidate_id);
  CREATE INDEX IF NOT EXISTS idx_assessment_attempts_status 
    ON assessment_attempts(status);
  CREATE INDEX IF NOT EXISTS idx_assessment_attempts_enrollment_id 
    ON assessment_attempts(enrollment_id);

  -- Create assessment_responses table
  CREATE TABLE IF NOT EXISTS assessment_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id UUID NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    candidate_id UUID NOT NULL REFERENCES assessment_candidates(id) ON DELETE CASCADE,
    question_id VARCHAR(50) NOT NULL,
    question_type VARCHAR(50),
    question_text TEXT,
    response_text TEXT,
    response_json JSONB,
    is_correct BOOLEAN,
    marks_obtained DECIMAL(5, 2) DEFAULT 0,
    max_marks DECIMAL(5, 2) DEFAULT 1,
    is_flagged BOOLEAN DEFAULT FALSE,
    reviewer_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_assessment_responses_attempt_id 
    ON assessment_responses(attempt_id);
  CREATE INDEX IF NOT EXISTS idx_assessment_responses_candidate_id 
    ON assessment_responses(candidate_id);
  CREATE INDEX IF NOT EXISTS idx_assessment_responses_question_id 
    ON assessment_responses(question_id);

  -- Create assessment_question_images table for image management
  CREATE TABLE IF NOT EXISTS assessment_question_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id VARCHAR(50) NOT NULL,
    image_url TEXT NOT NULL,
    image_path VARCHAR(255),
    file_size INTEGER,
    mime_type VARCHAR(50),
    uploaded_by VARCHAR(255),
    image_title TEXT,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_assessment_question_images_question_id 
    ON assessment_question_images(question_id);

  -- Create assessment_settings table
  CREATE TABLE IF NOT EXISTS assessment_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_type VARCHAR(100) UNIQUE NOT NULL,
    duration_minutes INTEGER DEFAULT 120,
    total_questions INTEGER DEFAULT 60,
    total_marks DECIMAL(5, 2) DEFAULT 80,
    passing_marks DECIMAL(5, 2) DEFAULT 50,
    passing_percentage DECIMAL(5, 2) DEFAULT 62.5,
    description TEXT,
    max_attempts INTEGER DEFAULT 1,
    show_answers_after_submit BOOLEAN DEFAULT FALSE,
    shuffle_questions BOOLEAN DEFAULT FALSE,
    shuffle_options BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
  );

  -- Enable RLS on all tables
  ALTER TABLE assessment_candidates ENABLE ROW LEVEL SECURITY;
  ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE assessment_responses ENABLE ROW LEVEL SECURITY;
  ALTER TABLE assessment_question_images ENABLE ROW LEVEL SECURITY;
  ALTER TABLE assessment_settings ENABLE ROW LEVEL SECURITY;

  -- RLS Policies for service role (admin/full access)
  CREATE POLICY "service_role_access_candidates" ON assessment_candidates
    FOR ALL USING (true);
  
  CREATE POLICY "service_role_access_attempts" ON assessment_attempts
    FOR ALL USING (true);
  
  CREATE POLICY "service_role_access_responses" ON assessment_responses
    FOR ALL USING (true);
  
  CREATE POLICY "service_role_access_images" ON assessment_question_images
    FOR ALL USING (true);
  
  CREATE POLICY "service_role_access_settings" ON assessment_settings
    FOR ALL USING (true);
`;

async function main() {
  console.log('\n🚀 Assessment Database Setup - Direct PostgreSQL Connection');
  console.log('==========================================================\n');

  try {
    log.step('Connecting to Supabase PostgreSQL');
    await client.connect();
    log.success('Connected to database');

    log.step('Creating Assessment Tables');
    await client.query(createTablesSql);
    log.success('All assessment tables created successfully!');

    log.step('Inserting Default Assessment Settings');
    await client.query(`
      INSERT INTO assessment_settings 
        (exam_type, duration_minutes, total_questions, total_marks, passing_marks, passing_percentage, description, max_attempts)
      VALUES 
        ('Pain Medicine', 120, 60, 80, 50, 62.5, 'Comprehensive Pain Medicine Assessment - 60 questions, 120 minutes', 1)
      ON CONFLICT (exam_type) DO NOTHING;
    `);
    log.success('Default assessment settings inserted');

    log.step('Verifying Database Tables');
    const tables = [
      'assessment_candidates',
      'assessment_attempts',
      'assessment_responses',
      'assessment_question_images',
      'assessment_settings'
    ];

    for (const table of tables) {
      const result = await client.query(`SELECT COUNT(*) FROM ${table}`);
      log.success(`${table}: Ready (${result.rows[0].count} records)`);
    }

    console.log('\n✨ Assessment Database Setup Completed!\n');
    console.log('📋 Database Structure:');
    console.log('   ✓ assessment_candidates - Store candidate information');
    console.log('   ✓ assessment_attempts - Track exam attempts');
    console.log('   ✓ assessment_responses - Store candidate responses');
    console.log('   ✓ assessment_question_images - Manage question images');
    console.log('   ✓ assessment_settings - Configure exam parameters\n');

    console.log('🖼️  Image Upload Support:');
    console.log('   ✓ assessment_question_images table created for image management');
    console.log('   ✓ Ready to store image URLs, paths, and metadata');
    console.log('   ✓ Supports linking images to specific questions\n');

    console.log('🔧 Next Steps:');
    console.log('   1. Add candidates: http://localhost:3000/admin/assessment/candidates');
    console.log('   2. Upload images: Via API or storage bucket');
    console.log('   3. Configure exam: http://localhost:3000/admin/assessment/settings');
    console.log('   4. Start assessment: http://localhost:3000/assessment\n');

  } catch (error) {
    log.error(`Database setup failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  } finally {
    await client.end();
    log.info('Database connection closed');
  }
}

main();
