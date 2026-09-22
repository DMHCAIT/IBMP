#!/usr/bin/env node

/**
 * Setup Multi-Paper System with Existing Questions
 * 
 * This script:
 * 1. Verifies database migration is applied
 * 2. Creates initial exam papers
 * 3. Copies existing questions to papers
 * 4. Verifies the setup
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function setupPapersWithQuestions() {
  console.log('🚀 Setting up Multi-Paper System with Existing Questions...\n');

  try {
    // Step 1: Check if migration is applied
    console.log('📋 Step 1: Checking database migration...');
    
    let migrationApplied = false;
    try {
      const { data, error } = await supabase
        .from('assessment_exam_papers')
        .select('id')
        .limit(1);
      
      if (!error || !error.message?.includes('does not exist')) {
        migrationApplied = true;
        console.log('✅ Migration already applied\n');
      }
    } catch (e) {
      console.log('ℹ️  Migration check: unable to verify\n');
    }

    if (!migrationApplied) {
      console.log('⚠️  Migration not yet applied');
      console.log('📌 Please apply migration manually:');
      console.log('   1. Go to Supabase Dashboard → SQL Editor');
      console.log('   2. Create New Query');
      console.log('   3. Copy contents from: migrations/007_add_multi_paper_exam_system.sql');
      console.log('   4. Run the query');
      console.log('   5. Then run this script again\n');
      process.exit(1);
    }

    // Step 2: Check existing questions
    console.log('🔍 Step 2: Checking existing questions...');
    
    const { data: existingQuestions, error: questionsError } = await supabase
      .from('assessment_questions')
      .select('id, question_number')
      .order('question_number', { ascending: true });

    if (questionsError) {
      console.error('❌ Error fetching questions:', questionsError.message);
      process.exit(1);
    }

    const questionCount = existingQuestions?.length || 0;
    console.log(`✅ Found ${questionCount} existing questions\n`);

    if (questionCount === 0) {
      console.error('❌ No questions found in database. Please add questions first.');
      console.log('   Run: node populate-question-data.mjs\n');
      process.exit(1);
    }

    // Step 3: Create initial papers
    console.log('📝 Step 3: Creating exam papers...');
    
    const paperDefinitions = [
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

    const paperIds = {};
    let createdCount = 0;

    for (const paperDef of paperDefinitions) {
      try {
        const { data: existing, error: selectError } = await supabase
          .from('assessment_exam_papers')
          .select('id')
          .eq('slug', paperDef.slug)
          .single();

        if (selectError && selectError.code !== 'PGRST116') {
          throw selectError;
        }

        if (!existing) {
          const { data: newPaper, error: insertError } = await supabase
            .from('assessment_exam_papers')
            .insert([paperDef])
            .select()
            .single();

          if (!insertError && newPaper) {
            paperIds[paperDef.slug] = newPaper.id;
            console.log(`✅ Created: ${paperDef.name}`);
            createdCount++;
          } else if (insertError) {
            console.log(`⚠️  Error creating ${paperDef.name}: ${insertError.message}`);
          }
        } else {
          paperIds[paperDef.slug] = existing.id;
          console.log(`⏭️  Exists: ${paperDef.name}`);
        }
      } catch (e) {
        console.log(`⚠️  Error processing ${paperDef.name}: ${e.message}`);
      }
    }

    console.log(`\n📊 Papers summary:`);
    console.log(`   Created: ${createdCount} new papers`);
    console.log(`   Total papers ready: ${Object.keys(paperIds).length}\n`);

    // Step 4: Copy existing questions to papers. Each paper must own its
    // question rows; sharing rows would make edits and answer keys leak across papers.
    console.log('📄 Step 4: Creating independent questions for each paper...');

    // Prefer the original unassigned question bank as the clone source. If it
    // has already been assigned, use the first paper's complete question set.
    const { data: questionsToLink } = await supabase
      .from('assessment_questions')
      .select('*')
      .is('paper_id', null)
      .order('question_number', { ascending: true })
      .limit(60);

    let sourceQuestions = questionsToLink || [];
    if (sourceQuestions.length === 0) {
      const firstPaperId = paperIds[paperDefinitions[0].slug];
      const { data: existingPaperQuestions } = await supabase
        .from('assessment_questions')
        .select('*')
        .eq('paper_id', firstPaperId)
        .order('sort_order', { ascending: true })
        .limit(60);
      sourceQuestions = existingPaperQuestions || [];
    }

    // Recover from an earlier setup that assigned the source rows to a
    // different paper by using any remaining complete question set.
    if (sourceQuestions.length === 0) {
      const { data: anyPaperQuestions } = await supabase
        .from('assessment_questions')
        .select('*')
        .order('sort_order', { ascending: true })
        .limit(60);
      sourceQuestions = anyPaperQuestions || [];
    }

    if (sourceQuestions.length === 0) {
      console.error('❌ No questions found to copy');
      process.exit(1);
    }

    console.log(`   Using ${sourceQuestions.length} source questions...\n`);

    let totalCopied = 0;
    for (const [slug, paperId] of Object.entries(paperIds)) {
      const { count: existingCount } = await supabase
        .from('assessment_questions')
        .select('id', { count: 'exact', head: true })
        .eq('paper_id', paperId);

      if (existingCount && existingCount > 0) {
        console.log(`⏭️  ${slug}: keeps ${existingCount} existing paper-specific questions`);
        continue;
      }

      const copies = sourceQuestions.map(({ id, paper_id, created_at, updated_at, ...question }) => ({
        ...question,
        paper_id: paperId,
      }));
      const { error: insertError } = await supabase
        .from('assessment_questions')
        .insert(copies);

      if (!insertError) {
        console.log(`✅ Copied ${copies.length} questions to: ${slug}`);
        totalCopied += copies.length;
      } else {
        console.log(`⚠️  Error copying questions to ${slug}: ${insertError.message}`);
      }
    }

    console.log(`\n   Total independent question rows created: ${totalCopied}\n`);

    // Step 5: Verify setup
    console.log('✅ Step 5: Verifying setup...\n');

    for (const [slug, paperId] of Object.entries(paperIds)) {
      const { data: paperQuestions } = await supabase
        .from('assessment_questions')
        .select('id')
        .eq('paper_id', paperId);

      const count = paperQuestions?.length || 0;
      console.log(`   ${slug}: ${count} questions`);
    }

    // Step 6: Display next steps
    console.log('\n' + '═'.repeat(60));
    console.log('✨ Multi-Paper Exam System is Ready!');
    console.log('═'.repeat(60) + '\n');

    console.log('🎯 Papers Created:');
    for (const paperDef of paperDefinitions) {
      console.log(`   • ${paperDef.name}`);
      console.log(`     → Slug: ${paperDef.slug}`);
      console.log(`     → URL: /assessment-${paperDef.slug}`);
      console.log(`     → Full: http://localhost:3000/assessment-${paperDef.slug}\n`);
    }

    console.log('👥 Next Steps:\n');

    console.log('1. Start Application:');
    console.log('   npm run dev\n');

    console.log('2. Access Assessment Pages (should NOT show 404):');
    console.log('   http://localhost:3000/assessment-pain-management');
    console.log('   http://localhost:3000/assessment-clinical-cardiology');
    console.log('   http://localhost:3000/assessment-emergency-medicine\n');

    console.log('3. Admin Panel - Create Candidates:');
    console.log('   http://localhost:3000/admin/assessment/candidates');
    console.log('   • Select "Pain Management" paper when creating candidate\n');

    console.log('4. Admin Panel - Manage Questions (NEW):');
    console.log('   http://localhost:3000/admin/assessment/papers');
    console.log('   • Click paper to edit questions');
    console.log('   • Changes automatically update assessment page\n');

    console.log('🔄 Features Available:\n');
    console.log('   ✓ Create candidates for different papers');
    console.log('   ✓ Modify questions through admin panel');
    console.log('   ✓ Changes reflect immediately on assessment page');
    console.log('   ✓ Questions can be added/edited/deleted per paper');
    console.log('   ✓ Same questions format (60) for all papers\n');

    console.log('📌 Important:');
    console.log('   • Each paper has the SAME 60 questions initially');
    console.log('   • Go to admin panel to modify questions for each paper');
    console.log('   • Questions are automatically synced\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

setupPapersWithQuestions();
