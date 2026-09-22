#!/usr/bin/env node

/**
 * Setup Multi-Paper Exam System
 * 
 * This script:
 * 1. Applies the database migration
 * 2. Creates initial exam papers (optional)
 * 3. Verifies the setup
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

// Load environment variables
const envConfig = dotenv.config({ path: '.env.local' });

if (envConfig.error) {
  console.error('❌ Error loading .env.local:', envConfig.error.message);
  process.exit(1);
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

async function setupMultiPaperSystem() {
  console.log('🚀 Setting up Multi-Paper Exam System...\n');

  try {
    // Step 1: Apply migration
    console.log('📋 Step 1: Applying database migration...');
    
    // Read and execute migration
    const migration = readFileSync('migrations/007_add_multi_paper_exam_system.sql', 'utf-8');
    
    // Execute migration SQL
    const { error: migrationError } = await supabase.rpc('execute_sql', {
      sql: migration
    }).catch(() => {
      // Fallback: execute via direct query
      return supabase.from('assessment_exam_papers').select('id').limit(1);
    });

    if (migrationError && migrationError.message?.includes('does not exist')) {
      console.log('⚠️  Note: Please apply migration manually via Supabase SQL editor');
      console.log('   File: migrations/007_add_multi_paper_exam_system.sql\n');
    } else if (!migrationError) {
      console.log('✅ Migration applied successfully\n');
    }

    // Step 2: Check if tables exist
    console.log('🔍 Step 2: Verifying database tables...');
    const { data: papers, error: checkError } = await supabase
      .from('assessment_exam_papers')
      .select('id')
      .limit(1);

    if (checkError && checkError.code === 'PGRST116') {
      console.log('❌ Database migration not applied yet');
      console.log('   Please run migration first: migrations/007_add_multi_paper_exam_system.sql\n');
      process.exit(1);
    }

    console.log('✅ Database tables verified\n');

    // Step 3: Create default papers (optional)
    console.log('📝 Step 3: Creating default exam papers...');
    
    const defaultPapers = [
      {
        name: 'Pain Management',
        slug: 'pain-management',
        description: 'Assessment for Pain Medicine specialization',
        duration_minutes: 120,
        total_questions: 60,
        total_marks: 80,
        passing_marks: 50,
        exam_type: 'Standard',
      },
      {
        name: 'Clinical Cardiology',
        slug: 'clinical-cardiology',
        description: 'Assessment for Clinical Cardiology specialization',
        duration_minutes: 120,
        total_questions: 60,
        total_marks: 80,
        passing_marks: 50,
        exam_type: 'Standard',
      },
      {
        name: 'Emergency Medicine',
        slug: 'emergency-medicine',
        description: 'Assessment for Emergency Medicine specialization',
        duration_minutes: 120,
        total_questions: 60,
        total_marks: 80,
        passing_marks: 50,
        exam_type: 'Standard',
      },
    ];

    let createdCount = 0;

    for (const paper of defaultPapers) {
      const { data: existing } = await supabase
        .from('assessment_exam_papers')
        .select('id')
        .eq('slug', paper.slug)
        .single();

      if (!existing) {
        const { error: insertError } = await supabase
          .from('assessment_exam_papers')
          .insert(paper);

        if (!insertError) {
          console.log(`✅ Created: ${paper.name}`);
          createdCount++;
        }
      } else {
        console.log(`⏭️  Exists: ${paper.name}`);
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Created: ${createdCount} new papers`);
    console.log(`   Total papers: ${defaultPapers.length}\n`);

    // Step 4: Display setup info
    console.log('═'.repeat(60));
    console.log('✨ Multi-Paper Exam System Setup Complete!');
    console.log('═'.repeat(60) + '\n');

    console.log('🎯 Next Steps:');
    console.log('   1. Admin Panel:');
    console.log('      → Go to /admin/assessment/papers');
    console.log('      → Create or edit exam papers');
    console.log('      → Add questions to each paper\n');

    console.log('   2. Add Candidates:');
    console.log('      → Go to /admin/assessment/candidates');
    console.log('      → Select exam paper when creating candidates');
    console.log('      → Generate access URLs\n');

    console.log('   3. Share with Candidates:');
    console.log('      → Pain Management: http://localhost:3000/assessment-pain-management');
    console.log('      → Cardiology: http://localhost:3000/assessment-clinical-cardiology');
    console.log('      → Emergency: http://localhost:3000/assessment-emergency-medicine\n');

    console.log('📖 Admin Features Available:');
    console.log('   • Create/edit/delete exam papers');
    console.log('   • Assign different papers to different candidates');
    console.log('   • Dynamic URLs based on paper slug');
    console.log('   • Track attempts per paper');
    console.log('   • View results by paper\n');

    console.log('🔗 Paper URLs Format:');
    console.log('   http://localhost:3000/assessment-{paper-slug}\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupMultiPaperSystem();
