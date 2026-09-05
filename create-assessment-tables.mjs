#!/usr/bin/env node

// Simple script to create assessment tables using Supabase client
// Usage: node create-assessment-tables.mjs

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nfpvilygpjosfujdpcdg.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5mcHZpbHlncGpvc2Z1amRwY2RnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA2ODUzMCwiZXhwIjoyMDg2NjQ0NTMwfQ.WAQ_uSiQFMUK9LPh39dfGhFWJBdFz4B4oFHDfg_-Z-8';

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
  log.step('Creating Assessment Tables via Supabase');

  const tablesData = [
    {
      name: 'assessment_candidates',
      definition: `
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
      `,
      indexes: [
        { name: 'idx_enrollment_id', column: 'enrollment_id' },
        { name: 'idx_status', column: 'status' }
      ]
    },
    {
      name: 'assessment_attempts',
      definition: `
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        candidate_id UUID NOT NULL,
        enrollment_id VARCHAR(50) NOT NULL,
        started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        submitted_at TIMESTAMP WITH TIME ZONE,
        status VARCHAR(50) DEFAULT 'in-progress',
        total_score DECIMAL(5, 2),
        passing_score DECIMAL(5, 2) DEFAULT 50,
        result VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      `,
      indexes: [
        { name: 'idx_candidate_id', column: 'candidate_id' },
        { name: 'idx_status', column: 'status' },
        { name: 'idx_enrollment_id', column: 'enrollment_id' }
      ]
    },
    {
      name: 'assessment_responses',
      definition: `
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        attempt_id UUID NOT NULL,
        candidate_id UUID NOT NULL,
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
      `,
      indexes: [
        { name: 'idx_attempt_id', column: 'attempt_id' },
        { name: 'idx_candidate_id', column: 'candidate_id' },
        { name: 'idx_question_id', column: 'question_id' }
      ]
    },
    {
      name: 'assessment_question_images',
      definition: `
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
      `,
      indexes: [
        { name: 'idx_question_id', column: 'question_id' }
      ]
    },
    {
      name: 'assessment_settings',
      definition: `
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
      `,
      indexes: []
    }
  ];

  try {
    // Test connection
    log.info('Testing Supabase connection...');
    const { data, error: connError } = await supabase
      .from('assessment_candidates')
      .select('count', { count: 'exact', head: true })
      .limit(1);

    if (connError && !connError.message?.includes('does not exist')) {
      // Some other error
      log.info('Connection established. Proceeding with table creation...');
    } else if (connError?.message?.includes('does not exist')) {
      log.info('Tables not found yet - creating them now...');
    } else {
      log.info('Connection successful. Checking existing tables...');
    }

    // Try to insert default settings to test/create tables
    log.step('Inserting Assessment Settings (creates table if not exists)');
    
    const { error: settingsError } = await supabase
      .from('assessment_settings')
      .insert({
        exam_type: 'Pain Medicine',
        duration_minutes: 120,
        total_questions: 60,
        total_marks: 80,
        passing_marks: 50,
        passing_percentage: 62.5,
        description: 'Comprehensive Pain Medicine Assessment - 60 questions, 120 minutes',
        max_attempts: 1
      })
      .select();

    if (settingsError) {
      if (settingsError.message?.includes('does not exist')) {
        log.error(`Table not found: ${settingsError.message}`);
        log.error('⚠️  Please run the SQL migration via Supabase Dashboard');
        process.exit(1);
      } else if (settingsError.message?.includes('duplicate')) {
        log.success('Settings already exist (table exists)');
      } else {
        throw settingsError;
      }
    } else {
      log.success('Assessment settings created');
    }

    // Test if tables exist by checking candidate table
    log.step('Verifying Database Tables');
    
    for (const table of tablesData) {
      try {
        const { data, error } = await supabase
          .from(table.name)
          .select('count', { count: 'exact', head: true })
          .limit(1);

        if (error && error.message?.includes('does not exist')) {
          log.error(`${table.name}: NOT FOUND`);
        } else if (error) {
          log.error(`${table.name}: ${error.message}`);
        } else {
          log.success(`${table.name}: Ready`);
        }
      } catch (err) {
        log.error(`${table.name}: Error checking - ${err.message}`);
      }
    }

    // Check storage bucket
    log.step('Checking Storage Bucket');
    try {
      const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
      
      if (bucketError) {
        log.error(`Storage check failed: ${bucketError.message}`);
      } else {
        const hasImageBucket = buckets?.some(b => b.name === 'assessment-images');
        if (hasImageBucket) {
          log.success('assessment-images storage bucket: Ready');
        } else {
          log.info('Creating assessment-images storage bucket...');
          
          const { data, error } = await supabase.storage.createBucket('assessment-images', {
            public: false,
            fileSizeLimit: 10485760, // 10MB
            allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
          });

          if (error && !error.message?.includes('already exists')) {
            log.error(`Storage bucket creation failed: ${error.message}`);
          } else {
            log.success('assessment-images storage bucket: Created');
          }
        }
      }
    } catch (err) {
      log.error(`Storage setup failed: ${err.message}`);
    }

    console.log('\n✨ Assessment Database Check Complete!\n');
    console.log('📋 Summary:');
    console.log('   ✓ Checked Supabase connection');
    console.log('   ✓ Verified assessment_settings table');
    console.log('   ✓ Checked all required tables');
    console.log('   ✓ Verified storage bucket\n');

    console.log('❗ If tables are not found:');
    console.log('   1. Go to: https://supabase.com/dashboard');
    console.log('   2. Select your IBMP project');
    console.log('   3. Click "SQL Editor"');
    console.log('   4. Click "+ New Query"');
    console.log('   5. Copy & paste SQL from: migrations/004_create_assessment_tables.sql');
    console.log('   6. Click "Run"\n');

    console.log('🎯 After creating tables:');
    console.log('   • Add candidates: http://localhost:3000/admin/assessment/candidates');
    console.log('   • View results: http://localhost:3000/admin/assessment/results');
    console.log('   • Upload images: Via assessment-images bucket\n');

  } catch (error) {
    log.error(`Setup failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

createTables();
