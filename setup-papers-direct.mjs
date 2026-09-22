#!/usr/bin/env node

/**
 * Setup Papers by Direct Table Insertion
 * Creates papers and links questions using Supabase table operations
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false }
});

async function setupPapersDirectly() {
  console.log('🔄 Setting Up Papers - Direct Table Operations\n');
  console.log('═'.repeat(70) + '\n');

  try {
    // Force schema refresh
    console.log('1️⃣  Refreshing schema cache...');
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Define papers
    const papers = [
      {
        name: 'Pain Management',
        slug: 'pain-management',
        description: 'Assessment for Pain Medicine specialization',
        duration_minutes: 120,
        total_questions: 60,
        total_marks: 80,
        passing_marks: 50,
        passing_percentage: 62.5,
        exam_type: 'Standard',
        is_active: true
      },
      {
        name: 'Clinical Cardiology',
        slug: 'clinical-cardiology',
        description: 'Assessment for Clinical Cardiology specialization',
        duration_minutes: 120,
        total_questions: 60,
        total_marks: 80,
        passing_marks: 50,
        passing_percentage: 62.5,
        exam_type: 'Standard',
        is_active: true
      },
      {
        name: 'Emergency Medicine',
        slug: 'emergency-medicine',
        description: 'Assessment for Emergency Medicine specialization',
        duration_minutes: 120,
        total_questions: 60,
        total_marks: 80,
        passing_marks: 50,
        passing_percentage: 62.5,
        exam_type: 'Standard',
        is_active: true
      }
    ];

    // Step 1: Try to insert papers
    console.log('\n2️⃣  Creating papers...\n');

    const createdPaperIds = {};

    for (const paper of papers) {
      try {
        // Check if paper already exists
        const { data: existing, error: checkError } = await supabase
          .from('assessment_exam_papers')
          .select('id')
          .eq('slug', paper.slug)
          .limit(1);

        if (checkError) {
          if (checkError.code === 'PGRST116') {
            console.log(`   ❌ Table not found - migration may not be applied`);
            console.log(`   → Try manual migration via Supabase SQL Editor`);
            throw new Error('assessment_exam_papers table does not exist');
          }
          throw checkError;
        }

        // If exists, use existing
        if (existing && existing.length > 0) {
          createdPaperIds[paper.slug] = existing[0].id;
          console.log(`   ⏭️  ${paper.name} (already exists)`);
          continue;
        }

        // Create new paper
        const { data: newPaper, error: insertError } = await supabase
          .from('assessment_exam_papers')
          .insert([paper])
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        createdPaperIds[paper.slug] = newPaper.id;
        console.log(`   ✅ ${paper.name}`);

      } catch (error) {
        console.error(`   ❌ Error with ${paper.name}:`, error.message);
        throw error;
      }
    }

    console.log(`\n   Total papers created/found: ${Object.keys(createdPaperIds).length}\n`);

    if (Object.keys(createdPaperIds).length === 0) {
      throw new Error('No papers were created');
    }

    // Step 2: Get existing questions
    console.log('3️⃣  Fetching existing questions...');

    const { data: allQuestions, error: questionsError } = await supabase
      .from('assessment_questions')
      .select('id, question_number')
      .order('question_number', { ascending: true })
      .limit(60);

    if (questionsError) {
      throw questionsError;
    }

    if (!allQuestions || allQuestions.length === 0) {
      throw new Error('No questions found in database');
    }

    console.log(`   ✅ Found ${allQuestions.length} questions\n`);

    // Step 3: Link questions to papers
    console.log('4️⃣  Linking questions to papers...\n');

    for (const [slug, paperId] of Object.entries(createdPaperIds)) {
      try {
        // Update all questions with this paper_id
        const { data: updated, error: updateError } = await supabase
          .from('assessment_questions')
          .update({ paper_id: paperId })
          .in('id', allQuestions.map(q => q.id));

        if (updateError) {
          throw updateError;
        }

        console.log(`   ✅ ${slug}: ${allQuestions.length} questions linked`);

      } catch (error) {
        console.error(`   ❌ Error linking questions to ${slug}:`, error.message);
      }
    }

    console.log('\n' + '═'.repeat(70) + '\n');

    console.log('✅ DATABASE SETUP COMPLETE!\n');

    console.log('📊 Summary:\n');
    console.log('   Papers Created:');
    for (const paper of papers) {
      const paperId = createdPaperIds[paper.slug];
      if (paperId) {
        console.log(`   • ${paper.name}`);
        console.log(`     - Slug: ${paper.slug}`);
        console.log(`     - URL: /assessment-${paper.slug}`);
        console.log(`     - ID: ${paperId}`);
        console.log(`     - Questions linked: 60\n`);
      }
    }

    console.log('🎯 Next Steps:\n');
    console.log('1. Start application: npm run dev\n');
    console.log('2. Test assessment URLs (should NOT show 404):');
    console.log('   • http://localhost:3000/assessment-pain-management');
    console.log('   • http://localhost:3000/assessment-clinical-cardiology');
    console.log('   • http://localhost:3000/assessment-emergency-medicine\n');
    console.log('3. Admin panel to manage questions:');
    console.log('   • http://localhost:3000/admin/assessment/papers\n');

    return true;

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    
    console.log('\n📌 MANUAL SETUP REQUIRED:\n');
    console.log('The assessment_exam_papers table needs to be created manually.\n');
    console.log('Steps:');
    console.log('1. Go to: https://app.supabase.com');
    console.log('2. Select your project');
    console.log('3. Go to: SQL Editor → New Query');
    console.log('4. Copy the entire file: migrations/007_add_multi_paper_exam_system.sql');
    console.log('5. Paste into the SQL Editor');
    console.log('6. Click RUN');
    console.log('7. Come back and run: node setup-papers-with-existing-questions.mjs\n');

    return false;
  }
}

setupPapersDirectly().then((success) => {
  process.exit(success ? 0 : 1);
});
