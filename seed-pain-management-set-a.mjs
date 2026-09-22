#!/usr/bin/env node

import { readFileSync } from 'fs';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Pain Management Paper ID
const PAIN_MANAGEMENT_PAPER_ID = '06d68de1-1ae6-4cd9-b1c6-19243efb6eab';
const QUESTION_SET = 'Set A';

async function seedPainManagementQuestions() {
  try {
    console.log('📚 Starting Pain Management Set A questions seed...\n');

    // Read exam seed file
    const seedFile = readFileSync('public/exam.seed.json', 'utf-8');
    const seedData = JSON.parse(seedFile);

    if (!seedData.questions || !Array.isArray(seedData.questions)) {
      throw new Error('Invalid seed file format - missing questions array');
    }

    console.log(`✓ Loaded ${seedData.questions.length} questions from exam.seed.json\n`);

    // First, check if questions already exist for this paper
    const { data: existing, error: fetchError } = await supabase
      .from('assessment_questions')
      .select('id')
      .eq('paper_id', PAIN_MANAGEMENT_PAPER_ID);

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw new Error(`Failed to check existing questions: ${fetchError.message}`);
    }

    if (existing && existing.length > 0) {
      console.log(`⚠️  Found ${existing.length} existing questions for Pain Management paper.`);
      console.log('   Deleting old questions and re-seeding...\n');
      
      const { error: deleteError } = await supabase
        .from('assessment_questions')
        .delete()
        .eq('paper_id', PAIN_MANAGEMENT_PAPER_ID);
      
      if (deleteError) {
        throw new Error(`Failed to delete existing questions: ${deleteError.message}`);
      }
      console.log('✓ Deleted old questions\n');
    }

    // Transform questions for insertion
    const questionsToInsert = seedData.questions.map((q, idx) => {
      const qNumber = q.number || idx + 1;
      
      // Calculate marks based on question number
      let marks = 1;
      if (qNumber >= 1 && qNumber <= 40) {
        marks = 1;
      } else if (qNumber >= 41 && qNumber <= 50) {
        marks = 3;
      } else if (qNumber >= 51 && qNumber <= 60) {
        marks = 1;
      }

      // Handle different question types
      const type = q.type === 'image' ? 'image_based' : q.type || 'mcq';
      
      // For image-based questions, use asset path
      let imageUrl = null;
      if (type === 'image_based' && q.asset?.file) {
        imageUrl = `/quiz-assets/${q.asset.file}`;
      }

      // For MCQ questions, store options as JSON string
      let options = null;
      let correctAnswer = null;
      
      if (type === 'mcq' && q.options && Array.isArray(q.options)) {
        // Store full option objects for display
        options = JSON.stringify(q.options);
        
        // Get correct answer letter (A, B, C, D)
        if (q.scoring?.correctOptionId) {
          const correctIdx = q.options.findIndex(opt => opt.id === q.scoring.correctOptionId);
          if (correctIdx !== -1) {
            correctAnswer = String.fromCharCode(65 + correctIdx); // A, B, C, D
          }
        }
      }

      // For short answer/image questions, use explanation as guidance
      if (type !== 'mcq' && q.scoring?.explanation) {
        correctAnswer = q.scoring.explanation;
      }

      return {
        paper_id: PAIN_MANAGEMENT_PAPER_ID,
        question_number: q.id || `Q${String(idx + 1).padStart(2, '0')}`,
        type: type,
        stem: q.stem || '',
        marks: marks,
        options: options,
        correct_answer: correctAnswer,
        image_url: imageUrl,
        sort_order: idx,
        is_active: true,
      };
    });

    console.log(`🔄 Inserting ${questionsToInsert.length} questions for Pain Management - Set A...\n`);

    // Insert in batches to avoid timeout
    const batchSize = 10;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < questionsToInsert.length; i += batchSize) {
      const batch = questionsToInsert.slice(i, i + batchSize);
      
      const { data: insertedQuestions, error: insertError } = await supabase
        .from('assessment_questions')
        .insert(batch)
        .select();

      if (insertError) {
        console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} failed:`, insertError.message);
        errorCount += batch.length;
      } else {
        successCount += insertedQuestions.length;
        console.log(`✓ Batch ${Math.floor(i / batchSize) + 1}: ${insertedQuestions.length} questions inserted`);
      }
    }

    console.log('\n📊 Database Seed Summary:');
    console.log(`   ✓ Paper: Pain Management (${PAIN_MANAGEMENT_PAPER_ID})`);
    console.log(`   ✓ Total questions seeded: ${successCount}`);
    
    // Count question types
    const mcqCount = questionsToInsert.filter(q => q.type === 'mcq').length;
    const imageCount = questionsToInsert.filter(q => q.type === 'image_based').length;
    const shortCount = questionsToInsert.filter(q => q.type === 'short_answer').length;
    
    console.log(`   ✓ MCQ Questions: ${mcqCount}`);
    console.log(`   ✓ Image-Based Questions: ${imageCount}`);
    console.log(`   ✓ Short Answer Questions: ${shortCount}`);
    
    // Distribution by marks
    const marks1 = questionsToInsert.filter(q => q.marks === 1).length;
    const marks3 = questionsToInsert.filter(q => q.marks === 3).length;
    
    console.log(`   ✓ 1-Mark Questions: ${marks1} (Q1-Q40, Q51-Q60)`);
    console.log(`   ✓ 3-Mark Questions: ${marks3} (Q41-Q50)`);
    console.log(`   ✓ Total Marks: ${questionsToInsert.reduce((sum, q) => sum + q.marks, 0)}`);
    
    if (errorCount > 0) {
      console.log(`\n⚠️  Failed to insert: ${errorCount} questions`);
      process.exit(1);
    } else {
      console.log('\n✨ Seeding complete! All questions are now available in the admin panel.');
      console.log(`   Access them at: /admin/assessment/papers/${PAIN_MANAGEMENT_PAPER_ID}/questions\n`);
    }
    
  } catch (error) {
    console.error('❌ Error seeding questions:', error.message);
    process.exit(1);
  }
}

seedPainManagementQuestions();
