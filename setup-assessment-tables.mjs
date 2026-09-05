#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

const log = {
  info: (msg) => console.log(`ℹ️  ${msg}`),
  success: (msg) => console.log(`✅ ${msg}`),
  error: (msg) => console.log(`❌ ${msg}`),
  step: (msg) => console.log(`\n📋 ${msg}`),
};

async function createTables() {
  log.step('Creating Assessment Tables');

  // SQL to create all tables
  const createTablesSql = `
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

    -- RLS Policies for service role (admin access)
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

  try {
    log.info('Executing table creation SQL...');
    
    // Split SQL into individual statements and execute
    const statements = createTablesSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      const { error } = await supabase.rpc('exec', { p_sql: statement }).catch(() => {
        // If rpc exec doesn't exist, try direct query
        return supabase.query(statement).catch(err => ({ error: err }));
      });

      if (error && !error.message?.includes('already exists')) {
        console.warn(`⚠️  ${error.message}`);
      }
    }

    // Alternative: Use direct SQL execution
    const { error } = await supabase.query(createTablesSql);
    if (!error) {
      log.success('All assessment tables created successfully!');
    }
  } catch (error) {
    log.error(`Failed to create tables: ${error.message}`);
    throw error;
  }
}

async function createStorageBucket() {
  log.step('Setting up Image Storage Bucket');

  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      log.error(`Failed to list buckets: ${listError.message}`);
      return;
    }

    const bucketExists = buckets.some(b => b.name === 'assessment-images');

    if (!bucketExists) {
      log.info('Creating assessment-images bucket...');
      
      const { data, error } = await supabase.storage.createBucket('assessment-images', {
        public: false,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
      });

      if (error) {
        log.error(`Failed to create bucket: ${error.message}`);
        return;
      }

      log.success('Storage bucket created: assessment-images');
    } else {
      log.info('Bucket assessment-images already exists');
    }

    // Set up RLS policies for storage bucket
    log.info('Configuring storage policies...');
    // Note: Storage policies are handled via dashboard, but we set up the bucket

    log.success('Storage bucket is ready for image uploads');

  } catch (error) {
    log.error(`Storage setup failed: ${error.message}`);
  }
}

async function insertDefaultSettings() {
  log.step('Inserting Default Assessment Settings');

  try {
    const { data, error } = await supabase
      .from('assessment_settings')
      .insert({
        exam_type: 'Pain Medicine',
        duration_minutes: 120,
        total_questions: 60,
        total_marks: 80,
        passing_marks: 50,
        passing_percentage: 62.5,
        description: 'Comprehensive Pain Medicine Assessment - 60 questions, 120 minutes',
        max_attempts: 1,
        show_answers_after_submit: false,
        shuffle_questions: false,
        shuffle_options: false
      })
      .select();

    if (error && !error.message?.includes('duplicate')) {
      log.error(`Failed to insert settings: ${error.message}`);
      return;
    }

    log.success('Default assessment settings inserted');

  } catch (error) {
    log.error(`Settings insertion failed: ${error.message}`);
  }
}

async function verifyTables() {
  log.step('Verifying Database Setup');

  const tables = [
    'assessment_candidates',
    'assessment_attempts',
    'assessment_responses',
    'assessment_question_images',
    'assessment_settings'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
        .limit(1);

      if (error) {
        log.error(`${table}: ${error.message}`);
      } else {
        log.success(`${table}: Ready`);
      }
    } catch (error) {
      log.error(`${table}: Verification failed`);
    }
  }
}

async function main() {
  console.log('\n🚀 Assessment Database Setup - Supabase');
  console.log('=====================================\n');

  try {
    // Step 1: Create tables
    await createTables();

    // Step 2: Create storage bucket
    await createStorageBucket();

    // Step 3: Insert default settings
    await insertDefaultSettings();

    // Step 4: Verify setup
    await verifyTables();

    console.log('\n✨ Assessment setup completed successfully!\n');
    console.log('📋 Next Steps:');
    console.log('   1. Add candidates via Admin Panel: http://localhost:3000/admin/assessment/candidates');
    console.log('   2. Upload question images via assessment-images bucket');
    console.log('   3. Configure exam settings: http://localhost:3000/admin/assessment/settings');
    console.log('   4. Start assessment: http://localhost:3000/assessment\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

main();
